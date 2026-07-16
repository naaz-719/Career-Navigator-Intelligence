// ─── Mock Data Service ────────────────────────────────────────────────────────
// Pure functions that derive page data from AppProfile.
// Backend seam: replace each function body with a fetch() call to the real API.
// All functions are synchronous now; make them async when wiring real endpoints.

import type { AppProfile } from '@/context/ProfileContext';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Deterministic pseudo-random in [min, max) seeded by a string */
function drand(seed: string, min: number, max: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  return min + (Math.abs(h) % (max - min));
}

function skillMatch(profileSkills: string[], required: string[]): boolean {
  return required.some(r =>
    profileSkills.some(s => s.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(s.toLowerCase()))
  );
}

function computeMatchScore(requiredSkills: string[], profileSkills: string[], yearsExp: number): number {
  const matched = requiredSkills.filter(r => skillMatch(profileSkills, [r])).length;
  const skillPct = requiredSkills.length > 0 ? matched / requiredSkills.length : 0.5;
  return Math.min(97, Math.round(35 + skillPct * 45 + Math.min(yearsExp * 1.5, 16)));
}

export const FLAG_MAP: Record<string, string> = {
  'United Arab Emirates': '🇦🇪',
  'Saudi Arabia': '🇸🇦',
  'Qatar': '🇶🇦',
  'Oman': '🇴🇲',
  'Bahrain': '🇧🇭',
  'Kuwait': '🇰🇼',
};

const SHORT_COUNTRY: Record<string, string> = {
  'United Arab Emirates': 'UAE',
  'Saudi Arabia': 'KSA',
  'Qatar': 'Qatar',
  'Oman': 'Oman',
  'Bahrain': 'Bahrain',
  'Kuwait': 'Kuwait',
};

// ─── Market Skills by Sector ─────────────────────────────────────────────────
const MARKET_SKILLS: Record<string, string[]> = {
  'Technology':            ['Cloud Architecture', 'AI/ML', 'System Design', 'Python', 'DevOps', 'Kubernetes', 'Data Analytics', 'TypeScript'],
  'Finance & Banking':    ['Financial Modelling', 'Bloomberg Terminal', 'Risk Management', 'IFRS 9', 'AML/KYC', 'Treasury', 'CFA'],
  'Healthcare':           ['HAAD/DHA Compliance', 'EMR Systems', 'Clinical Governance', 'Patient Safety', 'Digital Health', 'JAWDA'],
  'Energy & Oil & Gas':  ['HSE Management', 'Asset Integrity', 'Project Controls', 'FEED', 'Commissioning', 'SAP PM'],
  'Construction & Real Estate': ['BIM', 'Primavera P6', 'NEC Contracts', 'FIDIC', 'Quantity Surveying', 'Smart Building Tech'],
  'Retail & E-commerce': ['Merchandising Analytics', 'D2C Strategy', 'Inventory Optimisation', 'Shopify', 'Growth Hacking', 'CRM'],
  'Telecommunications':  ['5G Architecture', 'Network Slicing', 'OSS/BSS', 'MVNO', 'Spectrum Management', 'VoIP/IMS'],
};

const DEFAULT_SKILLS = MARKET_SKILLS['Technology'];

// ─── Demand Metrics by Sector ─────────────────────────────────────────────────
const DEMAND_BY_SECTOR: Record<string, { score: number; velocity: number; avgDays: number; note: string }> = {
  'Technology':            { score: 9.1, velocity: 24, avgDays: 19, note: 'AI & Cloud driving record GCC tech hiring in 2025' },
  'Finance & Banking':    { score: 7.8, velocity: 12, avgDays: 27, note: 'FinTech and Open Banking mandates accelerating demand' },
  'Healthcare':           { score: 8.3, velocity: 18, avgDays: 22, note: 'Vision 2030 healthcare expansion creating surge demand' },
  'Energy & Oil & Gas':  { score: 7.2, velocity: 9,  avgDays: 31, note: 'Net-zero transition creating new energy transition roles' },
  'Construction & Real Estate': { score: 7.5, velocity: 11, avgDays: 29, note: 'Giga-projects sustaining strong construction demand' },
  'Retail & E-commerce': { score: 6.9, velocity: 8,  avgDays: 24, note: 'Post-COVID normalisation slowing but still positive' },
  'Telecommunications':  { score: 7.4, velocity: 13, avgDays: 26, note: '5G rollout and spectrum auctions driving network hiring' },
};

const DEFAULT_DEMAND = DEMAND_BY_SECTOR['Technology'];

