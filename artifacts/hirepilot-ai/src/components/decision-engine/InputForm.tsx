import React, { useState, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown, ChevronUp, X, Plus, Zap, AlertCircle } from 'lucide-react';
import type { UserProfile } from './types';

interface Props {
  onSubmit: (profile: UserProfile) => void;
  isLoading?: boolean;
  /** Pre-populate form from the shared AppProfile */
  initialProfile?: Partial<Omit<UserProfile, 'question'>>;
}

const EXAMPLE_QUESTIONS = [
  "Should I move from Dubai to Riyadh as a senior product manager?",
  "What's my chance of getting hired in UAE as a Python engineer from Egypt?",
  "Can I realistically get AED 40K/month as a finance director in Qatar?",
  "Is it a good time to relocate from KSA to UAE as a data scientist?",
  "Will Saudisation affect my job security as a software architect in Riyadh?",
];

const GCC_COUNTRIES = [
  'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Oman', 'Bahrain', 'Kuwait',
];

const NATIONALITIES = [
  'Egyptian', 'Indian', 'Pakistani', 'Filipino', 'British', 'American', 'Lebanese',
  'Jordanian', 'Syrian', 'Sudanese', 'Bangladeshi', 'Sri Lankan', 'Nepali',
  'Canadian', 'South African', 'French', 'German', 'Australian', 'Other',
];

const VISA_STATUSES = [
  'Employment Visa', 'Family / Dependent Visa', 'Freelance / Mission Visa',
  'GCC Citizen', 'Tourist / Visit Visa', 'Golden Visa', 'Student Visa',
];

const SECTORS = [
  'Technology', 'Finance & Banking', 'Healthcare', 'Energy & Oil & Gas',
  'Construction & Real Estate', 'Retail & E-commerce', 'Telecommunications',
  'Hospitality & Tourism', 'Education', 'Government & Public Sector', 'Other',
];

const CAREER_GOALS = [
  'Get a new job in GCC', 'Relocate to a different GCC country', 'Negotiate a salary raise',
  'Assess nationalization risk', 'Evaluate multiple country options', 'Career pivot to new sector',
  'Understand visa / sponsorship pathway', 'Plan 5-year GCC career strategy',
];

const EDUCATION_LEVELS = [
  'High School / Diploma', "Bachelor's Degree", "Master's Degree", 'MBA', 'PhD', 'Professional Certification',
];

const SUGGESTED_SKILLS: Record<string, string[]> = {
  Technology:            ['Python', 'JavaScript', 'React', 'AWS', 'Azure', 'AI/ML', 'SQL', 'DevOps', 'Kubernetes', 'TypeScript'],
  'Finance & Banking':  ['Financial Modelling', 'Bloomberg', 'Risk Management', 'Treasury', 'Compliance', 'IFRS', 'CFA'],
  Healthcare:           ['Clinical Management', 'EMR Systems', 'Patient Care', 'HAAD', 'DHA', 'Surgery', 'Radiology'],
  'Energy & Oil & Gas': ['HSE Management', 'Asset Integrity', 'Project Controls', 'FEED', 'Commissioning', 'SAP PM'],
};

