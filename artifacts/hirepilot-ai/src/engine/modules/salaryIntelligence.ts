// ─── Intelligence Module: Salary Intelligence ─────────────────────────────────
// Backend seam: replace the entire function body with:
//   return fetch('/api/intelligence/salary', { method: 'POST', body: JSON.stringify(profile) }).then(r => r.json())

import type { AppProfile } from '@/context/ProfileContext';
import type { IntelligenceResult, Factor, SuggestedAction, RiskTier } from '../types';
import { getSalaryPercentiles, getPercentile, SHORT_COUNTRY } from '../data';

export interface SalaryIntelligenceResult extends IntelligenceResult {
  percentiles: { p25: number; p50: number; p75: number; p90: number };
  userPercentile: number;
  targetK: number;
  medianRate: number;
  salaryTrendData: Array<Record<string, string | number>>;
  trendKeys: string[];
  deltaData: Array<{ country: string; national: number; expat: number }>;
}

export function computeSalaryIntelligence(profile: AppProfile): SalaryIntelligenceResult {
  const percentiles   = getSalaryPercentiles(profile.sector, profile.yearsExperience);
  const userPct       = getPercentile(profile.targetSalary, percentiles.p25, percentiles.p50, percentiles.p75, percentiles.p90);
  const targetK       = Math.round(profile.targetSalary / 1000);
  const delta         = Math.round(((profile.targetSalary - profile.currentSalary) / profile.currentSalary) * 100);
  const feasLabel     = delta <= 20 ? 'High' : delta <= 40 ? 'Medium' : 'Challenging';

  const shown  = (profile.targetCountries.length > 0 ? profile.targetCountries.slice(0, 3) : ['United Arab Emirates', 'Saudi Arabia', 'Qatar']);
  const MONTHS = ['Jan 23', 'Jun 23', 'Jan 24', 'Jun 24', 'Jan 25', 'Jun 25'];
  const GROWTH: Record<string, number> = { 'United Arab Emirates': 1.06, 'Saudi Arabia': 1.08, 'Qatar': 1.04, 'Oman': 1.03, 'Bahrain': 1.03, 'Kuwait': 1.04 };

  const salaryTrendData = MONTHS.map((month, i) => {
    const entry: Record<string, string | number> = { month };
    shown.forEach(c => {
      const base = profile.currentSalary * Math.pow(GROWTH[c] ?? 1.05, i * 0.5);
      entry[SHORT_COUNTRY[c] ?? c] = Math.round(base);
    });
    return entry;
  });
  const trendKeys = shown.map(c => SHORT_COUNTRY[c] ?? c);

  const deltaData = shown.map(c => ({
    country:  SHORT_COUNTRY[c] ?? c,
    national: Math.round(profile.targetSalary * 1.28),
    expat:    Math.round(profile.targetSalary * 0.95),
  }));

  const confidence = delta <= 20 ? 85 : delta <= 35 ? 72 : 60;
  const riskLevel: RiskTier = delta <= 20 ? 'low' : delta <= 35 ? 'medium' : delta <= 50 ? 'high' : 'critical';

  const factors: Factor[] = [
    { label: `Current baseline AED ${Math.round(profile.currentSalary / 1000)}K/mo`,  impact: 'positive',  weight: 60,                                  detail: 'Your starting point for negotiation' },
    { label: `Target uplift (+${delta}%)`,                                              impact: delta <= 30 ? 'positive' : 'negative', weight: Math.min(100, delta * 2), detail: `${feasLabel} feasibility — ${delta <= 20 ? 'within normal GCC ranges' : delta <= 40 ? 'competitive but precedented' : 'above median; requires premium profile'}` },
    { label: `${profile.sector} sector premium`,                                        impact: 'positive',  weight: 70,                                  detail: `${profile.sector} earns an above-average coefficient in GCC` },
    { label: '0% income tax across all GCC',                                            impact: 'positive',  weight: 100,                                 detail: 'Gross salary equals net take-home everywhere in GCC' },
    { label: `Target sits at ${userPct}th percentile`,                                  impact: userPct >= 50 ? 'positive' : 'neutral', weight: userPct,   detail: `P50 for your role/sector/exp = AED ${Math.round(percentiles.p50 / 1000)}K/mo` },
  ];

  const suggestedActions: SuggestedAction[] = [
    { action: `Open negotiations at AED ${Math.round(profile.targetSalary * 1.15 / 1000)}K — anchor high to land at target`, priority: 'high',   timeframe: 'Before any offer discussion', link: '/ai-decision-engine', linkLabel: 'Get Salary Anchor' },
    ...(profile.targetSalary < 30000 ? [{ action: 'Negotiate to AED 30K+ to unlock UAE Golden Visa — 10-year residency', priority: 'high' as const, timeframe: 'Before signing' }] : []),
  ];

  return {
    score: userPct, probability: Math.min(90, 55 + (delta <= 20 ? 20 : delta <= 35 ? 10 : 0)), confidence,
    reasoning: `Your target of AED ${targetK}K/mo is at the ${userPct}th percentile for your role, sector, and experience tier. Feasibility is ${feasLabel}. ${delta <= 30 ? 'Within normal offer ranges — strong negotiating position.' : 'Above market median — justify with premium skills or certification.'}`,
    contributingFactors: factors, riskLevel, suggestedActions,
    percentiles, userPercentile: userPct, targetK, medianRate: percentiles.p50,
    salaryTrendData, trendKeys, deltaData,
  };
}
