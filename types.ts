
export type LogType = 'mood' | 'energy' | 'sleep' | 'stress' | 'activity' | 'nutrition' | 'review';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: string;
  chronotype?: 'Lion' | 'Bear' | 'Wolf' | 'Dolphin' | 'Unknown';
  longTermGoals?: string[];
  isCalibrated?: boolean;
}

export type ReadinessState = 'Push' | 'Maintain' | 'Rest' | 'Recover';

export interface ReadinessScore {
    score: number;
    state: ReadinessState;
    reason: string;
    evidenceLineage?: string[];
}

export interface SafetyReport {
    isAnomalous: boolean;
    distressSignalDetected: boolean;
    stabilizingAdvice?: string;
}

export interface NeuralAudit {
    predictionId: string;
    latency: number;
    confidence: number;
    modelUsed: string;
    timestamp: string;
}

export interface WeeklyBriefing {
    id: string;
    userId: string;
    weekLabel: string;
    narrativeSummary: string;
    biologicalTrajectory: 'Ascending' | 'Descending' | 'Plateau';
    criticalCorrelations: string[];
    sovereigntyCheck: string;
}

export interface AIMemoryNode {
    id: string;
    userId: string;
    dateRange: { start: string; end: string };
    summary: string;
    keyPatterns: string[];
    emotionalTone: string;
    lineageIds: string[];
}

export interface MealSimulation {
    mealName: string;
    predictedRecoveryImpact: number; 
    predictedEnergyImpact: number;
    reasoning: string;
}

export interface ActivityLog {
    type: string;
    duration: number; 
    intensity: number; 
}

// Added Micronutrients interface to resolve error in components/DailyCheckIn.tsx
export interface Micronutrients {
    vitaminC: number;
    vitaminD: number;
    iron: number;
    magnesium: number;
    zinc: number;
}

export interface NutritionLog {
    calories: number;
    protein: number; 
    carbs: number; 
    fats: number; 
    description?: string;
    // Updated from any to Micronutrients to match imports in components
    micronutrients?: Micronutrients;
}

// Added Forecast interface to resolve error in services/geminiService.ts
export interface Forecast {
    metric: string;
    trend: string;
    predictedValue: number;
    daysOut: number;
}

export interface HealthLog {
  id: string;
  userId: string;
  date: string; 
  mood: number;
  energy: number;
  sleepQuality: number;
  sleepPhases?: { deep: number; light: number; rem: number; awake: number };
  stress: number;
  activity?: ActivityLog;
  nutrition?: NutritionLog;
  symptoms: string[];
  notes: string;
}

export interface Insight {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'neutral';
  dateGenerated: string;
  confidenceScore?: number;
  reasoning?: string[];
  prediction?: string;
  clinicalDisclaimer?: string;
}

export enum ViewState {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  CHECK_IN = 'CHECK_IN',
  COACH = 'COACH',
  HISTORY = 'HISTORY',
  PROFILE = 'PROFILE',
  SLEEP = 'SLEEP',
  MEMORY = 'MEMORY',
  BRIEFING = 'BRIEFING'
}
