import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Maximize2,
  Layers,
  ZoomIn,
  ZoomOut,
  MousePointer2,
  PenTool,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  Crosshair,
} from 'lucide-react';

interface DecidingAreaMapProps {
  onOptimizeFarm: (zoneId: string) => void;
  onOpenAnalysis: () => void;
}

interface FieldZone {
  id: string;
  name: string;
  areaHa: number;
  status: 'Healthy' | 'Mild' | 'Risk';
  stressType: string;
  yieldEst: number; // T/ha
  polygonPoints: string;
  pinCoords: { x: number; y: number };
  color: string;
  soilRadar: {
    N: number;
    P: number;
    K: number;
    pH: number;
    organic: number;
  };
}

const FIELD_ZONES: FieldZone[] = [
  {
    id: 'zone-1',
    name: 'Agriculture Zone 1',
    areaHa: 210,
    status: 'Mild',
    stressType: 'Insect / Mild Stress',
    yieldEst: 1.8,
    polygonPoints: '180,120 340,90 380,240 220,280',
    pinCoords: { x: 280, y: 170 },
    color: '#8b5cf6', // purple dot like in image
    soilRadar: { N: 78, P: 52, K: 42, pH: 6.8, organic: 65 },
  },
  {
    id: 'zone-2',
    name: 'Agriculture Zone 2',
    areaHa: 115,
    status: 'Healthy',
    stressType: 'Optimal Photosynthesis',
    yieldEst: 2.4,
    polygonPoints: '410,80 580,60 620,210 440,230',
    pinCoords: { x: 510, y: 140 },
    color: '#10b981', // green dot
    soilRadar: { N: 90, P: 60, K: 55, pH: 7.1, organic: 80 },
  },
  {
    id: 'zone-3',
    name: 'Agriculture Zone 3',
    areaHa: 98,
    status: 'Risk',
    stressType: 'Soil Moisture Deficit',
    yieldEst: 1.2,
    polygonPoints: '240,320 400,280 430,420 260,450',
    pinCoords: { x: 330, y: 360 },
    color: '#ef4444', // red dot
    soilRadar: { N: 62, P: 40, K: 30, pH: 5.9, organic: 45 },
  },
  {
    id: 'zone-4',
    name: 'Agriculture Zone 4',
    areaHa: 74,
    status: 'Mild',
    stressType: 'Nitrogen Depletion',
    yieldEst: 1.9,
    polygonPoints: '450,260 630,230 670,390 480,410',
    pinCoords: { x: 550, y: 320 },
    color: '#f59e0b', // amber
    soilRadar: { N: 55, P: 65, K: 50, pH: 6.5, organic: 70 },
  },
  {
    id: 'zone-5',
    name: 'Agriculture Zone 5',
    areaHa: 89,
    status: 'Healthy',
    stressType: 'Vigorous Canopy',
    yieldEst: 2.6,
    polygonPoints: '680,210 840,190 890,360 720,380',
    pinCoords: { x: 770, y: 270 },
    color: '#10b981', // green
    soilRadar: { N: 95, P: 58, K: 60, pH: 7.2, organic: 85 },
  },
];

