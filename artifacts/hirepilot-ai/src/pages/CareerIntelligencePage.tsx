import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Activity, TrendingUp, Clock, AlertTriangle, ShieldAlert, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';

const velocityData = [
  { month: 'Jan', Tech: 4000, Finance: 2400, Energy: 2400, Healthcare: 3200, Construction: 2100, Government: 1500 },
  { month: 'Feb', Tech: 3000, Finance: 1398, Energy: 2210, Healthcare: 3000, Construction: 2500, Government: 1600 },
  { month: 'Mar', Tech: 2000, Finance: 9800, Energy: 2290, Healthcare: 2900, Construction: 2800, Government: 1700 },
  { month: 'Apr', Tech: 2780, Finance: 3908, Energy: 2000, Healthcare: 2800, Construction: 3200, Government: 1800 },
  { month: 'May', Tech: 1890, Finance: 4800, Energy: 2181, Healthcare: 2500, Construction: 3500, Government: 2000 },
  { month: 'Jun', Tech: 2390, Finance: 3800, Energy: 2500, Healthcare: 2600, Construction: 3100, Government: 2100 },
  { month: 'Jul', Tech: 3490, Finance: 4300, Energy: 2100, Healthcare: 2800, Construction: 2900, Government: 2200 },
  { month: 'Aug', Tech: 4000, Finance: 2400, Energy: 2400, Healthcare: 3200, Construction: 2100, Government: 2400 },
  { month: 'Sep', Tech: 3000, Finance: 1398, Energy: 2210, Healthcare: 3000, Construction: 2500, Government: 2600 },
  { month: 'Oct', Tech: 2000, Finance: 9800, Energy: 2290, Healthcare: 2900, Construction: 2800, Government: 2700 },
  { month: 'Nov', Tech: 2780, Finance: 3908, Energy: 2000, Healthcare: 2800, Construction: 3200, Government: 2800 },
  { month: 'Dec', Tech: 3890, Finance: 4800, Energy: 2181, Healthcare: 3000, Construction: 3500, Government: 2900 },
];

const skillData = [
  { subject: 'Product Strategy', A: 90, B: 85, fullMark: 100 },
  { subject: 'Cloud Architecture', A: 40, B: 85, fullMark: 100 },
  { subject: 'Agile/Scrum', A: 85, B: 80, fullMark: 100 },
  { subject: 'Arabic Comms', A: 30, B: 75, fullMark: 100 },
  { subject: 'Data Analytics', A: 60, B: 70, fullMark: 100 },
  { subject: 'Stakeholder Mgmt', A: 95, B: 85, fullMark: 100 },
];

