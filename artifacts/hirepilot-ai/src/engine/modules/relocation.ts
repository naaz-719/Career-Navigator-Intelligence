// ─── Intelligence Module: Relocation ─────────────────────────────────────────
// Backend seam: replace the entire function body with:
//   return fetch('/api/intelligence/relocation', { method: 'POST', body: JSON.stringify(profile) }).then(r => r.json())

import type { AppProfile } from '@/context/ProfileContext';
import type { IntelligenceResult, Factor, SuggestedAction, RiskTier } from '../types';
import { FLAG_MAP, SHORT_COUNTRY } from '../data';

export interface RelocationCountry {
  code: string;
  name: string;
  flag: string;
  savingsRate: number;    // % of take-home that can be saved
  costOfLiving: string;
  timeToSettle: string;
  taxNote: string;
  recommended: boolean;
}

export interface RelocationResult extends IntelligenceResult {
  fromCountry: string;
  fromFlag: string;
  toCountries: RelocationCountry[];
  savingsData: Array<{ month: string; [country: string]: string | number }>;
  months: string[];
}

// Cost of living tiers by country (monthly AED, single professional)
const COST_BASE: Record<string, number> = {
  'United Arab Emirates': 8500, 'Saudi Arabia': 6800, 'Qatar': 7500,
  'Oman': 5500, 'Bahrain': 5000, 'Kuwait': 7000,
};

const COL_LABELS: Record<string, string> = {
  'United Arab Emirates': 'High', 'Saudi Arabia': 'Moderate', 'Qatar': 'High',
  'Oman': 'Low–Moderate', 'Bahrain': 'Low–Moderate', 'Kuwait': 'Moderate–High',
};

const SETTLE_TIME: Record<string, string> = {
  'United Arab Emirates': '3–5 weeks', 'Saudi Arabia': '4–8 weeks', 'Qatar': '4–6 weeks',
  'Oman': '3–5 weeks', 'Bahrain': '2–4 weeks', 'Kuwait': '4–8 weeks',
};

export function computeRelocation(profile: AppProfile): RelocationResult {
  const fromCountry = profile.currentCountry;
  const fromFlag    = FLAG_MAP[fromCountry] ?? '🌍';
  const targets     = profile.targetCountries.length > 0
    ? profile.targetCountries
    : ['United Arab Emirates', 'Saudi Arabia', 'Qatar'];

  const toCountries: RelocationCountry[] = targets.map(c => {
    const cost    = COST_BASE[c] ?? 6000;
    const savings = Math.max(10, Math.round(((profile.targetSalary - cost) / profile.targetSalary) * 100));
    return {
      code:          SHORT_COUNTRY[c] ?? c,
      name:          c,
      flag:          FLAG_MAP[c] ?? '🌍',
      savingsRate:   savings,
      costOfLiving:  COL_LABELS[c] ?? 'Moderate',
      timeToSettle:  SETTLE_TIME[c] ?? '4–6 weeks',
      taxNote:       '0% income tax',
      recommended:   savings >= 35,
    };
  });

  // Monthly savings projections over 12 months
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const savingsData = MONTHS.map((month, i) => {
    const entry: { month: string; [key: string]: string | number } = { month };
    targets.slice(0, 3).forEach(c => {
      const cost         = COST_BASE[c] ?? 6000;
      const monthlySaved = Math.max(0, profile.targetSalary - cost);
      entry[SHORT_COUNTRY[c] ?? c] = Math.round(monthlySaved * (1 + i * 0.01));
    });
    return entry;
  });

  const bestSavings   = Math.max(...toCountries.map(c => c.savingsRate));
  const riskTier: RiskTier = bestSavings >= 40 ? 'low' : bestSavings >= 25 ? 'medium' : 'high';
  const confidence    = 78;

  const factors: Factor[] = [
    { label: `Target salary AED ${Math.round(profile.targetSalary / 1000)}K/mo (0% tax)`, impact: 'positive', weight: 90, detail: 'All GCC markets are tax-free — gross equals net take-home' },
    { label: `Best savings rate: ${bestSavings}%`,                                          impact: bestSavings >= 30 ? 'positive' : 'neutral', weight: bestSavings, detail: `${toCountries.find(c => c.savingsRate === bestSavings)?.name ?? 'Best market'} offers the highest savings ratio` },
    { label: `Cost of living in target markets`,                                             impact: 'neutral',  weight: 50, detail: 'Varies from Moderate (KSA) to High (UAE/Qatar) — offset by no income tax' },
    { label: `Relocation one-off cost`,                                                      impact: 'negative', weight: 20, detail: 'Estimate AED 15K–30K for shipping, deposits, and initial setup' },
  ];

  const suggestedActions: SuggestedAction[] = [
    { action: 'Negotiate housing allowance or relocation package — standard in senior GCC roles',   priority: 'high',   timeframe: 'Before signing', link: '/salary-intelligence', linkLabel: 'Salary Benchmarks' },
    { action: `Complete ${fromCountry !== 'United Arab Emirates' ? 'credential attestation (MOFA)' : 'Emirates ID and visa transfer'} before relocation`, priority: 'high', timeframe: '4–6 weeks before move' },
    { action: 'Open local bank account within first 2 weeks — required for salary crediting',       priority: 'medium', timeframe: 'First week in country' },
  ];

  return {
    score: bestSavings, probability: Math.min(90, bestSavings + 30), confidence,
    reasoning: `Relocating from ${fromCountry} to ${toCountries[0]?.name ?? targets[0]} on a target salary of AED ${Math.round(profile.targetSalary / 1000)}K/mo gives a projected savings rate of ${toCountries[0]?.savingsRate ?? 0}% after living costs. All GCC markets are 0% income tax.`,
    contributingFactors: factors, riskLevel: riskTier, suggestedActions,
    fromCountry, fromFlag, toCountries, savingsData, months: MONTHS,
  };
}
