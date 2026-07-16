// ─── Intelligence Engine — Shared Data Constants ─────────────────────────────
// All static lookup tables used across engine modules live here so every module
// reads from the same source. When a real API is wired, these tables are replaced
// by server-side data — no module code changes needed.

// ─── Country helpers ─────────────────────────────────────────────────────────

export const FLAG_MAP: Record<string, string> = {
  'United Arab Emirates': '🇦🇪', 'Saudi Arabia': '🇸🇦', 'Qatar': '🇶🇦',
  'Oman': '🇴🇲', 'Bahrain': '🇧🇭', 'Kuwait': '🇰🇼',
};

export const SHORT_COUNTRY: Record<string, string> = {
  'United Arab Emirates': 'UAE', 'Saudi Arabia': 'KSA', 'Qatar': 'Qatar',
  'Oman': 'Oman', 'Bahrain': 'Bahrain', 'Kuwait': 'Kuwait',
};

// ─── Market skills by sector ─────────────────────────────────────────────────

export const MARKET_SKILLS: Record<string, string[]> = {
  'Technology':                   ['Cloud Architecture', 'AI/ML', 'System Design', 'Python', 'DevOps', 'Kubernetes', 'Data Analytics', 'TypeScript'],
  'Finance & Banking':            ['Financial Modelling', 'Bloomberg Terminal', 'Risk Management', 'IFRS 9', 'AML/KYC', 'Treasury', 'CFA'],
  'Healthcare':                   ['HAAD/DHA Compliance', 'EMR Systems', 'Clinical Governance', 'Patient Safety', 'Digital Health', 'JAWDA'],
  'Energy & Oil & Gas':           ['HSE Management', 'Asset Integrity', 'Project Controls', 'FEED', 'Commissioning', 'SAP PM'],
  'Construction & Real Estate':   ['BIM', 'Primavera P6', 'NEC Contracts', 'FIDIC', 'Quantity Surveying', 'Smart Building Tech'],
  'Retail & E-commerce':          ['Merchandising Analytics', 'D2C Strategy', 'Inventory Optimisation', 'Shopify', 'Growth Hacking', 'CRM'],
  'Telecommunications':           ['5G Architecture', 'Network Slicing', 'OSS/BSS', 'MVNO', 'Spectrum Management', 'VoIP/IMS'],
};

// ─── Sector demand metrics ────────────────────────────────────────────────────

export const DEMAND_BY_SECTOR: Record<string, { score: number; velocity: number; avgDays: number; note: string }> = {
  'Technology':                 { score: 9.1, velocity: 24, avgDays: 19, note: 'AI & Cloud driving record GCC tech hiring in 2025' },
  'Finance & Banking':          { score: 7.8, velocity: 12, avgDays: 27, note: 'FinTech and Open Banking mandates accelerating demand' },
  'Healthcare':                 { score: 8.3, velocity: 18, avgDays: 22, note: 'Vision 2030 healthcare expansion creating surge demand' },
  'Energy & Oil & Gas':         { score: 7.2, velocity: 9,  avgDays: 31, note: 'Net-zero transition creating new energy transition roles' },
  'Construction & Real Estate': { score: 7.5, velocity: 11, avgDays: 29, note: 'Giga-projects sustaining strong construction demand' },
  'Retail & E-commerce':        { score: 6.9, velocity: 8,  avgDays: 24, note: 'Post-COVID normalisation slowing but still positive' },
  'Telecommunications':         { score: 7.4, velocity: 13, avgDays: 26, note: '5G rollout and spectrum auctions driving network hiring' },
};

// ─── Radar chart axes by sector ───────────────────────────────────────────────

