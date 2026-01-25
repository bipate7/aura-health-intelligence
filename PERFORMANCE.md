
# Performance Budget & AI Latency

Health-tech users require high responsiveness to maintain logging habits.

## 1. Intelligence Latency Guards
- **Flash vs Pro**: Aura uses `gemini-3-flash` for high-speed tasks (Nutrition search, simple forecasts) and `gemini-3-pro` for deep synthesis (Weekly Briefings, Deep Insights).
- **Skeleton States**: Every intelligence-driven component uses `Skeleton.tsx` to prevent layout shift during inference.

## 2. Performance Targets
- **Core TTI (Time to Interactive)**: < 1.5s
- **Check-In Completion**: < 45s
- **AI Inference Latency**: < 4.0s
- **FPS (Charts & Animations)**: Stable 60fps via Framer Motion hardware acceleration.

## 3. Resource Management
- **Image Compression**: Vision scanning compresses images to low-quality JPEG before transmission to reduce payload size.
- **Log Pruning**: System automatically suggests an "Archival Export" once the local signal history exceeds 365 days to maintain `localStorage` speed.
