import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, User, ChevronRight, Settings2, SlidersHorizontal, MapPin } from 'lucide-react';

export default function CareerTwinPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi Ahmed, I\'m your Career Twin. I\'ve analyzed your 8 years of Product Management experience across Dubai and Riyadh. Where do you want to be in 5 years?' },
    { role: 'user', content: 'I want to reach a VP level, ideally in Saudi Arabia given the giga-projects. But I\'m worried about Saudization pushing me out of leadership roles.' },
    { role: 'assistant', content: 'Valid concern. Looking at the data, 65% of VP-level Product roles in KSA Government/Semi-Govt are restricted to nationals. However, in the private tech sector (like Fintech and E-commerce), expat leadership is still highly viable (only 12% restricted).\n\nIf you pivot strictly to Fintech now, your probability of reaching VP in Riyadh jumps from 42% to 78%. Shall I simulate this path?' },
  ]);

  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Simulating the impact of that choice... Based on current market velocity, this adds a 15% salary premium but increases your nationalization risk in year 3. Updating the visualization.' }]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6">
      <div className="flex flex-col gap-1 flex-shrink-0">
        <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Career Twin
        </h2>
        <p className="text-muted-foreground text-sm">Simulate your career decisions before you make them</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Left: Chat Interface */}
        <div className="w-full lg:w-[40%] flex flex-col bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border/50 bg-muted/20 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium">Career Twin AI</div>
              <div className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Active Simulation
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
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
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right: Dynamic Visualization */}
        <div className="w-full lg:w-[60%] flex flex-col gap-4 min-h-0">
          <div className="flex-1 bg-card border border-border/50 rounded-xl p-6 relative overflow-hidden flex items-center justify-center">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            {/* Tree Visualization */}
            <div className="relative z-10 w-full h-full flex items-center">
              {/* Root */}
              <div className="w-1/3 flex justify-end pr-8 relative">
                <div className="bg-background border-2 border-primary shadow-[0_0_15px_rgba(59,130,246,0.3)] p-4 rounded-xl w-48 text-center z-10">
                  <div className="text-xs text-muted-foreground mb-1">Current State</div>
                  <div className="font-semibold text-sm">Senior PM</div>
                  <div className="text-xs flex items-center justify-center gap-1 mt-1 text-muted-foreground"><MapPin className="w-3 h-3"/> Dubai, UAE</div>
                </div>
                {/* Connecting Lines */}
                <svg className="absolute right-0 top-1/2 w-8 h-[200px] -translate-y-1/2 pointer-events-none" style={{ zIndex: 0 }}>
                  <path d="M 0 100 L 32 20" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" opacity="0.5" strokeDasharray="4 4"/>
                  <path d="M 0 100 L 32 100" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" opacity="0.5"/>
                  <path d="M 0 100 L 32 180" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none" opacity="0.3"/>
                </svg>
              </div>

              {/* Branches */}
              <div className="w-2/3 flex flex-col justify-center gap-8 pl-0">
                <div className="bg-card border border-border/50 p-4 rounded-xl w-64 shadow-lg hover:border-primary/50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-green-400 font-medium">78% Probability</div>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">Path A</span>
                  </div>
                  <div className="font-semibold text-sm">VP of Product</div>
                  <div className="text-xs flex items-center gap-1 mt-1 text-muted-foreground"><MapPin className="w-3 h-3"/> Riyadh (Fintech)</div>
                  <div className="mt-3 text-xs text-primary font-medium">SAR 55K / month</div>
                </div>

                <div className="bg-card border-2 border-primary/50 p-4 rounded-xl w-64 shadow-[0_0_20px_rgba(59,130,246,0.1)] relative">
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-[10px] text-primary">AI</div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-green-400 font-medium">85% Probability</div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Recommended</span>
                  </div>
                  <div className="font-semibold text-sm">Head of Product</div>
                  <div className="text-xs flex items-center gap-1 mt-1 text-muted-foreground"><MapPin className="w-3 h-3"/> Dubai (Tech)</div>
                  <div className="mt-3 text-xs text-primary font-medium">AED 50K / month</div>
                </div>

                <div className="bg-muted/30 border border-border/50 p-4 rounded-xl w-64 opacity-60">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-red-400 font-medium">24% Probability</div>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">Path C</span>
                  </div>
                  <div className="font-semibold text-sm">VP of Product</div>
                  <div className="text-xs flex items-center gap-1 mt-1 text-muted-foreground"><MapPin className="w-3 h-3"/> KSA (Govt)</div>
                  <div className="mt-3 text-[10px] text-red-400 font-medium border border-red-500/20 bg-red-500/10 px-2 py-1 rounded inline-block">High Nationalization Risk</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-5 shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Simulation Variables</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Timeline</label>
                <select className="w-full bg-muted/50 border border-border/50 rounded-md text-sm p-2 outline-none focus:border-primary/50">
                  <option>3 Years</option>
                  <option selected>5 Years</option>
                  <option>10 Years</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Risk Tolerance</label>
                <select className="w-full bg-muted/50 border border-border/50 rounded-md text-sm p-2 outline-none focus:border-primary/50">
                  <option>Conservative</option>
                  <option selected>Moderate</option>
                  <option>Aggressive</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-muted-foreground mb-2 block">Priority: Salary vs Title</label>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs text-muted-foreground">Title</span>
                  <input type="range" className="flex-1 accent-primary" defaultValue="70" />
                  <span className="text-xs text-muted-foreground">Salary</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
