
import { GoogleGenAI, Type } from "@google/genai";
import { HealthLog, Insight, NutritionLog, Forecast, MealSimulation, AIMemoryNode, SafetyReport, WeeklyBriefing } from "../types";

const CLINICAL_DISCLAIMER = "Non-diagnostic information for wellbeing purposes. Not medical advice.";

const ANALYTICS_SYSTEM_PROMPT = `
You are 'Aura', a 2026-era advanced health intelligence engine. 
You specialize in PREDICTIVE FORECASTING, EXPLAINABLE AI, and BEHAVIORAL NUDGES.

CRITICAL RULES:
1. Always include the clinical boundary: "This is a neural synthesis, not a medical diagnosis."
2. Detect stress/distress signals. If found, shift to 'Stabilizing Mode'.
3. Transparency: Briefly reference the data lineage (e.g., "Based on your 14-day sleep trend...").
4. Personalization: Use the user's biological chronotype and current readiness score to tailor the advice.
`;

export const GeminiService = {
  // Safety Guard: Detects anomalies or distress
  validateSafety: async (logs: HealthLog[]): Promise<SafetyReport> => {
      const lastLog = logs[logs.length - 1];
      if (!lastLog) return { isAnomalous: false, distressSignalDetected: false };

      const isAnomalous = (lastLog.sleepQuality < 3 && lastLog.energy > 8) || (lastLog.stress > 9 && lastLog.mood > 8);
      const distressSignalDetected = lastLog.stress > 9 && lastLog.mood < 3;

      if (distressSignalDetected) {
          return {
              isAnomalous,
              distressSignalDetected,
              stabilizingAdvice: "Aura has detected high systemic strain. Reasoning is shifting to stabilization. Prioritize parasympathetic activity over data tracking."
          };
      }
      return { isAnomalous, distressSignalDetected };
  },

  // Weekly Briefing: Narrative Layer
  generateWeeklyBriefing: async (logs: HealthLog[], memories: AIMemoryNode[]): Promise<WeeklyBriefing> => {
      if (!process.env.API_KEY || logs.length < 7) throw new Error("Baseline not met");
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: `Synthesize the past 7 days of logs and long-term memories into a calm weekly narrative. Logs: ${JSON.stringify(logs.slice(-7))}. Memories: ${JSON.stringify(memories)}.`,
          config: {
              systemInstruction: ANALYTICS_SYSTEM_PROMPT,
              responseMimeType: "application/json",
              responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                      narrativeSummary: { type: Type.STRING },
                      biologicalTrajectory: { type: Type.STRING, enum: ['Ascending', 'Descending', 'Plateau'] },
                      criticalCorrelations: { type: Type.ARRAY, items: { type: Type.STRING } },
                      sovereigntyCheck: { type: Type.STRING }
                  }
              }
          }
      });
      const data = JSON.parse(response.text);
      return {
          ...data,
          id: crypto.randomUUID(),
          weekLabel: `Week of ${new Date().toLocaleDateString()}`,
          userId: logs[0].userId
      };
  },

  synthesizeMemory: async (logs: HealthLog[]): Promise<Omit<AIMemoryNode, 'id' | 'userId'>> => {
      if (!process.env.API_KEY || logs.length < 7) throw new Error("Need more data");
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const summaryData = logs.map(l => ({ d: l.date, slp: l.sleepQuality, str: l.stress, nrg: l.energy, id: l.id }));
      
      const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Synthesize this data into a long-term memory node. Reference data IDs for lineage. Data: ${JSON.stringify(summaryData)}`,
          config: {
              responseMimeType: "application/json",
              responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                      summary: { type: Type.STRING },
                      keyPatterns: { type: Type.ARRAY, items: { type: Type.STRING } },
                      emotionalTone: { type: Type.STRING },
                      dateRange: {
                          type: Type.OBJECT,
                          properties: { start: { type: Type.STRING }, end: { type: Type.STRING } }
                      },
                      lineageIds: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
              }
          }
      });
      return JSON.parse(response.text);
  },

  generateDeepInsight: async (
    logs: HealthLog[], 
    memories: AIMemoryNode[], 
    chronotype: string = 'Unknown', 
    readinessScore: number = 50
  ): Promise<Omit<Insight, 'id' | 'dateGenerated' | 'userId'>> => {
    try {
      if (!process.env.API_KEY) return { title: "Safety Mode", description: "Standard recovery logic active.", type: "neutral", clinicalDisclaimer: CLINICAL_DISCLAIMER };
      
      const safety = await GeminiService.validateSafety(logs);
      if (safety.distressSignalDetected) {
          return {
              title: "Stabilization Recommended",
              description: safety.stabilizingAdvice || "High stress detected.",
              type: "warning",
              confidenceScore: 99,
              reasoning: ["Systemic strain levels exceed performance benchmarks."],
              prediction: "Extended recovery required to prevent burnout.",
              clinicalDisclaimer: CLINICAL_DISCLAIMER
          };
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze logs (${JSON.stringify(logs.slice(-14))}) and memories (${JSON.stringify(memories)}). 
        CONTEXT:
        User Chronotype: ${chronotype}
        Current Readiness Score: ${readinessScore}%
        
        Provide a medical-grade but non-diagnostic insight specifically tailored to how their chronotype might be influencing their recent trends or how they should use their ${readinessScore}% readiness today.`,
        config: {
            systemInstruction: ANALYTICS_SYSTEM_PROMPT,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ["positive", "warning", "neutral"] },
                    confidenceScore: { type: Type.NUMBER },
                    reasoning: { type: Type.ARRAY, items: { type: Type.STRING } },
                    prediction: { type: Type.STRING }
                }
            }
        }
      });
      const insight = JSON.parse(response.text);
      return { ...insight, clinicalDisclaimer: CLINICAL_DISCLAIMER };
    } catch (error) {
      return { title: "Resilient Offline Core", description: "Deterministically calculating recovery scores.", type: "neutral", clinicalDisclaimer: CLINICAL_DISCLAIMER };
    }
  },

  searchFoodItems: async (query: string): Promise<NutritionLog[]> => {
    try {
        if (!process.env.API_KEY) return [{ description: query, calories: 250, protein: 10, carbs: 30, fats: 8 }];
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Search food for: "${query}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            description: { type: Type.STRING },
                            calories: { type: Type.NUMBER },
                            protein: { type: Type.NUMBER },
                            carbs: { type: Type.NUMBER },
                            fats: { type: Type.NUMBER }
                        }
                    }
                }
            }
        });
        return JSON.parse(response.text);
    } catch (e) { return []; }
  },

  analyzeFoodImage: async (base64Image: string): Promise<NutritionLog> => {
    try {
        if (!process.env.API_KEY) return { calories: 0, protein: 0, carbs: 0, fats: 0, description: "Scan Offline" };
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', 
            contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: "Nutritional parse for packaging/barcode." }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { description: { type: Type.STRING }, calories: { type: Type.NUMBER }, protein: { type: Type.NUMBER }, carbs: { type: Type.NUMBER }, fats: { type: Type.NUMBER } }
                }
            }
        });
        return JSON.parse(response.text);
    } catch (e) { return { calories: 0, protein: 0, carbs: 0, fats: 0, description: "Scan Failed" }; }
  },

  // Added simulateMealImpact to GeminiService
  simulateMealImpact: async (meal: string, logs: HealthLog[]): Promise<MealSimulation> => {
    try {
      if (!process.env.API_KEY) return { mealName: meal, predictedRecoveryImpact: 5, predictedEnergyImpact: 10, reasoning: "Standard simulation active (offline)." };
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const summaryData = logs.slice(-7).map(l => ({ d: l.date, slp: l.sleepQuality, str: l.stress, nrg: l.energy }));
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Simulate the impact of eating "${meal}" based on my recent health patterns: ${JSON.stringify(summaryData)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              mealName: { type: Type.STRING },
              predictedRecoveryImpact: { type: Type.NUMBER },
              predictedEnergyImpact: { type: Type.NUMBER },
              reasoning: { type: Type.STRING }
            },
            required: ["mealName", "predictedRecoveryImpact", "predictedEnergyImpact", "reasoning"]
          }
        }
      });
      return JSON.parse(response.text);
    } catch (e) {
      return { mealName: meal, predictedRecoveryImpact: 0, predictedEnergyImpact: 0, reasoning: "Simulation failed to converge." };
    }
  },

  detectChronotype: async (logs: HealthLog[]): Promise<'Lion' | 'Bear' | 'Wolf' | 'Dolphin' | 'Unknown'> => {
      if (!process.env.API_KEY || logs.length < 5) return 'Unknown';
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Identify chronotype: ${JSON.stringify(logs.slice(-10))}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { chronotype: { type: Type.STRING, enum: ['Lion', 'Bear', 'Wolf', 'Dolphin', 'Unknown'] } }
                }
            }
          });
          return JSON.parse(response.text).chronotype || 'Unknown';
      } catch { return 'Unknown'; }
  },

  generateForecast: async (logs: HealthLog[]): Promise<Forecast[]> => {
      if (!process.env.API_KEY) return [];
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Predict 7 days: ${JSON.stringify(logs.slice(-14))}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: { metric: { type: Type.STRING }, trend: { type: Type.STRING }, predictedValue: { type: Type.NUMBER }, daysOut: { type: Type.NUMBER } }
                    }
                }
            }
        });
        return JSON.parse(response.text);
      } catch { return []; }
  }
};
