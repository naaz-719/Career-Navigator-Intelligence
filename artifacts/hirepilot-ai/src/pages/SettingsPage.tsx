import React, { useState } from 'react';
import { Camera, User, Briefcase, Bell, CreditCard, Lock } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'goals', icon: Briefcase, label: 'Career Goals' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
    { id: 'security', icon: Lock, label: 'Security' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-1 mb-8">
        <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Settings
        </h2>
        <p className="text-muted-foreground text-sm">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Tabs Sidebar */}
        <div className="w-full md:w-48 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto border-b md:border-b-0 border-border/50 pb-2 md:pb-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors shrink-0 ${
                activeTab === tab.id 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          
          {activeTab === 'profile' && (
            <div className="bg-card border border-border/50 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-6">Public Profile</h3>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group cursor-pointer">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white text-2xl font-semibold">
                    A
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <button className="text-sm font-medium bg-muted hover:bg-muted/80 text-foreground px-4 py-2 rounded-md transition-colors">
                    Upload new avatar
                  </button>
                  <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. Max size 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Full Name</label>
                  <input type="text" defaultValue="Ahmed Mahmoud" className="w-full bg-muted/30 border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Email</label>
                  <input type="email" defaultValue="ahmed@example.com" disabled className="w-full bg-muted/10 border border-border/50 rounded-lg p-2.5 text-sm text-muted-foreground cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Nationality</label>
                  <select className="w-full bg-muted/30 border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary/50">
                    <option>Egypt</option>
                    <option>India</option>
                    <option>UK</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Current Location</label>
                  <select className="w-full bg-muted/30 border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary/50">
                    <option>Dubai, UAE</option>
                    <option>Riyadh, KSA</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Current Role</label>
                  <input type="text" defaultValue="Senior Product Manager" className="w-full bg-muted/30 border border-border/50 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary/50" />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="bg-card border border-border/50 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-6">Career Objectives</h3>
              <p className="text-sm text-muted-foreground mb-6">These parameters tune the AI's recommendations across the platform.</p>

              <div className="space-y-8">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Target Countries</label>
                  <div className="flex flex-wrap gap-2">
                    {['🇦🇪 UAE', '🇸🇦 Saudi Arabia', '🇶🇦 Qatar', '🇴🇲 Oman', '🇧🇭 Bahrain', '🇰🇼 Kuwait'].map((c, i) => (
                      <button key={i} className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${i < 2 ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-muted/20 border-border/50 text-muted-foreground hover:bg-muted/50'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Minimum Expected Salary (Monthly)</label>
                  <div className="flex items-center gap-4">
                    <input type="range" min="10000" max="100000" defaultValue="45000" className="flex-1 accent-primary" />
                    <span className="text-sm font-bold text-foreground w-24 text-right">AED 45,000</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <h4 className="font-medium text-sm mb-4">Trade-off Matrix</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="w-24 text-muted-foreground">Title</span>
                      <input type="range" className="flex-1 accent-primary mx-4" defaultValue="70" />
                      <span className="w-24 text-right text-muted-foreground">Compensation</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="w-24 text-muted-foreground">Stability</span>
                      <input type="range" className="flex-1 accent-primary mx-4" defaultValue="40" />
                      <span className="w-24 text-right text-muted-foreground">Growth Rate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <CreditCard className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Current Plan</div>
                  <h3 className="font-display text-3xl font-bold text-foreground mb-4">Pro Intelligence <span className="text-lg font-normal text-muted-foreground">/ $49 mo</span></h3>
                  <div className="flex gap-4">
                    <button className="bg-background text-foreground border border-border/50 px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors">
                      Cancel Plan
                    </button>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                      Upgrade to Executive
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border/50 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-6">Billing History</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0 last:pb-0">
                      <div>
                        <div className="font-medium text-sm">Pro Intelligence - Monthly</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Oct {i+1}, 2023</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">$49.00</span>
                        <button className="text-xs text-primary hover:underline">Invoice</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
