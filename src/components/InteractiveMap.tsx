import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Satellite,
  Layers,
  Compass,
  Sparkles,
  Loader2,
  Navigation,
  Globe,
  Database,
  CheckCircle2,
  Search,
  X,
} from 'lucide-react';

// Fix leaflet default marker icons in bundlers
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom glowing pin marker for selected GPS coordinate
const mapPinIcon = new L.DivIcon({
  className: 'interactive-map-marker',
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
        background: rgba(216, 249, 70, 0.45);
        animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
      <div style="
        position: relative;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #323D26;
        border: 2px solid #D8F946;
        box-shadow: 0 0 14px rgba(216,249,70,0.9);
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

export interface DatasetLocationPreset {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  dominantCrop: string;
  soilDescription: string;
  targetN: number;
  targetP: number;
  targetK: number;
  targetPh: number;
  targetRainfall: number;
}

// Pre-grounded National Reference Agricultural Zones
export const DATASET_REGIONS: DatasetLocationPreset[] = [
  {
    id: 'sangli-rice',
    name: 'Sangli Agro-Zone (MH)',
    state: 'Maharashtra',
    lat: 16.8524,
    lon: 74.5815,
    dominantCrop: 'Rice / Sugarcane',
    soilDescription: 'Black Vertisol (High clay, optimal moisture retention)',
    targetN: 82,
    targetP: 48,
    targetK: 41,
    targetPh: 6.5,
    targetRainfall: 202.9,
  },
  {
    id: 'punjab-wheat',
    name: 'Ludhiana Plains (PB)',
    state: 'Punjab',
    lat: 30.9010,
    lon: 75.8573,
    dominantCrop: 'Wheat / Maize',
    soilDescription: 'Alluvial Inceptisol (High organic matter, neutral pH)',
    targetN: 85,
    targetP: 50,
    targetK: 40,
    targetPh: 6.8,
    targetRainfall: 85.0,
  },
  {
    id: 'nashik-grape',
    name: 'Nashik Valley (MH)',
    state: 'Maharashtra',
    lat: 19.9975,
    lon: 73.7898,
    dominantCrop: 'Grapes / Pomegranate',
    soilDescription: 'Gravelly Loam (Rich in Potassium reserve)',
    targetN: 35,
    targetP: 130,
    targetK: 195,
    targetPh: 6.2,
    targetRainfall: 75.0,
  },
  {
    id: 'mysuru-coffee',
    name: 'Mysuru Highlands (KA)',
    state: 'Karnataka',
    lat: 12.2958,
    lon: 76.6394,
    dominantCrop: 'Coffee / Coconut',
    soilDescription: 'Lateritic Red Loam (Slightly acidic, high aeration)',
    targetN: 100,
    targetP: 28,
    targetK: 32,
    targetPh: 6.4,
    targetRainfall: 160.0,
  },
  {
    id: 'vidarbha-cotton',
    name: 'Wardha Cotton Belt (MH)',
    state: 'Maharashtra',
    lat: 20.7453,
    lon: 78.6022,
    dominantCrop: 'Cotton / Pigeonpeas',
    soilDescription: 'Deep Vertisol (High cation exchange, high nitrogen uptake)',
    targetN: 115,
    targetP: 50,
    targetK: 25,
    targetPh: 7.2,
    targetRainfall: 95.0,
  },
  {
    id: 'wb-jute',
    name: 'Hooghly Delta (WB)',
    state: 'West Bengal',
    lat: 22.9012,
    lon: 88.3967,
    dominantCrop: 'Jute / Rice',
    soilDescription: 'Deltaic Alluvial Loam (High seasonal rainfall & humidity)',
    targetN: 78,
    targetP: 45,
    targetK: 40,
    targetPh: 6.7,
    targetRainfall: 190.0,
  },
];

function MapPanController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 12, { duration: 1.2 });
  }, [center, map]);
  return null;
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface InteractiveMapProps {
  onLocationSelected: (lat: number, lon: number, locationName?: string) => void;
  isLoading?: boolean;
  activeLat: number;
  activeLon: number;
  activeLocationName?: string;
}