export const RADAR_AXES: Record<string, Array<{ label: string; keywords: string[]; marketDemand: number }>> = {
  'Technology': [
    { label: 'Cloud/DevOps',     keywords: ['cloud', 'aws', 'azure', 'devops', 'kubernetes'], marketDemand: 90 },
    { label: 'AI/ML',            keywords: ['ai', 'ml', 'machine learning', 'python', 'data science'], marketDemand: 95 },
    { label: 'Agile/PM',         keywords: ['agile', 'scrum', 'product', 'roadmap'], marketDemand: 80 },
    { label: 'System Design',    keywords: ['system design', 'architecture', 'microservices'], marketDemand: 85 },
    { label: 'Data Analytics',   keywords: ['analytics', 'sql', 'tableau', 'data'], marketDemand: 78 },
    { label: 'Stakeholder Mgmt', keywords: ['stakeholder', 'management', 'leadership'], marketDemand: 75 },
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
    { label: 'Clinical Governance',    keywords: ['clinical', 'governance', 'quality'], marketDemand: 90 },
    { label: 'Digital Health',         keywords: ['digital health', 'emr', 'ehr', 'telemedicine'], marketDemand: 88 },
    { label: 'Regulatory (HAAD/DHA)',  keywords: ['haad', 'dha', 'regulatory', 'compliance'], marketDemand: 92 },
    { label: 'Patient Safety',         keywords: ['patient safety', 'incident', 'jci'], marketDemand: 85 },
    { label: 'Operations',             keywords: ['operations', 'management', 'leadership'], marketDemand: 75 },
    { label: 'Research/Innovation',    keywords: ['research', 'innovation', 'r&d'], marketDemand: 70 },
  ],
  'Energy & Oil & Gas': [
    { label: 'Project Controls',   keywords: ['project controls', 'primavera', 'scheduling'], marketDemand: 88 },
    { label: 'HSE Management',     keywords: ['hse', 'safety', 'environment'], marketDemand: 90 },
    { label: 'Asset Integrity',    keywords: ['asset integrity', 'inspection', 'rbi'], marketDemand: 85 },
    { label: 'FEED/Engineering',   keywords: ['feed', 'engineering', 'design'], marketDemand: 80 },
    { label: 'Commissioning',      keywords: ['commissioning', 'startup', 'handover'], marketDemand: 75 },
    { label: 'Digital/SAP',        keywords: ['sap', 'digital', 'iiot'], marketDemand: 78 },
  ],
};

// ─── Top companies by sector ──────────────────────────────────────────────────

export const TOP_COMPANIES: Record<string, Array<{ name: string; roles: number; growth: string }>> = {
  'Technology':                   [{ name: 'G42', roles: 187, growth: '+31%' }, { name: 'Careem', roles: 142, growth: '+18%' }, { name: 'Noon', roles: 119, growth: '+24%' }, { name: 'ADNOC Digital', roles: 98, growth: '+42%' }, { name: 'stc pay', roles: 74, growth: '+15%' }],
  'Finance & Banking':            [{ name: 'Emirates NBD', roles: 124, growth: '+14%' }, { name: 'FAB', roles: 98, growth: '+11%' }, { name: 'QNB', roles: 82, growth: '+9%' }, { name: 'Al Rajhi Bank', roles: 76, growth: '+22%' }, { name: 'Arab Bank', roles: 55, growth: '+6%' }],
  'Healthcare':                   [{ name: 'Cleveland Clinic Abu Dhabi', roles: 89, growth: '+28%' }, { name: 'NMC Healthcare', roles: 76, growth: '+12%' }, { name: 'Mediclinic', roles: 65, growth: '+9%' }, { name: 'Saudi MOH', roles: 210, growth: '+35%' }, { name: 'Aster DM', roles: 54, growth: '+17%' }],
  'Energy & Oil & Gas':           [{ name: 'Saudi Aramco', roles: 156, growth: '+8%' }, { name: 'ADNOC', roles: 134, growth: '+19%' }, { name: 'QatarEnergy', roles: 88, growth: '+12%' }, { name: 'OQ Oman', roles: 45, growth: '+5%' }, { name: 'Baker Hughes', roles: 67, growth: '+14%' }],
  'Construction & Real Estate':   [{ name: 'NEOM', roles: 312, growth: '+55%' }, { name: 'Emaar', roles: 98, growth: '+18%' }, { name: 'ALEC', roles: 76, growth: '+12%' }, { name: 'Arcadis', roles: 55, growth: '+9%' }, { name: 'Parsons', roles: 44, growth: '+7%' }],
  'Retail & E-commerce':          [{ name: 'Noon', roles: 145, growth: '+22%' }, { name: 'Amazon.ae', roles: 98, growth: '+18%' }, { name: 'Landmark Group', roles: 76, growth: '+9%' }, { name: 'Majid Al Futtaim', roles: 55, growth: '+12%' }, { name: 'Ounass', roles: 34, growth: '+35%' }],
  'Telecommunications':           [{ name: 'Etisalat (e&)', roles: 134, growth: '+16%' }, { name: 'STC', roles: 112, growth: '+14%' }, { name: 'Ooredoo', roles: 78, growth: '+9%' }, { name: 'Zain', roles: 65, growth: '+7%' }, { name: 'du', roles: 54, growth: '+11%' }],
};

