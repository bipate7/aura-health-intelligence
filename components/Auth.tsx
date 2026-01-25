
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StorageService } from '../services/storageService';
import { User } from '../types';
import { ArrowRight, Lock, Mail, User as UserIcon, Activity, Sparkles, Zap } from 'lucide-react';

interface AuthProps {
    onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Simulated
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulate network delay
        await new Promise(r => setTimeout(r, 1000));

        try {
            if (isLogin) {
                const user = StorageService.loginUser(email);
                if (user) {
                    onLogin(user);
                } else {
                    setError("User not found. Please sign up.");
                }
            } else {
                if (!name) { setError("Name is required"); setLoading(false); return; }
                const user = StorageService.createUser(name, email);
                onLogin(user);
            }
        } catch (err: any) {
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 800));
        const demoEmail = 'demo@aura.ai';
        let user = StorageService.loginUser(demoEmail);
        if (!user) {
            user = StorageService.createUser('Aura Explorer', demoEmail);
        }
        onLogin(user);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col md:flex-row">
            {/* Left Side - Brand / Visuals */}
            <div className="w-full md:w-1/2 bg-slate-900 dark:bg-black text-white p-12 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 font-bold text-xl">A</div>
                        <span className="text-2xl font-bold tracking-tight">Aura Health</span>
                    </div>
                    
                    <div className="space-y-6 max-w-md">
                        <h1 className="text-4xl md:text-5xl font-light leading-tight">
                            Intelligence for your <span className="font-semibold text-indigo-400 font-sans tracking-tight">wellbeing</span>.
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Track sleep, energy, and nutrition to uncover hidden patterns in your health. Privacy-first, medical-grade insights.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex gap-8 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-2"><Activity size={16} /> Pattern Detection</span>
                    <span className="flex items-center gap-2"><Sparkles size={16} /> AI Insights</span>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 dark:bg-slate-900">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter tracking-tighter">
                            {isLogin ? 'Neural Access' : 'Initialize Core'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                            {isLogin ? 'Synchronize your biometric signature.' : 'Begin your clinical-grade health journey.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {!isLogin && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }} 
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="relative">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input 
                                            type="text" 
                                            placeholder="Full Name"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-bold"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type="email" 
                                placeholder="Email Address"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-bold"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type="password" 
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white font-bold"
                                required
                            />
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 text-sm font-black uppercase tracking-tight">
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-4 pt-2">
                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="animate-pulse">SYNCHRONIZING...</span>
                                ) : (
                                    <>
                                        {isLogin ? 'SIGN IN' : 'INITIALIZE'} <ArrowRight size={20} />
                                    </>
                                )}
                            </button>

                            <button 
                                type="button"
                                onClick={handleDemoLogin}
                                disabled={loading}
                                className="w-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 py-5 rounded-2xl font-black text-lg border-2 border-indigo-100 dark:border-indigo-800/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                            >
                                <Zap size={20} className="fill-current" />
                                TRY DEMO DASHBOARD
                            </button>
                        </div>
                    </form>

                    <div className="text-center">
                        <button 
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 font-black text-xs uppercase tracking-widest transition-colors"
                        >
                            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
