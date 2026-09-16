# AdaptiveCrop AI (AgroXAI): Line-by-Line Code Walkthrough Document

This document provides a comprehensive, line-by-line architectural and code-level walkthrough of the **AdaptiveCrop AI (AgroXAI)** codebase. Every module, function, and API pipeline is detailed to explain how the system ingests geospatial data, executes machine learning inference, applies agronomic guardrails, decomposes decisions using Explainable AI (SHAP), synthesizes generative advisories, and renders interactive remote sensing dashboards.

---

## Table of Contents
1. [Backend Gateway & Microservice Routing (`backend/main.py`)](#1-backend-gateway--microservice-routing-backendmainpy)
2. [GIS Telemetry Ingestion Services (`soilgrids_service.py` & `open_meteo_service.py`)](#2-gis-telemetry-ingestion-services)
3. [Agronomic Suitability Engine (`ml/model_engine.py`)](#3-agronomic-suitability-engine-mlmodel_enginepy)
4. [Real-World Constraint Guardrail Engine (`ml/constraint_engine.py`)](#4-real-world-constraint-guardrail-engine-mlconstraint_enginepy)
5. [Explainable AI (XAI) SHAP Attribution (`ml/shap_explainer.py`)](#5-explainable-ai-xai-shap-attribution-mlshap_explainerpy)
6. [Generative AI Farmer Advisory (`backend/services/gemini_advisory.py`)](#6-generative-ai-farmer-advisory-backendservicesgemini_advisorypy)
7. [Machine Learning Inference & Training Pipeline (`ml/predictor.py` & `ml/train.py`)](#7-machine-learning-inference--training-pipeline)
8. [Model Context Protocol (MCP) Server (`agroxai_mcp.py`)](#8-model-context-protocol-mcp-server-agroxai_mcppy)
9. [Copernicus Sentinel-2 Remote Sensing UI Components (`FieldHealthCard.tsx` & `SatelliteHealthMap.tsx`)](#9-copernicus-sentinel-2-remote-sensing-ui-components)

---

## 1. Backend Gateway & Microservice Routing (`backend/main.py`)

The file `backend/main.py` serves as the central FastAPI entry point, orchestrating asynchronous requests across GIS telemetry sources, machine learning engines, SHAP explainers, Gemini generative advisories, and Supabase database logging.

### Line-by-Line Code & Function Breakdown

* **App Initialization & CORS Configuration** (`lines 1–25`):
  * Imports FastAPI, middleware, typing protocols, service classes, and Pydantic schemas.
  * `app = FastAPI(title=settings.APP_NAME, description=..., version="1.0.0")`: Instantiates the main application gateway.
  * `app.add_middleware(CORSMiddleware, ...)`: Configures Cross-Origin Resource Sharing allowing Next.js/React frontend clients on any origin to connect.

* **Health Endpoint (`@app.get("/health")`)**:
  * Returns operational status (`"healthy"`), confirming whether Gemini API keys and Supabase database URLs are properly configured.

* **Telemetry Proxies (`/api/v1/weather` & `/api/v1/soil`)**:
  * `@app.get("/api/v1/weather")`: Delegates latitude/longitude queries to `open_meteo_service.get_weather(lat, lon)`.
  * `@app.get("/api/v1/soil")`: Delegates coordinate queries to `soilgrids_service.get_soil_properties(lat, lon)`.

* **End-to-End Recommendation Pipeline (`@app.post("/api/v1/recommend")`)**:
  1. **Climate Fetch**: Asynchronously retrieves live temperature, humidity, and 16-day projected rainfall from Open-Meteo.
  2. **Ensemble Suitability Scoring**: Passes soil parameters ($N, P, K, pH$) and climate values into `score_crop_suitability()`.
  3. **Constraint Adjustments**: Applies farmer resource limits (water availability and budget ceilings) via `apply_farming_constraints()`.
  4. **SHAP Decomposition**: Computes local feature attribution vectors for the primary (#1) recommended crop via `compute_shap_breakdown()`.
  5. **Gemini Advisory Synthesis**: Invokes `gemini_advisory_service.generate_advisory()` to build plain-language fertilizer and irrigation guidance.
  6. **Supabase Audit Logging**: Asynchronously logs the execution run, soil inputs, and advisory response to Supabase PostgreSQL.

* **Map Area Selection Pipeline (`@app.post("/api/v1/recommend_from_map")`)**:
  * Uses `asyncio.gather(soil_task, weather_task)` to trigger parallel asynchronous API calls to ISRIC SoilGrids REST and Open-Meteo.
  * Reconciles raw soil pH ($pH / 10.0$), organic carbon, and baseline nutrients with live meteorological data into a unified 7-feature input vector: $[N, P, K, pH, 	ext{Temperature}, 	ext{Humidity}, 	ext{Rainfall}]$.
  * Evaluates crops, applies constraint penalties, extracts SHAP attributions, generates the Gemini advisory, and logs the transaction.

* **Kaggle Inference Endpoint (`@app.post("/api/v1/predict")`)**:
  * Accepts standard 7-feature numerical requests ($N, P, K, pH, 	ext{temp}, 	ext{humidity}, 	ext{rainfall}$) and delegates execution to `crop_predictor.predict()`.

* **Sentinel-2 Remote Sensing Endpoint (`@app.post("/api/v1/field_health")`)**:
  * Ingests a GeoJSON polygon boundary, applies Scene Classification Layer (SCL) cloud-masking, computes NDVI time-series $(B08 - B04) / (B08 + B04)$, and classifies crop canopy health into 4 vegetation tiers.

---

## 2. GIS Telemetry Ingestion Services

### A. Digital Soil Mapping (`backend/services/soilgrids_service.py`)
* **Class `SoilGridsService`**:
  * `get_soil_properties(lat, lon)`: Queries the ISRIC SoilGrids 2.0 REST API for soil properties at `0-30cm` depth.
  * **Unit Conversions**:
    * `ph = round(raw_ph / 10.0, 1)`: Converts ISRIC deci-units (e.g. `68`) to standard logarithmic pH (`6.8`).
    * `soc = round(raw_soc / 100.0, 1)`: Converts organic carbon decigrams/kg to percentage.
    * `clay = round(raw_clay / 10.0, 1)`: Converts clay content to percentage.
  * **Soil Classification**: Classifies soil as `"Deep Black Soil (Vertisol)"` if clay percentage $> 40\%$; otherwise assigns `"Alluvial Loam (Inceptisol)"`.
  * **Fallback Logic**: Provides deterministic regional soil baselines if the remote SoilGrids REST API is unreachable.

### B. Meteorological Forecast Streaming (`backend/services/open_meteo_service.py`)
* **Class `OpenMeteoService`**:
  * `get_weather(lat, lon)`: Issues a REST GET request to Open-Meteo fetching current $2	ext{m}$ temperature, relative humidity, precipitation, and 16-day daily forecast sums.
  * `annualizedRainfallEst = round(forecast_16d * 22 + 400)`: Estimates annual precipitation based on 16-day forecast trends.
  * **Fallback Logic**: Returns a simulated meteorological profile ($28.5^\circ	ext{C}, 72\%	ext{ humidity}, 840	ext{mm rainfall}$) if the weather service encounters network timeouts.

---

## 3. Agronomic Suitability Engine (`ml/model_engine.py`)

The file `ml/model_engine.py` manages agronomic centroid profiles for 22 commercial cultivars and calculates baseline suitability scores.

### Key Components & Code Logic
* **`CROP_PROFILES` Dictionary**:
  * Stores biological target envelopes for 22 crops (e.g., Rice, Sugarcane, Coffee, Maize, Cotton, Chickpea, Pigeonpea).
  * Defines ideal parameters: `idealN`, `idealP`, `idealK`, `idealPh`, `idealTemp`, `idealRainfall`, `idealHumidity`, `waterRequirement`, `budgetRequirement`, `seasons`, `expectedYield`, and `profitabilityIndex`.

* **Function `score_crop_suitability(n, p, k, ph, temp, humidity, rainfall)`**:
  * Iterates over all 22 crop profiles and computes normalized quadratic deviations:
    $$	ext{dist\_n} = \left(rac{N - 	ext{idealN}}{60.0}ight)^2, \quad 	ext{dist\_ph} = \left(rac{pH - 	ext{idealPh}}{1.5}ight)^2, \quad 	ext{dist\_rain} = \left(rac{	ext{Rain} - 	ext{idealRain}}{450.0}ight)^2$$
  * Calculates a weighted agronomic distance metric:
    $$	ext{total\_dist} = 0.18 \cdot 	ext{dist\_n} + 0.14 \cdot 	ext{dist\_p} + 0.14 \cdot 	ext{dist\_k} + 0.18 \cdot 	ext{dist\_ph} + 0.12 \cdot 	ext{dist\_temp} + 0.16 \cdot 	ext{dist\_rain} + 0.08 \cdot 	ext{dist\_hum}$$
  * Applies exponential decay scaling:
    $$	ext{suitability\_score} = \exp\left(-rac{	ext{total\_dist}}{1.8}ight) 	imes 100.0$$
  * Clamps scores between 12.0% and 99.4%, sorts recommendations in descending order, and attaches rank numbers.

---

## 4. Real-World Constraint Guardrail Engine (`ml/constraint_engine.py`)

The file `ml/constraint_engine.py` adjusts raw ML suitability scores to account for real-world farmer resource limitations.

### Guardrail Logic & Penalty Functions (`apply_farming_constraints`)

1. **Water Scarcity Guardrail**:
   * Evaluates input `water_availability` (`"Low"`, `"Moderate"`, `"High"`):
     * If `water_availability == "Low"` and crop requires `"High"` water (e.g., Rice, Sugarcane): Subtracts **-18.0% score penalty** and logs an adjustment note.
     * If crop requires `"Moderate"` water: Subtracts **-5.0% penalty**.
     * If crop requires `"Low"` water (e.g., Chickpea, Mothbeans): Adds **+8.0% suitability boost** for drought endurance.
     * If `water_availability == "High"` and crop requires `"High"` water: Adds **+6.0% boost**.

2. **Capital Budget Guardrail**:
   * Evaluates input `budget_limit` (`"Low"`, `"Moderate"`, `"High"`):
     * If `budget_limit == "Low"` and crop requires `"High"` capital: Subtracts **-16.0% penalty**.
     * If crop requires `"Low"` capital: Adds **+7.0% boost**.
     * If `budget_limit == "High"` and crop requires `"High"` capital: Adds **+5.0% priority boost**.

3. **Re-ranking & Badge Assignment**:
   * Clamps scores between 5.0% and 99.3%.
   * Updates suitability badges: `≥88%` $ightarrow$ `"Optimal Fit"`, `≥78%` $ightarrow$ `"High Suitability"`, penalized by $>10\%$ $ightarrow$ `"Constraint Penalized"`.
   * Re-sorts all 22 crops by adjusted score and updates final rank numbers ($1 \dots 22$).

---

## 5. Explainable AI (XAI) SHAP Attribution (`ml/shap_explainer.py`)

The module `ml/shap_explainer.py` calculates local feature importance decompositions explaining *why* the primary crop was recommended.

### Mathematical Factor Decomposition (`compute_shap_breakdown`)

1. **Deviation Extraction**: Calculates normalized offsets between actual soil/climate inputs and target crop profile centroids:
   $$n_{	ext{dev}} = rac{|N - 	ext{idealN}|}{50.0}, \quad ph_{	ext{dev}} = rac{|pH - 	ext{idealPh}|}{1.5}, \quad rain_{	ext{dev}} = rac{|	ext{Rain} - 	ext{idealRain}|}{400.0}, \quad k_{	ext{dev}} = rac{|K - 	ext{idealK}|}{40.0}$$
2. **Impact Formula**:
   $$	ext{impact}_N = \max(5.0, 32.0 - n_{	ext{dev}} \cdot 18.0), \quad 	ext{impact}_{	ext{pH}} = \max(5.0, 26.0 - ph_{	ext{dev}} \cdot 15.0)$$
3. **Percentage Normalization**:
   Normalizes all raw impact scores so that Nitrogen, pH, Hydration, and Potassium attributions sum **strictly to 100.0%**.
4. **Impact Tagging**: Tags factor attributions as `"positive"` if deviation is within optimal thresholds, or `"negative"` if the parameter diverges significantly.

---

## 6. Generative AI Farmer Advisory (`backend/services/gemini_advisory.py`)

The file `backend/services/gemini_advisory.py` synthesizes numerical ML outputs and SHAP vectors into structured natural-language advisories using Google Gemini (`gemini-1.5-flash`).

### Code Structure & Prompt Engineering
* **`generate_advisory(...)`**:
  * Constructs a prompt packaging plot soil telemetry ($N, P, K, pH$), water and budget constraints, weather context, top recommended crop, and SHAP factors.
  * Configures `responseMimeType: "application/json"` with `temperature: 0.2` for deterministic JSON formatting.
  * Instructs Gemini to respond in a strict JSON schema:
    ```json
    {
      "executiveSummary": "Brief overview of why this crop is optimal under current constraints",
      "fertilizerRecommendation": "Precise basal and top-dressing N-P-K schedule",
      "irrigationStrategy": "Irrigation frequency and critical moisture stages",
      "seasonalRiskMitigation": "Weather, disease, or pest preventive action",
      "secondaryCropAlternative": "Intercrop or relay crop recommendation"
    }
    ```
* **Fallback Handler `_fallback_advisory(...)`**: If the Gemini API key is missing or encounters network errors, generates a rule-based agronomic advisory tailoring drip/flood irrigation advice to the user's water setting.

---

## 7. Machine Learning Inference & Training Pipeline

### A. Inference Engine (`ml/predictor.py`)
* **`CropPredictor` Class**:
  * `_try_load_artifacts()`: Loads serialized model artifacts (`crop_model.pkl`, `scaler.pkl`, `label_encoder.pkl`) from `/artifacts`.
  * `predict(n, p, k, ph, temp, humidity, rainfall)`:
    * Scales the 7-feature input vector using `scaler.transform()`.
    * Invokes `model.predict_proba()` across all 22 classes to extract calibrated probability percentages.
    * Sorts probabilities, formats the Top-3 recommendations with suitability badges (`Optimal Fit`, `High Fit`, `Moderate Fit`), and calculates SHAP feature importances.
  * `_centroid_prob_distribution()`: Euclidean Mahalanobis proxy fallback engaged if `.pkl` files are absent.

### B. Model Training Script (`ml/train.py`)
* **`generate_crop_dataset()`**: Generates the canonical 2,200-row 22-crop Kaggle dataset with realistic statistical noise.
* **`train_and_evaluate()`**:
  * Performs an 80/20 stratified train-test split using `train_test_split()`.
  * Standardizes feature vectors using `StandardScaler` and encodes crop string labels using `LabelEncoder`.
  * Configures a **`StackingClassifier`** combining three base estimators:
    1. `RandomForestClassifier(n_estimators=100, max_depth=14)`
    2. `ExtraTreesClassifier(n_estimators=100, max_depth=14)`
    3. `GradientBoostingClassifier(n_estimators=80, max_depth=5)`
  * Meta-Learner: `LogisticRegression(max_iter=500)`.
  * Exports serialized model artifacts (`crop_model.pkl`, `scaler.pkl`, `label_encoder.pkl`, `metrics.json`) to the `/artifacts` folder.

---

## 8. Model Context Protocol (MCP) Server (`agroxai_mcp.py`)

The script `agroxai_mcp.py` exposes AgroXAI precision agriculture tools to external AI agents (such as Claude Desktop, Cursor, or CLI bots) via a standard JSON-RPC 2.0 stdio interface.

### Exposed MCP Tools (`TOOLS_MANIFEST`)
1. **`get_weather(lat, lon)`**: Queries Open-Meteo for live ambient weather and 16-day rainfall forecasts.
2. **`get_soil_data(lat, lon)`**: Queries ISRIC SoilGrids 2.0 REST for soil pH, organic carbon, and clay percentage.
3. **`run_crop_model(n, p, k, ph, lat, lon)`**: Executes suitability scoring and computes SHAP factors across 22 cultivars.
4. **`apply_constraints(crop_scores, water_level, budget_level)`**: Re-ranks recommendations using real-world water scarcity and budget guardrails.
5. **`get_field_history(field_id)`**: Fetches past field soil measurements and recommendation history from Supabase.

### Stdio JSON-RPC Execution Loop (`run_stdio_server`)
* Reads JSON-RPC requests line-by-line from `sys.stdin`.
* Handles `initialize`, `tools/list`, and `tools/call` protocol methods.
* Dispatches tool calls to `execute_tool()` and writes JSON responses to `sys.stdout`.
* Includes self-test flag (`python agroxai_mcp.py --test`) verifying all 5 tools locally.

---

## 9. Copernicus Sentinel-2 Remote Sensing UI Components

### A. Health Dashboard Card (`frontend/components/FieldHealthCard.tsx`)
* **Hero Score Display**: Renders canopy mean NDVI (e.g. `0.74 / 1.00`) with a color-coded progress bar and status badge (`Healthy Canopy`, `Moderate`, `Stressed`).
* **Canopy Uniformity & Diagnostics**: Displays canopy variance ($\sigma$), cloud mask status (SCL classes 3, 8, 9, 10), parcel acreage, and WGS84 centroid coordinates.
* **60-Day Phenology Trajectory Chart**:
  * Uses Recharts `<AreaChart>` to render historical NDVI trends over 5-day satellite overpass revisit cycles.
  * Features threshold benchmark reference lines at `0.7` (Healthy), `0.5` (Moderate), and `0.2` (Stress Line).
  * Layer toggle buttons allow switching between **NDVI Colormap** and **False-Color Infrared (NIR)** raster views.

### B. Interactive Map Layer (`frontend/components/SatelliteHealthMap.tsx`)
* **React-Leaflet Integration**: Renders Esri World Imagery satellite basemaps alongside street tile layers.
* **Drawing & Selection Controls**: Uses `react-leaflet-draw` (`EditControl`) to let farmers draw custom field polygons on screen or select reference farm parcels (e.g. *Sangli Sugarcane*, *Pune Mixed Farm*).
* **Location Geocoding**: Includes a location search bar connected to Nominatim OpenStreetMap geocoding.
* **Remote Sensing Raster Overlays**: Overlays Sentinel-2 NDVI heatmaps or False-Color Infrared raster images (`<ImageOverlay>`) directly over the field parcel with an interactive opacity slider ($10\% \dots 100\%$).

---

## Summary of Code Verification Status

| Module File | Core Responsibility | Status |
| :--- | :--- | :--- |
| **`backend/main.py`** | FastAPI gateway, async GIS telemetry, 6-stage recommendation pipeline | ✅ **Verified** |
| **`soilgrids_service.py`** | ISRIC SoilGrids REST queries, pH deci-unit conversion (`pH / 10`), Vertisol classification | ✅ **Verified** |
| **`open_meteo_service.py`** | Open-Meteo REST queries, 16-day rainfall forecasts, meteorological fallbacks | ✅ **Verified** |
| **`ml/model_engine.py`** | 22 cultivar profiles, Gaussian centroid quadratic distance scoring | ✅ **Verified** |
| **`ml/constraint_engine.py`** | Water scarcity (-18%) & capital budget (-16%) penalty re-ranking | ✅ **Verified** |
| **`ml/shap_explainer.py`** | Analytical SHAP feature attributions normalized to 100% | ✅ **Verified** |
| **`gemini_advisory.py`** | Google Gemini LLM prompt engineering, structured JSON advisories | ✅ **Verified** |
| **`ml/predictor.py`** | `predict_proba()` multiclass probabilities, `.pkl` artifact loading | ✅ **Verified** |
| **`ml/train.py`** | Stacking Ensemble (`RandomForest` + `ExtraTrees` + `GradientBoosting`) training | ✅ **Verified** |
| **`agroxai_mcp.py`** | Stdio JSON-RPC MCP server exposing 5 agentic tools | ✅ **Verified** |
| **`FieldHealthCard.tsx`** | Recharts 60-day NDVI trajectory curve, canopy uniformity metrics | ✅ **Verified** |
| **`SatelliteHealthMap.tsx`** | React-Leaflet interactive drawing, Sentinel-2 raster overlays | ✅ **Verified** |

