// ─── Intelligence Module: Career Score ───────────────────────────────────────
// Backend seam: replace the entire function body with:
//   return fetch('/api/intelligence/career-score', { method: 'POST', body: JSON.stringify(profile) }).then(r => r.json())

import type { AppProfile } from '@/context/ProfileContext';
import type { IntelligenceResult, Factor, SuggestedAction, RiskTier } from '../types';
import { MARKET_SKILLS, computeBaseCareerScore, computeBaseHireProbability } from '../data';

export interface CareerScoreResult extends IntelligenceResult {
  careerScore: number;
  interviewReadiness: number;
  timeline: Array<{ year: string; current: number; recommended: number }>;
  skillGaps: Array<{ name: string; gap: number; color: string }>;
}

export function computeCareerScore(profile: AppProfile): CareerScoreResult {
  const careerScore        = computeBaseCareerScore(profile.yearsExperience, profile.skills.length);
  const hireProbability    = computeBaseHireProbability(profile.yearsExperience, profile.skills.length);
  const interviewReadiness = Math.min(90, 48 + profile.skills.length * 5);
  const confidence         = Math.min(94, 70 + profile.skills.length * 2 + (profile.yearsExperience >= 5 ? 8 : 0));

  // Skill gaps against sector market
  const market  = MARKET_SKILLS[profile.sector] ?? MARKET_SKILLS['Technology']!;
  const missing = market.filter(s => !profile.skills.some(ps =>
    ps.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(ps.toLowerCase())
  ));
  const colors    = ['bg-red-500', 'bg-amber-500', 'bg-amber-500', 'bg-yellow-500', 'bg-green-500'];
  const skillGaps = missing.slice(0, 5).map((name, i) => ({
    name,
    gap:   Math.max(22, 88 - i * 14),
    color: colors[i] ?? 'bg-green-500',
  }));

  // Salary trajectory timeline (5 years)
  const yr       = new Date().getFullYear();
  const timeline = [0, 1, 2, 3, 4].map(i => ({
    year:        String(yr + i),
    current:     i === 0 ? profile.currentSalary : Math.round(profile.currentSalary * Math.pow(1.065, i)),
    recommended: i === 0 ? profile.currentSalary : Math.round(Math.max(profile.targetSalary, profile.currentSalary * 1.15) * Math.pow(1.12, i - 1)),
  }));

  // Contributing factors
  const expPts  = Math.min(30, profile.yearsExperience * 3);
  const skillPts = Math.min(8, profile.skills.length);
  const eduBonus = profile.education.includes('Master') || profile.education.includes('MBA') || profile.education.includes('PhD') ? 5 : 0;

  const factors: Factor[] = [
    { label: `Work experience (${profile.yearsExperience} yrs)`, impact: 'positive', weight: Math.round((expPts / 30) * 100), detail: `${profile.yearsExperience} × 3 pts each, capped at 30` },
    { label: `Skills indexed (${profile.skills.length})`,        impact: 'positive', weight: Math.round((skillPts / 8) * 100), detail: `${profile.skills.length} skills × 1 pt each, capped at 8` },
    { label: 'Base profile floor',                                impact: 'positive', weight: 52, detail: 'Everyone starts at 50 — prevents zero-floor bias' },
    ...(eduBonus > 0 ? [{ label: `Education: ${profile.education}`, impact: 'positive' as const, weight: 60, detail: 'Postgraduate degree recognised across GCC MOE/MOFA' }] : []),
    ...(skillGaps.length > 0 ? [{ label: `${skillGaps.length} skill gap(s) vs market demand`, impact: 'negative' as const, weight: 50, detail: `Closing top gaps can add up to ${Math.min(12, skillGaps.length * 2)} pts` }] : []),
  ];

  const riskLevel: RiskTier = careerScore >= 80 ? 'low' : careerScore >= 65 ? 'medium' : 'high';

  const suggestedActions: SuggestedAction[] = skillGaps.length > 0
    ? [
        { action: `Acquire ${skillGaps[0]!.name} certification`, priority: 'high', timeframe: '1–2 months', link: '/career-intelligence', linkLabel: 'View Skill Gaps' },
        ...(skillGaps.length > 1 ? [{ action: `Add ${skillGaps[1]!.name} to your profile`, priority: 'medium' as const, timeframe: '2–3 months' }] : []),
      ]
    : [{ action: 'Keep skills current — GCC benchmarks update quarterly', priority: 'low', timeframe: 'Ongoing' }];

  return {
    score: careerScore, probability: hireProbability, confidence,
    reasoning: `Your career score of ${careerScore}/100 reflects ${profile.yearsExperience} years of ${profile.sector} experience with ${profile.skills.length} indexed skills. ${careerScore >= 80 ? 'Strong profile — above the GCC senior-band threshold.' : `Close ${skillGaps.length} key skill gap(s) to push above 80.`}`,
    contributingFactors: factors,
    riskLevel,
    suggestedActions,
    careerScore, interviewReadiness, timeline, skillGaps,
  };
}
