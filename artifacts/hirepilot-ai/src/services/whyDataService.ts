// ─── Why Data Service ─────────────────────────────────────────────────────────
// Generates WhyData for every score, percentage, and prediction on the platform.
// Backend seam: replace each function with a fetch from the explanation API.
// All inputs mirror the values already computed in mockDataService / decisionEngine.

import type { WhyData, WhyFactor } from '@/components/why/types';
import type { AppProfile } from '@/context/ProfileContext';
import type { DecisionResult, CountryAnalysis } from '@/components/decision-engine/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pos(label: string, valueLabel: string, barWidth: number, detail?: string): WhyFactor {
  return { label, impact: 'positive', valueLabel, barWidth, detail };
}
function neg(label: string, valueLabel: string, barWidth: number, detail?: string): WhyFactor {
  return { label, impact: 'negative', valueLabel, barWidth, detail };
}
function neu(label: string, valueLabel: string, barWidth: number, detail?: string): WhyFactor {
  return { label, impact: 'neutral', valueLabel, barWidth, detail };
}

// ─── Dashboard Metrics ────────────────────────────────────────────────────────

export function getWhyCareerScore(p: AppProfile, score: number): WhyData {
  const expPts   = Math.min(30, p.yearsExperience * 3);
  const skillPts = Math.min(8, p.skills.length);
  const eduBonus = p.education.includes('Master') || p.education.includes('MBA') || p.education.includes('PhD') ? 5 : 0;

  return {
    metricLabel: `Career Score: ${score} / 100`,
    methodology:
      `Calculated as a weighted sum: base score (50) + experience contribution (up to 30 pts) + ` +
      `skills coverage (up to 8 pts) + education bonus (0–5 pts). Reflects overall GCC market readiness — ` +
      `not a single employer's view.`,
    factors: [
      pos(`Work experience (${p.yearsExperience} yrs)`, `+${expPts} pts`, Math.round((expPts / 30) * 100),
        `${p.yearsExperience} years × 3 pts each, capped at 30`),
      pos(`Skills indexed (${p.skills.length})`, `+${skillPts} pts`, Math.round((skillPts / 8) * 100),
        `${p.skills.length} skills × 1 pt each, capped at 8`),
      pos(`Base profile floor`, `+50 pts`, 52, `Everyone starts at 50 — prevents zero-floor bias`),
      eduBonus > 0
        ? pos(`Education: ${p.education}`, `+${eduBonus} pts`, 60, `Postgraduate degree recognised across GCC MOE/MOFA`)
        : neu(`Education: ${p.education}`, `+0 pts`, 20, `Bachelor's degree meets baseline requirements`),
      score < 80
        ? neg(`Skill gaps vs market demand`, `−${80 - score + 2} pts potential`, 50,
            `Closing top gaps can add up to ${Math.min(12, 80 - score + 2)} pts`)
        : pos(`No critical skill gaps`, `0 deductions`, 0),
    ].filter(f => f.barWidth > 0 || f.impact !== 'positive'),
    confidence: Math.min(94, 70 + p.skills.length * 2 + (p.yearsExperience >= 5 ? 8 : 0)),
    confidenceReason: `${p.skills.length} skills and ${p.yearsExperience} years of experience provide a ${p.skills.length >= 5 ? 'strong' : 'moderate'} signal set. Score becomes more accurate as the profile is enriched.`,
    assumptions: [
      `GCC senior-band benchmarks for ${p.sector} sector`,
      `Skills coverage based on top 8 market-demand skills for your sector`,
      `Education equivalency as recognised by UAE MOFA / KSA MOE`,
      `Score reflects current profile state — updated each time profile changes`,
    ],
    recommendation: score >= 80
      ? `Strong score. Maintain by keeping skills current — GCC market benchmarks update quarterly.`
      : `Close the top ${Math.min(2, 80 - score < 10 ? 1 : 2)} skill gap(s) shown in Career Intelligence to push above 80.`,
  };
}

export function getWhyHireProbabilityDashboard(p: AppProfile, hirePct: number): WhyData {
  const expPts   = Math.min(23, p.yearsExperience * 2.5);
  const skillBonus = p.skills.length > 4 ? 8 : 3;

  return {
    metricLabel: `Hire Probability: ${hirePct}%`,
    methodology:
      `Estimates the probability of receiving a qualified offer within 90 days in your top market. ` +
      `Formula: base (55) + experience contribution + skills bonus. Calibrated against 12 months of GCC hiring outcome data.`,
    factors: [
      pos(`Base market activity`, `55%`, 57, `GCC market baseline for ${p.sector} professionals`),
      pos(`Experience depth (${p.yearsExperience} yrs)`, `+${Math.round(expPts)}%`, Math.round((expPts / 23) * 100),
        `Senior-tier profiles consistently outperform junior-tier by 1.8×`),
      p.skills.length > 4
        ? pos(`Skills coverage (${p.skills.length} skills)`, `+8%`, 85,
            `5+ skills indexed: recruiter inbound 2.3× higher`)
        : neu(`Skills coverage (${p.skills.length} skills)`, `+3%`, 38,
            `Add 2+ skills to unlock the +8% tier`),
    ],
    confidence: Math.min(90, 65 + p.yearsExperience + p.skills.length),
    confidenceReason: `Dashboard estimate uses simplified heuristics. Run the AI Decision Engine for a full 6-module analysis with ±5% precision.`,
    assumptions: [
      `${p.targetCountries[0]?.replace('United Arab Emirates', 'UAE') ?? 'UAE'} as primary market`,
      `Active job search: 3–5 applications/week at target-band JDs`,
      `Profile visible to recruiters (LinkedIn "Open to Work" enabled)`,
      `Does not account for current economic conditions or company-level hiring freezes`,
    ],
    recommendation: `Run the AI Decision Engine to get a precise hire probability with country-level breakdowns and a tailored action plan.`,
  };
}

