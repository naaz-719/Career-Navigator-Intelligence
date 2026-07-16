// ─── AI Decision Engine — Reasoning Service ──────────────────────────────────
// This file is the ONLY backend seam. Replace each simulate* function with a
// real streaming API call and the rest of the UI adapts automatically.
// All types are imported from components/decision-engine/types.ts.

import type {
  UserProfile,
  ReasoningModule,
  ModuleId,
  DecisionResult,
  CountryAnalysis,
  SalaryAnchor,
} from '@/components/decision-engine/types';

// ─── Module Definitions ──────────────────────────────────────────────────────

export const MODULE_DEFINITIONS: Omit<ReasoningModule, 'status' | 'thoughts' | 'summary' | 'durationMs'>[] = [
  { id: 'profile',        name: 'Profile Analysis',      icon: 'UserCheck',  description: 'Parsing professional identity, skills matrix & career trajectory' },
  { id: 'policy',         name: 'Policy Engine',         icon: 'Scale',      description: 'Checking visa regulations, nationalization quotas & compliance rules' },
  { id: 'salary',         name: 'Salary Engine',         icon: 'Banknote',   description: 'Benchmarking compensation against live market percentiles' },
  { id: 'market',         name: 'Market Intelligence',   icon: 'TrendingUp', description: 'Scanning live job demand, ghost job ratio & hiring velocity' },
  { id: 'eligibility',    name: 'Eligibility Engine',    icon: 'ShieldCheck',description: 'Assessing sponsor likelihood, visa pathways & employer fit' },
  { id: 'recommendation', name: 'Recommendation Engine', icon: 'Sparkles',   description: 'Synthesising all signals into an explainable recommendation' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function tier(yrs: number): string {
  if (yrs >= 12) return 'Principal / VP';
  if (yrs >= 8)  return 'Senior / Lead';
  if (yrs >= 4)  return 'Mid-level';
  return 'Junior';
}

function sectorShort(sector: string): string {
  const map: Record<string, string> = {
    'Finance & Banking': 'FinTech/Finance',
    'Energy & Oil & Gas': 'Energy',
    'Construction & Real Estate': 'Real Estate',
    'Retail & E-commerce': 'Retail/E-com',
    'Telecommunications': 'Telecom',
  };
  return map[sector] ?? sector;
}

function topSkills(skills: string[], n = 3): string {
  return skills.slice(0, n).join(', ') + (skills.length > n ? ` +${skills.length - n} more` : '');
}

const NATIONALIZATION_RISK: Record<string, Record<string, string>> = {
  'United Arab Emirates': { Technology: 'Low', 'Finance & Banking': 'Medium', default: 'Low-Medium' },
  'Saudi Arabia':         { Technology: 'Medium', 'Finance & Banking': 'High', default: 'High' },
  'Qatar':                { default: 'Low-Medium' },
  'Oman':                 { default: 'Medium-High' },
  'Kuwait':               { default: 'High' },
  'Bahrain':              { default: 'Low' },
};

function getNatRisk(country: string, sector: string): string {
  const entry = NATIONALIZATION_RISK[country] ?? {};
  return entry[sector] ?? entry['default'] ?? 'Medium';
}

const TIME_TO_HIRE: Record<string, string> = {
  Technology:                   '5–9 weeks',
  'Finance & Banking':         '8–14 weeks',
  Healthcare:                   '6–12 weeks',
  'Energy & Oil & Gas':        '10–18 weeks',
  'Construction & Real Estate': '8–16 weeks',
  'Retail & E-commerce':       '4–8 weeks',
  Telecommunications:           '7–13 weeks',
};

const JOB_COUNT_BASE: Record<string, number> = {
  Technology: 9200, 'Finance & Banking': 5400, Healthcare: 4100,
  'Energy & Oil & Gas': 3800, 'Construction & Real Estate': 6200,
  'Retail & E-commerce': 3400, Telecommunications: 2900,
};

// ─── Per-module thought generators ──────────────────────────────────────────

function getProfileThoughts(p: UserProfile): string[] {
  const t = tier(p.yearsExperience);
  const highlightSkills = topSkills(p.skills);
  const gapFromSenior = p.yearsExperience < 8 ? ` — ${8 - p.yearsExperience} yrs to Senior tier` : ' — at Senior threshold';
  return [
    `Parsing professional identity → ${p.nationality} national · ${p.visaStatus}`,
    `Experience: ${p.yearsExperience} yrs → classified as "${t}" across GCC benchmarks${gapFromSenior}`,
    `Sector mapping: ${p.sector} → loading ${sectorShort(p.sector)} GCC demand indices…`,
    `Skills indexed: [${highlightSkills}] → cross-referencing against top 500 GCC job descriptions…`,
    `Education: ${p.education} → validating against GCC MOE / MOFA equivalency registry…`,
    `Current role "${p.currentRole}" → extracting competency signals and seniority markers…`,
    `Career objective: "${p.careerGoal}" → aligning ${p.targetCountries.join(', ')} shortlist to goal vector…`,
    `Visa status: ${p.visaStatus} → computing transition friction and mobility score…`,
    `Profile quality score: ${p.skills.length >= 6 ? 'HIGH' : p.skills.length >= 3 ? 'MEDIUM' : 'LOW'} · ${p.skills.length} skills · ${p.yearsExperience} yrs · ${p.education}`,
  ];
}

function getPolicyThoughts(p: UserProfile): string[] {
  const countries = p.targetCountries.length > 0 ? p.targetCountries.join(', ') : 'UAE, KSA, Qatar';
  const hasUAE = countries.includes('United Arab Emirates') || countries.includes('UAE');
  const hasKSA = countries.includes('Saudi Arabia');
  const hasQatar = countries.includes('Qatar');
  return [
    `Loading current employment regulations for: ${countries}…`,
    hasUAE
      ? `UAE — Emiratisation check for ${p.sector}: ${p.sector === 'Technology' ? 'AI/Tech roles largely quota-exempt through Dec 2026' : 'Standard Emiratisation targets apply (NAFIS program active)'}`
      : `Checking bilateral employment treaty status for ${p.nationality} nationals…`,
    hasKSA
      ? `KSA — Saudisation (Nitaqat) band for ${p.sector}: ${p.sector === 'Technology' ? 'Platinum band — Vision 2030 expat-specialist exemptions active' : 'Gold/Green band — nationalization pressure rising in 2025'}`
      : `Qatar — Post-World Cup labour policy: worker welfare reforms stable, hiring positive`,
    hasQatar
      ? `Qatar — Kafala reform: employer mobility now improved; No-Objection Certificate requirement eased`
      : `Bahrain/Oman/Kuwait — checking jurisdiction-specific quota thresholds…`,
    `Nationality factor for ${p.nationality}: ${['Egyptian', 'Indian', 'Pakistani', 'Jordanian', 'Lebanese'].includes(p.nationality) ? 'Strong bilateral employment frameworks active — fast-track processing available' : 'Standard employment processing pathway applies'}`,
    `Checking ban history, blacklist databases, and labour court records… No adverse records found`,
    `Golden Visa eligibility check — UAE income threshold AED 30K/mo: ${p.targetSalary >= 30000 ? '✓ ELIGIBLE at target salary' : `✗ ${Math.round((30000 - p.targetSalary) / 1000)}K below threshold — negotiate upward`}`,
    `Policy compliance matrix compiled — Primary market risk: ${getNatRisk(p.targetCountries[0] ?? 'United Arab Emirates', p.sector)}`,
  ];
}

function getSalaryThoughts(p: UserProfile): string[] {
  const targetK   = Math.round(p.targetSalary / 1000);
  const currentK  = Math.round(p.currentSalary / 1000);
  const delta     = Math.round(((p.targetSalary - p.currentSalary) / p.currentSalary) * 100);
  const p50       = Math.round(p.targetSalary * 0.87 / 1000);
  const p75       = Math.round(p.targetSalary * 1.03 / 1000);
  const p90       = Math.round(p.targetSalary * 1.18 / 1000);
  const anchor    = Math.round(p.targetSalary * 1.15 / 1000);
  const feasLabel = delta <= 20 ? 'HIGH' : delta <= 40 ? 'MEDIUM' : 'CHALLENGING';
  return [
    `Querying ${sectorShort(p.sector)} salary benchmarks: ${p.currentRole} × GCC × ${p.yearsExperience} yrs experience…`,
    `Current baseline: AED ${currentK}K/mo → establishing negotiation floor…`,
    `Target ask: AED ${targetK}K/mo (+${delta > 0 ? delta : 0}% uplift) → computing market feasibility…`,
    `UAE ${sectorShort(p.sector)} P50 for ${p.yearsExperience}-yr tier: AED ${p50}K/mo`,
    `UAE P75: AED ${p75}K/mo · P90: AED ${p90}K/mo → your target sits at ~${delta <= 15 ? '65th' : delta <= 30 ? '76th' : '88th'} percentile`,
    `KSA: Tax-equivalent parity ~91% of UAE benchmark (no income tax, but lower nominal rates)`,
    `Qatar: Premium outlier — P75 runs 110–115% of UAE for ${p.sector} specialists`,
    `Negotiation anchor recommendation: Open at AED ${anchor}K/mo → expect counter at ${Math.round(targetK * 0.94)}–${Math.round(targetK * 0.98)}K`,
    `Salary feasibility: ${feasLabel} · 0% income tax across all GCC — gross equals net`,
  ];
}

function getMarketThoughts(p: UserProfile): string[] {
  const base     = JOB_COUNT_BASE[p.sector] ?? 5000;
  const ghost    = Math.round(base * 0.314);
  const legit    = base - ghost;
  const velocity = p.sector === 'Technology' ? 24 : p.sector === 'Healthcare' ? 18 : p.sector === 'Finance & Banking' ? 12 : 10;
  const aiSkills = p.skills.some(s => ['python', 'ai', 'ml', 'machine learning', 'cloud', 'aws', 'azure', 'llm'].includes(s.toLowerCase()));
  return [
    `Scanning live GCC job boards — ${p.sector} sector filter active…`,
    `Total ${p.sector} postings found: ${base.toLocaleString()} across LinkedIn, Bayt, GulfTalent, Naukrigulf…`,
    `Ghost job detection — analysing repost frequency, posting age, company response rates…`,
    `Ghost job ratio: 31.4% → ${ghost.toLocaleString()} filtered out → ${legit.toLocaleString()} legitimate active roles remain`,
    `YoY hiring velocity: +${velocity}% in UAE ${sectorShort(p.sector)}, +${Math.round(velocity * 0.75)}% in KSA, +${Math.round(velocity * 0.46)}% in Qatar`,
    aiSkills
      ? `Skills signal: AI/Cloud skills detected → profile aligns with TOP-DEMAND cluster (3× recruiter inbound)`
      : `Skills signal: "${p.skills[0]}" in steady-demand band → consistent recruiter contact expected`,
    `Employer sentiment: ${p.sector} GCC layoff index at 2.1% — well below global tech average of 6.4%`,
    `Hot companies for ${sectorShort(p.sector)}: cross-referencing current headcount expansion plans…`,
    `Market intelligence scan complete — Demand rating: ${velocity >= 18 ? 'STRONG' : 'STEADY'}`,
  ];
}

function getEligibilityThoughts(p: UserProfile): string[] {
  const jdMatch   = Math.min(95, 58 + p.yearsExperience * 3 + (p.skills.length >= 6 ? 6 : 2));
  const sponsors  = Math.round(650 + p.yearsExperience * 25);
  const sponsProb = Math.min(92, 52 + p.yearsExperience * 3 + (p.skills.length >= 5 ? 5 : 0));
  const needsNOC  = p.visaStatus === 'Employment Visa';
  return [
    `Computing sponsor probability for ${p.nationality} × ${sectorShort(p.sector)}…`,
    `Identifying employers with proven ${p.nationality} hire history + active headcount…`,
    `UAE: ${sponsors} companies matched — sponsor conversion rate >60% for your profile tier`,
    `Running JD cosine-similarity against your skills: [${topSkills(p.skills)}]…`,
    `Average JD match score: ${jdMatch}% — ${jdMatch >= 85 ? 'EXCELLENT' : jdMatch >= 72 ? 'STRONG' : 'GOOD'} fit for Senior-band roles`,
    needsNOC
      ? `Visa flag: Employment Visa → employer NOC required — negotiate Article 17 release clause before resigning`
      : `Visa status: ${p.visaStatus} → clean mobility — no NOC friction, immediate transfer eligible`,
    p.targetSalary >= 30000
      ? `✓ UAE Golden Visa: ELIGIBLE — 10-yr residency, employer-independent once sponsored`
      : `⚠ Golden Visa: ${Math.round((30000 - p.targetSalary) / 1000)}K below AED 30K threshold — counter-offer strategy recommended`,
    `Sponsor conversion probability: ${sponsProb}% within a 90-day active application window`,
    `Eligibility pathway: ${p.targetSalary >= 30000 && p.yearsExperience >= 6 ? 'PREMIUM — Golden Visa + Direct Placement' : 'STANDARD — Employment Visa + Sponsorship'}`,
  ];
}

function getRecommendationThoughts(p: UserProfile): string[] {
  const hirePct = computeHireProbability(p);
  const primary = p.targetCountries[0] ?? 'United Arab Emirates';
  return [
    `Aggregating outputs from 5 upstream modules — Profile, Policy, Salary, Market, Eligibility…`,
    `Signal weighting: Eligibility (30%) × Market (25%) × Salary (20%) × Policy (15%) × Profile (10%)`,
    `Computing weighted hire probability → raw score: ${hirePct.toFixed(1)}%`,
    `Running Monte Carlo simulation across 10,000 application scenarios…`,
    `Scenario outcome distribution: P10=${Math.round(hirePct * 0.65)}% · P50=${Math.round(hirePct)}% · P90=${Math.round(Math.min(97, hirePct * 1.22))}%`,
    `Country preference ranking: ${p.targetCountries.slice(0, 3).join(' > ') || 'UAE > KSA > Qatar'} based on hire probability × salary match`,
    `Generating 6 prioritised next steps with urgency × ROI weighting…`,
    `Calibrating confidence score against ${p.skills.length + p.yearsExperience}-point profile completeness…`,
    `Synthesis complete. Primary market: ${primary} · Hire probability: ${Math.round(hirePct)}% · Confidence: ${computeConfidence(p)}%`,
  ];
}

// ─── Result Generation Helpers ───────────────────────────────────────────────

function computeHireProbability(p: UserProfile): number {
  const base        = 48;
  const expScore    = Math.min(20, p.yearsExperience * 2.2);
  const skillScore  = Math.min(15, p.skills.length * 1.8);
  const sectScore   = p.sector === 'Technology' || p.sector === 'Healthcare' ? 8 : 4;
  const salaryDebt  = Math.max(0, Math.round(((p.targetSalary - p.currentSalary) / p.currentSalary) * 100) - 30) * 0.12;
  const eduScore    = p.education.includes('Master') || p.education.includes('MBA') || p.education.includes('PhD') ? 5 : 0;
  return Math.min(96, base + expScore + skillScore + sectScore + eduScore - salaryDebt);
}

function computeConfidence(p: UserProfile): number {
  const completeness = [
    p.currentRole.length > 0,
    p.skills.length >= 3,
    p.targetCountries.length > 0,
    p.currentSalary > 0,
    p.targetSalary > 0,
    p.nationality.length > 0,
    p.yearsExperience > 0,
    p.question.length > 20,
  ].filter(Boolean).length;
  return Math.min(94, 60 + completeness * 4 + Math.min(p.yearsExperience, 8));
}

function buildSalaryAnchor(p: UserProfile): SalaryAnchor {
  const askPrice      = Math.round(p.targetSalary * 1.15);
  const targetPrice   = p.targetSalary;
  const expectedOffer = Math.round(p.targetSalary * 0.93);
  const walkaway      = Math.round(Math.max(p.currentSalary * 1.1, p.targetSalary * 0.82));
  const askK          = Math.round(askPrice / 1000);
  const targetK       = Math.round(targetPrice / 1000);
  const expectedK     = Math.round(expectedOffer / 1000);
  const walkK         = Math.round(walkaway / 1000);

  return {
    askPrice,
    targetPrice,
    expectedOffer,
    walkaway,
    negotiationScript:
      `"Based on my ${p.yearsExperience} years in ${sectorShort(p.sector)} and the current GCC market, ` +
      `I'm targeting AED ${askK}K/mo. I understand your bands, and I'm flexible — ` +
      `but anything below AED ${walkK}K wouldn't make the move financially viable for my family. ` +
      `If you can get to AED ${targetK}K I'm ready to sign immediately." ` +
      `(Expect a counter at AED ${expectedK}K — push back once, then accept if they reach ${targetK}K.)`,
  };
}

function buildCountryAnalysis(p: UserProfile): CountryAnalysis[] {
  const baseProb = computeHireProbability(p);
  const delta    = Math.round(((p.targetSalary - p.currentSalary) / p.currentSalary) * 100);
  const base     = JOB_COUNT_BASE[p.sector] ?? 5000;

  const ALL_COUNTRIES: CountryAnalysis[] = [
    {
      country: 'United Arab Emirates',
      flag: '🇦🇪',
      hireProbability: Math.min(96, Math.round(baseProb + 6)),
      visaFeasibility: 'High',
      salaryMatch: delta <= 20 ? 96 : delta <= 35 ? 81 : 68,
      nationalizationRisk: p.sector === 'Technology' ? 'Low' : 'Medium',
      demandIndex: 91,
      topEmployers: p.sector === 'Technology'
        ? ['G42', 'Careem', 'Noon', 'Talabat', 'ADNOC Digital']
        : p.sector === 'Finance & Banking'
        ? ['ADCB', 'Emirates NBD', 'FAB', 'Mashreq', 'Abu Dhabi Islamic Bank']
        : ['Emirates Group', 'DP World', 'Majid Al Futtaim', 'ADNOC', 'Mubadala'],
      recommended: true,
      note: 'Strongest market fit. Tech largely Emiratisation-exempt; Golden Visa pathway available.',
      jobCount: Math.round(base * 0.44),
    },
    {
      country: 'Saudi Arabia',
      flag: '🇸🇦',
      hireProbability: Math.min(92, Math.round(baseProb - 2)),
      visaFeasibility: 'High',
      salaryMatch: delta <= 20 ? 89 : delta <= 35 ? 74 : 61,
      nationalizationRisk: p.sector === 'Technology' ? 'Medium' : 'High',
      demandIndex: 85,
      topEmployers: p.sector === 'Technology'
        ? ['Saudi Aramco Digital', 'STC', 'stc pay', 'NEOM', 'Elm']
        : p.sector === 'Finance & Banking'
        ? ['Al Rajhi Bank', 'SNB', 'Riyad Bank', 'STC Pay', 'Saudi Payments']
        : ['Saudi Aramco', 'Saudi Electricity', 'SABIC', 'NEOM', 'PIF'],
      recommended: p.yearsExperience >= 6,
      note: 'Vision 2030 driving strong expat specialist demand. Saudisation active above team-lead level.',
      jobCount: Math.round(base * 0.36),
    },
    {
      country: 'Qatar',
      flag: '🇶🇦',
      hireProbability: Math.min(88, Math.round(baseProb - 7)),
      visaFeasibility: 'Medium',
      salaryMatch: delta <= 25 ? 107 : 91,
      nationalizationRisk: 'Low',
      demandIndex: 74,
      topEmployers: ['Qatar Airways', 'QNB', 'Ooredoo', 'RasGas', 'Ashghal'],
      recommended: p.targetSalary >= 35000,
      note: 'Premium salary market (+10–15% vs UAE). Smaller talent pool — less competition.',
      jobCount: Math.round(base * 0.14),
    },
    {
      country: 'Bahrain',
      flag: '🇧🇭',
      hireProbability: Math.min(84, Math.round(baseProb - 9)),
      visaFeasibility: 'High',
      salaryMatch: delta <= 10 ? 82 : 66,
      nationalizationRisk: 'Low',
      demandIndex: 63,
      topEmployers: ['Alba', 'Batelco', 'BBK', 'Gulf Air', 'Tamkeen'],
      recommended: p.currentSalary <= 18000,
      note: 'Most open labour market in GCC. Lower salaries offset by low cost of living and easy setup.',
      jobCount: Math.round(base * 0.07),
    },
    {
      country: 'Oman',
      flag: '🇴🇲',
      hireProbability: Math.min(80, Math.round(baseProb - 14)),
      visaFeasibility: 'High',
      salaryMatch: delta <= 10 ? 78 : 62,
      nationalizationRisk: 'Medium',
      demandIndex: 57,
      topEmployers: ['OQ', 'Bank Muscat', 'Omantel', 'PDO', 'Civil Aviation'],
      recommended: false,
      note: 'Omanisation targets rising. Suitable for senior specialists in energy and infrastructure.',
      jobCount: Math.round(base * 0.06),
    },
    {
      country: 'Kuwait',
      flag: '🇰🇼',
      hireProbability: Math.min(76, Math.round(baseProb - 18)),
      visaFeasibility: 'Medium',
      salaryMatch: delta <= 10 ? 80 : 63,
      nationalizationRisk: 'High',
      demandIndex: 52,
      topEmployers: ['Kuwait Oil Company', 'NBK', 'Zain', 'Agility', 'Gulf Bank'],
      recommended: false,
      note: 'Kuwaitisation strictest in GCC. Best for public-sector adjacent or oil & gas roles.',
      jobCount: Math.round(base * 0.05),
    },
  ];

  return p.targetCountries.length > 0
    ? ALL_COUNTRIES.filter(c => p.targetCountries.includes(c.country))
    : ALL_COUNTRIES.slice(0, 3);
}

function buildNextSteps(p: UserProfile, hireProbability: number): DecisionResult['nextSteps'] {
  const steps: DecisionResult['nextSteps'] = [];
  let n = 1;

  steps.push({
    step: n++,
    action: 'Optimise LinkedIn for GCC recruiter visibility',
    detail: `Add "Open to Work" (hidden from current employer), set location preference to ${p.targetCountries[0]?.replace('United Arab Emirates', 'UAE') ?? 'UAE'}, and update your headline to include "${p.skills[0] ?? 'your top skill'}" and "${p.skills[1] ?? p.sector}". GCC recruiters source 4× more via LinkedIn than job boards.`,
    urgency: 'High',
    timeframe: 'This week',
  });

  steps.push({
    step: n++,
    action: 'Run Resume Studio ATS optimisation',
    detail: `Your resume needs to pass UAE-specific ATS filters. Key gaps: quantify achievements in AED, add "${p.skills.slice(0, 2).join('" and "')}" as keyword clusters, and restructure for GCC reading norms (photo optional, no DOB required in UAE).`,
    urgency: 'High',
    timeframe: 'This week',
    link: '/resume-studio',
    linkLabel: 'Open Resume Studio',
  });

  steps.push({
    step: n++,
    action: `Target the ${Math.round(650 + p.yearsExperience * 25)} high-conversion UAE sponsors`,
    detail: `We identified companies with >60% sponsorship conversion for ${p.nationality} ${sectorShort(p.sector)} professionals. Apply directly to their careers pages — direct applications convert 2.8× better than job board submissions.`,
    urgency: 'High',
    timeframe: 'Weeks 1–2',
    link: '/jobs',
    linkLabel: 'View Matched Jobs',
  });

  if (p.targetSalary < 30000) {
    steps.push({
      step: n++,
      action: `Negotiate salary to AED 30K+ to unlock UAE Golden Visa`,
      detail: `You're AED ${Math.round((30000 - p.targetSalary) / 1000)}K/mo below the Golden Visa income threshold. A 10-year employer-independent residency changes your negotiating position permanently — worth pushing for even at the cost of a slightly slower offer process.`,
      urgency: 'High',
      timeframe: 'Before accepting any offer',
      link: '/salary-intelligence',
      linkLabel: 'Salary Benchmarks',
    });
  } else {
    steps.push({
      step: n++,
      action: 'Begin UAE Golden Visa documentation',
      detail: `At AED ${Math.round(p.targetSalary / 1000)}K/mo you qualify. Prepare: Emirates ID, educational certificate MOFA attestation, and employment offer letter. File within 30 days of joining. This gives you employer-independent residency for 10 years.`,
      urgency: 'Medium',
      timeframe: 'Upon offer acceptance',
      link: '/relocation',
      linkLabel: 'Relocation Guide',
    });
  }

  steps.push({
    step: n++,
    action: 'Run 3 Interview Coach mock sessions for GCC-style rounds',
    detail: `GCC enterprise interviews: technical screen → case study → culture/values panel. Your ${p.sector} track record needs to translate into quantified impact stories. Practise the "Tell me about a time…" framework with GCC-specific examples.`,
    urgency: 'Medium',
    timeframe: 'Month 1',
    link: '/interview-coach',
    linkLabel: 'Start Practice',
  });

  if (p.targetCountries.length > 1) {
    steps.push({
      step: n++,
      action: `Run parallel ${p.targetCountries[1]?.replace('Saudi Arabia', 'KSA') ?? 'KSA'} track via specialist recruiters`,
      detail: `Engage 3–5 GCC specialist recruiters (Hays, Michael Page, Cooper Fitch, Charterhouse, Jadeer) for ${sectorShort(p.sector)} referrals in your second-choice market. Creates competitive tension and improves primary-market offer speed by ~28%.`,
      urgency: 'Medium',
      timeframe: 'Weeks 2–3',
    });
  }

  steps.push({
    step: n++,
    action: `Assess nationalization exposure in ${p.targetCountries[0]?.replace('United Arab Emirates', 'UAE')?.replace('Saudi Arabia', 'KSA') ?? 'UAE'}`,
    detail: `Your ${p.sector} role in ${p.targetCountries[0] ?? 'UAE'} carries ${getNatRisk(p.targetCountries[0] ?? 'United Arab Emirates', p.sector)} nationalization risk. Run the full analysis to understand quota bands, protected roles, and 3-year exposure trajectory.`,
    urgency: 'Low',
    timeframe: 'Before signing',
    link: '/nationalization',
    linkLabel: 'Check Nat. Risk',
  });

  return steps;
}

// ─── Main Result Generator ────────────────────────────────────────────────────

export function generateResult(p: UserProfile): DecisionResult {
  const hireProbability = Math.round(computeHireProbability(p));
  const confidence      = computeConfidence(p);
  const delta           = Math.round(((p.targetSalary - p.currentSalary) / p.currentSalary) * 100);
  const countryAnalysis = buildCountryAnalysis(p);
  const topCountry      = countryAnalysis.sort((a, b) => b.hireProbability - a.hireProbability)[0]?.country ?? 'United Arab Emirates';
  const topCountryShort = topCountry.replace('United Arab Emirates', 'UAE').replace('Saudi Arabia', 'KSA');
  const salaryAnchor    = buildSalaryAnchor(p);
  const base            = JOB_COUNT_BASE[p.sector] ?? 5000;
  const matchedJobCount = Math.round(base * 0.686); // after ghost filtering

  return {
    question: p.question,
    profile: p,
    primaryRecommendation:
      `Based on your ${p.yearsExperience}-year ${sectorShort(p.sector)} background as a ${p.nationality} national, ` +
      `${topCountryShort} is your highest-probability market with a ${hireProbability}% hire probability. ` +
      `Your target of AED ${Math.round(p.targetSalary / 1000)}K/mo sits at the ` +
      `${delta <= 20 ? '65th' : delta <= 35 ? '76th' : '88th'} percentile for your role tier — ` +
      `${delta <= 30 ? 'achievable with the right positioning' : 'aggressive but precedented for your skills profile'}. ` +
      (p.sector === 'Technology' ? 'Tech roles in UAE are largely Emiratisation-exempt, removing a key expat barrier. ' : '') +
      `${p.targetCountries.length > 1 ? `Run a parallel ${p.targetCountries[1]?.replace('Saudi Arabia', 'KSA') ?? 'KSA'} track to maximise optionality and compress your time-to-offer.` : ''}`,
    hireProbability,
    confidenceScore: confidence,
    topCountry,
    salaryFeasibility: delta <= 20 ? 'High' : delta <= 40 ? 'Medium' : 'Challenging',
    salaryAnchor,
    timeToHireEstimate: TIME_TO_HIRE[p.sector] ?? '6–12 weeks',
    matchedJobCount,
    moduleInsights: [
      {
        moduleId: 'profile',
        headline: `${p.yearsExperience}-yr ${sectorShort(p.sector)} professional — ${tier(p.yearsExperience)} tier`,
        body: `Your profile maps to the ${tier(p.yearsExperience)} tier in GCC markets. ${p.skills.length} skills indexed — "${p.skills[0]}" and "${p.skills[1] ?? p.skills[0]}" are flagged as high-demand signals in ${p.targetCountries[0]?.replace('United Arab Emirates', 'UAE') ?? 'UAE'}. ${p.education} qualification is recognised across all 6 GCC countries.`,
      },
      {
        moduleId: 'policy',
        headline: p.sector === 'Technology' ? `UAE tech sector largely Emiratisation-exempt through 2026` : `Moderate nationalization exposure — target exempt role classifications`,
        body: `${p.nationality} nationals have ${['Egyptian', 'Indian', 'Pakistani'].includes(p.nationality) ? 'strong bilateral employment frameworks' : 'standard employment processing'} in target markets. No adverse visa or labour records detected. ${p.visaStatus === 'Employment Visa' ? 'Your current Employment Visa requires an employer NOC — negotiate an Article 17 release clause before resigning.' : 'Clean visa status — no transfer friction.'}`,
      },
      {
        moduleId: 'salary',
        headline: `AED ${Math.round(p.targetSalary / 1000)}K target is ${delta <= 20 ? 'achievable' : delta <= 40 ? 'competitive' : 'aggressive'} — ${delta <= 20 ? '65th' : delta <= 35 ? '76th' : '88th'} percentile`,
        body: `UAE P50 for your role and experience is AED ${Math.round(p.targetSalary * 0.87 / 1000)}K. Your ${delta}% uplift target is ${delta <= 30 ? 'within normal offer ranges — strong negotiating position' : 'above median but precedented for candidates with premium skills'}. All GCC markets are 0% income tax — your net equals gross.`,
      },
      {
        moduleId: 'market',
        headline: `${matchedJobCount.toLocaleString()} legitimate GCC ${p.sector} roles match your profile today`,
        body: `After ghost-job filtering (31.4% removed), ${matchedJobCount.toLocaleString()} real openings match your profile. ${sectorShort(p.sector)} hiring is up ${p.sector === 'Technology' ? 24 : p.sector === 'Healthcare' ? 18 : 12}% YoY. ${p.skills.some(s => ['python', 'ai', 'cloud', 'aws'].includes(s.toLowerCase())) ? 'AI/Cloud skills align with the top-demand cluster — expect 2–3× higher inbound recruiter contact.' : 'Core skills are in steady demand — consistent inbound recruiter contact expected.'}`,
      },
      {
        moduleId: 'eligibility',
        headline: `${Math.round(650 + p.yearsExperience * 25)} UAE sponsors with ${p.nationality} hire history — ${Math.min(95, 52 + p.yearsExperience * 3 + (p.skills.length >= 5 ? 5 : 0))}% sponsor conversion`,
        body: `JD match score: ${Math.min(95, 58 + p.yearsExperience * 3 + (p.skills.length >= 6 ? 6 : 2))}% (${p.yearsExperience >= 7 ? 'excellent' : 'strong'}). ${p.targetSalary >= 30000 ? '✓ UAE Golden Visa eligible — 10-year employer-independent residency.' : `Golden Visa: AED ${Math.round((30000 - p.targetSalary) / 1000)}K below threshold — negotiate upward.`} ${p.visaStatus === 'Employment Visa' ? 'Negotiate NOC/release clause before resigning.' : 'Clean mobility — no NOC required.'}`,
      },
      {
        moduleId: 'recommendation',
        headline: `${topCountryShort} primary market + ${p.targetCountries[1] ? (p.targetCountries[1].replace('Saudi Arabia', 'KSA').replace('United Arab Emirates', 'UAE')) : 'parallel market'} track — ${hireProbability}% hire probability`,
        body: `Monte Carlo simulation across 10,000 application scenarios returns a ${hireProbability}% hire probability within ${TIME_TO_HIRE[p.sector] ?? '8–12 weeks'} at target salary. Primary: ${topCountryShort} (strongest market fit). ${p.targetCountries.length > 1 ? `Parallel: ${(p.targetCountries[1] ?? '').replace('Saudi Arabia', 'KSA').replace('United Arab Emirates', 'UAE')} (creates competitive tension).` : ''} Confidence: ${confidence}%.`,
      },
    ],
    countryAnalysis: countryAnalysis.sort((a, b) => b.hireProbability - a.hireProbability),
    strengths: [
      `${p.yearsExperience} years progressive experience — ${tier(p.yearsExperience)} tier across all GCC markets`,
      p.skills.some(s => ['python', 'ai', 'machine learning', 'cloud', 'aws', 'azure'].includes(s.toLowerCase()))
        ? `AI/Cloud skills in top-3 GCC demand cluster — 2–3× faster recruiter inbound`
        : `"${p.skills[0] ?? 'Core skill'}" in strong demand across ${p.targetCountries[0]?.replace('United Arab Emirates', 'UAE') ?? 'UAE'} and KSA`,
      `${p.nationality} nationals have well-established GCC employment networks and bilateral frameworks`,
      p.education.includes('Master') || p.education.includes('MBA') || p.education.includes('PhD')
        ? `${p.education} unlocks Senior-band JD eligibility and MOFA attestation fast-track`
        : `${p.education} meets baseline eligibility requirements across all target role tiers`,
      p.targetSalary >= 30000
        ? `Target salary meets UAE Golden Visa threshold — 10-yr employer-independent residency`
        : `Conservative salary target increases offer probability and reduces time-to-hire`,
      `${sectorShort(p.sector)} is a priority growth sector under Vision 2030, UAE Centennial 2071 & Agenda 2031`,
    ],
    risks: [
      p.visaStatus === 'Employment Visa'
        ? `Employment Visa requires employer NOC — negotiate Article 17 release clause before resigning`
        : null,
      delta > 35
        ? `${delta}% salary uplift expectation is above market median — calibrate expectations or negotiate in equity/benefits`
        : null,
      p.targetCountries.includes('Saudi Arabia') && p.sector !== 'Technology'
        ? `Saudisation (Nitaqat) quotas rising in ${p.sector} — confirm sector-specific exemption before applying`
        : null,
      p.yearsExperience < 5
        ? `Sub-5yr experience limits eligibility for Senior/Lead JDs — focus on specialist contributor tracks`
        : null,
      `Ghost job prevalence (31.4%) means 1 in 3 postings yield no response — volume and direct-apply strategy required`,
      `GCC enterprise roles typically require 1–2 in-person interview trips — budget AED ${p.nationality === 'Egyptian' ? '3–5K' : '8–15K'} for travel`,
    ].filter(Boolean) as string[],
    nextSteps: buildNextSteps(p, hireProbability),
    generatedAt: new Date().toISOString(),
  };
}

// ─── Simulation Runner ───────────────────────────────────────────────────────

export interface SimulationCallbacks {
  onModuleStart:    (moduleId: ModuleId) => void;
  onThought:        (moduleId: ModuleId, thought: string) => void;
  onModuleComplete: (moduleId: ModuleId, summary: string) => void;
  onComplete:       (result: DecisionResult) => void;
}

// Slightly varied per-thought delay for a more organic feel
const BASE_DELAY = 380;
const MODULE_PAUSE = 280;

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function runDecisionEngine(
  profile: UserProfile,
  callbacks: SimulationCallbacks,
): Promise<void> {
  const modules: { id: ModuleId; thoughts: string[]; summary: string }[] = [
    {
      id: 'profile',
      thoughts: getProfileThoughts(profile),
      summary: `${tier(profile.yearsExperience)} tier · ${profile.nationality} · ${profile.skills.length} skills indexed · ${profile.education}`,
    },
    {
      id: 'policy',
      thoughts: getPolicyThoughts(profile),
      summary: `${profile.targetCountries[0]?.replace('United Arab Emirates', 'UAE') ?? 'UAE'}: ${getNatRisk(profile.targetCountries[0] ?? 'United Arab Emirates', profile.sector)} risk · Bilateral agreements active · ${profile.targetSalary >= 30000 ? 'Golden Visa eligible' : 'Standard pathway'}`,
    },
    {
      id: 'salary',
      thoughts: getSalaryThoughts(profile),
      summary: `Target AED ${Math.round(profile.targetSalary / 1000)}K/mo — ${Math.round(((profile.targetSalary - profile.currentSalary) / profile.currentSalary) * 100) <= 30 ? 'achievable' : 'aggressive'} · Anchor: AED ${Math.round(profile.targetSalary * 1.15 / 1000)}K · 0% income tax`,
    },
    {
      id: 'market',
      thoughts: getMarketThoughts(profile),
      summary: `${Math.round((JOB_COUNT_BASE[profile.sector] ?? 5000) * 0.686).toLocaleString()} legitimate roles · ${profile.sector === 'Technology' ? '+24%' : '+12%'} YoY · Ghost rate 31.4% filtered`,
    },
    {
      id: 'eligibility',
      thoughts: getEligibilityThoughts(profile),
      summary: `JD match: ${Math.min(95, 58 + profile.yearsExperience * 3 + (profile.skills.length >= 6 ? 6 : 2))}% · ${Math.round(650 + profile.yearsExperience * 25)} sponsors · ${profile.targetSalary >= 30000 ? 'Golden Visa: ELIGIBLE' : 'Standard visa path'}`,
    },
    {
      id: 'recommendation',
      thoughts: getRecommendationThoughts(profile),
      summary: `Analysis complete · ${profile.targetCountries[0]?.replace('United Arab Emirates', 'UAE') ?? 'UAE'} primary · ${Math.round(computeHireProbability(profile))}% hire probability · Confidence ${computeConfidence(profile)}%`,
    },
  ];

  for (const mod of modules) {
    callbacks.onModuleStart(mod.id);
    await delay(MODULE_PAUSE);

    for (const thought of mod.thoughts) {
      callbacks.onThought(mod.id, thought);
      await delay(BASE_DELAY + Math.round(Math.random() * 140));
    }

    callbacks.onModuleComplete(mod.id, mod.summary);
    await delay(MODULE_PAUSE);
  }

  callbacks.onComplete(generateResult(profile));
}
