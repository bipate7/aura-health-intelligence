
# System Architecture: The Aura Neural Core

Aura operates as a hybrid intelligence system where deterministic math meets probabilistic reasoning.

## 1. Input Layer (Biometric Signals)
- **Manual Input**: Daily Check-In (Sleep, Energy, Mood, Nutrition).
- **Vision Input**: Barcode/Product scanning via Gemini Vision for precise macros.

## 2. Processing Layer (The Neural Core)
- **Heuristic Engine**: Standard JS logic calculates "Readiness" based on moving averages. This is the **Deterministic Ground Truth**.
- **Reasoning Engine**: Gemini 1.5 Pro processes the past 14 days + Long-term Memory Nodes to detect **Non-Linear Patterns**.

## 3. Storage Layer (Local Sovereignty)
- `HealthLog`: Raw daily biometrics.
- `MemoryNode`: Synthesized summaries of 7-30 day periods.
- `Insight`: Proactive nudges based on current trajectories.

## 4. Pipeline Flow
`Signals` -> `Heuristic Validator` -> `AI Pattern Synthesis` -> `Explainable Insight`
