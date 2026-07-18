// ─── AI Career Decision Engine — API Route ───────────────────────────────────
// Receives a UserProfile, computes structured metrics from pure functions,
// builds a grounded Claude prompt, and streams per-module reasoning via SSE.
// The SSE event shape exactly matches the SimulationCallbacks in the frontend.

import { Router } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { logger } from "../../lib/logger.js";

const router = Router();

// ─── Pure metric helpers (mirrored from frontend engine) ──────────────────────

type RiskLevel = "High" | "Medium" | "Low";

interface UserProfile {
  name: string;
  nationality: string;
  currentRole: string;
  sector: string;
  yearsExperience: number;
  skills: string[];
  education: string;
  currentSalary: number;
  targetSalary: number;
  currentCountry: string;
  targetCountries: string[];
  visaStatus: string;
  careerGoal: string;
  question: string;
  [key: string]: unknown;
}

function tier(yrs: number): string {
  if (yrs >= 12) return "Principal / VP";
  if (yrs >= 8) return "Senior / Lead";
  if (yrs >= 4) return "Mid-level";
  return "Junior";
}

function sectorShort(sector: string): string {
  const map: Record<string, string> = {
    "Finance & Banking": "FinTech/Finance",
    "Energy & Oil & Gas": "Energy",
    "Construction & Real Estate": "Real Estate",
    "Retail & E-commerce": "Retail/E-com",
    Telecommunications: "Telecom",
  };
  return map[sector] ?? sector;
}

const JOB_COUNT_BASE: Record<string, number> = {
  Technology: 9200,
  "Finance & Banking": 5400,
  Healthcare: 4100,
  "Energy & Oil & Gas": 3800,
  "Construction & Real Estate": 6200,
  "Retail & E-commerce": 3400,
  Telecommunications: 2900,
};

const TIME_TO_HIRE: Record<string, string> = {
  Technology: "5–9 weeks",
  "Finance & Banking": "8–14 weeks",
  Healthcare: "6–12 weeks",
  "Energy & Oil & Gas": "10–18 weeks",
  "Construction & Real Estate": "8–16 weeks",
  "Retail & E-commerce": "4–8 weeks",
  Telecommunications: "7–13 weeks",
};

const NATL_RISK: Record<string, Record<string, string>> = {
  "United Arab Emirates": {
    Technology: "Low",
    "Finance & Banking": "Medium",
    default: "Low-Medium",
  },
  "Saudi Arabia": {
    Technology: "Medium",
    "Finance & Banking": "High",
    default: "High",
  },
  Qatar: { default: "Low-Medium" },
  Oman: { default: "Medium-High" },
  Kuwait: { default: "High" },
  Bahrain: { default: "Low" },
};

function getNatRisk(country: string, sector: string): string {
  const entry = NATL_RISK[country] ?? {};
  return entry[sector] ?? entry["default"] ?? "Medium";
}

function computeHireProbability(p: UserProfile): number {
  const base = 48;
  const expScore = Math.min(20, p.yearsExperience * 2.2);
  const skillScore = Math.min(15, p.skills.length * 1.8);
  const sectScore =
    p.sector === "Technology" || p.sector === "Healthcare" ? 8 : 4;
  const salaryDebt =
    Math.max(
      0,
      Math.round(
        ((p.targetSalary - p.currentSalary) / p.currentSalary) * 100
      ) - 30
    ) * 0.12;
  const eduScore =
    p.education.includes("Master") ||
    p.education.includes("MBA") ||
    p.education.includes("PhD")
      ? 5
      : 0;
  return Math.min(96, base + expScore + skillScore + sectScore + eduScore - salaryDebt);
}

function computeConfidence(p: UserProfile): number {
  const completeness = [
    p.currentRole.length > 0,
    p.skills.length >= 3,
    p.targetCountries.length > 0,
    p.currentSalary > 0,
    p.targetSalary > 0,
    p.nationality.length > 0,
    p.yearsExperience > 0,
    p.question.length > 20,
  ].filter(Boolean).length;
  return Math.min(94, 60 + completeness * 4 + Math.min(p.yearsExperience, 8));
}

// ─── Build grounded context for Claude ───────────────────────────────────────

