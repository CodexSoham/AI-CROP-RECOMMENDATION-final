import React from 'react';
import {
  SlidersHorizontal,
  Droplets,
  Coins,
  Calendar,
  Compass,
  RotateCcw,
  Sparkles,
  HelpCircle,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import {
  SoilNutrients,
  FarmingConstraints,
  WaterConstraint,
  BudgetConstraint,
  GrowingSeason,
} from '../types';
import { SoilHealthRadar } from './SoilHealthRadar';

interface InputSidebarProps {
  soil: SoilNutrients;
  onSoilChange: (newSoil: SoilNutrients) => void;
  constraints: FarmingConstraints;
  onConstraintsChange: (newConstraints: FarmingConstraints) => void;
  onAutoFetchSoil: () => void;
  isLoadingSoilGrids: boolean;
  onRunEngine: () => void;
  isEngineRunning: boolean;
  onResetDefaults: () => void;
}

export const InputSidebar: React.FC<InputSidebarProps> = ({
  soil,
  onSoilChange,
  constraints,
  onConstraintsChange,
  onAutoFetchSoil,
  isLoadingSoilGrids,
  onRunEngine,
  isEngineRunning,
  onResetDefaults,
}) => {
  const updateSoilField = (field: keyof SoilNutrients, value: number) => {
    onSoilChange({
      ...soil,
      [field]: value,
    });
  };

  const updateConstraint = <K extends keyof FarmingConstraints>(
    field: K,
    val: FarmingConstraints[K]
  ) => {
    onConstraintsChange({
      ...constraints,
      [field]: val,
    });
  };

  return (
    <aside className="w-full lg:w-[300px] xl:w-[340px] shrink-0 flex flex-col gap-6">
      
      {/* Box 1: Soil Chemistry Parameters */}
      <div className="p-6 rounded-[2rem] bg-white dark:bg-[#191E19] border border-stone-200/80 dark:border-stone-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#D8F946]/20 dark:bg-[#D8F946]/10 flex items-center justify-center text-[#323D26] dark:text-[#D8F946]">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-stone-900 dark:text-white tracking-tight">
              Soil Parameters
            </h2>
          </div>

          <button
            onClick={onAutoFetchSoil}
            disabled={isLoadingSoilGrids}
            title="Auto-query SoilGrids API / Regional Soil Database"
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#323D26] dark:text-[#D8F946] hover:bg-[#D8F946]/30 bg-[#D8F946]/20 dark:bg-[#D8F946]/10 px-3 py-1.5 rounded-xl border border-[#D8F946]/30 transition-all disabled:opacity-50 cursor-pointer hover:scale-[1.02]"
          >
            <MapPin className="w-3 h-3" />
            <span>{isLoadingSoilGrids ? 'Fetching...' : 'GPS SoilGrids'}</span>
          </button>
        </div>

        {/* Soil Type Subtitle */}
        {soil.soilType && (
          <div className="mb-5 text-xs px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-900/80 text-stone-600 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800 flex items-center justify-between font-medium">
            <span>Classification:</span>
            <span className="font-black text-stone-900 dark:text-white truncate max-w-[150px]">
              {soil.soilType}
            </span>
          </div>
        )}

        {/* N-P-K Nutrient Balance Radar Chart (Recharts) */}
        <div className="mb-6 bg-stone-50/80 dark:bg-stone-900/60 rounded-2xl p-4 border border-stone-100 dark:border-stone-800">
          <SoilHealthRadar soil={soil} />
        </div>

        {/* NPK + pH Inputs */}
        <div className="space-y-5">
          
          {/* Nitrogen (N) */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                Nitrogen (N)
                <span className="text-[10px] text-stone-400 font-normal">kg/ha</span>
              </span>
              <input
                type="number"
                min="0"
                max="160"
                value={soil.N}
                onChange={(e) => updateSoilField('N', Math.max(0, Math.min(160, Number(e.target.value))))}
                className="w-16 text-right px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-xs font-black text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#D8F946]"
              />
            </div>
            <input
              type="range"
              min="10"
              max="150"
              value={soil.N}
              onChange={(e) => updateSoilField('N', Number(e.target.value))}
              className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#323D26] dark:accent-[#D8F946]"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-medium">
              <span>Low (&lt;40)</span>
              <span className="text-[#323D26] dark:text-[#D8F946] font-bold">Optimal (60-90)</span>
              <span>High (&gt;110)</span>
            </div>
          </div>

          {/* Phosphorus (P) */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                Phosphorus (P)
                <span className="text-[10px] text-stone-400 font-normal">kg/ha</span>
              </span>
              <input
                type="number"
                min="0"
                max="160"
                value={soil.P}
                onChange={(e) => updateSoilField('P', Math.max(0, Math.min(160, Number(e.target.value))))}
                className="w-16 text-right px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-xs font-black text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#D8F946]"
              />
            </div>
            <input
              type="range"
              min="5"
              max="120"
              value={soil.P}
              onChange={(e) => updateSoilField('P', Number(e.target.value))}
              className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#323D26] dark:accent-[#D8F946]"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-medium">
              <span>Low (&lt;30)</span>
              <span className="text-[#323D26] dark:text-[#D8F946] font-bold">Optimal (40-70)</span>
              <span>High (&gt;80)</span>
            </div>
          </div>

          {/* Potassium (K) */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                Potassium (K)
                <span className="text-[10px] text-stone-400 font-normal">kg/ha</span>
              </span>
              <input
                type="number"
                min="0"
                max="160"
                value={soil.K}
                onChange={(e) => updateSoilField('K', Math.max(0, Math.min(160, Number(e.target.value))))}
                className="w-16 text-right px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-xs font-black text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#D8F946]"
              />
            </div>
            <input
              type="range"
              min="10"
              max="140"
              value={soil.K}
              onChange={(e) => updateSoilField('K', Number(e.target.value))}
              className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#323D26] dark:accent-[#D8F946]"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-medium">
              <span>Low (&lt;35)</span>
              <span className="text-[#323D26] dark:text-[#D8F946] font-bold">Optimal (40-80)</span>
              <span>High (&gt;90)</span>
            </div>
          </div>

          {/* Soil pH */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                Soil Reaction (pH)
              </span>
              <input
                type="number"
                step="0.1"
                min="4.0"
                max="9.5"
                value={soil.pH}
                onChange={(e) => updateSoilField('pH', Math.max(4.0, Math.min(9.5, Number(e.target.value))))}
                className="w-16 text-right px-2 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-xs font-black text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#D8F946]"
              />
            </div>
            <input
              type="range"
              step="0.1"
              min="4.5"
              max="9.0"
              value={soil.pH}
              onChange={(e) => updateSoilField('pH', Number(e.target.value))}
              className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#323D26] dark:accent-[#D8F946]"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-medium">
              <span>Acidic (&lt;6.0)</span>
              <span className="text-[#323D26] dark:text-[#D8F946] font-bold">Neutral (6.5 - 7.5)</span>
              <span>Alkaline (&gt;8.0)</span>
            </div>
          </div>

        </div>
      </div>

      {/* Box 2: Real-World Constraint Controls */}
      <div className="p-6 rounded-[2rem] bg-white dark:bg-[#191E19] border border-stone-200/80 dark:border-stone-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#323D26] text-[#D8F946] flex items-center justify-center shadow-xs">
              <Droplets className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-stone-900 dark:text-white tracking-tight">
              Real-World Constraints
            </h2>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#323D26] dark:text-[#D8F946] bg-[#D8F946]/20 dark:bg-[#D8F946]/10 px-2.5 py-1 rounded-full border border-[#D8F946]/30">
            Active
          </span>
        </div>

        <div className="space-y-6">
          
          {/* Water Availability Toggle */}
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-2">
              Water Availability
            </label>
            <div className="flex rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 p-1 bg-stone-50 dark:bg-stone-900">
              {(['Plentiful', 'Moderate', 'Low / Drought'] as WaterConstraint[]).map((level) => (
                <button
                  key={level}
                  onClick={() => updateConstraint('water', level)}
                  className={`flex-1 py-2 text-xs font-black uppercase tracking-wider transition-all rounded-lg cursor-pointer ${
                    constraints.water === level
                      ? 'bg-[#323D26] text-[#D8F946] dark:bg-[#D8F946] dark:text-[#323D26] shadow-xs'
                      : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800/50'
                  }`}
                >
                  {level.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Toggle */}
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-2">
              Farmer Capital / Budget
            </label>
            <div className="flex rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 p-1 bg-stone-50 dark:bg-stone-900">
              {(['Low', 'Moderate', 'High'] as BudgetConstraint[]).map((level) => (
                <button
                  key={level}
                  onClick={() => updateConstraint('budget', level)}
                  className={`flex-1 py-2 text-xs font-black uppercase tracking-wider transition-all rounded-lg cursor-pointer ${
                    constraints.budget === level
                      ? 'bg-[#323D26] text-[#D8F946] dark:bg-[#D8F946] dark:text-[#323D26] shadow-xs'
                      : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800/50'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Growing Season Select */}
          <div>
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block mb-2">
              Target Growing Season
            </label>
            <div className="relative">
              <select
                value={constraints.season}
                onChange={(e) => updateConstraint('season', e.target.value as GrowingSeason)}
                className="w-full appearance-none px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-xs font-bold text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D8F946] cursor-pointer"
              >
                <option value="Kharif (Monsoon Season • Jun - Oct)">Kharif (Monsoon • Jun - Oct)</option>
                <option value="Rabi (Winter Season • Oct - Mar)">Rabi (Winter • Oct - Mar)</option>
                <option value="Zaid (Summer Season • Mar - Jun)">Zaid (Summer • Mar - Jun)</option>
                <option value="Year-Round (Perennial / Greenhouse)">Year-Round (Greenhouse)</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Primary Action Button */}
        <div className="mt-8">
          <button
            onClick={onRunEngine}
            disabled={isEngineRunning}
            className="w-full py-3.5 rounded-xl bg-[#323D26] hover:bg-[#27321D] text-[#D8F946] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
          >
            {isEngineRunning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{isEngineRunning ? 'Re-calibrating Engine...' : 'Run Constraint Engine'}</span>
          </button>
          
          <button
            onClick={onResetDefaults}
            className="w-full mt-3 py-2 text-[11px] font-bold text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Farm Baseline</span>
          </button>
        </div>

      </div>

    </aside>
  );
};

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
