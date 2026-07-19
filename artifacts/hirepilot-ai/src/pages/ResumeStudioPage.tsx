import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Plus,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  LayoutTemplate,
} from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { computeResumeScore } from "@/engine/modules/resumeScore";

const TYPE_COLOUR: Record<string, string> = {
  critical: "bg-red-500/10 text-red-500",
  warning: "bg-amber-500/10 text-amber-500",
  tip: "bg-blue-500/10 text-blue-500",
  credentials: "bg-green-500/10 text-green-500",
  relevance: "bg-purple-500/10 text-purple-500",
};

export default function ResumeStudioPage() {
  const { profile } = useProfile();
  const result = useMemo(() => computeResumeScore(profile), [profile]);

  const [activeVersionId, setActiveVersionId] = useState(
    result.resumeVersions[0]?.id ?? "v1",
  );
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<number>>(
    new Set(),
  );

  const activeVersion =
    result.resumeVersions.find((v) => v.id === activeVersionId) ??
    result.resumeVersions[0];
  const atsScore = activeVersion?.atsScore ?? result.atsOverallScore;

  const applySuggestion = (idx: number) => {
    setAppliedSuggestions((prev) => new Set([...prev, idx]));
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6">
      <div className="flex flex-col gap-1 shrink-0">
        <h2
          className="text-2xl font-semibold text-foreground tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Resume Studio
        </h2>
        <p className="text-muted-foreground text-sm">
          AI-powered resumes that pass GCC ATS systems
        </p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Left: Version Manager */}
        <div className="w-full lg:w-64 flex flex-col gap-4 shrink-0 overflow-y-auto pr-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-sm">Versions</h3>
          </div>

          {result.resumeVersions.map((v) => (
            <div
              key={v.id}
              onClick={() => setActiveVersionId(v.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                v.id === activeVersionId
                  ? "bg-primary/10 border-primary shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                  : "bg-card border-border/50 hover:border-primary/50"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium text-sm truncate pr-2">
                  {v.label}
                </div>
                <div
                  className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                    v.atsScore >= 90
                      ? "bg-green-500/20 text-green-500"
                      : v.atsScore >= 80
                        ? "bg-primary/20 text-primary"
                        : "bg-amber-500/20 text-amber-500"
                  }`}
                >
                  {v.atsScore}
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span className="truncate">
                  {v.targetCountry
                    .replace("United Arab Emirates", "UAE")
                    .replace("Saudi Arabia", "KSA")}
                </span>
                <Download className="w-3 h-3 hover:text-foreground transition-colors shrink-0" />
              </div>
            </div>
          ))}

          <button className="mt-2 flex items-center justify-center gap-2 w-full py-3 border border-dashed border-border/50 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-muted/30 transition-all">
            <Plus className="w-4 h-4" /> Create New Version
          </button>
        </div>

        {/* Center: Resume Preview */}
        <div className="flex-1 bg-muted/20 border border-border/50 rounded-xl overflow-hidden flex flex-col relative min-h-[500px]">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <div
              className={`bg-background border shadow-lg rounded-full px-3 py-1.5 flex items-center gap-2 text-sm font-medium ${
                atsScore >= 90 ? "border-green-500/50" : "border-border/50"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${atsScore >= 90 ? "bg-green-500" : "bg-amber-500"}`}
              ></span>
              ATS Score: {atsScore}/100
            </div>
          </div>

          <div className="p-2 border-b border-border/50 bg-card flex justify-between items-center shrink-0">
            <div className="flex gap-2">
              <button className="p-1.5 text-muted-foreground hover:bg-muted rounded">
                <LayoutTemplate className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-muted-foreground">
              {activeVersion?.label ?? "Resume"} (Auto-saved 2m ago)
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-muted/10">
            {/* Paper */}
            <div className="bg-white text-black w-full max-w-[800px] min-h-[1056px] p-8 md:p-12 shadow-2xl rounded-sm transform origin-top scale-90 sm:scale-100">
              <header className="border-b-2 border-gray-300 pb-4 mb-6">
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-1">
                  {profile.name}
                </h1>
                <p className="text-gray-600 text-sm">
                  {profile.currentCountry
                    .replace("United Arab Emirates", "Dubai, UAE")
                    .replace("Saudi Arabia", "Riyadh, KSA")}{" "}
                  •
                  {profile.email
                    ? ` ${profile.email}`
                    : profile.linkedinUrl
                      ? ` linkedin.com/in/${profile.linkedinUrl.replace(/.*linkedin\.com\/in\//, "").replace(/\//, "")}`
                      : " Add your email in Settings"}
                </p>
              </header>

              <section className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1 mb-3">
                  Professional Summary
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {profile.currentRole || "Professional"} with{" "}
                  {profile.yearsExperience}+ years of experience in{" "}
                  {profile.sector}.
                  {profile.skills.length > 0
                    ? ` Skilled in ${profile.skills.slice(0, 4).join(", ")}.`
                    : " Add your skills in the AI Decision Engine profile section to see them reflected here."}
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1 mb-3">
                  Experience
                </h2>
                {profile.projects && profile.projects.length > 0 ? (
                  profile.projects.map((proj, idx) => (
                    <div key={idx} className="mb-4">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-gray-900">
                          {proj.title}
                        </h3>
                        <span className="text-sm text-gray-600 font-medium">
                          {proj.period}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm italic text-gray-700">
                          {proj.org}
                        </span>
                      </div>
                      <ul className="list-disc pl-4 text-sm text-gray-700 space-y-1">
                        {proj.bullets
                          .filter((b) => b.trim())
                          .map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No experience added yet — add your real projects and work
                    history in Settings to see them here.
                  </p>
                )}
              </section>

              <section className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1 mb-3">
                  Skills & Certifications
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <strong>Core:</strong>{" "}
                    {profile.skills.length > 0
                      ? profile.skills.slice(0, 4).join(", ")
                      : "Add skills in AI Decision Engine"}
                  </div>
                  <div className="relative group">
                    <strong>Languages:</strong>{" "}
                    {profile.languages.length > 0
                      ? profile.languages.join(", ")
                      : "English, Arabic"}
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary/20 rounded-full border border-primary text-[8px] flex items-center justify-center font-bold text-primary opacity-0 group-hover:opacity-100 cursor-pointer">
                      AI
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Right: AI Panel */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4 overflow-y-auto pr-2">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-medium text-sm">AI Suggestions</h3>
          </div>

          <div className="space-y-3">
            {result.suggestions.map((s, idx) => {
              const applied = appliedSuggestions.has(idx);
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${applied ? "bg-muted/20 border-border/30 opacity-60" : "bg-card border-border/50 hover:border-primary/30"} transition-colors`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${TYPE_COLOUR[s.type] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {s.type}
                    </span>
                    {applied && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm font-medium mb-1 text-foreground">
                    {s.title}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {s.detail}
                  </p>
                  {!applied && (
                    <button
                      onClick={() => applySuggestion(idx)}
                      className="text-xs bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground transition-colors px-3 py-1.5 rounded-md font-medium w-full flex justify-center"
                    >
                      Apply Suggestion
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-4 space-y-3 border-t border-border/50">
            <button className="w-full p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/50 transition-colors flex items-center justify-between group">
              <div className="flex flex-col text-left">
                <span className="font-medium text-sm text-foreground">
                  Tailor to Job Description
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  Paste JD to auto-optimize
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
            <button className="w-full p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/50 transition-colors flex items-center justify-between group">
              <div className="flex flex-col text-left">
                <span className="font-medium text-sm text-foreground">
                  Generate Cover Letter
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  GCC-standard format
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