export default function CareerIntelligencePage() {
  const [activeTab, setActiveTab] = useState('market');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Career Intelligence
        </h2>
        <p className="text-muted-foreground text-sm">AI-powered market analysis for your profile</p>
      </div>

      <div className="flex space-x-1 p-1 bg-muted/50 rounded-lg w-full md:w-max">
        {['market', 'skills', 'nationalization'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
              activeTab === tab 
                ? 'bg-card text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {tab === 'market' ? 'Market Overview' : tab === 'skills' ? 'Skill Gap Analysis' : 'Nationalization Radar'}
          </button>
        ))}
      </div>

      {activeTab === 'market' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-muted-foreground">Demand Score</div>
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground">8.2<span className="text-lg text-muted-foreground">/10</span></div>
              <div className="mt-2 text-xs text-muted-foreground">High demand for PMs in UAE & KSA</div>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-muted-foreground">Market Velocity</div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-green-500">↑ 14%</div>
              <div className="mt-2 text-xs text-muted-foreground">Hiring volume vs last quarter</div>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-muted-foreground">Avg Time to Hire</div>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-bold text-foreground">23 <span className="text-lg text-muted-foreground">days</span></div>
              <div className="mt-2 text-xs text-muted-foreground">-4 days compared to 2023</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-card border border-border/50 rounded-xl p-5">
              <h3 className="text-base font-semibold mb-6">GCC Hiring Velocity by Sector</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorFin" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="Tech" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorTech)" />
                    <Area type="monotone" dataKey="Finance" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorFin)" />
                    <Area type="monotone" dataKey="Energy" stroke="hsl(var(--chart-3))" fillOpacity={0} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-xl p-5">
              <h3 className="text-base font-semibold mb-4">Top Hiring Companies</h3>
              <div className="space-y-4">
                {[
                  { name: 'Neom', roles: 142, growth: '+24%' },
                  { name: 'Emirates NBD', roles: 89, growth: '+12%' },
                  { name: 'Talabat', roles: 76, growth: '+8%' },
                  { name: 'Aramco', roles: 64, growth: '+5%' },
                  { name: 'Emaar', roles: 52, growth: '+15%' },
                ].map((co, i) => (
                  <div key={i} className="flex items-center justify-between p-2 hover:bg-muted/20 rounded-lg transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {co.name.substring(0,1)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{co.name}</div>
                        <div className="text-xs text-muted-foreground">{co.roles} open roles</div>
                      </div>
                    </div>
                    <span className="text-xs text-green-400 font-medium">{co.growth}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'skills' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border/50 rounded-xl p-5 flex flex-col items-center">
            <h3 className="text-base font-semibold mb-6 self-start">Your Skills vs Market Demand</h3>
            <div className="h-[350px] w-full max-w-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Radar name="Your Skills" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} />
                  <Radar name="Market Demand" dataKey="B" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 text-xs mt-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-primary opacity-60"></div> Your Profile</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-accent opacity-60"></div> Market Demand</div>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-5">
            <h3 className="text-base font-semibold mb-6">Ranked Skill Gaps</h3>
            <div className="space-y-4">
              {[
                { name: 'Cloud Architecture', severity: 'Critical', gap: '45% below market', desc: 'Required for 82% of Senior PM roles in UAE' },
                { name: 'Arabic Business Comms', severity: 'High', gap: '40% below market', desc: 'Mandatory for 65% of Govt/Semi-Govt roles in KSA' },
                { name: 'Data Analytics', severity: 'Medium', gap: '10% below market', desc: 'Preferred for most Fintech roles across GCC' },
              ].map((gap, i) => (
                <div key={i} className="p-4 rounded-lg border border-border/50 bg-muted/10">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{gap.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{gap.desc}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      gap.severity === 'Critical' ? 'bg-red-500/10 text-red-500' :
                      gap.severity === 'High' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {gap.severity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-muted-foreground">{gap.gap}</span>
                    <button className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
                      <BookOpen className="w-3 h-3" /> Learning Path
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'nationalization' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { country: 'UAE', flag: '🇦🇪', policy: 'Emiratisation', risk: 'Low', ratio: '8% target', trend: '↑', color: 'text-green-500', bg: 'bg-green-500/10' },
            { country: 'Saudi Arabia', flag: '🇸🇦', policy: 'Saudization (Nitaqat)', risk: 'High', ratio: '30% target', trend: '↑', color: 'text-red-500', bg: 'bg-red-500/10' },
            { country: 'Oman', flag: '🇴🇲', policy: 'Omanisation', risk: 'High', ratio: 'Varies by sector', trend: '↑', color: 'text-red-500', bg: 'bg-red-500/10' },
            { country: 'Qatar', flag: '🇶🇦', policy: 'Qatarisation', risk: 'Medium', ratio: '20% target', trend: '→', color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { country: 'Bahrain', flag: '🇧🇭', policy: 'Bahrainisation', risk: 'Medium', ratio: 'Varies by sector', trend: '→', color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { country: 'Kuwait', flag: '🇰🇼', policy: 'Kuwaitisation', risk: 'High', ratio: '100% in Govt', trend: '↑', color: 'text-red-500', bg: 'bg-red-500/10' },
          ].map((nat, i) => (
            <div key={i} className="bg-card border border-border/50 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{nat.flag}</span>
                <h3 className="font-semibold text-lg">{nat.country}</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Policy</span>
                  <span className="font-medium">{nat.policy}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Quota</span>
                  <span className="font-medium">{nat.ratio}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-border/50">
                  <span className="text-sm font-medium">Your Expat Risk</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${nat.bg} ${nat.color}`}>
                      {nat.risk} Risk
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

    </div>
  );
}
