import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from 'recharts';
import {
  Trophy, AlertTriangle, ChevronDown, ChevronUp, RefreshCw,
  ArrowRight, CheckCircle2, Star, Zap, Target, TrendingUp,
  Globe, Building2, Clock, Shield, Copy, Check, Briefcase,
  DollarSign, ExternalLink,
} from 'lucide-react';
import { Link } from 'wouter';
import type { DecisionResult, ModuleId, RiskLevel } from './types';
import WhyPanel from '@/components/why/WhyPanel';
import {
  getWhyHireProbabilityEngine,
  getWhyConfidenceScore,
  getWhyCountryRanking,
  getWhySalaryPotential,
} from '@/services/whyDataService';

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-2.5 py-1.5 rounded-lg border border-border/40 hover:border-primary/40"
      title="Copy summary to clipboard"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied!' : 'Copy summary'}
    </button>
  );
}

// ─── Hire Probability Gauge ──────────────────────────────────────────────────
function HireProbabilityGauge({ value }: { value: number }) {
  const radius = 80;
  const stroke = 12;
  const sweep = 240;
  const startAngle = -120;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (sweep / 360) * circumference;
  const color = value >= 75 ? '#22c55e' : value >= 55 ? '#f59e0b' : '#ef4444';
  const gradientId = `gauge-grad-${value}`;

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="140" viewBox="-100 -100 200 140" className="overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle cx="0" cy="0" r={radius} fill="none" stroke="hsl(217 32% 14%)" strokeWidth={stroke}
          strokeDasharray={`${arcLength} ${circumference}`} strokeLinecap="round" transform={`rotate(${startAngle})`} />
        <motion.circle cx="0" cy="0" r={radius} fill="none" stroke={`url(#${gradientId})`} strokeWidth={stroke}
          strokeDasharray={`${arcLength} ${circumference}`} strokeLinecap="round" transform={`rotate(${startAngle})`}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: arcLength * (1 - value / 100) }}
          transition={{ duration: 1.8, ease: 'easeOut', delay: 0.3 }}
        />
        <text x="0" y="-8" textAnchor="middle" fill="white" fontSize="36" fontWeight="700">{value}</text>
        <text x="0" y="16" textAnchor="middle" fill="hsl(215 20% 65%)" fontSize="12">Hire Probability</text>
        {[0, 25, 50, 75, 100].map((v) => {
          const angle = (startAngle + (v / 100) * sweep) * (Math.PI / 180);
          const r2 = radius + stroke / 2 + 6;
          return (
            <text key={v} x={Math.cos(angle) * r2} y={Math.sin(angle) * r2}
              textAnchor="middle" dominantBaseline="middle" fill="hsl(215 20% 45%)" fontSize="9">{v}</text>
          );
        })}
      </svg>
      <div className="mt-1 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full" style={{ background: color }} />
        <span className="text-sm font-semibold" style={{ color }}>
          {value >= 75 ? 'High Probability' : value >= 55 ? 'Moderate Probability' : 'Challenging Market'}
        </span>
      </div>
    </div>
  );
}

// ─── Country row ─────────────────────────────────────────────────────────────
const RISK_COLORS: Record<RiskLevel, string> = {
  High:   'text-destructive bg-destructive/10 border-destructive/30',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  Low:    'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
};

