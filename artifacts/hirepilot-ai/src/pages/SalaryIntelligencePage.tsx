import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, AlertCircle, Building2, MapPin } from 'lucide-react';

const salaryTrendData = [
  { month: 'Jan 22', UAE: 32000, KSA: 30000, QA: 28000 },
  { month: 'Jun 22', UAE: 33000, KSA: 33000, QA: 29000 },
  { month: 'Jan 23', UAE: 34500, KSA: 38000, QA: 29500 },
  { month: 'Jun 23', UAE: 35000, KSA: 42000, QA: 30000 },
  { month: 'Jan 24', UAE: 36000, KSA: 45000, QA: 31000 },
  { month: 'Jun 24', UAE: 38500, KSA: 48000, QA: 31500 },
];

const deltaData = [
  { country: 'UAE', national: 45000, expat: 35000 },
  { country: 'KSA', national: 55000, expat: 40000 },
  { country: 'Qatar', national: 48000, expat: 32000 },
  { country: 'Oman', national: 25000, expat: 18000 },
];

export default function SalaryIntelligencePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Salary Intelligence
        </h2>
        <p className="text-muted-foreground text-sm">Real-time GCC compensation benchmarks</p>
      </div>

      {/* Explorer Tool */}
      <div className="bg-card border border-border/50 rounded-xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Role</label>
            <select className="w-full bg-muted/50 border border-border/50 rounded-md text-sm p-2 outline-none">
              <option>Senior Product Manager</option>
              <option>Product Director</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Country</label>
            <select className="w-full bg-muted/50 border border-border/50 rounded-md text-sm p-2 outline-none">
              <option>UAE</option>
              <option>Saudi Arabia</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Experience</label>
            <select className="w-full bg-muted/50 border border-border/50 rounded-md text-sm p-2 outline-none">
              <option>8-10 Years</option>
              <option>10+ Years</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Sector</label>
            <select className="w-full bg-muted/50 border border-border/50 rounded-md text-sm p-2 outline-none">
              <option>Technology</option>
              <option>Fintech</option>
              <option>Government</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-6 border-y border-border/50 mb-6">
          <div className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Median Market Rate</div>
          <div className="text-5xl font-bold text-foreground mb-4">AED 38,500 <span className="text-xl text-muted-foreground font-normal">/ mo</span></div>
          
          <div className="w-full max-w-2xl mt-6 relative">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>P25 (28K)</span>
              <span>P50 Median</span>
              <span>P75 (45K)</span>
              <span>P90 (55K+)</span>
            </div>
            <div className="h-3 w-full rounded-full bg-gradient-to-r from-muted via-primary/50 to-primary relative">
              {/* User Position */}
              <div className="absolute top-1/2 -translate-y-1/2 left-[67%] w-1 h-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] rounded-full -ml-0.5"></div>
              <div className="absolute -top-8 left-[67%] -translate-x-1/2 text-xs font-bold text-primary whitespace-nowrap bg-primary/10 px-2 py-1 rounded border border-primary/20">
                You (42K)
              </div>
            </div>
            <div className="text-center text-sm mt-4 text-green-400 font-medium">
              Your target salary puts you in the 67th percentile.
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary Trends */}
        <div className="bg-card border border-border/50 rounded-xl p-6">
          <h3 className="font-semibold text-base mb-6">Regional Growth Trends (24mo)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salaryTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorKsa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val)=>`${val/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="KSA" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorKsa)" />
                <Area type="monotone" dataKey="UAE" stroke="hsl(var(--muted-foreground))" strokeWidth={2} fillOpacity={0} />
                <Area type="monotone" dataKey="QA" stroke="hsl(var(--chart-3))" strokeWidth={2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">Saudi Arabia showing 50%+ growth in PM salaries due to Vision 2030 tech mandates.</div>
        </div>

        {/* National vs Expat Delta */}
        <div className="bg-card border border-border/50 rounded-xl p-6">
          <h3 className="font-semibold text-base mb-2">National vs Expat Delta</h3>
          <p className="text-xs text-muted-foreground mb-6">Premium paid to citizens to meet nationalization quotas.</p>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deltaData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val)=>`${val/1000}k`} />
                <YAxis dataKey="country" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'hsl(var(--muted)/0.3)'}} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="expat" name="Expat Avg" fill="hsl(var(--muted-foreground))" radius={[0, 4, 4, 0]} barSize={16} />
                <Bar dataKey="national" name="National Avg" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
