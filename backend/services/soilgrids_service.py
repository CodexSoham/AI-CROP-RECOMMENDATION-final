import json
import urllib.request
import urllib.parse
import asyncio
from typing import Dict, Any
from backend.config import settings

class SoilGridsService:
    def __init__(self, base_url: str = settings.SOILGRIDS_API_URL):
        self.base_url = base_url

    def _sync_fetch(self, url: str) -> Dict[str, Any]:
        req = urllib.request.Request(url, headers={"User-Agent": "AgroXAI-Service/1.0", "Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=6.0) as resp:
            return json.loads(resp.read().decode("utf-8"))

    async def get_soil_properties(self, lat: float, lon: float) -> Dict[str, Any]:
        """
        Query SoilGrids 2.0 REST API for pH, organic carbon, and clay percentage at 0-30cm depth.
        """
        params = [
            ("lon", str(lon)),
            ("lat", str(lat)),
            ("property", "phh2o"),
            ("property", "soc"),
            ("property", "clay"),
            ("depth", "0-30cm"),
            ("value", "mean"),
        ]
        query_string = urllib.parse.urlencode(params)
        url = f"{self.base_url}?{query_string}"
        
        try:
            data = await asyncio.to_thread(self._sync_fetch, url)
            layers = data.get("properties", {}).get("layers", [])
            
            # Extract phh2o
            ph_layer = next((l for l in layers if l.get("name") == "phh2o"), None)
            raw_ph = ph_layer.get("depths", [{}])[0].get("values", {}).get("mean") if ph_layer else None
            ph = round(raw_ph / 10.0, 1) if raw_ph else 7.2
            
            # Extract soc
            soc_layer = next((l for l in layers if l.get("name") == "soc"), None)
            raw_soc = soc_layer.get("depths", [{}])[0].get("values", {}).get("mean") if soc_layer else None
            soc = round(raw_soc / 100.0, 1) if raw_soc else 0.8
            
            # Extract clay
            clay_layer = next((l for l in layers if l.get("name") == "clay"), None)
            raw_clay = clay_layer.get("depths", [{}])[0].get("values", {}).get("mean") if clay_layer else None
            clay = round(raw_clay / 10.0, 1) if raw_clay else 48.0
            
            soil_type = "Deep Black Soil (Vertisol)" if clay > 40 else "Alluvial Loam (Inceptisol)"
            
            return {
                "success": True,
                "source": "soilgrids-rest",
                "soilType": soil_type,
                "ph": ph,
                "organicCarbonPercent": soc,
                "clayContentPercent": clay,
                "nitrogenBaseline": 70 if ph > 7.5 else 85,
                "phosphorusBaseline": 42,
                "potassiumBaseline": 48 if ph > 7 else 38,
            }
        except Exception as e:
            # Regional agronomic fallback
            return {
                "success": True,
                "source": "regional-classification",
                "soilType": "Deep Black Soil (Vertisol)",
                "ph": 7.5,
                "organicCarbonPercent": 0.75,
                "clayContentPercent": 52.0,
                "nitrogenBaseline": 75,
                "phosphorusBaseline": 44,
                "potassiumBaseline": 50,
                "error": str(e),
            }

soilgrids_service = SoilGridsService()