export function InteractiveMap({
  onLocationSelected,
  isLoading = false,
  activeLat,
  activeLon,
  activeLocationName = 'Selected Field Location',
}: InteractiveMapProps) {
  const [mapType, setMapType] = useState<'satellite' | 'street'>('satellite');
  const [currentCoords, setCurrentCoords] = useState<[number, number]>([activeLat, activeLon]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('sangli-rice');

  // Location search bar states
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentCoords([activeLat, activeLon]);
  }, [activeLat, activeLon]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMapClick = useCallback((lat: number, lon: number) => {
    const latRounded = Number(lat.toFixed(5));
    const lonRounded = Number(lon.toFixed(5));
    setCurrentCoords([latRounded, lonRounded]);
    setSelectedPresetId('');
    onLocationSelected(latRounded, lonRounded, `Custom Pin [${latRounded}°, ${lonRounded}°]`);
  }, [onLocationSelected]);

  const handlePresetSelect = (preset: DatasetLocationPreset) => {
    setCurrentCoords([preset.lat, preset.lon]);
    setSelectedPresetId(preset.id);
    setSearchQuery('');
    onLocationSelected(preset.lat, preset.lon, preset.name);
  };

  const handleLocationSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setIsSearching(true);
    setShowResults(false);

    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.length > 0) {
          setSearchResults(data);
          setShowResults(true);
        }
      }
    } catch (err) {
      console.warn('Geocoding search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (item: { display_name: string; lat: string; lon: string }) => {
    const lat = Number(parseFloat(item.lat).toFixed(5));
    const lon = Number(parseFloat(item.lon).toFixed(5));
    const shortName = item.display_name.split(',')[0] || item.display_name;

    setCurrentCoords([lat, lon]);
    setSelectedPresetId('');
    setShowResults(false);
    setSearchQuery(shortName);
    onLocationSelected(lat, lon, `${shortName} [${lat}°, ${lon}°]`);
  };

  return (
    <div className="w-full rounded-[2rem] bg-white dark:bg-[#131A14] border border-stone-200/90 dark:border-stone-800 shadow-xl overflow-hidden flex flex-col transition-colors">
      
      {/* Map Header Bar */}
      <div className="p-4 sm:p-6 bg-[#F4F3ED] dark:bg-[#162018] border-b border-stone-200/80 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#323D26] text-[#D8F946] dark:bg-[#D8F946] dark:text-[#323D26] shadow-sm">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-[#191E19] dark:text-white">
                Geospatial Field Ingestion
              </h3>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#D8F946] text-[#323D26] shadow-xs">
                Interactive Map
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Click anywhere on the map or search a location to extract coordinates and auto-ingest soil &amp; climate parameters.
            </p>
          </div>
        </div>

        {/* Satellite / Street Layer Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-stone-200/60 dark:bg-stone-800 border border-stone-300/60 dark:border-stone-700 text-xs font-bold">
          <button
            onClick={() => setMapType('satellite')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              mapType === 'satellite'
                ? 'bg-[#323D26] text-[#D8F946] dark:bg-[#D8F946] dark:text-[#323D26] shadow-xs font-black'
                : 'text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>Satellite</span>
          </button>
          <button
            onClick={() => setMapType('street')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              mapType === 'street'
                ? 'bg-[#323D26] text-[#D8F946] dark:bg-[#D8F946] dark:text-[#323D26] shadow-xs font-black'
                : 'text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Street</span>
          </button>
        </div>
      </div>

      {/* Global Location Search Bar */}
      <div className="px-4 sm:px-6 py-3 bg-white dark:bg-[#131A14] border-b border-stone-200/80 dark:border-stone-800 relative z-30">
        <form onSubmit={handleLocationSearch} className="relative flex items-center gap-2" ref={searchContainerRef}>
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any place, village, district, or region (e.g. Pune, Ludhiana, Nashik, Des Moines)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-stone-100/80 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-700 text-xs font-medium text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#323D26] dark:focus:ring-[#D8F946] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setShowResults(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="px-5 py-2.5 rounded-xl bg-[#323D26] hover:bg-[#27321D] text-[#D8F946] dark:bg-[#D8F946] dark:hover:bg-[#c9ea3b] dark:text-[#323D26] text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isSearching ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
            <span>Search</span>
          </button>

          {/* Autocomplete Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-white dark:bg-[#18221A] border border-stone-200 dark:border-stone-700 shadow-2xl overflow-hidden z-50">
              <div className="p-2 border-b border-stone-100 dark:border-stone-800 text-[10px] font-black uppercase tracking-wider text-stone-400">
                Matching Locations
              </div>
              <ul className="max-h-56 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/60">
                {searchResults.map((item, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => handleSelectSearchResult(item)}
                      className="w-full px-4 py-3 text-left hover:bg-[#D8F946]/15 dark:hover:bg-[#D8F946]/10 flex items-start gap-2.5 text-xs transition-colors cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-[#323D26] dark:text-[#D8F946] shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-stone-900 dark:text-white truncate">
                          {item.display_name.split(',')[0]}
                        </div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                          {item.display_name}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </div>

      {/* National Reference Zones Presets */}
      <div className="px-4 sm:px-6 py-2.5 bg-[#F4F3ED]/70 dark:bg-[#0E1510] border-b border-stone-200/80 dark:border-stone-800 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider text-[11px] whitespace-nowrap flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-[#323D26] dark:text-[#D8F946]" />
          Reference Zones:
        </span>
        {DATASET_REGIONS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetSelect(preset)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
              selectedPresetId === preset.id
                ? 'bg-[#323D26] text-[#D8F946] border-[#323D26] dark:bg-[#D8F946] dark:text-[#323D26] dark:border-[#D8F946] font-black shadow-xs'
                : 'bg-white dark:bg-[#18221A] border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-[#323D26] dark:hover:border-[#D8F946]'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Map Canvas Viewport */}
      <div className="relative w-full h-[380px] sm:h-[440px]">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-[1000] bg-stone-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white animate-fade-in p-6">
            <div className="relative mb-3">
              <div className="w-14 h-14 rounded-full border-4 border-[#D8F946]/30 border-t-[#D8F946] animate-spin flex items-center justify-center"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Satellite className="w-5 h-5 text-[#D8F946] animate-pulse" />
              </div>
            </div>
            <p className="text-sm font-bold text-white mb-1">
              Retrieving Digital Soil Chemistry &amp; Climate Telemetry...
            </p>
            <p className="text-xs text-stone-300 font-mono">
              Ingesting sub-surface metrics for [{currentCoords[0].toFixed(4)}°, {currentCoords[1].toFixed(4)}°]
            </p>
          </div>
        )}

        <MapContainer
          center={currentCoords}
          zoom={12}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%', zIndex: 10 }}
        >
          <MapPanController center={currentCoords} />
          <MapClickHandler onMapClick={handleMapClick} />

          {/* Tile Layer Based on Selected Mode */}
          {mapType === 'satellite' ? (
            <>
              <TileLayer
                attribution='&copy; CNES, Earthstar Geographics, Esri'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
              <TileLayer
                attribution=''
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
                opacity={0.65}
              />
            </>
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          )}

          {/* Active Field Pin */}
          <Marker position={currentCoords} icon={mapPinIcon}>
            <Popup>
              <div className="text-xs p-1">
                <strong>{activeLocationName}</strong>
                <p className="font-mono text-stone-600">
                  {currentCoords[0].toFixed(5)}° N, {currentCoords[1].toFixed(5)}° E
                </p>
                <p className="text-emerald-700 font-semibold mt-1">
                  ✓ Soil &amp; Climate Telemetry Ingested
                </p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Map Footer Action Status */}
      <div className="p-3.5 bg-[#F4F3ED]/80 dark:bg-[#162018] border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#323D26] dark:text-[#D8F946] shrink-0" />
          <span>
            Active Ingestion Point: <strong>{activeLocationName}</strong> ({currentCoords[0].toFixed(4)}°, {currentCoords[1].toFixed(4)}°)
          </span>
        </div>
        <span className="text-[11px] text-stone-500 dark:text-stone-400">
          Click any field or search to reposition pin
        </span>
      </div>
    </div>
  );
}
