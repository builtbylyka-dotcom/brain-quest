import { ACHIEVEMENT_IDS, type AchievementId } from "@/data/achievements";
import type { RoundSummary } from "@/types/game";
import { QUILT_ROWS_KEPT, type Progress, type QuiltRow } from "./storage";

type Rule = (p: Progress, round: RoundSummary | null) => boolean;

/** Each rule reads the progress *after* a round has been applied. */
export const ACHIEVEMENT_RULES: Record<AchievementId, Rule> = {
  "first-steps": (p) => p.stats.gamesPlayed >= 1,
  "getting-started": (p) => p.stats.correctAnswers >= 10,
  "on-a-roll": (p) => p.stats.longestStreak >= 5,
  "perfect-round": (p) => p.stats.perfectRounds >= 1,
  "bible-explorer": (p) => p.stats.subcategoriesCompleted.length >= 3,
  "quick-thinker": (p) => p.stats.timedRoundsCompleted >= 1,
  "dedicated-learner": (p) => p.stats.gamesPlayed >= 10,
  "bible-scholar": (p) => p.stats.bibleCorrect >= 100,
};

/** Ids that the rules now satisfy but that are not yet unlocked. */
export function newlyUnlocked(progress: Progress, round: RoundSummary | null = null): AchievementId[] {
  return ACHIEVEMENT_IDS.filter((id) => !progress.achievements[id] && ACHIEVEMENT_RULES[id](progress, round));
}

export function unlock(progress: Progress, ids: AchievementId[], at: string): Progress {
  if (ids.length === 0) return progress;
  const achievements = { ...progress.achievements };
  for (const id of ids) if (!achievements[id]) achievements[id] = at;
  return { ...progress, achievements };
}

/** Mid-round check: a live streak of 5 unlocks "On a Roll" without waiting for the round to end. */
export function unlockLiveStreak(progress: Progress, streak: number, at: string): { progress: Progress; unlocked: AchievementId[] } {
  if (streak < 5 || progress.achievements["on-a-roll"]) return { progress, unlocked: [] };
  const next = unlock(progress, ["on-a-roll"], at);
  return {
    progress: { ...next, stats: { ...next.stats, longestStreak: Math.max(next.stats.longestStreak, streak) } },
    unlocked: ["on-a-roll"],
  };
}

/**
 * Fold a finished round into progress. Pure and idempotent: applying the same
 * round twice changes nothing the second time.
 */
export function applyRound(progress: Progress, round: RoundSummary): { progress: Progress; unlocked: AchievementId[] } {
  if (progress.lastRoundId === round.roundId) return { progress, unlocked: [] };
  const { config } = round;
  const s = progress.stats;
  const isBible = config.category === "bible";
  const answered = round.answers.length;

  const subs =
    isBible && !s.subcategoriesCompleted.includes(config.subcategory)
      ? [...s.subcategoriesCompleted, config.subcategory]
      : s.subcategoriesCompleted;

  const row: QuiltRow = {
    roundId: round.roundId,
    subcategory: config.subcategory,
    difficulty: config.difficulty,
    patches: round.answers.map((a) => (a.correct ? "c" : a.selectedIndex === null ? "t" : "w")),
  };

  const next: Progress = {
    ...progress,
    lastRoundId: round.roundId,
    quilt: [...progress.quilt, row].slice(-QUILT_ROWS_KEPT),
    stats: {
      ...s,
      gamesPlayed: s.gamesPlayed + 1,
      questionsAnswered: s.questionsAnswered + answered,
      correctAnswers: s.correctAnswers + round.correct,
      highestScore: Math.max(s.highestScore, round.score),
      longestStreak: Math.max(s.longestStreak, round.bestStreak),
      bibleCorrect: s.bibleCorrect + (isBible ? round.correct : 0),
      perfectRounds: s.perfectRounds + (round.total >= 10 && round.correct === round.total ? 1 : 0),
      timedRoundsCompleted: s.timedRoundsCompleted + (config.mode === "timed" ? 1 : 0),
      byCategory: { ...s.byCategory, [config.category]: (s.byCategory[config.category] ?? 0) + 1 },
      byDifficulty: { ...s.byDifficulty, [config.difficulty]: s.byDifficulty[config.difficulty] + 1 },
      byMode: { ...s.byMode, [config.mode]: s.byMode[config.mode] + 1 },
      subcategoriesCompleted: subs,
    },
  };

  const unlocked = newlyUnlocked(next, round);
  return { progress: unlock(next, unlocked, round.completedAt), unlocked };
}
