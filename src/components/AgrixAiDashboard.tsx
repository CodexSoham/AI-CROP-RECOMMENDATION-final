import React, { useState } from 'react';
import {
  Sprout,
  Search,
  Bell,
  Plus,
  ChevronLeft,
  MapPin,
  Clock,
  CheckCircle2,
  Droplets,
  Wheat,
  ShieldAlert,
  Flame,
  Calendar,
  Sparkles,
  BarChart3,
  Sliders,
  Users,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { KshetraLogo } from './KshetraLogo';

interface AgrixAiDashboardProps {
  onOpenWhatIf: () => void;
  onOpenOcr: () => void;
  onViewCropStudio: () => void;
}

export const AgrixAiDashboard: React.FC<AgrixAiDashboardProps> = ({
  onOpenWhatIf,
  onOpenOcr,
  onViewCropStudio,
}) => {
  const [activeNav, setActiveNav] = useState<string>('Dashboard');
  const [activeHour, setActiveHour] = useState<string>('08');
  const [selectedTask, setSelectedTask] = useState<string>('Planting Crop');

  const hourlySlots = ['04', '05', '06', '07', '08', '09', '10', '11', '12', '01', '02', '03'];

  const todayTasks = [
    {
      time: '4 AM - 5 AM',
      name: 'Watering Field',
      status: 'Completed',
      icon: Droplets,
      color: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300',
    },
    {
      time: '5 AM - 6 AM',
      name: 'Spray Insecticides',
      status: 'Completed',
      icon: ShieldAlert,
      color: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300',
    },
    {
      time: '6 AM - 7 AM',
      name: 'Watering Field',
      status: 'Completed',
      icon: Droplets,
      color: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300',
    },
    {
      time: '6 AM - 7 AM',
      name: 'Harvesting Crop',
      status: 'Ongoing',
      icon: Wheat,
      color: 'border-lime-400 bg-lime-950/60 text-lime-300 ring-1 ring-lime-400',
    },
    {
      time: '7 AM - 8 AM',
      name: 'Cultivating Soil',
      status: 'Scheduled',
      icon: Sprout,
      color: 'border-emerald-900/60 bg-emerald-950/20 text-emerald-400/80',
    },
  ];

  const ganttTasks = [
    { name: 'Planting Crops', days: [1, 2, 3], color: 'bg-emerald-500' },
    { name: 'Spray Insecticides', days: [2, 3], color: 'bg-amber-500' },
    { name: 'Watering Plants', days: [0, 1, 2, 3, 4, 5, 6], color: 'bg-cyan-500' },
    { name: 'Harvested Crop', days: [4, 5], color: 'bg-lime-400' },
    { name: 'Cultivate Soil', days: [5, 6], color: 'bg-indigo-400' },
  ];

  return (
    <section className="w-full bg-[#0C1F16] text-stone-100 py-6 px-3 sm:px-6 lg:px-8 border-b border-emerald-900/40 min-h-screen flex flex-col justify-between">
      
      {/* 1. KshetraAI Glassmorphic Top Nav Bar */}
      <div className="w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 p-3 rounded-2xl bg-emerald-950/70 border border-emerald-800/40 backdrop-blur-md shadow-2xl mb-6">
        
        {/* Brand Logo: KshetraAI */}
        <div className="flex items-center gap-2.5">
          <KshetraLogo size="sm" variant="horizontal" />
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-900/40 border border-emerald-800/50 text-xs w-64">
          <Search className="w-3.5 h-3.5 text-emerald-400/70 shrink-0" />
          <input
            type="text"
            placeholder="Search farm operations..."
            className="bg-transparent text-xs text-white placeholder:text-emerald-500/60 focus:outline-none w-full"
          />
        </div>

        {/* Navigation Pills */}
        <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-bold py-1">
          {['Dashboard', 'Crop Management', 'Crop Report', 'Equipment', 'Pest & Disease'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveNav(tab)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeNav === tab
                  ? 'bg-lime-400 text-stone-950 font-black shadow-sm'
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              {tab}
            </button>
          ))}

          {/* Quick Action + button */}
          <button
            onClick={onOpenWhatIf}
            title="Simulate What-If Scenario"
            className="w-7 h-7 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-lime-400 flex items-center justify-center transition-colors cursor-pointer ml-1 shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Notification Bell */}
          <div className="relative ml-1">
            <button className="w-7 h-7 rounded-xl bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300 flex items-center justify-center transition-colors cursor-pointer">
              <Bell className="w-3.5 h-3.5" />
            </button>
            <span className="w-2 h-2 rounded-full bg-lime-400 absolute top-0.5 right-0.5 animate-pulse"></span>
          </div>
        </div>

      </div>

      {/* 2. Header Row: Daily Tasks Title & Coordinates */}
      <div className="w-full max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-emerald-900/40">
        <div>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded-lg bg-emerald-900/40 hover:bg-emerald-800 text-emerald-300">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Daily Tasks
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs text-emerald-400/80 mt-1 pl-7">
            <span className="font-mono text-[11px]">12.3456° S, 98.7654° W</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-lime-400" />
              <span>Mimsays Yard, Turkey</span>
            </div>
            <span>•</span>
            <span>04 June, 2026 | 10:05 AM</span>
          </div>
        </div>

        {/* Quick Button to Launch Optimization Studio */}
        <button
          onClick={onViewCropStudio}
          className="px-4 py-2 rounded-2xl bg-emerald-800/80 hover:bg-emerald-700 text-white text-xs font-bold border border-emerald-600/60 shadow-lg flex items-center gap-2 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-lime-400" />
          <span>Open ML Optimization Studio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Main Dashboard Grid (Left Analysis & Right Weekly Timeline) */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 8 Cols: Scrubber, Today's Tasks, Gantt, and Statistics */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Card: Time Scrubber */}
          <div className="p-5 rounded-3xl bg-emerald-950/60 border border-emerald-800/40 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-0.5">
                  ::: Field Schedule
                </span>
                <span className="text-3xl font-black font-mono text-white tracking-tight">
                  08:23 <span className="text-base text-emerald-400">AM</span>
                </span>
              </div>

              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-900/50 border border-emerald-800/60 text-xs font-bold text-emerald-200">
                <Calendar className="w-3.5 h-3.5 text-lime-400" />
                <span>June, 2026</span>
              </div>
            </div>

            {/* Horizontal Hourly Scrubber */}
            <div className="relative w-full py-2">
              <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
                {hourlySlots.map((hr) => {
                  const isCurrent = hr === activeHour;
                  return (
                    <button
                      key={hr}
                      type="button"
                      onClick={() => setActiveHour(hr)}
                      className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-lime-400 text-stone-950 font-black scale-105 shadow-md shadow-lime-400/20'
                          : 'text-emerald-400/70 hover:text-white hover:bg-emerald-900/30'
                      }`}
                    >
                      <span className="text-xs font-mono font-bold">{hr}</span>
                      <div
                        className={`w-1 h-3 rounded-full mt-1.5 ${
                          isCurrent ? 'bg-stone-950' : 'bg-emerald-800/60'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-Indicators (Previous, Ongoing, Next) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-emerald-900/50 text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-900/30 border border-emerald-800/40">
                <span className="text-[10px] text-emerald-500 block uppercase font-bold">
                  Previous Task
                </span>
                <strong className="text-emerald-200 font-semibold">
                  Watering Field
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-lime-950/50 border border-lime-500/50 text-lime-300">
                <span className="text-[10px] text-lime-400 block uppercase font-extrabold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                  Ongoing Task
                </span>
                <strong className="text-white font-bold">
                  {selectedTask}
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-900/30 border border-emerald-800/40">
                <span className="text-[10px] text-emerald-500 block uppercase font-bold">
                  Next Task
                </span>
                <strong className="text-emerald-200 font-semibold">
                  Spray pesticides
                </strong>
              </div>
            </div>

          </div>

          {/* Card: Today's Tasks */}
          <div className="p-5 rounded-3xl bg-emerald-950/60 border border-emerald-800/40 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-lime-400" />
                <h3 className="font-extrabold text-white text-sm tracking-tight">
                  Today's Tasks
                </h3>
              </div>
              <span className="text-[11px] text-emerald-400">
                Overview of tasks scheduled for today
              </span>
            </div>

            {/* 5 Horizontal Task Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {todayTasks.map((t, idx) => {
                const Icon = t.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedTask(t.name)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between min-h-[90px] transition-all cursor-pointer hover:scale-[1.02] ${t.color}`}
                  >
                    <div className="text-[10px] font-mono opacity-80 mb-1">
                      {t.time}
                    </div>
                    <div className="font-bold text-xs leading-tight">
                      {t.name}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/10 text-[9px] font-bold uppercase tracking-wider">
                      <span>{t.status}</span>
                      <Icon className="w-3 h-3 opacity-80" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dual Widget: Task Timeline (Gantt) & Task Statistics (92%) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Task Timeline (Gantt style) */}
            <div className="p-5 rounded-3xl bg-emerald-950/60 border border-emerald-800/40 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-lime-400" />
                  <span>Task Timeline</span>
                </h4>
                <span className="text-[10px] text-emerald-400/80">Weekly sync</span>
              </div>

              <div className="space-y-2.5 text-xs">
                {ganttTasks.map((gt, i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <span className="w-28 text-[11px] font-medium text-emerald-200 truncate">
                      {gt.name}
                    </span>
                    <div className="flex-1 grid grid-cols-7 gap-1 h-3.5 bg-emerald-900/30 rounded-md p-0.5">
                      {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                        <div
                          key={day}
                          className={`rounded-xs ${
                            gt.days.includes(day) ? `${gt.color} shadow-xs` : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-[9px] font-mono text-emerald-500 mt-3 pt-2 border-t border-emerald-900/40 pl-28">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>
            </div>

            {/* Task Statistics (Waveform + 92% metric) */}
            <div className="p-5 rounded-3xl bg-emerald-950/60 border border-emerald-800/40 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-lime-400" />
                    <span>Task Statistics</span>
                  </h4>
                  <span className="text-[10px] text-emerald-400/80">Progress</span>
                </div>
                <p className="text-[11px] text-emerald-300/70">
                  See how your field tasks are progressing in real time.
                </p>
              </div>

              {/* Waveform graphic */}
              <div className="flex items-end gap-1.5 h-12 my-3 px-2">
                {[40, 65, 85, 30, 95, 75, 60, 80, 90, 100, 70, 85, 95, 60, 40].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="flex-1 bg-gradient-to-t from-emerald-600 to-lime-400 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                  />
                ))}
              </div>

              {/* Big 92% Stat */}
              <div className="flex items-center justify-between pt-3 border-t border-emerald-900/40">
                <div>
                  <div className="text-2xl font-black text-white font-mono flex items-center gap-1.5">
                    <span>92%</span>
                    <span className="text-xs text-lime-400 font-sans font-bold">
                      Works Completed
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-[10px] font-bold text-emerald-300">
                  Task Control (02 Tasks)
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Right 4 Cols: Calendar Timeline & Assigned Team */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-emerald-950/60 border border-emerald-800/40 backdrop-blur-md">
          
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-900/50">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-lime-400" />
              <h3 className="font-extrabold text-sm text-white">
                Team Schedule Grid
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              Week 24
            </span>
          </div>

          {/* Monday 12 & Tuesday 13 Columns */}
          <div className="grid grid-cols-2 gap-2 mb-3 text-center text-xs font-bold">
            <div className="py-1.5 rounded-xl bg-emerald-900/50 text-white">
              Monday 12
            </div>
            <div className="py-1.5 rounded-xl bg-emerald-900/30 text-emerald-400/80">
              Tuesday 13
            </div>
          </div>

          {/* Hourly Timeline Slots */}
          <div className="space-y-3 text-xs max-h-[460px] overflow-y-auto pr-1">
            
            {/* Slot 09:00 - Shooting Stems */}
            <div className="p-3 rounded-2xl bg-emerald-900/40 border border-emerald-700/50 hover:border-lime-400 transition-colors">
              <div className="flex items-center justify-between text-[10px] text-emerald-400 font-mono mb-1">
                <span>09:00 - 11:00 AM</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-800 text-lime-300 font-bold">
                  Shooting Stems
                </span>
              </div>
              <div className="font-bold text-white text-xs">
                Zone 1 & 2 Vegetative Check
              </div>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-emerald-800/50 text-[10px] text-emerald-300">
                <div className="w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center text-[9px] font-bold text-white">
                  SK
                </div>
                <span>Sarah K. (Lead Agronomist)</span>
              </div>
            </div>

            {/* Slot 12:00 - Harvesting */}
            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800/40 hover:border-amber-400 transition-colors">
              <div className="flex items-center justify-between text-[10px] text-amber-400 font-mono mb-1">
                <span>12:00 - 02:00 PM</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-900 text-amber-200 font-bold">
                  Harvesting
                </span>
              </div>
              <div className="font-bold text-white text-xs">
                High-Brix Golden Grain Cutting
              </div>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-amber-900/50 text-[10px] text-amber-200">
                <div className="w-5 h-5 rounded-full bg-amber-700 flex items-center justify-center text-[9px] font-bold text-white">
                  JD
                </div>
                <span>John D. (Harvester Op)</span>
              </div>
            </div>

            {/* Slot 15:00 - Assigning to Quality Control */}
            <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-800/40 hover:border-purple-400 transition-colors">
              <div className="flex items-center justify-between text-[10px] text-purple-300 font-mono mb-1">
                <span>03:00 - 05:00 PM</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-900 text-purple-200 font-bold">
                  Quality Control
                </span>
              </div>
              <div className="font-bold text-white text-xs">
                Post-Harvest Moisture & Grain Sorting
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-purple-900/50">
                <div className="flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 border border-purple-900 flex items-center justify-center text-[8px] font-bold">
                    SK
                  </div>
                  <div className="w-5 h-5 rounded-full bg-cyan-600 border border-purple-900 flex items-center justify-center text-[8px] font-bold">
                    AL
                  </div>
                  <div className="w-5 h-5 rounded-full bg-amber-600 border border-purple-900 flex items-center justify-center text-[8px] font-bold">
                    MR
                  </div>
                </div>
                <span className="text-[10px] text-purple-300 font-bold">
                  3 Agronomists Assigned
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