export const DecidingAreaMap: React.FC<DecidingAreaMapProps> = ({
  onOptimizeFarm,
  onOpenAnalysis,
}) => {
  const [activeTab, setActiveTab] = useState<'ZONE' | 'COMMUNITY' | 'GARDENING'>('ZONE');
  const [selectedZone, setSelectedZone] = useState<FieldZone>(FIELD_ZONES[0]);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeTool, setActiveTool] = useState<'pin' | 'polygon' | 'pointer'>('pointer');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Radar chart mathematical points calculator for 5 axes
  const getRadarPath = (radar: { N: number; P: number; K: number; pH: number; organic: number }) => {
    const cx = 90;
    const cy = 90;
    const rMax = 65;

    // 5 axes: Top (N), Top-Right (K), Bottom-Right (Organic), Bottom-Left (P), Top-Left (pH)
    const angles = [-Math.PI / 2, -Math.PI / 10, (3 * Math.PI) / 10, (7 * Math.PI) / 10, (11 * Math.PI) / 10];
    const vals = [radar.N / 100, radar.K / 100, radar.organic / 100, radar.P / 100, (radar.pH - 4) / 5];

    const points = angles.map((ang, i) => {
      const val = Math.max(0.2, Math.min(1.0, vals[i]));
      const x = cx + rMax * val * Math.cos(ang);
      const y = cy + rMax * val * Math.sin(ang);
      return `${Math.round(x)},${Math.round(y)}`;
    });

    return points.join(' ');
  };

  return (
    <section className="relative w-full min-h-[90vh] bg-stone-900 overflow-hidden flex flex-col text-stone-100 border-b border-stone-800">
      
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between gap-3 pointer-events-none">
        
        {/* Search Bar & Area Info */}
        <div className="pointer-events-auto flex items-center gap-2 p-1.5 rounded-2xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-stone-200/80 dark:border-stone-700/80 shadow-xl max-w-md w-full">
          <Search className="w-4 h-4 text-stone-400 ml-2.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search agricultural parcel, zone, or GPS coords..."
            className="w-full bg-transparent text-xs text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none px-2 py-1"
          />
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500 uppercase tracking-wider shrink-0 mr-1">
            Lat 16.85°N
          </span>
        </div>

        {/* Center/Right Map Utility Tools */}
        <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-2xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-stone-200/80 dark:border-stone-700/80 shadow-xl">
          <button
            onClick={() => setActiveTool('pointer')}
            title="Select Parcel"
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              activeTool === 'pointer'
                ? 'bg-stone-900 text-white dark:bg-emerald-600'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <MousePointer2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTool('pin')}
            title="Drop Sensor Pin"
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              activeTool === 'pin'
                ? 'bg-stone-900 text-white dark:bg-emerald-600'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTool('polygon')}
            title="Draw Field Boundary"
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              activeTool === 'polygon'
                ? 'bg-stone-900 text-white dark:bg-emerald-600'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <PenTool className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-stone-200 dark:bg-stone-700 mx-1"></div>

          <button
            onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
            title="Zoom In"
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
            title="Zoom Out"
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-[10px] font-mono font-bold text-stone-500 px-2">
            {zoomLevel}%
          </span>
        </div>

      </div>

      {/* Main Map Viewport with Aerial Agricultural Landscape */}
      <div className="relative flex-1 w-full h-full min-h-[750px] overflow-hidden">
        
        {/* Ultra-crisp aerial satellite farm background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&auto=format&fit=crop&q=85')`,
            filter: 'brightness(0.85) contrast(1.15) saturate(1.2)',
            transform: `scale(${zoomLevel / 100})`,
          }}
        />

        {/* Soft dark gradient overlays for maximum UI legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 via-transparent to-stone-950/50 pointer-events-none" />

        {/* SVG Interactive Parcel Overlay Layer */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-auto"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Soft parcel glowing filters */}
            <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#22c55e" floodOpacity="0.6" />
            </filter>
            <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#a855f7" floodOpacity="0.6" />
            </filter>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ef4444" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Interactive Field Boundary Polygons */}
          {FIELD_ZONES.map((zone) => {
            const isSelected = selectedZone.id === zone.id;
            const filterId =
              zone.status === 'Healthy'
                ? 'url(#glow-green)'
                : zone.status === 'Risk'
                ? 'url(#glow-red)'
                : 'url(#glow-purple)';

            return (
              <g key={zone.id} className="cursor-pointer" onClick={() => setSelectedZone(zone)}>
                {/* Polygon Boundary Fill & Outline */}
                <polygon
                  points={zone.polygonPoints}
                  fill={isSelected ? 'rgba(212, 248, 67, 0.22)' : 'rgba(255, 255, 255, 0.08)'}
                  stroke={isSelected ? '#D4F843' : zone.color}
                  strokeWidth={isSelected ? '3.5' : '2'}
                  strokeDasharray={isSelected ? 'none' : '6 4'}
                  filter={isSelected ? 'url(#glow-green)' : filterId}
                  className="transition-all duration-300 hover:fill-emerald-500/25"
                />

                {/* Status Pin Dot on Parcel */}
                <circle
                  cx={zone.pinCoords.x}
                  cy={zone.pinCoords.y}
                  r="7"
                  fill={zone.color}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="transition-transform duration-300 hover:scale-125"
                />

                {/* Zone Label Marker */}
                <text
                  x={zone.pinCoords.x + 12}
                  y={zone.pinCoords.y + 4}
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="bold"
                  className="select-none pointer-events-none drop-shadow-md font-sans"
                >
                  {zone.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* 1. Left Floating Card: "Field Automation" */}
        <div className="absolute top-20 left-4 sm:left-8 z-20 w-full max-w-[340px] sm:max-w-[360px] p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-200/90 dark:border-stone-700 shadow-2xl text-stone-900 dark:text-white animate-fade-in">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="font-extrabold text-sm tracking-tight text-stone-900 dark:text-white">
                  Field Automation
                </h3>
              </div>
              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mt-0.5">
                {selectedZone.name}
              </p>
            </div>

            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              JUL 7, 2026
            </span>
          </div>

          {/* 3 Nav Tabs: ZONE, COMMUNITY, GARDENING */}
          <div className="grid grid-cols-3 gap-1 my-3 p-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-[10px] font-bold">
            {(['ZONE', 'COMMUNITY', 'GARDENING'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white shadow-xs font-black'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Soil Health Suggestion (Interactive Radar Chart) */}
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/60 mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-400">
                ::: Soil Health Suggestion
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                N-P-K Equilibrium
              </span>
            </div>

            {/* SVG 5-Axis Radar Diagram */}
            <div className="relative w-full h-[140px] flex items-center justify-center">
              <svg className="w-[180px] h-[140px]" viewBox="0 0 180 180">
                {/* Concentric Web Rings */}
                <circle cx="90" cy="90" r="22" fill="none" stroke="#e2e8f0" strokeDasharray="3 3" />
                <circle cx="90" cy="90" r="44" fill="none" stroke="#e2e8f0" strokeDasharray="3 3" />
                <circle cx="90" cy="90" r="65" fill="none" stroke="#cbd5e1" />

                {/* 5 Axis Spokes */}
                <line x1="90" y1="90" x2="90" y2="25" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="90" y1="90" x2="152" y2="70" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="90" y1="90" x2="128" y2="145" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="90" y1="90" x2="52" y2="145" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="90" y1="90" x2="28" y2="70" stroke="#cbd5e1" strokeWidth="1" />

                {/* Radar Data Polygon */}
                <polygon
                  points={getRadarPath(selectedZone.soilRadar)}
                  fill="rgba(34, 197, 94, 0.35)"
                  stroke="#22c55e"
                  strokeWidth="2.5"
                  className="transition-all duration-500"
                />

                {/* Axis Labels */}
                <text x="90" y="18" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#64748b">
                  N (Nitrogen)
                </text>
                <text x="156" y="70" textAnchor="start" fontSize="9" fontWeight="bold" fill="#64748b">
                  K (Potash)
                </text>
                <text x="132" y="160" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#64748b">
                  Organic C
                </text>
                <text x="48" y="160" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#64748b">
                  P (Phos)
                </text>
                <text x="24" y="70" textAnchor="end" fontSize="9" fontWeight="bold" fill="#64748b">
                  pH
                </text>
              </svg>
            </div>
          </div>

          {/* Plant Stress Meter */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-[10px] font-bold mb-1">
              <span className="text-stone-500 uppercase tracking-wider">Plant Stress Level</span>
              <span className={selectedZone.status === 'Risk' ? 'text-rose-500' : 'text-emerald-600'}>
                {selectedZone.status === 'Risk' ? 'High Stress (68%)' : 'Normal / Low (28%)'}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  selectedZone.status === 'Risk' ? 'w-2/3 bg-rose-500' : 'w-1/4 bg-emerald-500'
                }`}
              />
            </div>
          </div>

          {/* Predicted Area Detected Table */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-1.5">
              ::: Predicted Area Detected
            </span>

            <div className="max-h-[140px] overflow-y-auto space-y-1 pr-1 text-[11px]">
              {FIELD_ZONES.map((z) => {
                const isItemActive = selectedZone.id === z.id;
                return (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setSelectedZone(z)}
                    className={`w-full p-2 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                      isItemActive
                        ? 'bg-stone-900 text-white dark:bg-emerald-950 dark:border-emerald-700'
                        : 'bg-white dark:bg-stone-800/80 border-stone-200/80 dark:border-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{z.name}</div>
                      <div className="text-[9px] text-stone-400">{z.stressType}</div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold">{z.areaHa} ha</div>
                      <div
                        className={`text-[9px] font-extrabold ${
                          z.status === 'Healthy'
                            ? 'text-emerald-500'
                            : z.status === 'Risk'
                            ? 'text-rose-500'
                            : 'text-amber-500'
                        }`}
                      >
                        {z.yieldEst} T/ha
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* 2. Anchored Field Alert Card (The exact "Crop Health Alert" from the screenshot) */}
        <div className="absolute top-24 right-6 sm:right-16 z-20 w-full max-w-[290px] sm:max-w-[310px] p-5 rounded-3xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-200 dark:border-stone-700 shadow-2xl animate-fade-in text-stone-900 dark:text-white">
          
          {/* Header */}
          <div className="flex items-center justify-between text-[11px] mb-2">
            <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-rose-500">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              <span>::: Crop Health Alert</span>
            </div>
            <span className="text-[10px] font-mono text-stone-400 font-bold">
              JUL 7, 2026
            </span>
          </div>

          {/* Title */}
          <h4 className="text-base font-black text-stone-900 dark:text-white tracking-tight">
            {selectedZone.name}
          </h4>

          {/* Metadata */}
          <div className="mt-3 space-y-1.5 text-xs text-stone-600 dark:text-stone-300 pb-3 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <span className="text-stone-400 text-[11px]">Identified:</span>
              <strong className="text-stone-900 dark:text-white font-mono text-[11px]">
                JUL 5 – JUL 7, 2026
              </strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-stone-400 text-[11px]">Parameters:</span>
              <strong className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px]">
                {selectedZone.areaHa} ha • {selectedZone.yieldEst} T/ha Yield
              </strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-stone-400 text-[11px]">Vegetative Index:</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                NDVI 0.82 Stable
              </span>
            </div>
          </div>

          {/* Action CTA Button: "OPTIMIZE MY FARM" */}
          <button
            onClick={() => {
              onOptimizeFarm(selectedZone.id);
              onOpenAnalysis();
            }}
            className="mt-4 w-full py-3 px-4 rounded-2xl bg-stone-950 hover:bg-black text-[#D4F843] dark:bg-lime-400 dark:text-stone-950 dark:hover:bg-lime-300 font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Optimize My Farm</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>

    </section>
  );
};
