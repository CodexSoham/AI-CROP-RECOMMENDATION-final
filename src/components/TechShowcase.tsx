import React from 'react';
import {
  Database,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Terminal,
  Activity,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

export const TechShowcase: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Multimodal Data Ingestion',
      badge: 'APIs & Computer Vision',
      tech: 'Open-Meteo • SoilGrids • Gemini OCR',
      description:
        'Live weather telemetry, regional soil chemistry classification, and scanned paper lab reports are parsed and normalized into standardized N-P-K-pH agronomic vectors.',
    },
    {
      num: '02',
      title: 'Ensemble ML Prediction',
      badge: 'Supervised ML',
      tech: 'Python XGBoost • Stacking Classifier',
      description:
        'A multi-dimensional Gaussian distance and gradient-boosted ensemble scores suitability probabilities across 22 distinct commercial cultivars based on historical crop performance.',
    },
    {
      num: '03',
      title: 'Real-World Constraint Layer',
      badge: 'Dynamic Re-weighting',
      tech: 'Mathematical Constraint Engine',
      description:
        'Applies agronomic penalty functions for drought risk, capital liquidity, and seasonal planting windows to eliminate high-risk unviable candidates.',
    },
    {
      num: '04',
      title: 'Explainable AI & Advisory',
      badge: 'XAI + GenAI',
      tech: 'SHAP Feature Attribution • Gemini 3.8 Flash',
      description:
        'Decomposes decisions into transparent SHAP contribution vectors and synthesizes natural language fertilizer schedules and irrigation advice for the grower.',
    },
  ];

  return (
    <section className="py-16 bg-stone-50 dark:bg-[#0C140F] border-t border-stone-200/80 dark:border-[#323D26]/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8F946]/20 dark:bg-[#323D26]/60 text-[#323D26] dark:text-[#D8F946] text-xs font-bold uppercase tracking-wider mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>End-to-End Pipeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Under the Hood: Precision Architecture
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
            Seamlessly integrating live meteorological streaming, supervised gradient boosting, and explainable generative AI.
          </p>
        </div>

        {/* Pipeline Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-[#0E1511] border border-stone-200/80 dark:border-[#323D26]/50 shadow-md flex flex-col justify-between relative hover:border-[#D8F946]/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-[#323D26] dark:text-[#D8F946]">
                    {step.num}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-[#0E1511] text-stone-600 dark:text-[#D8F946]/80">
                    {step.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {step.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-[#323D26]/40 text-[11px] font-semibold text-[#323D26] dark:text-[#D8F946] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#323D26] dark:text-[#D8F946]" />
                <span>{step.tech}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