// ─── Job pool by sector ───────────────────────────────────────────────────────

export interface RawJob {
  id: number; title: string; company: string; sector: string;
  country: string; loc: string; salaryLabel: string; tags: string[];
  ghostRisk: number; isGhost?: boolean; posted: string; requiredSkills: string[];
}

export const JOB_POOL: Record<string, RawJob[]> = {
  'Technology': [
    { id: 1,  title: 'Senior Product Manager',    company: 'Noon',          sector: 'E-commerce',      country: 'United Arab Emirates', loc: 'Dubai',     salaryLabel: 'AED 35K–45K',             tags: ['Senior', 'Hybrid', 'Agile'],         ghostRisk: 12, posted: '2 days ago',  requiredSkills: ['Product Strategy', 'Agile/Scrum', 'Stakeholder Mgmt', 'Data Analytics'] },
    { id: 2,  title: 'Head of Product',            company: 'Careem',        sector: 'Super-App',       country: 'United Arab Emirates', loc: 'Dubai',     salaryLabel: 'AED 40K–55K',             tags: ['Lead', 'Hybrid', 'B2C'],             ghostRisk: 8,  posted: '3 days ago',  requiredSkills: ['Product Strategy', 'Data Analytics', 'Stakeholder Mgmt', 'Roadmapping'] },
    { id: 3,  title: 'Lead PM – AI Initiatives',  company: 'G42',           sector: 'AI / Smart City', country: 'United Arab Emirates', loc: 'Abu Dhabi', salaryLabel: 'Disclosed to candidates', tags: ['Senior', 'On-site', 'AI/ML'],        ghostRisk: 5,  posted: '1 week ago',  requiredSkills: ['AI/ML', 'Product Strategy', 'Python', 'System Design'] },
    { id: 4,  title: 'Director of Product',        company: 'Confidential',  sector: 'FinTech',         country: 'Saudi Arabia',         loc: 'Riyadh',    salaryLabel: 'SAR 50K–65K',             tags: ['Director', 'On-site', 'Payments'],   ghostRisk: 85, isGhost: true, posted: '5 hrs ago',   requiredSkills: ['Product Strategy', 'Roadmapping', 'Stakeholder Mgmt'] },
    { id: 5,  title: 'VP Product Engineering',     company: 'Saudi Aramco',  sector: 'Energy / Tech',   country: 'Saudi Arabia',         loc: 'Dhahran',   salaryLabel: 'SAR 70K+',                tags: ['Executive', 'On-site', 'Enterprise'], ghostRisk: 2,  posted: '2 weeks ago', requiredSkills: ['System Design', 'Cloud Architecture', 'DevOps'] },
    { id: 6,  title: 'Technical PM',               company: 'Wio Bank',      sector: 'AI / Cloud',      country: 'United Arab Emirates', loc: 'Abu Dhabi', salaryLabel: 'AED 30K–40K',             tags: ['Senior', 'Hybrid', 'Cloud'],         ghostRisk: 8,  posted: '1 day ago',   requiredSkills: ['Cloud Architecture', 'Python', 'System Design', 'Agile/Scrum'] },
    { id: 7,  title: 'Product Owner – Payments',   company: 'stc pay',       sector: 'FinTech',         country: 'Saudi Arabia',         loc: 'Riyadh',    salaryLabel: 'SAR 28K–36K',             tags: ['Mid', 'Hybrid', 'Payments'],         ghostRisk: 14, posted: '4 days ago',  requiredSkills: ['Agile/Scrum', 'Roadmapping', 'Stakeholder Mgmt'] },
    { id: 8,  title: 'Engineering Manager',        company: 'Talabat',       sector: 'FoodTech',        country: 'Qatar',                loc: 'Doha',      salaryLabel: 'QAR 35K–45K',             tags: ['Lead', 'Hybrid', 'Platform'],        ghostRisk: 18, posted: '3 days ago',  requiredSkills: ['System Design', 'DevOps', 'Stakeholder Mgmt', 'Agile/Scrum'] },
  ],
  'Finance & Banking': [
    { id: 1,  title: 'Senior Financial Analyst',   company: 'Emirates NBD',  sector: 'Retail Banking',  country: 'United Arab Emirates', loc: 'Dubai',     salaryLabel: 'AED 28K–38K',             tags: ['Senior', 'On-site', 'Analytics'],    ghostRisk: 5,  posted: '2 days ago',  requiredSkills: ['Financial Modelling', 'Bloomberg Terminal', 'IFRS 9'] },
    { id: 2,  title: 'Head of Risk Management',    company: 'QNB',           sector: 'Investment Bank', country: 'Qatar',                loc: 'Doha',      salaryLabel: 'QAR 40K–55K',             tags: ['Lead', 'On-site', 'Risk'],           ghostRisk: 8,  posted: '1 week ago',  requiredSkills: ['Risk Management', 'AML/KYC', 'Compliance'] },
    { id: 3,  title: 'Director of Treasury',       company: 'FAB',           sector: 'Banking',         country: 'United Arab Emirates', loc: 'Abu Dhabi', salaryLabel: 'AED 45K–60K',             tags: ['Director', 'On-site', 'Treasury'],   ghostRisk: 4,  posted: '5 days ago',  requiredSkills: ['Treasury', 'FX', 'Financial Modelling', 'Bloomberg Terminal'] },
    { id: 4,  title: 'VP Compliance & AML',        company: 'Al Rajhi Bank', sector: 'Islamic Banking', country: 'Saudi Arabia',         loc: 'Riyadh',    salaryLabel: 'SAR 38K–50K',             tags: ['Senior', 'On-site', 'Compliance'],   ghostRisk: 6,  posted: '3 days ago',  requiredSkills: ['AML/KYC', 'Compliance', 'Risk Management'] },
    { id: 5,  title: 'Senior FinTech PM',          company: 'Tabby',         sector: 'FinTech',         country: 'United Arab Emirates', loc: 'Dubai',     salaryLabel: 'AED 30K–42K',             tags: ['Senior', 'Hybrid', 'FinTech'],       ghostRisk: 12, posted: '2 days ago',  requiredSkills: ['FinTech', 'Risk Management', 'Financial Modelling'] },
    { id: 6,  title: 'Investment Analyst',         company: 'Mubadala',      sector: 'Sovereign Wealth',country: 'United Arab Emirates', loc: 'Abu Dhabi', salaryLabel: 'AED 40K–55K',             tags: ['Senior', 'On-site', 'PE/VC'],        ghostRisk: 7,  posted: '1 week ago',  requiredSkills: ['Financial Modelling', 'Valuation', 'Bloomberg Terminal'] },
  ],
  'Healthcare': [
    { id: 1,  title: 'Medical Director',           company: 'Cleveland Clinic Abu Dhabi', sector: 'Hospital',       country: 'United Arab Emirates', loc: 'Abu Dhabi', salaryLabel: 'AED 55K–80K', tags: ['Executive', 'On-site', 'Clinical'],  ghostRisk: 3, posted: '1 week ago',  requiredSkills: ['Clinical Governance', 'HAAD/DHA Compliance', 'Patient Safety'] },
    { id: 2,  title: 'Head of Digital Health',     company: 'NMC Healthcare',             sector: 'Digital Health', country: 'United Arab Emirates', loc: 'Dubai',     salaryLabel: 'AED 35K–48K', tags: ['Lead', 'Hybrid', 'Digital'],         ghostRisk: 9, posted: '3 days ago',  requiredSkills: ['Digital Health', 'EMR Systems', 'Operations'] },
    { id: 3,  title: 'Clinical Quality Manager',   company: 'Saudi MOH',                  sector: 'Govt Healthcare',country: 'Saudi Arabia',         loc: 'Riyadh',    salaryLabel: 'SAR 30K–42K', tags: ['Senior', 'On-site', 'Quality'],      ghostRisk: 6, posted: '5 days ago',  requiredSkills: ['HAAD/DHA Compliance', 'Clinical Governance', 'Patient Safety'] },
    { id: 4,  title: 'Hospital Operations Director',company: 'Mediclinic',                sector: 'Hospital',       country: 'United Arab Emirates', loc: 'Dubai',     salaryLabel: 'AED 42K–60K', tags: ['Director', 'On-site', 'Operations'], ghostRisk: 5, posted: '2 weeks ago', requiredSkills: ['Operations', 'Clinical Governance', 'Patient Safety'] },
  ],
  'Energy & Oil & Gas': [
    { id: 1, title: 'Senior Project Manager',      company: 'ADNOC',         sector: 'Upstream',         country: 'United Arab Emirates', loc: 'Abu Dhabi', salaryLabel: 'AED 45K–65K', tags: ['Senior', 'On-site', 'Upstream'],   ghostRisk: 4, posted: '1 week ago',  requiredSkills: ['Project Controls', 'HSE Management', 'FEED'] },
    { id: 2, title: 'Asset Integrity Lead',         company: 'Saudi Aramco',  sector: 'Downstream',       country: 'Saudi Arabia',         loc: 'Dhahran',   salaryLabel: 'SAR 55K–75K', tags: ['Lead', 'On-site', 'Integrity'],    ghostRisk: 3, posted: '3 days ago',  requiredSkills: ['Asset Integrity', 'HSE Management', 'SAP PM'] },
    { id: 3, title: 'Head of Energy Transition',   company: 'QatarEnergy',   sector: 'LNG / Renewables', country: 'Qatar',                loc: 'Doha',      salaryLabel: 'QAR 55K–70K', tags: ['Lead', 'On-site', 'Renewables'],   ghostRisk: 6, posted: '5 days ago',  requiredSkills: ['FEED', 'Project Controls', 'Commissioning'] },
    { id: 4, title: 'HSE Manager',                  company: 'Baker Hughes',  sector: 'Oilfield Services',country: 'United Arab Emirates', loc: 'Dubai',     salaryLabel: 'AED 28K–38K', tags: ['Senior', 'On-site', 'HSE'],        ghostRisk: 7, posted: '4 days ago',  requiredSkills: ['HSE Management', 'Commissioning', 'Asset Integrity'] },
  ],
  'Construction & Real Estate': [
    { id: 1, title: 'Project Director',             company: 'NEOM',          sector: 'Giga-project',    country: 'Saudi Arabia',         loc: 'Tabuk',     salaryLabel: 'SAR 70K+',    tags: ['Executive', 'On-site', 'Mega'],    ghostRisk: 3, posted: '1 week ago',  requiredSkills: ['Primavera P6', 'NEC Contracts', 'FIDIC'] },
    { id: 2, title: 'BIM Manager',                  company: 'Emaar',         sector: 'Real Estate',     country: 'United Arab Emirates', loc: 'Dubai',     salaryLabel: 'AED 30K–42K', tags: ['Senior', 'Hybrid', 'Digital'],     ghostRisk: 6, posted: '3 days ago',  requiredSkills: ['BIM', 'Smart Building Tech', 'Quantity Surveying'] },
    { id: 3, title: 'Quantity Surveyor Lead',       company: 'ALEC',          sector: 'Construction',    country: 'United Arab Emirates', loc: 'Dubai',     salaryLabel: 'AED 25K–35K', tags: ['Senior', 'On-site', 'QS'],        ghostRisk: 5, posted: '4 days ago',  requiredSkills: ['Quantity Surveying', 'NEC Contracts', 'FIDIC'] },
  ],
};

