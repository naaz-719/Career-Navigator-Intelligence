import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Building, Briefcase, Bookmark, AlertTriangle, Filter, ChevronDown, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const jobs = [
  { id: 1, title: 'Senior Product Manager', company: 'Noon', sector: 'E-commerce', country: '🇦🇪', loc: 'Dubai', salary: 'AED 35K - 45K', match: 92, tags: ['Senior', 'Hybrid', 'Agile'], ghostRisk: 12, posted: '2 days ago' },
  { id: 2, title: 'Director of Product', company: 'Confidential', sector: 'FinTech', country: '🇸🇦', loc: 'Riyadh', salary: 'SAR 50K - 65K', match: 88, tags: ['Director', 'On-site', 'Payments'], ghostRisk: 85, posted: '5 hrs ago', isGhost: true },
  { id: 3, title: 'Lead PM - AI Initiatives', company: 'G42', sector: 'Tech / Smart City', country: '🇦🇪', loc: 'Dubai', salary: 'Disclosed to candidates', match: 84, tags: ['Lead', 'On-site', 'AI/ML'], ghostRisk: 5, posted: '1 week ago' },
  { id: 4, title: 'Product Owner', company: 'Talabat', sector: 'FoodTech', country: '🇶🇦', loc: 'Doha', salary: 'QAR 28K - 35K', match: 76, tags: ['Mid-level', 'Remote', 'B2C'], ghostRisk: 18, posted: '3 days ago' },
  { id: 5, title: 'VP Product Engineering', company: 'Saudi Aramco', sector: 'Energy / Tech', country: '🇸🇦', loc: 'Dhahran', salary: 'SAR 70K+', match: 65, tags: ['Executive', 'On-site', 'Enterprise'], ghostRisk: 2, posted: '2 weeks ago' },
  { id: 6, title: 'Technical PM', company: 'Wio', sector: 'AI / Cloud', country: '🇦🇪', loc: 'Abu Dhabi', salary: 'AED 30K - 40K', match: 94, tags: ['Senior', 'Hybrid', 'Cloud'], ghostRisk: 8, posted: '1 day ago' },
];

const insightsData = [
  { name: 'Tech', jobs: 420 },
  { name: 'FinTech', jobs: 380 },
  { name: 'Energy', jobs: 250 },
  { name: 'Govt', jobs: 190 },
];

