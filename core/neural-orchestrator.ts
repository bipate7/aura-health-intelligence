
import { GeminiService } from '../services/geminiService';
import { HeuristicEngine } from './heuristic-engine';
import { SafetyEngine } from './safety-engine';
import { HealthLog, Insight, AIMemoryNode, ReadinessScore } from '../types';

/**
 * NeuralOrchestrator (The "Backend Brain")
 * Orchestrates the flow between deterministic truth and AI synthesis.
 */
export const NeuralOrchestrator = {
  async generateDailyIntelligence(logs: HealthLog[], memories: AIMemoryNode[]): Promise<{
    insight: Insight;
    readiness: ReadinessScore;
    latency: number;
    confidence: number;
  }> {
    const startTime = performance.now();
    const latestLog = logs[logs.length - 1];

    // 1. Safety Guard Check (Pre-Inference)
    const safetyReport = await SafetyEngine.validateCurrentState(logs);
    
    // 2. Deterministic Heuristics (Ground Truth)
    const readiness = HeuristicEngine.calculateReadiness(logs);

    // 3. Conditional AI Inference
    let insight: Insight;
    if (safetyReport.distressSignalDetected) {
      // Emergency Bypass: AI is silenced in favor of stabilizing advice
      insight = {
        id: crypto.randomUUID(),
        userId: latestLog.userId,
        title: "Systemic Stabilization Active",
        description: safetyReport.stabilizingAdvice || "High strain detected. Prioritize recovery.",
        type: 'warning',
        dateGenerated: new Date().toISOString(),
        confidenceScore: 100,
        reasoning: ["Safety Guard triggered by high stress/low mood correlation."],
        clinicalDisclaimer: "Stabilizing mode active."
      };
    } else {
      // Standard AI Inference Path
      const rawInsight = await GeminiService.generateDeepInsight(logs, memories);
      
      // Post-Inference Validation
      const validatedInsight = await SafetyEngine.sanitizeOutput(rawInsight);
      insight = {
        ...validatedInsight,
        id: crypto.randomUUID(),
        userId: latestLog.userId,
        dateGenerated: new Date().toISOString()
      };
    }

    const latency = Math.round(performance.now() - startTime);

    return {
      insight,
      readiness,
      latency,
      confidence: insight.confidenceScore || 0
    };
  }
};
