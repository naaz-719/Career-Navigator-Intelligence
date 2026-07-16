import React, { useState } from 'react';
import { Camera, User, Briefcase, Bell, CreditCard, Lock, Save } from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';

const GCC_COUNTRIES = [
  'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Oman', 'Bahrain', 'Kuwait',
];

const GCC_FLAG: Record<string, string> = {
  'United Arab Emirates': '🇦🇪', 'Saudi Arabia': '🇸🇦', 'Qatar': '🇶🇦',
  'Oman': '🇴🇲', 'Bahrain': '🇧🇭', 'Kuwait': '🇰🇼',
};

const NATIONALITIES = [
  'Egyptian', 'Indian', 'Pakistani', 'Filipino', 'British', 'American', 'Lebanese',
  'Jordanian', 'Syrian', 'Sudanese', 'Bangladeshi', 'Sri Lankan', 'Nepali',
  'Canadian', 'South African', 'French', 'German', 'Australian', 'Other',
];

const SECTORS = [
  'Technology', 'Finance & Banking', 'Healthcare', 'Energy & Oil & Gas',
  'Construction & Real Estate', 'Retail & E-commerce', 'Telecommunications',
];

const CAREER_GOALS = [
  'Get a new job in GCC', 'Relocate to a different GCC country', 'Negotiate a salary raise',
  'Assess nationalization risk', 'Evaluate multiple country options', 'Career pivot to new sector',
  'Understand visa / sponsorship pathway', 'Plan 5-year GCC career strategy',
];

