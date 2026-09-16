import React from 'react';
import {
  CloudRain,
  BrainCircuit,
  SlidersHorizontal,
  Compass,
  CheckCircle,
  TrendingUp,
  Cpu,
  Layers,
} from 'lucide-react';

export const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: CloudRain,
      tag: 'Live Meteorological Ingestion',
      title: 'Real-Time Open-Meteo & NASA POWER Feeds',
      description:
        'Continuous ambient climate streaming directly from GPS coordinates. Automatically ingests temperature curves, relative humidity, and 16-day cumulative rainfall projections to model actual growing season hydration.',
      color: 'emerald',
      metrics: '16-Day Forecast Sync • GPS Auto-Detection',
    },
    {
      icon: BrainCircuit,
      tag: 'Explainable AI (XAI)',
      title: 'Mathematical SHAP & LIME Attribution',
      description:
        'Replaces opaque black-box deep models with transparent mathematical feature contributions. Farmers see exact percentage impacts for Nitrogen, Potassium, pH chemistry, and rainfall driving every recommendation.',
      color: 'teal',
      metrics: 'Full Parameter Decomposition • Zero Blind Spots',
    },
    {
      icon: SlidersHorizontal,
      tag: 'Constraint Engine',
      title: 'Farmer Budget & Water Limit Adaptation',
      description:
        'Agricultural realities rarely meet laboratory conditions. Our re-weighting constraint engine dynamically demotes thirsty crops under drought stress and optimizes for low-capital resource ceilings.',
      color: 'amber',
      metrics: 'Dynamic Risk Guardrails • Capital Optimization',
    },
    {
      icon: Compass,
      tag: 'What-If Simulator',
      title: 'Interactive Climate & Nutrient Stress Modeling',
      description:
        'Simulate future scenarios before planting. Adjust seasonal rainfall by -30%, increase temperature by +2°C, or test fertilizer boosts to observe real-time crop re-rankings and safeguard farm margins.',
      color: 'blue',
      metrics: 'Instant Scenario Diff • Risk Mitigation',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-[#0C140F] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8F946]/20 dark:bg-[#323D26]/60 text-[#323D26] dark:text-[#D8F946] text-xs font-bold uppercase tracking-wider mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Architecture & Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
            Precision AgTech Engineered for the Unpredictable
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
            Standard agronomic tools assume ideal laboratory conditions. AdaptiveCrop AI continuously calibrates against real-world resource constraints, weather volatility, and operational budgets.
          </p>
        </div>

        {/* 4-Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-stone-50 dark:bg-[#0E1511]/60 border border-stone-200/80 dark:border-[#323D26]/50 hover:border-[#D8F946]/50 dark:hover:border-[#D8F946]/40 transition-all hover:shadow-xl group relative overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#D8F946]/20 dark:bg-[#323D26]/60 text-[#323D26] dark:text-[#D8F946] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#323D26] dark:text-[#D8F946]">
                      {feature.tag}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {feature.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  {feature.description}
                </p>

                <div className="pt-4 border-t border-stone-200/70 dark:border-[#323D26]/50 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span className="font-semibold text-[#323D26] dark:text-[#D8F946]">
                    {feature.metrics}
                  </span>
                  <CheckCircle className="w-4 h-4 text-[#323D26] dark:text-[#D8F946]" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
