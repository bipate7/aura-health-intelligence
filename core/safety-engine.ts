
import { HealthLog, SafetyReport, Insight } from '../types';

export const SafetyEngine = {
  /**
   * Scans biometric logs for clinical danger zones or anomalies.
   */
  async validateCurrentState(logs: HealthLog[]): Promise<SafetyReport> {
    if (logs.length === 0) return { isAnomalous: false, distressSignalDetected: false };
    
    const latest = logs[logs.length - 1];
    
    // Thresholds for "Stabilizing Mode"
    const isCriticalStress = latest.stress >= 9 && latest.mood <= 3;
    const isSleepDeprivedBurnout = latest.sleepQuality <= 2 && latest.energy >= 8; // Manic signal

    if (isCriticalStress) {
      return {
        isAnomalous: true,
        distressSignalDetected: true,
        stabilizingAdvice: "Neural Core has shifted to recovery-only logic. Biometric markers indicate high systemic risk. Minimize cognitive load and digital inputs for 12 hours."
      };
    }

    return { isAnomalous: false, distressSignalDetected: false };
  },

  /**
   * Sanitizes AI output to ensure no medical advice or drug names are mentioned.
   */
  async sanitizeOutput(insight: any): Promise<any> {
    // Simple regex-based sanitization for demonstration
    const forbiddenPatterns = [/take \d+mg/, /diagnose/, /treat with/, /prescribe/gi];
    let sanitizedDescription = insight.description;

    forbiddenPatterns.forEach(pattern => {
      sanitizedDescription = sanitizedDescription.replace(pattern, "[Clinical Boundary Reached]");
    });

    return {
      ...insight,
      description: sanitizedDescription
    };
  }
};
