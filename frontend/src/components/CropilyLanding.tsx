import React, { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { KshetraHowItWorksAndPricing } from './KshetraHowItWorksAndPricing';

interface CropilyLandingProps {
  onExploreMap: () => void;
  onOpenAnalysis: () => void;
}

export const CropilyLanding: React.FC<CropilyLandingProps> = ({
  onExploreMap,
  onOpenAnalysis,
}) => {
  return (
    <section className="relative w-full bg-[#F4F3ED] dark:bg-[#0C140F] text-[#191E19] dark:text-stone-100 flex flex-col justify-between overflow-hidden">
      
      {/* 1. Massive Agency Hero Section */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D8F946]/20 dark:bg-[#D8F946]/10 border border-[#D8F946]/50 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#D8F946] animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#323D26] dark:text-[#D8F946]">
                Smart Field Insights
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-[#191E19] dark:text-white mb-6">
              Precision farming <br />
              <span className="font-serif italic font-normal text-[#323D26] dark:text-[#D8F946]">
                simplified.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-400 mb-10 max-w-xl leading-relaxed">
              Empower your agricultural decisions with intelligent crop planning, real-time weather adaptations, and smart resource management. Grow more, stress less.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={onExploreMap}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#323D26] hover:bg-[#27321D] text-[#D8F946] text-sm font-black uppercase tracking-wider shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Optimize My Farm</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onOpenAnalysis}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-transparent border-2 border-stone-300 dark:border-stone-700 hover:border-[#323D26] dark:hover:border-[#D8F946] text-stone-700 dark:text-stone-200 text-sm font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                View Dashboard
              </button>
            </div>
            
            <div className="mt-10 flex items-center gap-6 text-sm font-semibold text-stone-500 dark:text-stone-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#323D26] dark:text-[#D8F946]" />
                <span>No complex setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#323D26] dark:text-[#D8F946]" />
                <span>Instant insights</span>
              </div>
            </div>
          </div>
          
          {/* Right Column: Premium Image/Graphic */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800 z-10 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80"
                alt="Farmer checking smart analytics in a field"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="p-4 rounded-2xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-white/20 shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-5 h-5 text-[#D8F946]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-white">Smart Recommendation</span>
                  </div>
                  <div className="text-lg font-black text-[#323D26] dark:text-[#D8F946]">
                    Optimal conditions for Rice detected.
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#D8F946]/20 dark:bg-[#D8F946]/5 blur-3xl rounded-full -z-10"></div>
          </div>

        </div>
      </div>

      {/* 2. Features & "How it works" Section (Previously included Pricing) */}
      <KshetraHowItWorksAndPricing onOptimizeFarm={onExploreMap} />

    </section>
  );
};
