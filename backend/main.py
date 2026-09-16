from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any

import asyncio
from backend.config import settings
from backend.schemas.recommendation import (
    RecommendRequest,
    RecommendResponse,
    RecommendFromMapRequest,
    RecommendFromMapResponse,
    PredictRequest,
    PredictResponse,
    CropRecommendationOut,
)
from backend.services.open_meteo_service import open_meteo_service
from backend.services.soilgrids_service import soilgrids_service
from backend.services.geo_ingestion import geo_ingestion_service
from backend.services.gemini_advisory import gemini_advisory_service
from backend.services.supabase_service import supabase_service
from ml.model_engine import score_crop_suitability
from ml.shap_explainer import compute_shap_breakdown
from ml.constraint_engine import apply_farming_constraints
from ml.predictor import crop_predictor
from backend.schemas.field_health import FieldHealthRequest, FieldHealthResponse, GeoJSONPolygon
from backend.services.sentinel_hub_service import sentinel_hub_service

app = FastAPI(
    title=settings.APP_NAME,
    description="Explainable, constraint-aware precision crop recommendation API for Agriculture 4.0",
    version="1.0.0"
)

# Enable CORS for Next.js / React client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["Health"])
async def health_check() -> Dict[str, Any]:
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "gemini_configured": bool(settings.GEMINI_API_KEY),
        "supabase_configured": bool(settings.SUPABASE_URL),
    }

@app.get("/api/v1/weather", tags=["Telemetry"])
async def get_weather(lat: float = Query(16.8524), lon: float = Query(74.5815)) -> Dict[str, Any]:
    return await open_meteo_service.get_weather(lat, lon)

@app.get("/api/v1/soil", tags=["Telemetry"])
async def get_soil(lat: float = Query(16.8524), lon: float = Query(74.5815)) -> Dict[str, Any]:
    return await soilgrids_service.get_soil_properties(lat, lon)

