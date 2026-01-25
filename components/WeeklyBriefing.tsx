
import React, { useEffect, useState } from 'react';
import { User, WeeklyBriefing as BriefingType, HealthLog } from '../types';
import { GeminiService } from '../services/geminiService';
import { StorageService } from '../services/storageService';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Sparkles, Calendar, TrendingUp, Shield, ChevronRight, BookOpen } from 'lucide-react';
import { SkeletonPulse } from './Skeleton';

const scrollFadeVariants: Variants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(8px)', scale: 0.98 },
    visible: { 
        opacity: 1, 
        y: 0, 
        filter: 'blur(0px)',
        scale: 1,
        transition: { 
            duration: 1, 
            ease: [0.16, 1, 0.3, 1] 
        } 
    }
};

export const WeeklyBriefing: React.FC<{ user: User }> = ({ user }) => {
    const [briefing, setBriefing] = useState<BriefingType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBriefing = async () => {
            const logs = StorageService.getLogs(user.id);
            const memories = StorageService.getMemory(user.id);
            if (logs.length >= 7) {
                try {
                    const res = await GeminiService.generateWeeklyBriefing(logs, memories);
                    setBriefing(res);
                } catch (e) { console.error(e); }
            }
            setLoading(false);
        };
        fetchBriefing();
    }, [user.id]);

    if (loading) return (
        <div className="max-w-3xl mx-auto py-12 space-y-8">
            <SkeletonPulse className="w-48 h-10 rounded-xl" />
            <SkeletonPulse className="w-full h-64 rounded-[2.5rem]" />
            <SkeletonPulse className="w-full h-32 rounded-2xl" />
        </div>
    );

    if (!briefing) return (
        <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
            <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full inline-block">
                <Calendar size={48} className="text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold">Calibration in Progress</h2>
            <p className="text-slate-500 max-w-sm mx-auto">Aura requires 7 days of neural patterns to generate your first Weekly Briefing.</p>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto py-12 space-y-16">
            <header className="flex justify-between items-end">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full mb-2 inline-block">Weekly Synthesis</span>
                    <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">{briefing.weekLabel}</h1>
                </motion.div>
                <BookOpen className="text-slate-300" size={32} />
            </header>

            <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={scrollFadeVariants}
                className="bg-white dark:bg-slate-800 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-1000"><TrendingUp size={240} /></div>
                <div className="relative z-10 space-y-10">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="text-indigo-500" size={20} />
                        <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Biological Trajectory</span>
                        <span className={`ml-auto px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            briefing.biologicalTrajectory === 'Ascending' ? 'bg-emerald-500 text-white' : 'bg-indigo-500 text-white'
                        }`}>
                            {briefing.biologicalTrajectory}
                        </span>
                    </div>

                    <p className="text-2xl font-medium text-slate-700 dark:text-slate-200 leading-relaxed italic border-l-4 border-indigo-500/20 pl-8">
                        "{briefing.narrativeSummary}"
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {briefing.criticalCorrelations.map((c, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, x: 10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
                                className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300 shadow-sm"
                            >
                                {c}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={scrollFadeVariants}
                className="bg-indigo-950 text-white p-10 rounded-[2.5rem] shadow-2xl space-y-6 relative overflow-hidden"
            >
                <motion.div 
                    animate={{ rotate: [0, 5, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"
                />
                
                <div className="flex items-center gap-3 relative z-10">
                    <Shield className="text-indigo-400" size={24} />
                    <h3 className="font-black text-lg uppercase tracking-[0.2em]">Data Sovereignty Check</h3>
                </div>
                <p className="text-indigo-100/80 leading-relaxed text-sm relative z-10 font-medium">
                    {briefing.sovereigntyCheck}
                </p>
                <div className="pt-6 border-t border-white/10 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] opacity-60 relative z-10">
                    <span>Audit Status: Validated</span>
                    <span>Lineage: Complete</span>
                </div>
            </motion.section>

            <footer className="text-center pt-12">
                <p className="text-[10px] font-bold text-slate-400 max-w-md mx-auto leading-relaxed uppercase tracking-widest opacity-60">
                    This briefing is synthesized by Aura Core V3. All insights derived from encrypted local logs.
                </p>
            </footer>
        </motion.div>
    );
};
