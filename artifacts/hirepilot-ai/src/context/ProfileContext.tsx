// ─── Shared Profile Context ──────────────────────────────────────────────────
// Single source of truth for the current user's profile across all pages.
// Every page reads from useProfile(). The AI Decision Engine writes to it.
// When a real auth layer exists, replace DEFAULT_PROFILE with the API response.

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { DecisionResult } from '@/components/decision-engine/types';

// ─── Canonical app-wide profile ──────────────────────────────────────────────
// This is a superset of the decision engine's UserProfile form shape.
// Backend seam: replace DEFAULT_PROFILE fetch with GET /api/me
export interface AppProfile {
  name: string;
  nationality: string;
  currentRole: string;
  yearsExperience: number;
  skills: string[];
  education: string;
  sector: string;
  currentSalary: number;   // AED / month
  targetSalary: number;    // AED / month
  currentCountry: string;
  targetCountries: string[];
  visaStatus: string;
  careerGoal: string;
}

export const DEFAULT_PROFILE: AppProfile = {
  name: 'Ahmed',
  nationality: 'Egyptian',
  currentRole: 'Senior Product Manager',
  yearsExperience: 8,
  skills: ['Product Strategy', 'Agile/Scrum', 'Stakeholder Mgmt', 'Data Analytics', 'Roadmapping'],
  education: "Master's Degree",
  sector: 'Technology',
  currentSalary: 22000,
  targetSalary: 35000,
  currentCountry: 'United Arab Emirates',
  targetCountries: ['United Arab Emirates', 'Saudi Arabia', 'Qatar'],
  visaStatus: 'Employment Visa',
  careerGoal: 'Get a new job in GCC',
};

// ─── Context shape ────────────────────────────────────────────────────────────
interface ProfileContextValue {
  profile: AppProfile;
  setProfile: React.Dispatch<React.SetStateAction<AppProfile>>;
  /** Merge fields from a completed AI Decision Engine analysis into the profile */
  mergeFromAnalysis: (partial: Partial<AppProfile>) => void;
  /** The most recent completed AI Decision Engine result, or null */
  lastAnalysis: DecisionResult | null;
  setLastAnalysis: (r: DecisionResult | null) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<AppProfile>(DEFAULT_PROFILE);
  const [lastAnalysis, setLastAnalysis] = useState<DecisionResult | null>(null);

  const mergeFromAnalysis = useCallback((partial: Partial<AppProfile>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, mergeFromAnalysis, lastAnalysis, setLastAnalysis }}>
      {children}
    </ProfileContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside <ProfileProvider>');
  return ctx;
}
