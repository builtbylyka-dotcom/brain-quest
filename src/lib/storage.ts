import { ACHIEVEMENT_IDS, type AchievementId } from "@/data/achievements";
import { CATEGORIES } from "@/data/categories";
import type { GameMode } from "@/types/game";
import { DIFFICULTIES, type Difficulty } from "@/types/questions";

export const PROGRESS_KEY = "brainquest:progress";
export const SETTINGS_KEY = "brainquest:settings";
export const SCHEMA_VERSION = 1;
export const QUILT_ROWS_KEPT = 24;

/** One finished round, remembered as a row of patches: c = correct, w = wrong, t = timed out. */
export type QuiltRow = {
  roundId: string;
  subcategory: string;
  difficulty: Difficulty;
  patches: ("c" | "w" | "t")[];
};

export type Stats = {
  gamesPlayed: number;
  questionsAnswered: number;
  correctAnswers: number;
  highestScore: number;
  longestStreak: number;
  bibleCorrect: number;
  perfectRounds: number;
  timedRoundsCompleted: number;
  byCategory: Record<string, number>;
  byDifficulty: Record<Difficulty, number>;
  byMode: Record<GameMode, number>;
  /** Distinct Bible subcategory ids with at least one completed round. */
  subcategoriesCompleted: string[];
};

export type Progress = {
  version: number;
  stats: Stats;
  /** Unlock date (ISO) per achievement. */
  achievements: Partial<Record<AchievementId, string>>;
  quilt: QuiltRow[];
  /** Guards against committing the same round twice. */
  lastRoundId: string | null;
};

export type Theme = "system" | "light" | "dark";

export type Settings = {
  sound: boolean;
  reduceMotion: boolean;
  theme: Theme;
};

export const defaultStats = (): Stats => ({
  gamesPlayed: 0,
  questionsAnswered: 0,
  correctAnswers: 0,
  highestScore: 0,
  longestStreak: 0,
  bibleCorrect: 0,
  perfectRounds: 0,
  timedRoundsCompleted: 0,
  byCategory: {},
  byDifficulty: { easy: 0, medium: 0, hard: 0 },
  byMode: { classic: 0, timed: 0 },
  subcategoriesCompleted: [],
});

export const defaultProgress = (): Progress => ({
  version: SCHEMA_VERSION,
  stats: defaultStats(),
  achievements: {},
  quilt: [],
  lastRoundId: null,
});

export const defaultSettings = (): Settings => ({ sound: true, reduceMotion: false, theme: "system" });

/* ---------- storage access that never throws ---------- */

export type KeyValueStore = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const memory = new Map<string, string>();
const memoryStore: KeyValueStore = {
  getItem: (k) => memory.get(k) ?? null,
  setItem: (k, v) => void memory.set(k, v),
  removeItem: (k) => void memory.delete(k),
};

let resolved: KeyValueStore | null = null;

/** localStorage when usable; otherwise an in-memory fallback (private mode, blocked iframe storage). */
export function getStore(): KeyValueStore {
  if (resolved) return resolved;
  try {
    const ls = window.localStorage;
    const probe = "__brainquest_probe__";
    ls.setItem(probe, "1");
    ls.removeItem(probe);
    resolved = ls;
  } catch {
    resolved = memoryStore;
  }
  return resolved;
}

