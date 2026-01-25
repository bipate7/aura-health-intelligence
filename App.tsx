
import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { DailyCheckIn } from './components/DailyCheckIn';
import { Auth } from './components/Auth';
import { History } from './components/History';
import { SleepAnalysis } from './components/SleepAnalysis';
import { Profile } from './components/Profile';
import { AICoach } from './components/AICoach';
import { MemoryManager } from './components/MemoryManager';
import { WeeklyBriefing } from './components/WeeklyBriefing';
import { ViewState, User } from './types';
import { LayoutDashboard, PlusCircle, History as HistoryIcon, User as UserIcon, Sun, Moon, BedDouble, Sparkles, Shield, TrendingUp } from 'lucide-react';
import { AnimatePresence, motion, Variants } from 'framer-motion';

// Explicitly define Variants and cast ease to any to resolve type mismatch
const pageVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.98, filter: 'blur(10px)' },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    filter: 'blur(0px)',
    transition: { 
      duration: 0.6, 
      ease: [0.16, 1, 0.3, 1] as any
    } 
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    scale: 1.02, 
    filter: 'blur(10px)',
    transition: { 
      duration: 0.4, 
      ease: [0.16, 1, 0.3, 1] as any
    } 
  }
};

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  if (!user) return <Auth onLogin={setUser} />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500 overflow-x-hidden">
      <div className="max-w-6xl mx-auto min-h-screen flex flex-col md:flex-row">
        
        <nav className="hidden md:flex flex-col w-72 p-8 border-r dark:border-slate-800 h-screen sticky top-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl z-20">
            <div className="mb-12 flex items-center gap-3">
                <motion.div 
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30"
                >
                  A
                </motion.div>
                <span className="text-2xl font-black tracking-tighter">AURA</span>
            </div>
            
            <div className="space-y-1">
                <NavButton active={view === ViewState.DASHBOARD} onClick={() => setView(ViewState.DASHBOARD)} icon={<LayoutDashboard size={20} />} label="Core" />
                <NavButton active={view === ViewState.COACH} onClick={() => setView(ViewState.COACH)} icon={<Sparkles size={20} />} label="Intelligence" />
                <NavButton active={view === ViewState.BRIEFING} onClick={() => setView(ViewState.BRIEFING)} icon={<TrendingUp size={20} />} label="Weekly Briefing" />
                <NavButton active={view === ViewState.SLEEP} onClick={() => setView(ViewState.SLEEP)} icon={<BedDouble size={20} />} label="Sleep Rhythms" />
                <NavButton active={view === ViewState.MEMORY} onClick={() => setView(ViewState.MEMORY)} icon={<Shield size={20} />} label="Sovereignty" />
                <NavButton active={view === ViewState.PROFILE} onClick={() => setView(ViewState.PROFILE)} icon={<UserIcon size={20} />} label="Settings" />
            </div>

            <div className="mt-auto pt-8 space-y-4">
                 <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-indigo-600 transition-colors font-bold text-sm">
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />} {darkMode ? 'Day Mode' : 'Deep Mode'}
                 </button>
                 <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setView(ViewState.CHECK_IN)}
                    className="w-full bg-slate-900 dark:bg-indigo-600 text-white p-4 rounded-2xl font-black shadow-xl flex items-center justify-center gap-2"
                >
                    <PlusCircle size={20} /> CHECK IN
                </motion.button>
            </div>
        </nav>

        <main className="flex-1 p-6 md:p-16 relative">
            <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="w-full"
                >
                    {view === ViewState.DASHBOARD && <Dashboard onNavigate={setView} user={user} />}
                    {view === ViewState.COACH && <AICoach user={user} />}
                    {view === ViewState.BRIEFING && <WeeklyBriefing user={user} />}
                    {view === ViewState.SLEEP && <SleepAnalysis user={user} />}
                    {view === ViewState.HISTORY && <History user={user} />}
                    {view === ViewState.MEMORY && <MemoryManager user={user} />}
                    {view === ViewState.PROFILE && <Profile user={user} onLogout={() => setUser(null)} />}
                </motion.div>
            </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {view === ViewState.CHECK_IN && (
          <DailyCheckIn user={user} onComplete={() => setView(ViewState.DASHBOARD)} onCancel={() => setView(ViewState.DASHBOARD)} />
        )}
      </AnimatePresence>
    </div>
  );
}

const NavButton = ({ active, onClick, icon, label }: any) => (
    <motion.button 
        whileHover={{ x: 6 }} 
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm uppercase tracking-tighter ${
            active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
    >
        {icon} {label}
    </motion.button>
);
