// ─── Intelligence Module: Resume Score ───────────────────────────────────────
// Backend seam: replace the entire function body with:
//   return fetch('/api/intelligence/resume', { method: 'POST', body: JSON.stringify(profile) }).then(r => r.json())

import type { AppProfile } from '@/context/ProfileContext';
import type { IntelligenceResult, Factor, SuggestedAction, RiskTier } from '../types';
import { TOP_COMPANIES, MARKET_SKILLS } from '../data';

export interface ResumeVersion {
  id: string;
  label: string;
  atsScore: number;
  highlight: string;
  targetCompany: string;
  targetCountry: string;
}

export interface ResumeSuggestion {
  type: 'warning' | 'tip' | 'critical';
  title: string;
  detail: string;
}

export interface ResumeScoreResult extends IntelligenceResult {
  candidateName: string;
  currentRole: string;
  topSkills: string[];
  resumeVersions: ResumeVersion[];
  suggestions: ResumeSuggestion[];
  atsOverallScore: number;
}

export function computeResumeScore(profile: AppProfile): ResumeScoreResult {
  const companies = TOP_COMPANIES[profile.sector] ?? TOP_COMPANIES['Technology']!;
  const market    = MARKET_SKILLS[profile.sector] ?? MARKET_SKILLS['Technology']!;

  const missing = market.filter(s => !profile.skills.some(ps =>
    ps.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(ps.toLowerCase())
  ));

  // Generate resume variants tailored to target companies
  const resumeVersions: ResumeVersion[] = (profile.targetCountries.length > 0
    ? profile.targetCountries.slice(0, 3)
    : ['United Arab Emirates', 'Saudi Arabia', 'Qatar']
  ).map((country, i) => {
    const company    = companies[i] ?? companies[0]!;
    const baseScore  = Math.min(96, 72 + profile.yearsExperience * 2 + (missing.length === 0 ? 8 : -missing.length * 2));
    const atsScore   = Math.min(96, baseScore - i * 3);
    const highlights = [
      `Quantified achievements in AED for ${country.replace('United Arab Emirates', 'UAE').replace('Saudi Arabia', 'KSA')} employers`,
      `"${profile.skills[0] ?? 'Core skill'}" keyword cluster optimised for ${company.name} ATS`,
      `GCC-format: professional photo optional, no DOB required in UAE`,
    ];
    return {
      id:            `v${i + 1}`,
      label:         `${company.name} — ${country.replace('United Arab Emirates', 'UAE').replace('Saudi Arabia', 'KSA')}`,
      atsScore,
      highlight:     highlights[i % highlights.length]!,
      targetCompany: company.name,
      targetCountry: country,
    };
  });

  const atsOverallScore = resumeVersions.length > 0
    ? Math.round(resumeVersions.reduce((s, v) => s + v.atsScore, 0) / resumeVersions.length)
    : 72;

  // Generate smart suggestions
  const suggestions: ResumeSuggestion[] = [
    ...(missing.length > 0 ? [{
      type: 'critical' as const,
      title: `Add ${missing[0]} keyword`,
      detail: `"${missing[0]}" appears in 68%+ of ${profile.sector} JDs in your target markets. Add it as a project bullet, not just a skills list entry.`,
    }] : []),
    {
      type: 'warning',
      title: 'Quantify achievements in AED',
      detail: `Replace percentage metrics with AED/SAR figures — GCC hiring managers respond to monetary impact. Example: "Delivered 15% cost reduction" → "Delivered AED 2.3M cost reduction."`,
    },
    {
      type: 'tip',
      title: 'Add GCC employer NOC note',
      detail: profile.visaStatus === 'Employment Visa'
        ? 'Note "Employment Visa — NOC available upon request" near contact info. Removes a common recruiter objection before the call.'
        : 'Include visa status prominently — clean mobility is a competitive advantage in GCC hiring.',
    },
    ...(profile.yearsExperience >= 7 ? [{
      type: 'tip' as const,
      title: 'Condense to 2 pages',
      detail: `With ${profile.yearsExperience} years of experience, GCC recruiters expect a tight 2-page document. Trim pre-${new Date().getFullYear() - 10} roles to 1–2 bullets each.`,
    }] : []),
  ];

  const riskTier: RiskTier = atsOverallScore >= 85 ? 'low' : atsOverallScore >= 70 ? 'medium' : 'high';
  const confidence          = Math.min(90, 65 + profile.skills.length * 3);

  const factors: Factor[] = [
    { label: `ATS keyword coverage`,          impact: missing.length === 0 ? 'positive' : 'negative', weight: Math.round(((market.length - missing.length) / market.length) * 100), detail: `${market.length - missing.length}/${market.length} market keywords present` },
    { label: `Experience depth (${profile.yearsExperience} yrs)`, impact: 'positive', weight: Math.min(100, profile.yearsExperience * 8), detail: 'Senior-band profiles score higher in ATS algorithms' },
    { label: `Skills indexed (${profile.skills.length})`,          impact: 'positive', weight: Math.min(100, profile.skills.length * 12), detail: 'More indexed skills = more JD matches' },
    ...(profile.visaStatus === 'Employment Visa' ? [{ label: 'NOC required — flag in cover letter', impact: 'neutral' as const, weight: 30, detail: 'Proactive disclosure avoids recruiter hesitation' }] : []),
  ];

  const suggestedActions: SuggestedAction[] = ([
    { action: `Add ${missing.slice(0, 2).join(' and ')} keywords — appear in majority of ${profile.sector} JDs`, priority: 'high'   as const, timeframe: 'Today', link: '/career-intelligence', linkLabel: 'Skill Gap Analysis' },
    { action: 'Quantify top 5 achievements in AED monetary impact',                                               priority: 'high'   as const, timeframe: 'This week' },
    { action: 'Send tailored versions per target company — generic CVs convert 3× worse',                         priority: 'medium' as const, timeframe: 'Per application' },
  ] as SuggestedAction[]).filter(a => missing.length > 0 || !a.action.includes('Add'));

  return {
    score: atsOverallScore, probability: Math.min(88, atsOverallScore + 5), confidence,
    reasoning: `Overall ATS score: ${atsOverallScore}/100. ${resumeVersions.length} tailored resume versions generated for ${profile.targetCountries.slice(0, 3).map(c => c.replace('United Arab Emirates', 'UAE').replace('Saudi Arabia', 'KSA')).join(', ')}. ${missing.length > 0 ? `Adding ${missing.slice(0, 2).join(' and ')} would push the score above 90.` : 'Excellent keyword coverage.'}`,
    contributingFactors: factors, riskLevel: riskTier, suggestedActions,
    candidateName: profile.name, currentRole: profile.currentRole,
    topSkills: profile.skills.slice(0, 5),
    resumeVersions, suggestions, atsOverallScore,
  };
}
