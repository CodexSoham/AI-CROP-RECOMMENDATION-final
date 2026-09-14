import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, Info, Sprout } from 'lucide-react';
import { CropRecommendation, FarmingConstraints } from '../types';
import { CropLifecycleTimeline } from './CropLifecycleTimeline';

interface RecommendationsCenterProps {
  recommendations: CropRecommendation[];
  allEvaluated: CropRecommendation[];
  constraints: FarmingConstraints;
  onOpenWhatIf: () => void;
}

export const RecommendationsCenter: React.FC<RecommendationsCenterProps> = ({
  recommendations,
  allEvaluated,
  constraints,
  onOpenWhatIf,
}) => {
  const top3 = recommendations.slice(0, 3);
  const demotedCrops = allEvaluated.filter(
    (c) => c.score < c.rawScore && Math.abs(c.score - c.rawScore) > 2
  );

  const [expandedCropId, setExpandedCropId] = useState<string | null>(top3[0]?.id || null);
  const [showFullMatrix, setShowFullMatrix] = useState<boolean>(false);

  return (
    <main className="w-full flex flex-col gap-6">
      
      {/* Engine Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-[2rem] bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 shadow-sm transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#323D26] dark:text-[#D8F946]">
              CONSTRAINT ENGINE CALIBRATED
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#D8F946]/20 text-[#323D26] dark:text-[#D8F946] text-[9px] font-bold border border-[#D8F946]/30">
              Active
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#191E19] dark:text-white tracking-tight">
            Top 3 Most Viable Crops Under Real-World Conditions
          </h2>
        </div>

        <button
          onClick={onOpenWhatIf}
          className="mt-4 sm:mt-0 px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
        >
          <SparklesIcon className="w-3.5 h-3.5" />
          <span>Simulate What-If</span>
        </button>
      </div>

      {/* Top 3 Ranked Recommendation Cards */}
      <div className="space-y-6">
        {top3.map((crop, index) => {
          const isExpanded = expandedCropId === crop.id;

          const medalColor = index === 0
            ? 'bg-[#191E19] text-[#D8F946] border-[#191E19]'
            : index === 1
            ? 'bg-[#2A341E] text-[#D8F946] border-[#2A341E]'
            : 'bg-[#384628] text-[#D8F946] border-[#384628]';

          const medalIcon = index === 0 ? '🥇 #1 Rank' : index === 1 ? '🥈 #2 Rank' : '🥉 #3 Rank';

          return (
            <div
              key={crop.id}
              className={`rounded-[2rem] border transition-all duration-300 overflow-hidden bg-[#D8F946] text-[#191E19] border-[#D8F946] ${
                index === 0
                  ? 'ring-2 ring-[#191E19] dark:ring-[#D8F946] shadow-xl'
                  : 'shadow-lg hover:shadow-xl'
              }`}
            >
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  
                  {/* Left: Rank badge, Crop name & Scientific info */}
                  <div className="flex items-start gap-4">
                    <div className={`px-3 py-1.5 rounded-xl text-xs font-black border flex items-center justify-center shrink-0 shadow-xs ${medalColor}`}>
                      {medalIcon}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#191E19]">
                          {crop.name}
                        </h3>
                        
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-white/40 text-[#191E19] border-[#191E19]/20 shadow-2xs">
                          {crop.badge}
                        </span>

                        <span className="text-xs italic text-[#191E19]/70 font-medium">
                          ({crop.scientificName})
                        </span>
                      </div>

                      <p className="text-xs mt-1.5 flex items-center gap-2 font-medium text-[#191E19]/85">
                        <span>Category: <strong className="text-[#191E19] font-bold">{crop.category}</strong></span>
                        <span>•</span>
                        <span>Expected Yield: <strong className="text-[#191E19] font-extrabold">{crop.expectedYield}</strong></span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Radial Suitability Ring & Score */}
                  <div className="flex items-center gap-5 self-end sm:self-auto">
                    <div className="text-right">
                      <div className="text-4xl sm:text-5xl font-black tracking-tighter text-[#191E19]">
                        {crop.score}%
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest mt-1 text-[#191E19]/75">
                        Suitability
                      </div>
                      {Math.abs(crop.score - crop.rawScore) >= 1 && (
                        <div className="text-[10px] mt-1 font-semibold text-[#191E19]/65">
                          Raw: {crop.rawScore}% ({crop.score >= crop.rawScore ? `+${Math.round((crop.score - crop.rawScore)*10)/10}` : Math.round((crop.score - crop.rawScore)*10)/10}%)
                        </div>
                      )}
                    </div>

                    {/* SVG Radial Gauge Meter */}
                    <div className="relative w-16 h-16 shrink-0">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-[#191E19]/15 stroke-current"
                          strokeWidth="3.5"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-[#191E19] stroke-current transition-all duration-700"
                          strokeDasharray={`${crop.score}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-[#191E19]">
                        #{crop.rank}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Constraint Re-weighting Explanation Badge */}
                <div className="mt-5 px-4 py-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/25 border-[#191E19]/20 shadow-2xs">
                  <div className="flex items-center gap-2 text-[#191E19]">
                    <Info className="w-4 h-4 shrink-0 text-[#191E19]" />
                    <span className="font-semibold">
                      {crop.adjustmentReason}
                    </span>
                  </div>

                  <button
                    onClick={() => setExpandedCropId(isExpanded ? null : crop.id)}
                    className="hover:opacity-75 text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 text-[#191E19] cursor-pointer"
                  >
                    <span>{isExpanded ? 'Show Less' : 'View Details'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Visual Growth Lifecycle Timeline based on current date */}
                <div className="mt-4">
                  <CropLifecycleTimeline
                    cropId={crop.id}
                    cropName={crop.name}
                    currentDate="2026-09-13"
                    isPrimaryMode={true}
                  />
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-[#191E19]/20 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs animate-fade-in">
                    <div>
                      <span className="font-black uppercase tracking-widest text-[10px] block mb-3 text-[#191E19]/75">
                        Key Agronomic Merits
                      </span>
                      <ul className="space-y-2 font-medium text-[#191E19]">
                        {crop.keyStrengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#191E19]" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-black uppercase tracking-widest text-[10px] block mb-3 text-[#191E19]/75">
                        Risk Considerations
                      </span>
                      <ul className="space-y-2 font-medium text-[#191E19]">
                        {crop.riskFactors.map((r, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#323D26]" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

    </main>
  );
};

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
