
# Data Flow Mapping

## User Check-In Journey
1. **Capture**: User logs biometrics in `DailyCheckIn`.
2. **Verification**: `GeminiService.validateSafety` checks for anomalous signals.
3. **Commit**: Data is pushed to `localStorage.aura_health_logs`.
4. **Trigger**: `StorageService.calculateReadiness` updates the Core Score.
5. **Synthesis**:
   - If Logs > 7, `GeminiService.synthesizeMemory` is called weekly.
   - Every login, `GeminiService.generateDeepInsight` refreshes the Intelligence layer.

## Privacy Boundary
- **Inside Boundary**: Raw logs, exact sleep times, specific notes (Stay in Browser).
- **Inference Proxy**: Anonymized data blobs sent to Gemini (Biometrics only, no PII like Name/Email).
- **Result**: Insights returned and stored locally.
