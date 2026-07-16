import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, AlertTriangle, CheckCircle2, Building, MapPin, Clock } from 'lucide-react';

const timelineData = [
  { year: '2024', current: 25000, recommended: 25000 },
  { year: '2025', current: 27000, recommended: 32000 },
  { year: '2026', current: 29000, recommended: 38000 },
  { year: '2027', current: 31000, recommended: 45000 },
  { year: '2028', current: 33000, recommended: 55000 },
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show"
      className="space-y-6"
    >
      <div className="flex flex-col gap-1 mb-8">
        <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Good morning, Ahmed 👋
        </h2>
        <p className="text-muted-foreground text-sm">Your career intelligence is ready.</p>
      </div>

      {/* Top Row: 4 metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={item} className="bg-card border border-border/50 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-medium text-muted-foreground">Career Score</div>
            <Target className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-foreground">87<span className="text-lg text-muted-foreground">/100</span></span>
          </div>
          <div className="mt-2 text-xs text-green-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +3 from last week
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-card border border-border/50 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-medium text-muted-foreground">Best Country</div>
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">🇦🇪</span>
            <span className="text-2xl font-bold text-foreground">UAE</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            92% match based on your profile
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-card border border-border/50 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-medium text-muted-foreground">Salary Potential</div>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="text-2xl font-bold text-foreground">AED 28,500</span>
            <span className="text-sm text-muted-foreground">/mo</span>
          </div>
          <div className="mt-2 text-xs text-green-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% above market
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-card border border-border/50 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-medium text-muted-foreground">Interview Readiness</div>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-foreground">74%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mb-2">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: '74%' }}></div>
          </div>
          <div className="text-xs text-amber-400">3 skills to improve</div>
        </motion.div>
      </div>

      {/* Second Row: 2 wide cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={item} className="lg:col-span-2 bg-card border border-border/50 rounded-xl p-5">
          <h3 className="text-base font-semibold mb-6 flex items-center gap-2">
            <LineChart className="w-4 h-4 text-primary" /> Career Timeline Projection
          </h3>
          <div className="h-[250px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Line type="monotone" dataKey="current" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Current Path" />
                  <Line type="monotone" dataKey="recommended" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} name="Recommended Path" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-card border border-border/50 rounded-xl p-5">
          <h3 className="text-base font-semibold mb-4">Top Skills Missing</h3>
          <div className="space-y-4">
            {[
              { name: 'Cloud Architecture', gap: 85, color: 'bg-red-500' },
              { name: 'Arabic Business Comms', gap: 70, color: 'bg-amber-500' },
              { name: 'Saudization Strategy', gap: 60, color: 'bg-amber-500' },
              { name: 'Data Analytics', gap: 40, color: 'bg-yellow-500' },
              { name: 'CIPD Certification', gap: 30, color: 'bg-green-500' },
            ].map((skill, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">{skill.name}</span>
                  <span className="text-muted-foreground">{skill.gap}% gap</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className={`${skill.color} h-1.5 rounded-full`} style={{ width: `${skill.gap}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Third Row: 2 cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={item} className="bg-card border border-border/50 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold">Latest Opportunities</h3>
            <button className="text-xs text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {[
              { role: 'Senior Product Manager', company: 'Noon', country: '🇦🇪', loc: 'Dubai', salary: 'AED 35K - 45K', match: 92, ghost: false },
              { role: 'Head of Product', company: 'Careem', country: '🇦🇪', loc: 'Dubai', salary: 'AED 40K - 55K', match: 88, ghost: false },
              { role: 'Product Director', company: 'Confidential', country: '🇸🇦', loc: 'Riyadh', salary: 'SAR 45K - 60K', match: 75, ghost: true },
              { role: 'VP Product', company: 'Talabat', country: '🇦🇪', loc: 'Dubai', salary: 'AED 50K+', match: 71, ghost: false },
            ].map((job, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/30 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {job.company.substring(0,1)}
                  </div>
                  <div>
                    <div className="font-medium text-sm flex items-center gap-2">
                      {job.role}
                      {job.ghost && <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-500 font-semibold border border-amber-500/20">⚠️ Ghost Risk 68%</span>}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                      {job.company} • {job.country} {job.loc}
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-sm font-medium text-primary">{job.salary}</span>
                  <span className="text-xs text-muted-foreground">{job.match}% match</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-card border border-border/50 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold">Recent Career Simulations</h3>
            <button className="text-xs text-primary hover:underline">New Simulation</button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Senior PM → UAE Tech', prob: 78, date: '2 days ago' },
              { name: 'Engineering Manager → Saudi Aramco', prob: 65, date: '1 week ago' },
              { name: 'Startup CTO → Bahrain FinTech', prob: 52, date: '2 weeks ago' },
            ].map((sim, i) => (
              <div key={i} className="p-3 rounded-lg border border-border/30 hover:border-primary/30 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm group-hover:text-primary transition-colors">{sim.name}</span>
                  <span className="text-xs text-muted-foreground">{sim.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${sim.prob > 70 ? 'text-green-500' : sim.prob > 60 ? 'text-amber-500' : 'text-red-500'}`}>
                    {sim.prob}%
                  </span>
                  <span className="text-xs text-muted-foreground">Probability of Success</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}
