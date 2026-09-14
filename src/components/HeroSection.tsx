import React from 'react';
import {
  ArrowRight,
  Camera,
  ShieldCheck,
  Cpu,
  Sparkles,
  CloudSun,
  Layers,
  CheckCircle2,
  TrendingUp,
  Award,
} from 'lucide-react';
import { SoilNutrients, MeteorologicalData, CropRecommendation } from '../types';

interface HeroSectionProps {
  onLaunchEngine: () => void;
  onOpenOcr: () => void;
  soil: SoilNutrients;
  weather: MeteorologicalData;
  topCrop: CropRecommendation;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onLaunchEngine,
  onOpenOcr,
  soil,
  weather,
  topCrop,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-stone-200/80 dark:border-[#323D26]/60">
      {/* Subtle organic background mesh */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-36 -left-36 w-96 h-96 rounded-full bg-[#D8F946]/5 dark:bg-[#D8F946]/3 blur-3xl"></div>
        <div className="absolute top-1/2 -right-36 w-96 h-96 rounded-full bg-[#323D26]/8 dark:bg-[#D8F946]/3 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D8F946]/15 dark:bg-[#323D26]/60 border border-[#D8F946]/40 dark:border-[#D8F946]/30 text-[#323D26] dark:text-[#D8F946] text-xs font-semibold mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#323D26] dark:text-[#D8F946]" />
              <span>Next-Gen AgroXAI • Agriculture 4.0</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.18] font-display">
              Explainable, Constraint-Aware{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#323D26] to-[#4a5e33] dark:from-[#D8F946] dark:to-[#c8e840]">
                Crop Recommendations
              </span>{' '}
              for Precision Yield
            </h1>

            {/* Sub-headline */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Combining machine learning ensemble models with live meteorological feeds, soil chemistry, and real-world farm constraints—empowering growers with explainable SHAP diagnostics and Gemini AI advisories.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
              <button
                onClick={onLaunchEngine}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#323D26] hover:bg-[#3d4d2f] active:bg-[#1e2a1a] text-[#D8F946] font-bold text-sm sm:text-base shadow-lg shadow-[#323D26]/30 hover:shadow-[#323D26]/40 transition-all flex items-center justify-center gap-2.5 group"
              >
                <span>Launch Recommendation Engine</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenOcr}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white hover:bg-stone-50 dark:bg-[#0E1511]/60 dark:hover:bg-[#323D26]/60 text-stone-800 dark:text-[#D8F946] font-semibold text-sm sm:text-base border border-stone-300 dark:border-[#323D26]/60 shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4 text-[#323D26] dark:text-[#D8F946]" />
                <span>Scan Soil Report (OCR)</span>
              </button>
            </div>

            {/* Trust Markers */}
            <div className="mt-10 grid grid-cols-3 gap-6 pt-6 border-t border-stone-200/80 dark:border-[#323D26]/60 w-full max-w-xl text-left">
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">99.3%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Model Accuracy</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#323D26] dark:text-[#D8F946]">100% XAI</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">SHAP Factor Transparency</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Live API</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Open-Meteo & SoilGrids</div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Preview Graphic (Interactive Floating Mockup) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card: Live Field Summary */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#112A20] border border-slate-200 dark:border-emerald-800/60 shadow-2xl relative z-10">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-emerald-900/50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/70 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                      <CloudSun className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Sangli Plot A Live Stream</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Deccan Vertisol Basin</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-[#D8F946]/20 dark:bg-[#323D26]/60 text-[#323D26] dark:text-[#D8F946] rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D8F946] animate-pulse"></span>
                    Live Synced
                  </span>
                </div>

                {/* Soil & Climate Metric Chips */}
                <div className="grid grid-cols-3 gap-2 my-4">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-100 dark:border-emerald-900/30 text-center">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Nitrogen</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">N: {soil.N}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-100 dark:border-emerald-900/30 text-center">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Phosphorus</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">P: {soil.P}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-100 dark:border-emerald-900/30 text-center">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Potassium</div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">K: {soil.K}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs px-2 py-1.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/60 text-slate-700 dark:text-emerald-200 mb-4">
                  <span>Soil pH: <strong className="text-emerald-700 dark:text-emerald-300">{soil.pH}</strong></span>
                  <span>Temp: <strong className="text-emerald-700 dark:text-emerald-300">{weather.temperature}°C</strong></span>
                  <span>Humidity: <strong className="text-emerald-700 dark:text-emerald-300">{weather.humidity}%</strong></span>
                </div>

                {/* Recommendation Mini Preview */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#323D26] to-[#1a2214] text-white shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white">
                        <Award className="w-5 h-5 text-amber-300" />
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-emerald-200 font-semibold">
                          #1 Recommended Crop
                        </div>
                        <div className="text-lg font-bold">{topCrop.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white">{topCrop.score}%</div>
                      <div className="text-[10px] text-emerald-200 font-medium">Suitability Score</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-emerald-100">
                    <span>Yield: {topCrop.expectedYield}</span>
                    <span className="px-2 py-0.5 rounded-md bg-[#D8F946]/20 text-[#D8F946] font-semibold">
                      Constraint Adapted
                    </span>
                  </div>
                </div>

                {/* Micro Action Button */}
                <button
                  onClick={onLaunchEngine}
                  className="mt-4 w-full py-2 text-center text-xs font-bold text-[#323D26] dark:text-[#D8F946] hover:opacity-80 flex items-center justify-center gap-1 group"
                >
                  <span>Explore full 3-column constraint dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

              </div>

              {/* Floating Decorative Pill 1: SHAP Engine */}
              <div className="absolute -bottom-5 -left-5 p-3 rounded-2xl bg-white dark:bg-[#0E1511] border border-stone-200 dark:border-[#323D26] shadow-xl hidden sm:flex items-center gap-2.5 z-20">
                <div className="w-7 h-7 rounded-lg bg-[#D8F946]/20 dark:bg-[#323D26]/60 text-[#323D26] dark:text-[#D8F946] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">SHAP Driver</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Rainfall Match +45%</div>
                </div>
              </div>

              {/* Floating Decorative Pill 2: Gemini Advisory */}
              <div className="absolute -top-4 -right-4 p-3 rounded-2xl bg-white dark:bg-[#0E1511] border border-stone-200 dark:border-[#323D26] shadow-xl hidden sm:flex items-center gap-2.5 z-20">
                <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Constraint Engine</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Low Water Guard Active</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
