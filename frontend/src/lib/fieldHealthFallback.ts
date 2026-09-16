export function simulateFieldHealth(geojson?: { type?: string; coordinates?: number[][][] }) {
  const ring = geojson?.coordinates?.[0] || [
    [74.5802, 16.851],
    [74.5848, 16.851],
    [74.5848, 16.8552],
    [74.5802, 16.8552],
    [74.5802, 16.851],
  ];
  const lons = ring.map((p) => p[0]);
  const lats = ring.map((p) => p[1]);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const cLat = (minLat + maxLat) / 2;
  const cLon = (minLon + maxLon) / 2;

  const timeSeries: Array<{
    date: string;
    mean_ndvi: number;
    min_ndvi: number;
    max_ndvi: number;
    std_dev: number;
    cloud_coverage_pct: number;
    valid_pixel_pct: number;
    status: string;
    status_key: 'bare_soil' | 'stressed' | 'moderate' | 'healthy';
  }> = [];
  const now = new Date();
  for (let i = 12; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 5 * 86400000);
    const prog = (12 - i) / 12;
    const meanVal = Math.min(
      0.91,
      Math.max(0.22, 0.58 + Math.sin(prog * Math.PI * 0.9) * 0.16 + Math.sin(i * 1.5) * 0.03)
    );
    const sd = 0.045;
    let status = 'Dense / Healthy Crop Canopy';
    let statusKey: 'bare_soil' | 'stressed' | 'moderate' | 'healthy' = 'healthy';
    if (meanVal < 0.2) {
      status = 'Bare Soil / Water';
      statusKey = 'bare_soil';
    } else if (meanVal < 0.5) {
      status = 'Low / Stressed Vegetation';
      statusKey = 'stressed';
    } else if (meanVal < 0.7) {
      status = 'Moderate Health';
      statusKey = 'moderate';
    }

    timeSeries.push({
      date: d.toISOString().split('T')[0],
      mean_ndvi: Math.round(meanVal * 1000) / 1000,
      min_ndvi: Math.round((meanVal - 1.5 * sd) * 1000) / 1000,
      max_ndvi: Math.round((meanVal + 1.5 * sd) * 1000) / 1000,
      std_dev: sd,
      cloud_coverage_pct: Math.round((Math.sin(i * 2) * 10 + 12) * 10) / 10,
      valid_pixel_pct: 94.2,
      status,
      status_key: statusKey,
    });
  }

  const latest = timeSeries[timeSeries.length - 1];
  return {
    success: true,
    field_metrics: {
      area_hectares: 2.45,
      area_acres: 6.05,
      centroid_lat: Math.round(cLat * 10000) / 10000,
      centroid_lon: Math.round(cLon * 10000) / 10000,
      bounds: [
        [minLat, minLon],
        [maxLat, maxLon],
      ] as [[number, number], [number, number]],
    },
    current_health: {
      mean_ndvi: latest.mean_ndvi,
      min_ndvi: latest.min_ndvi,
      max_ndvi: latest.max_ndvi,
      std_dev: latest.std_dev,
      status: latest.status,
      status_key: latest.status_key,
      color_code: latest.status_key === 'healthy' ? '#10b981' : latest.status_key === 'moderate' ? '#84cc16' : '#f59e0b',
      badge: latest.status_key === 'healthy' ? 'Healthy Canopy' : latest.status,
      canopy_uniformity: 'High Canopy Uniformity (Homogeneous Growth)',
      agronomic_advisory:
        'Optimal canopy chlorophyll absorption. Biomass index indicates robust vegetative stage.',
    },
    time_series: timeSeries,
    overlay: {
      overlay_type: 'ndvi',
      ndvi_colormap_url: '',
      false_color_url: '',
      bounds: [
        [minLat, minLon],
        [maxLat, maxLon],
      ] as [[number, number], [number, number]],
      attribution: 'Copernicus Sentinel-2 • 10m Ground Sampling Distance',
    },
    source: 'Sentinel-2 Remote Sensing Simulator',
    cloud_filtering_applied: true,
    sensor: 'Sentinel-2 MSI L2A',
    resolution: '10m Ground Sampling Distance',
  };
}