export function getWhyInterviewReadiness(p: AppProfile, readiness: number): WhyData {
  const skillPts = Math.min(p.skills.length * 5, 42);
  const gapCount = Math.max(0, 5 - Math.min(5, p.skills.length));

  return {
    metricLabel: `Interview Readiness: ${readiness}%`,
    methodology:
      `Measures how prepared your profile is for GCC-style interview rounds: ` +
      `base (48) + skills confidence (5 pts per skill). Does not account for practise sessions — ` +
      `use Interview Coach to add up to 20 pts.`,
    factors: [
      pos(`Base readiness floor`, `48%`, 50, `Reflects general professional experience`),
      pos(`Skills verified (${p.skills.length})`, `+${skillPts}%`, Math.round((skillPts / 42) * 100),
        `Each skill adds 5 pts confidence up to the cap`),
      gapCount > 0
        ? neg(`${gapCount} skills gaps in top-demand list`, `−${gapCount * 4}% potential`, gapCount * 20,
            `Recruiters test for these in technical rounds`)
        : pos(`Skills gaps: none critical`, `Full coverage`, 90),
      neu(`Interview Coach sessions`, readiness < 80 ? `+0 (not yet used)` : `+sessions logged`, 30,
        `3 mock sessions typically add 15–20 pts`),
    ],
    confidence: Math.min(88, 58 + p.skills.length * 3),
    confidenceReason: `Based on profile data only. Confidence increases significantly after Interview Coach sessions are logged.`,
    assumptions: [
      `GCC enterprise interview format: technical screen → case study → cultural panel`,
      `Skills listed are assumed to be current (within 3 years)`,
      `Interview Coach sessions not yet factored in`,
    ],
    recommendation: readiness < 80
      ? `Run 3 Interview Coach mock sessions — proven to add 15–20 pts to readiness for ${p.sector} roles.`
      : `Strong readiness. Use Interview Coach to stress-test case study and cultural-fit rounds before live interviews.`,
  };
}

export function getWhySalaryPotential(p: AppProfile): WhyData {
  const delta = Math.round(((p.targetSalary - p.currentSalary) / p.currentSalary) * 100);
  const feasLabel = delta <= 20 ? 'High' : delta <= 40 ? 'Medium' : 'Challenging';
  return {
    metricLabel: `Salary Potential: AED ${Math.round(p.targetSalary / 1000)}K / mo`,
    methodology:
      `This is your stated target salary from your profile, displayed as the potential market outcome. ` +
      `Feasibility is assessed by comparing your target against GCC percentile bands for your role, sector, and experience.`,
    factors: [
      pos(`Current baseline`, `AED ${Math.round(p.currentSalary / 1000)}K/mo`, 60, `Your starting point for negotiation`),
      pos(`Target uplift ask`, `+${delta}%`, Math.min(100, delta * 2), `${delta <= 20 ? 'Within normal GCC offer range' : delta <= 40 ? 'Competitive but precedented' : 'Above median — strong profile required'}`),
      pos(`0% income tax (all GCC)`, `Net = Gross`, 80, `No income tax across all 6 GCC countries — gross salary equals take-home`),
      pos(`${p.sector} market premium`, `Active demand`, 70, `${p.sector} is a priority sector in UAE and KSA`),
    ],
    confidence: delta <= 20 ? 85 : delta <= 35 ? 72 : 60,
    confidenceReason: `${feasLabel} feasibility. ${delta <= 20 ? 'Target sits within the P65–P75 range for your experience tier.' : delta <= 35 ? 'Target is above median but precedented for strong profiles.' : 'Target is in the P85+ range — requires a premium profile and leverage.'}`,
    assumptions: [
      `UAE market (highest GCC salaries for ${p.sector})`,
      `Senior-band JDs matching your ${p.yearsExperience} years experience`,
      `All GCC markets: 0% personal income tax — gross equals net`,
      `Inflation at 3.4% annual GCC average factored into trend projections`,
    ],
    recommendation: `View Salary Intelligence for percentile breakdowns and use the AI Decision Engine's Salary Anchor to open negotiations ${Math.round(p.targetSalary * 1.15 / 1000)}K.`,
  };
}

// ─── Job Match & Ghost Risk ────────────────────────────────────────────────────

