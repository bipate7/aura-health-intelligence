
import React from 'react';
import { motion } from 'framer-motion';

// --- Base Primitives ---

/**
 * A standard block with a shimmering gradient. 
 * Used for cards, boxes, and general containers.
 */
const ShimmerBlock = ({ className, style, delay = 0 }: { className?: string, style?: React.CSSProperties, delay?: number }) => (
  <div className={`relative overflow-hidden bg-slate-200 dark:bg-slate-800 ${className}`} style={style}>
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: '100%' }}
      transition={{ 
        repeat: Infinity, 
        duration: 1.5, 
        ease: "linear",
        delay: delay 
      }}
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-slate-700/30 to-transparent z-10"
    />
  </div>
);

/**
 * A pulsing block for "hero" data that feels more alive than a static shimmer.
 * Good for large numbers or status indicators.
 */
const PulseBlock = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
    <motion.div 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className={`bg-slate-200 dark:bg-slate-800 ${className}`}
        style={style}
    />
);

// --- Component Specific Skeletons ---

/**
 * Matches the layout of the large "Daily Readiness" card in Dashboard.tsx
 */
export const ReadinessSkeleton = () => (
    <div className="w-full lg:w-1/3 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 h-[300px] flex flex-col justify-between relative overflow-hidden">
        <div className="flex justify-between items-center">
            <ShimmerBlock className="w-32 h-3 rounded-full" />
            <PulseBlock className="w-16 h-3 rounded-full" />
        </div>
        
        <div className="space-y-2">
            <div className="flex items-baseline gap-2">
                {/* Hero Number Pulse */}
                <PulseBlock className="w-40 h-24 rounded-3xl" />
                <ShimmerBlock className="w-8 h-8 rounded-lg" />
            </div>
        </div>

        <div className="space-y-2 pl-4 border-l-2 border-slate-100 dark:border-slate-700">
            <ShimmerBlock className="w-full h-3 rounded-full" />
            <ShimmerBlock className="w-2/3 h-3 rounded-full" />
        </div>
    </div>
);

/**
 * Matches the Quick Cards in Dashboard.tsx
 */
export const QuickCardSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 flex flex-col items-center gap-6 h-48 justify-center">
        <ShimmerBlock className="w-16 h-16 rounded-2xl" />
        <div className="space-y-2 flex flex-col items-center w-full">
            <ShimmerBlock className="w-24 h-3 rounded-full" />
            <ShimmerBlock className="w-4 h-4 rounded-full" />
        </div>
    </div>
);

/**
 * Matches the MetricBox in SleepAnalysis.tsx
 */
export const MetricSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 h-full flex flex-col justify-between min-h-[140px]">
    <ShimmerBlock className="w-10 h-10 rounded-xl mb-3" />
    <div className="space-y-2">
        <PulseBlock className="w-20 h-8 rounded-lg" />
        <ShimmerBlock className="w-24 h-3 rounded-full" />
        <ShimmerBlock className="w-16 h-2 rounded-full opacity-60" />
    </div>
  </div>
);

/**
 * Matches the Bar Charts.
 * Uses staggered animation to mimic bars loading.
 */
export const ChartSkeleton = ({ height = "h-80" }: { height?: string }) => (
  <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 w-full">
    <div className="flex justify-between items-center mb-8">
      <div className="space-y-2">
        <ShimmerBlock className="w-48 h-5 rounded-lg" />
      </div>
    </div>
    <div className={`${height} flex items-end gap-3 px-2`}>
      {[...Array(14)].map((_, i) => (
        <motion.div
            key={i}
            initial={{ height: '10%' }}
            animate={{ height: ['10%', `${Math.random() * 60 + 20}%`, '10%'] }}
            transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.1 // Stagger effect
            }}
            className="flex-1 bg-slate-100 dark:bg-slate-700/50 rounded-t-md"
        />
      ))}
    </div>
  </div>
);

/**
 * Matches the Area Chart in Dashboard.tsx
 * Uses an SVG path animation for a smoother "organic" feel.
 */
