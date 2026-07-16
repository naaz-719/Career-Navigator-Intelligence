import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  LineChart, 
  Bot, 
  GitMerge, 
  Briefcase, 
  FileText, 
  Mic, 
  Globe, 
  Banknote, 
  ShieldAlert, 
  Settings 
} from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: LineChart, label: 'Career Intelligence', href: '/career-intelligence' },
  { icon: Bot, label: 'Career Twin', href: '/career-twin' },
  { icon: GitMerge, label: 'Career Multiverse', href: '/career-multiverse' },
  { icon: Briefcase, label: 'Jobs', href: '/jobs' },
  { icon: FileText, label: 'Resume Studio', href: '/resume-studio' },
  { icon: Mic, label: 'Interview Coach', href: '/interview-coach' },
  { icon: Globe, label: 'Relocation', href: '/relocation' },
  { icon: Banknote, label: 'Salary Intelligence', href: '/salary-intelligence' },
  { icon: ShieldAlert, label: 'Nationalization', href: '/nationalization' },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-border/50 bg-card/30 backdrop-blur-xl hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-display)' }}>
            ✈ HirePilot AI
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className="block relative">
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary/10 rounded-md border border-primary/20"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={`relative flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}>
                <item.icon className={`h-5 w-5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-3 mt-auto border-t border-border/50">
        <Link href="/settings" className="block relative">
          <div className={`relative flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
            location === '/settings' ? 'text-primary bg-primary/10 border border-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          }`}>
            <Settings className="h-5 w-5" />
            <span className="text-sm font-medium">Settings</span>
          </div>
        </Link>
        
        <div className="mt-4 flex items-center gap-3 px-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">Ahmed M.</span>
            <span className="text-xs text-muted-foreground">Pro Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
