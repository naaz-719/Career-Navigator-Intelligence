// ─── AI Decision Engine — Placeholder Reasoning Service ─────────────────────
// This file is the ONLY backend seam. Replace each module's simulate* function
// with a real API call and the rest of the UI adapts automatically.
// All types are imported from components/decision-engine/types.ts.

import type {
  UserProfile,
  ReasoningModule,
  ModuleId,
  DecisionResult,
  CountryAnalysis,
} from '@/components/decision-engine/types';

// ─── Module Definitions ──────────────────────────────────────────────────────

export const MODULE_DEFINITIONS: Omit<ReasoningModule, 'status' | 'thoughts' | 'summary' | 'durationMs'>[] = [
  {
    id: 'profile',
    name: 'Profile Analysis',
    icon: 'UserCheck',
    description: 'Parsing professional identity, skills matrix & career trajectory',
  },
  {
    id: 'policy',
    name: 'Policy Engine',
    icon: 'Scale',
    description: 'Checking visa regulations, nationalization quotas & compliance rules',
  },
  {
    id: 'salary',
    name: 'Salary Engine',
    icon: 'Banknote',
    description: 'Benchmarking compensation against live market percentiles',
  },
  {
    id: 'market',
    name: 'Market Intelligence',
    icon: 'TrendingUp',
    description: 'Scanning live job demand, ghost job ratio & hiring velocity',
  },
  {
    id: 'eligibility',
    name: 'Eligibility Engine',
    icon: 'ShieldCheck',
    description: 'Assessing sponsor likelihood, visa pathways & employer fit',
  },
  {
    id: 'recommendation',
    name: 'Recommendation Engine',
    icon: 'Sparkles',
    description: 'Synthesising all signals into an explainable recommendation',
  },
];

// ─── Per-module thought generators ──────────────────────────────────────────
// Replace each array with a real streaming API call when backend is ready.

function getProfileThoughts(p: UserProfile): string[] {
  return [
    `Parsing professional profile — ${p.nationality} national detected...`,
    `Experience level: ${p.yearsExperience} yrs → classifying as ${p.yearsExperience >= 8 ? 'Senior' : p.yearsExperience >= 4 ? 'Mid-level' : 'Junior'} tier`,
    `Sector mapping: ${p.sector} → loading domain-specific GCC demand indices...`,
    `Skills matrix: [${p.skills.slice(0, 3).join(', ')}${p.skills.length > 3 ? ` +${p.skills.length - 3} more` : ''}] → cross-referencing with employer JD corpus...`,
    `Education recognition check: ${p.education} → validating against GCC equivalency frameworks...`,
    `Current role: "${p.currentRole}" → extracting implied competency signals...`,
    `Career objective: ${p.careerGoal} → aligning target country shortlist to goal vector...`,
    `Visa status: ${p.visaStatus} → calculating transition friction score...`,
    `Profile analysis complete. Quality score: HIGH`,
  ];
}

function getPolicyThoughts(p: UserProfile): string[] {
  const countries = p.targetCountries.join(', ');
  return [
    `Loading employment regulations for: ${countries}...`,
    `UAE: Checking Emiratisation quota thresholds for ${p.sector} sector...`,
    `UAE: ${p.sector === 'Technology' || p.sector === 'Finance' ? 'Tech/Finance roles partially exempt from Emiratisation targets through 2026' : 'Standard Emiratisation rules apply'}`,
    `KSA: Cross-referencing Saudisation (Nitaqat) band for ${p.sector}...`,
    `KSA: Vision 2030 accelerated-hire exemptions active for expat specialists in priority sectors...`,
    `Qatar: Checking post-World Cup labour market stabilisation policies...`,
    `Evaluating bilateral employment agreements for ${p.nationality} nationals...`,
    `Nationality factor: ${p.nationality === 'Egyptian' || p.nationality === 'Indian' || p.nationality === 'Pakistani' ? 'Strong historical employment track record in GCC' : 'Standard processing pathway'}`,
    `Policy matrix compiled. Compliance score: COMPLIANT`,
  ];
}