// ─── Nationalization risk (1=low, 10=high) ────────────────────────────────────

export const NATL_RISK: Record<string, Record<string, number>> = {
  'United Arab Emirates': { Technology: 2, 'Finance & Banking': 3, Healthcare: 3, 'Energy & Oil & Gas': 3, 'Construction & Real Estate': 3, 'Retail & E-commerce': 4, Telecommunications: 3, default: 3 },
  'Saudi Arabia':         { Technology: 5, 'Finance & Banking': 6, Healthcare: 5, 'Energy & Oil & Gas': 4, 'Construction & Real Estate': 5, 'Retail & E-commerce': 6, Telecommunications: 5, default: 5 },
  'Qatar':                { Technology: 3, 'Finance & Banking': 4, Healthcare: 3, 'Energy & Oil & Gas': 3, 'Construction & Real Estate': 3, 'Retail & E-commerce': 4, Telecommunications: 3, default: 3 },
  'Oman':                 { Technology: 5, 'Finance & Banking': 5, Healthcare: 5, 'Energy & Oil & Gas': 5, 'Construction & Real Estate': 5, 'Retail & E-commerce': 6, Telecommunications: 5, default: 5 },
  'Bahrain':              { Technology: 3, 'Finance & Banking': 4, Healthcare: 3, 'Energy & Oil & Gas': 3, 'Construction & Real Estate': 3, 'Retail & E-commerce': 4, Telecommunications: 3, default: 3 },
  'Kuwait':               { Technology: 5, 'Finance & Banking': 6, Healthcare: 5, 'Energy & Oil & Gas': 5, 'Construction & Real Estate': 5, 'Retail & E-commerce': 7, Telecommunications: 6, default: 6 },
};

