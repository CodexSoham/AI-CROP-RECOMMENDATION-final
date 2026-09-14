import os
from typing import Dict, Any, Optional
from backend.config import settings

class SupabaseService:
    def __init__(
        self,
        supabase_url: Optional[str] = settings.SUPABASE_URL,
        supabase_key: Optional[str] = settings.SUPABASE_SERVICE_ROLE_KEY
    ):
        self.supabase_url = supabase_url
        self.supabase_key = supabase_key
        self.client = None
        
        if self.supabase_url and self.supabase_key:
            try:
                from supabase import create_client
                self.client = create_client(self.supabase_url, self.supabase_key)
            except Exception as e:
                print(f"Supabase client initialization notice: {e}")

    async def log_recommendation(
        self,
        field_id: Optional[str],
        water_availability: str,
        budget_limit: str,
        top_crops: list,
        shap_factors: dict,
        advisory: Optional[dict] = None
    ) -> Optional[str]:
        """
        Record recommendation run into Supabase 'recommendations' table.
        """
        if not self.client or not field_id:
            return None

        try:
            primary = top_crops[0] if top_crops else {}
            payload = {
                "field_id": field_id,
                "water_availability": water_availability,
                "budget_limit": budget_limit,
                "top_crops": top_crops,
                "primary_crop_id": primary.get("id", "rice"),
                "primary_crop_name": primary.get("name", "Rice"),
                "primary_crop_score": primary.get("score", 0.0),
                "shap_factors": shap_factors,
                "advisory_summary": advisory.get("executiveSummary") if advisory else None,
                "fertilizer_plan": advisory.get("fertilizerRecommendation") if advisory else None,
                "irrigation_strategy": advisory.get("irrigationStrategy") if advisory else None,
                "risk_mitigation": advisory.get("seasonalRiskMitigation") if advisory else None,
            }
            res = self.client.table("recommendations").insert(payload).execute()
            return res.data[0]["id"] if res.data else None
        except Exception as e:
            print(f"Supabase recommendation log warning: {e}")
            return None

supabase_service = SupabaseService()
