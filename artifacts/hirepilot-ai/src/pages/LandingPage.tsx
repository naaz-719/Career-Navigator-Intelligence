import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowRight, Shield, TrendingUp, Sparkles, Brain, Briefcase, ChevronRight, Activity, MapPin, GitMerge, ShieldAlert } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary-foreground font-sans">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-display)' }}>
              ✈ HirePilot AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#countries" className="hover:text-foreground transition-colors">GCC Countries</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hidden md:block text-sm font-medium text-foreground hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link href="/dashboard" className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]">
              Start Free Analysis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10"></div>
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none -z-10 mix-blend-overlay"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-xs font-medium text-muted-foreground mb-8"
        >
          <span className="flex gap-1">🇦🇪 🇸🇦 🇴🇲 🇶🇦 🇧🇭 🇰🇼</span>
          <div className="w-1 h-1 rounded-full bg-primary/50 mx-1"></div>
          Now live across all GCC countries
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1] mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          The World's First <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI Career Intelligence</span> Platform for GCC Professionals
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
        >
          Stop guessing your next career move. HirePilot AI analyzes your profile, GCC hiring trends, salary benchmarks, and nationalization policies to recommend the career path with the highest probability of success.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link href="/dashboard" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg text-base font-semibold shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_35px_rgba(59,130,246,0.5)] transition-all">
            Analyze My Career <ArrowRight className="w-4 h-4" />
          </Link>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent border border-border hover:bg-muted/30 text-foreground px-8 py-4 rounded-lg text-base font-medium transition-colors">
            Watch Demo
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <div className="flex -space-x-3">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className={`w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br from-muted to-muted-foreground/30 flex items-center justify-center text-xs font-bold ring-2 ring-background`} />
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex gap-1 text-yellow-500">
              {'★★★★★'.split('').map((s,i)=><span key={i}>{s}</span>)}
            </div>
            <span>Trusted by 12,400+ GCC professionals</span>
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 relative w-full max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none rounded-2xl"></div>
          <div className="relative rounded-2xl border border-border/50 bg-card/40 backdrop-blur-2xl p-2 shadow-2xl overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" 
              alt="Dashboard Preview" 
              className="rounded-xl opacity-50 grayscale group-hover:grayscale-0 transition-all duration-700 w-full object-cover h-[400px]"
            />
            
            {/* Floating Elements overlay */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-2xl min-w-[280px]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">GCC Career Score</span>
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold text-foreground">87</span>
                <span className="text-sm text-green-400 font-medium mb-1">Top 12%</span>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50 flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Best Match</span>
                  <span className="font-medium">🇦🇪 UAE Tech</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Salary Potential</span>
                  <span className="font-medium text-primary">AED 45K/mo</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 border-t border-white/5 bg-muted/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Intelligence over intuition</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Six powerful AI engines working together to give you an unfair advantage in the GCC job market.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Activity, title: 'GCC Employability Score', desc: 'AI-computed score predicting your success probability in each GCC country based on real hiring data.' },
              { icon: GitMerge, title: 'Career Multiverse', desc: 'Compare 5 future career paths side-by-side with probability forecasts and financial projections.' },
              { icon: Brain, title: 'Career Twin', desc: 'Interactive AI simulation of your career 5 years into any path. Ask questions, explore scenarios.' },
              { icon: Shield, title: 'Nationalization Shield', desc: 'Know your expat risk before accepting a job. Real-time Emiratisation & Saudization policy analysis.' },
              { icon: TrendingUp, title: 'Salary Intelligence', desc: 'Real-time salary benchmarks with granular national vs expat delta breakdowns by sector.' },
              { icon: ShieldAlert, title: 'Ghost Job Detector', desc: 'AI flags fake, expired, or data-harvesting job postings before you waste your time applying.' },
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5 text-sm text-muted-foreground text-center">
        <p>© 2024 HirePilot AI. "Know Before You Apply. Know Before You Move."</p>
      </footer>
    </div>
  );
}