function CountryRow({ c, rank }: { c: DecisionResult['countryAnalysis'][0]; rank: number }) {
  const shortName = c.country.replace('United Arab Emirates', 'UAE').replace('Saudi Arabia', 'KSA');
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.08 }}
      className={`relative p-4 rounded-xl border transition-all ${c.recommended ? 'border-primary/30 bg-primary/5' : 'border-border/30 bg-card/30'}`}
    >
      {c.recommended && (
        <span className="absolute top-3 right-3 text-xs font-semibold text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 rounded-full flex items-center gap-1">
          <Star className="h-3 w-3" /> Recommended
        </span>
      )}
      <div className="flex items-start gap-3">
        <span className="text-2xl">{c.flag}</span>
        <div className="flex-1 min-w-0 pr-24">
          <p className="text-sm font-semibold text-foreground">{c.country}</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{c.note}</p>

          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Hire Probability</span>
              <span className="font-semibold text-foreground">{c.hireProbability}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }} animate={{ width: `${c.hireProbability}%` }}
                transition={{ duration: 1, delay: rank * 0.1 }} />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${RISK_COLORS[c.visaFeasibility]}`}>Visa: {c.visaFeasibility}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${RISK_COLORS[c.nationalizationRisk === 'Low' ? 'Low' : c.nationalizationRisk === 'Medium' ? 'Medium' : 'High']}`}>Nat. Risk: {c.nationalizationRisk}</span>
            <span className="text-xs px-2 py-0.5 rounded-full border border-border/40 text-muted-foreground">Salary: {c.salaryMatch}% match</span>
            <span className="text-xs px-2 py-0.5 rounded-full border border-border/40 text-muted-foreground">{c.jobCount.toLocaleString()} open roles</span>
          </div>

          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            <Building2 className="h-3 w-3 text-muted-foreground/60 flex-shrink-0" />
            {c.topEmployers.slice(0, 3).map((e) => (
              <span key={e} className="text-xs text-muted-foreground/70">{e}</span>
            ))}
            {c.topEmployers.length > 3 && <span className="text-xs text-muted-foreground/50">+{c.topEmployers.length - 3} more</span>}
          </div>

          {/* Deep link to jobs page */}
          <Link href="/jobs">
            <span className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium cursor-pointer">
              <Briefcase className="h-3 w-3" /> View {c.jobCount.toLocaleString()} jobs in {shortName} <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>
      </div>
      {/* Why panel for this country's ranking — rendered inside the card below the content */}
    </motion.div>
  );
}

// ─── Module insight accordion ─────────────────────────────────────────────────
const MODULE_LABELS: Record<ModuleId, string> = {
  profile: 'Profile Analysis', policy: 'Policy Engine', salary: 'Salary Engine',
  market: 'Market Intelligence', eligibility: 'Eligibility Engine', recommendation: 'Recommendation Engine',
};
const MODULE_COLORS: Record<ModuleId, string> = {
  profile: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  policy: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  salary: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  market: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  eligibility: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  recommendation: 'text-primary bg-primary/10 border-primary/20',
};

