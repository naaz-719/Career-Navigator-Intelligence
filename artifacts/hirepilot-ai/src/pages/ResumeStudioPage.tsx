import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Sparkles,
  CheckCircle2,
  Copy,
  Loader2,
  Plus,
  X,
  Save,
  UploadCloud,
  FileText,
} from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { computeResumeScore } from "@/engine/modules/resumeScore";

interface InterviewQ {
  q: string;
  tip: string;
}
interface CopilotResult {
  score_before: number;
  score_after: number;
  missing_keywords: string[];
  key_changes: string[];
  optimized_cv: string;
  cover_letter: string;
  salary_estimate: string;
  interview_questions: InterviewQ[];
}

// ─── Small helper: load a script from CDN once, then reuse it ────────────────
function loadScript(src: string, globalCheck: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any)[globalCheck]) {
      resolve();
      return;
    }
    const existing = document.querySelector(
      `script[src="${src}"]`,
    ) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error(`Failed to load ${src}`)),
      );
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

async function extractPdfText(file: File): Promise<string> {
  await loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
    "pdfjsLib",
  );
  const pdfjsLib = (window as any).pdfjsLib;
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((it: any) => it.str).join(" ") + "\n";
  }
  return text;
}

async function extractDocxText(file: File): Promise<string> {
  await loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js",
    "mammoth",
  );
  const mammoth = (window as any).mammoth;
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value as string;
}

