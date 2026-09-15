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
    
    # Sentinel Hub & Geospatial Remote Sensing APIs
    SENTINEL_CLIENT_ID: Optional[str] = os.getenv("SENTINEL_CLIENT_ID")
    SENTINEL_CLIENT_SECRET: Optional[str] = os.getenv("SENTINEL_CLIENT_SECRET")
    SENTINEL_INSTANCE_ID: Optional[str] = os.getenv("SENTINEL_INSTANCE_ID")
    SENTINEL_AUTH_URL: str = os.getenv("SENTINEL_AUTH_URL", "https://services.sentinel-hub.com/oauth/token")
    SENTINEL_STATISTICAL_URL: str = os.getenv("SENTINEL_STATISTICAL_URL", "https://services.sentinel-hub.com/api/v1/statistics")
    SENTINEL_PROCESS_URL: str = os.getenv("SENTINEL_PROCESS_URL", "https://services.sentinel-hub.com/api/v1/process")

settings = Settings()

