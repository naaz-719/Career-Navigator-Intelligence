import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowRight, ShieldCheck, Building2 } from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';
import { getNationalizationData } from '@/services/mockDataService';

export default function NationalizationPage() {
  const { profile } = useProfile();

  // Backend seam: replace with useSWR(`/api/nationalization?sector=${sector}&countries=${countries}`, ...)
  const natl = getNationalizationData(profile);

  // Gauge geometry
  const gaugeValue = natl.score;
  const sweepDeg   = 240;
  const startDeg   = 135;
  const radius     = 70;
  const circ       = 2 * Math.PI * radius;
  const arcLen     = (sweepDeg / 360) * circ;
  const fillDash   = arcLen * (gaugeValue / 10);
  const emptyDash  = circ - fillDash;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Nationalization Intelligence
        </h2>
        <p className="text-muted-foreground text-sm">
          Know your expat risk across all GCC countries · Calibrated to your {profile.sector} profile
        </p>
      </div>

      {/* Main Risk Score Card */}
      <div className="bg-card border border-border/50 rounded-xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"
          style={{ background: `${natl.scoreColor}15` }} />

        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-5 h-5" style={{ color: natl.scoreColor }} />
            <h3 className="font-semibold text-lg text-foreground">Your Expat Risk Score</h3>
          </div>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            {natl.riskDescription}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.targetCountries.map(c => {
              const detail = natl.countryDetails.find(d => d.country === c);
              if (!detail) return null;
              return (
                <span key={c} className={`text-xs px-2 py-0.5 rounded-full border font-medium ${detail.bg} ${detail.color} ${detail.border}`}>
                  {detail.flag} {c.replace('United Arab Emirates', 'UAE').replace('Saudi Arabia', 'KSA')} · {detail.risk}
                </span>
              );
            })}
          </div>
        </div>

        {/* SVG Gauge */}
        <div className="shrink-0 flex items-center justify-center">
          <svg width="180" height="180" viewBox="0 0 160 160">
            {/* Track */}
            <circle cx="80" cy="80" r={radius}
              fill="none" stroke="hsl(var(--muted))" strokeWidth="14"
              strokeDasharray={`${arcLen} ${circ - arcLen}`}
              strokeLinecap="round"
              transform={`rotate(${startDeg} 80 80)`}
            />
            {/* Fill */}
            <motion.circle cx="80" cy="80" r={radius}
              fill="none" stroke={natl.scoreColor} strokeWidth="14"
              strokeDasharray={`${fillDash} ${emptyDash + (circ - arcLen)}`}
              strokeLinecap="round"
              transform={`rotate(${startDeg} 80 80)`}
              initial={{ strokeDasharray: `0 ${circ}` }}
              animate={{ strokeDasharray: `${fillDash} ${emptyDash + (circ - arcLen)}` }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
            />
            <text x="80" y="85" textAnchor="middle" fontSize="36" fontWeight="bold" fill="hsl(var(--foreground))">{gaugeValue.toFixed(1)}</text>
            <text x="80" y="105" textAnchor="middle" fontSize="12" fill="hsl(var(--muted-foreground))">/ 10</text>
          </svg>
        </div>
      </div>

      {/* Country Policy Matrix */}
      <h3 className="font-semibold text-lg pt-2">Country Policy Matrix</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {natl.countryDetails.map((c, i) => {
          const isTarget = profile.targetCountries.includes(c.country);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`bg-card border ${c.border} rounded-xl p-5 hover:bg-muted/10 transition-colors ${isTarget ? 'ring-1 ring-primary/20' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{c.flag}</span>
                  <div>
                    <span className="font-semibold text-foreground">{c.country}</span>
                    {isTarget && <p className="text-xs text-primary">Your target market</p>}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${c.bg} ${c.color}`}>
                  {c.risk} Risk
                </span>
              </div>
              <div className="text-xs font-medium text-foreground mb-2">{c.policy}</div>
              <div className="text-xs text-muted-foreground mb-1">Quota: {c.quota}</div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4 min-h-[40px]">{c.desc}</p>
              <button className="text-xs text-primary hover:underline flex items-center gap-1 font-medium">
                View Policy Details <ArrowRight className="w-3 h-3" />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* AI Recommended Safe Paths */}
      <h3 className="font-semibold text-lg pt-4">AI Recommended Safe Paths for {profile.sector}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border/50 rounded-xl p-5">
          <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="font-semibold text-sm mb-1">Target Tech-Exempt Roles</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Roles requiring specific AI/Cloud certifications are quota-exempt in KSA and UAE through 2026.
          </p>
          <div className="text-xs font-medium text-primary bg-primary/10 inline-block px-2 py-1 rounded">Risk drops by 45%</div>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-5">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
            <Building2 className="w-4 h-4" />
          </div>
          <h4 className="font-semibold text-sm mb-1">Prioritise Private Sector</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Private-sector {profile.sector} employers have significantly lower nationalization exposure than Govt/Semi-Govt bodies.
          </p>
          <div className="text-xs font-medium text-blue-400 bg-blue-500/10 inline-block px-2 py-1 rounded">4× safer than public sector</div>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-5">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h4 className="font-semibold text-sm mb-1">
            {profile.targetSalary >= 30000 ? 'Apply for UAE Golden Visa' : 'Target Golden Visa Threshold'}
          </h4>
          <p className="text-xs text-muted-foreground mb-3">
            {profile.targetSalary >= 30000
              ? 'Your target salary qualifies for the 10-year Golden Visa — makes you employer-independent.'
              : 'Negotiate to AED 30K/mo to unlock 10-year Golden Visa residency — transforms your risk profile.'}
          </p>
          <div className="text-xs font-medium text-amber-400 bg-amber-500/10 inline-block px-2 py-1 rounded">
            {profile.targetSalary >= 30000 ? 'You qualify now' : `AED ${Math.round((30000 - profile.targetSalary) / 1000)}K gap`}
          </div>
        </div>
      </div>
    </div>
  );
}