export const COUNTRY_POLICY: Record<string, { policy: string; quota: string; desc: (sector: string) => string }> = {
  'United Arab Emirates': { policy: 'Emiratisation (Nafis)',    quota: '8% annual target',             desc: (s) => s === 'Technology' ? 'Tech sector has partial exemptions. Senior specialist roles are very safe for expats.' : 'Incremental quotas mostly affect entry/mid levels. Specialist and senior expat roles remain open.' },
  'Saudi Arabia':         { policy: 'Saudisation (Nitaqat)',    quota: '30–45% (sector-dependent)',    desc: (s) => s === 'Technology' ? 'Private tech sector moderately affected. Vision 2030 creates specialist exemptions for AI/Cloud roles.' : 'Significant nationalization pressure. Government and semi-govt roles are 70%+ Saudized.' },
  'Qatar':                { policy: 'Qatarisation',             quota: '20% advisory target',          desc: () => 'Advisory and technical specialist roles remain largely open. General management roles face moderate restrictions.' },
  'Oman':                 { policy: 'Omanisation',              quota: 'Varies by sector (15–90%)',    desc: () => 'Middle management increasingly restricted. Highly technical or specialist expat roles remain viable.' },
  'Bahrain':              { policy: 'Bahrainisation',           quota: 'Flexible fee-based',           desc: () => 'Most flexible GCC framework — companies can hire expats by paying higher fees. Relatively low risk.' },
  'Kuwait':               { policy: 'Kuwaitisation',            quota: '100% in Govt',                 desc: () => 'Most aggressive replacement policy in GCC. Private sector quotas rising sharply. High risk for non-niche roles.' },
};