function readJson(store: KeyValueStore, key: string): unknown {
  try {
    const raw = store.getItem(key);
    return raw === null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function writeJson(store: KeyValueStore, key: string, value: unknown): boolean {
  try {
    store.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/* ---------- validation ---------- */

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const count = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0);
const isIsoDate = (v: unknown): v is string => typeof v === "string" && !Number.isNaN(Date.parse(v));

const CATEGORY_IDS = new Set<string>(CATEGORIES.map((c) => c.id));

function validateCounts<K extends string>(raw: unknown, keys: readonly K[]): Record<K, number> {
  const src = isObject(raw) ? raw : {};
  return Object.fromEntries(keys.map((k) => [k, count(src[k])])) as Record<K, number>;
}

function validateStats(raw: unknown): Stats {
  const s = isObject(raw) ? raw : {};
  const byCategory: Record<string, number> = {};
  if (isObject(s.byCategory)) {
    for (const [k, v] of Object.entries(s.byCategory)) if (CATEGORY_IDS.has(k) && count(v) > 0) byCategory[k] = count(v);
  }
  const subs = Array.isArray(s.subcategoriesCompleted)
    ? [...new Set(s.subcategoriesCompleted.filter((x): x is string => typeof x === "string" && x.length < 40))]
    : [];
  const stats: Stats = {
    gamesPlayed: count(s.gamesPlayed),
    questionsAnswered: count(s.questionsAnswered),
    correctAnswers: count(s.correctAnswers),
    highestScore: count(s.highestScore),
    longestStreak: count(s.longestStreak),
    bibleCorrect: count(s.bibleCorrect),
    perfectRounds: count(s.perfectRounds),
    timedRoundsCompleted: count(s.timedRoundsCompleted),
    byCategory,
    byDifficulty: validateCounts(s.byDifficulty, DIFFICULTIES),
    byMode: validateCounts(s.byMode, ["classic", "timed"] as const),
    subcategoriesCompleted: subs,
  };
  // Correct answers can never exceed answered questions.
  stats.correctAnswers = Math.min(stats.correctAnswers, stats.questionsAnswered);
  stats.bibleCorrect = Math.min(stats.bibleCorrect, stats.correctAnswers);
  return stats;
}

function validateQuilt(raw: unknown): QuiltRow[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(isObject)
    .filter(
      (r) =>
        typeof r.roundId === "string" &&
        typeof r.subcategory === "string" &&
        DIFFICULTIES.includes(r.difficulty as Difficulty) &&
        Array.isArray(r.patches) &&
        r.patches.length > 0 &&
        r.patches.length <= 20 &&
        r.patches.every((p) => p === "c" || p === "w" || p === "t"),
    )
    .map((r) => ({
      roundId: r.roundId as string,
      subcategory: r.subcategory as string,
      difficulty: r.difficulty as Difficulty,
      patches: r.patches as QuiltRow["patches"],
    }))
    .slice(-QUILT_ROWS_KEPT);
}

/** Upgrade older shapes to the current schema. Add a case per version bump. */
export function migrate(raw: Record<string, unknown>): Record<string, unknown> {
  const version = typeof raw.version === "number" ? raw.version : 0;
  let data = { ...raw };
  if (version < 1) {
    // v0 (pre-release) stored stats at the top level.
    if (!isObject(data.stats) && "gamesPlayed" in data) data = { stats: data, achievements: data.achievements };
    data.version = 1;
  }
  return data;
}

export function validateProgress(raw: unknown): Progress {
  if (!isObject(raw)) return defaultProgress();
  const data = migrate(raw);
  const achievements: Progress["achievements"] = {};
  if (isObject(data.achievements)) {
    for (const id of ACHIEVEMENT_IDS) {
      const date = data.achievements[id];
      if (isIsoDate(date)) achievements[id] = date;
    }
  }
  return {
    version: SCHEMA_VERSION,
    stats: validateStats(data.stats),
    achievements,
    quilt: validateQuilt(data.quilt),
    lastRoundId: typeof data.lastRoundId === "string" ? data.lastRoundId : null,
  };
}

export function validateSettings(raw: unknown): Settings {
  const d = defaultSettings();
  if (!isObject(raw)) return d;
  return {
    sound: typeof raw.sound === "boolean" ? raw.sound : d.sound,
    reduceMotion: typeof raw.reduceMotion === "boolean" ? raw.reduceMotion : d.reduceMotion,
    theme: raw.theme === "light" || raw.theme === "dark" || raw.theme === "system" ? raw.theme : d.theme,
  };
}

/* ---------- public API ---------- */

export const loadProgress = (store = getStore()) => validateProgress(readJson(store, PROGRESS_KEY));
export const saveProgress = (p: Progress, store = getStore()) => writeJson(store, PROGRESS_KEY, p);
export const loadSettings = (store = getStore()) => validateSettings(readJson(store, SETTINGS_KEY));
export const saveSettings = (s: Settings, store = getStore()) => writeJson(store, SETTINGS_KEY, s);

/** Deletes progress only; settings (theme, sound) are kept. */
export function resetProgress(store = getStore()): Progress {
  try {
    store.removeItem(PROGRESS_KEY);
  } catch {
    /* ignore */
  }
  return defaultProgress();
}
