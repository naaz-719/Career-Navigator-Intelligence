import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo / Wordmark */}
        <div className="text-center mb-8">
          <span
            className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ✈ HirePilot AI
          </span>
          <p className="text-xs text-muted-foreground mt-1">GCC Career Intelligence Platform</p>
        </div>

        <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
          <CardContent className="pt-6 pb-8 px-8">
            {/* Page heading */}
            <div className="mb-6 text-center">
              <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>

            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
