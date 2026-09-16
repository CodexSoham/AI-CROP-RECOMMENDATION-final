import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  ImageOverlay,
  Polygon,
  useMap,
} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import {
  Satellite,
  Layers,
  Sparkles,
  MapPin,
  Search,
  RotateCcw,
  Eye,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Maximize2,
  Compass,
  Crop,
  ShieldCheck,
} from 'lucide-react';
import {
  GeoJSONPolygon,
  FieldHealthResponse,
  PRESET_FIELDS,
  PresetField,
} from '../services/fieldHealthService';

// Fix Leaflet's marker icons in bundlers
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface SatelliteHealthMapProps {
  onPolygonCaptured: (polygon: GeoJSONPolygon, fieldName?: string) => void;
  healthData: FieldHealthResponse | null;
  isLoading: boolean;
  activeOverlayType: 'ndvi' | 'false_color';
  onToggleOverlayType: (type: 'ndvi' | 'false_color') => void;
}

// ─── Map Pan/Zoom Controller ────────────────────────────────────────────────
function FlyToPolygon({ bounds }: { bounds: [[number, number], [number, number]] | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.flyToBounds(bounds, { padding: [40, 40], maxZoom: 16, duration: 1.2 });
    }
  }, [bounds, map]);
  return null;
}

export const SatelliteHealthMap: React.FC<SatelliteHealthMapProps> = ({
  onPolygonCaptured,
  healthData,
  isLoading,
  activeOverlayType,
  onToggleOverlayType,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('sangli_sugarcane');
  const [activePolygon, setActivePolygon] = useState<GeoJSONPolygon>(PRESET_FIELDS[0].polygon);
  const [mapBaseLayer, setMapBaseLayer] = useState<'satellite' | 'streets'>('satellite');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.75);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const featureGroupRef = useRef<L.FeatureGroup | null>(null);

  // Initial trigger for default Sangli parcel on mount
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      onPolygonCaptured(PRESET_FIELDS[0].polygon, PRESET_FIELDS[0].name);
    }
  }, [onPolygonCaptured]);

  // Convert GeoJSON polygon coordinates [[[lon, lat], ...]] to Leaflet [lat, lon][]
  const leafletCoords: [number, number][] = activePolygon.coordinates[0].map(([lon, lat]) => [lat, lon]);

  // Handle preset field selection
  const handleSelectPreset = (preset: PresetField) => {
    setSelectedPresetId(preset.id);
    setActivePolygon(preset.polygon);
    onPolygonCaptured(preset.polygon, preset.name);
  };

  // Handle custom drawing on map with Leaflet Draw
  const handlePolygonCreated = useCallback(
    (e: { layer: L.Polygon }) => {
      const latLngs = e.layer.getLatLngs()[0] as L.LatLng[];
      if (!latLngs || latLngs.length < 3) return;

      // Convert Leaflet latLngs back to GeoJSON [[[lon, lat], ...]] with closed ring
      const geoCoords: [number, number][] = latLngs.map((ll) => [
        Math.round(ll.lng * 1000000) / 1000000,
        Math.round(ll.lat * 1000000) / 1000000,
      ]);
      // Ensure closing vertex matches first
      if (
        geoCoords[0][0] !== geoCoords[geoCoords.length - 1][0] ||
        geoCoords[0][1] !== geoCoords[geoCoords.length - 1][1]
      ) {
        geoCoords.push([geoCoords[0][0], geoCoords[0][1]]);
      }

      const newPoly: GeoJSONPolygon = {
        type: 'Polygon',
        coordinates: [geoCoords],
      };

      setSelectedPresetId('custom');
      setActivePolygon(newPoly);
      onPolygonCaptured(newPoly, 'Custom Drawn Field Parcel');
    },
    [onPolygonCaptured]
  );

  // Address geocoding search handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchError(null);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        searchQuery
      )}`;
      const res = await fetch(url, {
        headers: { 'Accept-Language': 'en', 'User-Agent': 'AdaptiveCrop-RemoteSensing/1.0' },
      });
      const data = await res.json();
      if (data && data.length > 0) {
        const cLat = parseFloat(data[0].lat);
        const cLon = parseFloat(data[0].lon);
        // Create an agricultural test parcel around the found coordinate
        const delta = 0.0035;
        const newPoly: GeoJSONPolygon = {
          type: 'Polygon',
          coordinates: [[
            [cLon - delta, cLat - delta],
            [cLon + delta, cLat - delta],
            [cLon + delta, cLat + delta],
            [cLon - delta, cLat + delta],
            [cLon - delta, cLat - delta],
          ]],
        };
        setSelectedPresetId('search');
        setActivePolygon(newPoly);
        onPolygonCaptured(newPoly, data[0].display_name.split(',')[0]);
      } else {
        setSearchError('Location not found. Try entering a city or district.');
      }
    } catch {
      setSearchError('Search service temporarily unavailable.');
    } finally {
      setSearchLoading(false);
    }
  };

  const overlayUrl =
    activeOverlayType === 'ndvi'
      ? healthData?.overlay?.ndvi_colormap_url
      : healthData?.overlay?.false_color_url;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ─── Top Control Toolbar: Presets, Search & Layer Switches ─────────────── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white dark:bg-[#131A14] p-4 rounded-2xl border border-stone-200/90 dark:border-stone-800/90 shadow-sm">
        {/* Preset Farm Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 shrink-0 flex items-center gap-1.5 mr-1">
            <Compass className="w-3.5 h-3.5 text-[#323D26] dark:text-[#D8F946]" />
            Reference Parcels:
          </span>
          {PRESET_FIELDS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#323D26] text-[#D8F946] dark:bg-[#D8F946] dark:text-[#191E19] shadow-sm font-black'
                    : 'bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative flex items-center gap-2 min-w-[260px] max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search farm location or district..."
              className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D8F946]"
            />
          </div>
          <button
            type="submit"
            disabled={searchLoading}
            className="px-3 py-1.5 rounded-xl bg-[#323D26] text-[#D8F946] dark:bg-[#D8F946] dark:text-[#191E19] text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 shrink-0 cursor-pointer shadow-xs"
          >
            {searchLoading ? 'Locating...' : 'Locate'}
          </button>
          {searchError && (
            <span className="absolute -bottom-4 left-2 text-[10px] text-rose-500 font-bold">{searchError}</span>
          )}
        </form>
      </div>

      {/* ─── Interactive Leaflet Map Container ───────────────────────────────── */}
      <div className="relative w-full h-[460px] sm:h-[520px] rounded-3xl overflow-hidden border-2 border-stone-200/90 dark:border-stone-800/80 shadow-lg group">
        
        {/* Loading Overlay State with Telemetry */}
        {isLoading && (
          <div className="absolute inset-0 z-[1000] bg-stone-950/70 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-fade-in">
            <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#D8F946]/20 border-t-[#D8F946] animate-spin" />
              <Satellite className="w-7 h-7 text-[#D8F946] animate-pulse" />
            </div>
            <p className="text-base font-black text-white mb-1 tracking-wide">
              Fetching Sentinel-2 Satellite Imagery &amp; NDVI statistics...
            </p>
            <p className="text-xs text-stone-300 max-w-md leading-relaxed">
              Querying Copernicus Sentinel-2 MSI L2A · Applying SCL cloud &amp; shadow filtering script · Calculating 60-day phenology metrics
            </p>
            <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-mono text-[#D8F946] border border-white/15">
              <span className="w-2 h-2 rounded-full bg-[#D8F946] animate-ping" />
              Evaluating (B08 - B04) / (B08 + B04) at 10m GSD
            </div>
          </div>
        )}

        {/* Map Header Floating Badge */}
        <div className="absolute top-4 left-4 z-[400] flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-2xl bg-stone-900/85 backdrop-blur-md border border-white/15 text-white shadow-md flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D8F946] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-[#D8F946]">
              Sentinel-2 Field Mapper
            </span>
            <span className="text-[10px] text-stone-300 font-medium pl-1 border-l border-white/20">
              Draw ⬟ polygon or select parcel
            </span>
          </div>
        </div>

        {/* Map Layer Controls Floating Island */}
        <div className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-2">
          {/* Base Layer Switch */}
          <div className="bg-stone-900/85 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 shadow-md flex items-center gap-1">
            <button
              onClick={() => setMapBaseLayer('satellite')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase transition-all cursor-pointer ${
                mapBaseLayer === 'satellite'
                  ? 'bg-[#D8F946] text-[#191E19] shadow-sm font-black'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapBaseLayer('streets')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase transition-all cursor-pointer ${
                mapBaseLayer === 'streets'
                  ? 'bg-[#D8F946] text-[#191E19] shadow-sm font-black'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Streets
            </button>
          </div>

          {/* Remote Sensing Overlay Switcher */}
          <div className="bg-stone-900/85 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 shadow-md flex items-center gap-1">
            <button
              onClick={() => onToggleOverlayType('ndvi')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                activeOverlayType === 'ndvi'
                  ? 'bg-emerald-500 text-white shadow-sm font-black'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              NDVI Heatmap
            </button>
            <button
              onClick={() => onToggleOverlayType('false_color')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                activeOverlayType === 'false_color'
                  ? 'bg-rose-500 text-white shadow-sm font-black'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              False-Color NIR
            </button>
          </div>

          {/* Overlay Opacity Slider */}
          {overlayUrl && (
            <div className="bg-stone-900/85 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/15 shadow-md flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-[10px] uppercase font-bold text-stone-300">Opacity:</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                className="w-16 accent-[#D8F946] cursor-pointer"
              />
              <span className="text-[10px] font-mono text-[#D8F946] w-6 text-right">
                {Math.round(overlayOpacity * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Leaflet Map Implementation */}
        <MapContainer
          center={leafletCoords[0]}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          {/* Base Tile Layer */}
          {mapBaseLayer === 'satellite' ? (
            <TileLayer
              attribution="Esri World Imagery &bull; Maxar, Earthstar Geographics"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}

          {/* Leaflet Draw Editing Layer */}
          <FeatureGroup ref={featureGroupRef}>
            <EditControl
              position="topleft"
              onCreated={handlePolygonCreated}
              draw={{
                rectangle: true,
                polygon: {
                  allowIntersection: false,
                  showArea: true,
                  shapeOptions: {
                    color: '#D8F946',
                    weight: 3,
                    fillColor: '#D8F946',
                    fillOpacity: 0.25,
                  },
                },
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
              }}
            />
          </FeatureGroup>

          {/* Active Field Polygon Boundary Outline */}
          <Polygon
            positions={leafletCoords}
            pathOptions={{
              color: activeOverlayType === 'ndvi' ? '#10b981' : '#f43f5e',
              weight: 3,
              dashArray: '5, 4',
              fillOpacity: overlayUrl ? 0.05 : 0.2,
              fillColor: activeOverlayType === 'ndvi' ? '#10b981' : '#f43f5e',
            }}
          />

          {/* Satellite Remote Sensing Raster Overlay (NDVI Heatmap or False-Color) */}
          {overlayUrl && healthData?.overlay?.bounds && (
            <ImageOverlay
              url={overlayUrl}
              bounds={healthData.overlay.bounds}
              opacity={overlayOpacity}
              zIndex={500}
            />
          )}

          {/* Camera Auto-Pan To Polygon */}
          {healthData?.field_metrics?.bounds && (
            <FlyToPolygon bounds={healthData.field_metrics.bounds} />
          )}
        </MapContainer>

        {/* Bottom NDVI Scale Legend Floating Ribbon */}
        <div className="absolute bottom-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-3 bg-stone-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-white shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-300">
              NDVI Scale:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-bold">
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                &lt; 0.2 Bare Soil
              </span>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                0.2–0.5 Stressed
              </span>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-lime-500/20 text-lime-400 border border-lime-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
                0.5–0.7 Moderate
              </span>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                &ge; 0.7 Healthy Canopy
              </span>
            </div>
          </div>

          {healthData && (
            <div className="flex items-center gap-3 text-[11px] font-mono text-stone-300">
              <span>
                Area: <strong className="text-white">{healthData.field_metrics.area_acres} ac</strong> ({healthData.field_metrics.area_hectares} ha)
              </span>
              <span className="text-stone-500">&bull;</span>
              <span className="flex items-center gap-1 text-[#D8F946]">
                <ShieldCheck className="w-3.5 h-3.5" />
                SCL Cloud Masked
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
