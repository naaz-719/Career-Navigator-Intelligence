// ─── Why Panel — Data Contract ────────────────────────────────────────────────
// Every score, percentage, and prediction on the platform must supply a WhyData
// object that explains exactly how it was calculated.

export interface WhyFactor {
  label: string;
  impact: 'positive' | 'negative' | 'neutral';
  valueLabel: string;   // e.g. "+24 pts", "8 yrs", "7 skills"
  barWidth: number;     // 0–100, visual weight of this factor
  detail?: string;      // optional one-line elaboration
}

export interface WhyData {
  metricLabel: string;         // e.g. "Career Score: 72 / 100"
  methodology: string;         // 1–2 sentences explaining the formula
  factors: WhyFactor[];
  confidence: number;          // 0–100
  confidenceReason: string;    // why confidence is this level
  assumptions: string[];       // bullet list of model assumptions
  recommendation: string;      // actionable 1-liner
}
