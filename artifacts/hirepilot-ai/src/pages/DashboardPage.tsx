import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingUp, CheckCircle2, MapPin, Brain } from 'lucide-react';
import { Link } from 'wouter';
import { useProfile } from '@/context/ProfileContext';
import {
  getDashboardMetrics, getDashboardTimeline,
  getSkillGaps, getDashboardJobs, getRecentSimulations,
} from '@/services/mockDataService';
import WhyPanel from '@/components/why/WhyPanel';
import {
  getWhyCareerScore, getWhyHireProbabilityDashboard,
  getWhyInterviewReadiness, getWhySalaryPotential,
  getWhyJobMatch, getWhyGhostRisk,
} from '@/services/whyDataService';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { profile, lastAnalysis } = useProfile();

  const metrics     = getDashboardMetrics(profile);
  const timeline    = getDashboardTimeline(profile);
  const skillGaps   = getSkillGaps(profile);
  const jobs        = getDashboardJobs(profile);
  const simulations = getRecentSimulations(profile);

  const hirePct = lastAnalysis ? lastAnalysis.hireProbability : metrics.hireProbability;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1 mb-2">
          <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Good morning, {profile.name} 👋
          </h2>
          <p className="text-muted-foreground text-sm">
            {profile.currentRole} · {profile.sector} · {profile.yearsExperience} yrs experience
          </p>
        </div>
        {lastAnalysis && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs text-primary"
          >
            <Brain className="h-3.5 w-3.5" />
            Updated by AI Decision Engine
          </motion.div>
        )}
      </div>

      {/* Top Row: 4 metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Career Score */}
        <motion.div variants={item} className="bg-card border border-border/50 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-medium text-muted-foreground">Career Score</div>
            <Target className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-foreground">
              {metrics.careerScore}<span className="text-lg text-muted-foreground">/100</span>
            </span>
          </div>
          <div className="mt-2 text-xs text-green-400 font-medium flex items-center gap-1 mb-2">
            <TrendingUp className="w-3 h-3" />
            {metrics.careerScore >= 80 ? 'Strong profile' : metrics.careerScore >= 65 ? 'Good standing' : 'Needs improvement'}
          </div>
          <WhyPanel data={getWhyCareerScore(profile, metrics.careerScore)} />
        </motion.div>

        {/* Best Market */}
        <motion.div variants={item} className="bg-card border border-border/50 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-medium text-muted-foreground">Best Market</div>
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{metrics.topFlag}</span>
            <span className="text-2xl font-bold text-foreground">{metrics.topCountryShort}</span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground mb-2">
            {hirePct}% hire probability · top market for your profile
          </div>
          <WhyPanel data={getWhyHireProbabilityDashboard(profile, hirePct)} />
        </motion.div>

        {/* Salary Potential */}
        <motion.div variants={item} className="bg-card border border-border/50 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-medium text-muted-foreground">Salary Potential</div>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div>
            <span className="text-2xl font-bold text-foreground">
              AED {(metrics.salaryPotential / 1000).toFixed(0)}K
            </span>
            <span className="text-sm text-muted-foreground">/mo</span>
          </div>
          <div className="mt-2 text-xs text-green-400 font-medium flex items-center gap-1 mb-2">
            <TrendingUp className="w-3 h-3" />
            +{Math.round(((metrics.salaryPotential - profile.currentSalary) / profile.currentSalary) * 100)}% above current
          </div>
          <WhyPanel data={getWhySalaryPotential(profile)} />
        </motion.div>

        {/* Interview Readiness */}
        <motion.div variants={item} className="bg-card border border-border/50 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="text-sm font-medium text-muted-foreground">Interview Readiness</div>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-foreground">{metrics.interviewReadiness}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mb-2">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${metrics.interviewReadiness}%` }} />
          </div>
          <div className={`text-xs mb-2 ${skillGaps.length > 3 ? 'text-amber-400' : 'text-green-400'}`}>
            {skillGaps.length} skill gap{skillGaps.length !== 1 ? 's' : ''} to close
          </div>
          <WhyPanel data={getWhyInterviewReadiness(profile, metrics.interviewReadiness)} />
        </motion.div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={item} className="lg:col-span-2 bg-card border border-border/50 rounded-xl p-5">
          <h3 className="text-base font-semibold mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Career Timeline Projection
          </h3>
          <p className="text-xs text-muted-foreground mb-5">
            Current path (AED {(profile.currentSalary / 1000).toFixed(0)}K/mo base) vs recommended GCC move
          </p>
          <div className="h-[240px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeline} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(v: number) => [`AED ${(v / 1000).toFixed(1)}K/mo`, '']}
                  />
                  <Line type="monotone" dataKey="current"     stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Current Path" strokeDasharray="5 3" />
                  <Line type="monotone" dataKey="recommended" stroke="hsl(var(--primary))"          strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} name="Recommended Path" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-card border border-border/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold">Top Skills Missing</h3>
            <Link href="/career-intelligence" className="text-xs text-primary hover:underline">Full Analysis</Link>
          </div>
          <div className="space-y-4">
            {skillGaps.length === 0 ? (
              <p className="text-sm text-muted-foreground">Great! Your skills cover all key market demands for {profile.sector}.</p>
            ) : skillGaps.map((skill, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">{skill.name}</span>
                  <span className="text-muted-foreground">{skill.gap}% gap</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className={`${skill.color} h-1.5 rounded-full`} style={{ width: `${skill.gap}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Latest Opportunities */}
        <motion.div variants={item} className="bg-card border border-border/50 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold">Latest Opportunities</h3>
            <Link href="/jobs" className="text-xs text-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {jobs.map((job, i) => (
              <div key={i} className="flex flex-col p-3 rounded-lg border border-border/30 hover:bg-muted/20 transition-colors gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {job.company.substring(0, 1)}
                    </div>
                    <div>
                      <div className="font-medium text-sm flex items-center gap-2">
                        {job.title}
                        {job.isGhost && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-500 font-semibold border border-amber-500/20">
                            ⚠️ Ghost {job.ghostRisk}%
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                        {job.company} · {job.flag} {job.loc}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-sm font-medium text-primary">{job.salaryLabel}</span>
                    <span className={`text-xs font-bold ${job.match >= 85 ? 'text-emerald-400' : job.match >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                      {job.match}% match
                    </span>
                  </div>
                </div>
                {/* Why panels for match and ghost risk */}
                <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-border/20">
                  <WhyPanel
                    data={getWhyJobMatch(job, profile, job.match)}
                    trigger="badge"
                    className="w-auto"
                  />
                  {job.isGhost && (
                    <WhyPanel
                      data={getWhyGhostRisk(job)}
                      trigger="badge"
                      className="w-auto"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Career Simulations */}
        <motion.div variants={item} className="bg-card border border-border/50 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold">Recent Career Simulations</h3>
            <Link href="/ai-decision-engine" className="text-xs text-primary hover:underline">New Analysis</Link>
          </div>
          <div className="space-y-3">
            {simulations.map((sim, i) => (
              <div key={i} className="p-3 rounded-lg border border-border/30 hover:border-primary/30 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm group-hover:text-primary transition-colors">{sim.name}</span>
                  <span className="text-xs text-muted-foreground">{sim.date}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-lg font-bold ${sim.prob > 70 ? 'text-green-500' : sim.prob > 55 ? 'text-amber-500' : 'text-red-500'}`}>
                    {sim.prob}%
                  </span>
                  <span className="text-xs text-muted-foreground">Probability of Success</span>
                </div>
                <WhyPanel
                  data={getWhyHireProbabilityDashboard(profile, sim.prob)}
                  trigger="badge"
                  className="w-auto"
                />
              </div>
            ))}
            <Link href="/ai-decision-engine">
              <div className="p-3 rounded-lg border border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-colors cursor-pointer text-center">
                <span className="text-xs text-primary font-medium flex items-center justify-center gap-2">
                  <Brain className="w-3.5 h-3.5" /> Run AI Decision Engine Analysis
                </span>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
