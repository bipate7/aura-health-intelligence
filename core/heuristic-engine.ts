
import { HealthLog, ReadinessScore, ReadinessState } from '../types';

export const HeuristicEngine = {
  /**
   * Calculates readiness using standard biological formulas (Moving Averages).
   */
  calculateReadiness(logs: HealthLog[]): ReadinessScore {
    if (logs.length < 3) {
      return { score: 50, state: 'Maintain', reason: 'Calibration Phase: Establishing baseline.' };
    }

    const recent = logs.slice(-3);
    const avgSleep = recent.reduce((sum, l) => sum + l.sleepQuality, 0) / 3;
    const avgStress = recent.reduce((sum, l) => sum + l.stress, 0) / 3;
    const todayEnergy = recent[2].energy;

    // The Aura Readiness Heuristic (Weighted)
    // Sleep (50%), Stress (30%), Current Energy (20%)
    const score = Math.round((avgSleep * 5) + ((10 - avgStress) * 3) + (todayEnergy * 2));
    
    let state: ReadinessState = 'Maintain';
    let reason = "Your systems are balanced. Continue with planned activities.";

    if (score >= 85) {
      state = 'Push';
      reason = "Physiological recovery is peak. High intensity training or cognitive work recommended.";
    } else if (score < 40) {
      state = 'Recover';
      reason = "Multiple recovery signals detected. Reduce load and prioritize sleep phases.";
    } else if (avgStress > 7) {
      state = 'Rest';
      reason = "Stress accumulation is outpacing recovery capacity.";
    }

    return { score, state, reason };
  }
};