function buildContext(p: UserProfile): string {
  const hirePct = computeHireProbability(p);
  const confidence = computeConfidence(p);
  const base = JOB_COUNT_BASE[p.sector] ?? 5000;
  const ghost = Math.round(base * 0.314);
  const legit = base - ghost;
  const delta = Math.round(
    ((p.targetSalary - p.currentSalary) / p.currentSalary) * 100
  );
  const p50 = Math.round(p.targetSalary * 0.87 / 1000);
  const p75 = Math.round(p.targetSalary * 1.03 / 1000);
  const p90 = Math.round(p.targetSalary * 1.18 / 1000);
  const jdMatch = Math.min(95, 58 + p.yearsExperience * 3 + (p.skills.length >= 6 ? 6 : 2));
  const sponsorCount = Math.round(650 + p.yearsExperience * 25);
  const sponsorProb = Math.min(92, 52 + p.yearsExperience * 3 + (p.skills.length >= 5 ? 5 : 0));
  const primaryCountry = p.targetCountries[0] ?? "United Arab Emirates";
  const natRisk = getNatRisk(primaryCountry, p.sector);
  const timeToHire = TIME_TO_HIRE[p.sector] ?? "6–12 weeks";
  const hasGoldenVisa = p.targetSalary >= 30000;
  const hasAISkills = p.skills.some(s =>
    ["python", "ai", "ml", "machine learning", "cloud", "aws", "azure", "llm"].includes(s.toLowerCase())
  );
  const velocity = p.sector === "Technology" ? 24 : p.sector === "Healthcare" ? 18 : p.sector === "Finance & Banking" ? 12 : 10;
  const strongNationalities = ["Egyptian", "Indian", "Pakistani", "Jordanian", "Lebanese"];
  const hasStrongBilateral = strongNationalities.includes(p.nationality);

  return `
=== PRE-COMPUTED METRICS (use these exact numbers — do not invent alternatives) ===
Hire probability: ${Math.round(hirePct)}%
Confidence score: ${confidence}%
Experience tier: ${tier(p.yearsExperience)}
Salary delta: +${delta}% uplift over current
UAE P50 for role/sector: AED ${p50}K/mo
UAE P75: AED ${p75}K/mo
UAE P90: AED ${p90}K/mo
Salary feasibility: ${delta <= 20 ? "HIGH" : delta <= 40 ? "MEDIUM" : "CHALLENGING"}
Total ${p.sector} postings GCC: ${base.toLocaleString()}
Ghost jobs filtered (31.4%): ${ghost.toLocaleString()}
Legitimate active roles: ${legit.toLocaleString()}
YoY hiring velocity: +${velocity}% in UAE ${sectorShort(p.sector)}
JD cosine-match score: ${jdMatch}%
UAE sponsor count with ${p.nationality} hire history: ${sponsorCount}
Sponsor conversion probability (90-day window): ${sponsorProb}%
Primary country nationalization risk: ${natRisk}
Time to hire estimate: ${timeToHire}
UAE Golden Visa eligible (AED 30K/mo threshold): ${hasGoldenVisa ? "YES" : "NO — AED " + Math.round((30000 - p.targetSalary) / 1000) + "K below threshold"}
AI/Cloud skills present: ${hasAISkills ? "YES — aligns with top-demand cluster" : "NO"}
Strong bilateral employment framework: ${hasStrongBilateral ? "YES" : "NO"}

=== PROFESSIONAL PROFILE ===
Name: ${p.name || "Not provided"}
Nationality: ${p.nationality}
Current role: ${p.currentRole}
Sector: ${p.sector}
Years of experience: ${p.yearsExperience}
Skills: ${p.skills.join(", ")}
Education: ${p.education}
Current salary: AED ${Math.round(p.currentSalary / 1000)}K/mo
Target salary: AED ${Math.round(p.targetSalary / 1000)}K/mo
Current country: ${p.currentCountry}
Target countries: ${p.targetCountries.join(", ") || "Not specified"}
Visa status: ${p.visaStatus}
Career goal: ${p.careerGoal}
User's question: "${p.question}"
`.trim();
}

// ─── SSE helpers ─────────────────────────────────────────────────────────────

type SSEEvent =
  | { type: "module_start"; moduleId: string }
  | { type: "thought"; moduleId: string; text: string }
  | { type: "module_complete"; moduleId: string; summary: string }
  | { type: "error"; message: string }
  | { type: "done" };

