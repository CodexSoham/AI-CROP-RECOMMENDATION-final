/**
 * Satellite Field Health Service (Sentinel-2 L2A Remote Sensing)
 * Connects frontend to FastAPI /api/v1/field_health for NDVI time-series and canopy analysis.
 */

export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][]; // [[[lon, lat], ...]]
}

export interface NDVITimeSeriesPoint {
  date: string;
  mean_ndvi: number;
  min_ndvi: number;
  max_ndvi: number;
  std_dev: number;
  cloud_coverage_pct: number;
  valid_pixel_pct: number;
  status: string;
  status_key: 'bare_soil' | 'stressed' | 'moderate' | 'healthy';
}

export interface VegetationHealthCurrent {
  mean_ndvi: number;
  min_ndvi: number;
  max_ndvi: number;
  std_dev: number;
  status: string;
  status_key: 'bare_soil' | 'stressed' | 'moderate' | 'healthy';
  color_code: string;
  badge: string;
  canopy_uniformity: string;
  agronomic_advisory: string;
}

export interface FieldMetrics {
  area_hectares: number;
  area_acres: number;
  centroid_lat: number;
  centroid_lon: number;
  bounds: [[number, number], [number, number]]; // [[south, west], [north, east]]
}

export interface SatelliteOverlay {
  overlay_type: string;
  ndvi_colormap_url: string;
  false_color_url: string;
  bounds: [[number, number], [number, number]];
  attribution: string;
}

export interface FieldHealthResponse {
  success: boolean;
  field_metrics: FieldMetrics;
  current_health: VegetationHealthCurrent;
  time_series: NDVITimeSeriesPoint[];
  overlay: SatelliteOverlay;
  source: string;
  cloud_filtering_applied: boolean;
  sensor?: string;
  resolution?: string;
}

export interface PresetField {
  id: string;
  name: string;
  region: string;
  cropType: string;
  polygon: GeoJSONPolygon;
  description: string;
}

export const PRESET_FIELDS: PresetField[] = [
  {
    id: 'sangli_sugarcane',
    name: 'Sangli Sugarcane Estate',
    region: 'Maharashtra (Krishna River Basin)',
    cropType: 'Sugarcane (Co 86032)',
    description: 'High biomass perennial canopy with furrow irrigation and black cotton vertisol.',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [74.5802, 16.8510],
        [74.5855, 16.8510],
        [74.5855, 16.8562],
        [74.5802, 16.8562],
        [74.5802, 16.8510]
      ]]
    }
  },
  {
    id: 'punjab_wheat',
    name: 'Ludhiana Agro-Trial Farm',
    region: 'Punjab (Indo-Gangetic Plain)',
    cropType: 'Wheat (HD 2967)',
    description: 'Alluvial loam field trial parcel under canal & tube-well irrigation.',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [75.8505, 30.9002],
        [75.8560, 30.9002],
        [75.8560, 30.9055],
        [75.8505, 30.9055],
        [75.8505, 30.9002]
      ]]
    }
  },
  {
    id: 'nashik_vineyard',
    name: 'Dindori Vineyard Parcel',
    region: 'Nashik, Maharashtra',
    cropType: 'Table Grapes (Thomson Seedless)',
    description: 'High-density trellis canopy evaluated for vegetative vigor and leaf chlorophyll.',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [73.8300, 20.1980],
        [73.8348, 20.1980],
        [73.8348, 20.2030],
        [73.8300, 20.2030],
        [73.8300, 20.1980]
      ]]
    }
  },
  {
    id: 'guntur_chilli',
    name: 'Guntur Commercial Chilli Plot',
    region: 'Andhra Pradesh',
    cropType: 'Chilli (Teja Variety)',
    description: 'Red sandy loam intensive cropping zone monitored for canopy stress & flowering.',
    polygon: {
      type: 'Polygon',
      coordinates: [[
        [80.4310, 16.3020],
        [80.4365, 16.3020],
        [80.4365, 16.3072],
        [80.4310, 16.3072],
        [80.4310, 16.3020]
      ]]
    }
  }
];

export async function fetchFieldHealth(
  geojson: GeoJSONPolygon,
  startDate?: string,
  endDate?: string,
  overlayType: 'ndvi' | 'false_color' = 'ndvi'
): Promise<FieldHealthResponse> {
  const payload = {
    geojson,
    start_date: startDate,
    end_date: endDate,
    overlay_type: overlayType,
  };

  const endpoints = import.meta.env.DEV
    ? ['http://localhost:8000/api/v1/field_health', '/api/v1/field_health']
    : ['/api/v1/field_health'];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.success && data?.current_health) {
          return data;
        }
      }
    } catch {
      // Continue to next endpoint
    }
  }

  const { simulateFieldHealth } = await import('../lib/fieldHealthFallback');
  return simulateFieldHealth(geojson);
}
