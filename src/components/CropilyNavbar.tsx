import React from 'react';
import {
  Moon,
  Sun,
  Home,
  HelpCircle,
  Sliders,
  FileText,
  Sparkles,
} from 'lucide-react';
import { KshetraLogo } from './KshetraLogo';

export type CropilySection = 'landing' | 'ending' | 'studio';

interface CropilyNavbarProps {
  currentSection: CropilySection;
  onSelectSection: (section: CropilySection) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenWhatIf: () => void;
  onOpenOcr: () => void;
}

export const CropilyNavbar: React.FC<CropilyNavbarProps> = ({
  currentSection,
  onSelectSection,
  isDarkMode,
  onToggleTheme,
  onOpenWhatIf,
  onOpenOcr,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#F4F3ED]/95 dark:bg-[#0C140F]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand: KshetraAI Logo */}
        <button
          type="button"
          onClick={() => onSelectSection('landing')}
          className="cursor-pointer group text-left hover:opacity-90 transition-opacity"
        >
          <KshetraLogo size="md" variant="horizontal" />
        </button>

        {/* Section View Tabs */}
        <nav className="hidden md:flex items-center p-1 rounded-2xl bg-stone-200/60 dark:bg-stone-900/80 border border-stone-300/60 dark:border-stone-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => onSelectSection('landing')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              currentSection === 'landing'
                ? 'bg-[#323D26] text-[#D8F946] dark:bg-[#D8F946] dark:text-stone-950 font-black shadow-xs scale-[1.02]'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100/60 dark:hover:bg-stone-800/60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Landing Page</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('ending')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              currentSection === 'ending'
                ? 'bg-[#323D26] text-[#D8F946] dark:bg-[#D8F946] dark:text-stone-950 font-black shadow-xs scale-[1.02]'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100/60 dark:hover:bg-stone-800/60'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQ & About</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('studio')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              currentSection === 'studio'
                ? 'bg-[#323D26] text-[#D8F946] dark:bg-[#D8F946] dark:text-stone-950 font-black shadow-xs scale-[1.02]'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100/60 dark:hover:bg-stone-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#323D26] dark:text-[#D8F946]" />
            <span>Crop ML Studio</span>
          </button>
        </nav>

        {/* Right Tools & Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Quick OCR Scan */}
          <button
            type="button"
            onClick={onOpenOcr}
            title="Scan Soil Test Report"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-bold border border-stone-200/80 dark:border-stone-800 cursor-pointer transition-all shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-[#323D26] dark:text-[#D8F946]" />
            <span>OCR Lab Card</span>
          </button>

          {/* Quick What-If Simulator */}
          <button
            type="button"
            onClick={onOpenWhatIf}
            title="What-If Scenario Simulator"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#323D26] hover:bg-[#27321D] text-[#D8F946] text-xs font-black uppercase tracking-wider shadow-sm cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>What-If</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-800 transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
          </button>
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-200/80 dark:border-stone-800 py-2 px-3 text-[11px] font-bold overflow-x-auto gap-1">
        <button
          type="button"
          onClick={() => onSelectSection('landing')}
          className={`px-3 py-1 rounded-lg transition-all ${
            currentSection === 'landing' ? 'bg-[#323D26] text-[#D8F946] dark:bg-[#D8F946] dark:text-stone-950 font-black' : 'text-stone-500'
          }`}
        >
          Landing
        </button>
        <button
          type="button"
          onClick={() => onSelectSection('ending')}
          className={`px-3 py-1 rounded-lg transition-all ${
            currentSection === 'ending' ? 'bg-[#323D26] text-[#D8F946] dark:bg-[#D8F946] dark:text-stone-950 font-black' : 'text-stone-500'
          }`}
        >
          FAQ
        </button>
        <button
          type="button"
          onClick={() => onSelectSection('studio')}
          className={`px-3 py-1 rounded-lg transition-all ${
            currentSection === 'studio' ? 'bg-[#323D26] text-[#D8F946] dark:bg-[#D8F946] dark:text-stone-950 font-black' : 'text-stone-500'
          }`}
        >
          Studio
        </button>
      </div>

    </header>
  );
};