function getSalaryThoughts(p: UserProfile): string[] {
  const targetK = Math.round(p.targetSalary / 1000);
  const currentK = Math.round(p.currentSalary / 1000);
  const delta = Math.round(((p.targetSalary - p.currentSalary) / p.currentSalary) * 100);
  return [
    `Querying live salary benchmarks: ${p.currentRole} × ${p.sector} × GCC markets...`,
    `Current salary: AED ${currentK}K/mo → establishing baseline...`,
    `Target salary: AED ${targetK}K/mo (${delta > 0 ? '+' : ''}${delta}% uplift expectation)`,
    `UAE P50 for ${p.yearsExperience}yr ${p.sector} professional: AED ${Math.round(targetK * 0.88)}K/mo`,
    `UAE P75: AED ${Math.round(targetK * 1.05)}K/mo → target is ${delta <= 20 ? 'achievable' : 'aggressive but possible'}`,
    `KSA: Salary parity ~92% of UAE benchmark after tax-equivalence adjustment...`,
    `Qatar: Premium market — P75 runs ~108% of UAE benchmark...`,
    `Tax advantage: UAE/Qatar/KSA are 0% income tax → gross = net`,
    `Salary feasibility: ${delta <= 30 ? 'HIGH' : delta <= 50 ? 'MEDIUM' : 'CHALLENGING'}`,
  ];
}

function getMarketThoughts(p: UserProfile): string[] {
  return [
    `Scanning live job postings across GCC — ${p.sector} sector filter active...`,
    `UAE: 12,847 active ${p.sector} roles detected across 4 major job boards...`,
    `Ghost job detection: Analysing repost frequency, posting age, response rate signals...`,
    `Ghost job ratio: 31.4% — filtering to 8,817 legitimate active roles...`,
    `YoY hiring velocity: +24% in UAE ${p.sector}, +18% in KSA, +11% in Qatar`,
    `Demand spike events: AI/ML, Cloud Infrastructure, Fintech — all trending UP`,
    `Employer sentiment index: ${p.skills.includes('Python') || p.skills.includes('AI') || p.skills.includes('Cloud') ? 'Skills profile aligns with TOP-DEMAND cluster' : 'Skills profile in STEADY-DEMAND band'}`,
    `Layoff risk overlay: ${p.sector} GCC layoff index at 2.1% — significantly below global average`,
    `Market intelligence scan complete. Demand rating: STRONG`,
  ];
}

function getEligibilityThoughts(p: UserProfile): string[] {
  return [
    `Computing employer sponsor probability for ${p.nationality} × ${p.sector}...`,
    `Identifying employers in target countries with proven ${p.nationality} hire history...`,
    `UAE: 847 companies matched with sponsorship conversion rate >60%...`,
    `Checking Golden Visa eligibility — income threshold: AED 30K/mo minimum...`,
    `${p.targetSalary >= 30000 ? '✓ Golden Visa pathway: ELIGIBLE based on target salary' : '⚠ Golden Visa: target salary below AED 30K threshold — standard visa path applies'}`,
    `Skill-to-JD match score: Calculating cosine similarity against top 200 JDs...`,
    `Average JD match: ${Math.min(95, 60 + p.yearsExperience * 3)}% — ${p.yearsExperience >= 7 ? 'EXCELLENT fit' : 'STRONG fit'}`,
    `Visa transition friction: ${p.visaStatus === 'Employment Visa' ? 'Standard transfer — employer NOC may be required' : 'Clean transition — no employer NOC needed'}`,
    `Eligibility assessment complete. Pathway: ${p.targetSalary >= 30000 && p.yearsExperience >= 5 ? 'PREMIUM' : 'STANDARD'}`,
  ];
}

