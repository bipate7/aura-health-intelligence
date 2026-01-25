
# Neural Reasoning Strategy

Aura differentiates between "Tracking" and "Intelligence" through a layered reasoning approach.

## 1. Deterministic Heuristics (Ground Truth)
Calculated via `StorageService.calculateReadiness`:
- **Sleep Quality**: Weighted average of phases (Deep, REM, Light).
- **Strain**: Interaction between Stress and Energy levels.
- **Outcome**: A "Push" or "Rest" recommendation.

## 2. Contextual Synthesis (Gemini Reasoning)
Gemini handles the high-order logic:
- **Inter-Metric Correlation**: e.g., "High carbohydrate intake on Tuesday correlates with a 20% drop in Deep Sleep on Wednesday."
- **Narrative Shifts**: Identifying when a user's biological trajectory is "Ascending" or "Plateauing" over weeks.

## 3. Calibration Phase
New users (Logs < 7) stay in **Calibration Mode**.
- LLM insights are minimized.
- Heuristics dominate.
- The system focuses on learning the user's personal "Normal" before attempting to predict deviations.
