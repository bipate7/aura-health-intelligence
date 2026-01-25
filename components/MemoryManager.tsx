
import React, { useState } from 'react';
import { User, AIMemoryNode } from '../types';
import { StorageService } from '../services/storageService';
import { Shield, Database, Trash2, Download, Info, Cpu, ShieldCheck, ChevronRight, Activity } from 'lucide-react';
import { motion, Variants, AnimatePresence } from 'framer-motion';

const scrollFadeVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } 
  }
};

export const MemoryManager: React.FC<{ user: User }> = ({ user }) => {
    const memories = StorageService.getMemory(user.id);
    const logs = StorageService.getLogs(user.id);
    const [selectedMemory, setSelectedMemory] = useState<AIMemoryNode | null>(null);

    const handleClear = () => {
        if (confirm("Permanently wipe all health intelligence? This is irreversible.")) {
            StorageService.clearAllData(user.id);
            window.location.reload();
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-12 pb-20">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10"
            >
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-indigo-600 text-white rounded-3xl shadow-xl"><Shield size={32} /></div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase">Health Sovereignty</h1>
                        <p className="text-slate-500">Inspect and audit your neural ledger.</p>
                    </div>
                </div>
            </motion.div>

            {/* AI Data Lineage Inspector */}
            <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={scrollFadeVariants}
                className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 space-y-6"
            >
                <div className="flex items-center gap-3">
                    <Database size={20} className="text-indigo-500" />
                    <h3 className="font-bold uppercase tracking-widest text-sm">Neural Ledger (Lineage)</h3>
                </div>

                <div className="space-y-3">
                    {memories.map((m) => (
                        <div key={m.id} className="border dark:border-slate-700 rounded-2xl overflow-hidden">
                            <button 
                                onClick={() => setSelectedMemory(selectedMemory?.id === m.id ? null : m)}
                                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                <div className="text-left">
                                    <div className="font-bold text-sm">Synthesis: {m.dateRange.start}</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{m.lineageIds?.length || 0} Signal Sources</div>
                                </div>
                                <ChevronRight className={`transition-transform duration-300 ${selectedMemory?.id === m.id ? 'rotate-90' : ''}`} size={16} />
                            </button>
                            <AnimatePresence>
                                {selectedMemory?.id === m.id && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="px-4 pb-4 overflow-hidden">
                                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl space-y-2">
                                            <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">Derived From:</span>
                                            <div className="flex flex-wrap gap-2">
                                                {m.lineageIds?.map((lid) => (
                                                    <div key={lid} className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded text-[10px] font-bold">
                                                        <Activity size={10} /> Log_{lid.slice(0, 4)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </motion.section>

            <motion.section 
                variants={scrollFadeVariants}
                className="bg-slate-900 text-white p-8 rounded-[2rem] space-y-6 border border-white/5"
            >
                <div className="flex items-start gap-4">
                    <ShieldCheck className="text-emerald-400 shrink-0" size={24} />
                    <div className="space-y-2">
                        <h3 className="font-bold uppercase tracking-widest text-sm">Ethics & Verification</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Aura utilizes Gemini 3 Pro and Flash models for synthesis. Reasoning is stateless; raw biometric data is purged from memory after each inference to maintain user sovereignty.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 bg-white/5 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-colors">
                        <Download size={18} className="text-slate-400" />
                        <span className="text-xs font-bold uppercase">Export Ledger</span>
                    </button>
                    <button 
                        onClick={handleClear}
                        className="p-4 bg-rose-500/10 rounded-2xl flex items-center gap-3 hover:bg-rose-500/20 transition-colors"
                    >
                        <Trash2 size={18} className="text-rose-400" />
                        <span className="text-xs font-bold uppercase text-rose-400">Wipe All</span>
                    </button>
                </div>
            </motion.section>

            <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-3xl border border-amber-100 dark:border-amber-800/50 flex gap-4">
                <Info className="text-amber-500 shrink-0" size={20} />
                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                    <strong>Medical Warning:</strong> Aura is a wellbeing support system. It is not designed to diagnose or treat health conditions. Always consult a licensed physician for medical concerns.
                </p>
            </div>
        </div>
    );
};

const DataPill = ({ label, count }: any) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
        <div className="text-2xl font-black text-slate-800 dark:text-white">{count}</div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</div>
    </div>
);
