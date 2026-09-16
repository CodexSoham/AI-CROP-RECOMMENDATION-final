import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import {
  Activity,
  Satellite,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Info,
  Droplets,
  CloudSun,
  Eye,
} from 'lucide-react';
import { FieldHealthResponse, NDVITimeSeriesPoint } from '../services/fieldHealthService';

interface FieldHealthCardProps {
  healthData: FieldHealthResponse | null;
  isLoading: boolean;
  activeOverlayType: 'ndvi' | 'false_color';
  onToggleOverlayType: (type: 'ndvi' | 'false_color') => void;
  fieldName?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomNDVITooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data: NDVITimeSeriesPoint = payload[0].payload;
    return (
      <div className="bg-stone-950/95 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl shadow-xl text-white text-xs min-w-[210px]">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2">
          <span className="font-mono text-stone-300 font-bold flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#D8F946]" />
            {label}
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#D8F946]">
            Sentinel-2 L2A
          </span>
        </div>

        <div className="space-y-1.5 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-stone-400">Mean NDVI:</span>
            <span className="font-black text-sm text-white">{data.mean_ndvi.toFixed(3)}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-stone-400">Range (Min–Max):</span>
            <span className="text-stone-200">
              {data.min_ndvi.toFixed(2)} – {data.max_ndvi.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-stone-400">Canopy Variance (σ):</span>
            <span className="text-stone-200">±{data.std_dev.toFixed(3)}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-stone-400">Cloud Shield:</span>
            <span className="text-emerald-400 font-bold">{data.valid_pixel_pct}% Clear</span>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-bold text-[#D8F946]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D8F946] animate-pulse" />
          {data.status}
        </div>
      </div>
    );
  }
  return null;
};

export const FieldHealthCard: React.FC<FieldHealthCardProps> = ({
  healthData,
  isLoading,
  activeOverlayType,
  onToggleOverlayType,
  fieldName = 'Selected Field Parcel',
}) => {
  if (isLoading && !healthData) {
    return (
      <div className="rounded-[2rem] bg-white dark:bg-[#131A14] border border-stone-200/90 dark:border-stone-800/80 p-8 shadow-md flex flex-col items-center justify-center min-h-[380px] text-center animate-pulse">
        <div className="w-16 h-16 rounded-3xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4">
          <Satellite className="w-8 h-8 text-[#323D26] dark:text-[#D8F946] animate-spin" />
        </div>
        <p className="text-base font-black text-stone-900 dark:text-white mb-1">
          Ingesting Sentinel-2 Remote Sensing Imagery...
        </p>
        <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm">
          Fetching 60-day historical time-series, masking cloud cover with SCL, and computing NDVI canopy distribution.
        </p>
      </div>
    );
  }

  if (!healthData) {
    return null;
  }

  const { current_health, time_series, field_metrics, source } = healthData;

  // Color mappings based on status key
  const statusColors = {
    healthy: {
      text: 'text-emerald-700 dark:text-emerald-400',
      bg: 'bg-emerald-500/15 border-emerald-500/30',
      glow: 'shadow-[0_0_25px_rgba(16,185,129,0.25)]',
      progress: 'bg-emerald-500',
    },
    moderate: {
      text: 'text-lime-700 dark:text-lime-400',
      bg: 'bg-lime-500/15 border-lime-500/30',
      glow: 'shadow-[0_0_25px_rgba(132,204,22,0.25)]',
      progress: 'bg-lime-500',
    },
    stressed: {
      text: 'text-amber-700 dark:text-amber-400',
      bg: 'bg-amber-500/15 border-amber-500/30',
      glow: 'shadow-[0_0_25px_rgba(245,158,11,0.25)]',
      progress: 'bg-amber-500',
    },
    bare_soil: {
      text: 'text-rose-700 dark:text-rose-400',
      bg: 'bg-rose-500/15 border-rose-500/30',
      glow: 'shadow-[0_0_25px_rgba(239,68,68,0.25)]',
      progress: 'bg-rose-500',
    },
  };

  const currentStatusTheme = statusColors[current_health.status_key] || statusColors.healthy;

  // Compute NDVI percent on 0 to 1 scale for visual meter
  const ndviPct = Math.round(Math.min(1.0, Math.max(0.0, current_health.mean_ndvi)) * 100);

  return (
    <div className="rounded-[2rem] bg-white dark:bg-[#131A14] border border-stone-200/90 dark:border-stone-800/80 shadow-md p-6 sm:p-8 flex flex-col gap-6">
      {/* ─── Header: Field Title & Live Satellite Tag ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-[#323D26] text-[#D8F946] dark:bg-[#D8F946] dark:text-[#191E19]">
              <Satellite className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Copernicus Sentinel-2 Remote Sensing Telemetry
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
            {fieldName}
          </h2>
        </div>

        {/* Source & Sensor Resolution Pill */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#323D26] dark:text-[#D8F946]" />
            <span>{source.includes('Live') ? 'Sentinel Hub Live' : 'Sentinel-2 Synthetic'}</span>
          </div>
          <div className="px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#323D26] text-[#D8F946] dark:bg-[#D8F946] dark:text-[#191E19] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>10m Spatial Resolution</span>
          </div>
        </div>
      </div>

      {/* ─── Big Metrics Grid: NDVI Score, Badge, Uniformity, Bounds ──────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* Main NDVI Score Display (Hero Stat) */}
        <div
          className={`md:col-span-5 p-6 rounded-3xl border ${currentStatusTheme.bg} ${currentStatusTheme.glow} flex flex-col justify-between transition-all`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-widest text-stone-600 dark:text-stone-400">
                Canopy Mean NDVI
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${currentStatusTheme.bg} ${currentStatusTheme.text}`}
              >
                {current_health.badge}
              </span>
            </div>

            {/* Score with Glow */}
            <div className="flex items-baseline gap-3 my-2">
              <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-stone-950 dark:text-white">
                {current_health.mean_ndvi.toFixed(2)}
              </span>
              <span className="text-sm font-bold text-stone-500 dark:text-stone-400">
                / 1.00
              </span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-2.5 overflow-hidden my-3">
              <div
                className={`h-full rounded-full transition-all duration-700 ${currentStatusTheme.progress}`}
                style={{ width: `${ndviPct}%` }}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-stone-300/40 dark:border-stone-700/40 grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <span className="text-stone-500 dark:text-stone-400 block text-[10px] uppercase">Min NDVI:</span>
              <span className="font-bold text-stone-900 dark:text-white">{current_health.min_ndvi.toFixed(3)}</span>
            </div>
            <div>
              <span className="text-stone-500 dark:text-stone-400 block text-[10px] uppercase">Max NDVI:</span>
              <span className="font-bold text-stone-900 dark:text-white">{current_health.max_ndvi.toFixed(3)}</span>
            </div>
          </div>
        </div>

        {/* Secondary Canopy Diagnostics Grid */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Canopy Uniformity Index */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#18221A] border border-stone-200/80 dark:border-stone-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
              <span className="font-bold uppercase tracking-wider text-[10px]">Canopy Uniformity</span>
              <Activity className="w-3.5 h-3.5 text-[#323D26] dark:text-[#D8F946]" />
            </div>
            <p className="text-sm font-black text-stone-900 dark:text-white mb-1">
              {current_health.canopy_uniformity}
            </p>
            <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
              Standard Deviation: &sigma; = {current_health.std_dev.toFixed(3)}
            </span>
          </div>

          {/* SCL Cloud Filtering Status */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#18221A] border border-stone-200/80 dark:border-stone-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
              <span className="font-bold uppercase tracking-wider text-[10px]">Scene Classification</span>
              <CloudSun className="w-3.5 h-3.5 text-[#323D26] dark:text-[#D8F946]" />
            </div>
            <p className="text-sm font-black text-stone-900 dark:text-white mb-1">
              Cloud &amp; Shadow Masked
            </p>
            <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
              SCL Classes 3, 8, 9, 10 &bull; 0% Artifact Contamination
            </span>
          </div>

          {/* Measured Parcel Acreage */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#18221A] border border-stone-200/80 dark:border-stone-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
              <span className="font-bold uppercase tracking-wider text-[10px]">Total Field Area</span>
              <TrendingUp className="w-3.5 h-3.5 text-[#323D26] dark:text-[#D8F946]" />
            </div>
            <p className="text-lg font-black text-stone-900 dark:text-white font-mono">
              {field_metrics.area_acres} <span className="text-xs font-bold text-stone-500">acres</span>
            </p>
            <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
              {field_metrics.area_hectares} hectares
            </span>
          </div>

          {/* Centroid Coordinates */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#18221A] border border-stone-200/80 dark:border-stone-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
              <span className="font-bold uppercase tracking-wider text-[10px]">Field Centroid</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#323D26] dark:text-[#D8F946]" />
            </div>
            <p className="text-xs font-black text-stone-900 dark:text-white font-mono">
              {field_metrics.centroid_lat.toFixed(4)}° N, {field_metrics.centroid_lon.toFixed(4)}° E
            </p>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 uppercase font-bold tracking-wider">
              WGS 84 / EPSG:4326
            </span>
          </div>

        </div>
      </div>

      {/* ─── 60-Day NDVI Time-Series Line Chart ───────────────────────────────── */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-black text-stone-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#323D26] dark:text-[#D8F946]" />
              60-Day NDVI Phenology Trajectory
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Copernicus Sentinel-2 5-day overpass revisit cycle &bull; Multi-temporal canopy vigor trend
            </p>
          </div>

          {/* Layer overlay toggle buttons */}
          <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
            <button
              onClick={() => onToggleOverlayType('ndvi')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeOverlayType === 'ndvi'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              NDVI Colormap
            </button>
            <button
              onClick={() => onToggleOverlayType('false_color')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeOverlayType === 'false_color'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              False-Color NIR
            </button>
          </div>
        </div>

        {/* Recharts Area/Line Chart */}
        <div className="w-full h-72 rounded-2xl bg-stone-50/80 dark:bg-[#18221A]/60 border border-stone-200/80 dark:border-stone-800 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={time_series} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="ndviGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.15} />

              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                tickFormatter={(val) => {
                  const parts = val.split('-');
                  return parts.length >= 3 ? `${parts[1]}/${parts[2]}` : val;
                }}
              />

              <YAxis
                domain={[0, 1.0]}
                stroke="#888888"
                fontSize={10}
                tickLine={false}
                ticks={[0, 0.2, 0.5, 0.7, 1.0]}
              />

              <Tooltip content={<CustomNDVITooltip />} />

              {/* Threshold Benchmark Reference Lines */}
              <ReferenceLine
                y={0.7}
                stroke="#10b981"
                strokeDasharray="4 3"
                label={{ value: 'Healthy Canopy (≥0.7)', position: 'insideTopRight', fill: '#10b981', fontSize: 9 }}
              />
              <ReferenceLine
                y={0.5}
                stroke="#84cc16"
                strokeDasharray="4 3"
                label={{ value: 'Moderate (0.5)', position: 'insideTopRight', fill: '#84cc16', fontSize: 9 }}
              />
              <ReferenceLine
                y={0.2}
                stroke="#f59e0b"
                strokeDasharray="4 3"
                label={{ value: 'Stress Line (0.2)', position: 'insideTopRight', fill: '#f59e0b', fontSize: 9 }}
              />

              <Area
                type="monotone"
                dataKey="mean_ndvi"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#ndviGradient)"
                name="Mean NDVI"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── Agronomic Remote Sensing Interpretation Box ──────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#323D26]/5 dark:bg-[#D8F946]/5 border border-[#323D26]/20 dark:border-[#D8F946]/20 flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-[#323D26] text-[#D8F946] dark:bg-[#D8F946] dark:text-[#191E19] shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-stone-900 dark:text-white mb-1">
            Remote Sensing Agronomist Advisory
          </h4>
          <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
            {current_health.agronomic_advisory}
          </p>
        </div>
      </div>
    </div>
  );
};
