import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useLocation } from 'wouter';

export default function TopBar() {
  const [location] = useLocation();

  const getPageTitle = () => {
    switch(location) {
      case '/dashboard': return 'Dashboard';
      case '/career-intelligence': return 'Career Intelligence';
      case '/career-twin': return 'Career Twin';
      case '/career-multiverse': return 'Career Multiverse';
      case '/jobs': return 'Jobs';
      case '/resume-studio': return 'Resume Studio';
      case '/interview-coach': return 'Interview Coach';
      case '/relocation': return 'Relocation Intelligence';
      case '/salary-intelligence': return 'Salary Intelligence';
      case '/nationalization': return 'Nationalization Intelligence';
      case '/settings': return 'Settings';
      default: return '';
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          {getPageTitle()}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search intelligence..." 
            className="w-full bg-muted/30 border border-border/50 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
        <button className="relative p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
        </button>
        <div className="md:hidden h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white text-xs font-semibold">
          A
        </div>
      </div>
    </header>
  );
}
