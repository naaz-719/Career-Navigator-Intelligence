// ─── Intelligence Module: Job Matching ───────────────────────────────────────
// Backend seam: replace the entire function body with:
//   return fetch('/api/intelligence/jobs', { method: 'POST', body: JSON.stringify(profile) }).then(r => r.json())

import type { AppProfile } from '@/context/ProfileContext';
import type { IntelligenceResult, Factor, SuggestedAction, RiskTier } from '../types';
import { JOB_POOL, FLAG_MAP, computeMatchScore, drand } from '../data';

export interface EnrichedJob {
  id: number; title: string; company: string; sector: string;
  country: string; loc: string; salaryLabel: string; tags: string[];
  ghostRisk: number; isGhost?: boolean; posted: string;
  requiredSkills: string[]; match: number; flag: string;
}

export interface JobMatchingResult extends IntelligenceResult {
  jobs: EnrichedJob[];
  avgSalary: number;
  ghostRate: number;
}

export function computeJobMatching(profile: AppProfile): JobMatchingResult {
  const pool     = JOB_POOL[profile.sector] ?? JOB_POOL['Technology']!;
  const filtered = pool
    .filter(j => profile.targetCountries.length === 0 || profile.targetCountries.includes(j.country))
    .map(j => ({ ...j, match: computeMatchScore(j.requiredSkills, profile.skills, profile.yearsExperience), flag: FLAG_MAP[j.country] ?? '🌍' }))
    .sort((a, b) => b.match - a.match);

  const avgSalary = profile.targetSalary;
  const ghostRate = 14 + drand(profile.sector, 0, 8);

  const topMatch    = filtered[0]?.match ?? 50;
  const avgMatch    = filtered.length > 0 ? Math.round(filtered.reduce((s, j) => s + j.match, 0) / filtered.length) : 50;
  const riskTier: RiskTier = topMatch >= 85 ? 'low' : topMatch >= 70 ? 'medium' : 'high';
  const confidence  = Math.min(88, 60 + (filtered.length >= 4 ? 15 : filtered.length * 4));

  const factors: Factor[] = [
    { label: `${filtered.length} matched roles in target countries`,             impact: 'positive', weight: Math.min(100, filtered.length * 12),    detail: `Filtered from ${pool.length} total ${profile.sector} postings` },
    { label: `Top match score ${topMatch}%`,                                     impact: topMatch >= 85 ? 'positive' : 'neutral', weight: topMatch,    detail: 'Cosine similarity between your skills and JD requirements' },
    { label: `Average match score ${avgMatch}%`,                                  impact: avgMatch >= 75 ? 'positive' : 'neutral', weight: avgMatch,    detail: 'Across all matched roles in your target markets' },
    { label: `Ghost job rate ~${ghostRate}%`,                                     impact: 'negative', weight: ghostRate,                                detail: '~1 in 7 postings yields no response — apply direct' },
  ];

  const suggestedActions: SuggestedAction[] = [
    { action: 'Apply directly via company careers pages — 2.8× better conversion than job boards', priority: 'high', timeframe: 'This week', link: '/jobs', linkLabel: 'View All Jobs' },
    { action: filtered.length < 4 ? `Expand target countries to find more matches` : `Focus on the top-${Math.min(3, filtered.length)} matched roles first`, priority: 'medium', timeframe: 'Weeks 1–2' },
  ];

  return {
    score: avgMatch, probability: topMatch, confidence,
    reasoning: `Found ${filtered.length} matched roles in your target market(s). Top match: ${topMatch}% (${filtered[0]?.title ?? 'N/A'} at ${filtered[0]?.company ?? 'N/A'}). Average match across all roles: ${avgMatch}%.`,
    contributingFactors: factors, riskLevel: riskTier, suggestedActions,
    jobs: filtered, avgSalary, ghostRate,
  };
}
