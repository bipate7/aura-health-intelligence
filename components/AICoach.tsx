
import React, { useEffect, useState } from 'react';
import { User, Insight, AIMemoryNode } from '../types';
import { StorageService } from '../services/storageService';
import { GeminiService } from '../services/geminiService';
import { HeuristicEngine } from '../core/heuristic-engine';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Sparkles, Brain, ShieldCheck, Clock, Info } from 'lucide-react';
import { InsightSkeleton } from './Skeleton';

const scrollFadeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 30, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

export const AICoach: React.FC<{ user: User }> = ({ user }) => {
  const [insight, setInsight] = useState<Insight | null>(null);
  const [memories, setMemories] = useState<AIMemoryNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = async () => {
    setLoading(true);
    const logs = StorageService.getLogs(user.id).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const storedMemories = StorageService.getMemory(user.id);
    setMemories(storedMemories);
    
    // Core calculations for AI context
    const readiness = HeuristicEngine.calculateReadiness(logs);
    const chronotype = await GeminiService.detectChronotype(logs);
    
    if (logs.length >= 7 && storedMemories.length === 0) {
        try {
            const newNode = await GeminiService.synthesizeMemory(logs);
            const saved = StorageService.addMemoryNode({ ...newNode, userId: user.id });
            setMemories([saved]);
        } catch (e) { console.error(e); }
    }

    const newInsightData = await GeminiService.generateDeepInsight(
      logs, 
      storedMemories, 
      chronotype, 
      readiness.score
    );
    const saved = StorageService.saveInsight({ ...newInsightData, userId: user.id });
    setInsight(saved);
    setLoading(false);
  };

  return (
    <div className="space-y-12 pb-24 max-w-3xl mx-auto">
        <header className="text-center space-y-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full font-bold text-xs uppercase tracking-[0.2em] shadow-xl"
            >
                <Brain size={16} /> Neural Reasoning Engine
            </motion.div>
            <p className="text-slate-500 font-medium">Contextual health intelligence based on your verified signal history.</p>
        </header>

        {loading ? <InsightSkeleton /> : (
            <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={scrollFadeVariants}
                className="bg-gradient-to-br from-indigo-900 to-slate-950 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden border border-white/10"
            >
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.15, 0.1]
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                  className="absolute top-0 right-0 p-8"
                >
                  <Sparkles size={160} />
                </motion.div>
                
                <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                            insight?.type === 'warning' ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}>
                            {insight?.type} Analysis
                        </span>
                        <div className="flex items-center gap-1.5 text-indigo-300 text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck size={14} /> Confidence: {insight?.confidenceScore}%
                        </div>
                    </div>

                    <h2 className="text-4xl font-black leading-tight tracking-tighter uppercase">{insight?.title}</h2>
                    <p className="text-indigo-100 text-xl font-medium opacity-90 leading-relaxed italic border-l-2 border-indigo-500 pl-6">"{insight?.description}"</p>
                    
                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row gap-10">
                        <div className="flex-1 space-y-4">
                            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Inference Evidence</div>
                            <ul className="space-y-3">
                                {insight?.reasoning?.map((r, i) => (
                                    <li key={i} className="text-xs text-indigo-100/70 flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                                        {r}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white/5 p-6 rounded-3xl w-full md:w-56 border border-white/5">
                            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Trajectory Path</div>
                            <p className="text-xs text-indigo-100 font-medium leading-relaxed">{insight?.prediction}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-6 opacity-40 group cursor-help transition-opacity hover:opacity-100">
                        <Info size={12} className="text-slate-400" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{insight?.clinicalDisclaimer}</span>
                    </div>
                </div>
            </motion.section>
        )}

        <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-6">Verified Memory Nodes</h3>
            <div className="grid grid-cols-1 gap-4">
                {memories.map((m, idx) => (
                    <motion.div 
                        key={m.id} 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                        className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600"><Clock size={24} /></div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.dateRange.start} - {m.dateRange.end}</span>
                                <h4 className="text-sm font-black uppercase text-slate-800 dark:text-white">Neural Synthesis</h4>
                            </div>
                        </div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic">"{m.summary}"</p>
                        <div className="flex flex-wrap gap-2">
                            {m.keyPatterns.map((p, i) => (
                                <span key={i} className="text-[10px] bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-full text-slate-500 font-bold border dark:border-slate-700">#{p.replace(/\s+/g, '')}</span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </div>
  );
};
