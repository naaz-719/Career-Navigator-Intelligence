import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { GitMerge, Trophy, AlertTriangle, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';

const scenarios = [
  {
    id: 1,
    rank: '🥇',
    title: 'Senior PM → Head of Product',
    company: 'UAE Tech (Scale-up)',
    country: '🇦🇪',
    prob: 78,
    salary: 'AED 45K',
    risks: ['High competition', 'Slower title progression'],
    ops: ['Stable market', 'High equity upside', 'Low expat risk'],
    trendData: [{y: 1}, {y: 2}, {y: 4}, {y: 5}, {y: 7}]
  },
  {
    id: 2,
    rank: '🥈',
    title: 'PM → Engineering Director',
    company: 'Saudi Energy Sector',
    country: '🇸🇦',
    prob: 65,
    salary: 'SAR 52K',
    risks: ['Moderate Saudization risk', 'Cultural adaptation'],
    ops: ['Massive project scale', 'Highest base salary'],
    trendData: [{y: 1}, {y: 3}, {y: 6}, {y: 8}, {y: 9}]
  },
  {
    id: 3,
    rank: '🥉',
    title: 'PM → Startup CPO',
    company: 'Bahrain FinTech',
    country: '🇧🇭',
    prob: 58,
    salary: 'BHD 3.5K',
    risks: ['Funding stability', 'Lower base pay'],
    ops: ['C-level title', 'Fastest progression', 'High impact'],
    trendData: [{y: 1}, {y: 2}, {y: 2}, {y: 5}, {y: 10}]
  },
  {
    id: 4,
    rank: '4',
    title: 'PM → Gov Innovation Lead',
    company: 'Qatar Government',
    country: '🇶🇦',
    prob: 71,
    salary: 'QAR 40K',
    risks: ['Slow bureaucracy', 'Strict hierarchies'],
    ops: ['Excellent benefits', 'Qatarization friendly (Expat advisory)'],
    trendData: [{y: 1}, {y: 2}, {y: 3}, {y: 4}, {y: 5}]
  },
  {
    id: 5,
    rank: '5',
    title: 'PM → Consulting Partner',
    company: 'Kuwait Advisory',
    country: '🇰🇼',
    prob: 44,
    salary: 'KWD 4K',
    risks: ['Highest competition', 'Brutal hours', 'High Kuwaitisation'],
    ops: ['Highest ceiling', 'Prestige network'],
    trendData: [{y: 1}, {y: 1}, {y: 3}, {y: 6}, {y: 12}]
  }
];

const comparisonData = [
  { name: 'Market Demand', s1: 85, s2: 70, s3: 60, s4: 75, s5: 50 },
  { name: 'Nat. Safety', s1: 90, s2: 60, s3: 85, s4: 70, s5: 40 },
  { name: 'Salary Growth', s1: 75, s2: 95, s3: 65, s4: 60, s5: 100 },
  { name: 'Career Traj.', s1: 80, s2: 75, s3: 95, s4: 65, s5: 90 },
];

export default function CareerMultiversePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Career Multiverse
        </h2>
        <p className="text-muted-foreground text-sm">Compare 5 futures side by side</p>
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
            {i === 0 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">AI Recommended</div>}
            
            <div className="flex justify-between items-start mb-4">
              <div className="text-2xl">{s.rank}</div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${s.prob >= 70 ? 'text-green-500' : s.prob >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                  {s.prob}%
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Success Prob</div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-lg leading-tight mb-1">{s.title}</h3>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <span>{s.country}</span> {s.company}
              </div>
            </div>

            <div className="h-16 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={s.trendData}>
                  <Line type="monotone" dataKey="y" stroke={s.prob >= 70 ? '#22c55e' : s.prob >= 60 ? '#f59e0b' : '#ef4444'} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="text-center text-xs text-muted-foreground mt-1">5-Year Salary Trajectory</div>
            </div>

            <div className="text-xl font-bold text-foreground mb-4 text-center pb-4 border-b border-border/50">
              {s.salary} <span className="text-sm text-muted-foreground font-normal">/ mo (Yr 3)</span>
            </div>

            <div className="space-y-4 mb-6 flex-1">
              <div>
                <div className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Key Opportunities</div>
                <ul className="space-y-1">
                  {s.ops.map((op, j) => <li key={j} className="text-xs text-muted-foreground flex items-start gap-1.5"><span className="text-green-500/50 mt-0.5">•</span> {op}</li>)}
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Key Risks</div>
                <ul className="space-y-1">
                  {s.risks.map((risk, j) => <li key={j} className="text-xs text-muted-foreground flex items-start gap-1.5"><span className="text-red-500/50 mt-0.5">•</span> {risk}</li>)}
                </ul>
              </div>
            </div>

            <button className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              i === 0 ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-muted/50 text-foreground hover:bg-muted'
            }`}>
              Simulate Path <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Probability Breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card border border-border/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Probability Breakdown Dimensions</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: 'hsl(var(--muted)/0.3)'}} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="s1" name="UAE Tech" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="s2" name="Saudi Energy" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="s3" name="Bahrain FinTech" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
