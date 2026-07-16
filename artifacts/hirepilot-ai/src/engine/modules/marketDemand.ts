// ─── Intelligence Module: Market Demand ──────────────────────────────────────
// Backend seam: replace the entire function body with:
//   return fetch('/api/intelligence/market-demand', { method: 'POST', body: JSON.stringify(profile) }).then(r => r.json())

import type { AppProfile } from '@/context/ProfileContext';
import type { IntelligenceResult, Factor, SuggestedAction, RiskTier } from '../types';
import { DEMAND_BY_SECTOR, RADAR_AXES, TOP_COMPANIES, drand } from '../data';

export interface MarketDemandResult extends IntelligenceResult {
  score: number;         // demand score 0–10
  velocity: number;      // QoQ growth %
  avgDays: number;       // avg days to hire
  note: string;
  radarData: Array<{ subject: string; A: number; B: number; fullMark: number }>;
  topCompanies: Array<{ name: string; roles: number; growth: string }>;
}

export function computeMarketDemand(profile: AppProfile): MarketDemandResult {
  const demand      = DEMAND_BY_SECTOR[profile.sector] ?? DEMAND_BY_SECTOR['Technology']!;
  const companies   = TOP_COMPANIES[profile.sector] ?? TOP_COMPANIES['Technology']!;
  const axes        = RADAR_AXES[profile.sector] ?? RADAR_AXES['Technology']!;

  const radarData = axes.map(axis => {
    const hasSkill = axis.keywords.some(k => profile.skills.some(s => s.toLowerCase().includes(k)));
    const base     = hasSkill ? drand(axis.label, 68, 95) : drand(axis.label, 22, 52);
    return { subject: axis.label, A: base, B: axis.marketDemand, fullMark: 100 };
  });

  // Derive an IntelligenceResult score from the demand score (normalise 0–10 → 0–100)
  const normalised = Math.round(demand.score * 10);
  const riskLevel: RiskTier = demand.score >= 8 ? 'low' : demand.score >= 6.5 ? 'medium' : 'high';
  const confidence = 82;

  const factors: Factor[] = [
    { label: `${profile.sector} demand score`,     impact: 'positive', weight: normalised,                                         detail: `${demand.score}/10 — updated weekly from GCC job boards` },
    { label: `Hiring velocity`,                     impact: 'positive', weight: Math.min(100, demand.velocity * 4),                detail: `+${demand.velocity}% QoQ — ${demand.velocity >= 18 ? 'candidate market' : 'steady market'}` },
    { label: `Average time-to-hire`,               impact: 'positive', weight: Math.round((31 - demand.avgDays) / 31 * 100),      detail: `${demand.avgDays} days average — ${demand.avgDays <= 22 ? 'fast' : 'normal'} hiring cycle` },
    { label: 'Ghost job prevalence (31.4%)',        impact: 'negative', weight: 31,                                                detail: '1 in 3 postings is a placeholder — apply direct for better conversion' },
  ];

  const suggestedActions: SuggestedAction[] = [
    { action: `Apply directly to ${companies[0]?.name ?? 'top employers'} — +2.8× conversion over job boards`, priority: 'high', timeframe: 'This week', link: '/jobs', linkLabel: 'View Matched Jobs' },
    { action: demand.velocity >= 18 ? 'Push harder on salary — candidate market conditions active' : 'Volume strategy: aim for 4–6 active conversations simultaneously', priority: 'medium', timeframe: 'Weeks 1–2' },
  ];

  return {
    score: demand.score, probability: Math.min(90, normalised), confidence,
    reasoning: `${profile.sector} sector demand is ${demand.score >= 8 ? 'exceptional' : demand.score >= 6.5 ? 'strong' : 'moderate'} (${demand.score}/10). Hiring is up +${demand.velocity}% QoQ — ${demand.velocity >= 18 ? 'this is a candidate market, use the leverage.' : 'steady conditions favour prepared candidates.'}`,
    contributingFactors: factors, riskLevel, suggestedActions,
    velocity: demand.velocity, avgDays: demand.avgDays, note: demand.note,
    radarData, topCompanies: companies,
  };
}
