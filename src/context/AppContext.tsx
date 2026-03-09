import React, { createContext, useContext, useState, ReactNode } from "react";
import { StudentProfile, RecommendedInternship } from "@/data/internships";

interface AppState {
  profile: StudentProfile | null;
  setProfile: (p: StudentProfile) => void;
  recommendations: RecommendedInternship[];
  setRecommendations: (r: RecommendedInternship[]) => void;
  savedInternships: string[];
  toggleSaved: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedInternship[]>([]);
  const [savedInternships, setSaved] = useState<string[]>([]);

  const toggleSaved = (id: string) => {
    setSaved((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  return (
    <AppContext.Provider value={{ profile, setProfile, recommendations, setRecommendations, savedInternships, toggleSaved }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be inside AppProvider");
  return ctx;
}
