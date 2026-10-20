import { applyRound, newlyUnlocked, unlockLiveStreak } from "./achievements";
import {
  defaultProgress,
  loadProgress,
  loadSettings,
  PROGRESS_KEY,
  resetProgress,
  saveProgress,
  SETTINGS_KEY,
  validateProgress,
  type KeyValueStore,
} from "./storage";
import type { RoundSummary } from "@/types/game";

function memStore(init: Record<string, string> = {}): KeyValueStore & { data: Map<string, string> } {
  const data = new Map(Object.entries(init));
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  };
}

function summary(over: Partial<RoundSummary> & { correctCount?: number } = {}): RoundSummary {
  const total = over.total ?? 10;
  const correct = over.correctCount ?? 7;
  const answers = Array.from({ length: total }, (_, i) => ({
    questionId: `q${i}`,
    selectedIndex: i < correct ? 0 : 1,
    correct: i < correct,
    points: { base: 0, streak: 0, time: 0, total: 0 },
    secondsLeft: null,
  }));
  return {
    roundId: over.roundId ?? "r1",
    config: over.config ?? { category: "bible", subcategory: "old-testament", difficulty: "easy", mode: "classic" },
    total,
    correct,
    incorrect: total - correct,
    score: over.score ?? 900,
    bestStreak: over.bestStreak ?? correct,
    answers,
    completedAt: over.completedAt ?? "2026-10-20T10:00:00.000Z",
  };
}

describe("storage", () => {
  it("returns defaults when nothing is saved", () => {
    expect(loadProgress(memStore())).toEqual(defaultProgress());
    expect(loadSettings(memStore())).toEqual({ sound: true, reduceMotion: false, theme: "system" });
  });

  it("survives corrupted JSON", () => {
    const store = memStore({ [PROGRESS_KEY]: "{not json", [SETTINGS_KEY]: "]]" });
    expect(loadProgress(store)).toEqual(defaultProgress());
    expect(loadSettings(store).theme).toBe("system");
  });

  it("survives a store that throws", () => {
    const broken: KeyValueStore = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("quota");
      },
      removeItem: () => {
        throw new Error("denied");
      },
    };
    expect(loadProgress(broken)).toEqual(defaultProgress());
    expect(saveProgress(defaultProgress(), broken)).toBe(false);
    expect(resetProgress(broken)).toEqual(defaultProgress());
  });

  it("validates and repairs field values", () => {
    const p = validateProgress({
      version: 1,
      stats: {
        gamesPlayed: -4,
        questionsAnswered: 30,
        correctAnswers: 99,
        highestScore: "lots",
        longestStreak: 3.7,
        byCategory: { bible: 3, hacked: 9 },
        byDifficulty: { easy: 2, impossible: 5 },
        subcategoriesCompleted: ["old-testament", "old-testament", 5],
      },
      achievements: { "first-steps": "2026-01-01T00:00:00.000Z", "fake-one": "2026-01-01", "on-a-roll": "not a date" },
      quilt: [{ roundId: "a", subcategory: "x", difficulty: "easy", patches: ["c", "w", "z"] }],
    });
    expect(p.stats.gamesPlayed).toBe(0);
    expect(p.stats.correctAnswers).toBe(30);
    expect(p.stats.highestScore).toBe(0);
    expect(p.stats.longestStreak).toBe(3);
    expect(p.stats.byCategory).toEqual({ bible: 3 });
    expect(p.stats.byDifficulty).toEqual({ easy: 2, medium: 0, hard: 0 });
    expect(p.stats.subcategoriesCompleted).toEqual(["old-testament"]);
    expect(Object.keys(p.achievements)).toEqual(["first-steps"]);
    expect(p.quilt).toEqual([]);
  });

  it("migrates a pre-versioned shape", () => {
    const p = validateProgress({ gamesPlayed: 3, questionsAnswered: 30, correctAnswers: 20 });
    expect(p.version).toBe(1);
    expect(p.stats.gamesPlayed).toBe(3);
    expect(p.stats.correctAnswers).toBe(20);
  });

  it("round-trips through save and load, and reset clears progress", () => {
    const store = memStore();
    const { progress } = applyRound(defaultProgress(), summary());
    saveProgress(progress, store);
    expect(loadProgress(store)).toEqual(progress);
    resetProgress(store);
    expect(store.data.has(PROGRESS_KEY)).toBe(false);
    expect(loadProgress(store)).toEqual(defaultProgress());
  });
});

