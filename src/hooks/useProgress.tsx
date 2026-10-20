import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { AchievementId } from "@/data/achievements";
import { applyRound, unlockLiveStreak } from "@/lib/achievements";
import {
  loadProgress,
  loadSettings,
  resetProgress as clearProgress,
  saveProgress,
  saveSettings,
  type Progress,
  type Settings,
} from "@/lib/storage";
import type { RoundSummary } from "@/types/game";

type Toast = { key: string; id: AchievementId };

type ProgressContextValue = {
  progress: Progress;
  settings: Settings;
  /** Effective reduced-motion: OS preference or the in-game toggle. */
  reduceMotion: boolean;
  systemReducedMotion: boolean;
  toasts: Toast[];
  dismissToast: (key: string) => void;
  commitRound: (summary: RoundSummary) => AchievementId[];
  noteStreak: (streak: number) => AchievementId[];
  resetProgress: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function useMediaQuery(query: string): boolean {
  const get = () => {
    try {
      return window.matchMedia(query).matches;
    } catch {
      return false;
    }
  };
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    let mql: MediaQueryList;
    try {
      mql = window.matchMedia(query);
    } catch {
      return;
    }
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, [query]);
  return matches;
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [toasts, setToasts] = useState<Toast[]>([]);
  // Mirror of the latest progress so commits never read a stale closure.
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const systemDark = useMediaQuery("(prefers-color-scheme: dark)");
  const systemReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const reduceMotion = systemReducedMotion || settings.reduceMotion;

  useEffect(() => {
    const theme = settings.theme === "system" ? (systemDark ? "dark" : "light") : settings.theme;
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-motion", reduceMotion ? "reduce" : "full");
    document
      .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
      .forEach((m) => (m.content = theme === "dark" ? "#151A2E" : "#F7F1E5"));
  }, [settings.theme, systemDark, reduceMotion]);

  const pushToasts = useCallback((ids: AchievementId[]) => {
    if (ids.length === 0) return;
    setToasts((t) => [...t, ...ids.map((id) => ({ id, key: `${id}-${Date.now()}` }))]);
  }, []);

  const persist = useCallback((next: Progress) => {
    progressRef.current = next;
    setProgress(next);
    saveProgress(next);
  }, []);

  const commitRound = useCallback(
    (summary: RoundSummary) => {
      const { progress: next, unlocked } = applyRound(progressRef.current, summary);
      if (next !== progressRef.current) persist(next);
      pushToasts(unlocked);
      return unlocked;
    },
    [persist, pushToasts],
  );

  const noteStreak = useCallback(
    (streak: number) => {
      const { progress: next, unlocked } = unlockLiveStreak(progressRef.current, streak, new Date().toISOString());
      if (unlocked.length) {
        persist(next);
        pushToasts(unlocked);
      }
      return unlocked;
    },
    [persist, pushToasts],
  );

  const resetProgress = useCallback(() => {
    const fresh = clearProgress();
    progressRef.current = fresh;
    setProgress(fresh);
    setToasts([]);
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((s) => {
      const next = { ...s, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  const dismissToast = useCallback((key: string) => setToasts((t) => t.filter((x) => x.key !== key)), []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      settings,
      reduceMotion,
      systemReducedMotion,
      toasts,
      dismissToast,
      commitRound,
      noteStreak,
      resetProgress,
      updateSettings,
    }),
    [progress, settings, reduceMotion, systemReducedMotion, toasts, dismissToast, commitRound, noteStreak, resetProgress, updateSettings],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside <ProgressProvider>");
  return ctx;
}
