import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Info, ArrowRight, ShieldCheck, Building2, MapPin } from 'lucide-react';

export default function NationalizationPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Nationalization Intelligence
        </h2>
        <p className="text-muted-foreground text-sm">Know your expat risk across all GCC countries</p>
      </div>

      {/* Main Risk Score Card */}
      <div className="bg-card border border-border/50 rounded-xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-lg text-foreground">Your Expat Risk Score</h3>
          </div>
          <p className="text-muted-foreground text-sm max-w-md">
            Moderate risk. While Product Management is generally open, 3 of your target roles in Saudi Government sectors are heavily protected by recent Nitaqat updates.
          </p>
        </div>

        <div className="shrink-0 flex items-center justify-center relative">
          {/* Gauge representation using SVG */}
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" strokeDasharray="330" strokeDashoffset="110" strokeLinecap="round" transform="rotate(135 80 80)" />
            <circle cx="80" cy="80" r="70" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray="330" strokeDashoffset="180" strokeLinecap="round" transform="rotate(135 80 80)" />
            <text x="80" y="85" textAnchor="middle" fontSize="36" fontWeight="bold" fill="hsl(var(--foreground))">6.2</text>
            <text x="80" y="105" textAnchor="middle" fontSize="12" fill="hsl(var(--muted-foreground))">/ 10</text>
          </svg>
        </div>
      </div>

      {/* Country Grid */}
      <h3 className="font-semibold text-lg pt-4">Country Policy Matrix</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { country: 'Saudi Arabia', flag: '🇸🇦', policy: 'Nitaqat (Platinum Tier)', risk: 'High', desc: 'Government & Semi-Govt PM roles are 80%+ Saudized. Private tech is safer.', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
          { country: 'Oman', flag: '🇴🇲', policy: 'Omanisation', risk: 'High', desc: 'Strict limits on expat middle management. Prioritizes local talent for PM roles.', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
          { country: 'UAE', flag: '🇦🇪', policy: 'Emiratisation (Nafis)', risk: 'Low', desc: '2% annual increase rule applies mostly to lower tiers. Senior PM is very safe.', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
          { country: 'Qatar', flag: '🇶🇦', policy: 'Qatarisation', risk: 'Medium', desc: 'Advisory and highly technical roles remain open. General management is restricted.', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { country: 'Bahrain', flag: '🇧🇭', policy: 'Bahrainisation', risk: 'Medium', desc: 'Flexible parallel system allowing expats if companies pay higher fees.', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { country: 'Kuwait', flag: '🇰🇼', policy: 'Kuwaitisation', risk: 'High', desc: 'Aggressive replacement in public sector. Private sector quotas increasing.', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
        ].map((c, i) => (
          <div key={i} className={`bg-card border ${c.border} rounded-xl p-5 hover:bg-muted/10 transition-colors`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{c.flag}</span>
                <span className="font-semibold text-foreground">{c.country}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${c.bg} ${c.color}`}>
                {c.risk} Risk
              </span>
            </div>
            <div className="text-xs font-medium text-foreground mb-2">{c.policy}</div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4 min-h-[40px]">{c.desc}</p>
            <button className="text-xs text-primary hover:underline flex items-center gap-1 font-medium">
              View Policy Details <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Alternative Paths */}
      <h3 className="font-semibold text-lg pt-4">AI Recommended Safe Paths</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border/50 rounded-xl p-5">
          <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="font-semibold text-sm mb-1">Pivot to Technical PM</h4>
          <p className="text-xs text-muted-foreground mb-3">Roles requiring specific Cloud/AI certifications are exempt from quotas in KSA.</p>
          <div className="text-xs font-medium text-primary bg-primary/10 inline-block px-2 py-1 rounded">Risk drops by 45%</div>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-5">
          <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
            <MapPin className="w-4 h-4" />
          </div>
          <h4 className="font-semibold text-sm mb-1">Target UAE Free Zones</h4>
          <p className="text-xs text-muted-foreground mb-3">DIFC and DMCC companies are largely exempt from mainland Emiratisation quotas.</p>
          <div className="text-xs font-medium text-primary bg-primary/10 inline-block px-2 py-1 rounded">Near 0% Risk</div>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-5">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
            <Building2 className="w-4 h-4" />
          </div>
          <h4 className="font-semibold text-sm mb-1">B2B SaaS Startups</h4>
          <p className="text-xs text-muted-foreground mb-3">Early-stage companies (under 50 employees) face less scrutiny across all GCC nations.</p>
          <div className="text-xs font-medium text-primary bg-primary/10 inline-block px-2 py-1 rounded">Salary trade-off required</div>
        </div>
      </div>
    </div>
  );
}
