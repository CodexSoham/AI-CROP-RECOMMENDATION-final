import React from 'react';
import { Sprout, ShieldCheck, ExternalLink, Activity, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0C140F] dark:bg-[#071610] text-stone-400 py-12 border-t border-[#323D26]/80 dark:border-[#323D26]/60 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 text-white font-bold text-base mb-3 font-display">
              <div className="w-8 h-8 rounded-xl bg-[#323D26] flex items-center justify-center text-[#D8F946] shadow-md">
                <Sprout className="w-4 h-4" />
              </div>
              <span>AdaptiveCrop AI • AgroXAI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Explainable, constraint-aware crop recommendation intelligence. Grounded in multi-parameter Gaussian centroid ensembles, mathematical SHAP feature attribution, and Gemini-powered generative advisories.
            </p>
            <div className="mt-4 flex items-center gap-3 text-[11px] text-[#D8F946]/80">
              <span className="flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" /> High-Yield Calibrated
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Drought Risk Guardrails
              </span>
            </div>
          </div>

          {/* Integrated Data Sources */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-3">
              Telemetry Feeds
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-300 font-medium">Open-Meteo API</span>
                <span className="block text-[10px] text-slate-500">Live hourly temperature & rainfall</span>
              </li>
              <li>
                <span className="text-slate-300 font-medium">ISRIC SoilGrids 2.0</span>
                <span className="block text-[10px] text-slate-500">Global digital soil mapping</span>
              </li>
              <li>
                <span className="text-slate-300 font-medium">NASA POWER API</span>
                <span className="block text-[10px] text-slate-500">Solar irradiance & agroclimatology</span>
              </li>
            </ul>
          </div>

          {/* Machine Learning Specs */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] mb-3">
              Model Specs
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-300 font-medium">Ensemble Classifier</span>
                <span className="block text-[10px] text-slate-500">22 Agronomic crop cultivars</span>
              </li>
              <li>
                <span className="text-slate-300 font-medium">XAI Framework</span>
                <span className="block text-[10px] text-slate-500">Kernel SHAP & LIME attribution</span>
              </li>
              <li>
                <span className="text-slate-300 font-medium">Gemini 3.8 Flash</span>
                <span className="block text-[10px] text-slate-500">Agronomic advisory synthesis</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-[#323D26]/60 dark:border-[#323D26]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            © {new Date().getFullYear()} AdaptiveCrop AI. Precision Agriculture & AgroXAI System.
          </div>
          <div className="flex items-center gap-4">
            <span>WCAG AA Accessible</span>
            <span>•</span>
            <span>Agriculture 4.0 Standard</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
