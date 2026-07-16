---
name: Decision Engine Contracts
description: Type contracts and seam boundaries for the AI Decision Engine
---

# Decision Engine Contracts

## Key types (types.ts)
- `UserProfile` — form input (question + profile fields)
- `DecisionResult` — full analysis output; includes `salaryAnchor`, `timeToHireEstimate`, `matchedJobCount` added in v2
- `NextStep` — has optional `link` (internal route) and `linkLabel` for deep-link action buttons
- `CountryAnalysis` — has `jobCount` field (estimated legitimate open roles)
- `SalaryAnchor` — askPrice, targetPrice, expectedOffer, walkaway, negotiationScript
- `AnalysisHistoryEntry` — compact record stored in localStorage

## Seam rule
- `decisionEngine.ts` is the ONLY file to replace when wiring real AI
- Replace `runDecisionEngine()` with a streaming SSE fetch: emit same callbacks (onModuleStart, onThought, onModuleComplete, onComplete)
- Replace `generateResult()` with the final JSON parse from the stream
- Everything else (ReasoningProgress, ResultPanel, AIDecisionEnginePage) adapts automatically

## Result Panel deep links
- Country cards → `/jobs` (Browse jobs in X)
- Next steps → `/resume-studio`, `/jobs`, `/salary-intelligence`, `/relocation`, `/interview-coach`, `/nationalization`
- Quick Actions strip: 6 platform links always visible at top of result

**Why:** Contract-first design means the frontend is always ready for a real backend — no UI changes needed when the engine goes live.