describe("progress & achievements", () => {
  it("applies a round to stats", () => {
    const { progress, unlocked } = applyRound(defaultProgress(), summary());
    expect(progress.stats).toMatchObject({
      gamesPlayed: 1,
      questionsAnswered: 10,
      correctAnswers: 7,
      highestScore: 900,
      longestStreak: 7,
      bibleCorrect: 7,
      byCategory: { bible: 1 },
      byDifficulty: { easy: 1, medium: 0, hard: 0 },
    });
    expect(progress.quilt[0].patches).toEqual(["c", "c", "c", "c", "c", "c", "c", "w", "w", "w"]);
    expect(unlocked).toEqual(["first-steps", "on-a-roll"]);
    expect(progress.achievements["first-steps"]).toBe("2026-10-20T10:00:00.000Z");
  });

  it("is idempotent for the same round id", () => {
    const once = applyRound(defaultProgress(), summary()).progress;
    const twice = applyRound(once, summary());
    expect(twice.progress).toBe(once);
    expect(twice.unlocked).toEqual([]);
  });

  it("unlocks Getting Started at 10 correct answers across rounds", () => {
    let p = applyRound(defaultProgress(), summary({ roundId: "a", correctCount: 6, bestStreak: 2 })).progress;
    expect(p.achievements["getting-started"]).toBeUndefined();
    p = applyRound(p, summary({ roundId: "b", correctCount: 4, bestStreak: 2 })).progress;
    expect(p.achievements["getting-started"]).toBeDefined();
  });

  it("unlocks Perfect Round only for 10/10", () => {
    const nine = applyRound(defaultProgress(), summary({ correctCount: 9 })).progress;
    expect(nine.achievements["perfect-round"]).toBeUndefined();
    const ten = applyRound(defaultProgress(), summary({ correctCount: 10 })).progress;
    expect(ten.achievements["perfect-round"]).toBeDefined();
  });

  it("unlocks Bible Explorer after three distinct subcategories", () => {
    let p = defaultProgress();
    const subs = ["old-testament", "old-testament", "miracles", "who-said-it"];
    subs.forEach((sub, i) => {
      p = applyRound(p, summary({ roundId: `r${i}`, config: { category: "bible", subcategory: sub, difficulty: "easy", mode: "classic" } })).progress;
      if (i < 3) expect(p.achievements["bible-explorer"]).toBeUndefined();
    });
    expect(p.achievements["bible-explorer"]).toBeDefined();
  });

  it("unlocks Quick Thinker for a finished timed round", () => {
    const p = applyRound(
      defaultProgress(),
      summary({ config: { category: "bible", subcategory: "mixed", difficulty: "hard", mode: "timed" } }),
    ).progress;
    expect(p.achievements["quick-thinker"]).toBeDefined();
    expect(p.stats.byMode.timed).toBe(1);
  });

  it("unlocks Dedicated Learner at 10 games and Bible Scholar at 100 correct", () => {
    let p = defaultProgress();
    for (let i = 0; i < 10; i++) p = applyRound(p, summary({ roundId: `g${i}`, correctCount: 10 })).progress;
    expect(p.achievements["dedicated-learner"]).toBeDefined();
    expect(p.stats.bibleCorrect).toBe(100);
    expect(p.achievements["bible-scholar"]).toBeDefined();
    expect(newlyUnlocked(p)).toEqual([]);
  });

  it("unlocks On a Roll live, mid-round, exactly once", () => {
    const early = unlockLiveStreak(defaultProgress(), 4, "t");
    expect(early.unlocked).toEqual([]);
    const hit = unlockLiveStreak(defaultProgress(), 5, "t");
    expect(hit.unlocked).toEqual(["on-a-roll"]);
    expect(unlockLiveStreak(hit.progress, 6, "t2").unlocked).toEqual([]);
  });
});
