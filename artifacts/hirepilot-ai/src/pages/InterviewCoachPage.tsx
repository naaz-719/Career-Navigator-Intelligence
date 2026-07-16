import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Play, PlayCircle, Clock, CheckCircle2, TrendingUp, AlertCircle, Building2, MapPin } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const performanceData = [
  { subject: 'Communication', score: 85, benchmark: 75, fullMark: 100 },
  { subject: 'Problem Solving', score: 78, benchmark: 80, fullMark: 100 },
  { subject: 'Cultural Fit', score: 92, benchmark: 85, fullMark: 100 },
  { subject: 'Technical Depth', score: 88, benchmark: 85, fullMark: 100 },
  { subject: 'Leadership', score: 82, benchmark: 70, fullMark: 100 },
  { subject: 'Negotiation', score: 65, benchmark: 80, fullMark: 100 },
];

export default function InterviewCoachPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Interview Coach
        </h2>
        <p className="text-muted-foreground text-sm">AI-powered practice for GCC interviews</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border/50 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <PlayCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">12</div>
            <div className="text-xs text-muted-foreground">Sessions Completed</div>
          </div>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">73%</div>
            <div className="text-xs text-muted-foreground">Average Score</div>
          </div>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-lg font-bold text-foreground leading-tight">Salary Nego.</div>
            <div className="text-xs text-muted-foreground mt-0.5">Weakest Area</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Setup & History */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* New Session Card */}
          <div className="bg-card border border-border/50 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            
            <h3 className="font-semibold text-lg mb-4">Start New Session</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Target Role</label>
                <select className="w-full bg-muted/50 border border-border/50 rounded-md text-sm p-2.5 outline-none focus:border-primary/50">
                  <option>Senior Product Manager</option>
                  <option>Head of Product</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Company (Optional)</label>
                <select className="w-full bg-muted/50 border border-border/50 rounded-md text-sm p-2.5 outline-none focus:border-primary/50">
                  <option>Generic Tech (UAE)</option>
                  <option>Saudi Aramco</option>
                  <option>Talabat</option>
                  <option>Noon</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Interview Type</label>
                <select className="w-full bg-muted/50 border border-border/50 rounded-md text-sm p-2.5 outline-none focus:border-primary/50">
                  <option>Behavioral</option>
                  <option>Technical / Case</option>
                  <option>Cultural Fit (GCC)</option>
                </select>
              </div>
            </div>
            
            <button className="w-full md:w-auto bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Mic className="w-4 h-4" /> Start Voice Session
            </button>
          </div>

          {/* Past Sessions */}
          <div className="bg-card border border-border/50 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">Past Sessions</h3>
            <div className="space-y-3">
              {/* In Progress */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-primary/30 bg-primary/5 relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg"></div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">N</div>
                  <div>
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      Noon - Senior PM
                      <span className="flex items-center gap-1 text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> In Progress
                      </span>
                    </h4>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3" /> Today, 10:30 AM
                    </div>
                  </div>
                </div>
                <button className="text-sm text-primary font-medium hover:underline">Resume</button>
              </div>

              {/* Completed 1 */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/10 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">S</div>
                  <div>
                    <h4 className="font-medium text-sm">Saudi Aramco - Tech Lead</h4>
                    <div className="text-xs text-muted-foreground mt-1">Oct 12 • Behavioral • <span className="text-foreground font-medium">Score: 82%</span></div>
                  </div>
                </div>
                <button className="text-xs border border-border/50 bg-background hover:bg-muted px-3 py-1.5 rounded transition-colors">Review</button>
              </div>

              {/* Completed 2 */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/10 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">C</div>
                  <div>
                    <h4 className="font-medium text-sm">Careem - Product Manager</h4>
                    <div className="text-xs text-muted-foreground mt-1">Sep 28 • Product Case • <span className="text-foreground font-medium">Score: 76%</span></div>
                  </div>
                </div>
                <button className="text-xs border border-border/50 bg-background hover:bg-muted px-3 py-1.5 rounded transition-colors">Review</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Performance & Bank */}
        <div className="space-y-6">
          
          <div className="bg-card border border-border/50 rounded-xl p-6">
            <h3 className="font-semibold text-sm mb-4">Performance Breakdown</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={performanceData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                  <Radar name="Your Avg Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} />
                  <Radar name="GCC Benchmark" dataKey="benchmark" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.2} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs mt-2">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-primary rounded-sm"></div> You</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-accent/50 rounded-sm"></div> Benchmark</div>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-sm">Question Bank</h3>
              <button className="text-xs text-primary hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                { q: "How do you handle nationalization quotas impacting your team?", tag: "GCC Specific", diff: "Hard" },
                { q: "Tell me about a time you launched a product in KSA.", tag: "Behavioral", diff: "Med" },
                { q: "How do you build trust with local stakeholders?", tag: "Cultural", diff: "Hard" }
              ].map((item, i) => (
                <div key={i} className="p-3 border border-border/50 rounded-lg hover:border-primary/30 transition-colors cursor-pointer group">
                  <p className="text-xs font-medium leading-snug mb-2 group-hover:text-primary transition-colors">{item.q}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{item.tag}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${item.diff === 'Hard' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>{item.diff}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
