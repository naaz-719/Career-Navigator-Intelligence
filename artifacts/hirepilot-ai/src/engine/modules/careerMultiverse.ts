// ─── Intelligence Module: Career Multiverse ───────────────────────────────────
// Backend seam: replace the entire function body with:
//   return fetch('/api/intelligence/multiverse', { method: 'POST', body: JSON.stringify(profile) }).then(r => r.json())

import type { AppProfile } from '@/context/ProfileContext';
import type { IntelligenceResult, Factor, SuggestedAction, RiskTier } from '../types';
import { SHORT_COUNTRY, computeBaseHireProbability } from '../data';

export interface MultiverseScenario {
  id: number;
  title: string;
  description: string;
  probability: number;
  salaryImpact: string;
  timeframe: string;
  risk: 'Low' | 'Medium' | 'High';
  pros: string[];
  cons: string[];
  tag: string;
  tagColor: string;
}

export interface CareerMultiverseResult extends IntelligenceResult {
  scenarios: MultiverseScenario[];
}

export function computeCareerMultiverse(profile: AppProfile): CareerMultiverseResult {
  const baseProb    = computeBaseHireProbability(profile.yearsExperience, profile.skills.length);
  const topCountry  = SHORT_COUNTRY[profile.targetCountries[0] ?? 'United Arab Emirates'] ?? 'UAE';
  const sec2        = SHORT_COUNTRY[profile.targetCountries[1] ?? 'Saudi Arabia'] ?? 'KSA';
  const targetK     = Math.round(profile.targetSalary / 1000);
  const currentK    = Math.round(profile.currentSalary / 1000);
  const upK         = Math.round(profile.targetSalary * 1.25 / 1000);
  const delta       = Math.round(((profile.targetSalary - profile.currentSalary) / profile.currentSalary) * 100);
  const tier        = profile.yearsExperience >= 10 ? 'VP/Director' : profile.yearsExperience >= 7 ? 'Senior Lead' : 'Mid-level Lead';
  const nextTier    = profile.yearsExperience >= 10 ? 'C-Suite / Partner' : profile.yearsExperience >= 7 ? 'VP/Director' : 'Senior Lead';

  const scenarios: MultiverseScenario[] = [
    {
      id: 1,
      title: `${tier} → ${topCountry} ${profile.sector}`,
      description: `Lateral move to a ${topCountry}-based ${profile.sector} company at your current seniority level. Highest probability path — leverages your existing track record and minimises transition friction.`,
      probability: Math.round(Math.min(92, baseProb + 3)),
      salaryImpact: `+${delta}% → AED ${targetK}K/mo`,
      timeframe: '6–10 weeks',
      risk: 'Low',
      pros: [`${topCountry} is your highest-probability market`, 'Lateral move — immediate productivity', 'Employment Visa sponsorship straightforward'],
      cons: ['No seniority jump — career ceiling unchanged', 'Competitive market — 8–15 applicants per role at this level'],
      tag: 'Recommended',
      tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      id: 2,
      title: `${tier} → ${nextTier} Promotion Track`,
      description: `Aim for a seniority jump to ${nextTier} level in ${topCountry} — higher upside but longer search cycle and stricter eligibility requirements.`,
      probability: Math.round(Math.min(78, baseProb - 10)),
      salaryImpact: `+35–55% → AED ${upK}K+/mo`,
      timeframe: '10–18 weeks',
      risk: 'Medium',
      pros: ['Significant salary jump', 'Opens leadership track', `${nextTier} roles are less competed than ${tier}`],
      cons: ['Requires strong case study preparation', 'Longer time-to-hire', 'Many JDs require existing title match'],
      tag: 'High Upside',
      tagColor: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    },
    {
      id: 3,
      title: `Parallel ${sec2} Track`,
      description: `Run a concurrent search in ${sec2} alongside ${topCountry} to create competitive tension and compress offer timelines by 20–30%.`,
      probability: Math.round(Math.min(82, baseProb - 5)),
      salaryImpact: `+${Math.round(delta * 0.85)}% → AED ${Math.round(targetK * 0.92)}K/mo`,
      timeframe: '7–12 weeks',
      risk: 'Low',
      pros: ['Creates competitive tension — accelerates UAE offers', `${sec2} Vision 2030 driving strong ${profile.sector} demand`, 'Multiple active offers = negotiating power'],
      cons: ['${sec2} may require location flexibility', 'Higher upfront effort — two markets simultaneously'],
      tag: 'Smart Strategy',
      tagColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    {
      id: 4,
      title: `${profile.sector} → Adjacent Sector Pivot`,
      description: `Leverage your ${profile.sector} expertise to transition into an adjacent high-growth sector (FinTech, PropTech, HealthTech) where cross-sector candidates earn a 15–25% premium.`,
      probability: Math.round(Math.min(65, baseProb - 18)),
      salaryImpact: `+25–40% → AED ${Math.round(targetK * 1.20)}K+/mo`,
      timeframe: '12–20 weeks',
      risk: 'High',
      pros: ['Premium salary for cross-sector expertise', 'Less direct competition — niche candidate pool', 'GCC rapidly developing adjacent sectors'],
      cons: ['Longer search due to niche positioning', 'Requires rethinking resume narrative', 'Higher interview bar — must prove sector relevance'],
      tag: 'Bold Move',
      tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    {
      id: 5,
      title: 'Stay & Negotiate Current Role',
      description: `Use external offers as leverage to negotiate a promotion or salary increase at your current employer. Effective when the market probability is high but the move involves personal disruption.`,
      probability: Math.round(Math.min(85, baseProb + 8)),
      salaryImpact: `+10–20% → AED ${Math.round(currentK * 1.15)}K/mo`,
      timeframe: '4–8 weeks',
      risk: 'Low',
      pros: ['No relocation cost', 'Preserves relationships and domain knowledge', 'Fastest path to a salary increase'],
      cons: ['No market exposure — miss on career growth signals', 'Ceiling capped by current employer\'s band', 'Risk of counter-offer not matching market rate'],
      tag: 'Leverage Play',
      tagColor: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    },
  ];

  const best        = scenarios[0]!;
  const riskTier: RiskTier = best.risk === 'Low' ? 'low' : 'medium';
  const confidence  = Math.min(88, 68 + profile.yearsExperience);

  const factors: Factor[] = [
    { label: `Base hire probability (${Math.round(baseProb)}%)`,               impact: 'positive', weight: Math.round(baseProb),     detail: 'Estimated across your top target market' },
    { label: `${profile.yearsExperience} years experience`,                     impact: 'positive', weight: Math.min(100, profile.yearsExperience * 8), detail: 'Senior-band candidates unlock more scenario paths' },
    { label: `${profile.skills.length} skills indexed`,                          impact: 'positive', weight: Math.min(100, profile.skills.length * 15), detail: 'More skills = broader scenario eligibility' },
    { label: `Target: +${delta}% salary uplift`,                                 impact: delta <= 30 ? 'positive' : 'neutral', weight: Math.min(80, delta), detail: `${delta <= 30 ? 'Achievable in most scenarios' : 'Aggressive but achievable on promotion track'}` },
  ];

  const suggestedActions: SuggestedAction[] = [
    { action: `Start with Scenario 1 and Scenario 3 in parallel — highest expected value`, priority: 'high',   timeframe: 'This week', link: '/jobs', linkLabel: 'View Jobs' },
    { action: 'Use external offers from Scenario 3 as leverage in Scenario 5',             priority: 'medium', timeframe: 'Weeks 4–8' },
    { action: `Run AI Decision Engine for a full probability model across all scenarios`,   priority: 'medium', timeframe: 'Today', link: '/ai-decision-engine', linkLabel: 'Run Analysis' },
  ];

  return {
    score: Math.round(best.probability), probability: Math.round(best.probability), confidence,
    reasoning: `5 parallel career paths modelled for a ${profile.nationality} ${tier} in ${profile.sector}. Highest probability: ${best.title} at ${best.probability}% within ${best.timeframe}. Best risk-adjusted path combines Scenario 1 (lateral) with Scenario 3 (parallel market) for maximum optionality.`,
    contributingFactors: factors, riskLevel: riskTier, suggestedActions,
    scenarios,
  };
}
