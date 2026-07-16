---
name: HirePilot AI Architecture
description: Key architectural decisions for the HirePilot AI SaaS — data flow, context, seams
---

# HirePilot AI Architecture

## Data Flow
- `ProfileContext` (src/context/ProfileContext.tsx) is the single shared state for all pages
- `DEFAULT_PROFILE` is Ahmed — Egyptian, Senior PM, Technology, 8 yrs, AED 22K/35K, UAE+KSA+Qatar
- All pages call `useProfile()` and pass `profile` into `mockDataService` functions — never hardcode data in pages
- `mergeFromAnalysis()` is the write path — called by AIDecisionEnginePage after engine runs
- `lastAnalysis` (DecisionResult | null) is stored in context; Dashboard reads `hireProbability` from it

## Stack
- React + Vite + TypeScript + Tailwind v4 + shadcn/ui + Framer Motion + Recharts + Lucide + Wouter
- Routing: WouterRouter with `base={import.meta.env.BASE_URL.replace(/\/$/, '')}`
- ProfileProvider wraps the WouterRouter inside App.tsx

## Backend Seams
- `src/services/mockDataService.ts` — one function per page, all seamed with `// Backend seam:` comments
- `src/services/decisionEngine.ts` — entire file is the seam; `generateResult()` and `runDecisionEngine()` are replaced together
- `src/components/decision-engine/types.ts` — the API contract; must not change shape when backend is wired

## Analysis History
- `src/hooks/useAnalysisHistory.ts` — localStorage key `hirepilot_analysis_history`, max 6 entries
- History sidebar shown in AIDecisionEnginePage input step (xl:col-span-1 next to form)
- Clicking history entry calls `handleRestoreHistory` → sets result + jumps to result step

**Why:** All pages needed live data from a shared profile without prop-drilling or a real backend. The context + service pattern allows any page to be tested in isolation and any service to be swapped for a real API call independently.
