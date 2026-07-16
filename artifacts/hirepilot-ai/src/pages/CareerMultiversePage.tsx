import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';
import { computeCareerMultiverse } from '@/engine/modules/careerMultiverse';

// Map risk → chart colour for trajectory mini-chart
const RISK_COLOUR: Record<string, string> = {
  Low:    '#22c55e',
  Medium: '#f59e0b',
  High:   '#ef4444',
};

// Simple deterministic trend line for each scenario
function trendData(probability: number) {
  const base = probability / 100;
  return [0, 0.25, 0.5, 0.75, 1].map((t, i) => ({
    y: Math.round(base * 12 * Math.pow(1 + i * 0.2, 1.5)),
  }));
}

export default function CareerMultiversePage() {
  const { profile } = useProfile();
  const result = useMemo(() => computeCareerMultiverse(profile), [profile]);
  const { scenarios } = result;

  // Comparison chart data derived from engine scenarios
  const comparisonData = [
    { name: 'Market Demand',  ...Object.fromEntries(scenarios.map((s, i) => [`s${i + 1}`, Math.round(s.probability * 0.95)])) },
    { name: 'Nat. Safety',   ...Object.fromEntries(scenarios.map((s, i) => [`s${i + 1}`, s.risk === 'Low' ? 90 : s.risk === 'Medium' ? 65 : 40])) },
    { name: 'Salary Growth', ...Object.fromEntries(scenarios.map((s, i) => [`s${i + 1}`, Math.round(s.probability * 0.85 + i * 5)])) },
    { name: 'Career Traj.',  ...Object.fromEntries(scenarios.map((s, i) => [`s${i + 1}`, Math.round(s.probability * 0.9 + i * 8)])) },
  ];

  const CHART_COLOURS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Career Multiverse
        </h2>
        <p className="text-muted-foreground text-sm">Compare {scenarios.length} futures side by side</p>
      </div>

      {/* Scenarios Horizontal Scroll */}
      <div className="flex overflow-x-auto pb-6 gap-6 snap-x snap-mandatory hide-scrollbar">
        {scenarios.map((s, i) => (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={s.id}
            className="snap-center min-w-[320px] md:min-w-[340px] flex-shrink-0 bg-card border border-border/50 hover:border-primary/50 transition-colors rounded-xl p-5 flex flex-col relative"
          >
            {i === 0 && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                AI Recommended
              </div>
            )}

            <div className="flex justify-between items-start mb-4">
              {/* Tag badge */}
              <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border ${s.tagColor}`}>
                {s.tag}
              </span>
              <div className="text-right">
                <div className={`text-2xl font-bold ${s.probability >= 70 ? 'text-green-500' : s.probability >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                  {s.probability}%
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Success Prob</div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-lg leading-tight mb-1">{s.title}</h3>
              <div className="text-sm text-muted-foreground">{s.timeframe}</div>
            </div>

            <div className="h-16 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData(s.probability)}>
                  <Line type="monotone" dataKey="y" stroke={RISK_COLOUR[s.risk] ?? '#22c55e'} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="text-center text-xs text-muted-foreground mt-1">5-Year Trajectory</div>
            </div>

            <div className="text-xl font-bold text-foreground mb-4 text-center pb-4 border-b border-border/50">
              {s.salaryImpact}
            </div>

            <div className="space-y-4 mb-6 flex-1">
              <div>
                <div className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3"/> Key Opportunities
                </div>
                <ul className="space-y-1">
                  {s.pros.map((op, j) => (
                    <li key={j} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-green-500/50 mt-0.5">•</span> {op}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3"/> Key Risks
                </div>
                <ul className="space-y-1">
                  {s.cons.map((risk, j) => (
                    <li key={j} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-red-500/50 mt-0.5">•</span> {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              i === 0
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                : 'bg-muted/50 text-foreground hover:bg-muted'
            }`}>
              Simulate Path <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Probability Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-card border border-border/50 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-6">Probability Breakdown Dimensions</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'hsl(var(--muted)/0.3)' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {scenarios.slice(0, 3).map((s, i) => (
                <Bar key={s.id} dataKey={`s${i + 1}`} name={s.tag} fill={CHART_COLOURS[i] ?? '#888'} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
