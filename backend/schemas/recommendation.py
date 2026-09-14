from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict, Any

class RecommendRequest(BaseModel):
    n: float = Field(..., ge=0, le=300, description="Soil Nitrogen (mg/kg)")
    p: float = Field(..., ge=0, le=300, description="Soil Phosphorus (mg/kg)")
    k: float = Field(..., ge=0, le=300, description="Soil Potassium (mg/kg)")
    ph: float = Field(..., ge=3.5, le=10.0, description="Soil pH (0-14 scale)")
    lat: float = Field(16.8524, description="Field Latitude")
    lon: float = Field(74.5815, description="Field Longitude")
    water_availability: Literal["Low", "Moderate", "High"] = "Moderate"
    budget_limit: Literal["Low", "Medium", "High"] = "Medium"
    field_id: Optional[str] = None

class ShapFactor(BaseModel):
    feature: str
    impactPercent: float
    rawVal: Any
    optimalVal: str
    description: str
    type: Literal["positive", "negative"]

class ShapBreakdown(BaseModel):
    cropName: str
    factors: List[ShapFactor]
    baseRate: float

class CropRecommendationOut(BaseModel):
    id: str
    name: str
    scientificName: str
    category: str
    rawScore: float
    score: float
    rank: int
    badge: str
    waterNeed: str
    budgetNeed: str
    idealSeason: List[str]
    adjustmentReason: Optional[str] = None
    keyStrengths: List[str]
    riskFactors: List[str]
    expectedYield: str
    profitabilityIndex: str
    colorCode: str
    iconName: str

class GeminiAdvisoryOut(BaseModel):
    executiveSummary: str
    fertilizerRecommendation: str
    irrigationStrategy: str
    seasonalRiskMitigation: str
    secondaryCropAlternative: Optional[str] = None

class RecommendResponse(BaseModel):
    success: bool
    top3: List[CropRecommendationOut]
    all_evaluated: List[CropRecommendationOut]
    primary_shap: ShapBreakdown
    advisory: Optional[GeminiAdvisoryOut] = None
    weather_context: Dict[str, Any]

class RecommendFromMapRequest(BaseModel):
    lat: float = Field(..., description="Latitude of selected pin or polygon centroid")
    lon: float = Field(..., description="Longitude of selected pin or polygon centroid")
    water_availability: Optional[Literal["Low", "Moderate", "High", "Plentiful"]] = "Plentiful"
    budget_limit: Optional[Literal["Low", "Medium", "Moderate", "High"]] = "Moderate"
    field_id: Optional[str] = None
    area_hectares: Optional[float] = None

class RecommendFromMapResponse(BaseModel):
    success: bool
    coordinates: Dict[str, float]
    soil: Dict[str, Any]
    weather: Dict[str, Any]
    top3: List[CropRecommendationOut]
    all_evaluated: List[CropRecommendationOut]
    primary_shap: ShapBreakdown
    advisory: Optional[GeminiAdvisoryOut] = None

class PredictRequest(BaseModel):
    N: float = Field(..., ge=0, le=300, description="Soil Nitrogen (ppm or ratio)")
    P: float = Field(..., ge=0, le=300, description="Soil Phosphorus (ppm or ratio)")
    K: float = Field(..., ge=0, le=300, description="Soil Potassium (ppm or ratio)")
    ph: float = Field(..., ge=0.0, le=14.0, description="Soil pH value (0-14)")
    temperature: float = Field(..., description="Environmental temperature in Celsius")
    humidity: float = Field(..., ge=0.0, le=100.0, description="Relative humidity percentage")
    rainfall: float = Field(..., ge=0.0, description="Seasonal/annual rainfall in mm")

class RankedCrop(BaseModel):
    rank: int
    crop: str
    suitability_score: float
    tag: str

class PredictResponse(BaseModel):
    top_recommendations: List[RankedCrop]
    feature_importance: Dict[str, float]


