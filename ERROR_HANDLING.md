
# Resilience & Failure States

Aura is designed to be useful even when the Intelligence layer is unavailable.

## 1. Graceful Degradation
If the Gemini API returns a 5xx or 4xx error:
- **Safety Mode**: The system replaces the AI "Neural Coach" with a deterministic summary from the `StorageService`.
- **UI Feedback**: Intelligence cards display a "Resilient Offline Core" badge.
- **Retries**: Exponential backoff (1s, 2s, 4s) is applied to nutrition searches.

## 2. Invalid Data Handling
- **Anomalous Signal**: If a user logs `Sleep: 0` but `Energy: 10`, the system flags it as an anomaly in the `Readiness` reason, suggesting a recalibration of the log.
- **Empty States**: Every view includes a "Zero Data" state with clear instructions on how to begin the signal capture phase.
