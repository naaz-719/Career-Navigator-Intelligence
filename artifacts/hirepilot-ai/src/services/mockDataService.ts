// ─── Mock Data Service — Compatibility Facade ─────────────────────────────────
// Thin wrapper over the Intelligence Engine. Pages import from here; the engine
// modules contain the real logic and backend seam comments.
// To wire a real API: replace the relevant engine module function body with fetch().

import type { AppProfile } from "@/context/ProfileContext";
import { computeCareerScore } from "@/engine/modules/careerScore";
import { computeMarketDemand } from "@/engine/modules/marketDemand";
import { computeSalaryIntelligence } from "@/engine/modules/salaryIntelligence";
import { computeNationalization } from "@/engine/modules/nationalization";
import { computeJobMatching } from "@/engine/modules/jobMatching";
import { computeCareerTwin } from "@/engine/modules/careerTwin";
import { computeRelocation } from "@/engine/modules/relocation";
import { computeResumeScore } from "@/engine/modules/resumeScore";
import { computeInterviewReadiness } from "@/engine/modules/interviewReadiness";
import { computeCareerMultiverse } from "@/engine/modules/careerMultiverse";
import { SHORT_COUNTRY, FLAG_MAP } from "@/engine/data";

// Re-export FLAG_MAP for components that import it from this module
export { FLAG_MAP };

// ─── Dashboard ────────────────────────────────────────────────────────────────
export function getDashboardMetrics(p: AppProfile) {
  const cs = computeCareerScore(p);
  return {
    careerScore: cs.careerScore,
    hireProbability: cs.probability,
    interviewReadiness: cs.interviewReadiness,
    topCountry: p.targetCountries[0] ?? "United Arab Emirates",
    topFlag: FLAG_MAP[p.targetCountries[0] ?? "United Arab Emirates"] ?? "🇦🇪",
    topCountryShort:
      SHORT_COUNTRY[p.targetCountries[0] ?? "United Arab Emirates"] ?? "UAE",
    salaryPotential: p.targetSalary,
  };
}

export function getDashboardTimeline(p: AppProfile) {
  return computeCareerScore(p).timeline;
}

export function getSkillGaps(p: AppProfile) {
  return computeCareerScore(p).skillGaps;
}

export function getDashboardJobs(p: AppProfile) {
  return computeJobMatching(p).jobs.slice(0, 4);
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────
export function getJobsData(p: AppProfile) {
  const jm = computeJobMatching(p);
  return { jobs: jm.jobs, avgSalary: jm.avgSalary, ghostRate: jm.ghostRate };
}

// ─── Career Intelligence ──────────────────────────────────────────────────────
export function getMarketDemand(p: AppProfile) {
  const m = computeMarketDemand(p);
  return {
    score: m.score,
    velocity: m.velocity,
    avgDays: m.avgDays,
    note: m.note,
  };
}

export function getSkillRadar(p: AppProfile) {
  return computeMarketDemand(p).radarData;
}

export function getTopCompanies(p: AppProfile) {
  return computeMarketDemand(p).topCompanies;
}

// ─── Salary Intelligence ──────────────────────────────────────────────────────
export function getSalaryData(p: AppProfile) {
  const s = computeSalaryIntelligence(p);
  return {
    percentiles: s.percentiles,
    userPercentile: s.userPercentile,
    targetK: s.targetK,
    salaryTrendData: s.salaryTrendData,
    trendKeys: s.trendKeys,
    deltaData: s.deltaData,
    medianRate: s.medianRate,
  };
}

// ─── Nationalization ──────────────────────────────────────────────────────────
export function getNationalizationData(p: AppProfile) {
  const n = computeNationalization(p);
  return {
    score: n.riskScore,
    scoreColor: n.scoreColor,
    riskLabel: n.riskLabel,
    riskDescription: n.riskDescription,
    countryDetails: n.countryDetails,
  };
}

// ─── Career Twin ──────────────────────────────────────────────────────────────
export function getCareerTwinMessages(p: AppProfile) {
  return computeCareerTwin(p).messages;
}

// ─── Dashboard Simulations ─────────────────────────────────────

// ─── New module accessors (for wired pages) ───────────────────────────────────
export function getCareerMultiverseScenarios(p: AppProfile) {
  return computeCareerMultiverse(p).scenarios;
}

export function getRelocationData(p: AppProfile) {
  return computeRelocation(p);
}

export function getResumeData(p: AppProfile) {
  return computeResumeScore(p);
}

export function getInterviewQuestions(p: AppProfile) {
  return computeInterviewReadiness(p);
}