// ─── Salary helpers ───────────────────────────────────────────────────────────

const SALARY_BASE: Record<string, number> = {
  'Technology': 3600, 'Finance & Banking': 3900, 'Healthcare': 2900,
  'Energy & Oil & Gas': 4200, 'Construction & Real Estate': 3100,
  'Retail & E-commerce': 2800, 'Telecommunications': 3300,
};

export function getSalaryPercentiles(sector: string, yearsExp: number) {
  const b = (SALARY_BASE[sector] ?? 3200) * Math.min(yearsExp, 15);
  return { p25: Math.round(b * 0.68), p50: Math.round(b * 0.92), p75: Math.round(b * 1.18), p90: Math.round(b * 1.52) };
}

export function getPercentile(value: number, p25: number, p50: number, p75: number, p90: number): number {
  if (value <= p25) return Math.round(10 + (value / p25) * 15);
  if (value <= p50) return Math.round(25 + ((value - p25) / (p50 - p25)) * 25);
  if (value <= p75) return Math.round(50 + ((value - p50) / (p75 - p50)) * 25);
  if (value <= p90) return Math.round(75 + ((value - p75) / (p90 - p75)) * 15);
  return Math.min(99, Math.round(90 + ((value - p90) / p90) * 9));
}

// ─── Shared computation helpers ───────────────────────────────────────────────

/** Deterministic pseudo-random in [min, max) seeded by a string */
export function drand(seed: string, min: number, max: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  return min + (Math.abs(h) % (max - min));
}

export function skillMatch(profileSkills: string[], required: string[]): boolean {
  return required.some(r =>
    profileSkills.some(s => s.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(s.toLowerCase()))
  );
}

export function computeMatchScore(requiredSkills: string[], profileSkills: string[], yearsExp: number): number {
  const matched = requiredSkills.filter(r => skillMatch(profileSkills, [r])).length;
  const skillPct = requiredSkills.length > 0 ? matched / requiredSkills.length : 0.5;
  return Math.min(97, Math.round(35 + skillPct * 45 + Math.min(yearsExp * 1.5, 16)));
}

/** Core hire probability formula used across all modules */
export function computeBaseHireProbability(yearsExp: number, skillCount: number): number {
  return Math.min(92, 55 + yearsExp * 2.5 + (skillCount > 4 ? 8 : 3));
}

/** Core career score formula */
export function computeBaseCareerScore(yearsExp: number, skillCount: number): number {
  return Math.min(95, 50 + yearsExp * 3 + Math.min(skillCount, 8));
}
