// ─── AI Career Decision Engine — API Route ───────────────────────────────────
// Receives a UserProfile, computes structured metrics from pure functions,
// builds a grounded Claude prompt using REAL published nationalization data,
// and streams per-module reasoning via SSE.
// The SSE event shape exactly matches the SimulationCallbacks in the frontend.

import { Router } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { logger } from "../../lib/logger.js";

const router = Router();

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface QuotaInfo {
  policyName: string;
  quotaDetail: string;
  riskLabel: RiskLevel;
  sourceNote: string;
}

const NATIONALIZATION_DATA: Record<string, Record<string, QuotaInfo>> = {
  "United Arab Emirates": {
    "Finance & Banking": {
      policyName: "Emiratisation (Nafis)",
      quotaDetail: "45% Emiratisation target in banking by end of 2026",
      riskLabel: "High",
      sourceNote: "Published UAE banking-sector target",
    },
    default: {
      policyName: "Emiratisation (Nafis)",
      quotaDetail:
        "10% skilled-role Emiratisation by end of 2026 for firms with 50+ employees; 30% target in insurance",
      riskLabel: "Medium",
      sourceNote: "Published UAE Emiratisation mandate",
    },
    Technology: {
      policyName: "Emiratisation (Nafis)",
      quotaDetail:
        "Tech roles are typically treated as targets rather than hard mandates — lowest enforcement pressure in the GCC due to talent supply constraints",
      riskLabel: "Low",
      sourceNote: "Sector-pattern based — not a specific published percentage",
    },
  },
  "Saudi Arabia": {
    Healthcare: {
      policyName: "Saudisation (Nitaqat Mutawar)",
      quotaDetail: "65% Saudization target in major hospitals",
      riskLabel: "High",
      sourceNote: "Published Nitaqat Mutawar sector target",
    },
    "Retail & E-commerce": {
      policyName: "Saudisation (Nitaqat Mutawar)",
      quotaDetail: "60% target for marketing & sales roles",
      riskLabel: "High",
      sourceNote: "Published Nitaqat Mutawar sector target",
    },
    "Construction & Real Estate": {
      policyName: "Saudisation (Nitaqat Mutawar)",
      quotaDetail:
        "40% target in tourism/hospitality-adjacent construction & real estate roles",
      riskLabel: "Medium",
      sourceNote: "Published Nitaqat Mutawar sector target",
    },
    Technology: {
      policyName: "Saudisation (Nitaqat)",
      quotaDetail:
        "Vision 2030 creates specialist exemptions for AI/Cloud roles; moderately affected relative to other sectors",
      riskLabel: "Medium",
      sourceNote: "Directional — not a specific published percentage",
    },
    default: {
      policyName: "Saudisation (Nitaqat)",
      quotaDetail:
        "Sector-banded quotas ranging 12%-75% depending on company size and activity; aggregate national goal of 340,000 additional Saudi private-sector jobs by 2028",
      riskLabel: "High",
      sourceNote: "Published Nitaqat banding structure",
    },
  },
  Qatar: {
    default: {
      policyName: "Qatarisation",
      quotaDetail:
        "20% Qatari nationals in the private sector targeted by 2030 (currently around 17%); Law No. 12 of 2024 introduces fines for non-compliance",
      riskLabel: "Medium",
      sourceNote: "Published national target",
    },
    Technology: {
      policyName: "Qatarisation",
      quotaDetail:
        "Advisory/technical specialist roles remain largely open; general management roles face moderate restrictions",
      riskLabel: "Low",
      sourceNote: "Directional — not a specific published percentage",
    },
  },
  Oman: {
    "Finance & Banking": {
      policyName: "Omanisation",
      quotaDetail:
        "Banking-sector Omanisation can exceed 90% in some operational categories",
      riskLabel: "High",
      sourceNote: "Published sector figure",
    },
    default: {
      policyName: "Omanisation",
      quotaDetail:
        "Sector-specific rates ranging 35%-90%+; Ministerial Decision 602/2025 gives a 30% fee reduction for compliant firms and doubles fees for non-compliant firms",
      riskLabel: "Medium",
      sourceNote: "Published range + 2025 ministerial decision",
    },
  },
  Bahrain: {
    default: {
      policyName: "Bahrainisation",
      quotaDetail:
        "Generally the lowest quotas in the GCC; flexible fee-based system, and Bahrain has largely abolished the kafala sponsorship system",
      riskLabel: "Low",
      sourceNote: "Published — most flexible GCC framework",
    },
  },
  Kuwait: {
    default: {
      policyName: "Kuwaitisation",
      quotaDetail:
        "100% Kuwaiti nationals mandated in government roles; private-sector quotas are rising sharply and are among the most aggressive in the GCC",
      riskLabel: "High",
      sourceNote: "Published policy direction",
    },
  },
};

function getQuotaInfo(country: string, sector: string): QuotaInfo {
  const entry = NATIONALIZATION_DATA[country] ?? {};
  return (
    entry[sector] ??
    entry["default"] ?? {
      policyName: "National quota policy",
      quotaDetail:
        "Specific figure not available for this country/sector combination — treat as moderate risk pending direct verification",
      riskLabel: "Medium",
      sourceNote: "No specific published data found — estimated",
    }
  );
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
      Math.round(((p.targetSalary - p.currentSalary) / p.currentSalary) * 100) -
        30,
    ) * 0.12;
  const eduScore =
    p.education.includes("Master") ||
    p.education.includes("MBA") ||
    p.education.includes("PhD")
      ? 5
      : 0;
  return Math.min(
    96,
    base + expScore + skillScore + sectScore + eduScore - salaryDebt,
  );
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

