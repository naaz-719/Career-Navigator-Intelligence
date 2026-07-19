// ─── Shared Profile Context ──────────────────────────────────────────────────
// Single source of truth for the current user's profile across ALL pages.
// Every page reads from useProfile(). The AI Decision Engine also writes to it.
// Backend seam: replace DEFAULT_PROFILE with GET /api/me when auth is live.

import React, { createContext, useContext, useState, useCallback } from "react";
import type { DecisionResult } from "@/components/decision-engine/types";

// ─── Canonical app-wide profile ──────────────────────────────────────────────
// This is the single UserProfile model used by every intelligence module.
// The decision engine extends this with a transient `question` field — see
// components/decision-engine/types.ts for that shape.
export interface AppProfile {
  name: string;
  nationality: string;
  currentRole: string;
  yearsExperience: number;
  skills: string[];
  education: string;
  sector: string;
  currentSalary: number; // AED / month
  targetSalary: number; // AED / month
  currentCountry: string;
  targetCountries: string[];
  visaStatus: string;
  careerGoal: string;
  // Extended profile fields
  languages: string[];
  linkedinUrl: string;
  preferredWorkStyle: "onsite" | "hybrid" | "remote" | "";
}

export const DEFAULT_PROFILE: AppProfile = {
  name: "Ahmed",
  nationality: "Egyptian",
  currentRole: "Senior Product Manager",
  yearsExperience: 8,
  skills: [
    "Product Strategy",
    "Agile/Scrum",
    "Stakeholder Mgmt",
    "Data Analytics",
    "Roadmapping",
  ],
  education: "Master's Degree",
  sector: "Technology",
  currentSalary: 22000,
  targetSalary: 35000,
  currentCountry: "United Arab Emirates",
  targetCountries: ["United Arab Emirates", "Saudi Arabia", "Qatar"],
  visaStatus: "Employment Visa",
  careerGoal: "Get a new job in GCC",
  languages: ["English", "Arabic"],
  linkedinUrl: "",
  preferredWorkStyle: "hybrid",
};

// ─── Context shape ────────────────────────────────────────────────────────────
interface ProfileContextValue {
  profile: AppProfile;
  setProfile: React.Dispatch<React.SetStateAction<AppProfile>>;
  /** Merge partial fields — use this for any page that writes back to the profile */
  updateProfile: (partial: Partial<AppProfile>) => void;
  /** Merge fields from a completed AI Decision Engine analysis */
  mergeFromAnalysis: (partial: Partial<AppProfile>) => void;
  /** Most recent completed AI Decision Engine result, or null */
  lastAnalysis: DecisionResult | null;
  setLastAnalysis: (r: DecisionResult | null) => void;
  /** Monotonic timestamp — increments on every profile change */
  lastUpdated: number;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<AppProfile>(() => {
    const saved = localStorage.getItem("hirepilot_profile");
    if (saved) {
      try {
        return JSON.parse(saved) as AppProfile;
      } catch {
        /* fall through */
      }
    }
    return DEFAULT_PROFILE;
  });
  const [lastAnalysis, setLastAnalysis] = useState<DecisionResult | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  const updateProfile = useCallback((updates: Partial<AppProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem("hirepilot_profile", JSON.stringify(next));
      return next;
    });
  }, []);

  const mergeFromAnalysis = useCallback((partial: Partial<AppProfile>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
    setLastUpdated(Date.now());
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        updateProfile,
        mergeFromAnalysis,
        lastAnalysis,
        setLastAnalysis,
        lastUpdated,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside <ProfileProvider>");
  return ctx;
}
