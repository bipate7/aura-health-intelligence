
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
import { LayoutDashboard, PlusCircle, History as HistoryIcon, User as UserIcon, Sun, Moon, BedDouble, Sparkles, Shield, TrendingUp, Zap } from 'lucide-react';
import { AnimatePresence, motion, Variants } from 'framer-motion';

const pageVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.99, filter: 'blur(8px)' },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    filter: 'blur(0px)',
    transition: { 
      duration: 0.5, 
      ease: [0.16, 1, 0.3, 1] as any
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 1.01, 
    filter: 'blur(4px)',
    transition: { 
      duration: 0.3, 
      ease: [0.16, 1, 0.3, 1] as any
    } 
  }
};

const AmbientBackground = () => (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-70 animate-blob" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-200/20 dark:bg-purple-900/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-70 animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-70 animate-blob" style={{ animationDelay: '4s' }} />
    </div>
);

const Footer = () => (
    <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-auto pt-20 pb-10 border-t border-slate-200/60 dark:border-slate-800/60"
    >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Zap size={16} className="fill-current" />
                    </div>
                    <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest">Aura HealthOS v3.5</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm font-medium">
                    Built on the Gemini 3 Neural Core. This system utilizes a local-first architecture to ensure maximum biometric sovereignty. Your data never leaves this device unencrypted.
                </p>
            </div>
            
            <div className="flex flex-col md:items-end justify-between gap-4">
                 <div className="flex gap-6">
                    <FooterLink label="System Status" active />
                    <FooterLink label="Privacy Policy" />
                    <FooterLink label="Clinical Terms" />
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Neural Orchestrator Online
                 </div>
            </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-100 dark:border-slate-800/50">
            <div className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em]">
                © 2026 Aura Health Intelligence
            </div>
            <div className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                Tokyo • San Francisco • London
            </div>
        </div>
    </motion.footer>
);

const FooterLink = ({ label, active }: { label: string, active?: boolean }) => (
    <button className={`text-[10px] font-bold uppercase tracking-widest transition-colors hover:text-indigo-500 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
        {label}
    </button>
);

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500 overflow-x-hidden relative">
      <AmbientBackground />
      
      <div className="max-w-6xl mx-auto min-h-screen flex flex-col md:flex-row relative z-10">
        
        <nav className="hidden md:flex flex-col w-72 p-8 border-r dark:border-slate-800 h-screen sticky top-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl z-20">
            <div className="mb-12 flex items-center gap-3">
                <motion.div 
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30 cursor-pointer"
                >
                  A
                </motion.div>
                <span className="text-2xl font-black tracking-tighter">AURA</span>
            </div>
            
            <div className="space-y-2">
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

        <main className="flex-1 p-6 md:p-16 relative w-full overflow-x-hidden flex flex-col min-h-screen">
            <div className="flex-1 w-full">
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
            </div>
            
            <Footer />
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
        whileHover={{ x: 6, backgroundColor: 'rgba(99, 102, 241, 0.1)' }} 
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm uppercase tracking-tighter relative overflow-hidden ${
            active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
        }`}
    >
        {active && (
             <motion.div 
                layoutId="navHighlight"
                className="absolute inset-0 bg-indigo-600 z-0"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
             />
        )}
        <span className="relative z-10 flex items-center gap-4">
            {icon} {label}
        </span>
    </motion.button>
);