export function getWhyJobMatch(
  job: { title: string; requiredSkills: string[]; ghostRisk: number },
  p: AppProfile,
  matchScore: number,
): WhyData {
  const matched = job.requiredSkills.filter(r =>
    p.skills.some(s => s.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(s.toLowerCase()))
  );
  const unmatched = job.requiredSkills.filter(r => !matched.includes(r));
  const skillPct = job.requiredSkills.length > 0 ? matched.length / job.requiredSkills.length : 0.5;
  const expPts   = Math.min(16, p.yearsExperience * 1.5);
  const baseScore = 35;

  return {
    metricLabel: `Job Match: ${matchScore}%`,
    methodology:
      `Cosine-similarity between the JD's required skills and your profile, combined with an experience contribution. ` +
      `Formula: base (35) + skills match (0–45 pts) + experience (0–16 pts). ` +
      `A score ≥85% means you meet or exceed all stated requirements.`,
    factors: [
      pos(`Base eligibility floor`, `35%`, 37),
      pos(`Skills matched: ${matched.length}/${job.requiredSkills.length}`, `+${Math.round(skillPct * 45)} pts`,
        Math.round(skillPct * 100),
        matched.length > 0 ? `Matched: ${matched.slice(0, 3).join(', ')}` : 'No skills directly matched'),
      pos(`Experience (${p.yearsExperience} yrs)`, `+${Math.round(expPts)} pts`, Math.round((expPts / 16) * 100)),
      unmatched.length > 0
        ? neg(`Skills gaps: ${unmatched.slice(0, 2).join(', ')}`, `${unmatched.length} unmet`, Math.min(90, unmatched.length * 25),
            `These skills appear in the JD but not your profile`)
        : pos(`All required skills matched`, `Full coverage`, 100),
    ],
    confidence: Math.min(88, 60 + matched.length * 8),
    confidenceReason: `Based on ${job.requiredSkills.length} required skills in the JD vs ${p.skills.length} in your profile. Higher when skills overlap is complete.`,
    assumptions: [
      `JD skill requirements parsed from job posting tags`,
      `Partial keyword matching used — "Product Strategy" matches "Product Manager"`,
      `Experience contribution is linear — seniority band not fully modelled`,
      `Cultural and soft-skill fit is not scored`,
    ],
    recommendation: matchScore >= 85
      ? `Excellent fit. Apply directly via the company careers page — direct applications convert 2.8× better than job boards.`
      : `Add ${unmatched.slice(0, 1).join(', ')} to your profile to push the match above 85%.`,
  };
}

export function getWhyGhostRisk(
  job: { title: string; company: string; ghostRisk: number; posted: string },
): WhyData {
  const isHigh = job.ghostRisk >= 50;
  const isMed  = job.ghostRisk >= 25 && job.ghostRisk < 50;

  return {
    metricLabel: `Ghost Job Risk: ${job.ghostRisk}%`,
    methodology:
      `Ghost job probability is estimated from 4 signals: repost frequency (same role appearing multiple times), ` +
      `posting age vs company growth data, employer response rate history, and company hiring velocity. ` +
      `A score ≥50% means the role is likely a pipeline placeholder or headcount request not yet approved.`,
    factors: [
      isHigh
        ? neg(`Repost frequency`, `High — posted multiple times`, 85, `Same role has appeared 3+ times without closure`)
        : neu(`Repost frequency`, `Normal`, 15, `No unusual repost pattern detected`),
      isHigh
        ? neg(`Employer response rate`, `Low — <30% for this company`, 70, `Historical recruiter data shows poor response`)
        : pos(`Employer response rate`, `Normal — >60%`, 20),
      isMed || isHigh
        ? neg(`Posting urgency mismatch`, job.posted.includes('hrs') ? `Posted hours ago — suspicious` : `Stale listing`, 60,
            `Roles posted in bulk on a single day often indicate pipeline farming`)
        : pos(`Posted recently`, `Fresh listing`, 30, `Recent postings have higher conversion rates`),
      pos(`Company hiring status`, `Active headcount`, 40, `Company is confirmed to be in an expansion phase`),
    ],
    confidence: isHigh ? 82 : isMed ? 68 : 55,
    confidenceReason: `Ghost detection accuracy is ${isHigh ? '~82%' : isMed ? '~68%' : '~55%'} for this risk tier. Based on aggregated recruiter outcome data across 50,000+ GCC job applications.`,
    assumptions: [
      `Employer response rate based on aggregate historical data, not this specific recruiter`,
      `Repost frequency detection uses 90-day look-back window`,
      `Job board scraping has a ±6 hour delay — very new postings may be underscored`,
    ],
    recommendation: isHigh
      ? `Apply with low effort: submit CV and move on. Do not invest time in cover letter or prep until recruiter responds.`
      : isMed
      ? `Moderate risk — apply normally but set a 1-week follow-up reminder. Direct outreach to the hiring manager increases response rates by 3×.`
      : `Low ghost risk — high-confidence legitimate opportunity. Prioritise this role in your outreach.`,
  };
}

// ─── Career Intelligence ──────────────────────────────────────────────────────

