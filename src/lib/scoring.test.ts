import { accuracyOf, addScore, BASE_POINTS, resultTitle, scoreAnswer, streakBonus, timeBonus } from "./scoring";

describe("scoring", () => {
  it("awards base points by difficulty", () => {
    expect(BASE_POINTS).toEqual({ easy: 100, medium: 150, hard: 200 });
    expect(scoreAnswer({ correct: true, difficulty: "medium", streak: 1, mode: "classic", secondsLeft: null })).toEqual({
      base: 150,
      streak: 0,
      time: 0,
      total: 150,
    });
  });

  it("streak bonus starts at 2 and grows by 10, capped at 100", () => {
    expect(streakBonus(0)).toBe(0);
    expect(streakBonus(1)).toBe(0);
    expect(streakBonus(2)).toBe(20);
    expect(streakBonus(3)).toBe(30);
    expect(streakBonus(4)).toBe(40);
    expect(streakBonus(9)).toBe(90);
    expect(streakBonus(10)).toBe(100);
    expect(streakBonus(25)).toBe(100);
  });

  it("time bonus scales with seconds left, 0–50", () => {
    expect(timeBonus(20)).toBe(50);
    expect(timeBonus(10)).toBe(25);
    expect(timeBonus(0)).toBe(0);
    expect(timeBonus(-3)).toBe(0);
    expect(timeBonus(99)).toBe(50);
    expect(timeBonus(Number.NaN)).toBe(0);
  });

  it("time bonus only applies in timed mode", () => {
    const classic = scoreAnswer({ correct: true, difficulty: "easy", streak: 1, mode: "classic", secondsLeft: 20 });
    const timed = scoreAnswer({ correct: true, difficulty: "easy", streak: 1, mode: "timed", secondsLeft: 20 });
    expect(classic.time).toBe(0);
    expect(timed.time).toBe(50);
    expect(timed.total).toBe(150);
  });

  it("combines base, streak and time deterministically", () => {
    expect(scoreAnswer({ correct: true, difficulty: "hard", streak: 4, mode: "timed", secondsLeft: 8 })).toEqual({
      base: 200,
      streak: 40,
      time: 20,
      total: 260,
    });
  });

  it("wrong answers and timeouts earn nothing", () => {
    expect(scoreAnswer({ correct: false, difficulty: "hard", streak: 0, mode: "timed", secondsLeft: 15 }).total).toBe(0);
    expect(scoreAnswer({ correct: false, difficulty: "easy", streak: 0, mode: "timed", secondsLeft: null }).total).toBe(0);
  });

  it("score never goes negative", () => {
    expect(addScore(0, -100)).toBe(0);
    expect(addScore(50, -100)).toBe(50);
    expect(addScore(50, 100)).toBe(150);
  });

  it("gives an encouraging title for every accuracy band", () => {
    expect(resultTitle(0).title).toBe("Curious Explorer");
    expect(resultTitle(39).title).toBe("Curious Explorer");
    expect(resultTitle(40).title).toBe("Growing Learner");
    expect(resultTitle(60).title).toBe("Knowledge Seeker");
    expect(resultTitle(80).title).toBe("Wisdom Keeper");
    expect(resultTitle(99).title).toBe("Wisdom Keeper");
    expect(resultTitle(100).title).toBe("Brain Quest Champion");
    expect(accuracyOf(7, 10)).toBe(70);
    expect(accuracyOf(0, 0)).toBe(0);
  });
});
