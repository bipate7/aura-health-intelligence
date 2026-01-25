
# Feature Flags & Intelligence Modules

Aura uses modular feature flagging to isolate experimental intelligence layers.

| Flag | Description | Default |
|------|-------------|---------|
| `AURA_NEURAL_REASONING` | Enable LLM-driven deep insights. | ON |
| `AURA_VISION_PARSING` | Enable barcode/label scanning for nutrition. | ON |
| `AURA_WEEKLY_SYNTHESIS` | Enable the human-readable Weekly Briefing. | ON |
| `AURA_STRICT_SAFETY` | Shift to ground truth only during distress signals. | ON |
| `AURA_EXPERIMENTAL_VISIONS` | Enable real-time chronotype prediction. | OFF |

## Deployment Strategy
All flags are currently managed within the `GeminiService` logic based on API availability and data baseline thresholds.
