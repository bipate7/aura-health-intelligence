
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Cpu, Zap } from 'lucide-react';

export const NeuralStatus: React.FC<{ 
  latency: number; 
  confidence: number; 
  safetyActive: boolean; 
}> = ({ latency, confidence, safetyActive }) => {
  return (
    <div className="flex flex-wrap gap-4 py-4 px-6 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
      <StatusItem 
        icon={<Cpu size={14} className="text-indigo-500" />} 
        label="Neural Core" 
        value="Active" 
      />
      <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
      <StatusItem 
        icon={<ShieldCheck size={14} className={safetyActive ? "text-emerald-500" : "text-amber-500"} />} 
        label="Safety Guard" 
        value={safetyActive ? "Secured" : "Monitor"} 
      />
      <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
      <StatusItem 
        icon={<Zap size={14} className="text-amber-500" />} 
        label="Latency" 
        value={`${latency}ms`} 
      />
      <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
      <StatusItem 
        icon={<Activity size={14} className="text-blue-500" />} 
        label="Confidence" 
        value={`${confidence}%`} 
      />
    </div>
  );
};

const StatusItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-center gap-2">
    {icon}
    <div className="flex flex-col">
      <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">{label}</span>
      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 tracking-tight">{value}</span>
    </div>
  </div>
);
