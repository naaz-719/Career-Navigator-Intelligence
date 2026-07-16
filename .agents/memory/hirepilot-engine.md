---
name: HirePilot Intelligence Engine
description: Architecture of the centralized engine layer — module locations, type contracts, and key wiring decisions
---

## Engine location
`src/engine/` — the centralized intelligence layer.
- `types.ts` — `IntelligenceResult`, `Factor`, `SuggestedAction`, `RiskTier`; re-exports `AppProfile`
- `data.ts` — all shared constants (FLAG_MAP, SHORT_COUNTRY, JOB_POOL, etc.) and helpers
- `index.ts` — re-exports all modules + `runAllIntelligence(profile)` convenience function
- `modules/` — one file per domain: careerScore, hireProbability, salaryIntelligence, marketDemand, nationalization, jobMatching, relocation, resumeScore, interviewReadiness, careerMultiverse, careerTwin

## Facade
`src/services/mockDataService.ts` — thin compatibility wrapper. All existing wired pages import from here; the facade delegates to engine modules. New pages can import engine modules directly.

## Type system
`UserProfile = AppProfile & { question: string }` (in `src/components/decision-engine/types.ts`).
- `AppProfile` is the canonical model in `ProfileContext`
- `question` is transient/form-only, never persisted to profile
- `InputForm` state type is `Omit<UserProfile, 'question'>` = `AppProfile`; must include ALL AppProfile fields including `name`, `currentCountry`, `languages`, `linkedinUrl`, `preferredWorkStyle`

**Why:** Removes the duplicate `UserProfile` interface. One canonical profile flows through every module.

## Backend seam pattern
Every engine module has `// Backend seam: replace with fetch(...)` comments. To wire a real API, replace that module's compute function body with `fetch()` — the return type (defined in types.ts) is what the real API must also return. No other files need to change.

## Key wiring decisions
- `ProfileContext` has `updateProfile(partial)` — Settings page uses this for Save
- `ProfileContext` has `mergeFromAnalysis(partial)` — AI Decision Engine syncs form edits back to profile
- `CareerTwinPage` role literals need `as const` to satisfy `"user" | "assistant"` type
- `SuggestedAction.priority` literals need `as const` when inside filter chains (TypeScript narrows to `string`)
- `relocation.ts` savingsData entry typed as `{ month: string; [key: string]: string | number }` (not bare Record)
