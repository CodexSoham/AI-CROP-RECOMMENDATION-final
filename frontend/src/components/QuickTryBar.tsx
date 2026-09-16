import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  TrendingUp,
  Droplets,
  Layers,
  ArrowRight,
  Award,
  Check,
} from 'lucide-react';
import {
  SoilNutrients,
  MeteorologicalData,
  FarmingConstraints,
  CropRecommendation,
  ShapFactor,
} from '../types';
import { runRecommendationEngine } from '../services/recommendationEngine';

interface QuickTryPreset {
  id: string;
  label: string;
  description: string;
  soil: SoilNutrients;
  constraints: FarmingConstraints;
  weatherOverrides: Partial<MeteorologicalData>;
}

const PRESETS: QuickTryPreset[] = [
  {
    id: 'black-high-rain',
    label: 'Black Soil + High Rainfall',
    description: 'Deccan heavy clay with plentiful monsoon rainfall and standard budget',
    soil: { N: 85, P: 50, K: 42, pH: 6.8, soilType: 'Black Clay Loam' },
    constraints: { water: 'Plentiful', budget: 'Moderate', season: 'Kharif' },
    weatherOverrides: { temperature: 26.5, humidity: 82, annualizedRainfallEst: 1150 },
  },
  {
    id: 'sandy-low-water',
    label: 'Sandy Soil + Low Water',
    description: 'Semi-arid light sandy soil with acute drought risk and modest capital',
    soil: { N: 36, P: 60, K: 75, pH: 7.4, soilType: 'Sandy Loam' },
    constraints: { water: 'Low', budget: 'Low', season: 'Kharif' },
    weatherOverrides: { temperature: 31.0, humidity: 38, annualizedRainfallEst: 420 },
  },
  {
    id: 'alluvial-mod-budget',
    label: 'Alluvial Soil + Moderate Budget',
    description: 'Indo-Gangetic fertile river basin with winter wheat-legume rotation',
    soil: { N: 92, P: 58, K: 48, pH: 7.2, soilType: 'Alluvial Loam' },
    constraints: { water: 'Moderate', budget: 'Moderate', season: 'Rabi' },
    weatherOverrides: { temperature: 19.5, humidity: 60, annualizedRainfallEst: 650 },
  },
  {
    id: 'red-drought-risk',
    label: 'Red Soil + Drought Risk',
    description: 'Peninsular red laterite with severe water constraints requiring hardy crops',
    soil: { N: 30, P: 45, K: 65, pH: 5.9, soilType: 'Red Sandy Laterite' },
    constraints: { water: 'Low', budget: 'Low', season: 'Kharif' },
    weatherOverrides: { temperature: 29.5, humidity: 45, annualizedRainfallEst: 510 },
  },
];

interface QuickTryBarProps {
  baseWeather: MeteorologicalData;
  onApplyPreset: (soil: SoilNutrients, constraints: FarmingConstraints, weatherOverride: Partial<MeteorologicalData>) => void;
  onOpenDashboard: () => void;
}

export const QuickTryBar: React.FC<QuickTryBarProps> = ({
  baseWeather,
  onApplyPreset,
  onOpenDashboard,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESETS[0].id);

  const activePreset = PRESETS.find((p) => p.id === selectedPresetId) || PRESETS[0];

  // Run dynamic preview calculation for the selected preset
  const demoWeather: MeteorologicalData = {
    ...baseWeather,
    ...activePreset.weatherOverrides,
  };

  const { top3, primaryShap } = runRecommendationEngine(
    activePreset.soil,
    demoWeather,
    activePreset.constraints
  );

  return (
    <section className="py-12 bg-slate-50 dark:bg-[#0c2018] border-b border-slate-200/80 dark:border-emerald-950/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Demo Bar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Quick Try: Test Scenarios Instantly
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
              Switch between representative soil & water profiles to see instant machine learning re-ranking and SHAP feature attributions in real time.
            </p>
          </div>

          <button
            onClick={() => {
              onApplyPreset(activePreset.soil, activePreset.constraints, activePreset.weatherOverrides);
              onOpenDashboard();
            }}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer group"
          >
            <span>Load into Full Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Preset Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {PRESETS.map((preset) => {
            const isSelected = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                onClick={() => setSelectedPresetId(preset.id)}
                className={`p-4 rounded-2xl text-left border transition-all relative ${
                  isSelected
                    ? 'bg-white dark:bg-[#112A20] border-emerald-500 dark:border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white/60 dark:bg-[#112A20]/40 border-slate-200/80 dark:border-emerald-900/40 hover:bg-white dark:hover:bg-[#112A20]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-bold ${isSelected ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-800 dark:text-slate-200'}`}>
                    {preset.label}
                  </span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Live Interactive Quick-Results Panel */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#112A20] border border-slate-200 dark:border-emerald-800/60 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Ranked Top 3 Crops for this Preset */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Predicted Top 3 Recommendation Ranking
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Constraint Engine: {activePreset.constraints.water} Water • {activePreset.constraints.budget} Budget
                </span>
              </div>

              <div className="space-y-3">
                {top3.map((crop, index) => (
                  <div
                    key={crop.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-200/70 dark:border-emerald-900/40 flex items-center justify-between hover:border-emerald-400 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${
                          index === 0
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 ring-2 ring-amber-400/30'
                            : index === 1
                            ? 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                        }`}
                      >
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {crop.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-900/70 text-emerald-800 dark:text-emerald-300">
                            {crop.badge}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {crop.adjustmentReason}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                        {crop.score}%
                      </div>
                      <div className="text-[10px] text-slate-400">Suitability</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Instant SHAP Bar Chart Preview */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-50 dark:bg-emerald-950/50 border border-slate-200/80 dark:border-emerald-900/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  SHAP Factor Attribution (#1 {top3[0]?.name})
                </span>
                <span className="text-[10px] text-slate-400">Feature Impact</span>
              </div>

              <div className="space-y-2.5">
                {primaryShap.slice(0, 4).map((factor, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[170px]">
                        {factor.feature}
                      </span>
                      <span
                        className={`font-bold font-mono ${
                          factor.impact >= 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-500 dark:text-rose-400'
                        }`}
                      >
                        {factor.impact >= 0 ? `+${factor.impact}%` : `${factor.impact}%`}
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-emerald-950 overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          factor.impact >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.abs(factor.impact) * 2)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  onApplyPreset(activePreset.soil, activePreset.constraints, activePreset.weatherOverrides);
                  onOpenDashboard();
                }}
                className="mt-4 w-full py-2 text-center text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 flex items-center justify-center gap-1"
              >
                <span>Tweak values in precision dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