export default function JobsPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* Filters Sidebar */}
      <div className="w-full lg:w-64 flex-shrink-0 space-y-6 hidden lg:block">
        <div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            AI-Matched Jobs
          </h2>
          <p className="text-xs text-muted-foreground">1,240 opportunities analyzed</p>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-4 space-y-5 sticky top-20">
          <div className="flex items-center gap-2 mb-2 font-medium text-sm">
            <Filter className="w-4 h-4" /> Filters
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Country</label>
            <div className="space-y-2">
              {['🇦🇪 UAE', '🇸🇦 Saudi Arabia', '🇶🇦 Qatar', '🇴🇲 Oman', '🇧🇭 Bahrain', '🇰🇼 Kuwait'].map((c, i) => (
                <label key={i} className="flex items-center gap-2 text-sm cursor-pointer group">
                  <input type="checkbox" defaultChecked={i < 2} className="rounded border-border bg-muted/50 text-primary focus:ring-primary/50" />
                  <span className="group-hover:text-primary transition-colors">{c}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border/50">
            <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Ghost Risk</label>
            <label className="flex items-center justify-between text-sm cursor-pointer">
              <span>Hide High Risk</span>
              <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-primary">
                <span className="translate-x-5 inline-block h-3 w-3 transform rounded-full bg-white transition" />
              </div>
            </label>
          </div>

          <div className="pt-4 border-t border-border/50">
            <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wider">Visa Sponsorship</label>
            <label className="flex items-center justify-between text-sm cursor-pointer">
              <span>Sponsorship Required</span>
              <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-primary">
                <span className="translate-x-5 inline-block h-3 w-3 transform rounded-full bg-white transition" />
              </div>
            </label>
          </div>

          <div className="pt-4 border-t border-border/50">
            <label className="text-xs font-semibold text-muted-foreground mb-3 block uppercase tracking-wider">Min Salary (Monthly)</label>
            <input type="range" className="w-full accent-primary" min="10000" max="100000" defaultValue="25000" />
            <div className="text-right text-xs text-primary font-medium mt-1">AED 25,000+</div>
          </div>
        </div>
      </div>

      {/* Main Feed */}
      <div className="flex-1 space-y-4">
        {/* Mobile Header */}
        <div className="lg:hidden mb-4">
          <h2 className="text-xl font-semibold text-foreground tracking-tight mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            AI-Matched Jobs
          </h2>
          <button className="flex items-center gap-2 text-sm bg-muted/50 px-3 py-2 rounded-md border border-border/50">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        <div className="flex justify-between items-center bg-card border border-border/50 p-2 rounded-lg mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search titles, skills, companies..." className="w-full bg-transparent border-none focus:outline-none pl-9 text-sm" />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground border-l border-border/50 pl-4">
            Sort by: <span className="text-foreground font-medium flex items-center gap-1 cursor-pointer">Match % <ChevronDown className="w-3 h-3"/></span>
          </div>
        </div>

        <div className="space-y-4">
          {jobs.map((job, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={job.id} 
              className={`bg-card border ${job.isGhost ? 'border-amber-500/30 bg-amber-500/[0.02]' : 'border-border/50 hover:border-primary/40'} rounded-xl p-5 transition-colors relative overflow-hidden group`}
            >
              {job.isGhost && (
                <div className="absolute top-0 left-0 right-0 bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-semibold text-amber-500">High Ghost Job Risk Detected (85%) — </span>
                  <span className="text-xs text-amber-500/80">Company has reposted this 4 times without hiring.</span>
                </div>
              )}
              
              <div className={`flex items-start justify-between ${job.isGhost ? 'mt-6' : ''}`}>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-lg font-bold border border-border/50 shrink-0">
                    {job.company.substring(0,1)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer">{job.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Building className="w-3 h-3"/> {job.company}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {job.country} {job.loc}</span>
                      <span className="hidden md:flex items-center gap-1"><Briefcase className="w-3 h-3"/> {job.sector}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.tags.map(t => (
                        <span key={t} className="px-2 py-1 rounded bg-muted/50 border border-border/50 text-xs text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between h-full gap-4">
                  <div className="text-right">
                    <div className={`text-xl font-bold ${job.match >= 85 ? 'text-green-500' : job.match >= 70 ? 'text-amber-500' : 'text-red-500'}`}>
                      {job.match}%
                    </div>
                    <div className="text-xs text-muted-foreground">Match</div>
                  </div>
                  <button className="text-muted-foreground hover:text-primary transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
                <div className="text-sm font-medium text-foreground">{job.salary}</div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">{job.posted}</span>
                  <button className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground px-4 py-1.5 rounded-md text-sm font-medium transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Insights Sidebar */}
      <div className="w-full lg:w-72 flex-shrink-0 space-y-6 hidden xl:block">
        <div className="bg-card border border-border/50 rounded-xl p-5 sticky top-20">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" /> AI Job Insights
          </h3>
          
          <div className="space-y-4 mb-6">
            <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
              <div className="text-xs text-muted-foreground mb-1">Avg Salary (Product UAE)</div>
              <div className="text-lg font-bold text-primary">AED 38,500</div>
              <div className="text-xs text-green-400 mt-1">↑ 2.4% this month</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
              <div className="text-xs text-muted-foreground mb-1">Ghost Job Rate</div>
              <div className="text-lg font-bold text-amber-500">14.2%</div>
              <div className="text-xs text-muted-foreground mt-1">in Tech Sector</div>
            </div>
          </div>

          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Trending Sectors</h4>
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insightsData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip cursor={{fill: 'hsl(var(--muted)/0.3)'}} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="jobs" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
