// ─── Intelligence Module: Career Twin ────────────────────────────────────────
// Backend seam: replace the entire function body with:
//   return fetch('/api/intelligence/career-twin', { method: 'POST', body: JSON.stringify(profile) }).then(r => r.json())

import type { AppProfile } from '@/context/ProfileContext';
import type { IntelligenceResult, Factor, SuggestedAction, RiskTier } from '../types';
import { SHORT_COUNTRY, NATL_RISK, MARKET_SKILLS } from '../data';
import { computeBaseCareerScore, computeBaseHireProbability } from '../data';

export interface CareerTwinMessage {
  role: 'assistant' | 'user';
  content: string;
}

export interface CareerTwinResult extends IntelligenceResult {
  messages: CareerTwinMessage[];
}

export function computeCareerTwin(profile: AppProfile): CareerTwinResult {
  const topCountry  = SHORT_COUNTRY[profile.targetCountries[0] ?? 'United Arab Emirates'] ?? 'UAE';
  const secondCountry = profile.targetCountries.length > 1 ? SHORT_COUNTRY[profile.targetCountries[1]] : null;
  const riskCountry = profile.targetCountries.find(c => (NATL_RISK[c] ?? {})[profile.sector]! >= 5) ?? profile.targetCountries[0];
  const riskCountryShort = SHORT_COUNTRY[riskCountry ?? 'Saudi Arabia'] ?? 'KSA';
  const careerScore = computeBaseCareerScore(profile.yearsExperience, profile.skills.length);
  const hirePct     = computeBaseHireProbability(profile.yearsExperience, profile.skills.length);
  const market      = MARKET_SKILLS[profile.sector] ?? MARKET_SKILLS['Technology']!;
  const missing     = market.filter(s => !profile.skills.some(ps =>
    ps.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(ps.toLowerCase())
  ));

  const messages: CareerTwinMessage[] = [
    {
      role: 'assistant',
      content: `Hi ${profile.name}! I'm your Career Twin. I've analysed your ${profile.yearsExperience}-year ${profile.sector} career as a ${profile.currentRole}.\n\nYour current career score is ${careerScore}/100. You have ${profile.skills.length} indexed skills — your strongest signals for ${topCountry} are ${profile.skills.slice(0, 2).join(' and ')}. Where do you want to be in 5 years?`,
    },
    {
      role: 'user',
      content: `I want to reach a VP/Director level, ideally in ${topCountry}${secondCountry ? ` or ${secondCountry}` : ''}. But I'm worried about nationalization pushing me out of leadership roles.`,
    },
    {
      role: 'assistant',
      content: `Valid concern, and one I can model precisely. In ${riskCountryShort}, VP-level ${profile.sector} roles in government/semi-govt carry ${(NATL_RISK[riskCountry ?? 'Saudi Arabia'] ?? {})[profile.sector]! >= 6 ? 'high (70%+)' : 'moderate (40%)'} nationalization restriction. But private sector ${profile.sector} leadership is a different story.\n\nBased on your current trajectory, your hire probability in ${topCountry} is ${Math.round(hirePct)}% within 3 months at your target salary. If you add ${missing[0] ?? 'in-demand skills'} to your profile, that jumps to ${Math.min(95, Math.round(hirePct) + 9)}%.\n\nShall I simulate the VP path vs staying at Senior level?`,
    },
  ];

  const riskTier: RiskTier = careerScore >= 80 ? 'low' : careerScore >= 65 ? 'medium' : 'high';
  const confidence = Math.min(90, 70 + profile.skills.length * 2);

  const factors: Factor[] = [
    { label: `Career score (${careerScore}/100)`,   impact: 'positive', weight: careerScore,                        detail: 'Overall GCC market readiness index' },
    { label: `Hire probability (${Math.round(hirePct)}%)`, impact: 'positive', weight: Math.round(hirePct),         detail: 'Probability of receiving a qualified offer within 90 days' },
    { label: `${missing.length} skill gap(s) to close`, impact: missing.length > 0 ? 'negative' : 'positive', weight: Math.min(80, missing.length * 20), detail: missing.length > 0 ? `Close "${missing[0]}" first — highest market demand` : 'No critical skill gaps' },
  ];

  const suggestedActions: SuggestedAction[] = [
    { action: `Ask your Career Twin about your VP/Director path in ${topCountry}`, priority: 'high',   timeframe: 'Now', link: '/career-twin', linkLabel: 'Chat with Twin' },
    { action: missing.length > 0 ? `Add ${missing[0]} to your skills — +9% hire probability` : 'Maintain your skills currency', priority: 'medium', timeframe: '1–2 months' },
  ];

  return {
    score: careerScore, probability: Math.round(hirePct), confidence,
    reasoning: `Your Career Twin has analysed your ${profile.yearsExperience}-year ${profile.sector} track record. Career score: ${careerScore}/100. Hire probability in ${topCountry}: ${Math.round(hirePct)}%. ${missing.length > 0 ? `Closing ${missing.length} skill gap(s) would push probability to ${Math.min(95, Math.round(hirePct) + missing.length * 3)}%.` : 'Strong skill coverage.'}`,
    contributingFactors: factors, riskLevel: riskTier, suggestedActions,
    messages,
  };
}
