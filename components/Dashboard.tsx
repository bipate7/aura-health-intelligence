
import React, { useEffect, useState } from 'react';
import { HealthLog, User, ReadinessScore, Insight } from '../types';
import { StorageService } from '../services/storageService';
import { NeuralOrchestrator } from '../core/neural-orchestrator';
import { GeminiService } from '../services/geminiService';
import { NeuralStatus } from './NeuralStatus';
import { Moon, Zap, Sparkles, Clock, TrendingUp, Activity, Brain, Target, ArrowUpRight, ChevronRight, Sun, Coffee, Sunset } from 'lucide-react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { RecoveryRingSkeleton, ChartSkeleton, SkeletonPulse } from './Skeleton';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  onNavigate: (view: any) => void;
  user: User;
}

const scrollFadeVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const sequenceContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.1
    }
  }
};

const quickCardGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const quickCardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, user }) => {
  const [readiness, setReadiness] = useState<ReadinessScore | null>(null);
  const [insight, setInsight] = useState<Insight | null>(null);
  const [systemMetrics, setSystemMetrics] = useState({ latency: 0, confidence: 0 });
  const [chronotype, setChronotype] = useState<'Lion' | 'Bear' | 'Wolf' | 'Dolphin' | 'Unknown'>('Unknown');
  const [loading, setLoading] = useState(true);
  const [calibrationMode, setCalibrationMode] = useState(true);

  useEffect(() => {
    const loadIntelligence = async () => {
        setLoading(true);
        const logs = StorageService.getLogs(user.id).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const memories = StorageService.getMemory(user.id);
        
        setCalibrationMode(logs.length < 7);
        
        // Execute Neural Core Orchestration
        const intelligence = await NeuralOrchestrator.generateDailyIntelligence(logs, memories);
        const detectedChronotype = await GeminiService.detectChronotype(logs);
        
        setInsight(intelligence.insight);
        setReadiness(intelligence.readiness);
        setSystemMetrics({ latency: intelligence.latency, confidence: intelligence.confidence });
        setChronotype(detectedChronotype);
        setLoading(false);
    };
    loadIntelligence();
  }, [user.id]);

  if (loading) return (
    <div className="space-y-8 pb-20">
        <div className="h-16 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
        <RecoveryRingSkeleton />
        <ChartSkeleton height="h-64" />
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <NeuralStatus 
            latency={systemMetrics.latency} 
            confidence={systemMetrics.confidence} 
            safetyActive={true} 
        />
      </motion.div>

      {/* Header & Main Readiness */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollFadeVariants}
        className="flex flex-col lg:flex-row gap-8 items-start"
      >
        <div className="w-full lg:w-1/3 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl relative overflow-hidden group">
            {calibrationMode && (
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 animate-pulse z-20" />
            )}
            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700"><Activity size={200} /></div>
            <div className="relative z-10 space-y-4 text-center lg:text-left">
                <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Daily Readiness</h3>
                    {calibrationMode && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                            <Clock size={10} /> Calibrating
                        </div>
                    )}
                </div>
                <div className="flex items-baseline justify-center lg:justify-start gap-2">
                    <motion.span 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-7xl font-black text-slate-800 dark:text-white tracking-tighter"
                    >
                        {readiness?.score}%
                    </motion.span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {readiness?.reason}
                </p>
            </div>
        </div>

        <div className="flex-1 w-full space-y-8">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Aura Core</h1>
                    <p className="text-slate-500 font-medium">System State: {calibrationMode ? 'Calibrating' : 'Operational'}</p>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05, y: -2 }} 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('CHECK_IN')}
                    className="bg-slate-900 dark:bg-indigo-600 text-white px-8 py-4 rounded-[1.25rem] font-black shadow-2xl flex items-center gap-2 text-sm tracking-tight"
                >
                    Log Signal <Sparkles size={18} />
                </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div 
                    whileHover={{ x: 4, scale: 1.02 }} 
                    className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50 p-5 rounded-2xl flex gap-4 transition-all group cursor-pointer" 
                    onClick={() => onNavigate('COACH')}
                >
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                        <Brain className="text-indigo-600 dark:text-indigo-400" size={20} />
                    </div>
                    <div className="text-sm flex-1">
                        <span className="font-black text-indigo-800 dark:text-indigo-200 uppercase text-[10px] tracking-widest block mb-1">Latest Insight</span>
                        <span className="text-indigo-700 dark:text-indigo-300 font-medium leading-relaxed truncate block max-w-[200px]">
                            {insight?.title || "Evaluating logs..."}
                        </span>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 mt-1" />
                </motion.div>
                <motion.div className="bg-slate-50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-800/50 p-5 rounded-2xl flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900/30 flex items-center justify-center shrink-0">
                        <Target className="text-slate-400" size={20} />
                    </div>
                    <div className="text-sm">
                        <span className="font-black text-slate-400 uppercase text-[10px] tracking-widest block mb-1">Sovereignty Check</span>
                        <span className="text-slate-500 font-medium leading-relaxed">Stateless Inference. 0 Logs Shared.</span>
                    </div>
                </motion.div>
            </div>
        </div>
      </motion.section>

      {/* Synchronized Intelligence Section (Chronotype + Quick Cards) */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sequenceContainerVariants}
        className="space-y-12"
      >
        {/* Chronotype Alignment Section */}
        <motion.section
          variants={scrollFadeVariants}
          className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div className="space-y-1">
                  <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">Biological Rhythm</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Predicted Chronotype</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                      {chronotype} Alignment 
                      {chronotype === 'Lion' && <Sun className="text-amber-500" size={24} />}
                      {chronotype === 'Bear' && <Coffee className="text-orange-500" size={24} />}
                      {chronotype === 'Wolf' && <Moon className="text-indigo-500" size={24} />}
                      {chronotype === 'Dolphin' && <Activity className="text-emerald-500" size={24} />}
                  </h2>
              </div>
              
              <div className="flex gap-8">
                  <div className="text-center">
                      <div className="text-2xl font-black text-indigo-600">82%</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alignment</div>
                  </div>
                  <div className="text-center">
                      <div className="text-2xl font-black text-emerald-600">High</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stability</div>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={getChronotypeData(chronotype)}>
                          <defs>
                              <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-700" />
                          <XAxis 
                              dataKey="time" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                          />
                          <YAxis hide domain={[0, 100]} />
                          <Tooltip 
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                              itemStyle={{ color: '#6366f1' }}
                          />
                          <Area 
                              type="monotone" 
                              dataKey="energy" 
                              stroke="#6366f1" 
                              strokeWidth={4} 
                              fillOpacity={1} 
                              fill="url(#colorEnergy)" 
                              animationDuration={2000}
                          />
                      </AreaChart>
                  </ResponsiveContainer>
                  <div className="flex justify-between px-4 mt-2">
                      <div className="flex flex-col items-center opacity-30">
                          <Sun size={12} />
                          <span className="text-[8px] font-bold uppercase">Sunrise</span>
                      </div>
                      <div className="flex flex-col items-center opacity-30">
                          <Zap size={12} className="text-amber-500" />
                          <span className="text-[8px] font-bold uppercase">Peak</span>
                      </div>
                      <div className="flex flex-col items-center opacity-30">
                          <Sunset size={12} />
                          <span className="text-[8px] font-bold uppercase">Sunset</span>
                      </div>
                  </div>
              </div>

              <div className="space-y-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <div className="space-y-2">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Strategic Advice</h4>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                          {getChronotypeInsight(chronotype)}
                      </p>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                      <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-500 uppercase tracking-tighter">Peak Window</span>
                          <span className="font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg">{getChronotypePeak(chronotype)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-500 uppercase tracking-tighter">Deep Work Cap</span>
                          <span className="font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg">4 Hours</span>
                      </div>
                  </div>
              </div>
          </div>
        </motion.section>

        {/* Quick Cards Grid - Animates after Chronotype section */}
        <motion.section 
          variants={quickCardGridVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
            <QuickCard label="Intelligence" icon={<Sparkles />} onClick={() => onNavigate('COACH')} variants={quickCardVariants} />
            <QuickCard label="Briefing" icon={<TrendingUp />} onClick={() => onNavigate('BRIEFING')} variants={quickCardVariants} />
            <QuickCard label="Timeline" icon={<Clock />} onClick={() => onNavigate('HISTORY')} variants={quickCardVariants} />
            <QuickCard label="Sovereignty" icon={<Brain />} onClick={() => onNavigate('MEMORY')} variants={quickCardVariants} />
        </motion.section>
      </motion.div>
    </div>
  );
};

