import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Sprout,
  Leaf,
  Flower2,
  Wheat,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  Zap,
  ChevronDown,
  ChevronUp,
  MapPin,
  CalendarCheck,
} from 'lucide-react';
import {
  calculateCropLifecycleTimeline,
  SOWING_DATE_PRESETS,
} from '../utils/cropLifecycle';
import { GrowthStageInfo, GrowthStageKey } from '../types';

interface CropLifecycleTimelineProps {
  cropId: string;
  cropName: string;
  currentDate?: string; // e.g. "2026-09-13"
  initialSowingPreset?: string;
  compact?: boolean;
  isPrimaryMode?: boolean;
}

export const CropLifecycleTimeline: React.FC<CropLifecycleTimelineProps> = ({
  cropId,
  cropName,
  currentDate = '2026-09-13',
  initialSowingPreset = 'today',
  isPrimaryMode = false,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>(initialSowingPreset);
  const [customSowingDate, setCustomSowingDate] = useState<string>(currentDate);
  const [selectedStageKey, setSelectedStageKey] = useState<GrowthStageKey | null>(null);
  const [isDetailedViewOpen, setIsDetailedViewOpen] = useState<boolean>(false);

  // Determine effective sowing date string based on preset or custom input
  const effectiveSowingDate = useMemo(() => {
    if (selectedPreset === 'custom') {
      return customSowingDate || currentDate;
    }
    const found = SOWING_DATE_PRESETS.find((p) => p.id === selectedPreset);
    return found ? found.date : currentDate;
  }, [selectedPreset, customSowingDate, currentDate]);

  // Compute reactive agronomic lifecycle data
  const lifecycle = useMemo(() => {
    return calculateCropLifecycleTimeline(
      cropId,
      cropName,
      effectiveSowingDate,
      currentDate
    );
  }, [cropId, cropName, effectiveSowingDate, currentDate]);

  // Determine active stage
  const activeStage = useMemo(() => {
    return (
      lifecycle.stages.find((s) => s.status === 'active') ||
      (lifecycle.daysElapsed <= 0 ? lifecycle.stages[0] : lifecycle.stages[3])
    );
  }, [lifecycle]);

  // If user hasn't explicitly selected a stage to inspect, default to the currently active stage
  const inspectedStage: GrowthStageInfo = useMemo(() => {
    if (selectedStageKey) {
      const found = lifecycle.stages.find((s) => s.key === selectedStageKey);
      if (found) return found;
    }
    return activeStage;
  }, [selectedStageKey, lifecycle, activeStage]);

  const getStageIcon = (key: GrowthStageKey, className: string = 'w-4 h-4') => {
    switch (key) {
      case 'sowing':
        return <Sprout className={className} />;
      case 'vegetative':
        return <Leaf className={className} />;
      case 'flowering':
        return <Flower2 className={className} />;
      case 'harvest':
        return <Wheat className={className} />;
      default:
        return <Sprout className={className} />;
    }
  };

  return (
    <div className={`mt-4 pt-4 border-t animate-fade-in ${
      isPrimaryMode ? 'border-[#191E19]/15' : 'border-stone-200/80 dark:border-[#323D26]/50'
    }`}>
      
      {/* Header with Title & Date Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
            isPrimaryMode
              ? 'bg-[#191E19] text-[#D8F946]'
              : 'bg-[#D8F946]/20 dark:bg-[#323D26]/60 border border-[#D8F946]/40 dark:border-[#323D26]/60 text-[#323D26] dark:text-[#D8F946]'
          }`}>
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-xs font-black uppercase tracking-wider ${
                isPrimaryMode ? 'text-[#191E19]' : 'text-slate-900 dark:text-white'
              }`}>
                Growth Lifecycle Timeline
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                isPrimaryMode
                  ? 'bg-[#191E19]/10 text-[#191E19] border border-[#191E19]/20'
                  : 'bg-[#D8F946]/10 text-[#323D26] dark:text-[#D8F946] border border-[#D8F946]/20'
              }`}>
                {lifecycle.totalDurationDays} Days Total Cycle
              </span>
            </div>
            <p className={`text-[11px] ${isPrimaryMode ? 'text-[#191E19]/70' : 'text-slate-500 dark:text-slate-400'}`}>
              Calibrated to Today: <strong className={isPrimaryMode ? 'text-[#191E19]' : 'text-slate-700 dark:text-slate-200'}>Sep 13, 2026</strong> ({lifecycle.seasonAlignment})
            </p>
          </div>
        </div>

        {/* Sowing Reference Presets Selector */}
        <div className={`flex items-center gap-1.5 p-1 rounded-xl border self-start sm:self-auto text-[11px] ${
          isPrimaryMode
            ? 'bg-white/30 border-[#191E19]/15'
            : 'bg-stone-100/90 dark:bg-[#0E1511]/80 border-stone-200/70 dark:border-[#323D26]/60'
        }`}>
          <span className={`text-[10px] font-semibold px-1.5 flex items-center gap-1 ${
            isPrimaryMode ? 'text-[#191E19]/80' : 'text-stone-500 dark:text-[#D8F946]/80'
          }`}>
            <Clock className="w-3 h-3" /> Sowing:
          </span>
          {SOWING_DATE_PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedPreset(preset.id)}
                title={preset.desc}
                className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#191E19] text-[#D8F946] shadow-xs'
                    : isPrimaryMode
                    ? 'text-[#191E19]/80 hover:text-[#191E19] hover:bg-white/40'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-[#323D26]/50'
                }`}
              >
                {preset.id === 'today'
                  ? 'Plant Today (Sep 13)'
                  : preset.id === 'rabi-early'
                  ? 'Upcoming Rabi (Oct 1)'
                  : 'Kharif Sown (Jul 1)'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Lifecycle Stepper / Progress Track (Line behind stages removed) */}
      <div className="relative py-2">
        {/* 4 Stages Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 relative z-10">
          {lifecycle.stages.map((stage) => {
            const isActive = stage.status === 'active';
            const isCompleted = stage.status === 'completed';
            const isSelected = inspectedStage.key === stage.key;

            return (
              <button
                key={stage.key}
                type="button"
                onClick={() => {
                  setSelectedStageKey(stage.key);
                  setIsDetailedViewOpen(true);
                }}
                className={`text-left p-2.5 sm:p-3 rounded-2xl border transition-all relative flex flex-col justify-between cursor-pointer group ${
                  isPrimaryMode
                    ? isActive
                      ? 'bg-[#191E19] text-white border-[#191E19] shadow-md ring-2 ring-[#323D26]/50'
                      : isCompleted
                      ? 'bg-[#242D1C] text-white border-[#242D1C] opacity-95 hover:border-[#191E19]'
                      : 'bg-[#242D1C] text-white border-[#242D1C] hover:border-[#191E19]'
                    : isActive
                    ? 'bg-gradient-to-b from-[#D8F946]/15 to-[#D8F946]/5 dark:from-[#323D26]/60 dark:to-[#0E1511] border-[#D8F946]/60 dark:border-[#D8F946]/40 shadow-md ring-2 ring-[#D8F946]/20'
                    : isCompleted
                    ? 'bg-stone-50/80 dark:bg-[#0E1511]/80 border-stone-200/80 dark:border-[#323D26]/40 opacity-90'
                    : 'bg-white dark:bg-[#0E1511]/80 border-stone-200/70 dark:border-[#323D26]/40 hover:border-[#D8F946]/40'
                } ${isSelected ? 'ring-2 ring-[#D8F946]/40' : ''}`}
              >
                {/* Active Stage Pulsing Badge */}
                {isActive && (
                  <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#323D26] text-[#D8F946] text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1 shrink-0 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D8F946] animate-pulse" />
                    Current Stage
                  </div>
                )}

                {/* Top: Icon & Stage Number */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-[#323D26] text-[#D8F946] shadow-sm'
                        : isCompleted
                        ? 'bg-[#D8F946]/20 text-[#323D26] dark:bg-[#323D26]/60 dark:text-[#D8F946]'
                        : isPrimaryMode
                        ? 'bg-[#191E19] text-stone-400 group-hover:text-[#D8F946]'
                        : 'bg-stone-100 text-stone-500 dark:bg-[#0E1511] dark:text-stone-400 group-hover:text-[#D8F946]'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-[#D8F946]" />
                    ) : (
                      getStageIcon(stage.key, 'w-4 h-4')
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-[#D8F946]/20 dark:bg-[#323D26]/80 text-[#D8F946] font-bold'
                        : 'text-stone-400'
                    }`}
                  >
                    Stage {stage.stageNumber}
                  </span>
                </div>

                {/* Middle: Stage Title & Subtitle */}
                <div>
                  <h4 className={`text-xs font-black line-clamp-1 ${isPrimaryMode ? 'text-white' : 'text-stone-900 dark:text-white'}`}>
                    {stage.name}
                  </h4>
                  <p className={`text-[10px] line-clamp-1 mt-0.5 ${isPrimaryMode ? 'text-stone-300' : 'text-stone-500 dark:text-stone-400'}`}>
                    {stage.subTitle}
                  </p>
                </div>

                {/* Bottom: Date Window & Duration */}
                <div className={`mt-2.5 pt-2 border-t flex flex-col gap-0.5 ${isPrimaryMode ? 'border-[#323D26]' : 'border-stone-100 dark:border-[#323D26]/40'}`}>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className={`font-semibold ${isPrimaryMode ? 'text-stone-200' : 'text-stone-700 dark:text-stone-300'}`}>
                      {stage.startDate.replace(/, \d{4}/, '')} – {stage.endDate.replace(/, \d{4}/, '')}
                    </span>
                    <span className={`font-mono ${isPrimaryMode ? 'text-stone-400' : 'text-stone-400'}`}>
                      {stage.durationDays}d
                    </span>
                  </div>

                  {/* Stage-level mini progress bar */}
                  {isActive && (
                    <div className="mt-1 w-full bg-[#323D26] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#D8F946] dark:bg-[#D8F946] h-full rounded-full transition-all duration-500"
                        style={{ width: `${stage.progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Real-Time Agronomic Status Banner */}
      <div className={`mt-3 p-3 rounded-2xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
        isPrimaryMode
          ? 'bg-white/20 border border-[#191E19]/15'
          : 'bg-[#D8F946]/8 dark:bg-[#323D26]/30 border border-[#D8F946]/30 dark:border-[#323D26]/60'
      }`}>
        <div className="flex items-start sm:items-center gap-2.5">
          <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
            isPrimaryMode
              ? 'bg-[#191E19] text-[#D8F946]'
              : 'bg-[#D8F946]/20 text-[#323D26] dark:text-[#D8F946]'
          }`}>
            <CalendarCheck className={`w-4 h-4 ${isPrimaryMode ? 'text-[#D8F946]' : 'text-[#323D26] dark:text-[#D8F946]'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-extrabold ${isPrimaryMode ? 'text-[#191E19]' : 'text-stone-900 dark:text-stone-100'}`}>
                {lifecycle.currentStageName}
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                isPrimaryMode
                  ? 'bg-[#191E19] text-[#D8F946]'
                  : 'bg-white dark:bg-[#323D26]/70 text-[#323D26] dark:text-[#D8F946] border border-[#D8F946]/30 dark:border-[#323D26]/60'
              }`}>
                Day {lifecycle.daysElapsed} of {lifecycle.totalDurationDays} ({lifecycle.overallProgressPercent}% Complete)
              </span>
              <span className={`text-[10px] ${isPrimaryMode ? 'text-[#191E19]/70' : 'text-slate-500 dark:text-slate-400'}`}>
                • {lifecycle.daysRemaining} days until harvest ({lifecycle.harvestDate})
              </span>
            </div>
            <p className={`text-[11px] mt-0.5 line-clamp-1 ${isPrimaryMode ? 'text-[#191E19]/80' : 'text-stone-600 dark:text-stone-300'}`}>
              {lifecycle.managementAlert}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsDetailedViewOpen(!isDetailedViewOpen)}
          className={`hover:opacity-80 font-bold text-[11px] flex items-center gap-1 self-end sm:self-auto cursor-pointer shrink-0 ${
            isPrimaryMode ? 'text-[#191E19]' : 'text-[#323D26] dark:text-[#D8F946]'
          }`}
        >
          <span>{isDetailedViewOpen ? 'Hide Agronomic Guide' : 'View Stage Operations'}</span>
          {isDetailedViewOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Agronomic Operations Guide for Selected Stage */}
      {isDetailedViewOpen && (
        <div className={`mt-3 p-4 rounded-2xl shadow-sm animate-fade-in text-xs ${
          isPrimaryMode
            ? 'bg-[#191E19] text-white border border-[#191E19]'
            : 'bg-white dark:bg-[#0C140F] border border-[#D8F946]/30 dark:border-[#323D26]/80'
        }`}>
          
          {/* Header of the inspected stage */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-stone-100 dark:border-[#323D26]/50 gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#D8F946]/20 dark:bg-[#323D26]/60 text-[#323D26] dark:text-[#D8F946] flex items-center justify-center">
                {getStageIcon(inspectedStage.key, 'w-4 h-4')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {inspectedStage.name} Details
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-[#0E1511] text-stone-700 dark:text-[#D8F946]/80 border border-stone-200 dark:border-[#323D26]">
                    Days {inspectedStage.startDay} – {inspectedStage.endDay} ({inspectedStage.durationDays} Days)
                  </span>
                  {inspectedStage.status === 'active' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#323D26] text-[#D8F946]">
                      Active Now
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Window: {inspectedStage.startDate} to {inspectedStage.endDate}
                </p>
              </div>
            </div>

            {/* Quick stage tab selector */}
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-[#0E1511] p-1 rounded-xl text-[10px]">
              {lifecycle.stages.map((stg) => (
                <button
                  key={stg.key}
                  type="button"
                  onClick={() => setSelectedStageKey(stg.key)}
                  className={`px-2 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    inspectedStage.key === stg.key
                      ? 'bg-[#323D26] text-[#D8F946]'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
                  }`}
                >
                  {stg.key.charAt(0).toUpperCase() + stg.key.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* 3-Column Agronomic Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Column 1: Critical Field Tasks */}
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#0E1511]/60 border border-stone-200/70 dark:border-[#323D26]/40 flex flex-col gap-2">
              <span className="font-extrabold text-[#323D26] dark:text-[#D8F946] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Key Agronomic Operations
              </span>
              <ul className="space-y-1.5 text-[11px] text-stone-600 dark:text-stone-300">
                {inspectedStage.criticalTasks.map((task, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D8F946] mt-1.5 shrink-0" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Water & Nutrients */}
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#0E1511]/60 border border-stone-200/70 dark:border-[#323D26]/40 flex flex-col gap-2">
              <span className="font-extrabold text-[#323D26] dark:text-[#D8F946]/80 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5" />
                Water & Nutrient Scheduling
              </span>
              
              <div className="text-[11px] space-y-2">
                <div>
                  <span className="font-bold text-stone-800 dark:text-stone-200 block">Irrigation:</span>
                  <p className="text-stone-600 dark:text-stone-300">{inspectedStage.waterRequirementTip}</p>
                </div>
                <div>
                  <span className="font-bold text-stone-800 dark:text-stone-200 block">Fertilizer Dose:</span>
                  <p className="text-stone-600 dark:text-stone-300">{inspectedStage.nutrientRecommendation}</p>
                </div>
              </div>
            </div>

            {/* Column 3: Risks & Defenses */}
            <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex flex-col gap-2">
              <span className="font-extrabold text-amber-900 dark:text-amber-200 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Stage Risk & Prevention
              </span>
              <p className="text-[11px] text-amber-900 dark:text-amber-300">
                {inspectedStage.riskAlert}
              </p>
              <div className="mt-auto pt-2 text-[10px] text-amber-800 dark:text-amber-400 font-medium">
                💡 Monitored against live station telemetry
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