export default function InputForm({ onSubmit, isLoading, initialProfile }: Props) {
  const [question, setQuestion]   = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [skillInput, setSkillInput]   = useState('');
  const [errors, setErrors]           = useState<Record<string, string>>({});

  const [profile, setProfile] = useState<Omit<UserProfile, 'question'>>({
    nationality:     initialProfile?.nationality     ?? 'Egyptian',
    visaStatus:      initialProfile?.visaStatus      ?? 'Employment Visa',
    currentRole:     initialProfile?.currentRole     ?? '',
    yearsExperience: initialProfile?.yearsExperience ?? 6,
    skills:          initialProfile?.skills          ? [...initialProfile.skills] : ['Python', 'AWS', 'SQL'],
    education:       initialProfile?.education       ?? "Bachelor's Degree",
    currentSalary:   initialProfile?.currentSalary   ?? 22000,
    targetSalary:    initialProfile?.targetSalary    ?? 35000,
    targetCountries: initialProfile?.targetCountries ? [...initialProfile.targetCountries] : ['United Arab Emirates', 'Saudi Arabia'],
    careerGoal:      initialProfile?.careerGoal      ?? 'Get a new job in GCC',
    sector:          initialProfile?.sector          ?? 'Technology',
  });

  const set = (key: keyof typeof profile, val: unknown) =>
    setProfile((p) => ({ ...p, [key]: val }));

  const addSkill = (skill: string) => {
    const s = skill.trim();
    if (s && !profile.skills.includes(s)) set('skills', [...profile.skills, s]);
    setSkillInput('');
  };

  const removeSkill = (skill: string) =>
    set('skills', profile.skills.filter((s) => s !== skill));

  const toggleCountry = (c: string) => {
    set('targetCountries',
      profile.targetCountries.includes(c)
        ? profile.targetCountries.filter((x) => x !== c)
        : [...profile.targetCountries, c]
    );
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!question.trim())           errs.question    = 'Please enter your career question';
    if (!profile.currentRole.trim())errs.currentRole = 'Required';
    if (profile.targetCountries.length === 0) errs.countries = 'Select at least one country';
    if (profile.skills.length === 0)          errs.skills    = 'Add at least one skill';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ question: question.trim(), ...profile });
  };

  const suggestedSkills = SUGGESTED_SKILLS[profile.sector] ?? [];

  return (
    <div className="space-y-6">
      {/* ── Question textarea ── */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          What career decision do you need help with?
        </label>
        <div className="relative">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Should I move from Dubai to Riyadh as a senior software engineer? What's my chance of landing a role in UAE with 8 years experience?"
            rows={3}
            className={`w-full bg-background/60 border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all ${
              errors.question ? 'border-destructive' : 'border-border/60 hover:border-border'
            }`}
          />
          {errors.question && (
            <p className="mt-1 text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.question}
            </p>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLE_QUESTIONS.map((q) => (
            <button key={q} onClick={() => setQuestion(q)}
              className="text-xs px-3 py-1.5 rounded-full border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all">
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* ── Profile collapsible ── */}
      <div className="border border-border/50 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowProfile((s) => !s)}
          className="w-full flex items-center justify-between px-5 py-4 bg-card/40 hover:bg-card/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">2</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Your Professional Profile</p>
              <p className="text-xs text-muted-foreground">
                {profile.nationality} · {profile.yearsExperience} yrs · {profile.sector} · {profile.skills.length} skills · {profile.targetCountries.length} target countries
              </p>
            </div>
          </div>
          {showProfile ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>

        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-5 py-6 space-y-6 border-t border-border/30 bg-background/30">
                {/* Row 1: Identity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="field-label">Nationality</label>
                    <select value={profile.nationality} onChange={(e) => set('nationality', e.target.value)} className="field-input">
                      {NATIONALITIES.map((n) => <option key={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Visa Status</label>
                    <select value={profile.visaStatus} onChange={(e) => set('visaStatus', e.target.value)} className="field-input">
                      {VISA_STATUSES.map((v) => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="field-label">Education</label>
                    <select value={profile.education} onChange={(e) => set('education', e.target.value)} className="field-input">
                      {EDUCATION_LEVELS.map((e) => <option key={e}>{e}</option>)}
                    </select>
                  </div>
                </div>

                {/* Row 2: Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="field-label">
                      Current Role / Job Title
                      {errors.currentRole && <span className="ml-2 text-destructive text-xs">{errors.currentRole}</span>}
                    </label>
                    <input type="text" value={profile.currentRole} onChange={(e) => set('currentRole', e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                      className={`field-input ${errors.currentRole ? 'border-destructive' : ''}`} />
                  </div>
                  <div>
                    <label className="field-label">Sector</label>
                    <select value={profile.sector} onChange={(e) => set('sector', e.target.value)} className="field-input">
                      {SECTORS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Row 3: Experience slider */}
                <div>
                  <label className="field-label">
                    Years of Experience
                    <span className="ml-2 text-primary font-semibold">{profile.yearsExperience} years</span>
                  </label>
                  <input type="range" min={0} max={25} value={profile.yearsExperience}
                    onChange={(e) => set('yearsExperience', Number(e.target.value))}
                    className="w-full h-2 rounded-full accent-primary bg-muted cursor-pointer" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0 yrs</span><span>5 yrs</span><span>10 yrs</span><span>15 yrs</span><span>20+ yrs</span>
                  </div>
                </div>

                {/* Row 4: Skills */}
                <div>
                  <label className="field-label">
                    Skills
                    {errors.skills && <span className="ml-2 text-destructive text-xs">{errors.skills}</span>}
                  </label>
                  <div className={`min-h-[44px] flex flex-wrap gap-2 p-2 border rounded-lg bg-background/60 transition-colors ${errors.skills ? 'border-destructive' : 'border-border/60'}`}>
                    {profile.skills.map((s) => (
                      <span key={s} className="flex items-center gap-1 bg-primary/15 text-primary text-xs px-2 py-1 rounded-full">
                        {s}
                        <button onClick={() => removeSkill(s)} className="hover:text-destructive transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(skillInput); }
                      }}
                      placeholder="Type & press Enter..."
                      className="flex-1 min-w-[120px] bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
                  </div>
                  {suggestedSkills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {suggestedSkills.filter((s) => !profile.skills.includes(s)).slice(0, 7).map((s) => (
                        <button key={s} onClick={() => addSkill(s)}
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-dashed border-border/60 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all">
                          <Plus className="h-2.5 w-2.5" /> {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Row 5: Salary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="field-label">Current Monthly Salary (AED)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">AED</span>
                      <input type="number" value={profile.currentSalary} onChange={(e) => set('currentSalary', Number(e.target.value))}
                        className="field-input pl-12" placeholder="22000" />
                    </div>
                  </div>
                  <div>
                    <label className="field-label">Target Monthly Salary (AED)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">AED</span>
                      <input type="number" value={profile.targetSalary} onChange={(e) => set('targetSalary', Number(e.target.value))}
                        className="field-input pl-12" placeholder="35000" />
                    </div>
                  </div>
                </div>

                {/* Row 6: Target countries */}
                <div>
                  <label className="field-label">
                    Target Countries (GCC)
                    {errors.countries && <span className="ml-2 text-destructive text-xs">{errors.countries}</span>}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                    {GCC_COUNTRIES.map((c) => {
                      const selected = profile.targetCountries.includes(c);
                      return (
                        <button key={c} onClick={() => toggleCountry(c)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                            selected ? 'border-primary/60 bg-primary/10 text-primary' : 'border-border/50 text-muted-foreground hover:border-border hover:text-foreground'
                          }`}>
                          <div className={`h-4 w-4 rounded border flex items-center justify-center transition-all ${selected ? 'bg-primary border-primary' : 'border-border'}`}>
                            {selected && <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 10 10"><path d="M1.5 5l2.5 2.5 5-5" stroke="currentColor" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </div>
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Row 7: Career goal */}
                <div>
                  <label className="field-label">Primary Career Goal</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                    {CAREER_GOALS.map((g) => (
                      <button key={g} onClick={() => set('careerGoal', g)}
                        className={`text-left px-3 py-2 rounded-lg border text-sm transition-all ${
                          profile.careerGoal === g ? 'border-accent/60 bg-accent/10 text-accent' : 'border-border/50 text-muted-foreground hover:border-border hover:text-foreground'
                        }`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── CTA ── */}
      <motion.button
        onClick={handleSubmit}
        disabled={isLoading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Initialising engines…
          </>
        ) : (
          <>
            <Zap className="h-5 w-5" />
            Begin AI Analysis
            <Sparkles className="h-4 w-4 opacity-70" />
          </>
        )}
      </motion.button>
    </div>
  );
}
