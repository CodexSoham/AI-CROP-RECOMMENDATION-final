import os
from typing import Optional

# Try loading python-dotenv if installed, otherwise manual fallback
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # Basic manual .env parser
    if os.path.exists(".env"):
        with open(".env", "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    val = val.strip().strip('"').strip("'")
                    if key not in os.environ:
                        os.environ[key] = val

class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "AdaptiveCrop AI (AgroXAI)")
    FASTAPI_HOST: str = os.getenv("FASTAPI_HOST", "0.0.0.0")
    FASTAPI_PORT: int = int(os.getenv("FASTAPI_PORT", "8000"))
    
    # Google Gemini API Key
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")
    
    # External APIs
    OPEN_METEO_API_URL: str = os.getenv("OPEN_METEO_API_URL", "https://api.open-meteo.com/v1/forecast")
    SOILGRIDS_API_URL: str = os.getenv("SOILGRIDS_API_URL", "https://rest.isric.org/soilgrids/v2.0/properties/query")
    NASA_POWER_API_URL: str = os.getenv("NASA_POWER_API_URL", "https://power.larc.nasa.gov/api/temporal/daily/point")
    
    # Supabase credentials
    SUPABASE_URL: Optional[str] = os.getenv("SUPABASE_URL")
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    # n8n Automation
    N8N_WEBHOOK_URL: Optional[str] = os.getenv("N8N_WEBHOOK_URL")
    N8N_API_KEY: Optional[str] = os.getenv("N8N_API_KEY")

settings = Settings()