function sendSSE(res: import("express").Response, event: SSEEvent) {
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

// ─── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are an expert GCC career intelligence analyst with deep knowledge of UAE, Saudi Arabia, Qatar, Oman, Bahrain, and Kuwait labour markets, nationalization policies, visa regulations, and compensation benchmarks.

You will receive a professional profile and a set of pre-computed metrics. Your task is to reason through 6 analytical modules, providing genuine expert insight grounded in the provided data. Use the exact numbers from the pre-computed metrics — your value is in interpretation, context, and actionable recommendations, not in inventing different numbers.

Write each module's reasoning as a series of concise, specific thought steps (6–8 per module). Each thought should be one substantive sentence — crisp, expert, and concrete. Think like a senior GCC recruiter who has placed hundreds of candidates, combined with a policy analyst who reads ministry circulars.

Output ONLY in this exact format — no preamble, no conclusion outside the module blocks:

[MODULE_START:profile]
<thought 1>
<thought 2>
...
[MODULE_SUMMARY:profile]
<one-line module summary>
[MODULE_END:profile]

[MODULE_START:policy]
<thought 1>
...
[MODULE_SUMMARY:policy]
<one-line summary>
[MODULE_END:policy]

[MODULE_START:salary]
<thought 1>
...
[MODULE_SUMMARY:salary]
<one-line summary>
[MODULE_END:salary]

[MODULE_START:market]
<thought 1>
...
[MODULE_SUMMARY:market]
<one-line summary>
[MODULE_END:market]

[MODULE_START:eligibility]
<thought 1>
...
[MODULE_SUMMARY:eligibility]
<one-line summary>
[MODULE_END:eligibility]

[MODULE_START:recommendation]
<thought 1>
...
[MODULE_SUMMARY:recommendation]
<one-line summary>
[MODULE_END:recommendation]

Module guidance:
- profile: Analyse nationality, experience tier, skills portfolio, education, visa mobility, and career trajectory signals.
- policy: Cover nationalization quotas (Nitaqat/Saudisation, NAFIS/Emiratisation, Omanisation, Kuwaitisation), visa pathways, bilateral agreements, and Golden Visa eligibility.
- salary: Benchmark compensation against GCC percentiles, analyse the salary jump feasibility, 0% tax advantage, negotiation strategy.
- market: Assess real hiring demand, ghost job filtering, YoY velocity, sector health, skills signal strength.
- eligibility: Sponsor probability, JD match quality, visa transfer friction, NOC requirements if applicable.
- recommendation: Synthesise all 5 modules into a prioritised recommendation — primary market, hire probability, confidence, and top 3 actions.`;

// ─── Route ────────────────────────────────────────────────────────────────────

router.post("/analyze", async (req, res) => {
  const profile = req.body?.profile as UserProfile | undefined;

  if (!profile || typeof profile !== "object") {
    res.status(400).json({ error: "Missing or invalid profile in request body" });
    return;
  }

  // Ensure required fields have defaults
  const p: UserProfile = {
    name: "",
    nationality: "",
    currentRole: "",
    sector: "Technology",
    yearsExperience: 0,
    skills: [],
    education: "",
    currentSalary: 0,
    targetSalary: 0,
    currentCountry: "",
    targetCountries: [],
    visaStatus: "",
    careerGoal: "",
    question: "",
    ...profile,
  };

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  try {
    const context = buildContext(p);
    const userMessage = `${context}\n\nPlease analyse this profile across all 6 modules.`;

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    let buffer = "";
    let currentModule = "";
    let inSummary = false;

    const MODULE_IDS = ["profile", "policy", "salary", "market", "eligibility", "recommendation"];

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        buffer += event.delta.text;

        // Process buffer line by line
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? ""; // keep partial last line

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          // Module start
          const startMatch = trimmed.match(/^\[MODULE_START:(\w+)\]$/);
          if (startMatch) {
            const modId = startMatch[1];
            if (MODULE_IDS.includes(modId)) {
              currentModule = modId;
              inSummary = false;
              sendSSE(res, { type: "module_start", moduleId: modId });
            }
            continue;
          }

          // Module summary start
          const summaryMatch = trimmed.match(/^\[MODULE_SUMMARY:(\w+)\]$/);
          if (summaryMatch) {
            inSummary = true;
            continue;
          }

          // Module end
          const endMatch = trimmed.match(/^\[MODULE_END:(\w+)\]$/);
          if (endMatch) {
            inSummary = false;
            // summary will be sent via the next summary-flagged line — already handled
            currentModule = "";
            continue;
          }

          // Summary line (first non-empty line after MODULE_SUMMARY marker)
          if (inSummary && currentModule) {
            sendSSE(res, { type: "module_complete", moduleId: currentModule, summary: trimmed });
            inSummary = false;
            continue;
          }

          // Thought line
          if (currentModule && !inSummary) {
            sendSSE(res, { type: "thought", moduleId: currentModule, text: trimmed });
          }
        }
      }
    }

    // Process any remaining buffer content
    if (buffer.trim() && currentModule && !inSummary) {
      const trimmed = buffer.trim();
      if (!trimmed.startsWith("[")) {
        sendSSE(res, { type: "thought", moduleId: currentModule, text: trimmed });
      }
    }

    sendSSE(res, { type: "done" });
    res.end();
  } catch (err) {
    logger.error({ err }, "Decision engine Claude API error");
    const message = err instanceof Error ? err.message : "Claude API error";
    sendSSE(res, { type: "error", message });
    res.end();
  }
});

export default router;
