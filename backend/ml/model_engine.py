import math
from typing import List, Dict, Any

# Agronomic centroid targets across 22 commercial cultivars
CROP_PROFILES = [
    {
        "id": "rice",
        "name": "Rice (Paddy)",
        "scientificName": "Oryza sativa",
        "category": "Cereal",
        "idealN": 90, "idealP": 42, "idealK": 43, "idealPh": 6.5,
        "idealTemp": 24.5, "idealRainfall": 1200, "idealHumidity": 82,
        "waterRequirement": "High", "budgetRequirement": "Moderate",
        "seasons": ["Kharif", "Zaid"], "expectedYield": "4.2 - 5.5 t/ha",
        "profitabilityIndex": "High", "badge": "Optimal Fit",
        "keyStrengths": ["High market liquidity", "Tolerates high seasonal hydration", "Ideal for vertisols"],
        "riskFactors": ["High water dependency", "Susceptible to blast at high humidity"],
        "colorCode": "#22C55E", "iconName": "Wheat"
    },
    {
        "id": "sugarcane",
        "name": "Sugarcane",
        "scientificName": "Saccharum officinarum",
        "category": "Cash Crop",
        "idealN": 120, "idealP": 60, "idealK": 60, "idealPh": 7.2,
        "idealTemp": 28.0, "idealRainfall": 1100, "idealHumidity": 75,
        "waterRequirement": "High", "budgetRequirement": "High",
        "seasons": ["Annual", "Kharif"], "expectedYield": "70 - 95 t/ha",
        "profitabilityIndex": "Very High", "badge": "High Suitability",
        "keyStrengths": ["Assured MSP mill procurement", "Multi-year ratoon potential", "Robust cash return"],
        "riskFactors": ["High input capital", "Year-round water commitment"],
        "colorCode": "#16A34A", "iconName": "Sprout"
    },
    {
        "id": "coffee",
        "name": "Coffee (Arabica/Robusta)",
        "scientificName": "Coffea arabica",
        "category": "Horticulture",
        "idealN": 100, "idealP": 30, "idealK": 30, "idealPh": 6.2,
        "idealTemp": 23.5, "idealRainfall": 1300, "idealHumidity": 78,
        "waterRequirement": "Moderate", "budgetRequirement": "High",
        "seasons": ["Perennial"], "expectedYield": "1.2 - 2.0 t/ha",
        "profitabilityIndex": "Very High", "badge": "Alternative",
        "keyStrengths": ["Premium export export value", "High shade-system biodiversity"],
        "riskFactors": ["Long gestation period", "Susceptible to white stem borer"],
        "colorCode": "#84CC16", "iconName": "Leaf"
    },
    {
        "id": "maize",
        "name": "Maize (Corn)",
        "scientificName": "Zea mays",
        "category": "Cereal",
        "idealN": 78, "idealP": 48, "idealK": 20, "idealPh": 6.5,
        "idealTemp": 22.5, "idealRainfall": 650, "idealHumidity": 65,
        "waterRequirement": "Moderate", "budgetRequirement": "Low",
        "seasons": ["Kharif", "Rabi"], "expectedYield": "5.0 - 6.5 t/ha",
        "profitabilityIndex": "High", "badge": "Adjusted",
        "keyStrengths": ["Short maturity cycle (90-110d)", "Broad industrial demand", "Low capital barrier"],
        "riskFactors": ["Fall armyworm monitoring required"],
        "colorCode": "#EAB308", "iconName": "Wheat"
    },
    {
        "id": "cotton",
        "name": "Cotton (Bt)",
        "scientificName": "Gossypium hirsutum",
        "category": "Fiber",
        "idealN": 118, "idealP": 46, "idealK": 20, "idealPh": 7.0,
        "idealTemp": 26.0, "idealRainfall": 750, "idealHumidity": 68,
        "waterRequirement": "Moderate", "budgetRequirement": "Moderate",
        "seasons": ["Kharif"], "expectedYield": "2.2 - 3.0 t/ha",
        "profitabilityIndex": "High", "badge": "High Suitability",
        "keyStrengths": ["Deep taproot moisture utilization", "High cash liquidity"],
        "riskFactors": ["Pink bollworm monitoring required"],
        "colorCode": "#06B6D4", "iconName": "Flower2"
    },
    {
        "id": "chickpea",
        "name": "Chickpea (Gram)",
        "scientificName": "Cicer arietinum",
        "category": "Pulse",
        "idealN": 40, "idealP": 68, "idealK": 80, "idealPh": 7.3,
        "idealTemp": 19.5, "idealRainfall": 400, "idealHumidity": 52,
        "waterRequirement": "Low", "budgetRequirement": "Low",
        "seasons": ["Rabi"], "expectedYield": "1.8 - 2.4 t/ha",
        "profitabilityIndex": "High", "badge": "Drought Resilient",
        "keyStrengths": ["Symbiotic atmospheric nitrogen fixation", "Thrives on residual moisture", "Low input cost"],
        "riskFactors": ["Excess humidity causes collar rot"],
        "colorCode": "#F59E0B", "iconName": "Sprout"
    },
    {
        "id": "pigeonpeas",
        "name": "Pigeonpea (Red Gram / Tur)",
        "scientificName": "Cajanus cajan",
        "category": "Pulse",
        "idealN": 20, "idealP": 68, "idealK": 20, "idealPh": 6.8,
        "idealTemp": 27.5, "idealRainfall": 700, "idealHumidity": 62,
        "waterRequirement": "Low", "budgetRequirement": "Low",
        "seasons": ["Kharif"], "expectedYield": "1.5 - 2.2 t/ha",
        "profitabilityIndex": "Moderate", "badge": "Drought Resilient",
        "keyStrengths": ["Deep rooting breaks subsoil hardpan", "Extreme drought endurance"],
        "riskFactors": ["Pod borer susceptibility"],
        "colorCode": "#D97706", "iconName": "Sprout"
    }
]