// ─── Radar Chart Axes by Sector ───────────────────────────────────────────────
const RADAR_AXES: Record<string, Array<{ label: string; keywords: string[]; marketDemand: number }>> = {
  'Technology': [
    { label: 'Cloud/DevOps',    keywords: ['cloud', 'aws', 'azure', 'devops', 'kubernetes'], marketDemand: 90 },
    { label: 'AI/ML',           keywords: ['ai', 'ml', 'machine learning', 'python', 'data science'], marketDemand: 95 },
    { label: 'Agile/PM',        keywords: ['agile', 'scrum', 'product', 'roadmap'], marketDemand: 80 },
    { label: 'System Design',   keywords: ['system design', 'architecture', 'microservices'], marketDemand: 85 },
    { label: 'Data Analytics',  keywords: ['analytics', 'sql', 'tableau', 'data'], marketDemand: 78 },
    { label: 'Stakeholder Mgmt',keywords: ['stakeholder', 'management', 'leadership'], marketDemand: 75 },
  ],
  'Finance & Banking': [
    { label: 'Financial Modelling', keywords: ['financial modelling', 'dcf', 'lbo', 'valuation'], marketDemand: 92 },
    { label: 'Risk Management',     keywords: ['risk', 'credit risk', 'market risk'], marketDemand: 88 },
    { label: 'Compliance/AML',      keywords: ['compliance', 'aml', 'kyc', 'regulatory'], marketDemand: 90 },
    { label: 'Bloomberg/Data',      keywords: ['bloomberg', 'reuters', 'data analytics'], marketDemand: 80 },
    { label: 'Treasury',            keywords: ['treasury', 'cash management', 'fx'], marketDemand: 75 },
    { label: 'FinTech',             keywords: ['fintech', 'digital banking', 'open banking'], marketDemand: 85 },
  ],
  'Healthcare': [
    { label: 'Clinical Governance', keywords: ['clinical', 'governance', 'quality'], marketDemand: 90 },
    { label: 'Digital Health',      keywords: ['digital health', 'emr', 'ehr', 'telemedicine'], marketDemand: 88 },
    { label: 'Regulatory (HAAD/DHA)',keywords: ['haad', 'dha', 'regulatory', 'compliance'], marketDemand: 92 },
    { label: 'Patient Safety',      keywords: ['patient safety', 'incident', 'jci'], marketDemand: 85 },
    { label: 'Operations',          keywords: ['operations', 'management', 'leadership'], marketDemand: 75 },
    { label: 'Research/Innovation', keywords: ['research', 'innovation', 'r&d'], marketDemand: 70 },
  ],
};

const DEFAULT_RADAR_AXES = RADAR_AXES['Technology'];

// ─── Top Companies by Sector ──────────────────────────────────────────────────
const TOP_COMPANIES: Record<string, Array<{ name: string; roles: number; growth: string }>> = {
  'Technology':           [{ name: 'G42', roles: 187, growth: '+31%' }, { name: 'Careem', roles: 142, growth: '+18%' }, { name: 'Noon', roles: 119, growth: '+24%' }, { name: 'ADNOC Digital', roles: 98, growth: '+42%' }, { name: 'stc pay', roles: 74, growth: '+15%' }],
  'Finance & Banking':   [{ name: 'Emirates NBD', roles: 124, growth: '+14%' }, { name: 'FAB', roles: 98, growth: '+11%' }, { name: 'QNB', roles: 82, growth: '+9%' }, { name: 'Al Rajhi Bank', roles: 76, growth: '+22%' }, { name: 'Arab Bank', roles: 55, growth: '+6%' }],
  'Healthcare':          [{ name: 'Cleveland Clinic Abu Dhabi', roles: 89, growth: '+28%' }, { name: 'NMC Healthcare', roles: 76, growth: '+12%' }, { name: 'Mediclinic', roles: 65, growth: '+9%' }, { name: 'Saudi MOH', roles: 210, growth: '+35%' }, { name: 'Aster DM', roles: 54, growth: '+17%' }],
  'Energy & Oil & Gas':  [{ name: 'Saudi Aramco', roles: 156, growth: '+8%' }, { name: 'ADNOC', roles: 134, growth: '+19%' }, { name: 'QatarEnergy', roles: 88, growth: '+12%' }, { name: 'OQ Oman', roles: 45, growth: '+5%' }, { name: 'Baker Hughes', roles: 67, growth: '+14%' }],
  'Construction & Real Estate': [{ name: 'NEOM', roles: 312, growth: '+55%' }, { name: 'Emaar', roles: 98, growth: '+18%' }, { name: 'ALEC', roles: 76, growth: '+12%' }, { name: 'Arcadis', roles: 55, growth: '+9%' }, { name: 'Parsons', roles: 44, growth: '+7%' }],
};