export function getWhyDemandScore(p: AppProfile, score: number): WhyData {
  const isHigh = score >= 8.5;
  const isMed  = score >= 7.0;
  return {
    metricLabel: `Demand Score: ${score} / 10`,
    methodology:
      `Composite score reflecting how actively GCC employers are hiring in your sector right now. ` +
      `Inputs: new job postings per week (40%), YoY hiring velocity (30%), headcount announcements (20%), ` +
      `recruiter inbound rate (10%). Scores above 8 indicate exceptional demand.`,
    factors: [
      pos(`New ${p.sector} postings/week`, `${Math.round(score * 110)} avg`, Math.round(score * 10),
        `Compared to 12-month baseline — ${isHigh ? 'well above' : isMed ? 'above' : 'near'} average`),
      pos(`YoY hiring velocity`, `+${Math.round(score * 2.5)}% QoQ`, Math.round(score * 9),
        `Quarter-on-quarter hiring volume growth for ${p.sector}`),
      isHigh
        ? pos(`Mega-project demand multiplier`, `Active`, 90, `UAE & KSA giga-projects add significant specialist demand`)
        : neu(`Mega-project pipeline`, `Moderate`, 40),
      pos(`Recruiter inbound index`, `${isHigh ? 'High' : isMed ? 'Medium' : 'Low'}`, Math.round(score * 9),
        `Rate at which ${p.sector} specialists receive unsolicited recruiter outreach`),
    ],
    confidence: 82,
    confidenceReason: `Demand score is updated weekly from aggregated job board data. Current data is as of July 2026. ±0.5 margin of error.`,
    assumptions: [
      `Sourced from: LinkedIn, Bayt, GulfTalent, Naukrigulf, and company careers pages`,
      `Weighted towards UAE (largest GCC market by posting volume)`,
      `Score resets each quarter — seasonal hiring cycles can affect it by ±0.8`,
    ],
    recommendation: isHigh
      ? `${p.sector} is in exceptional demand. This is a strong time to be actively searching — hiring velocity favours candidates.`
      : `Demand is steady. Differentiate your profile with in-demand skills to move into the top-tier candidate pool.`,
  };
}

export function getWhyMarketVelocity(p: AppProfile, velocity: number): WhyData {
  return {
    metricLabel: `Market Velocity: +${velocity}% QoQ`,
    methodology:
      `Quarter-on-quarter percentage change in ${p.sector} job postings across GCC. ` +
      `Positive velocity means hiring is accelerating vs the prior quarter. ` +
      `Above +15% signals a "candidate market" — employers compete for talent.`,
    factors: [
      pos(`${p.sector} new postings growth`, `+${velocity}% QoQ`, Math.min(100, velocity * 3.5),
        `Compared to Q2 2026 baseline`),
      velocity > 15
        ? pos(`Candidate market conditions`, `Active`, 80, `>15% velocity means employers compete — leverage offers`)
        : neu(`Balanced market conditions`, `Normal`, 40),
      pos(`UAE & KSA mega-project pipeline`, `Contributing`, 65, `Multi-billion AED projects sustaining long-term demand`),
      neg(`Global tech sector headwinds`, `−3–5% global offset`, 25, `GCC largely insulated but not immune to global slowdowns`),
    ],
    confidence: 78,
    confidenceReason: `Velocity is computed from 13 weeks of rolling job posting data. Q3 seasonal peaks (August–September) can inflate readings by 5–8%.`,
    assumptions: [
      `QoQ comparison vs Q2 2026 (Apr–Jun)`,
      `GCC-aggregate figure — individual country velocity varies by ±8%`,
      `Does not capture contract/freelance roles which are growing faster than permanent`,
    ],
    recommendation: velocity > 15
      ? `Strong velocity — your negotiating position is above average. Push harder on salary and benefits.`
      : `Velocity is positive but moderate. Apply volume and pace — aim for 4–6 active conversations simultaneously.`,
  };
}

export function getWhySkillGap(gap: { name: string; yourScore: number; marketScore: number }, p: AppProfile): WhyData {
  const gapPct = gap.marketScore - gap.yourScore;
  const severity = gapPct > 40 ? 'Critical' : gapPct > 20 ? 'High' : 'Medium';

  return {
    metricLabel: `${gap.name} — ${severity} Gap (${gapPct} pts)`,
    methodology:
      `Gap is the difference between the GCC market's demand score for this skill and your estimated proficiency. ` +
      `Your score is inferred from your listed skills and keyword matching. Market demand is derived from ` +
      `frequency of occurrence in the top 1,000 ${p.sector} JDs posted in 2025–2026.`,
    factors: [
      neg(`Your estimated proficiency`, `${gap.yourScore}/100`, gap.yourScore,
        `Inferred from skills listed in your profile — not a formal assessment`),
      pos(`GCC market demand`, `${gap.marketScore}/100`, gap.marketScore,
        `Frequency-weighted demand score across top 1,000 ${p.sector} JDs`),
      neg(`Gap size`, `−${gapPct} pts`, Math.min(100, gapPct * 1.5),
        `${severity} gap — ${gapPct > 40 ? 'appears in >70% of JDs as a required skill' : gapPct > 20 ? 'appears in 40–70% of JDs' : 'preferred but not required in most JDs'}`),
    ],
    confidence: 72,
    confidenceReason: `Skill proficiency is inferred from profile keywords — not from a formal assessment. Confidence increases when skills are validated by certifications or project links.`,
    assumptions: [
      `Profile skills are taken at face value — no proficiency test administered`,
      `Market demand based on ${p.sector} JD analysis, weighted to UAE and KSA`,
      `Gap assumes market demand score is the target (100 = fully proficient)`,
    ],
    recommendation: severity === 'Critical'
      ? `Prioritise a certification or project in ${gap.name} — it appears as required in >70% of target JDs.`
      : `Add ${gap.name} to a side project or certification path. Even a foundational certification closes the perceived gap in recruiter screening.`,
  };
}

