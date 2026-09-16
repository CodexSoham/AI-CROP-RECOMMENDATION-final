import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Bot,
  RefreshCw,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Droplets,
  Sprout,
  HelpCircle,
  MessageSquare,
  Send,
  FlaskConical,
} from 'lucide-react';
import { ShapFactor, GeminiAdvisory, CropRecommendation } from '../types';

interface XaiAdvisorySidebarProps {
  shapFactors: ShapFactor[];
  primaryCrop: CropRecommendation;
  advisory: GeminiAdvisory | null;
  isLoadingAdvisory: boolean;
  onRegenerateAdvisory: () => void;
  onOpenWhatIf: () => void;
}

export const XaiAdvisorySidebar: React.FC<XaiAdvisorySidebarProps> = ({
  shapFactors,
  primaryCrop,
  advisory,
  isLoadingAdvisory,
  onRegenerateAdvisory,
  onOpenWhatIf,
}) => {
  const [farmerQuestion, setFarmerQuestion] = useState<string>('');
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState<boolean>(false);

  const handleAskAgronomist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerQuestion.trim()) return;

    setIsAnswering(true);
    try {
      setTimeout(() => {
        setCustomAnswer(
          `For ${primaryCrop?.name || 'this crop'}: Applying bio-fertilizers such as Azotobacter (for N) and PSB (Phosphate Solubilizing Bacteria) can offset up to 20% chemical fertilizer needs, improving root colonization in local soils without risk of salinity burn.`
        );
        setIsAnswering(false);
      }, 700);
    } catch {
      setIsAnswering(false);
    }
  };

  return (
    <aside className="w-full lg:w-[320px] xl:w-[360px] shrink-0 flex flex-col gap-6">
      
      {/* Box 1: SHAP Feature Importance Visualizer */}
      <div className="p-6 rounded-[2rem] bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-white tracking-tight">
                Why {primaryCrop?.name}?
              </h2>
              <p className="text-[10px] text-stone-500 font-medium">SHAP Attribution Breakdown</p>
            </div>
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-[#323D26] dark:text-[#D8F946] bg-[#D8F946]/20 dark:bg-[#D8F946]/10 px-2.5 py-1 rounded-full border border-[#D8F946]/30">
            XAI Ensemble
          </span>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-400 mb-5 leading-relaxed font-medium">
          Relative impact of soil chemistry and live weather on {primaryCrop?.name}'s #1 rank:
        </p>

        {/* SHAP Bars */}
        <div className="space-y-4">
          {shapFactors.map((factor, index) => {
            const isPositive = factor.impact >= 0;
            const barWidthPercent = Math.min(100, Math.max(8, Math.abs(factor.impact) * 2));

            return (
              <div key={index} className="text-xs group">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    {factor.feature}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-stone-400 font-mono">
                      {factor.rawVal}
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        isPositive
                          ? 'text-[#323D26] dark:text-[#D8F946]'
                          : 'text-rose-500'
                      }`}
                    >
                      {isPositive ? `+${factor.impact}%` : `${factor.impact}%`}
                    </span>
                  </div>
                </div>

                {/* Progress track */}
                <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isPositive
                        ? 'bg-[#323D26] dark:bg-[#D8F946]'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${barWidthPercent}%` }}
                  ></div>
                </div>

                <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-1.5 pl-1 line-clamp-1 group-hover:line-clamp-none transition-all font-medium">
                  {factor.description}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[10px] text-stone-500 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#323D26] dark:bg-[#D8F946]"></span> Positive Driver
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Deficit Drag
          </span>
        </div>
      </div>

      {/* Box 2: Gemini LLM Farmer Advisory Box */}
      <div className="p-6 rounded-[2rem] bg-white dark:bg-[#1A1A1A] border border-stone-200 dark:border-stone-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-white tracking-tight">
                AI Farmer Advisory
              </h2>
              <p className="text-[10px] text-stone-500 font-medium">Powered by Gemini</p>
            </div>
          </div>

          <button
            onClick={onRegenerateAdvisory}
            disabled={isLoadingAdvisory}
            title="Regenerate advisory with Gemini"
            className="p-2 rounded-xl text-stone-400 hover:text-[#323D26] dark:hover:text-[#D8F946] hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingAdvisory ? 'animate-spin text-[#D8F946]' : ''}`} />
          </button>
        </div>

        {isLoadingAdvisory ? (
          <div className="py-8 text-center text-xs text-stone-500 dark:text-stone-400 font-medium">
            <div className="w-6 h-6 border-2 border-[#D8F946] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <span>Generating precision farmer advisory...</span>
          </div>
        ) : advisory ? (
          <div className="space-y-4 text-xs text-stone-700 dark:text-stone-300">
            
            {/* Executive Summary Quote */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 text-stone-800 dark:text-stone-200 leading-relaxed italic font-serif-italic">
              "{advisory.executiveSummary}"
            </div>

            {/* Fertilizer Dose Recommendation */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-stone-100 dark:border-stone-800 shadow-sm">
              <div className="flex items-center gap-2 text-stone-900 dark:text-white font-bold mb-2">
                <FlaskConical className="w-4 h-4 text-[#323D26] dark:text-[#D8F946]" />
                <span>Fertilizer & Soil Action</span>
              </div>
              <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed font-medium">
                {advisory.fertilizerRecommendation}
              </p>
            </div>

            {/* Irrigation Strategy */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-stone-100 dark:border-stone-800 shadow-sm">
              <div className="flex items-center gap-2 text-stone-900 dark:text-white font-bold mb-2">
                <Droplets className="w-4 h-4 text-[#323D26] dark:text-[#D8F946]" />
                <span>Water & Irrigation</span>
              </div>
              <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed font-medium">
                {advisory.irrigationStrategy}
              </p>
            </div>

            {/* Seasonal Risk Mitigation */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-stone-100 dark:border-stone-800 shadow-sm">
              <div className="flex items-center gap-2 text-stone-900 dark:text-white font-bold mb-2">
                <ShieldCheck className="w-4 h-4 text-[#323D26] dark:text-[#D8F946]" />
                <span>Climate & Pest Defense</span>
              </div>
              <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed font-medium">
                {advisory.seasonalRiskMitigation}
              </p>
            </div>

          </div>
        ) : (
          <div className="py-6 text-center text-xs font-bold text-stone-400">
            Click refresh to generate advisory
          </div>
        )}

        {/* Ask Agronomist Quick Box */}
        <form onSubmit={handleAskAgronomist} className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2">
            Ask AI Agronomist
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. Can I intercrop with pulses?"
              value={farmerQuestion}
              onChange={(e) => setFarmerQuestion(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#D8F946] font-medium"
            />
            <button
              type="submit"
              disabled={isAnswering || !farmerQuestion.trim()}
              className="p-2.5 rounded-xl bg-[#323D26] dark:bg-[#D8F946] text-[#D8F946] dark:text-[#191E19] hover:opacity-90 transition-opacity disabled:opacity-50 shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {customAnswer && (
            <div className="mt-3 p-3 rounded-xl bg-[#D8F946]/10 text-[11px] text-[#323D26] dark:text-[#D8F946] border border-[#D8F946]/30 leading-relaxed font-medium">
              <strong className="font-bold">Agronomist:</strong> {customAnswer}
            </div>
          )}
        </form>
      </div>

      {/* Box 3: What-If Scenario Simulator Drawer Trigger Card (Dark Theme like Studiova) */}
      <div className="p-6 rounded-[2rem] bg-[#111111] text-white shadow-xl border border-stone-800 relative overflow-hidden transition-all hover:border-[#D8F946]/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-xl bg-[#D8F946]/10 text-[#D8F946] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">
            What-If Simulator
          </h3>
        </div>

        <p className="text-xs text-stone-400 font-medium leading-relaxed mb-6">
          Test future climate shocks: What if rainfall drops by 30%? What if soil nitrogen degrades?
        </p>

        <button
          onClick={onOpenWhatIf}
          className="w-full py-3.5 rounded-xl bg-[#D8F946] hover:bg-[#c9eb3b] text-[#111111] font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
        >
          <span>Open Simulation Sandbox</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </aside>
  );
};
