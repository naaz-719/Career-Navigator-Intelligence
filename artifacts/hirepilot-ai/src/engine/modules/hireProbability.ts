// ─── Intelligence Module: Hire Probability ────────────────────────────────────
// Backend seam: replace the entire function body with:
//   return fetch('/api/intelligence/hire-probability', { method: 'POST', body: JSON.stringify(profile) }).then(r => r.json())

import type { AppProfile } from '@/context/ProfileContext';
import type { IntelligenceResult, Factor, SuggestedAction, RiskTier } from '../types';
import { SHORT_COUNTRY, computeBaseHireProbability } from '../data';

export interface HireProbabilityResult extends IntelligenceResult {
  hireProbability: number;
}

export function computeHireProbability(profile: AppProfile): HireProbabilityResult {
  const hireProbability = computeBaseHireProbability(profile.yearsExperience, profile.skills.length);
  const expPts          = Math.min(23, profile.yearsExperience * 2.5);
  const skillBonus      = profile.skills.length > 4 ? 8 : 3;
  const confidence      = Math.min(90, 65 + profile.yearsExperience + profile.skills.length);
  const topCountry      = SHORT_COUNTRY[profile.targetCountries[0] ?? 'United Arab Emirates'] ?? 'UAE';
  const riskTier: RiskTier = hireProbability >= 80 ? 'low' : hireProbability >= 65 ? 'medium' : 'high';

  const factors: Factor[] = [
    { label: `Base market activity`,                               impact: 'positive', weight: 57, detail: `GCC market baseline for ${profile.sector} professionals` },
    { label: `Experience depth (${profile.yearsExperience} yrs)`, impact: 'positive', weight: Math.round((expPts / 23) * 100), detail: 'Senior-tier profiles outperform junior-tier by 1.8×' },
    { label: profile.skills.length > 4 ? `Skills coverage (${profile.skills.length} skills)` : `Skills coverage (${profile.skills.length} — add 2+ to unlock higher tier)`, impact: profile.skills.length > 4 ? 'positive' : 'neutral', weight: profile.skills.length > 4 ? 85 : 38, detail: profile.skills.length > 4 ? `5+ skills indexed: recruiter inbound 2.3× higher` : 'Add 2+ skills to unlock the +8% tier' },
  ];

  const suggestedActions: SuggestedAction[] = [
    { action: 'Run AI Decision Engine for a precise hire probability with country-level breakdowns', priority: 'high', timeframe: 'Today', link: '/ai-decision-engine', linkLabel: 'Run Analysis' },
    ...(profile.skills.length <= 4 ? [{ action: 'Add 2+ market-demand skills to unlock higher hire probability tier', priority: 'medium' as const, timeframe: '1–2 months', link: '/career-intelligence', linkLabel: 'Skill Gaps' }] : []),
  ];

  return {
    score: hireProbability, probability: hireProbability, confidence,
    reasoning: `${Math.round(hireProbability)}% probability of receiving a qualified offer within 90 days in ${topCountry}. ${profile.skills.length > 4 ? 'Strong skills coverage adds a +8% tier bonus.' : 'Add 2+ skills to unlock the +8% coverage tier.'} Run the AI Decision Engine for a full 6-module analysis with ±5% precision.`,
    contributingFactors: factors, riskLevel: riskTier, suggestedActions,
    hireProbability,
  };
}
