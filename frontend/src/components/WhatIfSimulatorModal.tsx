import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CloudRain,
  Thermometer,
  Layers,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  Check,
} from 'lucide-react';
import {
  SoilNutrients,
  MeteorologicalData,
  FarmingConstraints,
  WhatIfState,
  WaterConstraint,
} from '../types';
import { runRecommendationEngine } from '../services/recommendationEngine';

interface WhatIfSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  soil: SoilNutrients;
  weather: MeteorologicalData;
  constraints: FarmingConstraints;
  onApplyScenarioToActive: (newSoil: SoilNutrients, newConstraints: FarmingConstraints) => void;
}

export const WhatIfSimulatorModal: React.FC<WhatIfSimulatorModalProps> = ({
  isOpen,
  onClose,
  soil,
  weather,
  constraints,
  onApplyScenarioToActive,
}) => {
  const [whatIf, setWhatIf] = useState<WhatIfState>({
    rainfallDeltaPercent: -30, // Default scenario from blueprint: "What if seasonal rainfall decreases by 30%?"
    tempDelta: 1.5,
    nitrogenDelta: 0,
    waterOverride: 'Low',
  });

  if (!isOpen) return null;

  // Baseline execution
  const baseline = runRecommendationEngine(soil, weather, constraints);

  // Simulated execution
  const scenario = runRecommendationEngine(soil, weather, constraints, whatIf);

  const effectiveRainfall = Math.round(
    weather.annualizedRainfallEst * (1 + whatIf.rainfallDeltaPercent / 100)
  );
  const effectiveTemp = Math.round((weather.temperature + whatIf.tempDelta) * 10) / 10;
  const effectiveN = Math.max(5, soil.N + whatIf.nitrogenDelta);

  const handleReset = () => {
    setWhatIf({
      rainfallDeltaPercent: 0,
      tempDelta: 0,
      nitrogenDelta: 0,
      waterOverride: 'Inherit',
    });
  };

  const handleApply = () => {
    const updatedSoil = { ...soil, N: effectiveN };
    const updatedConstraints = {
      ...constraints,
      water: whatIf.waterOverride !== 'Inherit' ? whatIf.waterOverride : constraints.water,
    };
    onApplyScenarioToActive(updatedSoil, updatedConstraints);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[2rem] bg-[#F4F3ED] dark:bg-[#191E19] border border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col transition-colors">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-200/80 dark:border-stone-800/80 flex items-center justify-between sticky top-0 bg-[#F4F3ED]/95 dark:bg-[#191E19]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#323D26] text-[#D8F946] flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-[#D8F946]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-stone-900 dark:text-white tracking-tight">
                  What-If Scenario Simulator
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#D8F946] text-[#323D26]">
                  Sandbox
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                Test climate resilience, drought conditions, and soil shifts before committing capital.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/70 dark:hover:bg-stone-800/70 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-8">
          
          {/* Simulation Sliders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-[1.5rem] bg-white dark:bg-[#0C140F] border border-stone-200/80 dark:border-stone-800 shadow-sm">
            
            {/* Slider 1: Rainfall Variation */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                  Seasonal Rainfall Shift
                </span>
                <span className={`font-mono font-black ${whatIf.rainfallDeltaPercent < 0 ? 'text-amber-600 dark:text-amber-400' : 'text-[#323D26] dark:text-[#D8F946]'}`}>
                  {whatIf.rainfallDeltaPercent > 0 ? `+${whatIf.rainfallDeltaPercent}%` : `${whatIf.rainfallDeltaPercent}%`} ({effectiveRainfall} mm)
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={whatIf.rainfallDeltaPercent}
                onChange={(e) => setWhatIf({ ...whatIf, rainfallDeltaPercent: Number(e.target.value) })}
                className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#323D26] dark:accent-[#D8F946]"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1.5 font-medium">
                <span>Severe Drought (-50%)</span>
                <span>Normal (0%)</span>
                <span>Heavy Monsoon (+50%)</span>
              </div>
            </div>

            {/* Slider 2: Temperature Shift */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  Mean Temperature Shift
                </span>
                <span className={`font-mono font-black ${whatIf.tempDelta > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-blue-500'}`}>
                  {whatIf.tempDelta > 0 ? `+${whatIf.tempDelta}°C` : `${whatIf.tempDelta}°C`} ({effectiveTemp}°C)
                </span>
              </div>
              <input
                type="range"
                min="-4"
                max="6"
                step="0.5"
                value={whatIf.tempDelta}
                onChange={(e) => setWhatIf({ ...whatIf, tempDelta: Number(e.target.value) })}
                className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#323D26] dark:accent-[#D8F946]"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1.5 font-medium">
                <span>Cooler (-4°C)</span>
                <span>Baseline</span>
                <span>Heat Wave (+6°C)</span>
              </div>
            </div>

            {/* Slider 3: Nitrogen Soil Shift */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-[#D8F946]" />
                  Soil Nitrogen (N) Delta
                </span>
                <span className="font-mono font-black text-stone-900 dark:text-white">
                  {whatIf.nitrogenDelta > 0 ? `+${whatIf.nitrogenDelta}` : whatIf.nitrogenDelta} kg/ha (Total: {effectiveN})
                </span>
              </div>
              <input
                type="range"
                min="-40"
                max="50"
                step="5"
                value={whatIf.nitrogenDelta}
                onChange={(e) => setWhatIf({ ...whatIf, nitrogenDelta: Number(e.target.value) })}
                className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#323D26] dark:accent-[#D8F946]"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1.5 font-medium">
                <span>Depleted (-40)</span>
                <span>Baseline</span>
                <span>Heavy Fertilizer (+50)</span>
              </div>
            </div>

            {/* Control 4: Water Constraint Override */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                Water Availability Condition
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Inherit', 'Plentiful', 'Moderate', 'Low'] as (WaterConstraint | 'Inherit')[]).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWhatIf({ ...whatIf, waterOverride: w })}
                    className={`py-2 px-1 rounded-xl text-[11px] font-black uppercase tracking-wider text-center border transition-all cursor-pointer ${
                      whatIf.waterOverride === w
                        ? 'bg-[#323D26] text-[#D8F946] border-[#323D26] shadow-sm dark:bg-[#D8F946] dark:text-[#323D26] dark:border-[#D8F946]'
                        : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                    }`}
                  >
                    {w === 'Inherit' ? 'Current' : w === 'Low' ? 'Drought' : w}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Side-by-Side Comparison: Baseline vs Scenario */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-3">
              Real-Time Impact Comparison (Baseline vs Simulated Scenario)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Baseline Card */}
              <div className="p-5 rounded-[1.5rem] bg-white dark:bg-[#0C140F] border border-stone-200 dark:border-stone-800 shadow-sm">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-100 dark:border-stone-800">
                  <span className="text-xs font-black uppercase tracking-wider text-stone-400">BASELINE CONDITIONS</span>
                  <span className="text-[11px] font-mono text-stone-500">
                    {weather.annualizedRainfallEst}mm • {weather.temperature}°C
                  </span>
                </div>

                <div className="space-y-2.5">
                  {baseline.top3.map((c, i) => (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-900 text-xs border border-stone-100 dark:border-stone-800/80">
                      <div className="flex items-center gap-2">
                        <span className="font-black font-mono text-stone-400">#{i + 1}</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200">{c.name}</span>
                      </div>
                      <span className="font-mono font-black text-stone-700 dark:text-stone-300">{c.score}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scenario Card */}
              <div className="p-5 rounded-[1.5rem] bg-[#D8F946]/10 dark:bg-[#323D26]/20 border-2 border-[#323D26] dark:border-[#D8F946] shadow-md">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#323D26]/20 dark:border-[#D8F946]/20">
                  <span className="text-xs font-black uppercase tracking-wider text-[#323D26] dark:text-[#D8F946]">
                    SIMULATED SCENARIO
                  </span>
                  <span className="text-[11px] font-mono font-bold text-stone-700 dark:text-stone-300">
                    {effectiveRainfall}mm • {effectiveTemp}°C
                  </span>
                </div>

                <div className="space-y-2.5">
                  {scenario.top3.map((c, i) => {
                    const baselineScore = baseline.allEvaluated.find((b) => b.id === c.id)?.score || c.score;
                    const diff = Math.round((c.score - baselineScore) * 10) / 10;
                    return (
                      <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#191E19] text-xs border border-stone-200/80 dark:border-stone-800 shadow-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-black font-mono text-[#323D26] dark:text-[#D8F946]">#{i + 1}</span>
                          <span className="font-bold text-stone-900 dark:text-white">{c.name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D8F946]/30 dark:bg-[#D8F946]/20 text-[#323D26] dark:text-[#D8F946]">
                            {c.badge}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-stone-900 dark:text-white">{c.score}%</span>
                          {diff !== 0 && (
                            <span className={`text-[10px] font-mono font-bold flex items-center ${diff > 0 ? 'text-emerald-600 dark:text-[#D8F946]' : 'text-rose-500'}`}>
                              {diff > 0 ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                              {diff > 0 ? `+${diff}%` : `${diff}%`}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-stone-200/80 dark:border-stone-800/80 bg-stone-50/80 dark:bg-[#0C140F]/60 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sandbox</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2.5 rounded-xl bg-[#323D26] hover:bg-[#27321D] text-[#D8F946] text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply Scenario to Dashboard</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