const DEFAULT_COMPANIES = TOP_COMPANIES['Technology'];

// ─── Job Pool by Sector ───────────────────────────────────────────────────────
interface RawJob {
  id: number;
  title: string;
  company: string;
  sector: string;
  country: string;
  loc: string;
  salaryLabel: string;
  tags: string[];
  ghostRisk: number;
  isGhost?: boolean;
  posted: string;
  requiredSkills: string[];
}

const JOB_POOL: Record<string, RawJob[]> = {
  'Technology': [
    { id: 1,  title: 'Senior Product Manager',     company: 'Noon',           sector: 'E-commerce',      country: 'United Arab Emirates', loc: 'Dubai',     salaryLabel: 'AED 35K–45K',              tags: ['Senior', 'Hybrid', 'Agile'],       ghostRisk: 12, posted: '2 days ago',  requiredSkills: ['Product Strategy', 'Agile/Scrum', 'Stakeholder Mgmt', 'Data Analytics'] },
    { id: 2,  title: 'Head of Product',             company: 'Careem',         sector: 'Super-App',       country: 'United Arab Emirates', loc: 'Dubai',     salaryLabel: 'AED 40K–55K',              tags: ['Lead', 'Hybrid', 'B2C'],           ghostRisk: 8,  posted: '3 days ago',  requiredSkills: ['Product Strategy', 'Data Analytics', 'Stakeholder Mgmt', 'Roadmapping'] },
    { id: 3,  title: 'Lead PM – AI Initiatives',   company: 'G42',            sector: 'AI / Smart City', country: 'United Arab Emirates', loc: 'Abu Dhabi', salaryLabel: 'Disclosed to candidates',  tags: ['Senior', 'On-site', 'AI/ML'],      ghostRisk: 5,  posted: '1 week ago',  requiredSkills: ['AI/ML', 'Product Strategy', 'Python', 'System Design'] },
    { id: 4,  title: 'Director of Product',         company: 'Confidential',   sector: 'FinTech',         country: 'Saudi Arabia',         loc: 'Riyadh',    salaryLabel: 'SAR 50K–65K',              tags: ['Director', 'On-site', 'Payments'], ghostRisk: 85, isGhost: true, posted: '5 hrs ago',   requiredSkills: ['Product Strategy', 'Roadmapping', 'Stakeholder Mgmt'] },
    { id: 5,  title: 'VP Product Engineering',      company: 'Saudi Aramco',   sector: 'Energy / Tech',   country: 'Saudi Arabia',         loc: 'Dhahran',   salaryLabel: 'SAR 70K+',                 tags: ['Executive', 'On-site', 'Enterprise'],ghostRisk: 2,  posted: '2 weeks ago', requiredSkills: ['System Design', 'Cloud Architecture', 'DevOps'] },
    { id: 6,  title: 'Technical PM',                company: 'Wio Bank',       sector: 'AI / Cloud',      country: 'United Arab Emirates', loc: 'Abu Dhabi', salaryLabel: 'AED 30K–40K',              tags: ['Senior', 'Hybrid', 'Cloud'],       ghostRisk: 8,  posted: '1 day ago',   requiredSkills: ['Cloud Architecture', 'Python', 'System Design', 'Agile/Scrum'] },
    { id: 7,  title: 'Product Owner – Payments',    company: 'stc pay',        sector: 'FinTech',         country: 'Saudi Arabia',         loc: 'Riyadh',    salaryLabel: 'SAR 28K–36K',              tags: ['Mid', 'Hybrid', 'Payments'],       ghostRisk: 14, posted: '4 days ago',  requiredSkills: ['Agile/Scrum', 'Roadmapping', 'Stakeholder Mgmt'] },
    { id: 8,  title: 'Engineering Manager',         company: 'Talabat',        sector: 'FoodTech',        country: 'Qatar',                loc: 'Doha',      salaryLabel: 'QAR 35K–45K',              tags: ['Lead', 'Hybrid', 'Platform'],      ghostRisk: 18, posted: '3 days ago',  requiredSkills: ['System Design', 'DevOps', 'Stakeholder Mgmt', 'Agile/Scrum'] },
  ],
  'Finance & Banking': [
    { id: 1,  title: 'Senior Financial Analyst',    company: 'Emirates NBD',   sector: 'Retail Banking',  country: 'United Arab Emirates', loc: 'Dubai',     salaryLabel: 'AED 28K–38K',              tags: ['Senior', 'On-site', 'Analytics'],  ghostRisk: 5,  posted: '2 days ago',  requiredSkills: ['Financial Modelling', 'Bloomberg Terminal', 'IFRS 9'] },
    { id: 2,  title: 'Head of Risk Management',     company: 'QNB',            sector: 'Investment Bank', country: 'Qatar',                loc: 'Doha',      salaryLabel: 'QAR 40K–55K',              tags: ['Lead', 'On-site', 'Risk'],         ghostRisk: 8,  posted: '1 week ago',  requiredSkills: ['Risk Management', 'AML/KYC', 'Compliance'] },
    { id: 3,  title: 'Director of Treasury',        company: 'FAB',            sector: 'Banking',         country: 'United Arab Emirates', loc: 'Abu Dhabi', salaryLabel: 'AED 45K–60K',              tags: ['Director', 'On-site', 'Treasury'], ghostRisk: 4,  posted: '5 days ago',  requiredSkills: ['Treasury', 'FX', 'Financial Modelling', 'Bloomberg Terminal'] },
    { id: 4,  title: 'VP Compliance & AML',         company: 'Al Rajhi Bank',  sector: 'Islamic Banking', country: 'Saudi Arabia',         loc: 'Riyadh',    salaryLabel: 'SAR 38K–50K',              tags: ['Senior', 'On-site', 'Compliance'], ghostRisk: 6,  posted: '3 days ago',  requiredSkills: ['AML/KYC', 'Compliance', 'Risk Management'] },
    { id: 5,  title: 'Senior FinTech PM',           company: 'Tabby',          sector: 'FinTech',         country: 'United Arab Emirates', loc: 'Dubai',     salaryLabel: 'AED 30K–42K',              tags: ['Senior', 'Hybrid', 'FinTech'],     ghostRisk: 12, posted: '2 days ago',  requiredSkills: ['FinTech', 'Risk Management', 'Financial Modelling'] },
    { id: 6,  title: 'Investment Analyst',          company: 'Mubadala',       sector: 'Sovereign Wealth',country: 'United Arab Emirates', loc: 'Abu Dhabi', salaryLabel: 'AED 40K–55K',              tags: ['Senior', 'On-site', 'PE/VC'],      ghostRisk: 7,  posted: '1 week ago',  requiredSkills: ['Financial Modelling', 'Valuation', 'Bloomberg Terminal'] },
  ],
  'Healthcare': [
    { id: 1,  title: 'Medical Director',            company: 'Cleveland Clinic Abu Dhabi', sector: 'Hospital', country: 'United Arab Emirates', loc: 'Abu Dhabi', salaryLabel: 'AED 55K–80K',   tags: ['Executive', 'On-site', 'Clinical'],  ghostRisk: 3, posted: '1 week ago',  requiredSkills: ['Clinical Governance', 'HAAD/DHA Compliance', 'Patient Safety'] },
    { id: 2,  title: 'Head of Digital Health',      company: 'NMC Healthcare',             sector: 'Digital Health', country: 'United Arab Emirates', loc: 'Dubai', salaryLabel: 'AED 35K–48K', tags: ['Lead', 'Hybrid', 'Digital'],         ghostRisk: 9, posted: '3 days ago',  requiredSkills: ['Digital Health', 'EMR Systems', 'Operations'] },
    { id: 3,  title: 'Clinical Quality Manager',    company: 'Saudi MOH',                  sector: 'Govt Healthcare', country: 'Saudi Arabia', loc: 'Riyadh',   salaryLabel: 'SAR 30K–42K',    tags: ['Senior', 'On-site', 'Quality'],      ghostRisk: 6, posted: '5 days ago',  requiredSkills: ['HAAD/DHA Compliance', 'Clinical Governance', 'Patient Safety'] },
    { id: 4,  title: 'Hospital Operations Director',company: 'Mediclinic',                 sector: 'Hospital',   country: 'United Arab Emirates', loc: 'Dubai', salaryLabel: 'AED 42K–60K',    tags: ['Director', 'On-site', 'Operations'], ghostRisk: 5, posted: '2 weeks ago', requiredSkills: ['Operations', 'Clinical Governance', 'Patient Safety'] },
  ],
  'Energy & Oil & Gas': [
    { id: 1, title: 'Senior Project Manager',       company: 'ADNOC',          sector: 'Upstream',        country: 'United Arab Emirates', loc: 'Abu Dhabi', salaryLabel: 'AED 45K–65K',              tags: ['Senior', 'On-site', 'Upstream'],   ghostRisk: 4,  posted: '1 week ago',  requiredSkills: ['Project Controls', 'HSE Management', 'FEED'] },
    { id: 2, title: 'Asset Integrity Lead',         company: 'Saudi Aramco',   sector: 'Downstream',      country: 'Saudi Arabia',         loc: 'Dhahran',   salaryLabel: 'SAR 55K–75K',              tags: ['Lead', 'On-site', 'Integrity'],    ghostRisk: 3,  posted: '3 days ago',  requiredSkills: ['Asset Integrity', 'HSE Management', 'SAP PM'] },
    { id: 3, title: 'Head of Energy Transition',    company: 'QatarEnergy',    sector: 'LNG / Renewables',country: 'Qatar',                loc: 'Doha',      salaryLabel: 'QAR 55K–70K',              tags: ['Lead', 'On-site', 'Renewables'],   ghostRisk: 6,  posted: '5 days ago',  requiredSkills: ['FEED', 'Project Controls', 'Commissioning'] },
    { id: 4, title: 'HSE Manager',                  company: 'Baker Hughes',   sector: 'Oilfield Services',country: 'United Arab Emirates',loc: 'Dubai',     salaryLabel: 'AED 28K–38K',              tags: ['Senior', 'On-site', 'HSE'],        ghostRisk: 7,  posted: '4 days ago',  requiredSkills: ['HSE Management', 'Commissioning', 'Asset Integrity'] },
  ],
};

