import { BIBLE_QUESTIONS } from "@/data/bibleQuestions";
import { gameReducer, initialGameState, type GameAction, type GameState } from "./gameEngine";
import { pickHintRemovals } from "./hints";
import { buildRound, seededRng } from "./questionSelector";

const run = (state: GameState, ...actions: GameAction[]) => actions.reduce(gameReducer, state);

function startRound(mode: "classic" | "timed" = "classic", seed = 1) {
  const questions = buildRound(
    BIBLE_QUESTIONS,
    { category: "bible", subcategory: "old-testament", difficulty: "easy", mode },
    { rng: seededRng(seed) },
  );
  return run(
    initialGameState,
    { type: "NAVIGATE", screen: "CATEGORY_SELECTION" },
    { type: "SELECT_CATEGORY", category: "bible" },
    { type: "SELECT_SUBCATEGORY", subcategory: "old-testament" },
    { type: "SET_DIFFICULTY", difficulty: "easy" },
    { type: "SET_MODE", mode },
    { type: "START_ROUND", roundId: "round-1", questions },
  );
}

const correctOf = (s: GameState) => s.round!.questions[s.round!.index].correctIndex;
const wrongOf = (s: GameState) => (correctOf(s) + 1) % 4;

describe("game engine", () => {
  it("walks through selection into play", () => {
    const s = startRound();
    expect(s.screen).toBe("PLAYING");
    expect(s.round?.questions).toHaveLength(10);
    expect(s.round?.hintsLeft).toBe(2);
  });

  it("validates the correct answer and scores it", () => {
    let s = startRound();
    s = gameReducer(s, { type: "ANSWER", index: correctOf(s), secondsLeft: null });
    expect(s.screen).toBe("ANSWER_FEEDBACK");
    expect(s.round?.answers[0].correct).toBe(true);
    expect(s.round?.score).toBe(100);
    expect(s.round?.streak).toBe(1);
  });

  it("ignores a second answer to the same question (no double scoring)", () => {
    let s = startRound();
    s = gameReducer(s, { type: "ANSWER", index: correctOf(s), secondsLeft: null });
    const again = gameReducer(s, { type: "ANSWER", index: correctOf(s), secondsLeft: null });
    expect(again).toBe(s);
    expect(again.round?.answers).toHaveLength(1);
  });

  it("a wrong answer earns 0 and resets the streak", () => {
    let s = startRound();
    s = run(s, { type: "ANSWER", index: correctOf(s), secondsLeft: null }, { type: "NEXT", completedAt: "x" });
    s = run(s, { type: "ANSWER", index: correctOf(s), secondsLeft: null }, { type: "NEXT", completedAt: "x" });
    expect(s.round?.streak).toBe(2);
    expect(s.round?.score).toBe(100 + 120);
    s = gameReducer(s, { type: "ANSWER", index: wrongOf(s), secondsLeft: null });
    expect(s.round?.streak).toBe(0);
    expect(s.round?.bestStreak).toBe(2);
    expect(s.round?.score).toBe(220);
  });

  it("NEXT only works after answering, so questions cannot be skipped", () => {
    const s = startRound();
    expect(gameReducer(s, { type: "NEXT", completedAt: "x" })).toBe(s);
  });

  it("timeouts count as incorrect in timed mode and are ignored in classic", () => {
    const classic = startRound("classic");
    expect(gameReducer(classic, { type: "TIMEOUT" })).toBe(classic);
    const timed = gameReducer(startRound("timed"), { type: "TIMEOUT" });
    expect(timed.screen).toBe("ANSWER_FEEDBACK");
    expect(timed.round?.answers[0]).toMatchObject({ selectedIndex: null, correct: false, points: { total: 0 } });
  });

  it("an answer after a timeout is ignored", () => {
    const s = gameReducer(startRound("timed"), { type: "TIMEOUT" });
    expect(gameReducer(s, { type: "ANSWER", index: 0, secondsLeft: 3 })).toBe(s);
  });

  it("adds a time bonus for fast correct answers in timed mode", () => {
    let s = startRound("timed");
    s = gameReducer(s, { type: "ANSWER", index: correctOf(s), secondsLeft: 20 });
    expect(s.round?.answers[0].points).toEqual({ base: 100, streak: 0, time: 50, total: 150 });
  });

  it("finishes after the last question with an accurate summary", () => {
    let s = startRound();
    for (let i = 0; i < 10; i++) {
      const pick = i < 7 ? correctOf(s) : wrongOf(s);
      s = run(s, { type: "ANSWER", index: pick, secondsLeft: null }, { type: "NEXT", completedAt: "2026-01-01T00:00:00.000Z" });
    }
    expect(s.screen).toBe("RESULTS");
    expect(s.round).toBeNull();
    expect(s.summary).toMatchObject({ roundId: "round-1", total: 10, correct: 7, incorrect: 3, bestStreak: 7 });
    // 7 × 100 base + streak bonuses 20+30+40+50+60+70
    expect(s.summary?.score).toBe(700 + 270);
    // Further NEXTs do nothing
    expect(gameReducer(s, { type: "NEXT", completedAt: "y" })).toBe(s);
  });

  describe("hints", () => {
    it("removes two wrong answers, never the correct one", () => {
      for (let seed = 1; seed < 100; seed++) {
        const removed = pickHintRemovals(2, 4, seededRng(seed));
        expect(removed).toHaveLength(2);
        expect(removed).not.toContain(2);
      }
    });

    it("can be used once per question and twice per round", () => {
      let s = startRound();
      const c = correctOf(s);
      s = gameReducer(s, { type: "USE_HINT", removed: pickHintRemovals(c) });
      expect(s.round?.hintsLeft).toBe(1);
      expect(s.round?.hidden).toHaveLength(2);
      const again = gameReducer(s, { type: "USE_HINT", removed: pickHintRemovals(c) });
      expect(again).toBe(s);

      s = run(s, { type: "ANSWER", index: c, secondsLeft: null }, { type: "NEXT", completedAt: "x" });
      expect(s.round?.hidden).toEqual([]);
      s = gameReducer(s, { type: "USE_HINT", removed: pickHintRemovals(correctOf(s)) });
      expect(s.round?.hintsLeft).toBe(0);
      s = run(s, { type: "ANSWER", index: correctOf(s), secondsLeft: null }, { type: "NEXT", completedAt: "x" });
      expect(gameReducer(s, { type: "USE_HINT", removed: pickHintRemovals(correctOf(s)) })).toBe(s);
    });

    it("cannot be used after answering", () => {
      let s = startRound();
      s = gameReducer(s, { type: "ANSWER", index: correctOf(s), secondsLeft: null });
      expect(gameReducer(s, { type: "USE_HINT", removed: pickHintRemovals(correctOf(s)) })).toBe(s);
    });

    it("rejects a removal that would hide the correct answer", () => {
      const s = startRound();
      const c = correctOf(s);
      expect(gameReducer(s, { type: "USE_HINT", removed: [c, (c + 1) % 4] })).toBe(s);
    });

    it("hidden options cannot be selected", () => {
      let s = startRound();
      const removed = pickHintRemovals(correctOf(s));
      s = gameReducer(s, { type: "USE_HINT", removed });
      expect(gameReducer(s, { type: "ANSWER", index: removed[0], secondsLeft: null })).toBe(s);
    });
  });

  it("exiting a round discards it", () => {
    const s = gameReducer(startRound(), { type: "EXIT_ROUND" });
    expect(s.round).toBeNull();
    expect(s.screen).toBe("SETUP");
  });
});