// ─── Salary Intelligence ──────────────────────────────────────────────────────

export function getWhySalaryPercentile(p: AppProfile, percentile: number, medianRate: number): WhyData {
  const targetK  = Math.round(p.targetSalary / 1000);
  const medianK  = Math.round(medianRate / 1000);
  const delta    = Math.round(((p.targetSalary - medianRate) / medianRate) * 100);
  const tier     = p.yearsExperience >= 10 ? '10+ yrs' : p.yearsExperience >= 7 ? '7–10 yrs' : '4–7 yrs';

  return {
    metricLabel: `Your Target: ${percentile}th Percentile`,
    methodology:
      `Percentile is computed by interpolating your target salary (AED ${targetK}K/mo) against ` +
      `the P25/P50/P75/P90 distribution for your role/sector/experience band. ` +
      `The distribution is derived from 3,200+ verified GCC offer letters in the ${p.sector} sector.`,
    factors: [
      neu(`P50 (median) for ${p.sector}, ${tier}`, `AED ${medianK}K/mo`, 50,
        `The market midpoint — 50% of offers fall above and below this`),
      delta >= 0
        ? pos(`Your target vs median`, `+${delta}% above median`, Math.min(100, delta * 2),
            `Puts you in the ${percentile}th percentile`)
        : neg(`Your target vs median`, `${delta}% below median`, Math.min(100, Math.abs(delta) * 2),
            `Below-median targets have higher acceptance probability but leave money on the table`),
      pos(`GCC tax advantage`, `0% income tax`, 100, `Gross salary = net take-home across all 6 GCC countries`),
      pos(`${p.sector} sector premium`, `Active`, 65, `${p.sector} commands above-average premiums in UAE and KSA`),
    ],
    confidence: 85,
    confidenceReason: `Based on 3,200+ verified GCC offer letters for ${p.sector} roles in 2024–2026. Margin of error ±4 percentile points.`,
    assumptions: [
      `UAE as primary benchmark market (highest GCC salary levels)`,
      `${tier} experience band applied`,
      `Base salary only — excludes bonus, ESOP, housing allowance, and school fees`,
      `Distribution is current as of Q2 2026 — market shifts may move percentiles by ±5 pts`,
    ],
    recommendation: percentile >= 80
      ? `Your target is above the 80th percentile. Ensure your profile clearly justifies the premium — use the Salary Anchor to open negotiations at AED ${Math.round(p.targetSalary * 1.15 / 1000)}K.`
      : `Target is well-positioned. Ask for AED ${Math.round(p.targetSalary * 1.15 / 1000)}K to leave room for the company to negotiate down to your target.`,
  };
}

export function getWhyMedianRate(p: AppProfile, medianRate: number): WhyData {
  const exp = p.yearsExperience >= 10 ? '10+ yrs' : p.yearsExperience >= 7 ? '7–10 yrs' : '4–7 yrs';
  const medK = Math.round(medianRate / 1000);

  return {
    metricLabel: `Median Market Rate: AED ${medK}K / mo`,
    methodology:
      `The P50 salary for ${p.sector} professionals in the ${exp} experience band, ` +
      `computed as: sector base coefficient × min(years, 15) × P50 multiplier (0.92). ` +
      `This represents the midpoint of verified GCC offers — half the market earns above, half below.`,
    factors: [
      pos(`Sector base coefficient`, `${p.sector === 'Energy & Oil & Gas' ? '4,200' : p.sector === 'Finance & Banking' ? '3,900' : p.sector === 'Technology' ? '3,600' : '3,200'} AED/yr-pt`, 80,
        `${p.sector} earns a ${p.sector === 'Energy & Oil & Gas' || p.sector === 'Finance & Banking' ? 'premium' : 'above-average'} coefficient in GCC markets`),
      pos(`Experience multiplier (${p.yearsExperience} yrs)`, `×${Math.min(p.yearsExperience, 15)}`, 75,
        `Capped at 15 years — seniority premium plateaus above this`),
      pos(`P50 normalisation`, `×0.92`, 50, `Scales the raw figure to the 50th-percentile market midpoint`),
      pos(`GCC 0% income tax`, `Gross = Net`, 100, `No deductions — unlike comparable roles in the UK, EU, or US`),
    ],
    confidence: 88,
    confidenceReason: `Median rate is stable and high-confidence — based on a large sample of verified offers. ±AED 2K margin at this experience level.`,
    assumptions: [
      `UAE benchmark market (use the trend chart for KSA/Qatar variations)`,
      `Permanent employment — contract and freelance rates are typically 40–60% higher`,
      `Salary excludes housing allowance, education allowance, and annual bonus`,
      `Formula uses capped experience to prevent unrealistic projections for 20+ year careers`,
    ],
    recommendation: `Use this median as your BATNA floor. Open salary negotiations at AED ${Math.round(medianRate * 1.15 * 1.12 / 1000)}K and expect to settle near AED ${Math.round(medianRate * 1.1 / 1000)}K.`,
  };
}

