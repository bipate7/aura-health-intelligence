
import React, { useMemo, useState, useEffect } from 'react';
import { HealthLog, User } from '../types';
import { StorageService } from '../services/storageService';
import { motion, Variants } from 'framer-motion';
import { Moon, Battery, Brain, Clock, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { MetricSkeleton, ChartSkeleton, SkeletonPulse } from './Skeleton';

interface Props {
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
            duration: 1.2, 
            ease: [0.16, 1, 0.3, 1] 
        } 
    }
};

const AnimatedBar = (props: any) => {
    const { x, y, width, height, fill, payload, radius } = props;
    if (width <= 0 || height <= 0 || isNaN(x) || isNaN(y)) return null;

    return (
        <motion.rect
            x={x}
            width={width}
            fill={fill}
            initial={{ height: 0, y: y + height }}
            animate={{ height, y }}
            transition={{ 
                type: "spring", 
                stiffness: 120, 
                damping: 20,
                mass: 0.8,
                delay: payload.index ? payload.index * 0.05 : 0 
            }}
            rx={radius ? (Array.isArray(radius) ? radius[0] : radius) : 0}
            ry={radius ? (Array.isArray(radius) ? radius[0] : radius) : 0}
        />
    );
};

export const SleepAnalysis: React.FC<Props> = ({ user }) => {
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const logs = useMemo(() => StorageService.getLogs(user.id).sort((a, b) => new Date(a.date).getTime() - new Date(a.date).getTime()), [user.id]);
    const last14 = logs.slice(-14);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800); 
        
        // Theme detection
        const checkTheme = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        
        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [user.id]);

    const chartColors = {
        grid: isDarkMode ? '#1e293b' : '#f1f5f9',
        text: isDarkMode ? '#94a3b8' : '#64748b',
        tooltipBg: isDarkMode ? '#0f172a' : '#ffffff',
        tooltipBorder: isDarkMode ? '#1e293b' : '#f1f5f9'
    };

    const avgQuality = last14.reduce((acc, l) => acc + l.sleepQuality, 0) / (last14.length || 1);
    const logsWithPhases = last14.filter(l => l.sleepPhases);
    const hasPhaseData = logsWithPhases.length > 0;
    
    const avgDeep = (logsWithPhases.reduce((acc, l) => acc + (l.sleepPhases?.deep || 0), 0) / (logsWithPhases.length || 1)) / 60;
    const avgREM = (logsWithPhases.reduce((acc, l) => acc + (l.sleepPhases?.rem || 0), 0) / (logsWithPhases.length || 1)) / 60;
    const avgTotal = (logsWithPhases.reduce((acc, l) => {
        const p = l.sleepPhases;
        return acc + (p ? p.deep + p.light + p.rem : 0);
    }, 0) / (logsWithPhases.length || 1)) / 60;

    const chartData = last14.map((l, index) => {
        const p = l.sleepPhases;
        return {
            index,
            date: new Date(l.date).toLocaleDateString(undefined, { weekday: 'short' }),
            quality: l.sleepQuality,
            deep: p ? p.deep / 60 : 0,
            light: p ? p.light / 60 : 0,
            rem: p ? p.rem / 60 : 0,
            awake: p ? p.awake / 60 : 0,
            total: p ? (p.deep + p.light + p.rem) / 60 : 0
        };
    });

    const container: Variants = {
        hidden: { opacity: 0 },
        show: { 
            opacity: 1, 
            transition: { 
                staggerChildren: 0.1,
                delayChildren: 0.1 
            } 
        }
    };
    
    const item: Variants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: { type: "spring", stiffness: 100, damping: 20, mass: 1 } 
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 pb-20 overflow-hidden">
                <div className="space-y-3">
                    <SkeletonPulse className="w-64 h-8" />
                    <SkeletonPulse className="w-96 h-4" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricSkeleton />
                    <MetricSkeleton />
                    <MetricSkeleton />
                    <MetricSkeleton />
                </div>
                <ChartSkeleton height="h-80" />
            </div>
        );
    }

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-12 pb-20 overflow-hidden">
             <div className="flex justify-between items-end">
                <motion.div variants={item} layout>
                    <h1 className="text-3xl font-light text-slate-900 dark:text-white tracking-tight">Sleep & Recovery</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Deep dive into your circadian rhythms.</p>
                </motion.div>
            </div>

            <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={scrollFadeVariants}
            >
                <motion.div variants={item} layoutId="metric-1">
                    <MetricBox icon={<Moon size={18} />} label="Avg Quality" value={`${avgQuality.toFixed(1)}/10`} subtext="Overall Score" color="indigo" />
                </motion.div>
                <motion.div variants={item} layoutId="metric-2">
                    <MetricBox icon={<Clock size={18} />} label="Avg Duration" value={`${avgTotal.toFixed(1)}h`} subtext="Total Sleep" color="blue" />
                </motion.div>
                <motion.div variants={item} layoutId="metric-3">
                    <MetricBox icon={<Battery size={18} />} label="Deep Sleep" value={`${avgDeep.toFixed(1)}h`} subtext="Physical Restoration" color="emerald" />
                </motion.div>
                <motion.div variants={item} layoutId="metric-4">
                    <MetricBox icon={<Brain size={18} />} label="REM Sleep" value={`${avgREM.toFixed(1)}h`} subtext="Mental Restoration" color="purple" />
                </motion.div>
            </motion.div>

            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={scrollFadeVariants}
                className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl min-h-[400px] transition-shadow duration-300 hover:shadow-2xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tighter">Sleep Architecture</h3>
                </div>
                
                {hasPhaseData ? (
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: chartColors.text, fontSize: 10, fontWeight: 700}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: chartColors.text, fontSize: 10, fontWeight: 700}} unit="h" />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: chartColors.tooltipBg, color: isDarkMode ? '#fff' : '#000' }}
                                    cursor={{fill: 'transparent'}}
                                />
                                <Legend wrapperStyle={{paddingTop: '20px'}} iconType="circle" />
                                
                                <Bar 
                                    isAnimationActive={false}
                                    dataKey="deep" 
                                    name="Deep" 
                                    stackId="a" 
                                    fill="#059669" 
                                    shape={<AnimatedBar radius={[0, 0, 4, 4]} />} 
                                />
                                <Bar 
                                    isAnimationActive={false} 
                                    dataKey="rem" 
                                    name="REM" 
                                    stackId="a" 
                                    fill="#8b5cf6" 
                                    shape={<AnimatedBar />} 
                                />
                                <Bar 
                                    isAnimationActive={false} 
                                    dataKey="light" 
                                    name="Light" 
                                    stackId="a" 
                                    fill="#6366f1" 
                                    shape={<AnimatedBar radius={[4, 4, 0, 0]} />} 
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                        <Moon size={48} className="mb-4 opacity-20" />
                        <p>No detailed sleep phase data available yet.</p>
                        <p className="text-sm">Log your sleep phases in the Daily Check-In to see insights.</p>
                    </div>
                )}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={scrollFadeVariants}
                    className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl transition-shadow duration-300 hover:shadow-2xl"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tighter">Correlation Trend</h3>
                    </div>
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: chartColors.text, fontSize: 10, fontWeight: 700}} dy={10} />
                                <YAxis yAxisId="left" domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#6366f1', fontSize: 10, fontWeight: 700}} />
                                <YAxis yAxisId="right" orientation="right" domain={[0, 12]} axisLine={false} tickLine={false} tick={{fill: '#10b981', fontSize: 10, fontWeight: 700}} unit="h" />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: chartColors.tooltipBg, color: isDarkMode ? '#fff' : '#000' }} 
                                />
                                <Legend verticalAlign="top" height={36}/>
                                <Line 
                                    yAxisId="left"
                                    name="Quality"
                                    animationDuration={2500} 
                                    type="monotone" 
                                    dataKey="quality" 
                                    stroke="#6366f1" 
                                    strokeWidth={4} 
                                    dot={{r: 4, fill: '#6366f1', strokeWidth: 0}} 
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                                <Line 
                                    yAxisId="right"
                                    name="Duration"
                                    animationDuration={2500} 
                                    type="monotone" 
                                    dataKey="total" 
                                    stroke="#10b981" 
                                    strokeWidth={3} 
                                    strokeDasharray="5 5"
                                    dot={{r: 3, fill: '#10b981', strokeWidth: 0}} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={scrollFadeVariants}
                    className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group"
                >
                     <div className="relative z-10">
                        <h3 className="text-xl font-black mb-4 flex items-center gap-2 uppercase tracking-tighter">
                            <Zap size={20} className="text-yellow-400" />
                            Recovery Analysis
                        </h3>
                        <p className="text-indigo-100 leading-relaxed text-sm mb-6">
                            {avgDeep > 1.5 ? 
                                "Your physical restoration markers are at peak capacity, indicating successful muscle fiber repair and optimal metabolic clearance." : 
                                "Deep sleep deficiency detected. We recommend lowering ambient temperature and shifting intense cognitive tasks earlier in the day to facilitate parasympathetic onset."}
                        </p>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-indigo-300">
                                    <span className="font-black uppercase tracking-widest text-[8px]">Physical Restore</span>
                                    <span className="font-black tracking-widest text-[8px]">{Math.round((avgDeep / 2) * 100)}%</span>
                                </div>
                                <div className="w-full bg-indigo-950/50 h-3 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${Math.min((avgDeep / 2) * 100, 100)}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                        className="bg-emerald-400 h-full rounded-full shadow-[0_0_10px_rgba(52,211,153,0.4)]" 
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-indigo-300">
                                    <span className="font-black uppercase tracking-widest text-[8px]">Neural Consolidate</span>
                                    <span className="font-black tracking-widest text-[8px]">{Math.round((avgREM / 2) * 100)}%</span>
                                </div>
                                <div className="w-full bg-indigo-950/50 h-3 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${Math.min((avgREM / 2) * 100, 100)}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                        className="bg-purple-400 h-full rounded-full shadow-[0_0_10px_rgba(167,139,250,0.4)]" 
                                    />
                                </div>
                            </div>
                        </div>
                     </div>
                     <motion.div
                        animate={{ 
                            scale: [1, 1.1, 1],
                            opacity: [0.03, 0.05, 0.03]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-10 -right-10 pointer-events-none"
                     >
                        <Moon size={240} className="text-white" />
                     </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}

const MetricBox = ({ icon, label, value, subtext, color }: any) => {
    const colors: any = {
        indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 h-full shadow-sm hover:shadow-xl transition-all duration-300">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}>
                {icon}
            </div>
            <div className="text-3xl font-black text-slate-800 dark:text-white mb-1 tracking-tighter">{value}</div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-tighter">{label}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">{subtext}</div>
        </div>
    );
};
