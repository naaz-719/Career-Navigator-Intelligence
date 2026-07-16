// ─── AI Decision Engine — Data Contracts ────────────────────────────────────
// These interfaces define the exact shape that a real backend API must return.
// The placeholder service in src/services/decisionEngine.ts implements them.
// Swap out that service file when real APIs are ready — nothing else changes.

import type { AppProfile } from '@/context/ProfileContext';

// ─── UserProfile ─────────────────────────────────────────────────────────────
// The decision engine is the only place that adds a `question` field on top of
// the canonical AppProfile. This keeps AppProfile clean and profile-centric
// while allowing the engine form to capture the user's specific query.
export type UserProfile = AppProfile & {
  /** The specific question the user is asking the AI Decision Engine */
  question: string;
};

export type ModuleStatus = 'idle' | 'running' | 'complete' | 'error';

export interface ReasoningModule {
  id: ModuleId;
  name: string;
  icon: string;
  description: string;
  status: ModuleStatus;
  thoughts: string[];
  summary: string;
  durationMs: number;
}

export type ModuleId =
  | 'profile'
  | 'policy'
  | 'salary'
  | 'market'
  | 'eligibility'
  | 'recommendation';

export type RiskLevel = 'High' | 'Medium' | 'Low';

export interface CountryAnalysis {
  country: string;
  flag: string;
  hireProbability: number;
  visaFeasibility: RiskLevel;
  salaryMatch: number;
  nationalizationRisk: RiskLevel;
  demandIndex: number;
  topEmployers: string[];
  recommended: boolean;
  note: string;
  jobCount: number;
}

export interface SalaryAnchor {
  askPrice: number;
  targetPrice: number;
  expectedOffer: number;
  walkaway: number;
  negotiationScript: string;
}

export interface NextStep {
  step: number;
  action: string;
  detail: string;
  urgency: RiskLevel;
  timeframe: string;
  link?: string;
  linkLabel?: string;
}

export interface ModuleInsight {
  moduleId: ModuleId;
  headline: string;
  body: string;
}

export interface DecisionResult {
  question: string;
  profile: UserProfile;
  primaryRecommendation: string;
  hireProbability: number;
  confidenceScore: number;
  topCountry: string;
  salaryFeasibility: string;
  salaryAnchor: SalaryAnchor;
  timeToHireEstimate: string;
  matchedJobCount: number;
  moduleInsights: ModuleInsight[];
  countryAnalysis: CountryAnalysis[];
  strengths: string[];
  risks: string[];
  nextSteps: NextStep[];
  generatedAt: string;
}

export interface ReasoningState {
  modules: ReasoningModule[];
  currentModuleIndex: number;
  isComplete: boolean;
}

export interface AnalysisHistoryEntry {
  id: string;
  question: string;
  hireProbability: number;
  topCountry: string;
  sector: string;
  generatedAt: string;
  result: DecisionResult;
}