// Helper to get simulated daily energy arc based on chronotype
const getChronotypeData = (type: string) => {
    const hours = ["6am", "9am", "12pm", "3pm", "6pm", "9pm", "12am"];
    let energyLevels = [30, 60, 80, 50, 40, 30, 10]; // Default Bear

    if (type === 'Lion') energyLevels = [80, 95, 70, 40, 30, 20, 5];
    if (type === 'Wolf') energyLevels = [10, 20, 40, 60, 90, 85, 40];
    if (type === 'Dolphin') energyLevels = [40, 60, 50, 70, 50, 65, 30];

    return hours.map((h, i) => ({ time: h, energy: energyLevels[i] }));
};

const getChronotypePeak = (type: string) => {
    if (type === 'Lion') return "06:00 - 10:00";
    if (type === 'Wolf') return "18:00 - 21:00";
    if (type === 'Dolphin') return "10:00 - 14:00";
    return "10:00 - 14:00"; // Bear
};

const getChronotypeInsight = (type: string) => {
    if (type === 'Lion') return "Your cortisol spikes early. Tackle your most demanding analytical tasks before 10 AM. Avoid caffeine after midday to protect your early sleep onset.";
    if (type === 'Wolf') return "Biological peak occurs late. Shift administrative work to the morning and reserve high-creativity sessions for the evening window.";
    if (type === 'Dolphin') return "Your energy is fragmented. Use 90-minute 'sprints' throughout the day and prioritize light-blocking protocols to stabilize REM cycles.";
    return "You follow the solar cycle perfectly. Mid-morning is your primary cognitive peak. Utilize the post-lunch dip for low-intensity networking or restorative movement.";
};

const QuickCard = ({ label, icon, onClick, variants }: any) => (
    <motion.button 
        variants={variants}
        whileHover={{ y: -8, scale: 1.05 }} 
        onClick={onClick}
        className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-4 shadow-sm hover:shadow-2xl transition-all duration-300 group"
    >
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
            {React.cloneElement(icon, { size: 24 })}
        </div>
        <div className="space-y-1 text-center">
            <span className="text-sm font-black text-slate-800 dark:text-white block tracking-tight uppercase">{label}</span>
            <ArrowUpRight size={12} className="text-slate-300 mx-auto group-hover:text-indigo-500 transition-colors" />
        </div>
    </motion.button>
);
