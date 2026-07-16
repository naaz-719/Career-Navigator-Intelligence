// ─── HirePilot AI — Intelligence Engine (Central Export) ─────────────────────
// Import from here for everything. Backend seam comments live in each module.

export * from './types';
export { FLAG_MAP, SHORT_COUNTRY, MARKET_SKILLS, TOP_COMPANIES, JOB_POOL,
         NATL_RISK, COUNTRY_POLICY, DEMAND_BY_SECTOR, RADAR_AXES,
         getSalaryPercentiles, getPercentile, drand, skillMatch,
         computeMatchScore, computeBaseHireProbability, computeBaseCareerScore } from './data';

// ── Module exports ─────────────────────────────────────────────────────────
export { computeCareerScore }        from './modules/careerScore';
export type { CareerScoreResult }    from './modules/careerScore';

export { computeHireProbability }    from './modules/hireProbability';
export type { HireProbabilityResult }from './modules/hireProbability';

export { computeSalaryIntelligence }       from './modules/salaryIntelligence';
export type { SalaryIntelligenceResult }   from './modules/salaryIntelligence';

export { computeMarketDemand }       from './modules/marketDemand';
export type { MarketDemandResult }   from './modules/marketDemand';

export { computeNationalization }        from './modules/nationalization';
export type { NationalizationResult, CountryNatDetail } from './modules/nationalization';

export { computeJobMatching }        from './modules/jobMatching';
export type { JobMatchingResult, EnrichedJob } from './modules/jobMatching';

export { computeRelocation }         from './modules/relocation';
export type { RelocationResult, RelocationCountry } from './modules/relocation';

export { computeResumeScore }        from './modules/resumeScore';
export type { ResumeScoreResult, ResumeVersion, ResumeSuggestion } from './modules/resumeScore';

export { computeInterviewReadiness } from './modules/interviewReadiness';
export type { InterviewReadinessResult, InterviewQuestion } from './modules/interviewReadiness';

export { computeCareerMultiverse }   from './modules/careerMultiverse';
export type { CareerMultiverseResult, MultiverseScenario } from './modules/careerMultiverse';

export { computeCareerTwin }         from './modules/careerTwin';
export type { CareerTwinResult, CareerTwinMessage } from './modules/careerTwin';

// ── Convenience: run all modules at once ─────────────────────────────────────
import type { AppProfile } from '@/context/ProfileContext';
import { computeCareerScore }        from './modules/careerScore';
import { computeHireProbability }    from './modules/hireProbability';
import { computeSalaryIntelligence } from './modules/salaryIntelligence';
import { computeMarketDemand }       from './modules/marketDemand';
import { computeNationalization }    from './modules/nationalization';
import { computeJobMatching }        from './modules/jobMatching';
import { computeRelocation }         from './modules/relocation';
import { computeResumeScore }        from './modules/resumeScore';
import { computeInterviewReadiness } from './modules/interviewReadiness';
import { computeCareerMultiverse }   from './modules/careerMultiverse';
import { computeCareerTwin }         from './modules/careerTwin';

/** Run all intelligence modules against a profile in one call.
 *  Each module is independently replaceable with a real API fetch. */
export function runAllIntelligence(profile: AppProfile) {
  return {
    careerScore:     computeCareerScore(profile),
    hireProbability: computeHireProbability(profile),
    salary:          computeSalaryIntelligence(profile),
    market:          computeMarketDemand(profile),
    nationalization: computeNationalization(profile),
    jobs:            computeJobMatching(profile),
    relocation:      computeRelocation(profile),
    resume:          computeResumeScore(profile),
    interview:       computeInterviewReadiness(profile),
    multiverse:      computeCareerMultiverse(profile),
    careerTwin:      computeCareerTwin(profile),
  };
}
