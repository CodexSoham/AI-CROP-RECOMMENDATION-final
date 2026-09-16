import React, { useState } from 'react';
import { Plus, Minus, ArrowUpRight } from 'lucide-react';
import { KshetraLogo } from './KshetraLogo';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How does KshetraAI monitor crop health?',
    answer:
      'KshetraAI analyzes satellite multispectral indices, drone footage, on-field IoT sensors, and local weather forecasts to detect nutrient stresses, pest risks, and irrigation needs before they become visible to the human eye.',
  },
  {
    question: 'Do I need special equipment to use KshetraAI?',
    answer:
      'No specialized hardware is required to get started. You can simply input field coordinates, upload soil lab test reports, or draw your farm boundaries. If you already have drone feeds or on-farm IoT sensors, KshetraAI connects seamlessly via API.',
  },
  {
    question: 'Can KshetraAI predict crop yields?',
    answer:
      'Yes. Our ML ensemble models analyze multispectral vegetative indices (NDVI/EVI), calibrated weather trajectories, and soil N-P-K nutrient balances to forecast harvest yields with up to 94% verified accuracy.',
  },
  {
    question: 'Is my farm and soil data secure?',
    answer:
      'Your agricultural boundaries, yield records, and soil chemistries are encrypted end-to-end. We operate under strict agricultural data privacy standards—your proprietary farm data is never sold or shared with commodity brokers.',
  },
  {
    question: 'Does KshetraAI support different crop types?',
    answer:
      'KshetraAI supports over 22 commercial cultivars spanning major grain staples (rice, maize, wheat), protein legumes (chickpea, pigeonpea), cash crops (cotton, sugarcane), and high-value horticulture (grapes, citrus).',
  },
];

export const CropilyEnding: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full bg-[#F4F3ED] dark:bg-[#0C140F] text-stone-900 dark:text-stone-100 transition-colors duration-300">
      
      {/* 1. FAQ Section */}
      <section className="w-full max-w-6xl mx-auto py-16 px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Heading & Badge */}
          <div className="lg:col-span-5">
            <span className="px-3 py-1 rounded-sm bg-[#D4F843] text-stone-950 font-black text-[10px] tracking-widest uppercase mb-3 inline-block">
              FAQ
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
              Frequently asked{' '}
              <span className="font-serif italic font-normal text-4xl sm:text-5xl text-[#323D26] dark:text-[#D8F946]">
                questions
              </span>
            </h2>

            <p className="mt-3 text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-sm">
              Everything you need to know about precision agronomical intelligence, satellite monitoring, and farm optimization with KshetraAI.
            </p>
          </div>

          {/* Right: Accordion Items */}
          <div className="lg:col-span-7 space-y-3">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200/90 dark:border-stone-800 shadow-xs overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-850 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-stone-900 dark:text-white">
                      {item.question}
                    </span>

                    <div className="w-7 h-7 rounded-full bg-[#D8F946]/20 dark:bg-[#323D26]/60 flex items-center justify-center shrink-0 text-[#323D26] dark:text-[#D8F946]">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800 pt-3 animate-fade-in">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 2. KshetraAI Brand Footer */}
      <footer className="w-full bg-[#0E1511] text-stone-300 pt-16 pb-12 px-4 sm:px-8 lg:px-12 border-t border-stone-800">
        <div className="w-full max-w-6xl mx-auto">
          
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-stone-800/80">
            
            {/* Brand Column with KshetraLogo */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <KshetraLogo size="lg" variant="horizontal" />

                <div className="mt-6 text-xs text-stone-400 space-y-1">
                  <div className="text-[#D8F946] hover:underline cursor-pointer">
                    contact@kshetraai.com
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Link Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
              
              {/* Product */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-white block mb-3">
                  Product
                </span>
                <ul className="space-y-2 text-stone-400">
                  <li className="hover:text-white cursor-pointer transition-colors">How It Works</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Soil Radars</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Deciding Area</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Pricing Plans</li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-white block mb-3">
                  Resources
                </span>
                <ul className="space-y-2 text-stone-400">
                  <li className="hover:text-white cursor-pointer transition-colors">Agronomy Research</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Case Studies</li>
                  <li className="hover:text-white cursor-pointer transition-colors">IoT Integrations</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-white block mb-3">
                  Company
                </span>
                <ul className="space-y-2 text-stone-400">
                  <li className="hover:text-white cursor-pointer transition-colors">About KshetraAI</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Agricultural Partners</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-white block mb-3">
                  Legal
                </span>
                <ul className="space-y-2 text-stone-400">
                  <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Farm Data Security</li>
                </ul>
              </div>

            </div>

          </div>

          {/* Huge Signature KshetraAI Display Wordmark */}
          <div className="py-10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <KshetraLogo size="xl" variant="mark-only" />

              <span className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white select-none">
                Kshetra<span className="text-[#D8F946]">AI</span>
              </span>
            </div>
          </div>

          {/* Sub-Footer Copyright Bar */}
          <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
            <div>© 2026 KshetraAI Technologies. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <span className="hover:text-stone-300 cursor-pointer">Policies and Terms</span>
              <span className="hover:text-stone-300 cursor-pointer">Precision Agriculture Platform</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
