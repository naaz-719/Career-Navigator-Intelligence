---
name: HirePilot Intelligence Engine
description: Architecture of the engine layer, Claude integration, and data flow for the AI Decision Engine.
---

## Engine Modules
- `src/engine/modules/` — 11 modules: careerScore, hireProbability, salaryIntelligence, marketDemand, nationalization, jobMatching, relocation, resumeScore, interviewReadiness, careerMultiverse, careerTwin
- `src/engine/data.ts` — all shared constants and pure computation helpers
- `src/engine/index.ts` — re-exports everything + `runAllIntelligence(profile)`

## Claude Integration (IMPLEMENTED)
- **Route**: `POST /api/decision-engine/analyze` in `artifacts/api-server/src/routes/decision-engine/index.ts`
- **Model**: `claude-sonnet-4-6` via `@workspace/integrations-anthropic-ai`
- **Pattern**: pure metric helpers duplicated in the route file; Claude gets pre-computed numbers in its system prompt and provides genuine natural-language reasoning
- **SSE events**: `{ type: "module_start"|"thought"|"module_complete"|"error"|"done", moduleId, text?, summary? }`
- **Frontend**: `runDecisionEngine` in `src/services/decisionEngine.ts` streams from API; falls back to local simulation if API is unavailable
- **Structured result**: `generateResult(profile)` runs on frontend (formula-computed) after `done` SSE event; Claude only provides reasoning text

## Transparency Badges
- `ClaudeBadge` — violet, `Bot` icon — marks reasoning text as Claude-generated
- `FormulaBadge` — amber, `FlaskConical` icon — marks numbers as formula-estimated
- Present in both `ReasoningProgress.tsx` and `ResultPanel.tsx`
- `DataLegend` component in ResultPanel hero explains both badges to judges

## UserProfile = AppProfile & { question: string }
- `question` is transient/form-only (in `src/components/decision-engine/types.ts`)
- All other fields live on `AppProfile` in `ProfileContext.tsx`

## mockDataService.ts is a thin facade
- Delegates to engine modules; existing wired pages import from it
- New pages can import engine modules directly

## Backend seam pattern
- Every engine module has `// Backend seam: replace with fetch(...)` comments
- For the decision engine, the seam is in `src/services/decisionEngine.ts` → already swapped to real Claude API