const DEFAULT_JOBS = JOB_POOL['Technology'];

// ─── Nationalization Risk ─────────────────────────────────────────────────────
// Risk 1 (lowest) → 10 (highest) per country per sector
const NATL_RISK: Record<string, Record<string, number>> = {
  'United Arab Emirates': { Technology: 2, 'Finance & Banking': 3, Healthcare: 3, 'Energy & Oil & Gas': 3, 'Construction & Real Estate': 3, 'Retail & E-commerce': 4, Telecommunications: 3, default: 3 },
  'Saudi Arabia':         { Technology: 5, 'Finance & Banking': 6, Healthcare: 5, 'Energy & Oil & Gas': 4, 'Construction & Real Estate': 5, 'Retail & E-commerce': 6, Telecommunications: 5, default: 5 },
  'Qatar':                { Technology: 3, 'Finance & Banking': 4, Healthcare: 3, 'Energy & Oil & Gas': 3, 'Construction & Real Estate': 3, 'Retail & E-commerce': 4, Telecommunications: 3, default: 3 },
  'Oman':                 { Technology: 5, 'Finance & Banking': 5, Healthcare: 5, 'Energy & Oil & Gas': 5, 'Construction & Real Estate': 5, 'Retail & E-commerce': 6, Telecommunications: 5, default: 5 },
  'Bahrain':              { Technology: 3, 'Finance & Banking': 4, Healthcare: 3, 'Energy & Oil & Gas': 3, 'Construction & Real Estate': 3, 'Retail & E-commerce': 4, Telecommunications: 3, default: 3 },
  'Kuwait':               { Technology: 5, 'Finance & Banking': 6, Healthcare: 5, 'Energy & Oil & Gas': 5, 'Construction & Real Estate': 5, 'Retail & E-commerce': 7, Telecommunications: 6, default: 6 },
};

