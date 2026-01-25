
import React, { useMemo, useState, useEffect } from 'react';
import { HealthLog, User } from '../types';
import { StorageService } from '../services/storageService';
import { motion, Variants } from 'framer-motion';
import { Calendar, Moon, Zap, AlertCircle, Move, Utensils } from 'lucide-react';
import { HistoryItemSkeleton, SkeletonPulse } from './Skeleton';

interface HistoryProps {
    user: User;
}

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

export const History: React.FC<HistoryProps> = ({ user }) => {
    const [loading, setLoading] = useState(true);
    const logs = useMemo(() => StorageService.getLogs(user.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [user.id]);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(timer);
    }, [user.id]);

    // Group logs by Month
    const groupedLogs = useMemo<Record<string, HealthLog[]>>(() => {
        const groups: Record<string, HealthLog[]> = {};
        logs.forEach(log => {
            const date = new Date(log.date);
            const key = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            if (!groups[key]) groups[key] = [];
            groups[key].push(log);
        });
        return groups;
    }, [logs]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20, scale: 0.98 },
        show: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { ease: [0.16, 1, 0.3, 1], duration: 0.6 }
        }
    };

    if (loading) {
        return (
            <div className="space-y-8 pb-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-2">
                        <SkeletonPulse className="w-64 h-8" />
                        <SkeletonPulse className="w-48 h-4 opacity-50" />
                    </div>
                    <SkeletonPulse className="w-32 h-10 rounded-full" />
                </div>
                <div className="space-y-4">
                    <SkeletonPulse className="w-32 h-4 opacity-40" />
                    <HistoryItemSkeleton />
                    <HistoryItemSkeleton />
                    <HistoryItemSkeleton />
                </div>
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
                <Calendar size={48} className="mb-4 opacity-20" />
                <h2 className="text-lg font-medium text-slate-600 dark:text-slate-400">No History Yet</h2>
                <p>Complete your first daily check-in to see your timeline.</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-light text-slate-900 dark:text-white tracking-tight">Health History</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">A detailed timeline of your journey</p>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm font-medium text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-700"
                >
                    {logs.length} Total Entries
                </motion.div>
            </div>

            {Object.entries(groupedLogs).map(([month, monthLogs]: [string, HealthLog[]]) => (
                <motion.section 
                    key={month} 
                    className="space-y-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={scrollFadeVariants}
                >
                    <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 py-4 z-10 backdrop-blur-md border-b dark:border-slate-800">
                        {month}
                    </h3>
                    <motion.div 
                        variants={container}
                        initial="hidden"
                        animate="visible"
                        className="space-y-3"
                    >
                        {monthLogs.map((log) => (
                            <HistoryCard key={log.id} log={log} variants={item} />
                        ))}
                    </motion.div>
                </motion.section>
            ))}
        </div>
    );
};

const HistoryCard: React.FC<{ log: HealthLog, variants: any }> = ({ log, variants }) => {
    const date = new Date(log.date);
    
    // Quick helpers for color coding
    const getScoreColor = (val: number, inverse = false) => {
        const good = inverse ? val <= 4 : val >= 7;
        const mid = inverse ? val > 4 && val <= 7 : val >= 4 && val < 7;
        return good ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' : mid ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20' : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20';
    };

    return (
        <motion.div 
            variants={variants}
            whileHover={{ scale: 1.01, x: 4 }}
            className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 md:items-center"
        >
            {/* Date Column */}
            <div className="flex flex-row md:flex-col items-center md:items-start gap-3 md:gap-1 w-full md:w-24 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700 pb-3 md:pb-0 md:pr-4">
                <span className="text-2xl font-bold text-slate-800 dark:text-white">{date.getDate()}</span>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span className="text-xs text-slate-300 dark:text-slate-600 hidden md:inline">{date.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}</span>
            </div>

            {/* Metrics Grid */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricPill icon={<Moon size={14} />} label="Sleep" value={log.sleepQuality} colorClass={getScoreColor(log.sleepQuality)} />
                <MetricPill icon={<Zap size={14} />} label="Energy" value={log.energy} colorClass={getScoreColor(log.energy)} />
                <MetricPill icon={<AlertCircle size={14} />} label="Stress" value={log.stress} colorClass={getScoreColor(log.stress, true)} />
                
                {/* Activity & Nutrition Mini Summary */}
                <div className="col-span-2 md:col-span-1 flex flex-col justify-center text-xs text-slate-500 dark:text-slate-400 space-y-1 pl-2 border-l border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                        <Move size={12} className="text-indigo-400"/>
                        <span>{log.activity?.type || 'Rest'} ({log.activity?.duration || 0}m)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Utensils size={12} className="text-blue-400"/>
                        <span className="truncate max-w-[100px]">{log.nutrition ? `${log.nutrition.calories} kcal` : 'No log'}</span>
                    </div>
                </div>
            </div>

            {/* Notes Preview (Desktop) */}
            {log.notes && (
                <div className="hidden lg:block w-48 text-xs text-slate-400 italic truncate border-l border-slate-100 dark:border-slate-700 pl-4">
                    "{log.notes}"
                </div>
            )}
        </motion.div>
    );
};

const MetricPill = ({ icon, label, value, colorClass }: any) => (
    <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClass}`}>
            {icon}
        </div>
        <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">{label}</div>
            <div className="font-semibold text-slate-700 dark:text-slate-300">{value}/10</div>
        </div>
    </div>
);