function getRecommendationThoughts(): string[] {
  return [
    `Aggregating outputs from 5 upstream modules...`,
    `Weighting signals: Eligibility (30%) × Market (25%) × Salary (20%) × Policy (15%) × Profile (10%)`,
    `Computing weighted hire probability score...`,
    `Running Monte Carlo simulation across 10,000 application scenarios...`,
    `Generating country preference ranking...`,
    `Identifying top 3 actionable next steps with urgency weighting...`,
    `Building explainable recommendation narrative...`,
    `Confidence calibration: cross-validating with historical outcome data...`,
    `Recommendation synthesis complete.`,
  ];
}

// ─── Result Generator ────────────────────────────────────────────────────────
// Replace this function with: const result = await fetch('/api/decision-engine/analyze', { body: profile })

export function generateResult(profile: UserProfile): DecisionResult {
  const hireProbability = Math.min(
    95,
    55 + profile.yearsExperience * 2.5 + (profile.skills.length > 5 ? 8 : 3)
  );
  const confidence = Math.min(92, 68 + profile.yearsExperience * 1.5);
  const delta = Math.round(((profile.targetSalary - profile.currentSalary) / profile.currentSalary) * 100);

  const countryAnalysis: CountryAnalysis[] = [
    {
      country: 'United Arab Emirates',
      flag: '🇦🇪',
      hireProbability: Math.min(95, hireProbability + 5),
      visaFeasibility: 'High',
      salaryMatch: delta <= 25 ? 94 : 78,
      nationalizationRisk: profile.sector === 'Technology' ? 'Low' : 'Medium',
      demandIndex: 88,
      topEmployers: ['Noon', 'Careem', 'G42', 'ADNOC', 'Emirates Group'],
      recommended: true,
      note: 'Strongest market fit. Tech sector largely Emiratisation-exempt.',
    },
    {
      country: 'Saudi Arabia',
      flag: '🇸🇦',
      hireProbability: Math.min(90, hireProbability - 3),
      visaFeasibility: 'High',
      salaryMatch: delta <= 25 ? 88 : 72,
      nationalizationRisk: profile.sector === 'Technology' ? 'Medium' : 'High',
      demandIndex: 82,
      topEmployers: ['Saudi Aramco', 'STC', 'stc pay', 'Mobily', 'NEOM'],
      recommended: profile.yearsExperience >= 6,
      note: 'Vision 2030 driving strong expat tech demand. Saudisation applies above team-lead level.',
    },
    {
      country: 'Qatar',
      flag: '🇶🇦',
      hireProbability: Math.min(85, hireProbability - 8),
      visaFeasibility: 'Medium',
      salaryMatch: delta <= 30 ? 105 : 90,
      nationalizationRisk: 'Low',
      demandIndex: 72,
      topEmployers: ['Qatar Airways', 'QNB', 'Ooredoo', 'RasGas', 'Ashghal'],
      recommended: profile.targetSalary >= 35000,
      note: 'Premium salary market. Smaller talent pool — less competition, higher compensation.',
    },
    {
      country: 'Oman',
      flag: '🇴🇲',
      hireProbability: Math.min(80, hireProbability - 14),
      visaFeasibility: 'High',
      salaryMatch: delta <= 10 ? 85 : 68,
      nationalizationRisk: 'Medium',
      demandIndex: 58,
      topEmployers: ['OQ', 'Bank Muscat', 'Omantel', 'Civil Aviation', 'PDO'],
      recommended: false,
      note: 'Omanisation targets rising. Suitable for niche senior specialists.',
    },
    {
      country: 'Kuwait',
      flag: '🇰🇼',
      hireProbability: Math.min(78, hireProbability - 16),
      visaFeasibility: 'Medium',
      salaryMatch: delta <= 10 ? 82 : 64,
      nationalizationRisk: 'High',
      demandIndex: 52,
      topEmployers: ['Kuwait Oil Company', 'NBK', 'Zain', 'Agility', 'Gulf Bank'],
      recommended: false,
      note: 'Kuwaitisation strictest in GCC. Best for public-sector adjacent roles.',
    },
    {
      country: 'Bahrain',
      flag: '🇧🇭',
      hireProbability: Math.min(82, hireProbability - 10),
      visaFeasibility: 'High',
      salaryMatch: delta <= 15 ? 80 : 65,
      nationalizationRisk: 'Low',
      demandIndex: 61,
      topEmployers: ['Alba', 'Batelco', 'BBK', 'Gulf Air', 'Tamkeen'],
      recommended: profile.currentSalary <= 20000,
      note: 'Most open labour market in GCC. Lower salaries offset by low cost of living.',
    },
  ].filter((c) =>
    profile.targetCountries.length === 0 || profile.targetCountries.includes(c.country)
  );

  return {
    question: profile.question,
    profile,
    primaryRecommendation: `Based on your ${profile.yearsExperience}-year ${profile.sector} background as a ${profile.nationality} national, the UAE is your highest-probability market. Your target salary of AED ${Math.round(profile.targetSalary / 1000)}K/month is achievable at the 76th percentile for your role tier. ${profile.sector === 'Technology' ? 'The tech sector sits largely outside Emiratisation quotas, removing a key barrier.' : ''} We recommend prioritising UAE applications while running a parallel track in KSA for maximum optionality.`,
    hireProbability: Math.round(hireProbability),
    confidenceScore: Math.round(confidence),
    topCountry: 'United Arab Emirates',
    salaryFeasibility: delta <= 25 ? 'High' : delta <= 45 ? 'Medium' : 'Challenging',
    moduleInsights: [
      {
        moduleId: 'profile',
        headline: `${profile.yearsExperience}-year ${profile.sector} professional — Senior tier`,
        body: `Your profile maps to the Senior/Lead tier in GCC markets. ${profile.skills.length} skills indexed, with ${profile.skills.slice(0, 2).join(' and ')} flagged as high-demand signals. ${profile.education} qualification recognised across all 6 GCC countries.`,
      },
      {
        moduleId: 'policy',
        headline: profile.sector === 'Technology' ? 'UAE tech sector largely Emiratisation-exempt' : 'Moderate nationalization exposure in primary markets',
        body: `${profile.nationality} nationals benefit from strong bilateral employment frameworks in the UAE and KSA. No ban history detected. ${profile.visaStatus === 'Employment Visa' ? 'Current visa status requires employer NOC for UAE-to-UAE transfer — plan for 30–60 day gap or negotiate a release.' : 'Clean visa status — no transfer friction.'}`,
      },
      {
        moduleId: 'salary',
        headline: `Target AED ${Math.round(profile.targetSalary / 1000)}K/mo is ${delta <= 25 ? 'achievable' : 'aggressive'} — ${delta <= 25 ? '76th' : '88th'} percentile`,
        body: `UAE P50 for your role and experience is AED ${Math.round(profile.targetSalary * 0.85 / 1000)}K. Your ${delta}% uplift target is ${delta <= 25 ? 'within normal offer ranges — strong negotiating position' : 'above median but precedented for candidates with your skills profile'}. All GCC markets are 0% income tax — your net = gross.`,
      },
      {
        moduleId: 'market',
        headline: '8,817 legitimate GCC roles match your profile today',
        body: `After ghost-job filtering (31.4% removed), 8,817 real openings match. ${profile.sector} hiring is up 24% YoY in UAE. ${profile.skills.some(s => ['Python', 'AI', 'Machine Learning', 'Cloud', 'AWS', 'Azure'].includes(s)) ? 'Your AI/Cloud skills align with the top-demand cluster — expect 2–3× higher inbound recruiter contact.' : 'Your skills are in steady demand — expect consistent inbound recruiter contact.'}`,
      },
      {
        moduleId: 'eligibility',
        headline: `847 UAE employers have strong sponsorship history for ${profile.nationality} nationals`,
        body: `Your JD match score is ${Math.min(95, 60 + profile.yearsExperience * 3)}% (excellent). ${profile.targetSalary >= 30000 ? '✓ You qualify for the UAE Golden Visa pathway based on target salary — significantly improves residency security.' : 'Consider negotiating to AED 30K+ to unlock Golden Visa eligibility.'} Sponsor conversion probability: ${Math.round(hireProbability * 0.9)}%.`,
      },
      {
        moduleId: 'recommendation',
        headline: `UAE primary market, KSA parallel track — ${Math.round(hireProbability)}% hire probability`,
        body: `Monte Carlo simulation across 10,000 application scenarios returns a ${Math.round(hireProbability)}% hire probability within 3 months at target salary. Primary: UAE (tech-forward, Emiratisation-exempt, golden visa eligible). Parallel: KSA (Vision 2030 premium for specialists). Confidence: ${Math.round(confidence)}%.`,
      },
    ],
    countryAnalysis,
    strengths: [
      `${profile.yearsExperience} years of progressive experience — Senior tier in all GCC markets`,
      profile.skills.some(s => ['Python', 'AI', 'Machine Learning'].includes(s))
        ? 'AI/ML skills are top-3 in-demand across all GCC tech stacks'
        : `${profile.skills[0] || 'Core'} skill in strong demand across UAE and KSA`,
      `${profile.nationality} nationals have well-established GCC employment networks`,
      profile.education.includes('Master') || profile.education.includes('PhD')
        ? 'Postgraduate qualification unlocks senior-band JD eligibility'
        : 'Bachelor\'s degree meets baseline eligibility for all target roles',
      profile.targetSalary >= 30000
        ? 'Target salary meets UAE Golden Visa threshold — strong residency security signal'
        : 'Conservative salary target increases offer probability',
      `${profile.sector} is a priority growth sector under Vision 2030, Agenda 2031, and UAE Centennial 2071`,
    ],
    risks: [
      profile.visaStatus === 'Employment Visa'
        ? 'Employment visa requires employer NOC — negotiate release clause before resigning'
        : null,
      delta > 30
        ? `${delta}% salary uplift expectation is above market median — be prepared to negotiate`
        : null,
      profile.targetCountries.includes('Saudi Arabia') && profile.sector !== 'Technology'
        ? 'Saudisation quotas are rising — confirm sector-specific exemption before applying'
        : null,
      profile.yearsExperience < 5
        ? 'Sub-5yr experience limits eligibility for Senior/Lead JDs — focus on specialist contributor roles'
        : null,
      'Ghost job prevalence (31.4%) means 1 in 3 postings will yield no response — volume strategy required',
      'GCC markets trend toward in-person interview rounds — budget for 1–2 travel trips',
    ].filter(Boolean) as string[],
    nextSteps: [
      {
        step: 1,
        action: 'Optimise LinkedIn for UAE recruiter visibility',
        detail: 'Add "Open to Work" (hidden from current employer), set location preference to UAE, and update your headline to include your top 2 in-demand skills. UAE recruiters search LinkedIn 4× more than job boards.',
        urgency: 'High',
        timeframe: 'This week',
      },
      {
        step: 2,
        action: 'Target the 847 high-conversion UAE sponsors',
        detail: 'We identified 847 UAE companies with >60% sponsorship conversion rates for your profile. Prioritise direct applications to their careers pages over job boards — direct applications convert 2.8× better.',
        urgency: 'High',
        timeframe: 'Weeks 1–2',
      },
      {
        step: 3,
        action: 'Run Resume Studio ATS optimisation',
        detail: 'Your resume needs to pass UAE-specific ATS filters. Run it through Resume Studio to generate a market-tuned version. Key: quantify achievements in AED, add GCC-specific keywords.',
        urgency: 'High',
        timeframe: 'This week',
      },
      {
        step: 4,
        action: profile.targetSalary < 30000
          ? 'Negotiate salary to AED 30K+ for Golden Visa eligibility'
          : 'Begin UAE Golden Visa documentation',
        detail: profile.targetSalary < 30000
          ? 'A AED 30K/mo salary unlocks the UAE Golden Visa — 10-year residency independent of employer. This is a significant negotiating asset worth a targeted push.'
          : 'At your target salary, you qualify for a UAE Golden Visa. Prepare Emirates ID documentation, educational certificate attestation (MOFA), and employment offer letter for filing.',
        urgency: 'Medium',
        timeframe: 'Month 2',
      },
      {
        step: 5,
        action: 'Run parallel KSA track via recruiter outreach',
        detail: 'KSA Vision 2030 is generating premium salaries for expat specialists. Engage 3–5 specialist GCC recruiters (Hays, Michael Page, Cooper Fitch, Charterhouse) for KSA referrals to create competitive tension.',
        urgency: 'Medium',
        timeframe: 'Weeks 2–3',
      },
      {
        step: 6,
        action: 'Run Interview Coach to prepare for GCC-style assessment rounds',
        detail: 'GCC enterprise interviews follow a structured 3-round format with a technical assessment, case study, and culture/values panel. Run 3 mock sessions in Interview Coach calibrated to your target role tier.',
        urgency: 'Low',
        timeframe: 'Month 1–2',
      },
    ],
    generatedAt: new Date().toISOString(),
  };
}

