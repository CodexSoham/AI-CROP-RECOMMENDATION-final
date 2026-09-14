import React from 'react';
import {
  Sprout,
  SunMedium,
  Droplets,
  CloudRain,
  Camera,
  FileDown,
  Moon,
  Sun,
  LayoutDashboard,
  Home,
  MapPin,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { MeteorologicalData, FieldProfile } from '../types';
import { PRESET_FARMS } from '../data/cropKnowledgeBase';

interface NavbarProps {
  currentView: 'landing' | 'dashboard';
  onViewChange: (view: 'landing' | 'dashboard') => void;
  selectedFarmId: string;
  onSelectFarm: (farm: FieldProfile) => void;
  weather: MeteorologicalData;
  onOpenOcr: () => void;
  onOpenExport: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onRefreshWeather: () => void;
  isLoadingWeather: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  selectedFarmId,
  onSelectFarm,
  weather,
  onOpenOcr,
  onOpenExport,
  darkMode,
  onToggleDarkMode,
  onRefreshWeather,
  isLoadingWeather,
}) => {
  const currentFarm = PRESET_FARMS.find((f) => f.id === selectedFarmId) || PRESET_FARMS[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-emerald-950/60 bg-white/90 dark:bg-[#112A20]/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onViewChange('landing')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
              title="Return to Overview"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 dark:from-emerald-500 dark:to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <Sprout className="w-5 h-5 text-emerald-100 group-hover:rotate-6 transition-transform" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white font-display">
                    AdaptiveCrop<span className="text-emerald-500 dark:text-emerald-400">.ai</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-300/40 dark:border-emerald-700/50">
                    AgroXAI
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  Precision Crop Recommendation & Constraints
                </p>
              </div>
            </button>
          </div>

          {/* Center: Live Meteorological Bar & Field Selector */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {/* Field Selector Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-emerald-950/60 border border-slate-200/80 dark:border-emerald-800/40 text-xs font-medium text-slate-700 dark:text-emerald-200 hover:border-emerald-400 transition-colors">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">
                  {currentFarm.name.split(' ')[0]} {currentFarm.name.split(' ')[1] || ''}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>

              {/* Farm dropdown menu */}
              <div className="absolute left-0 mt-1 w-64 p-1.5 rounded-2xl bg-white dark:bg-[#112A20] border border-slate-200 dark:border-emerald-800/60 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Active Field Plots
                </div>
                {PRESET_FARMS.map((farm) => (
                  <button
                    key={farm.id}
                    onClick={() => onSelectFarm(farm)}
                    className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex flex-col gap-0.5 transition-colors ${
                      farm.id === selectedFarmId
                        ? 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/50'
                    }`}
                  >
                    <span className="truncate">{farm.name}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {farm.location} • {farm.areaAcres} Acres
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Weather Pill (Open-Meteo live sync) */}
            <button
              onClick={onRefreshWeather}
              title="Click to refresh live Open-Meteo meteorological stream"
              className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/70 dark:to-teal-950/50 border border-emerald-200/70 dark:border-emerald-800/50 text-xs text-slate-700 dark:text-slate-200 hover:border-emerald-400 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                  <SunMedium className="w-3.5 h-3.5 text-amber-500" />
                  {weather.temperature}°C
                </span>
              </div>

              <span className="text-slate-300 dark:text-slate-700">|</span>

              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span>{weather.humidity}%</span>
              </div>

              <span className="text-slate-300 dark:text-slate-700">|</span>

              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <CloudRain className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>{weather.annualizedRainfallEst}mm</span>
              </div>

              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/80 px-1.5 py-0.5 rounded font-medium">
                {isLoadingWeather ? 'Syncing...' : 'Live API'}
              </span>
            </button>
          </div>

          {/* Right Actions & CTAs */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* OCR Soil Scanner Button */}
            <button
              onClick={onOpenOcr}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-emerald-950/70 dark:hover:bg-emerald-900/60 text-slate-700 dark:text-emerald-200 text-xs font-semibold border border-slate-200 dark:border-emerald-800/50 transition-colors shadow-sm"
              title="Scan Paper Soil Test Report with Gemini OCR"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Scan Soil Report</span>
              <span className="sm:hidden">OCR</span>
            </button>

            {/* Export Field Advisory PDF */}
            <button
              onClick={onOpenExport}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-emerald-950/70 dark:hover:bg-emerald-900/60 text-slate-700 dark:text-emerald-200 text-xs font-semibold border border-slate-200 dark:border-emerald-800/50 transition-colors shadow-sm"
              title="Generate Printable Field Advisory Report"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Export Report</span>
            </button>

            {/* View Switcher: Landing <-> Dashboard */}
            <div className="flex items-center bg-slate-100 dark:bg-emerald-950/80 p-0.5 rounded-xl border border-slate-200 dark:border-emerald-900/50">
              <button
                onClick={() => onViewChange('landing')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  currentView === 'landing'
                    ? 'bg-white dark:bg-emerald-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Overview & Architecture"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Overview</span>
              </button>
              <button
                onClick={() => onViewChange('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="3-Column Decision Dashboard"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-emerald-950/70 dark:hover:bg-emerald-900/60 border border-slate-200 dark:border-emerald-800/50 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
