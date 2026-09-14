import os
import json
import urllib.request
import asyncio
from typing import Dict, Any, Optional
from backend.config import settings

class GeminiAdvisoryService:
    def __init__(self, api_key: Optional[str] = settings.GEMINI_API_KEY):
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY")

    def _sync_gemini_call(self, url: str, payload_bytes: bytes) -> Dict[str, Any]:
        req = urllib.request.Request(
            url,
            data=payload_bytes,
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=10.0) as resp:
            return json.loads(resp.read().decode("utf-8"))

    async def generate_advisory(
        self,
        top_crop: Dict[str, Any],
        shap_factors: Dict[str, Any],
        soil: Dict[str, Any],
        weather: Dict[str, Any],
        constraints: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Synthesize plain-language farmer advisory via Google Gemini API.
        """
        if not self.api_key:
            return self._fallback_advisory(top_crop, soil, constraints)

        prompt = f"""
You are an expert Chief Agronomist for AgroXAI. Analyze these precision agriculture outputs and generate a structured plain-language farmer advisory.

[Plot & Soil Telemetry]
- Nitrogen (N): {soil.get('n')} mg/kg
- Phosphorus (P): {soil.get('p')} mg/kg
- Potassium (K): {soil.get('k')} mg/kg
- pH: {soil.get('ph')}
- Water Availability: {constraints.get('water_availability')}
- Budget Constraint: {constraints.get('budget_limit')}

[Climate Context]
- Temperature: {weather.get('temperature')} °C
- Relative Humidity: {weather.get('humidity')} %
- 16-Day Forecast Rainfall: {weather.get('rainfallForecast16d')} mm

[Model Output]
- Recommended #1 Crop: {top_crop.get('name')} (Suitability: {top_crop.get('score')}%)
- Top Driving SHAP Factors: {json.dumps(shap_factors.get('factors', []))}

Respond ONLY in valid JSON matching this structure:
{{
  "executiveSummary": "Brief overview of why this crop is optimal under current constraints",
  "fertilizerRecommendation": "Precise basal and top-dressing N-P-K and micronutrient schedule",
  "irrigationStrategy": "Irrigation frequency and critical moisture stages",
  "seasonalRiskMitigation": "Weather, disease, or pest preventive action",
  "secondaryCropAlternative": "Intercrop or relay crop recommendation"
}}
"""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.2,
                "responseMimeType": "application/json"
            }
        }
        payload_bytes = json.dumps(payload).encode("utf-8")

        try:
            data = await asyncio.to_thread(self._sync_gemini_call, url, payload_bytes)
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(text)
        except Exception as e:
            print(f"Gemini API advisory notice: {e}")

        return self._fallback_advisory(top_crop, soil, constraints)

    def _fallback_advisory(self, top_crop: Dict[str, Any], soil: Dict[str, Any], constraints: Dict[str, Any]) -> Dict[str, Any]:
        crop_name = top_crop.get("name", "Rice")
        score = top_crop.get("score", 94)
        water = constraints.get("water_availability", "Moderate")

        irrigation = (
            "Deploy drip irrigation with 3-day intervals to minimize transpiration losses."
            if water == "Low"
            else "Ensure field saturation during panicle initiation and maintain standard irrigation intervals."
        )

        return {
            "executiveSummary": f"{crop_name} demonstrates highest constraint-adjusted viability ({score}%) for your plot's soil chemistry and climatic envelope.",
            "fertilizerRecommendation": "Apply split-dose urea (50% basal, 25% vegetative, 25% panicle). Supplement with 40 kg/ha P2O5.",
            "irrigationStrategy": irrigation,
            "seasonalRiskMitigation": "Monitor local humidity levels to prevent fungal blast and leaf blight. Apply neem cake during land prep.",
            "secondaryCropAlternative": "Sow chickpea or moong bean as a relay crop to fix nitrogen and maintain soil health.",
        }

gemini_advisory_service = GeminiAdvisoryService()