export const RecoveryRingSkeleton = () => (
  <div className="relative w-full h-64 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-6 flex items-center justify-center overflow-hidden">
     <div className="absolute inset-0 flex items-end">
        <svg className="w-full h-full opacity-20" viewBox="0 0 400 200" preserveAspectRatio="none">
            <motion.path
                d="M0,150 C50,150 50,50 100,50 C150,50 150,150 200,150 C250,150 250,50 300,50 C350,50 350,150 400,150 L400,200 L0,200 Z"
                fill="currentColor"
                className="text-indigo-500"
                initial={{ d: "M0,200 C50,200 50,200 100,200 C150,200 150,200 200,200 C250,200 250,200 300,200 C350,200 350,200 400,200 L400,200 L0,200 Z" }}
                animate={{ 
                    d: "M0,150 C50,150 50,50 100,50 C150,50 150,150 200,150 C250,150 250,50 300,50 C350,50 350,150 400,150 L400,200 L0,200 Z" 
                }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
        </svg>
     </div>
     <div className="relative z-10 flex flex-col items-center space-y-2">
        <PulseBlock className="w-32 h-4 rounded-full" />
        <ShimmerBlock className="w-20 h-3 rounded-full opacity-50" />
     </div>
  </div>
);

/**
 * Matches the AI Coach Insight Card.
 * Uses a deep gradient background skeleton to match the dark aesthetic of the real component.
 */
export const InsightSkeleton = () => (
  <div className="bg-slate-900 rounded-[3rem] p-12 relative overflow-hidden h-[450px] border border-slate-800">
    {/* Background Animation */}
    <motion.div 
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"
    />
    
    <div className="relative z-10 space-y-8">
        {/* Badge */}
        <div className="flex items-center gap-3">
            <ShimmerBlock className="w-28 h-6 rounded-full bg-slate-800" />
            <ShimmerBlock className="w-32 h-4 rounded-full bg-slate-800/50" />
        </div>

        {/* Title & Description */}
        <div className="space-y-4">
            <ShimmerBlock className="w-3/4 h-10 rounded-2xl bg-slate-800" />
            <ShimmerBlock className="w-full h-6 rounded-xl bg-slate-800/50" />
            <ShimmerBlock className="w-5/6 h-6 rounded-xl bg-slate-800/50" />
        </div>
        
        {/* Footer Columns */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row gap-10">
            <div className="flex-1 space-y-3">
                <ShimmerBlock className="w-24 h-3 rounded-full bg-slate-800" />
                <ShimmerBlock className="w-full h-3 rounded-full bg-slate-800/50" />
                <ShimmerBlock className="w-full h-3 rounded-full bg-slate-800/50" />
            </div>
            <div className="w-full md:w-56 h-24 bg-slate-800/50 rounded-3xl overflow-hidden relative">
                 <ShimmerBlock className="absolute inset-0 bg-transparent" />
            </div>
        </div>
    </div>
  </div>
);

/**
 * Matches the History List Items.
 */
export const HistoryItemSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-6 md:items-center">
    <div className="flex flex-row md:flex-col gap-2 w-24 border-r border-slate-100 dark:border-slate-700 pr-4">
      <PulseBlock className="w-10 h-8 rounded-lg" />
      <ShimmerBlock className="w-12 h-3 rounded-full opacity-50" />
    </div>
    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
       {[...Array(4)].map((_, i) => (
         <div key={i} className="flex items-center gap-2">
           <ShimmerBlock className="w-8 h-8 rounded-lg" delay={i * 0.1} />
           <div className="space-y-1">
              <ShimmerBlock className="w-10 h-2 rounded-full opacity-40" />
              <ShimmerBlock className="w-14 h-4 rounded-md" />
           </div>
         </div>
       ))}
    </div>
  </div>
);

/**
 * Simple lines for search results or small lists.
 */
export const SearchResultSkeleton = () => (
  <div className="space-y-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl flex justify-between items-center">
        <div className="space-y-2 w-3/4">
            <ShimmerBlock className="w-1/2 h-4 rounded-md" delay={i * 0.1} />
            <ShimmerBlock className="w-1/3 h-3 rounded-md opacity-50" delay={i * 0.15} />
        </div>
        <ShimmerBlock className="w-8 h-8 rounded-full" />
      </div>
    ))}
  </div>
);

// Backward compatibility export if needed, though specific skeletons are preferred
export const SkeletonPulse = ShimmerBlock;
