// ─── Intelligence Module: Nationalization Risk ────────────────────────────────
// Backend seam: replace the entire function body with:
//   return fetch('/api/intelligence/nationalization', { method: 'POST', body: JSON.stringify(profile) }).then(r => r.json())

import type { AppProfile } from '@/context/ProfileContext';
import type { IntelligenceResult, Factor, SuggestedAction, RiskTier } from '../types';
import { NATL_RISK, COUNTRY_POLICY, FLAG_MAP, SHORT_COUNTRY } from '../data';

export interface CountryNatDetail {
  country: string; flag: string; policy: string; quota: string;
  risk: string; desc: string;
  color: string; bg: string; border: string;
}

export interface NationalizationResult extends IntelligenceResult {
  riskScore: number;       // 0–10 scale
  riskLabel: string;
  scoreColor: string;
  riskDescription: string;
  countryDetails: CountryNatDetail[];
}

export function computeNationalization(profile: AppProfile): NationalizationResult {
  const countries = profile.targetCountries.length > 0
    ? profile.targetCountries
    : ['United Arab Emirates', 'Saudi Arabia', 'Qatar'];

  const risks = countries.map(c => (NATL_RISK[c] ?? {})[profile.sector] ?? (NATL_RISK[c] ?? {})['default'] ?? 5);
  const avg   = risks.reduce((a, b) => a + b, 0) / risks.length;
  const score = Math.round(avg * 10) / 10;

  const scoreColor  = score <= 3 ? '#22c55e' : score <= 5.5 ? '#f59e0b' : '#ef4444';
  const riskLabel   = score <= 3 ? 'Low' : score <= 5.5 ? 'Moderate' : 'High';

  const highRiskCountries = countries.filter(c => {
    const r = (NATL_RISK[c] ?? {})[profile.sector] ?? 5;
    return r >= 6;
  });

  const riskDescription = highRiskCountries.length > 0
    ? `${riskLabel} risk across your target markets. ${highRiskCountries.map(c => SHORT_COUNTRY[c]).join(' and ')} have active quotas affecting ${profile.sector} ${profile.yearsExperience >= 7 ? 'senior leadership' : 'mid-level'} roles.`
    : `${riskLabel} risk overall. ${profile.sector} sector expat roles are relatively protected in your target markets.`;

  const allSixCountries = ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Oman', 'Bahrain', 'Kuwait'];
  const countryDetails: CountryNatDetail[] = allSixCountries.map(c => {
    const r         = (NATL_RISK[c] ?? {})[profile.sector] ?? (NATL_RISK[c] ?? {})['default'] ?? 5;
    const riskLevel = r <= 3 ? 'Low' : r <= 5 ? 'Medium' : 'High';
    const pol       = COUNTRY_POLICY[c] ?? { policy: 'National quota', quota: 'TBD', desc: () => 'Policies apply.' };
    return {
      country: c, flag: FLAG_MAP[c] ?? '🌍', policy: pol.policy, quota: pol.quota,
      risk: riskLevel, desc: pol.desc(profile.sector),
      color:  riskLevel === 'Low' ? 'text-green-500' : riskLevel === 'Medium' ? 'text-amber-500' : 'text-red-500',
      bg:     riskLevel === 'Low' ? 'bg-green-500/10' : riskLevel === 'Medium' ? 'bg-amber-500/10' : 'bg-red-500/10',
      border: riskLevel === 'Low' ? 'border-green-500/20' : riskLevel === 'Medium' ? 'border-amber-500/20' : 'border-red-500/20',
    };
  });

  const normalised  = Math.round((10 - score) * 10); // invert: low risk = high score
  const riskTier: RiskTier = score <= 3 ? 'low' : score <= 5.5 ? 'medium' : score <= 7 ? 'high' : 'critical';
  const confidence  = 84;

  const factors: Factor[] = [
    ...countries.map(c => {
      const r = (NATL_RISK[c] ?? {})[profile.sector] ?? 5;
      return {
        label:  `${SHORT_COUNTRY[c] ?? c} — ${profile.sector}`,
        impact: (r >= 6 ? 'negative' : r >= 4 ? 'neutral' : 'positive') as Factor['impact'],
        weight: r * 10,
        detail: r >= 6 ? 'Active quota enforcement — senior expat roles monitored' : r >= 4 ? 'Managed risk — specialist exemptions available' : 'Low enforcement in this sector/country combination',
      };
    }),
    { label: '3-year policy trend', impact: score > 5 ? 'negative' : 'positive', weight: 65, detail: score > 5 ? 'Quotas tightening +5% per year since 2022' : 'Policy stable or improving for expat specialists' },
  ];

  const suggestedActions: SuggestedAction[] = [
    ...(highRiskCountries.length > 0 ? [{ action: `Target tech-exempt or specialist role classifications in ${highRiskCountries.map(c => SHORT_COUNTRY[c]).join(', ')}`, priority: 'high' as const, timeframe: 'Before applying', link: '/nationalization', linkLabel: 'Full Risk Analysis' }] : []),
    { action: 'Private-sector roles carry 4× less nationalization risk than semi-govt', priority: 'medium', timeframe: 'Job search strategy' },
  ];

  return {
    score: normalised, probability: normalised, confidence,
    reasoning: riskDescription,
    contributingFactors: factors, riskLevel: riskTier, suggestedActions,
    riskScore: score, riskLabel, scoreColor, riskDescription, countryDetails,
  };
}