const COUNTRY_POLICY: Record<string, { policy: string; quota: string; desc: (sector: string) => string }> = {
  'United Arab Emirates': { policy: 'Emiratisation (Nafis)',   quota: '8% annual target', desc: (s) => s === 'Technology' ? 'Tech sector has partial exemptions. Senior specialist roles are very safe for expats.' : 'Incremental quotas mostly affect entry/mid levels. Specialist and senior expat roles remain open.' },
  'Saudi Arabia':         { policy: 'Saudisation (Nitaqat)',   quota: '30–45% (sector-dependent)', desc: (s) => s === 'Technology' ? 'Private tech sector moderately affected. Vision 2030 creates specialist exemptions for AI/Cloud roles.' : 'Significant nationalization pressure. Government and semi-govt roles are 70%+ Saudized.' },
  'Qatar':                { policy: 'Qatarisation',            quota: '20% advisory target', desc: (s) => 'Advisory and technical specialist roles remain largely open. General management roles face moderate restrictions.' },
  'Oman':                 { policy: 'Omanisation',             quota: 'Varies by sector (15–90%)', desc: (s) => 'Middle management increasingly restricted. Highly technical or specialist expat roles remain viable.' },
  'Bahrain':              { policy: 'Bahrainisation',          quota: 'Flexible fee-based',  desc: (s) => 'Most flexible GCC framework — companies can hire expats by paying higher fees. Relatively low risk.' },
  'Kuwait':               { policy: 'Kuwaitisation',           quota: '100% in Govt', desc: (s) => 'Most aggressive replacement policy in GCC. Private sector quotas rising sharply. High risk for non-niche roles.' },
};