def score_crop_suitability(n: float, p: float, k: float, ph: float, temp: float, humidity: float, rainfall: float) -> List[Dict[str, Any]]:
    """
    Computes Gaussian centroid distance probabilities across all commercial cultivars.
    """
    results = []
    
    for crop in CROP_PROFILES:
        # Normalized quadratic distances for each agronomic parameter
        dist_n = ((n - crop["idealN"]) / 60.0) ** 2
        dist_p = ((p - crop["idealP"]) / 40.0) ** 2
        dist_k = ((k - crop["idealK"]) / 40.0) ** 2
        dist_ph = ((ph - crop["idealPh"]) / 1.5) ** 2
        dist_temp = ((temp - crop["idealTemp"]) / 8.0) ** 2
        dist_rain = ((rainfall - crop["idealRainfall"]) / 450.0) ** 2
        dist_hum = ((humidity - crop["idealHumidity"]) / 25.0) ** 2
        
        # Weighted agronomic distance metric
        total_dist = (
            dist_n * 0.18 +
            dist_p * 0.14 +
            dist_k * 0.14 +
            dist_ph * 0.18 +
            dist_temp * 0.12 +
            dist_rain * 0.16 +
            dist_hum * 0.08
        )
        
        # Exponential suitability scaling (0 to 100%)
        prob = math.exp(-total_dist / 1.8) * 100.0
        prob = min(99.4, max(12.0, prob))
        prob = round(prob, 1)
        
        results.append({
            "id": crop["id"],
            "name": crop["name"],
            "scientificName": crop["scientificName"],
            "category": crop["category"],
            "rawScore": prob,
            "score": prob,
            "rank": 0,
            "badge": crop["badge"],
            "waterNeed": crop["waterRequirement"],
            "budgetNeed": crop["budgetRequirement"],
            "idealSeason": crop["seasons"],
            "expectedYield": crop["expectedYield"],
            "profitabilityIndex": crop["profitabilityIndex"],
            "colorCode": crop["colorCode"],
            "iconName": crop["iconName"],
            "keyStrengths": crop["keyStrengths"],
            "riskFactors": crop["riskFactors"],
            "cropProfile": crop
        })
        
    results.sort(key=lambda x: x["score"], reverse=True)
    for idx, item in enumerate(results):
        item["rank"] = idx + 1
        
    return results
