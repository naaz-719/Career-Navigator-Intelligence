import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import { Activity, TrendingUp, Clock, BookOpen } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import {
  getMarketDemand,
  getSkillRadar,
  getTopCompanies,
} from "@/services/mockDataService";
import WhyPanel from "@/components/why/WhyPanel";
import {
  getWhyDemandScore,
  getWhyMarketVelocity,
  getWhySkillGap,
} from "@/services/whyDataService";

const velocityData = [
  { month: "Jan", Tech: 4000, Finance: 2400, Energy: 2400, Healthcare: 3200 },
  { month: "Feb", Tech: 3000, Finance: 1398, Energy: 2210, Healthcare: 3000 },
  { month: "Mar", Tech: 2000, Finance: 9800, Energy: 2290, Healthcare: 2900 },
  { month: "Apr", Tech: 2780, Finance: 3908, Energy: 2000, Healthcare: 2800 },
  { month: "May", Tech: 1890, Finance: 4800, Energy: 2181, Healthcare: 2500 },
  { month: "Jun", Tech: 2390, Finance: 3800, Energy: 2500, Healthcare: 2600 },
  { month: "Jul", Tech: 3490, Finance: 4300, Energy: 2100, Healthcare: 2800 },
  { month: "Aug", Tech: 4000, Finance: 2400, Energy: 2400, Healthcare: 3200 },
  { month: "Sep", Tech: 3000, Finance: 1398, Energy: 2210, Healthcare: 3000 },
  { month: "Oct", Tech: 2000, Finance: 9800, Energy: 2290, Healthcare: 2900 },
  { month: "Nov", Tech: 2780, Finance: 3908, Energy: 2000, Healthcare: 2800 },
  { month: "Dec", Tech: 3890, Finance: 4800, Energy: 2181, Healthcare: 3000 },
];

