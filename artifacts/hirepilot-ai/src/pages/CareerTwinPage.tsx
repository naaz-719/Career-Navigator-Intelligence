import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, User, ChevronRight, MapPin } from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';
import { getCareerTwinMessages, getSkillGaps } from '@/services/mockDataService';

// Career path tree data — driven by profile's target countries
function buildPathTree(targetCountries: string[], currentRole: string) {
  const top = targetCountries[0]?.includes('Saudi') ? 'KSA' : 'UAE';
  const second = targetCountries[1]?.includes('Qatar') ? 'Qatar' : targetCountries[1]?.includes('Saudi') ? 'KSA' : 'UAE';
  return {
    pathA:         { label: `VP ${top} Fintech`,          prob: 78, salary: top === 'KSA' ? 'SAR 55K' : 'AED 55K', years: '3–4 yrs' },
    recommended:   { label: `Head of Product ${top}`,     prob: 85, salary: top === 'KSA' ? 'SAR 50K' : 'AED 50K', years: '2–3 yrs' },
    current:       { label: currentRole,                  prob: 100, salary: '', years: 'Now' },
    pathC:         { label: `Director ${second} BigTech`, prob: 62, salary: second === 'KSA' ? 'SAR 60K' : 'AED 60K', years: '4–5 yrs' },
  };
}

export default function CareerTwinPage() {
  const { profile } = useProfile();

  // Backend seam: replace with POST /api/career-twin/session
  const initialMessages = getCareerTwinMessages(profile);
  const skillGaps = getSkillGaps(profile);
  const paths = buildPathTree(profile.targetCountries, profile.currentRole);

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    // Simulated response — replace with POST /api/career-twin/message
    setTimeout(() => {
      const topGap = skillGaps[0]?.name ?? 'in-demand skills';
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Simulating that path across your ${profile.yearsExperience}-year ${profile.sector} profile...\n\nAdding ${topGap} to your skillset increases your VP-track probability by 15% and adds a salary premium of approximately AED 6–9K/mo. However, this path increases your nationalization exposure in ${profile.targetCountries.find(c => c.includes('Saudi')) ? 'KSA' : 'UAE'} by year 3.\n\nWould you like me to model the risk-adjusted timeline?`,
      }]);
    }, 1100);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6">
      <div className="flex flex-col gap-1 flex-shrink-0">
        <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Career Twin
        </h2>
        <p className="text-muted-foreground text-sm">
          Simulate your career decisions · {profile.name} · {profile.currentRole} · {profile.yearsExperience} yrs
        </p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">

        {/* Left: Chat Interface */}
        <div className="w-full lg:w-[42%] flex flex-col bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border/50 bg-muted/20 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium">Career Twin AI</div>
              <div className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Active · {profile.sector} specialist
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-muted' : 'bg-primary/20'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-foreground" /> : <Bot className="w-4 h-4 text-primary" />}
                </div>
                <div className={`p-3 rounded-lg text-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                    : 'bg-muted/50 border border-border/50 text-foreground rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-4 border-t border-border/50 bg-background">
            <form onSubmit={handleSend} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your Career Twin..."
                className="w-full bg-muted/50 border border-border/50 rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md bg-primary flex items-center justify-center hover:bg-primary/80 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </form>
          </div>
        </div>

        {/* Right: Career Path Visualization */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <div className="bg-card border border-border/50 rounded-xl p-5 flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold">Career Path Simulation</h3>
              <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                Based on your live profile
              </span>
            </div>

            {/* Path tree */}
            <div className="relative flex flex-col items-center gap-0 py-4">

              {/* Recommended (top) */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                className="w-full max-w-md p-4 rounded-xl border border-primary/40 bg-primary/5 mb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">★ Recommended Path</div>
                    <div className="font-semibold text-foreground">{paths.recommended.label}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> {paths.recommended.years}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-500">{paths.recommended.prob}%</div>
                    <div className="text-xs text-muted-foreground">probability</div>
                    <div className="text-sm font-medium text-primary mt-1">{paths.recommended.salary}/mo</div>
                  </div>
                </div>
              </motion.div>

              <div className="w-px h-6 bg-border/50" />

              {/* Current */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                className="w-full max-w-md p-4 rounded-xl border-2 border-primary bg-primary/10 mb-2">
                <div className="text-center">
                  <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">Current Position</div>
                  <div className="font-bold text-foreground">{paths.current.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">AED {Math.round(profile.currentSalary / 1000)}K/mo · {profile.yearsExperience} yrs experience</div>
                </div>
              </motion.div>

              <div className="w-px h-6 bg-border/50" />

              {/* Fork */}
              <div className="w-full max-w-md flex gap-3">
                <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                  className="flex-1 p-3 rounded-xl border border-border/50 bg-card">
                  <div className="text-xs text-muted-foreground mb-1">Path A</div>
                  <div className="font-medium text-sm text-foreground">{paths.pathA.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{paths.pathA.years}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-amber-500">{paths.pathA.prob}%</span>
                    <span className="text-xs text-primary">{paths.pathA.salary}/mo</span>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
                  className="flex-1 p-3 rounded-xl border border-border/50 bg-card">
                  <div className="text-xs text-muted-foreground mb-1">Path B</div>
                  <div className="font-medium text-sm text-foreground">{paths.pathC.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{paths.pathC.years}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-red-500">{paths.pathC.prob}%</span>
                    <span className="text-xs text-primary">{paths.pathC.salary}/mo</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Top skill to add */}
          {skillGaps[0] && (
            <div className="bg-card border border-amber-500/20 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">Top Skill to Unlock VP Track</p>
                <p className="text-sm font-medium text-foreground">{skillGaps[0].name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Adding this skill increases your hire probability by ~9%</p>
              </div>
              <button className="flex items-center gap-1 text-xs text-primary font-medium hover:underline flex-shrink-0">
                View Learning Path <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