function buildContext(p: UserProfile): string {
  const hirePct = computeHireProbability(p);
  const confidence = computeConfidence(p);
  const delta = Math.round(
    ((p.targetSalary - p.currentSalary) / p.currentSalary) * 100,
  );
  const primaryCountry = p.targetCountries[0] ?? "United Arab Emirates";
  const quota = getQuotaInfo(primaryCountry, p.sector);
  const hasGoldenVisa = p.targetSalary >= 30000;
  const hasAISkills = p.skills.some((s) =>
    [
      "python",
      "ai",
      "ml",
      "machine learning",
      "cloud",
      "aws",
      "azure",
      "llm",
    ].includes(s.toLowerCase()),
  );

  return `
=== VERIFIED PUBLISHED DATA (cite these as sourced facts, not estimates) ===
Nationalization policy: ${quota.policyName}
Quota detail: ${quota.quotaDetail}
Source basis: ${quota.sourceNote}
Nationalization risk for this sector/country: ${quota.riskLabel}

=== COMPUTED FROM THIS USER'S OWN INPUTS (internal model — NOT an independent market survey; say so explicitly if you reference these) ===
Hire probability estimate: ${Math.round(hirePct)}%
Confidence in this assessment: ${confidence}%
Requested salary uplift: +${delta}% over current salary
UAE Golden Visa eligible (AED 30K/mo threshold): ${hasGoldenVisa ? "YES" : "NO — below threshold"}
AI/Cloud skills present: ${hasAISkills ? "YES — high-demand cluster" : "NO"}

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
Target countries: ${p.targetCountries.join(", ") || "Not specified"}
Visa status: ${p.visaStatus}
User's question: "${p.question}"
`.trim();
}

type SSEEvent =
  | { type: "module_start"; moduleId: string }
  | { type: "thought"; moduleId: string; text: string }
  | { type: "module_complete"; moduleId: string; summary: string }
  | { type: "error"; message: string }
  | { type: "done" };

function sendSSE(res: import("express").Response, event: SSEEvent) {
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

const SYSTEM_PROMPT = `You are an expert GCC career intelligence analyst with deep knowledge of UAE, Saudi Arabia, Qatar, Oman, Bahrain, and Kuwait labour markets, nationalization policies, visa regulations, and compensation benchmarks.

You will receive a professional profile and a set of pre-computed metrics, split into two categories: VERIFIED PUBLISHED DATA (real, sourced nationalization/quota figures) and COMPUTED FROM THIS USER'S OWN INPUTS (an internal model estimate, not independent market data). Your task is to reason through 6 analytical modules, providing genuine expert insight grounded in the provided data.

Critical rule: be explicit about which numbers are VERIFIED PUBLISHED DATA versus COMPUTED FROM THIS USER'S OWN INPUTS. Never state an internally-computed estimate as if it were an independently verified market fact. Use the exact figures given — do not invent additional statistics, percentages, or counts that were not provided to you.

Write each module's reasoning as a series of concise, specific thought steps (6-8 per module). Each thought should be one substantive sentence — crisp, expert, and concrete. Think like a senior GCC recruiter who has placed hundreds of candidates, combined with a policy analyst who reads ministry circulars.

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
- policy: Cover the VERIFIED nationalization/quota data given to you (Nitaqat/Saudisation, Nafis/Emiratisation, Omanisation, Qatarisation, Kuwaitisation, Bahrainisation), visa pathways, and Golden Visa eligibility. Clearly distinguish sourced figures from any directional/estimated notes.
- salary: Discuss the requested salary uplift and its feasibility. Be clear that specific percentile benchmarks are not available in this version — reason qualitatively about the 0% income tax advantage and negotiation strategy instead of inventing percentile numbers.
- market: Assess sector hiring health and skills signal strength using only what's given — do not invent job counts, ghost-job percentages, or hiring velocity figures that were not provided.
- eligibility: Discuss visa transfer friction, NOC requirements if applicable, and how the nationalization risk level affects sponsorship likelihood — without inventing a specific sponsor count.
- recommendation: Synthesise all 5 modules into a prioritised recommendation — primary market, hire probability (labelled as an internal estimate), confidence, and top 3 concrete next actions.`;

router.post("/analyze", async (req, res) => {
  const profile = req.body?.profile as UserProfile | undefined;

  if (!profile || typeof profile !== "object") {
    res
      .status(400)
      .json({ error: "Missing or invalid profile in request body" });
    return;
  }

  const defaults = {
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
  };

  const p: UserProfile = {
    ...defaults,
    ...profile,
  };

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

    const MODULE_IDS = [
      "profile",
      "policy",
      "salary",
      "market",
      "eligibility",
      "recommendation",
    ];

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        buffer += event.delta.text;

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

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

          const summaryMatch = trimmed.match(/^\[MODULE_SUMMARY:(\w+)\]$/);
          if (summaryMatch) {
            inSummary = true;
            continue;
          }

          const endMatch = trimmed.match(/^\[MODULE_END:(\w+)\]$/);
          if (endMatch) {
            inSummary = false;
            currentModule = "";
            continue;
          }

          if (inSummary && currentModule) {
            sendSSE(res, {
              type: "module_complete",
              moduleId: currentModule,
              summary: trimmed,
            });
            inSummary = false;
            continue;
          }

          if (currentModule && !inSummary) {
            sendSSE(res, {
              type: "thought",
              moduleId: currentModule,
              text: trimmed,
            });
          }
        }
      }
    }

    if (buffer.trim() && currentModule && !inSummary) {
      const trimmed = buffer.trim();
      if (!trimmed.startsWith("[")) {
        sendSSE(res, {
          type: "thought",
          moduleId: currentModule,
          text: trimmed,
        });
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