// ─── Simulation runner ───────────────────────────────────────────────────────
// Calls each thought generator with timed delays, yielding module updates.
// Replace with: for await (const chunk of streamDecisionEngine(profile)) { ... }

export interface SimulationCallbacks {
  onModuleStart: (moduleId: ModuleId) => void;
  onThought: (moduleId: ModuleId, thought: string) => void;
  onModuleComplete: (moduleId: ModuleId, summary: string) => void;
  onComplete: (result: DecisionResult) => void;
}

const THOUGHT_DELAY = 420; // ms between thoughts
const MODULE_PAUSE = 300;  // ms between modules

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function runDecisionEngine(
  profile: UserProfile,
  callbacks: SimulationCallbacks
): Promise<void> {
  const modules: { id: ModuleId; thoughts: string[]; summary: string }[] = [
    {
      id: 'profile',
      thoughts: getProfileThoughts(profile),
      summary: `Parsed: ${profile.yearsExperience}yr ${profile.sector} professional · ${profile.nationality} national · ${profile.skills.length} skills indexed`,
    },
    {
      id: 'policy',
      thoughts: getPolicyThoughts(profile),
      summary: `UAE: Low risk · KSA: Medium (Vision 2030 exempt) · Bilateral agreements: Active`,
    },
    {
      id: 'salary',
      thoughts: getSalaryThoughts(profile),
      summary: `Target AED ${Math.round(profile.targetSalary / 1000)}K/mo — ${Math.round(((profile.targetSalary - profile.currentSalary) / profile.currentSalary) * 100) <= 25 ? 'achievable' : 'aggressive'} · 0% income tax across all target markets`,
    },
    {
      id: 'market',
      thoughts: getMarketThoughts(profile),
      summary: `8,817 legitimate openings · UAE hiring +24% YoY · Ghost job rate: 31.4% filtered`,
    },
    {
      id: 'eligibility',
      thoughts: getEligibilityThoughts(profile),
      summary: `JD match: ${Math.min(95, 60 + profile.yearsExperience * 3)}% · 847 high-conversion sponsors · ${profile.targetSalary >= 30000 ? 'Golden Visa: ELIGIBLE' : 'Standard visa pathway'}`,
    },
    {
      id: 'recommendation',
      thoughts: getRecommendationThoughts(),
      summary: `Analysis complete · UAE primary market · ${Math.min(95, Math.round(55 + profile.yearsExperience * 2.5 + (profile.skills.length > 5 ? 8 : 3)))}% hire probability`,
    },
  ];

  for (const mod of modules) {
    callbacks.onModuleStart(mod.id);
    await delay(MODULE_PAUSE);

    for (const thought of mod.thoughts) {
      callbacks.onThought(mod.id, thought);
      await delay(THOUGHT_DELAY);
    }

    callbacks.onModuleComplete(mod.id, mod.summary);
    await delay(MODULE_PAUSE);
  }

  const result = generateResult(profile);
  callbacks.onComplete(result);
}