// ─── Salary benchmarks ────────────────────────────────────────────────────────
// P25 / P50 / P75 / P90 for GCC, indexed by sector + experience band
function getSalaryPercentiles(sector: string, yearsExp: number): { p25: number; p50: number; p75: number; p90: number } {
  const base: Record<string, number> = {
    'Technology': 3600, 'Finance & Banking': 3900, 'Healthcare': 2900,
    'Energy & Oil & Gas': 4200, 'Construction & Real Estate': 3100, 'Retail & E-commerce': 2800,
    'Telecommunications': 3300,
  };
  const b = (base[sector] ?? 3200) * Math.min(yearsExp, 15);
  return { p25: Math.round(b * 0.68), p50: Math.round(b * 0.92), p75: Math.round(b * 1.18), p90: Math.round(b * 1.52) };
}

function getPercentile(value: number, p25: number, p50: number, p75: number, p90: number): number {
  if (value <= p25) return Math.round(10 + (value / p25) * 15);
  if (value <= p50) return Math.round(25 + ((value - p25) / (p50 - p25)) * 25);
  if (value <= p75) return Math.round(50 + ((value - p50) / (p75 - p50)) * 25);
  if (value <= p90) return Math.round(75 + ((value - p75) / (p90 - p75)) * 15);
  return Math.min(99, Math.round(90 + ((value - p90) / p90) * 9));
}

// ─── Exported service functions ───────────────────────────────────────────────

// Backend seam: replace with GET /api/dashboard
export function getDashboardMetrics(p: AppProfile) {
  const careerScore = Math.min(95, 50 + p.yearsExperience * 3 + Math.min(p.skills.length, 8));
  const hireProbability = Math.min(92, 55 + p.yearsExperience * 2.5 + (p.skills.length > 4 ? 8 : 3));
  const interviewReadiness = Math.min(90, 48 + p.skills.length * 5);
  const topCountry = p.targetCountries[0] ?? 'United Arab Emirates';
  return { careerScore, hireProbability, interviewReadiness, topCountry, topFlag: FLAG_MAP[topCountry] ?? '🇦🇪', topCountryShort: SHORT_COUNTRY[topCountry] ?? 'UAE', salaryPotential: p.targetSalary };
}

// Backend seam: replace with GET /api/dashboard/timeline
export function getDashboardTimeline(p: AppProfile) {
  const yr = new Date().getFullYear();
  return [0, 1, 2, 3, 4].map(i => ({
    year: String(yr + i),
    current:     i === 0 ? p.currentSalary : Math.round(p.currentSalary * Math.pow(1.065, i)),
    recommended: i === 0 ? p.currentSalary : Math.round(Math.max(p.targetSalary, p.currentSalary * 1.15) * Math.pow(1.12, i - 1)),
  }));
}

// Backend seam: replace with GET /api/skills/gaps
export function getSkillGaps(p: AppProfile) {
  const market = MARKET_SKILLS[p.sector] ?? DEFAULT_SKILLS;
  const missing = market.filter(s => !p.skills.some(ps =>
    ps.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(ps.toLowerCase())
  ));
  const colors = ['bg-red-500', 'bg-amber-500', 'bg-amber-500', 'bg-yellow-500', 'bg-green-500'];
  return missing.slice(0, 5).map((name, i) => ({
    name,
    gap: Math.max(22, 88 - i * 14),
    color: colors[i] ?? 'bg-green-500',
  }));
}

// Backend seam: replace with GET /api/dashboard/jobs
export function getDashboardJobs(p: AppProfile) {
  const pool = JOB_POOL[p.sector] ?? DEFAULT_JOBS;
  return pool
    .filter(j => p.targetCountries.length === 0 || p.targetCountries.includes(j.country))
    .map(j => ({ ...j, match: computeMatchScore(j.requiredSkills, p.skills, p.yearsExperience), flag: FLAG_MAP[j.country] ?? '🌍' }))
    .sort((a, b) => b.match - a.match)
    .slice(0, 4);
}

// Backend seam: replace with GET /api/jobs
export function getJobsData(p: AppProfile) {
  const pool = JOB_POOL[p.sector] ?? DEFAULT_JOBS;
  const filtered = pool
    .filter(j => p.targetCountries.length === 0 || p.targetCountries.includes(j.country))
    .map(j => ({ ...j, match: computeMatchScore(j.requiredSkills, p.skills, p.yearsExperience), flag: FLAG_MAP[j.country] ?? '🌍' }))
    .sort((a, b) => b.match - a.match);
  const avgSalary = p.targetSalary;
  const ghostRate = 14 + drand(p.sector, 0, 8);
  return { jobs: filtered, avgSalary, ghostRate };
}

