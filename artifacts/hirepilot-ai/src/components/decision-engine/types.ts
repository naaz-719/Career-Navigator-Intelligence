// ─── AI Decision Engine — Data Contracts ────────────────────────────────────
// These interfaces define the exact shape that a real backend API must return.
// The placeholder service in src/services/decisionEngine.ts implements them.
// Swap out that service file when real APIs are ready — nothing else changes.

export interface UserProfile {
  question: string;
  nationality: string;
  visaStatus: string;
  currentRole: string;
  yearsExperience: number;
  skills: string[];
  education: string;
  currentSalary: number; // AED/month
  targetSalary: number;  // AED/month
  targetCountries: string[];
  careerGoal: string;
  sector: string;
}

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
  hireProbability: number;      // 0–100
  visaFeasibility: RiskLevel;
  salaryMatch: number;          // % of target salary achievable
  nationalizationRisk: RiskLevel;
  demandIndex: number;          // 0–100, YoY demand growth score
  topEmployers: string[];
  recommended: boolean;
  note: string;
  jobCount: number;             // estimated open roles matching profile
}

export interface SalaryAnchor {
  askPrice: number;         // AED/mo — open negotiation here (≥ target)
  targetPrice: number;      // AED/mo — your real target
  expectedOffer: number;    // AED/mo — company's likely first offer
  walkaway: number;         // AED/mo — minimum you'll accept
  negotiationScript: string;
}

export interface NextStep {
  step: number;
  action: string;
  detail: string;
  urgency: RiskLevel;
  timeframe: string;
  link?: string;       // internal route (e.g. "/jobs", "/resume-studio")
  linkLabel?: string;  // CTA label (e.g. "Open Jobs")
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
  hireProbability: number;      // 0–100
  confidenceScore: number;      // 0–100
  topCountry: string;
  salaryFeasibility: string;
  salaryAnchor: SalaryAnchor;
  timeToHireEstimate: string;   // e.g. "6–10 weeks"
  matchedJobCount: number;
  moduleInsights: ModuleInsight[];
  countryAnalysis: CountryAnalysis[];
  strengths: string[];
  risks: string[];
  nextSteps: NextStep[];
  generatedAt: string;
}

// Shape returned by the streaming reasoning simulation
export interface ReasoningState {
  modules: ReasoningModule[];
  currentModuleIndex: number;
  isComplete: boolean;
}

// Compact record stored in localStorage history
export interface AnalysisHistoryEntry {
  id: string;
  question: string;
  hireProbability: number;
  topCountry: string;
  sector: string;
  generatedAt: string;
  result: DecisionResult;
}