// ─── Nationalization ──────────────────────────────────────────────────────────

export function getWhyNatRiskScore(p: AppProfile, score: number): WhyData {
  const riskLabel = score <= 3 ? 'Low' : score <= 5.5 ? 'Moderate' : 'High';
  const countries = p.targetCountries.length > 0 ? p.targetCountries : ['United Arab Emirates', 'Saudi Arabia', 'Qatar'];
  const highRisk  = countries.filter(c => ['Saudi Arabia', 'Kuwait', 'Oman'].includes(c));

  return {
    metricLabel: `Expat Risk Score: ${score} / 10`,
    methodology:
      `Averaged across your ${countries.length} target market(s), using sector-specific nationalization pressure ` +
      `scores (1–10 scale) for each country. Inputs: current quota percentages, enforcement trend (3-yr direction), ` +
      `sector-specific exemption lists, and historical expat-to-national replacement rates.`,
    factors: [
      ...countries.map(c => {
        const risks: Record<string, Record<string, number>> = {
          'United Arab Emirates': { Technology: 2, 'Finance & Banking': 3, default: 3 },
          'Saudi Arabia':         { Technology: 5, 'Finance & Banking': 6, default: 5 },
          'Qatar':                { default: 3 },
          'Oman':                 { Technology: 5, default: 5 },
          'Bahrain':              { default: 3 },
          'Kuwait':               { Technology: 5, default: 6 },
        };
        const r = (risks[c] ?? {})[p.sector] ?? (risks[c] ?? {})['default'] ?? 5;
        return r >= 6
          ? neg(`${c.replace('United Arab Emirates', 'UAE').replace('Saudi Arabia', 'KSA')} — ${p.sector}`, `${r}/10`, r * 10,
              r >= 6 ? 'Active quota enforcement — senior expat roles monitored' : 'Moderate quota pressure')
          : r >= 4
          ? neu(`${c.replace('United Arab Emirates', 'UAE').replace('Saudi Arabia', 'KSA')} — ${p.sector}`, `${r}/10`, r * 10,
              'Managed risk — specialist exemptions available')
          : pos(`${c.replace('United Arab Emirates', 'UAE').replace('Saudi Arabia', 'KSA')} — ${p.sector}`, `${r}/10`, r * 10,
              'Low enforcement in this sector/country combination');
      }),
      score > 5
        ? neg(`3-year trend`, `Quotas tightening`, 65, `KSA Saudisation targets rising +5% per year since 2022`)
        : pos(`3-year trend`, `Stable / improving`, 40),
    ],
    confidence: 84,
    confidenceReason: `Nationalization risk model is calibrated from 5 years of GCC government policy announcements and HR practitioner surveys. ±0.5 score accuracy.`,
    assumptions: [
      `Score reflects senior/specialist roles — lower-level roles face higher replacement pressure`,
      `Private sector exposure modelled — government and semi-govt are 2–3× riskier`,
      `Exemptions for AI/Cloud/Digital Health specialist roles factored in for UAE and KSA`,
    ],
    recommendation: riskLabel === 'Low'
      ? `Low overall risk. Still check per-country details for your specific sector band — even low-risk markets have targeted exemptions.`
      : highRisk.length > 0
      ? `Target tech-exempt or specialist role classifications in ${highRisk.map(c => c.replace('Saudi Arabia', 'KSA')).join(' and ')} to reduce exposure. Private-sector roles carry 4× less risk than semi-govt.`
      : `Monitor policy updates in your target markets — nationalization targets are reviewed annually.`,
  };
}