function InsightAccordion({ insights }: { insights: DecisionResult['moduleInsights'] }) {
  const [open, setOpen] = useState<ModuleId | null>('recommendation');
  return (
    <div className="space-y-2">
      {insights.map((ins) => {
        const isOpen = open === ins.moduleId;
        return (
          <div key={ins.moduleId} className="border border-border/30 rounded-xl overflow-hidden bg-card/30">
            <button onClick={() => setOpen(isOpen ? null : ins.moduleId)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-2 text-left">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${MODULE_COLORS[ins.moduleId]}`}>
                  {MODULE_LABELS[ins.moduleId]}
                </span>
                <span className="text-sm text-foreground font-medium truncate max-w-xs">{ins.headline}</span>
              </div>
              {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
            </button>
            {isOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.2 }} className="border-t border-border/30 px-4 py-3">
                <p className="text-sm text-muted-foreground leading-relaxed">{ins.body}</p>
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Salary Negotiation Anchor ────────────────────────────────────────────────
function SalaryAnchorPanel({ anchor, profile }: { anchor: DecisionResult['salaryAnchor']; profile: DecisionResult['profile'] }) {
  const fmt = (n: number) => `AED ${Math.round(n / 1000)}K`;
  const [scriptVisible, setScriptVisible] = useState(false);

  return (
    <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-emerald-400" />
          <h3 className="text-sm font-semibold text-emerald-400">Salary Negotiation Anchor</h3>
        </div>
        <Link href="/salary-intelligence">
          <span className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 cursor-pointer">
            Full salary data <ExternalLink className="h-3 w-3" />
          </span>
        </Link>
      </div>

      {/* Negotiation range bar */}
      <div className="space-y-3">
        <div className="relative h-3 rounded-full bg-muted/50 overflow-hidden">
          {/* Walkaway zone */}
          <div className="absolute inset-y-0 left-0 bg-red-500/20 rounded-l-full"
            style={{ width: `${(anchor.walkaway / (anchor.askPrice * 1.2)) * 100}%` }} />
          {/* Target zone */}
          <div className="absolute inset-y-0 bg-primary/40"
            style={{
              left: `${(anchor.walkaway / (anchor.askPrice * 1.2)) * 100}%`,
              width: `${((anchor.askPrice - anchor.walkaway) / (anchor.askPrice * 1.2)) * 100}%`,
            }} />
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: 'Walkaway', value: anchor.walkaway, color: 'text-red-400' },
            { label: 'Expected Offer', value: anchor.expectedOffer, color: 'text-amber-400' },
            { label: 'Your Target', value: anchor.targetPrice, color: 'text-primary' },
            { label: 'Open Ask', value: anchor.askPrice, color: 'text-emerald-400' },
          ].map((item) => (
            <div key={item.label}>
              <div className={`text-sm font-bold ${item.color}`}>{fmt(item.value)}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Script toggle */}
      <button onClick={() => setScriptVisible(v => !v)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        {scriptVisible ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {scriptVisible ? 'Hide' : 'Show'} negotiation script
      </button>

      {scriptVisible && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="bg-background/50 border border-border/40 rounded-lg p-4 text-sm text-muted-foreground leading-relaxed italic overflow-hidden">
          {anchor.negotiationScript}
          <div className="mt-3 flex justify-end">
            <CopyButton text={anchor.negotiationScript} />
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Strengths / Risks ────────────────────────────────────────────────────────
function StrengthRiskPanel({ strengths, risks }: { strengths: string[]; risks: string[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <h3 className="text-sm font-semibold text-emerald-400">Strengths ({strengths.length})</h3>
        </div>
        <ul className="space-y-2.5">
          {strengths.map((s, i) => (
            <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="flex items-start gap-2.5">
              <span className="h-4 w-4 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[9px] text-emerald-400 font-bold">{i + 1}</span>
              </span>
              <span className="text-sm text-muted-foreground leading-snug">{s}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="p-5 rounded-xl border border-amber-500/20 bg-amber-500/5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          <h3 className="text-sm font-semibold text-amber-400">Risks & Watch Points ({risks.length})</h3>
        </div>
        <ul className="space-y-2.5">
          {risks.map((r, i) => (
            <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="flex items-start gap-2.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400/70 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground leading-snug">{r}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Next Steps ───────────────────────────────────────────────────────────────
const URGENCY_STYLES: Record<RiskLevel, { badge: string }> = {
  High:   { badge: 'text-red-400 bg-red-500/10 border-red-500/30' },
  Medium: { badge: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  Low:    { badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
};

function NextStepsPanel({ steps }: { steps: DecisionResult['nextSteps'] }) {
  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const urg = URGENCY_STYLES[step.urgency];
        return (
          <motion.div key={step.step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-start gap-4 p-4 rounded-xl border border-border/30 bg-card/30 hover:bg-card/50 transition-colors group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">{step.step}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-1">
                <p className="text-sm font-semibold text-foreground leading-snug">{step.action}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${urg.badge}`}>{step.urgency}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {step.timeframe}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.detail}</p>
              {step.link && (
                <Link href={step.link}>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium cursor-pointer">
                    {step.linkLabel ?? 'Go'} <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Country radar chart ──────────────────────────────────────────────────────
function CountryRadarChart({ countries }: { countries: DecisionResult['countryAnalysis'] }) {
  const data = countries.map((c) => ({
    country: c.flag + ' ' + c.country.split(' ').at(-1),
    hire: c.hireProbability,
    salary: c.salaryMatch,
    demand: c.demandIndex,
  }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="hsl(217 32% 14%)" />
        <PolarAngleAxis dataKey="country" tick={{ fontSize: 11, fill: 'hsl(215 20% 55%)' }} />
        <Radar name="Hire %" dataKey="hire" stroke="hsl(217 91% 60%)" fill="hsl(217 91% 60%)" fillOpacity={0.15} strokeWidth={2} />
        <Radar name="Salary Match" dataKey="salary" stroke="hsl(262 83% 58%)" fill="hsl(262 83% 58%)" fillOpacity={0.1} strokeWidth={2} />
        <Radar name="Market Demand" dataKey="demand" stroke="hsl(160 60% 50%)" fill="hsl(160 60% 50%)" fillOpacity={0.08} strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// ─── Quick action links ───────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: 'Browse Jobs',         href: '/jobs',                icon: Briefcase,    color: 'text-primary' },
  { label: 'Salary Intel',        href: '/salary-intelligence', icon: TrendingUp,   color: 'text-emerald-400' },
  { label: 'Interview Coach',     href: '/interview-coach',     icon: Target,       color: 'text-amber-400' },
  { label: 'Nat. Risk',           href: '/nationalization',     icon: Shield,       color: 'text-violet-400' },
  { label: 'Relocation Guide',    href: '/relocation',          icon: Globe,        color: 'text-cyan-400' },
  { label: 'Career Multiverse',   href: '/career-multiverse',   icon: Zap,          color: 'text-blue-400' },
];

function QuickActions() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {QUICK_ACTIONS.map(({ label, href, icon: Icon, color }) => (
        <Link key={href} href={href}>
          <div className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border/30 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all cursor-pointer group">
            <Icon className={`h-4 w-4 ${color} group-hover:scale-110 transition-transform`} />
            <span className="text-[10px] text-muted-foreground group-hover:text-foreground text-center leading-tight">{label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ─── Main ResultPanel ─────────────────────────────────────────────────────────
interface Props {
  result: DecisionResult;
  onReset: () => void;
}

function buildShareText(result: DecisionResult): string {
  const topCountry = result.topCountry.replace('United Arab Emirates', 'UAE').replace('Saudi Arabia', 'KSA');
  return [
    `HirePilot AI Analysis — ${new Date(result.generatedAt).toLocaleDateString('en-GB', { dateStyle: 'medium' })}`,
    `Question: "${result.question}"`,
    ``,
    `Hire Probability: ${result.hireProbability}% | Top Market: ${topCountry} | Confidence: ${result.confidenceScore}%`,
    `Salary Target: AED ${Math.round(result.profile.targetSalary / 1000)}K/mo | Feasibility: ${result.salaryFeasibility}`,
    ``,
    `Summary: ${result.primaryRecommendation}`,
    ``,
    `Generated by HirePilot AI — Know Before You Apply.`,
  ].join('\n');
}

export default function ResultPanel({ result, onReset }: Props) {
  const salaryDelta = Math.round(((result.profile.targetSalary - result.profile.currentSalary) / result.profile.currentSalary) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">

      {/* ── Hero banner ── */}
      <div className="relative p-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card/60 to-accent/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">AI Analysis Complete</p>
              <h2 className="text-xl font-bold text-foreground leading-snug max-w-2xl">"{result.question}"</h2>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <CopyButton text={buildShareText(result)} />
              <button onClick={onReset}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-all">
                <RefreshCw className="h-4 w-4" /> New Analysis
              </button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">{result.primaryRecommendation}</p>
          <p className="mt-3 text-xs text-muted-foreground/50">
            Generated {new Date(result.generatedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })} ·
            {result.profile.nationality} · {result.profile.currentRole} · {result.profile.yearsExperience} yrs · {result.profile.sector}
          </p>
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Jump to Platform</p>
        <QuickActions />
      </div>

      {/* ── Score cards row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-2 row-span-1 p-6 rounded-xl border border-border/40 bg-card/50 flex flex-col items-center justify-center gap-3">
          <HireProbabilityGauge value={result.hireProbability} />
          <WhyPanel data={getWhyHireProbabilityEngine(result)} trigger="badge" />
        </div>

        <div className="p-5 rounded-xl border border-border/40 bg-card/50 flex flex-col gap-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Confidence Score</p>
          <div className="flex items-end gap-1.5 mt-1">
            <span className="text-3xl font-bold text-foreground">{result.confidenceScore}</span>
            <span className="text-muted-foreground mb-1">/ 100</span>
          </div>
          <div className="h-1 rounded-full bg-muted/50 overflow-hidden mt-2">
            <motion.div className="h-full bg-gradient-to-r from-violet-500 to-primary rounded-full"
              initial={{ width: 0 }} animate={{ width: `${result.confidenceScore}%` }} transition={{ duration: 1.2, delay: 0.5 }} />
          </div>
          <p className="text-xs text-muted-foreground/70 mt-1 mb-2">Profile completeness + historical match accuracy</p>
          <WhyPanel data={getWhyConfidenceScore(result)} trigger="badge" />
        </div>

        <div className="p-5 rounded-xl border border-border/40 bg-card/50 flex flex-col gap-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Top Market</p>
          <div className="flex items-center gap-2 mt-2">
            <Trophy className="h-6 w-6 text-amber-400" />
            <span className="text-lg font-bold text-foreground">
              {result.topCountry.replace('United Arab Emirates', 'UAE').replace('Saudi Arabia', 'KSA')}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Highest hire probability + salary feasibility</p>
        </div>

        <div className="p-5 rounded-xl border border-border/40 bg-card/50 flex flex-col gap-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Salary Uplift</p>
          <div className="flex items-end gap-1.5 mt-1">
            <span className={`text-3xl font-bold ${salaryDelta > 0 ? 'text-emerald-400' : 'text-foreground'}`}>
              {salaryDelta > 0 ? '+' : ''}{salaryDelta}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 mb-2">
            AED {(result.profile.currentSalary / 1000).toFixed(0)}K → {(result.profile.targetSalary / 1000).toFixed(0)}K/mo ·{' '}
            <span className={result.salaryFeasibility === 'High' ? 'text-emerald-400' : result.salaryFeasibility === 'Medium' ? 'text-amber-400' : 'text-red-400'}>
              {result.salaryFeasibility}
            </span>
          </p>
          <WhyPanel data={getWhySalaryPotential(result.profile)} trigger="badge" />
        </div>

        <div className="p-5 rounded-xl border border-border/40 bg-card/50 flex flex-col gap-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Active Openings</p>
          <div className="flex items-end gap-1.5 mt-1">
            <span className="text-3xl font-bold text-foreground">{result.matchedJobCount.toLocaleString()}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Ghost-filtered · {result.profile.sector} · GCC-wide
          </p>
          <Link href="/jobs">
            <span className="text-xs text-primary hover:underline flex items-center gap-0.5 mt-1 cursor-pointer">
              Browse jobs <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>

        <div className="p-5 rounded-xl border border-border/40 bg-card/50 flex flex-col gap-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Time to Hire</p>
          <div className="flex items-center gap-2 mt-2">
            <Clock className="h-5 w-5 text-primary" />
            <span className="text-xl font-bold text-foreground">{result.timeToHireEstimate}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{result.profile.sector} sector · GCC market average</p>
        </div>
      </div>

      {/* ── Salary Negotiation Anchor ── */}
      <section>
        <SalaryAnchorPanel anchor={result.salaryAnchor} profile={result.profile} />
      </section>

      {/* ── Reasoning Breakdown ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Reasoning Breakdown</h3>
            <p className="text-xs text-muted-foreground">Click each module to expand the detailed insight</p>
          </div>
        </div>
        <InsightAccordion insights={result.moduleInsights} />
      </section>

      {/* ── Country Analysis ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Globe className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Country Comparison</h3>
            <p className="text-xs text-muted-foreground">{result.countryAnalysis.length} GCC markets analysed — ranked by hire probability</p>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-3 space-y-3">
            {result.countryAnalysis.map((c, i) => <CountryRow key={c.country} c={c} rank={i} />)}
          </div>
          <div className="xl:col-span-2 p-4 rounded-xl border border-border/30 bg-card/40">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Market Radar</p>
            <CountryRadarChart countries={result.countryAnalysis} />
            <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Hire %</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-accent" /> Salary</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ background: 'hsl(160 60% 50%)' }} /> Demand</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Strengths & Risks ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Shield className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Strengths & Risks</h3>
            <p className="text-xs text-muted-foreground">Profile-specific factors affecting your outcome</p>
          </div>
        </div>
        <StrengthRiskPanel strengths={result.strengths} risks={result.risks} />
      </section>

      {/* ── Next Steps ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Target className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">Actionable Next Steps</h3>
            <p className="text-xs text-muted-foreground">Prioritised by urgency × ROI — click actions to navigate</p>
          </div>
        </div>
        <NextStepsPanel steps={result.nextSteps} />
      </section>

      {/* ── Reset CTA ── */}
      <div className="flex items-center justify-center pt-2 pb-4">
        <button onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border hover:bg-card/60 transition-all">
          <RefreshCw className="h-4 w-4" /> Run a Different Analysis
        </button>
      </div>
    </motion.div>
  );
}
