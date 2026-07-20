import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  Activity,
  Building2,
  Globe,
  Briefcase,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useProfile } from "@/context/ProfileContext";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  country: string;
  postedDate: string;
  searchKeyword: string;
  functionGuess: string;
  seniorityGuess: string;
  link: string;
  sources: string[];
}

const COLORS = [
  "#3b82f6",
  "#06b6d4",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

function groupCount(
  jobs: Job[],
  field: keyof Job
): { name: string; value: number }[] {
  const map = new Map<string, number>();

  jobs.forEach((job) => {
    const key = String(job[field]);
    map.set(key, (map.get(key) || 0) + 1);
  });

  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function monthKey(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

function createHiringTrend(jobs: Job[]) {
  const map = new Map<string, number>();

  jobs.forEach((job) => {
    const d = new Date(job.postedDate);
    if (isNaN(d.getTime())) return;
    const key = monthKey(d);
    map.set(key, (map.get(key) || 0) + 1);
  });

  return [...map.entries()].map(([month, jobs]) => ({ month, jobs }));
}

function topCompanies(jobs: Job[]) {
  return groupCount(jobs, "company").slice(0, 10);
}

function countryStats(jobs: Job[]) {
  return groupCount(jobs, "country");
}

function functionStats(jobs: Job[]) {
  return groupCount(jobs, "functionGuess");
}

function seniorityStats(jobs: Job[]) {
  return groupCount(jobs, "seniorityGuess");
}

function sourceStats(jobs: Job[]) {
  const map = new Map<string, number>();

  jobs.forEach((job) => {
    job.sources.forEach((source) => {
      map.set(source, (map.get(source) || 0) + 1);
    });
  });

  return [...map.entries()].map(([name, value]) => ({ name, value }));
}

function recentJobs(jobs: Job[]) {
  return [...jobs]
    .sort(
      (a, b) =>
        new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
    )
    .slice(0, 10);
}

export default function CareerIntelligencePage() {
  const { profile } = useProfile();

  const [activeTab, setActiveTab] = useState("market");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const response = await fetch("/data/realJobs.json");
        const data: Job[] = await response.json();
        setJobs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const role = profile.currentRole.toLowerCase();
      return (
        job.searchKeyword.toLowerCase().includes(role) ||
        job.title.toLowerCase().includes(role)
      );
    });
  }, [jobs, profile.currentRole]);

  const totalJobs = filteredJobs.length;
  const countries = countryStats(filteredJobs);
  const companies = topCompanies(filteredJobs);
  const functions = functionStats(filteredJobs);
  const seniority = seniorityStats(filteredJobs);
  const sources = sourceStats(filteredJobs);
  const hiringTrend = createHiringTrend(filteredJobs);
  const latestJobs = recentJobs(filteredJobs);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-semibold">Loading Market Intelligence</h2>
          <p className="text-sm text-muted-foreground">
            Processing real GCC job market data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2
          className="text-2xl font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Career Intelligence
        </h2>
        <p className="text-muted-foreground text-sm">
          Live analytics generated from {jobs.length.toLocaleString()} real job
          postings across GCC job portals.
        </p>
      </div>

      <div className="flex space-x-1 p-1 bg-muted rounded-lg w-max">
        {["market", "skills", "nationalization"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm transition ${
              activeTab === tab
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground"
            }`}
          >
            {tab === "market"
              ? "Market Overview"
              : tab === "skills"
              ? "Skills"
              : "Nationalization"}
          </button>
        ))}
      </div>

      {/* ── Market Overview ── */}
      {activeTab === "market" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* KPI row */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-card border rounded-xl p-5">
              <div className="flex justify-between mb-3">
                <span className="text-sm text-muted-foreground">
                  Matching Jobs
                </span>
                <Briefcase className="w-4 h-4 text-primary" />
              </div>
              <div className="text-4xl font-bold">{totalJobs}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Jobs matching your profile
              </p>
            </div>

            <div className="bg-card border rounded-xl p-5">
              <div className="flex justify-between mb-3">
                <span className="text-sm text-muted-foreground">
                  Hiring Companies
                </span>
                <Building2 className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-4xl font-bold">{companies.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Companies actively recruiting
              </p>
            </div>

            <div className="bg-card border rounded-xl p-5">
              <div className="flex justify-between mb-3">
                <span className="text-sm text-muted-foreground">Countries</span>
                <Globe className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-4xl font-bold">{countries.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                GCC markets with opportunities
              </p>
            </div>

            <div className="bg-card border rounded-xl p-5">
              <div className="flex justify-between mb-3">
                <span className="text-sm text-muted-foreground">
                  Latest Jobs
                </span>
                <Calendar className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-4xl font-bold">{latestJobs.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Most recent postings
              </p>
            </div>
          </div>

          {/* Trend + Country pie */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card border rounded-xl p-5">
              <h3 className="font-semibold mb-5">Hiring Trend</h3>
              <div className="h-[320px]">
                <ResponsiveContainer>
                  <AreaChart data={hiringTrend}>
                    <defs>
                      <linearGradient
                        id="trendFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      dataKey="jobs"
                      stroke="#3b82f6"
                      fill="url(#trendFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card border rounded-xl p-5">
              <h3 className="font-semibold mb-5">Jobs by Country</h3>
              <div className="h-[320px]">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={countries}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={95}
                    >
                      {countries.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Companies + Job function bar */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card border rounded-xl p-5">
              <h3 className="font-semibold mb-5">Top Hiring Companies</h3>
              <div className="space-y-4">
                {companies.map((company, index) => (
                  <div
                    key={company.name}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{company.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {company.value} openings
                        </div>
                      </div>
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border rounded-xl p-5">
              <h3 className="font-semibold mb-5">Hiring by Job Function</h3>
              <div className="h-[350px]">
                <ResponsiveContainer>
                  <BarChart
                    data={functions.slice(0, 8)}
                    layout="vertical"
                    margin={{ left: 25, right: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Seniority + Sources */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card border rounded-xl p-5">
              <h3 className="font-semibold mb-5">
                Experience Level Distribution
              </h3>
              <div className="space-y-4">
                {seniority.map((level) => {
                  const percentage =
                    totalJobs > 0
                      ? ((level.value / totalJobs) * 100).toFixed(1)
                      : "0";
                  return (
                    <div key={level.name}>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{level.name}</span>
                        <span className="font-medium">
                          {level.value} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-card border rounded-xl p-5">
              <h3 className="font-semibold mb-5">Job Sources</h3>
              <div className="space-y-4">
                {sources.map((source) => (
                  <div
                    key={source.name}
                    className="flex justify-between items-center border-b pb-3"
                  >
                    <div>
                      <div className="font-medium">{source.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Job Portal
                      </div>
                    </div>
                    <span className="font-semibold text-primary">
                      {source.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Latest Opportunities table */}
          <div className="bg-card border rounded-xl p-5">
            <h3 className="font-semibold mb-5">Latest Opportunities</h3>
            <div className="overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Position</th>
                    <th className="text-left">Company</th>
                    <th className="text-left">Country</th>
                    <th className="text-left">Posted</th>
                  </tr>
                </thead>
                <tbody>
                  {latestJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b hover:bg-muted/20 transition"
                    >
                      <td className="py-4">
                        <a
                          href={job.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:text-primary"
                        >
                          {job.title}
                        </a>
                      </td>
                      <td>{job.company}</td>
                      <td>{job.country}</td>
                      <td>{new Date(job.postedDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Skills ── */}
      {activeTab === "skills" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card border rounded-xl p-5">
              <h3 className="font-semibold mb-5">Top Roles Hiring Right Now</h3>
              <div className="space-y-4">
                {functions.slice(0, 8).map((role, index) => (
                  <div
                    key={role.name}
                    className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{role.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Job Function
                        </div>
                      </div>
                    </div>
                    <span className="font-semibold">{role.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border rounded-xl p-5">
              <h3 className="font-semibold mb-5">Recommended Focus Areas</h3>
              <div className="space-y-4">
                {functions.slice(0, 6).map((role) => (
                  <div key={role.name} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{role.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {role.value} live openings
                        </p>
                      </div>
                      <span className="text-green-500 text-sm font-medium">
                        High Demand
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Nationalization ── */}
      {activeTab === "nationalization" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {countries.map((country) => {
              const jobsInCountry = filteredJobs.filter(
                (j) => j.country === country.name
              );
              const companyCount = new Set(
                jobsInCountry.map((j) => j.company)
              ).size;

              return (
                <div
                  key={country.name}
                  className="bg-card border rounded-xl p-5"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">{country.name}</h3>
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Open Jobs</span>
                      <span className="font-semibold">{country.value}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Companies</span>
                      <span className="font-semibold">{companyCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Top Function
                      </span>
                      <span className="font-semibold">
                        {functionStats(jobsInCountry)[0]?.name}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-card border rounded-xl p-5">
            <h3 className="font-semibold mb-5">Market Summary</h3>
            <div className="grid md:grid-cols-3 gap-5">
              <div className="rounded-lg border p-4">
                <div className="text-3xl font-bold">{totalJobs}</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Total matching jobs found
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-3xl font-bold">{companies.length}</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Active hiring companies
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-3xl font-bold">{countries.length}</div>
                <p className="text-sm text-muted-foreground mt-2">
                  GCC markets hiring
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
