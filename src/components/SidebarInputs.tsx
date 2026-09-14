import React from 'react';
import {
  Sliders,
  FlaskConical,
  Activity,
  Thermometer,
  Droplets,
  CloudRain,
  Sparkles,
  RotateCcw,
  Loader2,
  CheckCircle,
} from 'lucide-react';

export interface ModelInputFeatures {
  N: number;
  P: number;
  K: number;
  ph: number;
  temperature: number;
  humidity: number;
  rainfall: number;
}

interface SidebarInputsProps {
  features: ModelInputFeatures;
  onChange: (updated: ModelInputFeatures) => void;
  onRunEngine: () => void;
  onResetDefaults: () => void;
  isLoading: boolean;
  sourceNotice?: string;
}

export const SidebarInputs: React.FC<SidebarInputsProps> = ({
  features,
  onChange,
  onRunEngine,
  onResetDefaults,
  isLoading,
  sourceNotice = 'Auto-filled from ISRIC SoilGrids & Open-Meteo',
}) => {
  const updateField = (field: keyof ModelInputFeatures, val: number) => {
    onChange({
      ...features,
      [field]: val,
    });
  };

  return (
    <div className="w-full rounded-3xl bg-white dark:bg-[#131A14] border border-stone-200 dark:border-stone-800 shadow-xl p-5 sm:p-6 flex flex-col gap-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#323D26] text-[#D8F946] dark:bg-[#D8F946] dark:text-[#323D26]">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-stone-900 dark:text-white uppercase tracking-wider">
              7 Input Model Features
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Auto-ingested &amp; manually adjustable
            </p>
          </div>
        </div>

        <button
          onClick={onResetDefaults}
          className="px-2.5 py-1 rounded-lg text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all flex items-center gap-1 cursor-pointer"
          title="Reset to Sangli Baseline Defaults"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Auto-Ingestion Status Badge */}
      <div className="p-2.5 rounded-xl bg-lime-500/10 border border-lime-500/20 text-xs flex items-center gap-2 text-lime-800 dark:text-lime-300 font-medium">
        <CheckCircle className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0" />
        <span className="truncate">{sourceNotice}</span>
      </div>

      {/* 7 Feature Sliders & Numeric Inputs */}
      <div className="flex flex-col gap-4">
        
        {/* 1. Nitrogen (N) */}
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-stone-50 dark:bg-[#162018] border border-stone-200/70 dark:border-stone-800/80">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
              <span>Nitrogen (N)</span>
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="140"
                value={features.N}
                onChange={(e) => updateField('N', parseFloat(e.target.value) || 0)}
                className="w-16 px-1.5 py-0.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono text-xs font-bold text-right text-lime-600 dark:text-lime-400"
              />
              <span className="text-[10px] text-stone-500 font-mono">ppm</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="140"
            step="1"
            value={features.N}
            onChange={(e) => updateField('N', parseFloat(e.target.value))}
            className="w-full accent-lime-500 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* 2. Phosphorus (P) */}
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-stone-50 dark:bg-[#162018] border border-stone-200/70 dark:border-stone-800/80">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-amber-500" />
              <span>Phosphorus (P)</span>
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="5"
                max="145"
                value={features.P}
                onChange={(e) => updateField('P', parseFloat(e.target.value) || 0)}
                className="w-16 px-1.5 py-0.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono text-xs font-bold text-right text-amber-600 dark:text-amber-400"
              />
              <span className="text-[10px] text-stone-500 font-mono">ppm</span>
            </div>
          </div>
          <input
            type="range"
            min="5"
            max="145"
            step="1"
            value={features.P}
            onChange={(e) => updateField('P', parseFloat(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* 3. Potassium (K) */}
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-stone-50 dark:bg-[#162018] border border-stone-200/70 dark:border-stone-800/80">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-blue-500" />
              <span>Potassium (K)</span>
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="5"
                max="205"
                value={features.K}
                onChange={(e) => updateField('K', parseFloat(e.target.value) || 0)}
                className="w-16 px-1.5 py-0.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono text-xs font-bold text-right text-blue-600 dark:text-blue-400"
              />
              <span className="text-[10px] text-stone-500 font-mono">ppm</span>
            </div>
          </div>
          <input
            type="range"
            min="5"
            max="205"
            step="1"
            value={features.K}
            onChange={(e) => updateField('K', parseFloat(e.target.value))}
            className="w-full accent-blue-500 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* 4. Soil pH */}
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-stone-50 dark:bg-[#162018] border border-stone-200/70 dark:border-stone-800/80">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>Soil pH</span>
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="3.5"
                max="9.5"
                step="0.1"
                value={features.ph}
                onChange={(e) => updateField('ph', parseFloat(e.target.value) || 7.0)}
                className="w-16 px-1.5 py-0.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono text-xs font-bold text-right text-emerald-600 dark:text-emerald-400"
              />
              <span className="text-[10px] text-stone-500 font-mono">pH</span>
            </div>
          </div>
          <input
            type="range"
            min="3.5"
            max="9.5"
            step="0.1"
            value={features.ph}
            onChange={(e) => updateField('ph', parseFloat(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* 5. Temperature */}
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-stone-50 dark:bg-[#162018] border border-stone-200/70 dark:border-stone-800/80">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-orange-500" />
              <span>Temperature</span>
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="8.0"
                max="45.0"
                step="0.5"
                value={features.temperature}
                onChange={(e) => updateField('temperature', parseFloat(e.target.value) || 25.0)}
                className="w-16 px-1.5 py-0.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono text-xs font-bold text-right text-orange-600 dark:text-orange-400"
              />
              <span className="text-[10px] text-stone-500 font-mono">°C</span>
            </div>
          </div>
          <input
            type="range"
            min="8.0"
            max="45.0"
            step="0.5"
            value={features.temperature}
            onChange={(e) => updateField('temperature', parseFloat(e.target.value))}
            className="w-full accent-orange-500 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* 6. Humidity */}
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-stone-50 dark:bg-[#162018] border border-stone-200/70 dark:border-stone-800/80">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-500" />
              <span>Relative Humidity</span>
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="10"
                max="100"
                value={features.humidity}
                onChange={(e) => updateField('humidity', parseFloat(e.target.value) || 50)}
                className="w-16 px-1.5 py-0.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono text-xs font-bold text-right text-cyan-600 dark:text-cyan-400"
              />
              <span className="text-[10px] text-stone-500 font-mono">%</span>
            </div>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="1"
            value={features.humidity}
            onChange={(e) => updateField('humidity', parseFloat(e.target.value))}
            className="w-full accent-cyan-500 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* 7. Rainfall */}
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-stone-50 dark:bg-[#162018] border border-stone-200/70 dark:border-stone-800/80">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-indigo-500" />
              <span>Seasonal Rainfall</span>
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="20.0"
                max="300.0"
                step="1"
                value={features.rainfall}
                onChange={(e) => updateField('rainfall', parseFloat(e.target.value) || 100)}
                className="w-16 px-1.5 py-0.5 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono text-xs font-bold text-right text-indigo-600 dark:text-indigo-400"
              />
              <span className="text-[10px] text-stone-500 font-mono">mm</span>
            </div>
          </div>
          <input
            type="range"
            min="20.0"
            max="300.0"
            step="1"
            value={features.rainfall}
            onChange={(e) => updateField('rainfall', parseFloat(e.target.value))}
            className="w-full accent-indigo-500 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
          />
        </div>

      </div>

      {/* Main Trigger Action Button */}
      <button
        onClick={onRunEngine}
        disabled={isLoading}
        className="w-full py-3.5 rounded-2xl bg-[#323D26] hover:bg-[#27321D] text-[#D8F946] dark:bg-[#D8F946] dark:hover:bg-[#c9ea3b] dark:text-[#323D26] font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.02]"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Calculating Probabilities...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Run Recommendation Engine</span>
          </>
        )}
      </button>

    </div>
  );
};
