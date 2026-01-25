
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium Shimmer Pulse
 * Uses a moving gradient to simulate data activity.
 */
export const SkeletonPulse: React.FC<{ 
  className: string; 
  style?: React.CSSProperties; 
  animationDuration?: number;
  gradientColor?: string;
}> = ({ className, style, animationDuration = 1.8, gradientColor }) => (
  <div 
    className={`relative overflow-hidden bg-slate-200 dark:bg-slate-800 rounded-lg ${className}`}
    style={style}
  >
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: '100%' }}
      transition={{ 
        repeat: Infinity, 
        duration: animationDuration, 
        ease: "linear",
        repeatDelay: 0.2
      }}
      className={`absolute inset-0 bg-gradient-to-r from-transparent ${gradientColor || 'via-white/30 dark:via-slate-700/40'} to-transparent z-10`}
    />
    <motion.div 
      animate={{ opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-0 bg-current opacity-10"
    />
  </div>
);

export const MetricSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between h-28 shadow-sm">
    <div className="space-y-3">
      <SkeletonPulse className="w-10 h-10 rounded-xl" animationDuration={1.2} />
      <SkeletonPulse className="w-16 h-2 opacity-60" animationDuration={1.5} />
    </div>
    <div className="space-y-2 text-right">
      <SkeletonPulse className="w-20 h-6 ml-auto" animationDuration={1.4} />
      <SkeletonPulse className="w-12 h-3 ml-auto opacity-40" animationDuration={2.0} />
    </div>
  </div>
);

export const ChartSkeleton = ({ height = "h-48" }: { height?: string }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm w-full">
    <div className="flex justify-between items-center mb-8">
      <div className="space-y-2">
        <SkeletonPulse className="w-48 h-5" />
        <SkeletonPulse className="w-32 h-3 opacity-50" />
      </div>
      <SkeletonPulse className="w-24 h-4" />
    </div>
    <div className={`${height} flex items-end gap-3 px-2`}>
      {[...Array(12)].map((_, i) => (
        <SkeletonPulse 
          key={i} 
          className="flex-1 rounded-t-lg" 
          animationDuration={2.5}
          style={{ 
            height: `${20 + (Math.sin(i * 0.8) * 30 + 40)}%`,
            opacity: 0.3 + (i * 0.05)
          }} 
        />
      ))}
    </div>
    <div className="mt-6 flex justify-between px-2">
       {[...Array(6)].map((_, i) => (
         <SkeletonPulse key={i} className="w-10 h-2 opacity-30" />
       ))}
    </div>
  </div>
);

export const LineChartSkeleton = ({ height = "h-64" }: { height?: string }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm w-full">
    <div className="flex justify-between items-center mb-6">
        <SkeletonPulse className="w-40 h-6" />
        <SkeletonPulse className="w-24 h-4 opacity-50" />
    </div>
    <div className={`${height} relative flex items-center justify-center`}>
        <svg className="w-full h-full opacity-20" viewBox="0 0 400 200">
            <motion.path
                d="M0,150 Q50,50 100,100 T200,80 T300,120 T400,50"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-indigo-400 dark:text-indigo-600"
            />
        </svg>
        <div className="absolute inset-0 flex flex-col justify-between py-2">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full h-px bg-slate-100 dark:bg-slate-700" />
            ))}
        </div>
    </div>
    <div className="mt-4 flex justify-between">
        {[...Array(7)].map((_, i) => (
            <SkeletonPulse key={i} className="w-8 h-2 opacity-30" />
        ))}
    </div>
  </div>
);

export const SearchResultSkeleton = () => (
  <div className="space-y-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="w-full p-4 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl flex justify-between items-center">
        <div className="space-y-2 w-3/4">
            <SkeletonPulse className="w-full h-5" animationDuration={2.2} />
            <SkeletonPulse className="w-1/2 h-3 opacity-40" animationDuration={2.5} />
        </div>
        <SkeletonPulse className="w-8 h-8 rounded-full" />
      </div>
    ))}
  </div>
);

export const RecoveryRingSkeleton = () => (
  <div className="relative w-[280px] h-[280px] flex items-center justify-center">
    <svg width="280" height="280" viewBox="0 0 280 280" className="transform -rotate-90">
      <circle cx="140" cy="140" r="110" stroke="currentColor" strokeWidth="22" fill="transparent" className="text-slate-100 dark:text-slate-800" />
      <motion.circle 
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          strokeDashoffset: [690, 200, 690]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        cx="140" cy="140" r="110" stroke="currentColor" strokeWidth="22" fill="transparent" strokeDasharray="690" strokeDashoffset="200" className="text-indigo-400 dark:text-indigo-600" 
      />
    </svg>
    <div className="absolute flex flex-col items-center gap-3">
      <SkeletonPulse className="w-20 h-3 opacity-60" />
      <SkeletonPulse className="w-32 h-12" />
      <SkeletonPulse className="w-24 h-6 rounded-full" />
    </div>
  </div>
);

export const InsightSkeleton = () => (
  <div className="bg-slate-900 rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden h-[400px]">
    {/* Animated background highlights for AI feel */}
    <div className="absolute top-0 right-0 p-8 opacity-10">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <SparkleSkeleton size={160} />
      </motion.div>
    </div>
    
    <div className="flex items-center gap-3">
        <SkeletonPulse className="w-24 h-6 rounded-xl bg-indigo-500/20" gradientColor="via-indigo-500/30" />
        <SkeletonPulse className="w-32 h-4 bg-indigo-500/10" animationDuration={3.0} />
    </div>
    <div className="space-y-4">
        <SkeletonPulse className="w-full h-10 bg-indigo-500/20" gradientColor="via-indigo-500/40" animationDuration={1.2} />
        <SkeletonPulse className="w-3/4 h-6 bg-indigo-500/10" animationDuration={2.0} />
    </div>
    <div className="pt-8 border-t border-white/10 flex gap-8">
        <div className="flex-1 space-y-3">
            <SkeletonPulse className="w-24 h-3 bg-indigo-500/20" />
            <SkeletonPulse className="w-full h-4 bg-indigo-500/10" />
            <SkeletonPulse className="w-5/6 h-4 bg-indigo-500/10" />
        </div>
        <div className="w-48 space-y-3">
            <SkeletonPulse className="w-20 h-3 bg-indigo-500/20" />
            <div className="h-12 w-full bg-indigo-500/10 rounded-2xl overflow-hidden relative">
               <SkeletonPulse className="w-full h-full bg-transparent" gradientColor="via-white/5" />
            </div>
        </div>
    </div>
  </div>
);

const SparkleSkeleton = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="text-indigo-500/20">
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
  </svg>
);

export const HistoryItemSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-6 md:items-center h-28">
    <div className="flex flex-row md:flex-col gap-2 w-24 border-r border-slate-100 dark:border-slate-700 pr-4">
      <SkeletonPulse className="w-10 h-8" animationDuration={2.0} />
      <SkeletonPulse className="w-12 h-3 opacity-50" animationDuration={2.5} />
    </div>
    <div className="flex-1 grid grid-cols-3 gap-4">
       {[...Array(3)].map((_, i) => (
         <div key={i} className="flex items-center gap-2">
           <SkeletonPulse className="w-8 h-8 rounded-lg" animationDuration={1.5 + (i * 0.2)} />
           <div className="space-y-1">
              <SkeletonPulse className="w-10 h-2 opacity-40" />
              <SkeletonPulse className="w-14 h-4" />
           </div>
         </div>
       ))}
    </div>
  </div>
);
