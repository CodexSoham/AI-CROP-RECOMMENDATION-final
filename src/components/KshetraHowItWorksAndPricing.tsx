import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface KshetraHowItWorksAndPricingProps {
  onOptimizeFarm: () => void;
}

export const KshetraHowItWorksAndPricing: React.FC<KshetraHowItWorksAndPricingProps> = ({
  onOptimizeFarm,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <div className="w-full bg-[#F4F3ED] dark:bg-[#0C140F] text-[#191E19] dark:text-stone-100 py-16 px-4 sm:px-6 lg:px-12 transition-colors">
      <div className="max-w-6xl mx-auto">
        
        {/* =========================================================================
            "HOW IT WORKS" / FEATURES SECTION
            ========================================================================= */}
        <section id="how-it-works" className="w-full">
          
          {/* Top Row: Pill Badge, Subtext + Button on Left, Large Statement on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
            
            {/* Left Column: Badge, Descriptive Microcopy, and Button */}
            <div className="lg:col-span-4 flex flex-col items-start gap-4 z-10">
              <span className="inline-block px-4 py-1.5 bg-[#D8F946] text-[#323D26] text-xs font-black uppercase tracking-widest rounded-full shadow-sm">
                How It Works
              </span>

              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed max-w-sm mt-2">
                We help you understand what's happening, anticipate what's next, and take action with complete confidence.
              </p>

              <button
                type="button"
                onClick={onOptimizeFarm}
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-[#323D26] hover:bg-[#27321D] text-[#D8F946] text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer group"
              >
                <span>Optimize My Farm</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right Column: Hero Statement Copy */}
            <div className="lg:col-span-8 z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] leading-[1.2] font-semibold text-[#191E19] dark:text-white tracking-tight">
                Connect your farm, let our intelligent engine analyze your soil and climate, and receive clear recommendations to improve every growing season.
              </h2>
            </div>

          </div>

          {/* 3 Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* STEP 01 */}
            <div
              onMouseEnter={() => setActiveStep(1)}
              className={`relative overflow-hidden rounded-[2rem] p-8 transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[340px] shadow-sm ${
                activeStep === 1
                  ? 'bg-[#D8F946] text-[#191E19] shadow-xl scale-[1.02] ring-2 ring-[#323D26] dark:ring-[#D8F946]'
                  : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white hover:border-[#D8F946]'
              }`}
            >
              {/* Top Row: Step Tag + Image */}
              <div className="relative z-10 flex items-start justify-between">
                <span className={`text-xs font-black uppercase tracking-widest ${activeStep === 1 ? 'text-[#323D26]' : 'text-stone-400'}`}>
                  Step 01
                </span>
                
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${activeStep === 1 ? 'bg-[#323D26] text-[#D8F946]' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'}`}>
                  1
                </div>
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 mt-12">
                <h3 className="text-2xl font-bold tracking-tight mb-3">
                  Analyze Soil & Weather
                </h3>
                <p className={`text-sm leading-relaxed ${activeStep === 1 ? 'text-[#323D26]/80' : 'text-stone-500 dark:text-stone-400'}`}>
                  Provide basic soil nutrients (N, P, K) and pH. Our engine automatically pulls live and forecasted weather data for your exact location.
                </p>
              </div>
            </div>

            {/* STEP 02 */}
            <div
              onMouseEnter={() => setActiveStep(2)}
              className={`relative overflow-hidden rounded-[2rem] p-8 transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[340px] shadow-sm ${
                activeStep === 2
                  ? 'bg-[#D8F946] text-[#191E19] shadow-xl scale-[1.02] ring-2 ring-[#323D26] dark:ring-[#D8F946]'
                  : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white hover:border-[#D8F946]'
              }`}
            >
              <div className="relative z-10 flex items-start justify-between">
                <span className={`text-xs font-black uppercase tracking-widest ${activeStep === 2 ? 'text-[#323D26]' : 'text-stone-400'}`}>
                  Step 02
                </span>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${activeStep === 2 ? 'bg-[#323D26] text-[#D8F946]' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'}`}>
                  2
                </div>
              </div>
              <div className="relative z-10 mt-12">
                <h3 className="text-2xl font-bold tracking-tight mb-3">
                  Apply Constraints
                </h3>
                <p className={`text-sm leading-relaxed ${activeStep === 2 ? 'text-[#323D26]/80' : 'text-stone-500 dark:text-stone-400'}`}>
                  Farming is real-world. Adjust inputs based on your water availability, budget, and seasonal risk tolerance to simulate practical outcomes.
                </p>
              </div>
            </div>

            {/* STEP 03 */}
            <div
              onMouseEnter={() => setActiveStep(3)}
              className={`relative overflow-hidden rounded-[2rem] p-8 transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[340px] shadow-sm ${
                activeStep === 3
                  ? 'bg-[#D8F946] text-[#191E19] shadow-xl scale-[1.02] ring-2 ring-[#323D26] dark:ring-[#D8F946]'
                  : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white hover:border-[#D8F946]'
              }`}
            >
              <div className="relative z-10 flex items-start justify-between">
                <span className={`text-xs font-black uppercase tracking-widest ${activeStep === 3 ? 'text-[#323D26]' : 'text-stone-400'}`}>
                  Step 03
                </span>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${activeStep === 3 ? 'bg-[#323D26] text-[#D8F946]' : 'bg-stone-100 dark:bg-stone-800 text-stone-400'}`}>
                  3
                </div>
              </div>
              <div className="relative z-10 mt-12">
                <h3 className="text-2xl font-bold tracking-tight mb-3">
                  Actionable Insights
                </h3>
                <p className={`text-sm leading-relaxed ${activeStep === 3 ? 'text-[#323D26]/80' : 'text-stone-500 dark:text-stone-400'}`}>
                  Receive top-3 prioritized crop recommendations with clear factor attributions and expert AI advisory notes tailored to your exact plot.
                </p>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};