export default function CareerIntelligencePage() {
  const [activeTab, setActiveTab] = useState("market");
  const { profile } = useProfile();

  // Backend seam: replace with useSWR('/api/market/demand', ...)
  const [demand, setDemand] = React.useState<any>(null);
  const [radar, setRadar] = React.useState<any[]>([]);
  const [companies, setCompanies] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function loadData() {
      const response = await fetch(
        "https://naazmulla.app.n8n.cloud/webhook/career-intelligence",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: profile.currentRole,
            country: profile.targetCountries[0],
          }),
        },
      );

      const data = await response.json();

      setDemand(data.demand);
      setRadar(data.radar);
      setCompanies(data.companies);
    }

    loadData();
  }, [profile]);

  if (!demand) {
    return <div className="p-8">Loading...</div>;
  }

  const rankedGaps = radar
    .map((d) => ({
      name: d.subject,
      yourScore: d.A as number,
      marketScore: d.B as number,
      gap: (d.B as number) - (d.A as number),
    }))
    .filter((d) => d.gap > 5)
    .sort((a, b) => b.gap - a.gap);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 mb-6">
        <h2
          className="text-2xl font-semibold text-foreground tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Career Intelligence
        </h2>
        <p className="text-muted-foreground text-sm">
          AI-powered market analysis for your {profile.sector} profile ·{" "}
          {profile.currentRole}
        </p>
      </div>

      <div className="flex space-x-1 p-1 bg-muted/50 rounded-lg w-full md:w-max">
        {["market", "skills", "nationalization"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
              activeTab === tab
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {tab === "market"
              ? "Market Overview"
              : tab === "skills"
                ? "Skill Gap Analysis"
                : "Nationalization Radar"}
          </button>
        ))}
      </div>

      {/* ── Market Overview ── */}
      {activeTab === "market" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Demand Score */}
            <div className="bg-card border border-border/50 rounded-xl p-5 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Demand Score
                </div>
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {demand.score}
                <span className="text-lg text-muted-foreground">/10</span>
              </div>
              <div className="text-xs text-muted-foreground mb-3">
                {demand.note}
              </div>
              <WhyPanel data={getWhyDemandScore(profile, demand.score)} />
            </div>

            {/* Market Velocity */}
            <div className="bg-card border border-border/50 rounded-xl p-5 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Market Velocity
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-green-500 mb-1">
                ↑ {demand.velocity}%
              </div>
              <div className="text-xs text-muted-foreground mb-3">
                Hiring volume vs last quarter · {profile.sector}
              </div>
              <WhyPanel data={getWhyMarketVelocity(profile, demand.velocity)} />
            </div>

            {/* Avg Time to Hire — no scored metric, no Why needed */}
            <div className="bg-card border border-border/50 rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Avg Time to Hire
                </div>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-bold text-foreground">
                {demand.avgDays}{" "}
                <span className="text-lg text-muted-foreground">days</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Across GCC · {profile.sector} sector
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-card border border-border/50 rounded-xl p-5">
              <h3 className="text-base font-semibold mb-6">
                GCC Hiring Velocity by Sector
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={velocityData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorTech"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--chart-1))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--chart-1))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="colorFin" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--chart-2))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--chart-2))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="Tech"
                      stroke="hsl(var(--chart-1))"
                      fillOpacity={1}
                      fill="url(#colorTech)"
                    />
                    <Area
                      type="monotone"
                      dataKey="Finance"
                      stroke="hsl(var(--chart-2))"
                      fillOpacity={1}
                      fill="url(#colorFin)"
                    />
                    <Area
                      type="monotone"
                      dataKey="Energy"
                      stroke="hsl(var(--chart-3))"
                      fillOpacity={0}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="Healthcare"
                      stroke="hsl(var(--chart-4))"
                      fillOpacity={0}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-xl p-5">
              <h3 className="text-base font-semibold mb-4">
                Top Hiring · {profile.sector}
              </h3>
              <div className="space-y-4">
                {companies.map((co, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 hover:bg-muted/20 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {co.name.substring(0, 1)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{co.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {co.roles} open roles
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-green-400 font-medium">
                      {co.growth}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Skill Gap Analysis ── */}
      {activeTab === "skills" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="bg-card border border-border/50 rounded-xl p-5 flex flex-col items-center">
            <h3 className="text-base font-semibold mb-2 self-start">
              Your Skills vs Market Demand
            </h3>
            <p className="text-xs text-muted-foreground self-start mb-4">
              {profile.skills.length} skills indexed · {profile.sector} sector ·{" "}
              {profile.yearsExperience} yrs
            </p>
            <div className="h-[350px] w-full max-w-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radar}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 11,
                    }}
                  />
                  <Radar
                    name="Your Skills"
                    dataKey="A"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.35}
                  />
                  <Radar
                    name="Market Demand"
                    dataKey="B"
                    stroke="hsl(var(--accent))"
                    fill="hsl(var(--accent))"
                    fillOpacity={0.2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 text-xs mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-primary opacity-60" />{" "}
                Your Profile
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-accent opacity-60" />{" "}
                Market Demand
              </div>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-5">
            <h3 className="text-base font-semibold mb-2">Ranked Skill Gaps</h3>
            <p className="text-xs text-muted-foreground mb-5">
              {rankedGaps.length === 0
                ? `Your skills closely match ${profile.sector} market demand — well positioned!`
                : `${rankedGaps.length} gaps detected for ${profile.sector} roles in your target markets`}
            </p>
            <div className="space-y-4">
              {rankedGaps.slice(0, 4).map((gap, i) => {
                const severity =
                  gap.gap > 40 ? "Critical" : gap.gap > 20 ? "High" : "Medium";
                return (
                  <div
                    key={i}
                    className="p-4 rounded-lg border border-border/50 bg-muted/10"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{gap.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Your score: {gap.yourScore} · Market demand:{" "}
                          {gap.marketScore}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          severity === "Critical"
                            ? "bg-red-500/10 text-red-500"
                            : severity === "High"
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {severity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex-1 mr-4">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary/40 rounded-full"
                            style={{ width: `${gap.yourScore}%` }}
                          />
                        </div>
                      </div>
                      <button className="flex items-center gap-1 text-xs text-primary hover:underline font-medium flex-shrink-0">
                        <BookOpen className="w-3 h-3" /> Learning Path
                      </button>
                    </div>
                    {/* Why panel for each gap */}
                    <div className="mt-3 border-t border-border/20 pt-3">
                      <WhyPanel data={getWhySkillGap(gap, profile)} />
                    </div>
                  </div>
                );
              })}
              {rankedGaps.length === 0 && (
                <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-center">
                  <p className="text-sm text-emerald-400 font-medium">
                    ✓ No significant skill gaps detected
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your {profile.skills.length} skills cover the key market
                    demands for {profile.sector}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Nationalization Radar ── */}
      {activeTab === "nationalization" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {[
            {
              country: "UAE",
              flag: "🇦🇪",
              policy: "Emiratisation",
              risk: "Low",
              ratio: "8% target",
              color: "text-green-500",
              bg: "bg-green-500/10",
            },
            {
              country: "Saudi Arabia",
              flag: "🇸🇦",
              policy: "Saudization (Nitaqat)",
              risk: profile.sector === "Technology" ? "Medium" : "High",
              ratio: "30% target",
              color:
                profile.sector === "Technology"
                  ? "text-amber-500"
                  : "text-red-500",
              bg:
                profile.sector === "Technology"
                  ? "bg-amber-500/10"
                  : "bg-red-500/10",
            },
            {
              country: "Oman",
              flag: "🇴🇲",
              policy: "Omanisation",
              risk: "High",
              ratio: "Varies by sector",
              color: "text-red-500",
              bg: "bg-red-500/10",
            },
            {
              country: "Qatar",
              flag: "🇶🇦",
              policy: "Qatarisation",
              risk: "Medium",
              ratio: "20% target",
              color: "text-amber-500",
              bg: "bg-amber-500/10",
            },
            {
              country: "Bahrain",
              flag: "🇧🇭",
              policy: "Bahrainisation",
              risk: "Medium",
              ratio: "Fee-based flexibility",
              color: "text-amber-500",
              bg: "bg-amber-500/10",
            },
            {
              country: "Kuwait",
              flag: "🇰🇼",
              policy: "Kuwaitisation",
              risk: "High",
              ratio: "100% in Govt",
              color: "text-red-500",
              bg: "bg-red-500/10",
            },
          ].map((nat, i) => {
            const isTarget = profile.targetCountries.some(
              (c) =>
                c.includes(nat.country) ||
                nat.country.includes(c.split(" ")[0]),
            );
            return (
              <div
                key={i}
                className={`bg-card border rounded-xl p-5 transition-all ${isTarget ? "border-primary/30 ring-1 ring-primary/10" : "border-border/50"}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{nat.flag}</span>
                  <div>
                    <h3 className="font-semibold">{nat.country}</h3>
                    {isTarget && (
                      <span className="text-xs text-primary">
                        Your target market
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Policy</span>
                    <span className="font-medium">{nat.policy}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Quota</span>
                    <span className="font-medium">{nat.ratio}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-border/50">
                    <span className="text-sm font-medium">Your Expat Risk</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${nat.bg} ${nat.color}`}
                    >
                      {nat.risk} Risk
                    </span>
                  </div>
                </div>
                {/* Why panel for country nationalization risk */}
                <div className="mt-3 pt-3 border-t border-border/20">
                  <WhyPanel
                    data={getWhyCountryNatRisk(
                      nat.country,
                      nat.risk,
                      profile.sector,
                      isTarget,
                    )}
                    trigger="badge"
                  />
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

// Local import bridge (avoids circular ref)
import { getWhyCountryNatRisk } from "@/services/whyDataService";
