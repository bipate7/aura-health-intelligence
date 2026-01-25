
import React, { useState, useRef, useEffect } from 'react';
import { LogType, NutritionLog, User, MealSimulation, Micronutrients } from '../types';
import { StorageService } from '../services/storageService';
import { GeminiService } from '../services/geminiService';
import { ChevronLeft, Save, Smile, Moon, Zap, AlertCircle, Move, Utensils, Search, Plus, Trash2, Camera, Sparkles, X, CheckCircle2, Info, Loader2, ScanLine, Scan } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchResultSkeleton } from './Skeleton';

interface Props {
  user: User;
  onComplete: () => void;
  onCancel: () => void;
}

export const DailyCheckIn: React.FC<Props> = ({ user, onComplete, onCancel }) => {
  const [step, setStep] = useState<LogType>('sleep');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NutritionLog[]>([]);
  const [scanResult, setScanResult] = useState<NutritionLog | null>(null);
  const [addedFoodItems, setAddedFoodItems] = useState<NutritionLog[]>([]);
  const [mealSimulation, setMealSimulation] = useState<MealSimulation | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isProcessingNutrition, setIsProcessingNutrition] = useState(false);
  const [showMicrosEditor, setShowMicrosEditor] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [data, setData] = useState({
    sleep: 7, 
    sleepDeep: 90, 
    sleepLight: 300, 
    sleepREM: 90, 
    sleepAwake: 15,
    energy: 7, mood: 7, stress: 3,
    activityType: 'Walking', activityDuration: 30, activityIntensity: 5,
    nutrition: null as NutritionLog | null,
    notes: ''
  });

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsScanning(true);
      setScanResult(null);
      setShowSearch(false);
    } catch (err) {
      console.error("Failed to access camera:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsProcessingNutrition(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
      
      try {
        const result = await GeminiService.analyzeFoodImage(base64Image);
        if (result && result.description && result.description !== "Scan Failed") {
          setScanResult(result);
          stopCamera();
        } else {
          alert("Aura Vision could not identify the product. Try manual search.");
        }
      } catch (error) {
        console.error("Scan error:", error);
      } finally {
        setIsProcessingNutrition(false);
      }
    }
  };

  const handleSliderChange = (key: string, val: number) => setData(prev => ({ ...prev, [key]: val }));
  const handleInputChange = (key: string, val: string) => {
      const num = parseInt(val) || 0;
      setData(prev => ({ ...prev, [key]: num }));
  };

  const runSimulation = async (meal: string) => {
      setIsSimulating(true);
      const logs = StorageService.getLogs(user.id);
      const sim = await GeminiService.simulateMealImpact(meal, logs);
      setMealSimulation(sim);
      setIsSimulating(false);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsProcessingNutrition(true);
    setSearchResults([]);
    setScanResult(null);
    
    try {
        const results = await GeminiService.searchFoodItems(searchQuery);
        setSearchResults(results);
    } catch (error) {
        console.error("Search failed", error);
    } finally {
        setIsProcessingNutrition(false);
    }
  };

  const addFoodItem = (item: NutritionLog) => {
    setAddedFoodItems(prev => [...prev, item]);
    setSearchQuery('');
    setSearchResults([]);
    setScanResult(null);
    setShowSearch(false);
    runSimulation(item.description || '');
  };

  const removeFoodItem = (index: number) => {
    setAddedFoodItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateMicronutrients = (key: keyof Micronutrients, val: string) => {
      const num = parseFloat(val) || 0;
      setAddedFoodItems(prev => {
          if (prev.length === 0) return prev;
          const last = { ...prev[prev.length - 1] };
          last.micronutrients = { 
              vitaminC: 0, vitaminD: 0, iron: 0, magnesium: 0, zinc: 0,
              ...last.micronutrients,
              [key]: num 
          };
          const updated = [...prev];
          updated[prev.length - 1] = last;
          return updated;
      });
  };

  const submit = () => {
    StorageService.addLog({
        userId: user.id,
        date: new Date().toISOString(),
        sleepQuality: data.sleep,
        sleepPhases: { 
            deep: data.sleepDeep, 
            light: data.sleepLight, 
            rem: data.sleepREM, 
            awake: data.sleepAwake 
        },
        energy: data.energy, 
        stress: data.stress, 
        mood: data.mood,
        activity: { type: data.activityType, duration: data.activityDuration, intensity: data.activityIntensity },
        nutrition: data.nutrition || { calories: 0, protein: 0, carbs: 0, fats: 0, description: 'Skipped' },
        symptoms: [], 
        notes: data.notes
    });
    onComplete();
  };

  const nextStep = () => {
    const steps: LogType[] = ['sleep', 'energy', 'stress', 'mood', 'activity', 'nutrition', 'review'];
    const currIdx = steps.indexOf(step);
    
    if (step === 'nutrition') {
        if (addedFoodItems.length > 0) {
            const combinedDescription = addedFoodItems.map(i => i.description).join(', ');
            const totalCalories = addedFoodItems.reduce((acc, i) => acc + (i.calories || 0), 0);
            const totalProtein = addedFoodItems.reduce((acc, i) => acc + (i.protein || 0), 0);
            const totalCarbs = addedFoodItems.reduce((acc, i) => acc + (i.carbs || 0), 0);
            const totalFats = addedFoodItems.reduce((acc, i) => acc + (i.fats || 0), 0);
            
            const consolidatedMicros: Micronutrients = addedFoodItems.reduce((acc, item) => ({
                vitaminC: acc.vitaminC + (item.micronutrients?.vitaminC || 0),
                vitaminD: acc.vitaminD + (item.micronutrients?.vitaminD || 0),
                iron: acc.iron + (item.micronutrients?.iron || 0),
                magnesium: acc.magnesium + (item.micronutrients?.magnesium || 0),
                zinc: acc.zinc + (item.micronutrients?.zinc || 0),
            }), { vitaminC: 0, vitaminD: 0, iron: 0, magnesium: 0, zinc: 0 });

            setData(p => ({ 
                ...p, 
                nutrition: { 
                    description: combinedDescription,
                    calories: totalCalories,
                    protein: totalProtein,
                    carbs: totalCarbs,
                    fats: totalFats,
                    micronutrients: consolidatedMicros
                } 
            }));
        }
    }

    if (currIdx < steps.length - 1) {
        setStep(steps[currIdx + 1]);
    } else {
        submit();
    }
  };

  const prevStep = () => {
    const steps: LogType[] = ['sleep', 'energy', 'stress', 'mood', 'activity', 'nutrition', 'review'];
    const currIdx = steps.indexOf(step);
    if (currIdx > 0) setStep(steps[currIdx - 1]);
    else onCancel();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col">
        <div className="px-6 py-4 border-b dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
            <button onClick={prevStep} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1 font-medium">
                <ChevronLeft size={20} /> Back
            </button>
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Aura Biometrics</span>
            <div className="w-8" />
        </div>

        <div className="flex-1 max-w-lg mx-auto w-full px-6 py-8 overflow-y-auto">
            <AnimatePresence mode="wait">
                {step === 'sleep' && (
                    <motion.div key="sleep" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                        <div className="text-center">
                            <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl inline-block mb-4 shadow-sm border border-indigo-100 dark:border-indigo-800"><Moon size={32} className="text-indigo-600" /></div>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white uppercase tracking-tighter">Rest Architecture</h2>
                            <p className="text-slate-500 mt-1 font-medium">Detailed breakdown of last night's rhythm.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <div className="text-6xl font-black text-indigo-600 tracking-tighter">{data.sleep}</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quality Gradient</div>
                                <input type="range" min="0" max="10" value={data.sleep} onChange={e => handleSliderChange('sleep', parseInt(e.target.value))} className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <SleepPhaseInput label="Deep (min)" value={data.sleepDeep} onChange={v => handleInputChange('sleepDeep', v)} color="emerald" />
                                <SleepPhaseInput label="REM (min)" value={data.sleepREM} onChange={v => handleInputChange('sleepREM', v)} color="purple" />
                                <SleepPhaseInput label="Light (min)" value={data.sleepLight} onChange={v => handleInputChange('sleepLight', v)} color="blue" />
                                <SleepPhaseInput label="Awake (min)" value={data.sleepAwake} onChange={v => handleInputChange('sleepAwake', v)} color="rose" />
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 'nutrition' && (
                    <motion.div key="nutrition" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 pb-10">
                        <div className="text-center">
                            <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-3xl inline-block mb-4 border border-blue-100 dark:border-blue-800"><Utensils size={32} className="text-blue-600" /></div>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white uppercase tracking-tighter">Biochemical Fuel</h2>
                            <p className="text-slate-500 mt-1 font-medium">Macro and micronutrient monitoring.</p>
                        </div>
                        
                        {!isScanning ? (
                          <div className="space-y-6">
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={startCamera}
                                className="w-full p-8 bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-3 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                                    <Scan size={80} />
                                </div>
                                <div className="p-4 bg-white/20 rounded-2xl">
                                    <Camera size={32} className="text-white" />
                                </div>
                                <div className="text-center">
                                    <span className="text-lg font-black uppercase tracking-tight block">Scan Product Barcode</span>
                                    <span className="text-xs font-medium opacity-70">Aura Vision AI Parsing Active</span>
                                </div>
                            </motion.button>

                            <div className="flex items-center gap-4 px-4">
                                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OR SEARCH MANUALLY</span>
                                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                            </div>

                            <div className="space-y-4">
                                {showSearch ? (
                                    <div className="relative group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                        <form onSubmit={handleSearch}>
                                            <input 
                                                autoFocus
                                                type="text" placeholder="Search product name..." 
                                                className="w-full py-5 pl-12 pr-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-600 outline-none rounded-2xl transition-all shadow-sm font-bold text-slate-800 dark:text-white"
                                                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                            />
                                        </form>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setShowSearch(true)}
                                        className="w-full py-5 px-6 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl font-bold flex items-center gap-3 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
                                    >
                                        <Search size={20} />
                                        <span>Type product manually...</span>
                                    </button>
                                )}
                            </div>
                          </div>
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }}
                            className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden border-4 border-indigo-500 shadow-2xl bg-black"
                          >
                            <video 
                              ref={videoRef} 
                              autoPlay 
                              playsInline 
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Medical Grade Scanning Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-64 h-64 border-2 border-indigo-400/50 rounded-3xl relative">
                                    <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl" />
                                    <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl" />
                                    <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl" />
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-xl" />
                                </div>
                            </div>

                            <motion.div 
                              animate={{ top: ['20%', '80%', '20%'] }}
                              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                              className="absolute left-8 right-8 h-0.5 bg-indigo-400 shadow-[0_0_20px_rgba(129,140,248,1)] z-10"
                            />

                            <div className="absolute top-6 right-6 flex gap-2">
                              <button onClick={stopCamera} className="p-3 bg-black/50 text-white rounded-full backdrop-blur-md hover:bg-black/70 transition-colors">
                                <X size={24} />
                              </button>
                            </div>
                            
                            <div className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-4">
                              <p className="text-[10px] font-black uppercase text-white tracking-[0.3em] bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">Align Barcode within Reticle</p>
                              <button 
                                onClick={captureAndScan}
                                disabled={isProcessingNutrition}
                                className="px-12 py-5 bg-indigo-600 text-white rounded-full font-black shadow-2xl flex items-center gap-3 active:scale-95 transition-all group border-t border-white/20"
                              >
                                {isProcessingNutrition ? <Loader2 className="animate-spin" size={20} /> : <Scan size={20} className="group-hover:scale-110 transition-transform" />}
                                {isProcessingNutrition ? 'Analyzing Signal...' : 'Initiate Aura Vision'}
                              </button>
                            </div>
                            <canvas ref={canvasRef} className="hidden" />
                          </motion.div>
                        )}

                        <div className="min-h-[20px] space-y-4">
                            {isProcessingNutrition && !isScanning ? (
                                <SearchResultSkeleton />
                            ) : null}

                            <AnimatePresence>
                                {scanResult && !isProcessingNutrition && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="p-1 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[2.5rem] shadow-2xl"
                                    >
                                        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.3rem] space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Sparkles className="text-indigo-500" size={16} />
                                                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Aura Vision Identity</span>
                                                    </div>
                                                    <h4 className="text-2xl font-black text-slate-800 dark:text-white leading-tight tracking-tighter">{scanResult.description}</h4>
                                                </div>
                                                <button onClick={() => setScanResult(null)} className="p-2 text-slate-300 hover:text-slate-500"><X size={20} /></button>
                                            </div>

                                            <div className="grid grid-cols-4 gap-3">
                                                <StatMini label="Calories" val={scanResult.calories} />
                                                <StatMini label="Protein" val={scanResult.protein} unit="g" />
                                                <StatMini label="Carbs" val={scanResult.carbs} unit="g" />
                                                <StatMini label="Fats" val={scanResult.fats} unit="g" />
                                            </div>

                                            <button 
                                                onClick={() => addFoodItem(scanResult)}
                                                className="w-full py-5 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:shadow-indigo-500/30 transition-all"
                                            >
                                                Confirm Consumption <CheckCircle2 size={20} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {searchResults.length > 0 && !scanResult && (
                                <div className="space-y-3">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Verified Matches</div>
                                    {searchResults.slice(0, 5).map((item, i) => (
                                        <motion.button 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            key={i} 
                                            onClick={() => addFoodItem(item)} 
                                            className="w-full p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl text-left flex justify-between items-center hover:border-blue-500 group transition-all shadow-sm"
                                        >
                                            <div className="space-y-1">
                                                <span className="font-bold text-slate-800 dark:text-slate-200">{item.description}</span>
                                                <div className="text-[10px] uppercase font-black text-slate-400 flex gap-3">
                                                    <span>{item.calories} kcal</span>
                                                    <span>P: {item.protein}g</span>
                                                    <span>C: {item.carbs}g</span>
                                                </div>
                                            </div>
                                            <div className="p-2.5 bg-slate-50 dark:bg-slate-700 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                <Plus size={20} />
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {addedFoodItems.length > 0 && (
                            <div className="space-y-4 pt-6 border-t dark:border-slate-800">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Neural Inventory</h3>
                                    <button 
                                        onClick={() => setShowMicrosEditor(!showMicrosEditor)}
                                        className="text-[10px] font-black text-indigo-500 flex items-center gap-1 hover:underline uppercase tracking-widest"
                                    >
                                        <Sparkles size={12} /> {showMicrosEditor ? 'Hide Micros' : 'Expand Micronutrients'}
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {addedFoodItems.map((item, i) => (
                                        <motion.div key={i} className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-2xl text-[11px] font-bold border border-indigo-100 dark:border-indigo-800 shadow-sm">
                                            {item.description}
                                            <button onClick={() => removeFoodItem(i)} className="hover:text-rose-500 transition-colors">
                                                <X size={14} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>

                                {showMicrosEditor && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-2 md:grid-cols-3 gap-3 p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-700">
                                        <MicroInput label="Vitamin C (mg)" value={addedFoodItems[addedFoodItems.length-1].micronutrients?.vitaminC || 0} onChange={v => updateMicronutrients('vitaminC', v)} />
                                        <MicroInput label="Vitamin D (IU)" value={addedFoodItems[addedFoodItems.length-1].micronutrients?.vitaminD || 0} onChange={v => updateMicronutrients('vitaminD', v)} />
                                        <MicroInput label="Iron (mg)" value={addedFoodItems[addedFoodItems.length-1].micronutrients?.iron || 0} onChange={v => updateMicronutrients('iron', v)} />
                                        <MicroInput label="Magnesium (mg)" value={addedFoodItems[addedFoodItems.length-1].micronutrients?.magnesium || 0} onChange={v => updateMicronutrients('magnesium', v)} />
                                        <MicroInput label="Zinc (mg)" value={addedFoodItems[addedFoodItems.length-1].micronutrients?.zinc || 0} onChange={v => updateMicronutrients('zinc', v)} />
                                    </motion.div>
                                )}
                            </div>
                        )}

                        <AnimatePresence>
                            {isSimulating ? (
                                <div className="p-10 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] animate-pulse flex flex-col items-center border border-dashed border-slate-200 dark:border-slate-700">
                                    <Sparkles className="text-indigo-500 animate-spin mb-4" size={32} />
                                    <p className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">Simulating Metabolic Path...</p>
                                </div>
                            ) : mealSimulation && addedFoodItems.length > 0 && (
                                <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="p-10 bg-gradient-to-br from-indigo-900 to-slate-950 text-white rounded-[3rem] shadow-2xl space-y-6 relative overflow-hidden border border-white/5">
                                    <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles size={140} /></div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start">
                                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Biological Trajectory Simulation</div>
                                            <div className="text-[10px] bg-indigo-500/20 px-3 py-1 rounded-full font-black tracking-widest text-indigo-200">AURA SIM v5.1</div>
                                        </div>
                                        <div className="mt-6">
                                            <div className="text-sm font-bold opacity-60 uppercase tracking-widest">Recovery Capacity Impact</div>
                                            <div className="text-6xl font-black tracking-tighter">{mealSimulation.predictedRecoveryImpact > 0 ? '+' : ''}{mealSimulation.predictedRecoveryImpact}%</div>
                                        </div>
                                        <p className="text-sm font-medium text-indigo-100 leading-relaxed italic mt-6 border-l-2 border-indigo-500/30 pl-6">
                                            "{mealSimulation.reasoning}"
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {step === 'review' && (
                    <motion.div key="review" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8 pb-10">
                        <div className="text-center">
                            <div className="p-5 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl inline-block mb-4 border border-emerald-100 dark:border-emerald-800"><CheckCircle2 size={32} className="text-emerald-600" /></div>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white uppercase tracking-tighter">Review Intelligence</h2>
                            <p className="text-slate-500 mt-1 font-medium">Verify your health ledger before submission.</p>
                        </div>

                        <div className="space-y-4">
                            <ReviewCard icon={<Moon size={18} />} label="Sleep Architecture" detail={`${Math.round((data.sleepDeep + data.sleepREM + data.sleepLight) / 60)}h total, ${data.sleep}/10 quality`} />
                            <ReviewCard icon={<Zap size={18} />} label="Energy & Stress" detail={`Energy: ${data.energy}/10, Stress: ${data.stress}/10`} />
                            <ReviewCard icon={<Move size={18} />} label="Activity" detail={`${data.activityType} for ${data.activityDuration} min`} />
                            <ReviewCard icon={<Utensils size={18} />} label="Nutrition" detail={data.nutrition ? `${data.nutrition.calories} kcal logged` : 'No data'} />
                            
                            {data.nutrition?.micronutrients && (
                                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                                        <Sparkles size={10} /> Consolidated Micronutrients
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                                        <div className="bg-white dark:bg-slate-900 p-2 rounded-xl text-center">C: {data.nutrition.micronutrients.vitaminC}mg</div>
                                        <div className="bg-white dark:bg-slate-900 p-2 rounded-xl text-center">D: {data.nutrition.micronutrients.vitaminD}IU</div>
                                        <div className="bg-white dark:bg-slate-900 p-2 rounded-xl text-center">Fe: {data.nutrition.micronutrients.iron}mg</div>
                                        <div className="bg-white dark:bg-slate-900 p-2 rounded-xl text-center col-span-1.5">Mg: {data.nutrition.micronutrients.magnesium}mg</div>
                                        <div className="bg-white dark:bg-slate-900 p-2 rounded-xl text-center col-span-1.5">Zn: {data.nutrition.micronutrients.zinc}mg</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800 flex gap-4">
                            <Info size={20} className="text-indigo-500 shrink-0" />
                            <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed font-bold">
                                Once submitted, Aura's neural engine will synthesize these correlations to update your readiness score and coaching insights.
                            </p>
                        </div>
                    </motion.div>
                )}
                
                {['energy', 'stress', 'mood', 'activity'].includes(step) && (
                    <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="py-20 text-center space-y-12">
                         <div className="p-10 bg-slate-50 dark:bg-slate-800 rounded-[3rem] inline-block shadow-sm border border-slate-100 dark:border-slate-700">
                            {step === 'energy' && <Zap size={80} className="text-amber-500" />}
                            {step === 'stress' && <AlertCircle size={80} className="text-rose-500" />}
                            {step === 'mood' && <Smile size={80} className="text-emerald-500" />}
                            {step === 'activity' && <Move size={80} className="text-blue-500" />}
                         </div>
                         <div className="space-y-2">
                            <h2 className="text-4xl font-black capitalize tracking-tighter">{step} Analysis</h2>
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Self-Assessment Gradient (1-10)</p>
                         </div>
                         <div className="space-y-6">
                            <div className="text-7xl font-black text-slate-800 dark:text-white tracking-tighter">
                                {step === 'energy' ? data.energy : step === 'stress' ? data.stress : data.mood}
                            </div>
                            <input 
                                type="range" min="0" max="10" 
                                value={step === 'energy' ? data.energy : step === 'stress' ? data.stress : data.mood}
                                onChange={e => handleSliderChange(step, parseInt(e.target.value))} 
                                className="w-full accent-indigo-600 h-2 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" 
                            />
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border-t dark:border-slate-800 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)]">
            <button 
                onClick={nextStep} 
                disabled={isScanning}
                className="w-full py-5 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-lg flex justify-center items-center gap-3 shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {step === 'review' ? 'Commit to Ledger' : 'Confirm & Continue'}
                {step === 'review' ? <CheckCircle2 size={20} /> : <ArrowRight size={20} className="opacity-70" />}
            </button>
        </div>
    </motion.div>
  );
};

const ArrowRight = ({ size, className }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
);

const SleepPhaseInput = ({ label, value, onChange, color }: any) => {
    const colors: any = {
        emerald: 'border-emerald-500/30 text-emerald-600 focus-within:ring-emerald-500/20',
        purple: 'border-purple-500/30 text-purple-600 focus-within:ring-purple-500/20',
        blue: 'border-blue-500/30 text-blue-600 focus-within:ring-blue-500/20',
        rose: 'border-rose-500/30 text-rose-600 focus-within:ring-rose-500/20',
    };
    return (
        <div className={`p-4 bg-white dark:bg-slate-800 border rounded-2xl transition-all shadow-sm ${colors[color]}`}>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</label>
            <input 
                type="number" 
                value={value} 
                onChange={e => onChange(e.target.value)}
                className="w-full bg-transparent text-xl font-bold outline-none text-slate-800 dark:text-white"
            />
        </div>
    );
};

const StatMini = ({ label, val, unit = '' }: { label: string, val: number, unit?: string }) => (
    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
        <div className="text-[8px] font-black text-slate-400 uppercase tracking-tighter truncate mb-1">{label}</div>
        <div className="text-sm font-black text-slate-800 dark:text-white">{val}{unit}</div>
    </div>
);

const MicroInput = ({ label, value, onChange }: any) => (
    <div className="space-y-1">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
        <input 
            type="number" 
            value={value} 
            onChange={e => onChange(e.target.value)}
            className="w-full p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-black outline-none focus:border-indigo-500 transition-colors"
        />
    </div>
);

const ReviewCard = ({ icon, label, detail }: any) => (
    <div className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-400">{icon}</div>
        <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{detail}</div>
        </div>
    </div>
);