// Backend seam: replace with GET /api/market/demand
export function getMarketDemand(p: AppProfile) {
  return DEMAND_BY_SECTOR[p.sector] ?? DEFAULT_DEMAND;
}

// Backend seam: replace with GET /api/skills/radar
export function getSkillRadar(p: AppProfile) {
  const axes = RADAR_AXES[p.sector] ?? DEFAULT_RADAR_AXES;
  return axes.map(axis => {
    const hasSkill = axis.keywords.some(k => p.skills.some(s => s.toLowerCase().includes(k)));
    const base = hasSkill ? drand(axis.label, 68, 95) : drand(axis.label, 22, 52);
    return { subject: axis.label, A: base, B: axis.marketDemand, fullMark: 100 };
  });
}

// Backend seam: replace with GET /api/market/companies
export function getTopCompanies(p: AppProfile) {
  return (TOP_COMPANIES[p.sector] ?? DEFAULT_COMPANIES);
}

// Backend seam: replace with GET /api/salary
export function getSalaryData(p: AppProfile) {
  const percentiles = getSalaryPercentiles(p.sector, p.yearsExperience);
  const userPct = getPercentile(p.targetSalary, percentiles.p25, percentiles.p50, percentiles.p75, percentiles.p90);
  const targetK = Math.round(p.targetSalary / 1000);

  // Trend data keyed to target countries (show up to 3)
  const countriesToShow = p.targetCountries.slice(0, 3);
  const defaultCountries = ['United Arab Emirates', 'Saudi Arabia', 'Qatar'];
  const shown = countriesToShow.length > 0 ? countriesToShow : defaultCountries;
  const MONTHS = ['Jan 23', 'Jun 23', 'Jan 24', 'Jun 24', 'Jan 25', 'Jun 25'];
  const GROWTH: Record<string, number> = { 'United Arab Emirates': 1.06, 'Saudi Arabia': 1.08, 'Qatar': 1.04, 'Oman': 1.03, 'Bahrain': 1.03, 'Kuwait': 1.04 };
  const salaryTrendData = MONTHS.map((month, i) => {
    const entry: Record<string, string | number> = { month };
    shown.forEach(c => {
      const base = p.currentSalary * Math.pow(GROWTH[c] ?? 1.05, i * 0.5);
      entry[SHORT_COUNTRY[c] ?? c] = Math.round(base);
    });
    return entry;
  });

  const trendKeys = shown.map(c => SHORT_COUNTRY[c] ?? c);

  const deltaData = shown.map(c => ({
    country: SHORT_COUNTRY[c] ?? c,
    national: Math.round(p.targetSalary * 1.28),
    expat: Math.round(p.targetSalary * 0.95),
  }));

  return { percentiles, userPercentile: userPct, targetK, salaryTrendData, trendKeys, deltaData, medianRate: percentiles.p50 };
}

// Backend seam: replace with GET /api/nationalization
export function getNationalizationData(p: AppProfile) {
  const countriesToAnalyze = p.targetCountries.length > 0 ? p.targetCountries : ['United Arab Emirates', 'Saudi Arabia', 'Qatar'];
  const risks = countriesToAnalyze.map(c => {
    const r = (NATL_RISK[c] ?? {})[p.sector] ?? (NATL_RISK[c] ?? {})['default'] ?? 5;
    return r;
  });
  const avgRisk = risks.reduce((a, b) => a + b, 0) / risks.length;
  const score = Math.round(avgRisk * 10) / 10;

  const scoreColor = score <= 3 ? '#22c55e' : score <= 5.5 ? '#f59e0b' : '#ef4444';
  const riskLabel = score <= 3 ? 'Low' : score <= 5.5 ? 'Moderate' : 'High';

  const highRiskCountries = countriesToAnalyze.filter(c => {
    const r = (NATL_RISK[c] ?? {})[p.sector] ?? 5;
    return r >= 6;
  });

  const riskDescription = highRiskCountries.length > 0
    ? `${riskLabel} risk across your target markets. ${highRiskCountries.map(c => SHORT_COUNTRY[c]).join(' and ')} have active quotas affecting ${p.sector} ${p.yearsExperience >= 7 ? 'senior leadership' : 'mid-level'} roles.`
    : `${riskLabel} risk overall. ${p.sector} sector expat roles are relatively protected in your target markets.`;

  // Build per-country risk details
  const allSixCountries = ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Oman', 'Bahrain', 'Kuwait'];
  const countryDetails = allSixCountries.map(c => {
    const r = (NATL_RISK[c] ?? {})[p.sector] ?? (NATL_RISK[c] ?? {})['default'] ?? 5;
    const riskLevel = r <= 3 ? 'Low' : r <= 5 ? 'Medium' : 'High';
    const pol = COUNTRY_POLICY[c] ?? { policy: 'National quota', quota: 'TBD', desc: () => 'Policies apply.' };
    return {
      country: c, flag: FLAG_MAP[c] ?? '🌍', policy: pol.policy, quota: pol.quota,
      risk: riskLevel, desc: pol.desc(p.sector),
      color: riskLevel === 'Low' ? 'text-green-500' : riskLevel === 'Medium' ? 'text-amber-500' : 'text-red-500',
      bg: riskLevel === 'Low' ? 'bg-green-500/10' : riskLevel === 'Medium' ? 'bg-amber-500/10' : 'bg-red-500/10',
      border: riskLevel === 'Low' ? 'border-green-500/20' : riskLevel === 'Medium' ? 'border-amber-500/20' : 'border-red-500/20',
    };
  });

  return { score, scoreColor, riskLabel, riskDescription, countryDetails };
}

