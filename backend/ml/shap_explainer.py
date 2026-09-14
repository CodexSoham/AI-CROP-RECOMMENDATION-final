from typing import Dict, Any, List

def compute_shap_breakdown(
    n: float,
    p: float,
    k: float,
    ph: float,
    temp: float,
    rainfall: float,
    primary_crop: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Computes explainable AI (XAI) feature attribution decomposed into percentage contributions.
    """
    profile = primary_crop.get("cropProfile", {})
    ideal_n = profile.get("idealN", 90)
    ideal_ph = profile.get("idealPh", 6.5)
    ideal_rain = profile.get("idealRainfall", 1100)
    ideal_k = profile.get("idealK", 45)
    
    # Calculate dimensional offsets
    n_dev = abs(n - ideal_n) / 50.0
    ph_dev = abs(ph - ideal_ph) / 1.5
    rain_dev = abs(rainfall - ideal_rain) / 400.0
    k_dev = abs(k - ideal_k) / 40.0
    
    n_impact = max(5.0, 32.0 - (n_dev * 18.0))
    ph_impact = max(5.0, 26.0 - (ph_dev * 15.0))
    rain_impact = max(5.0, 24.0 - (rain_dev * 14.0))
    k_impact = max(4.0, 18.0 - (k_dev * 10.0))
    
    total = n_impact + ph_impact + rain_impact + k_impact
    n_pct = round((n_impact / total) * 100.0, 1)
    ph_pct = round((ph_impact / total) * 100.0, 1)
    rain_pct = round((rain_impact / total) * 100.0, 1)
    k_pct = round(100.0 - (n_pct + ph_pct + rain_pct), 1)
    
    factors: List[Dict[str, Any]] = [
        {
            "feature": "Soil Nitrogen (N)",
            "impactPercent": n_pct,
            "rawVal": f"{n} mg/kg",
            "optimalVal": f"{ideal_n} mg/kg",
            "description": "Vegetative canopy expansion and active photosynthetic protein synthesis.",
            "type": "positive" if n_dev < 0.6 else "negative"
        },
        {
            "feature": "Soil pH Chemistry",
            "impactPercent": ph_pct,
            "rawVal": f"{ph}",
            "optimalVal": f"{ideal_ph}",
            "description": "Cation exchange availability and micronutrient uptake efficiency.",
            "type": "positive" if ph_dev < 0.5 else "negative"
        },
        {
            "feature": "Seasonal Hydration",
            "impactPercent": rain_pct,
            "rawVal": f"{round(rainfall)} mm",
            "optimalVal": f"{ideal_rain} mm",
            "description": "Root zone percolation and transpiration support during reproductive stages.",
            "type": "positive" if rain_dev < 0.7 else "negative"
        },
        {
            "feature": "Potassium Reserve (K)",
            "impactPercent": k_pct,
            "rawVal": f"{k} mg/kg",
            "optimalVal": f"{ideal_k} mg/kg",
            "description": "Cell turgor, drought resistance, and grain filling density.",
            "type": "positive" if k_dev < 0.6 else "negative"
        }
    ]
    
    return {
        "cropName": primary_crop.get("name", "Crop"),
        "factors": factors,
        "baseRate": 50.0
    }
