
import React, { useMemo } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storageService';
import { motion, Variants } from 'framer-motion';
import { User as UserIcon, Settings, Shield, Download, Trash2, Award, Calendar, ChevronRight, Bell, Smartphone } from 'lucide-react';

interface Props {
  user: User;
  onLogout: () => void;
}

// Added Variants type and cast ease to any to resolve easing type mismatch
const scrollFadeVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } 
  }
};

export const Profile: React.FC<Props> = ({ user, onLogout }) => {
  const logs = useMemo(() => StorageService.getLogs(user.id), [user.id]);
  
  const totalLogs = logs.length;
  const streak = 3; // Mocked for demo
  const joinedDate = new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-6 mb-8"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-light shadow-xl">
          {user.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{user.name}</h1>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mt-1">
             <span className="text-sm">{user.email}</span>
             <span className="w-1 h-1 bg-slate-400 rounded-full" />
             <span className="text-sm">Joined {joinedDate}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <StatCard icon={<Calendar size={20} />} value={totalLogs} label="Total Check-ins" color="blue" />
        <StatCard icon={<Award size={20} />} value={`${streak} Days`} label="Current Streak" color="orange" />
        <StatCard icon={<Shield size={20} />} value="Pro" label="Account Status" color="emerald" />
      </motion.section>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scrollFadeVariants}
            className="space-y-6"
        >
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">App Settings</h3>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
                <SettingRow icon={<Bell size={18} />} label="Notifications" toggle />
                <div className="h-px bg-slate-50 dark:bg-slate-700/50" />
                <SettingRow icon={<Smartphone size={18} />} label="Haptic Feedback" toggle defaultChecked />
                <div className="h-px bg-slate-50 dark:bg-slate-700/50" />
                <SettingRow icon={<Settings size={18} />} label="General Preferences" arrow />
            </div>
        </motion.section>

        <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scrollFadeVariants}
            className="space-y-6"
        >
            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider ml-1">Data & Privacy</h3>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
                <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left">
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                        <Download size={18} className="text-slate-400" />
                        <span className="font-medium">Export Health Data</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                </button>
                <div className="h-px bg-slate-50 dark:bg-slate-700/50" />
                <button 
                    onClick={onLogout}
                    className="w-full flex items-center justify-between p-4 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors text-left group"
                >
                    <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
                        <Trash2 size={18} />
                        <span className="font-medium">Sign Out</span>
                    </div>
                </button>
            </div>
        </motion.section>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }}
        className="pt-12 text-center"
      >
        <p className="text-xs text-slate-400">Aura Health Intelligence v1.2.0</p>
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon, value, label, color }: any) => {
    const colors: any = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    };
    return (
        <motion.div 
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-4 shadow-sm"
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</div>
            </div>
        </motion.div>
    );
}

const SettingRow = ({ icon, label, toggle, arrow, defaultChecked }: any) => (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
            <span className="text-slate-400">{icon}</span>
            <span className="font-medium">{label}</span>
        </div>
        {toggle && (
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input type="checkbox" defaultChecked={defaultChecked} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:border-indigo-600 border-slate-300" />
                <label className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 cursor-pointer"></label>
            </div>
        )}
        {arrow && <ChevronRight size={16} className="text-slate-300" />}
    </div>
);
