import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Plane, MapPin, CheckCircle2, Home, Landmark, Coffee, TrendingUp, Building } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const savingsData = [
  { name: 'Saudi Arabia', savings: 14500, tax: 0, cost: 8500 },
  { name: 'UAE', savings: 12000, tax: 0, cost: 11500 },
  { name: 'Qatar', savings: 13500, tax: 0, cost: 9500 },
  { name: 'India (Home)', savings: 4500, tax: 6500, cost: 4000 },
];

export default function RelocationPage() {
  const [fromCountry, setFromCountry] = useState('India');
  const [toCountry, setToCountry] = useState('UAE');

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-2xl font-semibold text-foreground tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
          Relocation Intelligence
        </h2>
        <p className="text-muted-foreground text-sm">The financial truth about moving to the GCC</p>
      </div>

      {/* Country Comparison Tool */}
      <div className="bg-card border border-border/50 rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-8">
          <div className="flex-1 w-full">
            <label className="text-xs text-muted-foreground mb-1 block">Relocating from</label>
            <select className="w-full bg-muted/50 border border-border/50 rounded-lg text-sm p-3 outline-none" value={fromCountry} onChange={e=>setFromCountry(e.target.value)}>
              <option>India</option>
              <option>UK</option>
              <option>Egypt</option>
            </select>
          </div>
          <div className="shrink-0 flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary hidden md:flex mt-4">
            <Plane className="w-5 h-5" />
          </div>
          <div className="flex-1 w-full">
            <label className="text-xs text-muted-foreground mb-1 block">Moving to (Target)</label>
            <select className="w-full bg-muted/50 border border-primary/50 ring-1 ring-primary/20 rounded-lg text-sm p-3 outline-none" value={toCountry} onChange={e=>setToCountry(e.target.value)}>
              <option>UAE</option>
              <option>Saudi Arabia</option>
              <option>Qatar</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Financial Breakdown */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm border-b border-border/50 pb-2">Monthly Financial Estimate (USD)</h3>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground flex items-center gap-2"><TrendingUp className="w-4 h-4"/> Take-home Salary</span>
              <div className="flex gap-4 text-sm text-right">
                <div className="w-24 text-muted-foreground line-through">$4,500</div>
                <div className="w-24 font-bold text-green-500">$8,200</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground flex items-center gap-2"><Landmark className="w-4 h-4"/> Income Tax</span>
              <div className="flex gap-4 text-sm text-right">
                <div className="w-24 text-red-400">$1,200 (26%)</div>
                <div className="w-24 font-bold text-foreground">$0 (0%)</div>
              </div>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground flex items-center gap-2"><Home className="w-4 h-4"/> Housing (1BR)</span>
              <div className="flex gap-4 text-sm text-right">
                <div className="w-24 text-foreground">$800</div>
                <div className="w-24 font-bold text-amber-500">$2,100</div>
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-border/50 mt-2 pt-4">
              <span className="font-medium">Net Monthly Savings</span>
              <div className="flex gap-4 text-right">
                <div className="w-24 text-muted-foreground">$1,200</div>
                <div className="w-24 font-bold text-primary text-xl">$4,100</div>
              </div>
            </div>
            <div className="text-xs text-primary/80 bg-primary/10 p-2 rounded text-center font-medium">
              You could save 3.4x more per month by relocating to {toCountry}.
            </div>
          </div>

          {/* Chart */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Net Savings Comparison</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={savingsData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'hsl(var(--muted)/0.3)'}} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="savings" name="Monthly Savings ($)" radius={[4, 4, 0, 0]}>
                    {savingsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'UAE' ? 'hsl(var(--primary))' : entry.name.includes('Home') ? 'hsl(var(--muted-foreground))' : 'hsl(var(--chart-2))'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visa Pathway */}
        <div className="bg-card border border-border/50 rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-6">UAE Golden Visa Pathway</h3>
          <div className="relative">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-border/50"></div>
            <div className="space-y-6 relative">
              {[
                { title: 'Eligibility Check', desc: 'Tech professionals > AED 30K/mo', status: 'done' },
                { title: 'MOHRE Approval', desc: 'Ministry of HR clearance (1-2 weeks)', status: 'next' },
                { title: 'Entry Permit', desc: 'Issued for 6 months to complete process', status: 'pending' },
                { title: 'Medical & Emirates ID', desc: 'Local testing (1 week)', status: 'pending' },
                { title: 'Visa Stamping', desc: '10-year residency granted', status: 'pending' },
              ].map((step, i) => (
                <div key={i} className="flex gap-4 items-start relative">
                  <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center border-2 z-10 bg-card ${
                    step.status === 'done' ? 'border-green-500 text-green-500' :
                    step.status === 'next' ? 'border-primary text-primary' : 'border-border/50 text-muted-foreground'
                  }`}>
                    {step.status === 'done' ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs">{i+1}</span>}
                  </div>
                  <div className="pt-1">
                    <div className={`text-sm font-medium ${step.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'}`}>{step.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* City Costs */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">City Cost Indices</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { city: 'Dubai', country: '🇦🇪', rent: '$2.1K', total: '$4.2K', index: 100 },
              { city: 'Riyadh', country: '🇸🇦', rent: '$1.8K', total: '$3.5K', index: 85 },
              { city: 'Doha', country: '🇶🇦', rent: '$1.9K', total: '$3.8K', index: 92 },
              { city: 'Muscat', country: '🇴🇲', rent: '$1.2K', total: '$2.4K', index: 60 },
            ].map((c, i) => (
              <div key={i} className="p-4 border border-border/50 bg-card rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <div className="font-medium flex items-center gap-1.5"><span className="text-lg">{c.country}</span> {c.city}</div>
                  <div className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Idx: {c.index}</div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Avg 1BR Rent</span>
                    <span className="font-medium">{c.rent}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Total Mo. Cost</span>
                    <span className="font-medium text-amber-500">{c.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
