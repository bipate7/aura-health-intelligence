
# Data Sovereignty & Privacy Framework

Aura is built on the principle of **User Sovereignty**. Your health data is your intellectual property.

## 1. Local-First Storage
- **Zero Server Footprint**: Aura has no backend database. All logs, nutrition data, and AI-synthesized memory nodes are stored in `window.localStorage`.
- **Encryption**: Data remains unencrypted in local storage (Browser-standard). Users are encouraged to use device-level encryption (FileVault, BitLocker) and secure their browser profiles.

## 2. Stateless AI Inference
- **Inference only**: Biometric data is sent to the Gemini API solely for the purpose of generating insights.
- **No Training**: We do not use user data to train proprietary models. 
- **Statelessness**: Each request is treated as a new event. We do not store conversation history or user identity on the AI provider's side beyond the duration of the API call.

## 3. The "Sovereignty Inspector"
In the `MemoryManager` view, users can:
1. **Audit Lineage**: See exactly which logs were used to generate a specific memory node.
2. **Hard Wipe**: Instantly delete all local history and reset the system's "context."
3. **Export Ledger**: Download a full JSON record of all biometrics to move to another system.