export default function SettingsPage() {
  const { profile, updateProfile } = useProfile();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  // Local form state — mirrors profile, persisted on Save
  const [form, setForm] = useState({
    name:               profile.name,
    nationality:        profile.nationality,
    currentCountry:     profile.currentCountry,
    currentRole:        profile.currentRole,
    yearsExperience:    profile.yearsExperience,
    education:          profile.education,
    linkedinUrl:        profile.linkedinUrl,
    preferredWorkStyle: profile.preferredWorkStyle,
    targetCountries:    [...profile.targetCountries],
    targetSalary:       profile.targetSalary,
    sector:             profile.sector,
    careerGoal:         profile.careerGoal,
  });

  const set = <K extends keyof typeof form>(key: K, val: typeof form[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  const toggleTargetCountry = (c: string) => {
    setForm(f => ({
      ...f,
      targetCountries: f.targetCountries.includes(c)
        ? f.targetCountries.filter(x => x !== c)
        : [...f.targetCountries, c],
    }));
  };

  const handleSave = () => {
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { id: 'profile', icon: User,       label: 'Profile' },
    { id: 'goals',   icon: Briefcase,  label: 'Career Goals' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
    { id: 'security',icon: Lock,       label: 'Security' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-1 mb-8">
        <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Settings
        </h2>
        <p className="text-muted-foreground text-sm">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Tabs Sidebar */}
        <div className="w-full md:w-48 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto border-b md:border-b-0 border-border/50 pb-2 md:pb-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors shrink-0 ${
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">

          {/* ── Profile Tab ──────────────────────────────────────── */}
          {activeTab === 'profile' && (
            <div className="bg-card border border-border/50 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-6">Public Profile</h3>

              <div className="flex items-center gap-6 mb-8">
                <div className="relative group cursor-pointer">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white text-2xl font-semibold">
                    {(form.name[0] ?? 'A').toUpperCase()}
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <button className="text-sm font-medium bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-md transition-colors">
                    Upload new avatar
                  </button>
                  <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. Max size 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    className="w-full bg-muted/30 border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Email</label>
                  <input type="email" defaultValue="ahmed@example.com" disabled className="w-full bg-muted/10 border border-border/50 rounded-lg p-2.5 text-sm text-muted-foreground cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Nationality</label>
                  <select
                    value={form.nationality}
                    onChange={e => set('nationality', e.target.value)}
                    className="w-full bg-muted/30 border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary/50"
                  >
                    {NATIONALITIES.map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Current Location</label>
                  <select
                    value={form.currentCountry}
                    onChange={e => set('currentCountry', e.target.value)}
                    className="w-full bg-muted/30 border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary/50"
                  >
                    {GCC_COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Current Role</label>
                  <input
                    type="text"
                    value={form.currentRole}
                    onChange={e => set('currentRole', e.target.value)}
                    className="w-full bg-muted/30 border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Years of Experience</label>
                  <input
                    type="number"
                    min={0}
                    max={40}
                    value={form.yearsExperience}
                    onChange={e => set('yearsExperience', Number(e.target.value))}
                    className="w-full bg-muted/30 border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">LinkedIn URL</label>
                  <input
                    type="url"
                    value={form.linkedinUrl}
                    onChange={e => set('linkedinUrl', e.target.value)}
                    placeholder="linkedin.com/in/yourhandle"
                    className="w-full bg-muted/30 border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Work Style Preference</label>
                  <select
                    value={form.preferredWorkStyle}
                    onChange={e => set('preferredWorkStyle', e.target.value as typeof form.preferredWorkStyle)}
                    className="w-full bg-muted/30 border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary/50"
                  >
                    <option value="">Not specified</option>
                    <option value="onsite">On-site</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 items-center">
                {saved && <span className="text-sm text-green-500 font-medium">✓ Saved</span>}
                <button
                  onClick={handleSave}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          )}

          {/* ── Goals Tab ────────────────────────────────────────── */}
          {activeTab === 'goals' && (
            <div className="bg-card border border-border/50 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Career Objectives</h3>
              <p className="text-sm text-muted-foreground mb-6">These parameters tune the AI's recommendations across the platform.</p>

              <div className="space-y-8">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Target Countries</label>
                  <div className="flex flex-wrap gap-2">
                    {GCC_COUNTRIES.map(c => (
                      <button
                        key={c}
                        onClick={() => toggleTargetCountry(c)}
                        className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                          form.targetCountries.includes(c)
                            ? 'bg-primary/20 border-primary/50 text-primary'
                            : 'bg-muted/20 border-border/50 text-muted-foreground hover:bg-muted/50'
                        }`}
                      >
                        {GCC_FLAG[c]} {c.replace('United Arab Emirates', 'UAE').replace('Saudi Arabia', 'KSA')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Sector</label>
                  <select
                    value={form.sector}
                    onChange={e => set('sector', e.target.value)}
                    className="w-full bg-muted/30 border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary/50"
                  >
                    {SECTORS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Target Monthly Salary (AED)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={10000}
                      max={100000}
                      step={1000}
                      value={form.targetSalary}
                      onChange={e => set('targetSalary', Number(e.target.value))}
                      className="flex-1 accent-primary"
                    />
                    <span className="text-sm font-bold text-foreground w-28 text-right">
                      AED {form.targetSalary.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Career Goal</label>
                  <select
                    value={form.careerGoal}
                    onChange={e => set('careerGoal', e.target.value)}
                    className="w-full bg-muted/30 border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary/50"
                  >
                    {CAREER_GOALS.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <h4 className="font-medium text-sm mb-4">Trade-off Matrix</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="w-24 text-muted-foreground">Title</span>
                      <input type="range" className="flex-1 accent-primary mx-4" defaultValue="70" />
                      <span className="w-24 text-right text-muted-foreground">Compensation</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="w-24 text-muted-foreground">Stability</span>
                      <input type="range" className="flex-1 accent-primary mx-4" defaultValue="40" />
                      <span className="w-24 text-right text-muted-foreground">Growth Rate</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 items-center">
                {saved && <span className="text-sm text-green-500 font-medium">✓ Saved</span>}
                <button
                  onClick={handleSave}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Goals
                </button>
              </div>
            </div>
          )}

          {/* ── Billing Tab ──────────────────────────────────────── */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <CreditCard className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Current Plan</div>
                  <h3 className="font-display text-3xl font-bold text-foreground mb-4">Pro Intelligence <span className="text-lg font-normal text-muted-foreground">/ $49 mo</span></h3>
                  <div className="flex gap-4">
                    <button className="bg-background text-foreground border border-border/50 px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors">
                      Cancel Plan
                    </button>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                      Upgrade to Executive
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-6">Billing History</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium text-sm">Pro Intelligence - Monthly</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Oct {i + 1}, 2023</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">$49.00</span>
                        <button className="text-xs text-primary hover:underline">Invoice</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Security Tab ─────────────────────────────────────── */}
          {activeTab === 'security' && (
            <div className="bg-card border border-border/50 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-6">Security Settings</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                  <div>
                    <div className="font-medium text-sm">Change Password</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Last changed 3 months ago</div>
                  </div>
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                  <div>
                    <div className="font-medium text-sm">Two-Factor Authentication</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Not enabled</div>
                  </div>
                  <Bell className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
