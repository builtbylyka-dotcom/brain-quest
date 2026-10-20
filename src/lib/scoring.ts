import type { GameMode, PointsBreakdown } from "@/types/game";
import type { Difficulty } from "@/types/questions";

export const BASE_POINTS: Record<Difficulty, number> = { easy: 100, medium: 150, hard: 200 };
export const SECONDS_PER_QUESTION = 20;
export const MAX_TIME_BONUS = 50;
export const MAX_STREAK_BONUS = 100;

/** Bonus for a correct answer that brings the streak to `streak`: 2 → 20, 3 → 30, … capped at 100. */
export function streakBonus(streak: number): number {
  if (!Number.isFinite(streak) || streak < 2) return 0;
  return Math.min(Math.floor(streak) * 10, MAX_STREAK_BONUS);
}

/** Up to 50 points, proportional to the time remaining when answering correctly. */
export function timeBonus(secondsLeft: number, limit = SECONDS_PER_QUESTION): number {
  if (!Number.isFinite(secondsLeft) || limit <= 0) return 0;
  const ratio = Math.min(Math.max(secondsLeft / limit, 0), 1);
  return Math.round(MAX_TIME_BONUS * ratio);
}

export type ScoreInput = {
  correct: boolean;
  difficulty: Difficulty;
  /** The streak after this answer (only meaningful when correct). */
  streak: number;
  mode: GameMode;
  secondsLeft: number | null;
};

export const ZERO_POINTS: PointsBreakdown = { base: 0, streak: 0, time: 0, total: 0 };

export function scoreAnswer({ correct, difficulty, streak, mode, secondsLeft }: ScoreInput): PointsBreakdown {
  if (!correct) return ZERO_POINTS;
  const base = BASE_POINTS[difficulty];
  const streakPts = streakBonus(streak);
  const time = mode === "timed" && secondsLeft !== null ? timeBonus(secondsLeft) : 0;
  return { base, streak: streakPts, time, total: base + streakPts + time };
}

/** Score never drops below zero, whatever is added. */
export function addScore(score: number, points: number): number {
  return Math.max(0, score + Math.max(0, points));
}

export type ResultTitle = { title: string; message: string };

export function resultTitle(accuracy: number): ResultTitle {
  if (accuracy >= 100)
    return { title: "Brain Quest Champion", message: "A flawless round. Every single patch sewn true." };
  if (accuracy >= 80)
    return { title: "Wisdom Keeper", message: "You really know your stuff. One more round for a perfect row?" };
  if (accuracy >= 60)
    return { title: "Knowledge Seeker", message: "A strong round, and a few new things learned along the way." };
  if (accuracy >= 40)
    return { title: "Growing Learner", message: "Every answer you check is one you'll remember next time." };
  return { title: "Curious Explorer", message: "Every quest starts somewhere. The explanations are where the learning happens." };
}

export function accuracyOf(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 100);
}
