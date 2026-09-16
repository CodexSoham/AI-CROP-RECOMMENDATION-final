import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Marker,
  Popup,
  Polygon,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import {
  MapPin,
  Layers,
  Sparkles,
  Compass,
  Maximize2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Satellite,
  Navigation,
  Globe,
} from 'lucide-react';

// Fix leaflet default icon paths
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom glowing pin icon for AgroXAI
const fieldPinIcon = new L.DivIcon({
  className: 'custom-pin-marker',
  html: `
    <div style="
      position: relative;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        position: absolute;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(216, 249, 70, 0.4);
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
      <div style="
        position: relative;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #323D26;
        border: 2px solid #D8F946;
        box-shadow: 0 0 12px rgba(216,249,70,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 8px; height: 8px; border-radius: 50%; background: #D8F946;"></div>
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

export interface SelectedFieldData {
  latitude: number;
  longitude: number;
  areaHectares: number;
  areaAcres: number;
  mode: 'pin' | 'polygon';
  polygonCoords?: [number, number][];
  regionName?: string;
}

interface FieldMapSelectorProps {
  onFieldSelected: (data: SelectedFieldData) => void;
  isLoading?: boolean;
  selectedLat?: number;
  selectedLon?: number;
}

const REGIONAL_PRESETS = [
  { name: 'Sangli Sugarcane Belt (MH)', lat: 16.8524, lon: 74.5815, area: 2.8 },
  { name: 'Nashik Grape Vineyards (MH)', lat: 19.9975, lon: 73.7898, area: 3.5 },
  { name: 'Punjab Wheat Plains (PB)', lat: 30.9010, lon: 75.8573, area: 6.2 },
  { name: 'Mysuru Coffee Highlands (KA)', lat: 12.2958, lon: 76.6394, area: 4.1 },
  { name: 'Vidarbha Cotton Belt (MH)', lat: 20.7453, lon: 78.6022, area: 5.0 },
];

function MapPanController({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom || map.getZoom(), { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

function ClickToPinHandler({ onPinPlaced }: { onPinPlaced: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onPinPlaced(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function FieldMapSelector({
  onFieldSelected,
  isLoading = false,
  selectedLat = 16.8524,
  selectedLon = 74.5815,
}: FieldMapSelectorProps) {
  const [mapType, setMapType] = useState<'satellite' | 'street'>('satellite');
  const [activeCoords, setActiveCoords] = useState<[number, number]>([selectedLat, selectedLon]);
  const [drawnPolygon, setDrawnPolygon] = useState<[number, number][] | null>(null);
  const [fieldAreaHa, setFieldAreaHa] = useState<number>(2.4);
  const [selectionMode, setSelectionMode] = useState<'pin' | 'polygon'>('pin');
  const [activePreset, setActivePreset] = useState<string>('Sangli Sugarcane Belt (MH)');
  const featureGroupRef = useRef<L.FeatureGroup>(null);

  // Polygon area calculation in hectares
  const calculatePolygonArea = (latlngs: [number, number][]): number => {
    if (latlngs.length < 3) return 0;
    const R = 6378137;
    let area = 0;
    const n = latlngs.length;
    for (let i = 0; i < n; i++) {
      const [lat1, lon1] = latlngs[i].map((d) => (d * Math.PI) / 180);
      const [lat2, lon2] = latlngs[(i + 1) % n].map((d) => (d * Math.PI) / 180);
      area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }
    area = Math.abs((area * R * R) / 2);
    return Math.round((area / 10000) * 100) / 100;
  };

  // Polygon centroid calculation
  const calculateCentroid = (latlngs: [number, number][]): [number, number] => {
    const n = latlngs.length;
    let lat = 0;
    let lon = 0;
    for (const [la, lo] of latlngs) {
      lat += la;
      lon += lo;
    }
    return [lat / n, lon / n];
  };

  const handlePinPlaced = useCallback((lat: number, lon: number) => {
    setActiveCoords([lat, lon]);
    setDrawnPolygon(null);
    setSelectionMode('pin');
    setActivePreset('Custom Coordinate');
    onFieldSelected({
      latitude: Number(lat.toFixed(5)),
      longitude: Number(lon.toFixed(5)),
      areaHectares: fieldAreaHa,
      areaAcres: Math.round(fieldAreaHa * 2.471 * 100) / 100,
      mode: 'pin',
      regionName: 'Selected GPS Pin',
    });
  }, [fieldAreaHa, onFieldSelected]);

  const handleCreated = (e: any) => {
    const layer = e.layer;
    if (e.layerType === 'polygon' || e.layerType === 'rectangle') {
      const latlngs: L.LatLng[] = layer.getLatLngs()[0];
      const coords: [number, number][] = latlngs.map((ll) => [ll.lat, ll.lng]);
      const areaHa = calculatePolygonArea(coords);
      const centroid = calculateCentroid(coords);

      setDrawnPolygon(coords);
      setFieldAreaHa(areaHa || 1.5);
      setActiveCoords(centroid);
      setSelectionMode('polygon');
      setActivePreset('Custom Drawn Field');

      onFieldSelected({
        latitude: Number(centroid[0].toFixed(5)),
        longitude: Number(centroid[1].toFixed(5)),
        areaHectares: areaHa || 1.5,
        areaAcres: Math.round((areaHa || 1.5) * 2.471 * 100) / 100,
        mode: 'polygon',
        polygonCoords: coords,
        regionName: `Drawn Plot (${(areaHa || 1.5).toFixed(2)} ha)`,
      });
    }
  };

  const handleSelectPreset = (preset: typeof REGIONAL_PRESETS[0]) => {
    setActiveCoords([preset.lat, preset.lon]);
    setDrawnPolygon(null);
    setFieldAreaHa(preset.area);
    setSelectionMode('pin');
    setActivePreset(preset.name);
    onFieldSelected({
      latitude: preset.lat,
      longitude: preset.lon,
      areaHectares: preset.area,
      areaAcres: Math.round(preset.area * 2.471 * 100) / 100,
      mode: 'pin',
      regionName: preset.name,
    });
  };

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-[#131A14] border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden flex flex-col">
      {/* Top Header Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 bg-[#FBFBFA] dark:bg-[#162018] flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#323D26] text-[#D8F946] dark:bg-[#D8F946] dark:text-[#323D26]">
              <Satellite className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                Interactive GIS Field Selection Map
                <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider bg-lime-400/20 text-lime-700 dark:text-lime-400 border border-lime-400/30">
                  Live SoilGrids & Weather Ingestion
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Click map to drop pin or draw a custom polygon boundary to auto-retrieve soil chemistry & climate data.
              </p>
            </div>
          </div>
        </div>

        {/* Map Type Switcher & Action Tools */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-stone-300 dark:border-stone-700 p-0.5 bg-stone-100 dark:bg-stone-800 text-xs font-semibold">
            <button
              onClick={() => setMapType('satellite')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                mapType === 'satellite'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Satellite className="w-3.5 h-3.5" />
              <span>Satellite</span>
            </button>
            <button
              onClick={() => setMapType('street')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                mapType === 'street'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Streets</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Region Selector Chips */}
      <div className="px-4 py-2.5 bg-stone-50 dark:bg-[#0E1510] border-b border-stone-200 dark:border-stone-800 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider text-[11px] whitespace-nowrap flex items-center gap-1">
          <Navigation className="w-3 h-3 text-[#D8F946]" />
          Regional Presets:
        </span>
        {REGIONAL_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handleSelectPreset(preset)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border cursor-pointer ${
              activePreset === preset.name
                ? 'bg-[#323D26] text-[#D8F946] border-[#323D26] dark:bg-[#D8F946] dark:text-[#323D26] dark:border-[#D8F946] font-bold shadow-xs'
                : 'bg-white dark:bg-[#1A241C] border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-400'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Main Interactive Map Viewport */}
      <div className="relative w-full h-[460px] sm:h-[500px]">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-[1000] bg-stone-950/70 backdrop-blur-sm flex flex-col items-center justify-center text-white animate-fade-in p-6">
            <div className="relative mb-4">
              <div className="w-16 h-16 rounded-full border-4 border-[#D8F946]/30 border-t-[#D8F946] animate-spin flex items-center justify-center"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Satellite className="w-6 h-6 text-[#D8F946] animate-pulse" />
              </div>
            </div>
            <div className="text-center max-w-md">
              <p className="text-base font-bold text-white mb-1">
                Querying Soil & Climate Ingestion Pipeline...
              </p>
              <p className="text-xs text-stone-300 font-mono mb-3">
                Fetching ISRIC SoilGrids 2.0 (pH, N, P, K) & Open-Meteo 16-day telemetry for [{activeCoords[0].toFixed(4)}°, {activeCoords[1].toFixed(4)}°]
              </p>
              <div className="w-48 h-1.5 bg-stone-800 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-[#D8F946] rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Live Coordinates Floating HUD */}
        <div className="absolute top-3 right-3 z-[900] bg-white/90 dark:bg-stone-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 shadow-lg text-xs flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-200 font-mono">
            <MapPin className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
            <span>{activeCoords[0].toFixed(5)}° N, {activeCoords[1].toFixed(5)}° E</span>
          </div>
          <span className="text-stone-300 dark:text-stone-700">|</span>
          <div className="text-stone-600 dark:text-stone-400">
            Area: <strong className="text-stone-900 dark:text-stone-100">{fieldAreaHa.toFixed(2)} ha</strong> ({Math.round(fieldAreaHa * 2.471 * 10) / 10} acres)
          </div>
        </div>

        {/* Leaflet Map */}
        <MapContainer
          center={activeCoords}
          zoom={14}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
        >
          <MapPanController center={activeCoords} />
          <ClickToPinHandler onPinPlaced={handlePinPlaced} />

          {/* Tile Layer Toggle */}
          {mapType === 'satellite' ? (
            <>
              <TileLayer
                attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
              <TileLayer
                url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
                opacity={0.7}
              />
            </>
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          )}

          {/* Drawing Tool */}
          <FeatureGroup ref={featureGroupRef}>
            <EditControl
              position="topleft"
              onCreated={handleCreated}
              draw={{
                rectangle: {
                  shapeOptions: {
                    color: '#D8F946',
                    fillColor: '#D8F946',
                    fillOpacity: 0.25,
                    weight: 2.5,
                  },
                },
                polygon: {
                  allowIntersection: false,
                  showArea: true,
                  shapeOptions: {
                    color: '#D8F946',
                    fillColor: '#D8F946',
                    fillOpacity: 0.25,
                    weight: 2.5,
                  },
                },
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
              }}
            />
          </FeatureGroup>

          {/* Drawn Polygon Display */}
          {drawnPolygon && (
            <Polygon
              positions={drawnPolygon}
              pathOptions={{
                color: '#D8F946',
                fillColor: '#D8F946',
                fillOpacity: 0.3,
                weight: 3,
                dashArray: '6, 6',
              }}
            >
              <Popup>
                <div className="text-xs p-1">
                  <strong>Selected Farm Field Polygon</strong>
                  <p>Centroid: {activeCoords[0].toFixed(4)}°, {activeCoords[1].toFixed(4)}°</p>
                  <p>Calculated Area: {fieldAreaHa} ha ({Math.round(fieldAreaHa * 2.471 * 10) / 10} acres)</p>
                </div>
              </Popup>
            </Polygon>
          )}

          {/* Centroid / Pin Marker */}
          <Marker position={activeCoords} icon={fieldPinIcon}>
            <Popup>
              <div className="text-xs p-1">
                <strong>{activePreset}</strong>
                <p className="font-mono text-stone-600">
                  Lat: {activeCoords[0].toFixed(5)}° | Lon: {activeCoords[1].toFixed(5)}°
                </p>
                <p className="text-lime-700 font-semibold mt-1">
                  ✓ Soil & Climate Ingestion Active
                </p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Bottom Summary & Trigger Bar */}
      <div className="p-4 bg-stone-50 dark:bg-[#162018] border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
          <CheckCircle2 className="w-4 h-4 text-lime-500 shrink-0" />
          <span>
            Selected Field: <strong>{activePreset}</strong> ({activeCoords[0].toFixed(4)}°, {activeCoords[1].toFixed(4)}°) • Mode: <span className="uppercase font-bold text-lime-600 dark:text-lime-400">{selectionMode}</span>
          </span>
        </div>

        <button
          onClick={() => {
            onFieldSelected({
              latitude: Number(activeCoords[0].toFixed(5)),
              longitude: Number(activeCoords[1].toFixed(5)),
              areaHectares: fieldAreaHa,
              areaAcres: Math.round(fieldAreaHa * 2.471 * 100) / 100,
              mode: selectionMode,
              polygonCoords: drawnPolygon || undefined,
              regionName: activePreset,
            });
          }}
          disabled={isLoading}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#323D26] hover:bg-[#27321D] text-[#D8F946] dark:bg-[#D8F946] dark:hover:bg-[#c9ea3b] dark:text-[#323D26] font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Querying Telemetry...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Trigger Soil & Climate Recommendation</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