@app.post("/api/v1/recommend", response_model=RecommendResponse, tags=["Inference"])
async def recommend_crops(payload: RecommendRequest) -> RecommendResponse:
    """
    End-to-End Precision Recommendation Pipeline:
    1. Ingest real-time climate telemetry from Open-Meteo.
    2. Run supervised Gaussian centroid ensemble across 22 cultivars (predict_proba).
    3. Decompose decision into SHAP feature importance attribution vectors for #1 crop.
    4. Apply dynamic constraint engine (water limits & budget penalties).
    5. Generate plain-language farmer advisory via Google Gemini.
    6. Persist run to Supabase PostgreSQL (if configured).
    """
    try:
        # 1. Fetch live meteorological context
        weather = await open_meteo_service.get_weather(payload.lat, payload.lon)
        temp = weather.get("temperature", 28.0)
        humidity = weather.get("humidity", 72.0)
        rainfall = weather.get("annualizedRainfallEst", 820.0)

        # 2. Score cultivars via ML ensemble
        raw_scored = score_crop_suitability(
            n=payload.n,
            p=payload.p,
            k=payload.k,
            ph=payload.ph,
            temp=temp,
            humidity=humidity,
            rainfall=rainfall
        )

        # 3. Apply Constraint Engine
        constraint_adjusted = apply_farming_constraints(
            evaluated_crops=raw_scored,
            water_availability=payload.water_availability,
            budget_limit=payload.budget_limit
        )

        top3 = constraint_adjusted[:3]
        primary_crop = top3[0]

        # 4. Compute SHAP feature importance vectors
        shap_breakdown = compute_shap_breakdown(
            n=payload.n,
            p=payload.p,
            k=payload.k,
            ph=payload.ph,
            temp=temp,
            rainfall=rainfall,
            primary_crop=primary_crop
        )

        # 5. Synthesize plain-language Gemini advisory
        advisory = await gemini_advisory_service.generate_advisory(
            top_crop=primary_crop,
            shap_factors=shap_breakdown,
            soil={"n": payload.n, "p": payload.p, "k": payload.k, "ph": payload.ph},
            weather=weather,
            constraints={
                "water_availability": payload.water_availability,
                "budget_limit": payload.budget_limit
            }
        )

        # 6. Log to Supabase in background
        await supabase_service.log_recommendation(
            field_id=payload.field_id,
            water_availability=payload.water_availability,
            budget_limit=payload.budget_limit,
            top_crops=top3,
            shap_factors=shap_breakdown,
            advisory=advisory
        )

        # Format output
        top3_out = [CropRecommendationOut(**crop) for crop in top3]
        all_out = [CropRecommendationOut(**crop) for crop in constraint_adjusted]

        return RecommendResponse(
            success=True,
            top3=top3_out,
            all_evaluated=all_out,
            primary_shap=shap_breakdown,
            advisory=advisory,
            weather_context=weather
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation engine error: {str(e)}")

@app.post("/api/v1/recommend_from_map", response_model=RecommendFromMapResponse, tags=["GIS Ingestion"])
async def recommend_from_map(payload: RecommendFromMapRequest) -> RecommendFromMapResponse:
    """
    Map Area Selection & Soil-Climate Ingestion Pipeline:
    1. Triggers parallel async calls to ISRIC SoilGrids REST and Open-Meteo API.
    2. Reconciles baseline N, P, K, pH and ambient climate (temp, humidity, rain).
    3. Assembles 7-feature input vector: [N, P, K, pH, Temperature, Humidity, Rainfall].
    4. Evaluates supervised Gaussian centroid ensemble across 22 crops.
    5. Applies farming constraints (water availability, budget limits).
    6. Sorts probabilities to extract Top-3 recommended crops.
    7. Computes SHAP feature importance breakdown on #1 ranked crop.
    8. Synthesizes concise farmer advisory via Google Gemini API.
    9. Persists telemetry run to Supabase PostgreSQL (if configured).
    """
    try:
        # 1. Parallel async ingestion from ISRIC SoilGrids and Open-Meteo
        soil_task = geo_ingestion_service.get_soil_data(payload.lat, payload.lon)
        weather_task = geo_ingestion_service.get_weather_data(payload.lat, payload.lon)
        soil_res, weather_res = await asyncio.gather(soil_task, weather_task)

        n = float(soil_res.get("nitrogen", 82.0))
        p = float(soil_res.get("phosphorus", 48.0))
        k = float(soil_res.get("potassium", 41.0))
        ph = float(soil_res.get("ph", 6.8))

        temp = float(weather_res.get("temperature", 28.4))
        humidity = float(weather_res.get("humidity", 73.0))
        rainfall = float(weather_res.get("annualizedRainfallEst", 812.0))

        # 2. Score cultivars via ML ensemble with 7-feature vector
        raw_scored = score_crop_suitability(
            n=n, p=p, k=k, ph=ph,
            temp=temp, humidity=humidity, rainfall=rainfall
        )

        # 3. Apply Constraint Engine
        water_avail = payload.water_availability or "Plentiful"
        budget_limit = payload.budget_limit or "Moderate"
        constraint_adjusted = apply_farming_constraints(
            evaluated_crops=raw_scored,
            water_availability=water_avail,
            budget_limit=budget_limit
        )

        top3 = constraint_adjusted[:3]
        primary_crop = top3[0]

        # 4. Compute SHAP local feature importance breakdown
        shap_breakdown = compute_shap_breakdown(
            n=n, p=p, k=k, ph=ph,
            temp=temp, rainfall=rainfall,
            primary_crop=primary_crop
        )

        # 5. Synthesize concise Gemini AI farmer advisory
        advisory = await gemini_advisory_service.generate_advisory(
            top_crop=primary_crop,
            shap_factors=shap_breakdown,
            soil={"n": n, "p": p, "k": k, "ph": ph, "texture": soil_res.get("soilTexture", "Loam")},
            weather=weather_res,
            constraints={
                "water_availability": water_avail,
                "budget_limit": budget_limit
            }
        )

        # 6. Log to Supabase in background
        await supabase_service.log_recommendation(
            field_id=payload.field_id,
            water_availability=water_avail,
            budget_limit=budget_limit,
            top_crops=top3,
            shap_factors=shap_breakdown,
            advisory=advisory
        )

        top3_out = [CropRecommendationOut(**crop) for crop in top3]
        all_out = [CropRecommendationOut(**crop) for crop in constraint_adjusted]

        return RecommendFromMapResponse(
            success=True,
            coordinates={"lat": payload.lat, "lon": payload.lon},
            soil=soil_res,
            weather=weather_res,
            top3=top3_out,
            all_evaluated=all_out,
            primary_shap=shap_breakdown,
            advisory=advisory
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"GIS Map recommendation engine error: {str(e)}")

@app.post("/api/v1/predict", response_model=PredictResponse, tags=["ML Inference"])
async def predict_crops(payload: PredictRequest) -> PredictResponse:
    """
    Standard Kaggle Crop Recommendation Inference Endpoint:
    Accepts 7 numerical features (N, P, K, ph, temperature, humidity, rainfall).
    Returns Top-3 ranked recommendations with suitability scores and local SHAP feature importance.
    """
    try:
        result = crop_predictor.predict(
            n=payload.N,
            p=payload.P,
            k=payload.K,
            ph=payload.ph,
            temperature=payload.temperature,
            humidity=payload.humidity,
            rainfall=payload.rainfall
        )
        return PredictResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@app.post("/api/v1/field_health", response_model=FieldHealthResponse, tags=["Remote Sensing"])
async def get_field_health(payload: FieldHealthRequest) -> FieldHealthResponse:
    """
    Satellite Field Health Ingestion Endpoint (Sentinel-2 L2A / Sentinel Hub Statistical API):
    1. Ingests GeoJSON Polygon boundary, start_date, and end_date.
    2. Applies Scene Classification Layer (SCL) cloud-masking.
    3. Calculates NDVI time-series: (B08 - B04) / (B08 + B04).
    4. Computes mean_ndvi, min_ndvi, max_ndvi, and std_dev.
    5. Classifies Vegetation Health:
       - NDVI < 0.2: Bare Soil / Water
       - 0.2 <= NDVI < 0.5: Low / Stressed Vegetation
       - 0.5 <= NDVI < 0.7: Moderate Health
       - NDVI >= 0.7: Dense / Healthy Crop Canopy
    6. Generates raster overlay data for False-Color Infrared and NDVI Heatmap.
    """
    try:
        return await sentinel_hub_service.get_field_health(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Satellite Field Health analysis failed: {str(e)}")

@app.get("/api/v1/field_health/demo_field", response_model=FieldHealthResponse, tags=["Remote Sensing"])
async def get_demo_field_health() -> FieldHealthResponse:
    """Convenience endpoint returning a reference agricultural parcel for instantaneous evaluation."""
    demo_poly = GeoJSONPolygon(
        type="Polygon",
        coordinates=[[
            [74.5802, 16.8510],
            [74.5848, 16.8510],
            [74.5848, 16.8552],
            [74.5802, 16.8552],
            [74.5802, 16.8510]
        ]]
    )
    req = FieldHealthRequest(geojson=demo_poly)
    return await sentinel_hub_service.get_field_health(req)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.FASTAPI_HOST, port=settings.FASTAPI_PORT, reload=True)


