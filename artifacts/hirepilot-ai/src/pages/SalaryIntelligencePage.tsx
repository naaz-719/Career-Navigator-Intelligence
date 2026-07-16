import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';
import { getSalaryData } from '@/services/mockDataService';

const CHART_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

export default function SalaryIntelligencePage() {
  const { profile } = useProfile();

  // Backend seam: replace with useSWR('/api/salary', ...)
  const salary = getSalaryData(profile);

  const [selectedRole, setSelectedRole] = useState(profile.currentRole || 'Senior Product Manager');
  const [selectedCountry, setSelectedCountry] = useState(
    profile.targetCountries[0] ? profile.targetCountries[0].replace('United Arab Emirates', 'UAE').replace('Saudi Arabia', 'KSA') : 'UAE'
  );
  const [selectedSector, setSelectedSector] = useState(profile.sector);

  const pctPosition = Math.min(92, salary.userPercentile);
  const pctBarLeft = `${Math.min(88, Math.max(8, pctPosition - 4))}%`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Salary Intelligence
        </h2>
        <p className="text-muted-foreground text-sm">
          Real-time GCC compensation benchmarks · Calibrated to your {profile.sector} profile
        </p>
      </div>

      {/* Explorer Tool */}
      <div className="bg-card border border-border/50 rounded-xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Role</label>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="w-full bg-muted/50 border border-border/50 rounded-md text-sm p-2 outline-none"
            >
              <option>{profile.currentRole}</option>
              <option>Senior {profile.currentRole}</option>
              <option>Director of {profile.sector}</option>
              <option>VP {profile.sector}</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Country</label>
            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              className="w-full bg-muted/50 border border-border/50 rounded-md text-sm p-2 outline-none"
            >
              {profile.targetCountries.length > 0
                ? profile.targetCountries.map(c => <option key={c}>{c}</option>)
                : ['UAE', 'Saudi Arabia', 'Qatar'].map(c => <option key={c}>{c}</option>)
              }
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Experience</label>
            <select className="w-full bg-muted/50 border border-border/50 rounded-md text-sm p-2 outline-none"
              defaultValue={`${profile.yearsExperience >= 10 ? '10+' : profile.yearsExperience >= 7 ? '7–10' : '4–7'} Years`}
            >
              <option>4–7 Years</option>
              <option>7–10 Years</option>
              <option>10+ Years</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Sector</label>
            <select
              value={selectedSector}
              onChange={e => setSelectedSector(e.target.value)}
              className="w-full bg-muted/50 border border-border/50 rounded-md text-sm p-2 outline-none"
            >
              <option>{profile.sector}</option>
              <option>Technology</option>
              <option>Finance & Banking</option>
              <option>Healthcare</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-6 border-y border-border/50 mb-6">
          <div className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Median Market Rate</div>
          <div className="text-5xl font-bold text-foreground mb-4">
            AED {(salary.medianRate / 1000).toFixed(0)}K <span className="text-xl text-muted-foreground font-normal">/ mo</span>
          </div>

          <div className="w-full max-w-2xl mt-4 relative">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>P25 ({Math.round(salary.percentiles.p25 / 1000)}K)</span>
              <span>P50 Median</span>
              <span>P75 ({Math.round(salary.percentiles.p75 / 1000)}K)</span>
              <span>P90 ({Math.round(salary.percentiles.p90 / 1000)}K+)</span>
            </div>
            <div className="h-3 w-full rounded-full bg-gradient-to-r from-muted via-primary/50 to-primary relative">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-1 h-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] rounded-full -ml-0.5"
                style={{ left: pctBarLeft }}
              />
              <div
                className="absolute -top-8 -translate-x-1/2 text-xs font-bold text-primary whitespace-nowrap bg-primary/10 px-2 py-1 rounded border border-primary/20"
                style={{ left: pctBarLeft }}
              >
                You ({salary.targetK}K)
              </div>
            </div>
            <div className="text-center text-sm mt-4 text-green-400 font-medium">
              Your target salary puts you in the {pctPosition}th percentile for {profile.sector} · {profile.yearsExperience} years exp.
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary Trends */}
        <div className="bg-card border border-border/50 rounded-xl p-6">
          <h3 className="font-semibold text-base mb-1">Regional Growth Trends (30mo)</h3>
          <p className="text-xs text-muted-foreground mb-6">
            Projected from your current AED {Math.round(profile.currentSalary / 1000)}K/mo baseline across target markets
          </p>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salary.salaryTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  {salary.trendKeys.map((k, i) => (
                    <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={CHART_COLORS[i]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS[i]} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  formatter={(v: number) => [`AED ${(v / 1000).toFixed(1)}K`, '']} />
                {salary.trendKeys.map((key, i) => (
                  <Area key={key} type="monotone" dataKey={key}
                    stroke={CHART_COLORS[i]} strokeWidth={2}
                    fillOpacity={i === 0 ? 1 : 0} fill={`url(#grad-${key})`}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center gap-4 flex-wrap">
            {salary.trendKeys.map((key, i) => (
              <span key={key} className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: CHART_COLORS[i] }} /> {key}
              </span>
            ))}
          </div>
        </div>

        {/* National vs Expat Delta */}
        <div className="bg-card border border-border/50 rounded-xl p-6">
          <h3 className="font-semibold text-base mb-1">National vs Expat Delta</h3>
          <p className="text-xs text-muted-foreground mb-6">
            Salary premium paid to citizens to meet nationalization quotas (vs expat market rate).
          </p>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salary.deltaData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                <YAxis dataKey="country" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.1)' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  formatter={(v: number) => [`AED ${(v / 1000).toFixed(0)}K/mo`, '']} />
                <Bar dataKey="expat"    name="Expat Market Rate"   fill="hsl(var(--muted-foreground))" radius={[0, 4, 4, 0]} barSize={16} />
                <Bar dataKey="national" name="National Premium"     fill="hsl(var(--primary))"          radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-amber-400">
            <TrendingUp className="w-3 h-3" />
            Nationals earn {Math.round(((salary.deltaData[0]?.national ?? 1) / (salary.deltaData[0]?.expat ?? 1) - 1) * 100)}% more on average — reflects quota pressure
          </div>
        </div>
      </div>
    </div>
  );
}
