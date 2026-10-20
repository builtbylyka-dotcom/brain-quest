import { BIBLE_QUESTIONS } from "@/data/bibleQuestions";
import type { Question } from "@/types/questions";
import { buildRound, filterPool, poolSize, seededRng, shuffle, shuffleOptions } from "./questionSelector";

const base = { category: "bible" as const, mode: "classic" as const };

describe("question selection", () => {
  it("shuffle returns a permutation without mutating the input", () => {
    const input = [1, 2, 3, 4, 5, 6];
    const out = shuffle(input, seededRng(7));
    expect(input).toEqual([1, 2, 3, 4, 5, 6]);
    expect([...out].sort()).toEqual(input);
  });

  it("builds a 10-question round with no duplicates", () => {
    for (let seed = 1; seed <= 50; seed++) {
      const round = buildRound(BIBLE_QUESTIONS, { ...base, subcategory: "old-testament", difficulty: "easy" }, { rng: seededRng(seed) });
      expect(round).toHaveLength(10);
      expect(new Set(round.map((q) => q.source.id)).size).toBe(10);
    }
  });

  it("respects subcategory and difficulty exactly", () => {
    const round = buildRound(BIBLE_QUESTIONS, { ...base, subcategory: "who-said-it", difficulty: "hard" });
    expect(round.every((q) => q.source.subcategory === "who-said-it" && q.source.difficulty === "hard")).toBe(true);
  });

  it("randomizes question order between rounds", () => {
    const cfg = { ...base, subcategory: "miracles", difficulty: "medium" as const };
    const a = buildRound(BIBLE_QUESTIONS, cfg, { rng: seededRng(1) }).map((q) => q.source.id).join();
    const b = buildRound(BIBLE_QUESTIONS, cfg, { rng: seededRng(2) }).map((q) => q.source.id).join();
    expect(a).not.toBe(b);
  });

  it("mixed rounds draw evenly across subcategories at one difficulty, without repeats", () => {
    for (let seed = 1; seed <= 50; seed++) {
      const round = buildRound(BIBLE_QUESTIONS, { ...base, subcategory: "mixed", difficulty: "medium" }, { rng: seededRng(seed) });
      expect(round).toHaveLength(10);
      expect(new Set(round.map((q) => q.source.id)).size).toBe(10);
      expect(round.every((q) => q.source.difficulty === "medium")).toBe(true);
      const perSub = new Map<string, number>();
      for (const q of round) perSub.set(q.source.subcategory, (perSub.get(q.source.subcategory) ?? 0) + 1);
      // 10 questions over 7 subcategories: every subcategory appears, none more than twice.
      expect(perSub.size).toBe(7);
      expect(Math.max(...perSub.values())).toBeLessThanOrEqual(2);
    }
  });

  it("shuffling options always preserves the correct answer", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const rng = seededRng(seed);
      for (const q of BIBLE_QUESTIONS.slice(0, 30)) {
        const played = shuffleOptions(q, rng);
        expect(played.options[played.correctIndex]).toBe(q.options[q.correctAnswerIndex]);
        expect([...played.options].sort()).toEqual([...q.options].sort());
      }
    }
  });

  it("handles small pools with a shorter round, never borrowing from other filters", () => {
    const tiny: Question[] = BIBLE_QUESTIONS.filter((q) => q.subcategory === "characters" && q.difficulty === "easy").slice(0, 4);
    const mixedIn = [...tiny, ...BIBLE_QUESTIONS.filter((q) => q.difficulty === "hard")];
    const cfg = { ...base, subcategory: "characters", difficulty: "easy" as const };
    expect(poolSize(mixedIn, cfg)).toBe(4);
    const round = buildRound(mixedIn, cfg);
    expect(round).toHaveLength(4);
    expect(round.every((q) => q.source.difficulty === "easy" && q.source.subcategory === "characters")).toBe(true);
  });

  it("returns an empty round for an empty pool instead of throwing", () => {
    expect(buildRound([], { ...base, subcategory: "old-testament", difficulty: "easy" })).toEqual([]);
    expect(filterPool(BIBLE_QUESTIONS, { category: "science", subcategory: "mixed", difficulty: "easy" })).toEqual([]);
  });
});