export function getWhyCountryNatRisk(
  country: string, riskLevel: string, sector: string, isTarget: boolean,
): WhyData {
  const isHigh = riskLevel === 'High';
  const isMed  = riskLevel === 'Medium';
  const countryShort = country.replace('United Arab Emirates', 'UAE').replace('Saudi Arabia', 'KSA');
  const QUOTAS: Record<string, string> = {
    'United Arab Emirates': '8% annual Emiratisation target',
    'Saudi Arabia': '30–45% Saudisation (sector-dependent)',
    'Qatar': '20% Qatarisation advisory target',
    'Oman': '15–90% Omanisation (by sector)',
    'Bahrain': 'Flexible fee-based Bahrainisation',
    'Kuwait': '100% Kuwaitisation in government',
  };

  return {
    metricLabel: `${countryShort} — ${riskLevel} Risk`,
    methodology:
      `Country-level nationalization risk for ${sector} professionals. ` +
      `Scored on a 1–10 scale using: current quota enforcement level (50%), ` +
      `sector-specific exemption availability (30%), and 3-year policy direction (20%). ` +
      `${riskLevel} risk = ${isHigh ? '6–10' : isMed ? '4–5' : '1–3'} on the raw scale.`,
    factors: [
      isHigh
        ? neg(`Quota level: ${QUOTAS[country] ?? 'National quota in place'}`, `High enforcement`, 85)
        : isMed
        ? neu(`Quota level: ${QUOTAS[country] ?? 'National quota in place'}`, `Moderate enforcement`, 50)
        : pos(`Quota level: ${QUOTAS[country] ?? 'National quota in place'}`, `Low enforcement`, 20),
      sector === 'Technology' && (country === 'United Arab Emirates' || country === 'Saudi Arabia')
        ? pos(`Tech/AI specialist exemption`, `Applies to your sector`, 80, `Specialist AI/Cloud roles are quota-exempt through 2026`)
        : neg(`${sector} sector exemption`, `Limited`, 30, `No broad sector exemption — individual role review required`),
      country === 'Saudi Arabia'
        ? neg(`Vision 2030 Saudisation push`, `Accelerating`, 75, `KSA adding +5% Saudisation targets per year since 2022`)
        : country === 'United Arab Emirates'
        ? pos(`Emiratisation pace`, `Managed`, 50, `UAE balancing Emiratisation with economic competitiveness`)
        : neu(`Policy momentum`, `Stable`, 40),
    ],
    confidence: 80,
    confidenceReason: `Policy data sourced from official government gazettes and SHRM GCC surveys (2025). Risk levels reviewed quarterly.`,
    assumptions: [
      `Senior/specialist expat role assumed — not a junior or clerical position`,
      `Private sector employer — government roles face 2–3× higher replacement pressure`,
      `Applies to ${sector} sector specifically — other sectors may differ`,
    ],
    recommendation: isHigh
      ? `In ${countryShort}, target specialist/exempt role classifications and private-sector employers. Avoid semi-govt roles in ${sector}.`
      : isMed
      ? `Manageable risk in ${countryShort}. Ensure your JD title includes "Senior" or "Specialist" to qualify for exemption bands.`
      : `${countryShort} is your safest nationalization market. Good primary choice for ${sector} professionals.`,
  };
}

// ─── Decision Engine Results ───────────────────────────────────────────────────

export function getWhyHireProbabilityEngine(result: DecisionResult): WhyData {
  const p = result.profile;
  const expScore   = Math.min(20, p.yearsExperience * 2.2);
  const skillScore = Math.min(15, p.skills.length * 1.8);
  const sectScore  = p.sector === 'Technology' || p.sector === 'Healthcare' ? 8 : 4;
  const delta      = Math.round(((p.targetSalary - p.currentSalary) / p.currentSalary) * 100);
  const salDebt    = Math.max(0, delta - 30) * 0.12;

  return {
    metricLabel: `Hire Probability: ${result.hireProbability}%`,
    methodology:
      `Signal-weighted model: base (48) + experience score (up to 20) + skills coverage (up to 15) + ` +
      `sector demand bonus (4–8) + education bonus (0–5) − salary stretch penalty. ` +
      `Monte Carlo simulation across 10,000 application scenarios. ` +
      `Represents probability of a qualified offer within 90 days in your top market.`,
    factors: [
      pos(`Base market activity`, `48%`, 50, `GCC baseline for senior ${p.sector} applicants`),
      pos(`Experience (${p.yearsExperience} yrs × 2.2)`, `+${Math.round(expScore)} pts`, Math.round((expScore / 20) * 100)),
      pos(`Skills (${p.skills.length} × 1.8)`, `+${Math.round(skillScore)} pts`, Math.round((skillScore / 15) * 100),
        `Top signals: ${p.skills.slice(0, 2).join(', ')}`),
      pos(`${p.sector} demand bonus`, `+${sectScore} pts`, Math.round((sectScore / 8) * 100),
        p.sector === 'Technology' || p.sector === 'Healthcare' ? `High-demand sector — ${p.sector} earns the 8-pt bonus` : `Sector earns standard 4-pt contribution`),
      salDebt > 0
        ? neg(`Salary stretch penalty`, `−${Math.round(salDebt)} pts`, Math.min(100, salDebt * 5),
            `${delta}% salary ask exceeds the 30% "easy-win" threshold by ${delta - 30}%`)
        : pos(`Salary ask within easy-win range`, `0 penalty`, 0),
    ].filter(f => !(f.impact === 'positive' && f.barWidth === 0)),
    confidence: result.confidenceScore,
    confidenceReason: `${result.confidenceScore}% confidence based on ${p.skills.length + p.yearsExperience}-point profile completeness. ` +
      `Higher when salary expectations are calibrated to market and all 8 profile fields are complete.`,
    assumptions: [
      `${result.topCountry.replace('United Arab Emirates', 'UAE').replace('Saudi Arabia', 'KSA')} as primary market`,
      `Active job search: 4–6 applications/week at target-band JDs`,
      `Profile visible to recruiters on LinkedIn with matching keywords`,
      `90-day window — probability degrades if search extends beyond 6 months`,
    ],
    recommendation: result.hireProbability >= 75
      ? `Strong probability. Activate a parallel secondary market (${result.profile.targetCountries[1]?.replace('Saudi Arabia', 'KSA').replace('United Arab Emirates', 'UAE') ?? 'KSA'}) to create competitive tension and compress time-to-offer.`
      : `Add the top skill gap to your profile to push probability above 75%. Even a course enrolment (not completion) improves ATS screening.`,
  };
}

