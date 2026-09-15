from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict, Any

class GeoJSONPolygon(BaseModel):
    """Standard GeoJSON Polygon representation"""
    type: Literal["Polygon"] = "Polygon"
    coordinates: List[List[List[float]]] = Field(
        ...,
        description="Coordinates formatted as [[[lon, lat], [lon, lat], ...]] adhering to RFC 7946 GeoJSON specification"
    )

class FieldHealthRequest(BaseModel):
    geojson: GeoJSONPolygon
    start_date: Optional[str] = Field(None, description="Start date ISO YYYY-MM-DD (defaults to 60 days before end_date)")
    end_date: Optional[str] = Field(None, description="End date ISO YYYY-MM-DD (defaults to current date)")
    overlay_type: Optional[Literal["ndvi", "false_color"]] = Field("ndvi", description="Type of raster layer overlay to generate")

class NDVITimeSeriesPoint(BaseModel):
    date: str
    mean_ndvi: float
    min_ndvi: float
    max_ndvi: float
    std_dev: float
    cloud_coverage_pct: float
    valid_pixel_pct: float
    status: str
    status_key: Literal["bare_soil", "stressed", "moderate", "healthy"]

class VegetationHealthCurrent(BaseModel):
    mean_ndvi: float
    min_ndvi: float
    max_ndvi: float
    std_dev: float
    status: str = Field(..., description="Classified canopy vegetation health status")
    status_key: Literal["bare_soil", "stressed", "moderate", "healthy"]
    color_code: str
    badge: str
    canopy_uniformity: str
    agronomic_advisory: str

class FieldMetrics(BaseModel):
    area_hectares: float
    area_acres: float
    centroid_lat: float
    centroid_lon: float
    bounds: List[List[float]] = Field(..., description="[[south, west], [north, east]]")

class SatelliteOverlay(BaseModel):
    overlay_type: str
    ndvi_colormap_url: str
    false_color_url: str
    bounds: List[List[float]]
    attribution: str

class FieldHealthResponse(BaseModel):
    success: bool
    field_metrics: FieldMetrics
    current_health: VegetationHealthCurrent
    time_series: List[NDVITimeSeriesPoint]
    overlay: SatelliteOverlay
    source: str
    cloud_filtering_applied: bool = True
    sensor: str = "Sentinel-2 MSI (MultiSpectral Instrument) L2A"
    resolution: str = "10m Ground Sampling Distance"
