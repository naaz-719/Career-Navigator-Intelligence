// ─── Intelligence Module: Job Matching ───────────────────────────────────────
// Uses the real, scraped GCC job dataset (realJobs.json) instead of fictional
// hardcoded listings. Filters by target country, ranks by keyword/skill overlap.

import type { AppProfile } from "@/context/ProfileContext";
import type {
  IntelligenceResult,
  Factor,
  SuggestedAction,
  RiskTier,
} from "../types";
import { FLAG_MAP } from "../data";
import realJobsData from "@/data/realJobs.json";

export interface EnrichedJob {
  id: number;
  title: string;
  company: string;
  sector: string;
  country: string;
  loc: string;
  salaryLabel: string;
  tags: string[];
  ghostRisk: number;
  isGhost?: boolean;
  posted: string;
  requiredSkills: string[];
  match: number;
  flag: string;
  link: string;
}

export interface JobMatchingResult extends IntelligenceResult {
  jobs: EnrichedJob[];
  avgSalary: number;
  ghostRate: number;
}

interface RealJob {
  id: number;
  title: string;
  company: string;
  location: string;
  country: string;
  postedDate: string;
  searchKeyword: string;
  functionGuess: string;
  seniorityGuess: string;
  link: string;
  sources: string[];
}

const realJobs = realJobsData as RealJob[];

// Light, defensible skill inference from the job title itself —
// the scraper didn't capture structured skills, so we tag a few
// reasonable ones based on keyword hits in the title.
function inferSkills(title: string): string[] {
  const t = title.toLowerCase();
  const skills: string[] = [];
  if (t.includes("data") || t.includes("analyst"))
    skills.push("SQL", "Excel", "Data Analytics");
  if (t.includes("business intelligence") || t.includes(" bi "))
    skills.push("Power BI");
  if (
    t.includes("software") ||
    t.includes("developer") ||
    t.includes("engineer")
  )
    skills.push("Python", "System Design");
  if (t.includes("account")) skills.push("Financial Modelling", "Excel");
  if (t.includes("sales")) skills.push("CRM", "Negotiation");
  if (t.includes("project manager") || t.includes("project management"))
    skills.push("Stakeholder Mgmt", "Primavera P6");
  if (t.includes("customer service") || t.includes("support"))
    skills.push("CRM", "Communication");
  if (skills.length === 0) skills.push("Communication", "Stakeholder Mgmt");
  return [...new Set(skills)];
}

function computeMatch(
  requiredSkills: string[],
  profileSkills: string[],
  yearsExp: number,
  titleText: string,
  profileSector: string,
): number {
  const lowerProfileSkills = profileSkills.map((s) => s.toLowerCase());
  const matched = requiredSkills.filter((r) =>
    lowerProfileSkills.some(
      (p) => r.toLowerCase().includes(p) || p.includes(r.toLowerCase()),
    ),
  ).length;
  const skillPct =
    requiredSkills.length > 0 ? matched / requiredSkills.length : 0.3;
  const sectorBoost = titleText
    .toLowerCase()
    .includes(profileSector.toLowerCase().split(" ")[0])
    ? 6
    : 0;
  return Math.min(
    96,
    Math.round(38 + skillPct * 40 + Math.min(yearsExp * 1.3, 14) + sectorBoost),
  );
}

export function computeJobMatching(profile: AppProfile): JobMatchingResult {
  const byCountry = realJobs.filter(
    (j) =>
      profile.targetCountries.length === 0 ||
      profile.targetCountries.includes(j.country),
  );

  const pool = byCountry.length > 0 ? byCountry : realJobs;

  const enriched: EnrichedJob[] = pool.map((j) => {
    const requiredSkills = inferSkills(j.title);
    const match = computeMatch(
      requiredSkills,
      profile.skills,
      profile.yearsExperience,
      j.title,
      profile.sector,
    );
    return {
      id: j.id,
      title: j.title,
      company: j.company,
      sector: j.functionGuess || profile.sector,
      country: j.country,
      loc: j.location,
      salaryLabel: "Not disclosed",
      tags: ["Real listing"],
      ghostRisk: 15,
      posted: j.postedDate,
      requiredSkills,
      match,
      flag: FLAG_MAP[j.country] ?? "🌍",
      link: j.link,
    };
  });

  const filtered = enriched.sort((a, b) => b.match - a.match).slice(0, 150);

  const avgSalary = profile.targetSalary;
  const ghostRate = 15;

  const topMatch = filtered[0]?.match ?? 50;
  const avgMatch =
    filtered.length > 0
      ? Math.round(filtered.reduce((s, j) => s + j.match, 0) / filtered.length)
      : 50;
  const riskTier: RiskTier =
    topMatch >= 85 ? "low" : topMatch >= 70 ? "medium" : "high";
  const confidence = Math.min(
    88,
    60 + (filtered.length >= 4 ? 15 : filtered.length * 4),
  );

  const factors: Factor[] = [
    {
      label: `${filtered.length} real matched roles in target countries`,
      impact: "positive",
      weight: Math.min(100, filtered.length * 8),
      detail: `Filtered from ${pool.length} real GCC listings (Bayt, GulfTalent, NaukriGulf)`,
    },
    {
      label: `Top match score ${topMatch}%`,
      impact: topMatch >= 85 ? "positive" : "neutral",
      weight: topMatch,
      detail:
        "Keyword overlap between your skills and the real job title/function",
    },
    {
      label: `Average match score ${avgMatch}%`,
      impact: avgMatch >= 75 ? "positive" : "neutral",
      weight: avgMatch,
      detail: "Across all matched real roles in your target markets",
    },
  ];

  const suggestedActions: SuggestedAction[] = [
    {
      action:
        "Apply directly via company careers pages for the strongest matches",
      priority: "high",
      timeframe: "This week",
      link: "/jobs",
      linkLabel: "View All Jobs",
    },
    {
      action:
        filtered.length < 4
          ? "Expand target countries to find more real matches"
          : `Focus on the top-${Math.min(3, filtered.length)} matched roles first`,
      priority: "medium",
      timeframe: "Weeks 1–2",
    },
  ];

  return {
    score: avgMatch,
    probability: topMatch,
    confidence,
    reasoning: `Found ${filtered.length} real matched roles in your target market(s), sourced from live GCC job boards. Top match: ${topMatch}% (${filtered[0]?.title ?? "N/A"} at ${filtered[0]?.company ?? "N/A"}). Average match across all roles: ${avgMatch}%.`,
    contributingFactors: factors,
    riskLevel: riskTier,
    suggestedActions,
    jobs: filtered,
    avgSalary,
    ghostRate,
  };
}
