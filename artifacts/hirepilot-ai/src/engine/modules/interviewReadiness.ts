// ─── Intelligence Module: Interview Readiness ─────────────────────────────────
// Backend seam: replace the entire function body with:
//   return fetch('/api/intelligence/interview', { method: 'POST', body: JSON.stringify(profile) }).then(r => r.json())

import type { AppProfile } from '@/context/ProfileContext';
import type { IntelligenceResult, Factor, SuggestedAction, RiskTier } from '../types';
import { TOP_COMPANIES } from '../data';

export interface InterviewQuestion {
  id: number;
  category: 'behavioural' | 'technical' | 'case' | 'culture';
  question: string;
  tip: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface InterviewReadinessResult extends IntelligenceResult {
  readinessScore: number;
  targetRole: string;
  targetCompanies: string[];
  questions: InterviewQuestion[];
}

// Question banks keyed by sector
const QUESTION_BANK: Record<string, Omit<InterviewQuestion, 'id'>[]> = {
  'Technology': [
    { category: 'behavioural', question: 'Walk me through a product launch you led from zero to one.',         tip: 'Use STAR framework. Quantify impact in AED or user numbers.', difficulty: 'medium' },
    { category: 'technical',   question: 'How do you prioritise a backlog when every stakeholder says their request is P0?', tip: 'Demonstrate RICE or value vs effort matrix. Show data-driven decision making.', difficulty: 'medium' },
    { category: 'case',        question: 'We want to grow our GCC market share by 20% in 12 months. How would you approach this?', tip: 'Structure: market analysis → segmentation → channels → metrics. Show GCC context awareness.', difficulty: 'hard' },
    { category: 'culture',     question: 'Tell me about a time you had to influence without authority across a culturally diverse team.', tip: 'GCC workplaces are highly multicultural. Show respect for hierarchy and consensus-building.', difficulty: 'medium' },
    { category: 'technical',   question: 'How do you measure the success of a product feature post-launch?',  tip: 'Mention leading (engagement, activation) and lagging (revenue, retention) metrics.', difficulty: 'easy' },
    { category: 'behavioural', question: 'Describe a time you had to kill a project you championed.',          tip: 'Shows intellectual honesty. Frame as: data-driven decision, team communication, lessons learned.', difficulty: 'hard' },
    { category: 'case',        question: 'Design a notifications system for a super-app with 10M GCC users.', tip: 'Cover: user segments, frequency capping, localisation (Arabic/RTL), compliance with TDRA.', difficulty: 'hard' },
    { category: 'culture',     question: 'How do you build trust with a new team when joining a well-established organisation?', tip: 'Show active listening, quick wins strategy, and respect for existing processes before proposing change.', difficulty: 'easy' },
  ],
  'Finance & Banking': [
    { category: 'technical',   question: 'Walk me through how you would build a DCF model for a GCC bank.',   tip: 'Cover free cash flow, cost of equity (CAPM), terminal value, and UAE CBUAE regulatory adjustments.', difficulty: 'hard' },
    { category: 'behavioural', question: 'Describe a time you identified a material risk that others had missed.', tip: 'Use STAR. Quantify the risk in financial terms and show your escalation process.', difficulty: 'medium' },
    { category: 'case',        question: 'A client\'s credit score drops significantly mid-relationship. How do you handle it?', tip: 'Show risk management process: early warning signals, collateral review, restructuring options.', difficulty: 'hard' },
    { category: 'culture',     question: 'How do you navigate relationships with government-linked clients in the GCC?', tip: 'Understand Wasta culture — emphasise long-term relationship building and protocol sensitivity.', difficulty: 'medium' },
    { category: 'technical',   question: 'Explain the IFRS 9 ECL model and how it affected GCC banks\' 2020 provisions.', tip: 'Stage 1/2/3 classification, COVID overlays, UAE CBUAE guidance on COVID deferrals.', difficulty: 'hard' },
    { category: 'behavioural', question: 'Tell me about your most complex cross-border transaction.',           tip: 'Highlight: multi-jurisdiction compliance, FX management, correspondent banking relationships.', difficulty: 'medium' },
  ],
  'Healthcare': [
    { category: 'technical',   question: 'How do you ensure compliance with HAAD and DHA standards simultaneously?', tip: 'Show knowledge of HAAD circulars, DHA licensing, and how they differ on clinical protocols.', difficulty: 'hard' },
    { category: 'behavioural', question: 'Describe a patient safety incident you managed. What was your role?', tip: 'Use structured incident review: immediate response, root cause analysis, systemic fix, staff communication.', difficulty: 'hard' },
    { category: 'case',        question: 'How would you reduce average length of stay by 15% without compromising care quality?', tip: 'Cover: clinical pathways, early discharge planning, bed management, patient flow analytics.', difficulty: 'hard' },
    { category: 'culture',     question: 'How do you manage diverse clinical teams where many staff are from different countries?', tip: 'Show cultural competence — acknowledge communication styles, team briefing practices, de-escalation.', difficulty: 'medium' },
  ],
  'Energy & Oil & Gas': [
    { category: 'technical',   question: 'Walk me through your approach to an RBI (Risk-Based Inspection) programme.',  tip: 'Cover: API 580/581 standards, consequence modelling, inspection intervals, data management.', difficulty: 'hard' },
    { category: 'behavioural', question: 'Describe your most challenging HSE incident and how you managed it.',          tip: 'Show: immediate response protocol, LOPC/RIDDOR reporting, investigation methodology, systemic corrective actions.', difficulty: 'hard' },
    { category: 'case',        question: 'ADNOC wants to integrate its offshore assets into a digital twin platform. What\'s your approach?', tip: 'Structure: data architecture, OT/IT integration, cybersecurity, change management, phased rollout.', difficulty: 'hard' },
    { category: 'culture',     question: 'How do you maintain a strong safety culture on a remote site?',               tip: 'Leadership by example, visible leadership, STOP Work Authority culture, toolbox talks.', difficulty: 'medium' },
  ],
};

const DEFAULT_QUESTIONS = QUESTION_BANK['Technology']!;

export function computeInterviewReadiness(profile: AppProfile): InterviewReadinessResult {
  const skillPts         = Math.min(42, profile.skills.length * 5);
  const readinessScore   = Math.min(90, 48 + skillPts);
  const confidence       = Math.min(88, 58 + profile.skills.length * 3);

  const companies  = (TOP_COMPANIES[profile.sector] ?? TOP_COMPANIES['Technology']!).slice(0, 3).map(c => c.name);
  const bank       = QUESTION_BANK[profile.sector] ?? DEFAULT_QUESTIONS;
  const questions: InterviewQuestion[] = bank.map((q, i) => ({ ...q, id: i + 1 }));

  const riskTier: RiskTier = readinessScore >= 80 ? 'low' : readinessScore >= 65 ? 'medium' : 'high';

  const gapCount  = Math.max(0, 5 - Math.min(5, profile.skills.length));
  const factors: Factor[] = [
    { label: 'Base readiness floor',                      impact: 'positive',  weight: 50, detail: 'Reflects general professional experience' },
    { label: `Skills verified (${profile.skills.length})`, impact: 'positive', weight: Math.round((skillPts / 42) * 100), detail: 'Each skill adds 5 pts confidence up to cap' },
    ...(gapCount > 0 ? [{ label: `${gapCount} skill gaps vs top-demand list`, impact: 'negative' as const, weight: gapCount * 20, detail: 'Recruiters test for these in technical rounds' }] : []),
    { label: 'Interview Coach sessions',                   impact: 'neutral',   weight: 30, detail: '3 mock sessions typically add 15–20 pts to readiness' },
  ];

  const suggestedActions: SuggestedAction[] = [
    { action: readinessScore < 80 ? 'Run 3 mock interview sessions — proven to add 15–20 pts' : 'Stress-test case study and cultural-fit rounds', priority: 'high', timeframe: 'This week', link: '/interview-coach', linkLabel: 'Start Practice' },
    { action: `Prepare 3 quantified impact stories for ${companies[0] ?? 'target employer'} cultural panel`, priority: 'medium', timeframe: 'Before first interview' },
    { action: 'Research ${profile.sector} GCC market context — interviewers test situational awareness',       priority: 'medium', timeframe: 'Ongoing' },
  ];

  return {
    score: readinessScore, probability: Math.min(88, readinessScore + 5), confidence,
    reasoning: `Interview readiness: ${readinessScore}%. With ${profile.skills.length} skills indexed you're ${readinessScore >= 80 ? 'well prepared — stress-test with mock sessions before live interviews' : 'building towards readiness — run 3 mock sessions to close the gap'}.`,
    contributingFactors: factors, riskLevel: riskTier, suggestedActions,
    readinessScore, targetRole: profile.currentRole,
    targetCompanies: companies, questions,
  };
}