export default function ResumeStudioPage() {
  const { profile, updateProfile } = useProfile();
  const result = useMemo(() => computeResumeScore(profile), [profile]);

  // ─── Editable fields (local draft, saved on demand) ───────────────────────
  const [summary, setSummary] = useState(profile.summaryOverride);
  const [projects, setProjects] = useState(profile.projects);
  const [skills, setSkills] = useState(profile.skills);
  const [skillInput, setSkillInput] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSummary(profile.summaryOverride);
    setProjects(profile.projects);
    setSkills(profile.skills);
  }, [profile.summaryOverride, profile.projects, profile.skills]);

  const autoSummary = `${profile.currentRole || "Professional"} with ${profile.yearsExperience}+ years of experience in ${profile.sector}.${
    skills.length > 0 ? ` Skilled in ${skills.slice(0, 4).join(", ")}.` : ""
  }`;

  const handleSaveResume = () => {
    updateProfile({ summaryOverride: summary, projects, skills });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addProject = () =>
    setProjects((p) => [
      ...p,
      { title: "", org: "", period: "", bullets: [""] },
    ]);
  const removeProject = (idx: number) =>
    setProjects((p) => p.filter((_, i) => i !== idx));
  const updateProject = (
    idx: number,
    field: string,
    value: string | string[],
  ) =>
    setProjects((p) =>
      p.map((proj, i) => (i === idx ? { ...proj, [field]: value } : proj)),
    );

  const addSkill = () => {
    if (skillInput.trim()) {
      setSkills((s) => [...s, skillInput.trim()]);
      setSkillInput("");
    }
  };
  const removeSkill = (idx: number) =>
    setSkills((s) => s.filter((_, i) => i !== idx));

  // ─── Upload CV (PDF / DOCX / TXT) — replaces the typed resume for optimizing ──
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedCvText, setUploadedCvText] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase();
      let text = "";
      if (ext === "pdf") {
        text = await extractPdfText(file);
      } else if (ext === "docx") {
        text = await extractDocxText(file);
      } else if (ext === "txt") {
        text = await file.text();
      } else if (ext === "doc") {
        throw new Error(
          "Old .doc format isn't supported — please save as .docx or PDF and try again.",
        );
      } else {
        throw new Error("Please upload a PDF, DOCX, or TXT file.");
      }
      if (!text.trim()) {
        throw new Error("Couldn't find any text in that file.");
      }
      setUploadedCvText(text.trim());
      setUploadedFileName(file.name);
    } catch (err: any) {
      setUploadError(
        err?.message || "Couldn't read that file — try a different one.",
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const clearUpload = () => {
    setUploadedCvText(null);
    setUploadedFileName(null);
    setUploadError(null);
  };

  // ─── Resume Co-pilot (job-specific tailoring via n8n) ───────────────────────
  const [company, setCompany] = useState("");
  const [role, setRole] = useState(profile.currentRole || "");
  const [jobDescription, setJobDescription] = useState("");
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotError, setCopilotError] = useState<string | null>(null);
  const [copilotResult, setCopilotResult] = useState<CopilotResult | null>(
    null,
  );

  const canSubmit = company.trim() && role.trim() && jobDescription.trim();

  const buildCvText = () => {
    const projText = projects
      .map(
        (p) =>
          `${p.title} — ${p.org} (${p.period})\n${p.bullets
            .filter((b) => b.trim())
            .map((b) => `- ${b}`)
            .join("\n")}`,
      )
      .join("\n\n");
    return `${profile.name}\n${profile.email}\n\nSummary:\n${summary || autoSummary}\n\nExperience:\n${projText}\n\nSkills:\n${skills.join(", ")}`;
  };

  const handleOptimize = async () => {
    if (!canSubmit) return;
    setCopilotLoading(true);
    setCopilotError(null);
    setCopilotResult(null);
    try {
      const res = await fetch("/api/copilot/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cv: uploadedCvText || buildCvText(),
          jobDescription,
          company,
          role,
          email: profile.email || "",
        }),
      });
      if (!res.ok) throw new Error("backend unavailable");
      const data = await res.json();
      setCopilotResult(data as CopilotResult);
    } catch (e) {
      setCopilotError(
        "Could not reach the optimizer right now — try again in a moment.",
      );
    } finally {
      setCopilotLoading(false);
    }
  };

  const copyText = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2
            className="text-2xl font-semibold text-foreground tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Resume Studio
          </h2>
          <p className="text-muted-foreground text-sm">
            Edit your resume directly, then tailor it to any job.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`text-sm font-bold px-3 py-1.5 rounded-full ${
              result.atsOverallScore >= 90
                ? "bg-green-500/10 text-green-500"
                : result.atsOverallScore >= 75
                  ? "bg-primary/10 text-primary"
                  : "bg-amber-500/10 text-amber-500"
            }`}
          >
            ATS Score: {result.atsOverallScore}/100
          </div>
          <button
            onClick={handleSaveResume}
            className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            {saved ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saved ? "Saved" : "Save Resume"}
          </button>
        </div>
      </div>

      {/* ─── Editable Resume ─────────────────────────────────────────────────── */}
      <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
          <p className="text-sm text-muted-foreground">
            {profile.currentCountry} •{" "}
            {profile.email || "Add your email in Settings"}
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
            Professional Summary
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder={autoSummary}
            rows={3}
            className="w-full bg-background/60 border border-border/50 rounded-lg p-3 text-sm leading-relaxed"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Experience
            </label>
            <button
              onClick={addProject}
              className="text-xs flex items-center gap-1 text-primary hover:underline"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="space-y-3">
            {projects.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No experience added yet — click Add above.
              </p>
            )}
            {projects.map((proj, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-border/50 bg-background/40 space-y-2 relative"
              >
                <button
                  onClick={() => removeProject(idx)}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pr-6">
                  <input
                    value={proj.title}
                    onChange={(e) =>
                      updateProject(idx, "title", e.target.value)
                    }
                    placeholder="Title (e.g. Data Analyst)"
                    className="bg-background/60 border border-border/50 rounded p-2 text-sm"
                  />
                  <input
                    value={proj.org}
                    onChange={(e) => updateProject(idx, "org", e.target.value)}
                    placeholder="Organization"
                    className="bg-background/60 border border-border/50 rounded p-2 text-sm"
                  />
                </div>
                <input
                  value={proj.period}
                  onChange={(e) => updateProject(idx, "period", e.target.value)}
                  placeholder="Period (e.g. 2024 - Present)"
                  className="w-full bg-background/60 border border-border/50 rounded p-2 text-sm"
                />
                <textarea
                  value={proj.bullets.join("\n")}
                  onChange={(e) =>
                    updateProject(idx, "bullets", e.target.value.split("\n"))
                  }
                  placeholder="One achievement per line"
                  rows={3}
                  className="w-full bg-background/60 border border-border/50 rounded p-2 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Skills
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {skills.map((s, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-sm text-primary"
              >
                {s}
                <button
                  onClick={() => removeSkill(idx)}
                  className="hover:text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Type a skill and press Enter"
              className="flex-1 bg-background/60 border border-border/50 rounded-lg p-2 text-sm"
            />
            <button
              onClick={addSkill}
              className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* ─── Resume Co-pilot ─────────────────────────────────────────────────── */}
      <div className="bg-card border border-primary/30 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" /> Tailor This Resume to a
          Job
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
              Company Name
            </label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Google"
              className="w-full bg-background/60 border border-border/50 rounded-lg p-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
              Role / Job Title
            </label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Data Analyst"
              className="w-full bg-background/60 border border-border/50 rounded-lg p-2.5 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={6}
            placeholder="Paste the job description here..."
            className="w-full bg-background/60 border border-border/50 rounded-lg p-2.5 text-sm"
          />
        </div>

        {/* ─── Upload CV button ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          {!uploadedFileName ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-primary/40 text-primary text-sm font-medium py-2.5 rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UploadCloud className="w-4 h-4" />
              )}
              {uploading
                ? "Reading your file..."
                : "Upload CV (PDF, DOCX or TXT) from your PC or phone"}
            </button>
          ) : (
            <div className="flex items-center justify-between gap-2 border border-primary/40 bg-primary/10 rounded-lg px-3 py-2.5">
              <div className="flex items-center gap-2 text-sm text-primary min-w-0">
                <FileText className="w-4 h-4 shrink-0" />
                <span className="truncate">{uploadedFileName}</span>
                <CheckCircle2 className="w-4 h-4 shrink-0 text-green-500" />
              </div>
              <button
                onClick={clearUpload}
                className="text-xs text-muted-foreground hover:text-red-400 shrink-0"
              >
                Remove
              </button>
            </div>
          )}
          {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
          <p className="text-xs text-muted-foreground italic">
            {uploadedFileName
              ? "Using your uploaded file for optimization — remove it to use the resume above instead."
              : "Uses your resume above by default — or upload a CV file instead of retyping it."}
          </p>
        </div>

        {copilotError && (
          <div className="text-sm text-red-400">{copilotError}</div>
        )}

        <button
          onClick={handleOptimize}
          disabled={!canSubmit || copilotLoading}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-lg disabled:opacity-40 hover:bg-primary/90 transition-colors"
        >
          {copilotLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {copilotLoading ? "Analysing your CV..." : "Optimize for This Job"}
        </button>

        {copilotResult && (
          <div className="space-y-6 pt-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="text-xs uppercase tracking-wider text-red-400 font-semibold mb-1">
                  Before
                </div>
                <div className="text-2xl font-bold text-red-400">
                  {copilotResult.score_before}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="text-xs uppercase tracking-wider text-green-400 font-semibold mb-1">
                  After
                </div>
                <div className="text-3xl font-bold text-green-400">
                  {copilotResult.score_after}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold mb-1">
                  Boost
                </div>
                <div className="text-2xl font-bold text-blue-400">
                  +{copilotResult.score_after - copilotResult.score_before}%
                </div>
              </div>
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-1">
                  Est. Salary
                </div>
                <div className="text-base font-bold text-amber-400">
                  {copilotResult.salary_estimate}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Keywords Addressed</h4>
              <div className="flex flex-wrap gap-2">
                {copilotResult.missing_keywords.map((k, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full bg-muted/50 border border-border/50 text-xs"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Key Changes Made</h4>
              <ul className="space-y-1.5">
                {copilotResult.key_changes.map((c, i) => (
                  <li
                    key={i}
                    className="text-sm text-muted-foreground flex gap-2"
                  >
                    <span className="text-green-500">✓</span> {c}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-sm">Optimized CV</h4>
                <button
                  onClick={() => copyText(copilotResult.optimized_cv)}
                  className="text-xs flex items-center gap-1 text-primary hover:underline"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans bg-muted/20 p-3 rounded-lg border border-border/50">
                {copilotResult.optimized_cv}
              </pre>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-sm">Cover Letter</h4>
                <button
                  onClick={() => copyText(copilotResult.cover_letter)}
                  className="text-xs flex items-center gap-1 text-primary hover:underline"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans bg-muted/20 p-3 rounded-lg border border-border/50">
                {copilotResult.cover_letter}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">
                Interview Questions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {copilotResult.interview_questions.map((q, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-muted/20 border border-border/50"
                  >
                    <p className="text-sm font-medium mb-1">{q.q}</p>
                    <p className="text-xs text-muted-foreground">{q.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