// Backend seam: replace with GET /api/career-twin/messages
export function getCareerTwinMessages(p: AppProfile): Array<{ role: string; content: string }> {
  const topCountry = SHORT_COUNTRY[p.targetCountries[0]] ?? 'UAE';
  const secondCountry = p.targetCountries.length > 1 ? SHORT_COUNTRY[p.targetCountries[1]] : 'KSA';
  const riskCountry = p.targetCountries.find(c => (NATL_RISK[c] ?? {})[p.sector] >= 5) ?? p.targetCountries[0];
  const riskCountryShort = SHORT_COUNTRY[riskCountry] ?? 'KSA';
  const careerScore = Math.min(95, 50 + p.yearsExperience * 3 + Math.min(p.skills.length, 8));
  const hirePct = Math.min(92, 55 + p.yearsExperience * 2.5 + (p.skills.length > 4 ? 8 : 3));

  return [
    {
      role: 'assistant',
      content: `Hi ${p.name}! I'm your Career Twin. I've analyzed your ${p.yearsExperience}-year ${p.sector} career as a ${p.currentRole}.\n\nYour current career score is ${careerScore}/100. You have ${p.skills.length} indexed skills — your strongest signals for ${topCountry} are ${p.skills.slice(0, 2).join(' and ')}. Where do you want to be in 5 years?`,
    },
    {
      role: 'user',
      content: `I want to reach a VP/Director level, ideally in ${topCountry}${secondCountry ? ` or ${secondCountry}` : ''}. But I'm worried about nationalization pushing me out of leadership roles.`,
    },
    {
      role: 'assistant',
      content: `Valid concern, and one I can model precisely. In ${riskCountryShort}, VP-level ${p.sector} roles in government/semi-govt carry ${(NATL_RISK[riskCountry] ?? {})[p.sector] >= 6 ? 'high (70%+)' : 'moderate (40%)'} nationalization restriction. But private sector ${p.sector} leadership is a different story.\n\nBased on your current trajectory, your hire probability in ${topCountry} is ${hirePct}% within 3 months at your target salary. If you add ${getSkillGaps(p)[0]?.name ?? 'in-demand skills'} to your profile, that jumps to ${Math.min(95, hirePct + 9)}%.\n\nShall I simulate the VP path vs staying at Senior level?`,
    },
  ];
}

// Backend seam: replace with GET /api/dashboard/simulations
export function getRecentSimulations(p: AppProfile) {
  const hirePct = Math.min(92, 55 + p.yearsExperience * 2.5 + (p.skills.length > 4 ? 8 : 3));
  const top = SHORT_COUNTRY[p.targetCountries[0]] ?? 'UAE';
  const second = SHORT_COUNTRY[p.targetCountries[1]] ?? 'KSA';
  return [
    { name: `${p.currentRole} → ${top} ${p.sector}`,        prob: Math.round(hirePct),       date: '2 days ago' },
    { name: `Senior ${p.currentRole} → ${second} Tech`,    prob: Math.round(hirePct - 13),  date: '1 week ago' },
    { name: `${p.sector} Lead → Bahrain FinTech`,           prob: Math.round(hirePct - 26),  date: '2 weeks ago' },
  ];
}