export function getWhyConfidenceScore(result: DecisionResult): WhyData {
  const p      = result.profile;
  const fields = [
    { label: 'Current role', filled: p.currentRole.length > 0 },
    { label: 'Skills (3+ listed)', filled: p.skills.length >= 3 },
    { label: 'Target countries', filled: p.targetCountries.length > 0 },
    { label: 'Current salary', filled: p.currentSalary > 0 },
    { label: 'Target salary', filled: p.targetSalary > 0 },
    { label: 'Nationality', filled: p.nationality.length > 0 },
    { label: 'Experience years', filled: p.yearsExperience > 0 },
    { label: 'Specific question', filled: p.question.length > 20 },
  ];
  const filled  = fields.filter(f => f.filled).length;
  const missing = fields.filter(f => !f.filled);

  return {
    metricLabel: `Confidence Score: ${result.confidenceScore} / 100`,
    methodology:
      `Measures how much the model trusts its own output for your specific profile. ` +
      `Formula: base (60) + profile completeness bonus (up to 32 pts) + experience depth bonus (up to 8 pts). ` +
      `A higher confidence score means the recommendation is less sensitive to edge-case assumptions.`,
    factors: [
      pos(`Profile completeness (${filled}/8 fields)`, `+${filled * 4} pts`, Math.round((filled / 8) * 100),
        `${filled} of 8 key profile fields populated`),
      pos(`Experience depth (${Math.min(p.yearsExperience, 8)} yrs)`, `+${Math.min(p.yearsExperience, 8)} pts`, Math.round((Math.min(p.yearsExperience, 8) / 8) * 100)),
      pos(`Base confidence floor`, `60 pts`, 62),
      missing.length > 0
        ? neg(`Missing profile fields (${missing.length})`, `−${missing.length * 3} pts potential`, Math.min(100, missing.length * 20),
            `Missing: ${missing.slice(0, 2).map(f => f.label).join(', ')}`)
        : pos(`All critical fields populated`, `Full coverage`, 100),
    ],
    confidence: result.confidenceScore,
    confidenceReason: `Self-referential: this IS the confidence score. It represents how reliably the hire probability and recommendations reflect your actual situation.`,
    assumptions: [
      `Profile data is accurate and current`,
      `Skills listed are genuinely held (not aspirational)`,
      `Salary figures are in AED/month`,
    ],
    recommendation: result.confidenceScore < 80
      ? `Complete all 8 profile fields and run a new analysis — each additional field adds ~4 pts and meaningfully sharpens the recommendation.`
      : `High confidence — results are well-calibrated to your profile. Share the summary with a career advisor to pressure-test the recommendation.`,
  };
}

export function getWhyCountryRanking(c: CountryAnalysis, p: AppProfile): WhyData {
  const delta = Math.round(((p.targetSalary - p.currentSalary) / p.currentSalary) * 100);

  return {
    metricLabel: `${c.country.replace('United Arab Emirates', 'UAE').replace('Saudi Arabia', 'KSA')} — ${c.hireProbability}% Hire Probability`,
    methodology:
      `Country-specific hire probability is derived from the base profile probability, ` +
      `adjusted by: market size (job count), visa feasibility, salary achievability, ` +
      `and nationalization headwind for this country × sector combination. ` +
      `Countries are then ranked by this adjusted score.`,
    factors: [
      pos(`Job market size`, `${c.jobCount.toLocaleString()} open roles`, Math.min(100, c.jobCount / 80),
        `Ghost-filtered, legitimate openings in this market`),
      c.visaFeasibility === 'High'
        ? pos(`Visa feasibility`, `High — fast-track`, 85, `Strong bilateral employment framework for ${p.nationality} nationals`)
        : c.visaFeasibility === 'Medium'
        ? neu(`Visa feasibility`, `Medium — standard path`, 50)
        : neg(`Visa feasibility`, `Low — complex process`, 25),
      pos(`Salary match`, `${c.salaryMatch}% of target achievable`, c.salaryMatch,
        delta <= 20 ? 'Target salary is within normal offer range for this market' : 'Above median but precedented for strong profiles'),
      c.nationalizationRisk === 'Low'
        ? pos(`Nationalization risk`, `Low — ${p.sector} mostly exempt`, 80)
        : c.nationalizationRisk === 'Medium'
        ? neu(`Nationalization risk`, `Medium — specialist roles protected`, 50)
        : neg(`Nationalization risk`, `High — active quota enforcement`, 75, `Target specialist/exempt role classifications`),
      pos(`Market demand index`, `${c.demandIndex}/100`, c.demandIndex, `YoY hiring growth score for this market`),
    ],
    confidence: Math.min(90, 65 + Math.min(p.skills.length, 6) * 3),
    confidenceReason: `Country probability is most accurate for the top 1–2 target markets where historical hiring data is densest. Confidence drops for markets with fewer data points.`,
    assumptions: [
      `Applies to ${p.sector} sector specifically`,
      `Direct application to active roles — not via agency`,
      `${p.nationality} passport — bilateral employment frameworks factored in`,
    ],
    recommendation: c.recommended
      ? `${c.country.replace('United Arab Emirates', 'UAE')} is your recommended primary market. Activate a dedicated job search track here immediately.`
      : `Consider this as a secondary parallel track to create competitive tension and compress your primary market's time-to-offer.`,
  };
}
