import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Fix leaflet's broken default icons in bundlers
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FieldSelection {
  coordinates: [number, number][];
  centroid: [number, number];
  latitude: number;
  longitude: number;
  areaHectares: number;
  areaAcres: number;
}

interface FieldSelectionMapProps {
  onFieldSelected?: (field: FieldSelection | null) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
}

// ─── Geo helpers ─────────────────────────────────────────────────────────────

function computeAreaHectares(coords: [number, number][]): number {
  if (coords.length < 3) return 0;
  const R = 6378137; // metres
  let area = 0;
  const n = coords.length;

  for (let i = 0; i < n; i++) {
    const [lat1, lon1] = coords[i].map((d) => (d * Math.PI) / 180);
    const [lat2, lon2] = coords[(i + 1) % n].map((d) => (d * Math.PI) / 180);
    area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  area = Math.abs((area * R * R) / 2);
  return area / 10000; // m² → ha
}

function computeCentroid(coords: [number, number][]): [number, number] {
  const n = coords.length;
  let lat = 0;
  let lng = 0;
  coords.forEach(([la, lo]) => {
    lat += la;
    lng += lo;
  });
  return [lat / n, lng / n];
}

// ─── Sub-component: moves the map to a searched location ─────────────────────

function FlyToLocation({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

// ─── Search bar (Nominatim) ───────────────────────────────────────────────────

interface SearchBarProps {
  onResult: (center: [number, number], label: string) => void;
}

function SearchBar({ onResult }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
      const res = await fetch(url, {
        headers: { 'Accept-Language': 'en', 'User-Agent': 'KshetraAI-FieldMapper/1.0' },
      });
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        onResult([parseFloat(lat), parseFloat(lon)], display_name);
      } else {
        setError('Location not found. Try entering a city or pin code.');
      }
    } catch {
      setError('Search temporarily unavailable. Please navigate on map.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative flex items-center gap-2 w-full max-w-xl">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search farm location, district, or coordinates..."
          className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold bg-stone-50 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D8F946] transition-all"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2.5 rounded-xl bg-[#323D26] hover:bg-[#27321D] dark:bg-[#D8F946] dark:hover:bg-[#cbf033] text-[#D8F946] dark:text-[#191E19] text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 shrink-0 cursor-pointer shadow-sm hover:scale-[1.02]"
      >
        {loading ? 'Locating...' : 'Search'}
      </button>
      {error && (
        <span className="absolute -bottom-5 left-2 text-[10px] text-rose-500 font-bold">{error}</span>
      )}
    </form>
  );
}

// ─── Info Panel ───────────────────────────────────────────────────────────────

interface InfoPanelProps {
  field: FieldSelection | null;
  onClear: () => void;
}

function InfoPanel({ field, onClear }: InfoPanelProps) {
  if (!field) {
    return (
      <div className="p-6 rounded-[1.5rem] bg-stone-50 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800 text-center shadow-xs flex flex-col justify-center min-h-[220px]">
        <div className="w-12 h-12 rounded-2xl bg-[#323D26] text-[#D8F946] flex items-center justify-center mx-auto mb-3 shadow-sm">
          <PolygonIcon className="w-6 h-6" />
        </div>
        <p className="text-sm font-black text-stone-900 dark:text-white mb-1">No Field Selected</p>
        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed max-w-xs mx-auto">
          Click the <strong className="text-[#323D26] dark:text-[#D8F946]">polygon tool (⬟)</strong> on the top-left map toolbar and outline your crop parcel.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-[1.5rem] bg-[#D8F946] text-[#191E19] border-2 border-[#323D26] shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#323D26] animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-widest text-[#323D26]">
              Field Boundary Measured
            </span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-white/70 px-2 py-0.5 rounded-md text-[#323D26]">
            Active Polygon
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/80 dark:bg-white/90 rounded-xl p-3 shadow-xs">
            <p className="text-[10px] font-black uppercase tracking-wider text-[#323D26]/70 mb-0.5">Calculated Area</p>
            <p className="text-2xl font-black text-[#191E19] leading-tight font-mono">
              {field.areaHectares.toFixed(2)}
            </p>
            <p className="text-[10px] text-[#323D26] font-bold">hectares</p>
          </div>
          <div className="bg-white/80 dark:bg-white/90 rounded-xl p-3 shadow-xs">
            <p className="text-[10px] font-black uppercase tracking-wider text-[#323D26]/70 mb-0.5">Calculated Area</p>
            <p className="text-2xl font-black text-[#191E19] leading-tight font-mono">
              {field.areaAcres.toFixed(2)}
            </p>
            <p className="text-[10px] text-[#323D26] font-bold">acres</p>
          </div>
          <div className="bg-white/80 dark:bg-white/90 rounded-xl p-3 shadow-xs">
            <p className="text-[10px] font-black uppercase tracking-wider text-[#323D26]/70 mb-0.5">Centroid Lat</p>
            <p className="text-xs font-black text-[#191E19] font-mono">{field.latitude.toFixed(5)}° N</p>
          </div>
          <div className="bg-white/80 dark:bg-white/90 rounded-xl p-3 shadow-xs">
            <p className="text-[10px] font-black uppercase tracking-wider text-[#323D26]/70 mb-0.5">Centroid Lng</p>
            <p className="text-xs font-black text-[#191E19] font-mono">{field.longitude.toFixed(5)}° E</p>
          </div>
        </div>
      </div>

      <button
        onClick={onClear}
        className="w-full py-2.5 rounded-xl bg-[#323D26] hover:bg-[#27321D] text-[#D8F946] font-black uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer hover:scale-[1.01]"
      >
        Clear &amp; Draw New Boundary
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const FieldSelectionMap: React.FC<FieldSelectionMapProps> = ({
  onFieldSelected,
  initialCenter = [16.8524, 74.5815], // Default: Sangli, Maharashtra
  initialZoom = 13,
}) => {
  const [selectedField, setSelectedField] = useState<FieldSelection | null>(null);
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
  const [searchMarker, setSearchMarker] = useState<[number, number] | null>(null);
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);

  const handleCreated = useCallback(
    (e: { layer: L.Polygon }) => {
      const polygon = e.layer;
      const latLngs = polygon.getLatLngs()[0] as L.LatLng[];
      const coords: [number, number][] = latLngs.map((ll) => [ll.lat, ll.lng]);
      const centroid = computeCentroid(coords);
      const areaHectares = computeAreaHectares(coords);
      const field: FieldSelection = {
        coordinates: coords,
        centroid,
        latitude: centroid[0],
        longitude: centroid[1],
        areaHectares,
        areaAcres: areaHectares * 2.47105,
      };
      setSelectedField(field);
      onFieldSelected?.(field);
    },
    [onFieldSelected]
  );

  const handleEdited = useCallback(
    (e: { layers: L.LayerGroup }) => {
      e.layers.eachLayer((layer) => {
        if (layer instanceof L.Polygon) {
          const latLngs = layer.getLatLngs()[0] as L.LatLng[];
          const coords: [number, number][] = latLngs.map((ll) => [ll.lat, ll.lng]);
          const centroid = computeCentroid(coords);
          const areaHectares = computeAreaHectares(coords);
          const field: FieldSelection = {
            coordinates: coords,
            centroid,
            latitude: centroid[0],
            longitude: centroid[1],
            areaHectares,
            areaAcres: areaHectares * 2.47105,
          };
          setSelectedField(field);
          onFieldSelected?.(field);
        }
      });
    },
    [onFieldSelected]
  );

  const handleDeleted = useCallback(() => {
    setSelectedField(null);
    onFieldSelected?.(null);
  }, [onFieldSelected]);

  const handleClear = useCallback(() => {
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers();
    }
    setSelectedField(null);
    onFieldSelected?.(null);
  }, [onFieldSelected]);

  const handleSearchResult = useCallback((center: [number, number]) => {
    setFlyTarget(center);
    setSearchMarker(center);
  }, []);

  return (
    <div className="w-full bg-white dark:bg-[#191E19] p-6 sm:p-8 rounded-[2rem] border border-stone-200/80 dark:border-stone-800 shadow-sm transition-colors">
      
      {/* Top Bar: Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D8F946] animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-widest text-[#323D26] dark:text-[#D8F946]">
              Satellite Field Boundary Selector
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#191E19] dark:text-white tracking-tight">
            Draw Your Agricultural Parcel
          </h2>
        </div>

        <SearchBar onResult={handleSearchResult} />
      </div>

      {/* Map & Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Map Container */}
        <div className="lg:col-span-8 relative rounded-[1.75rem] overflow-hidden border-2 border-stone-200 dark:border-stone-800 shadow-md" style={{ height: '480px' }}>
          <MapContainer
            center={initialCenter}
            zoom={initialZoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              opacity={0.55}
            />

            <FlyToLocation center={flyTarget} />

            {searchMarker && (
              <Marker position={searchMarker}>
                <Popup>📍 Searched Point<br />Lat: {searchMarker[0].toFixed(5)}, Lng: {searchMarker[1].toFixed(5)}</Popup>
              </Marker>
            )}

            <FeatureGroup ref={featureGroupRef}>
              <EditControl
                position="topleft"
                onCreated={handleCreated}
                onEdited={handleEdited}
                onDeleted={handleDeleted}
                draw={{
                  polygon: {
                    allowIntersection: false,
                    shapeOptions: {
                      color: '#323D26',
                      fillColor: '#D8F946',
                      fillOpacity: 0.35,
                      weight: 3,
                    },
                    showLength: true,
                  },
                  polyline: false,
                  rectangle: false,
                  circle: false,
                  circlemarker: false,
                  marker: false,
                }}
                edit={{
                  featureGroup: featureGroupRef.current as L.FeatureGroup,
                }}
              />
            </FeatureGroup>
          </MapContainer>
        </div>

        {/* Info & Step-by-Step Instructions */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <InfoPanel field={selectedField} onClear={handleClear} />

          <div className="p-5 rounded-[1.5rem] bg-stone-50/80 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800">
            <p className="text-xs font-black uppercase tracking-widest text-[#323D26] dark:text-[#D8F946] mb-3">
              How to Map Your Field
            </p>
            <ol className="space-y-2.5 text-xs font-medium text-stone-600 dark:text-stone-400">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#323D26] text-[#D8F946] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Type your village or coordinates into the search box.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#323D26] text-[#D8F946] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>Zoom into your field using scroll or the map +/− controls.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#323D26] text-[#D8F946] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>Click the <strong>Polygon icon (⬟)</strong> on the upper-left toolbar.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#323D26] text-[#D8F946] text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">4</span>
                <span>Click around field edges and double-click to finalize.</span>
              </li>
            </ol>
          </div>
        </div>

      </div>

    </div>
  );
};

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function PolygonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
    </svg>
  );
}
