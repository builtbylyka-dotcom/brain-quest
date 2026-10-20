import type { CategoryId, Difficulty, Question } from "./questions";

export type GameMode = "classic" | "timed";

export type Screen =
  | "HOME"
  | "CATEGORY_SELECTION"
  | "SUBCATEGORY_SELECTION"
  | "SETUP"
  | "PLAYING"
  | "ANSWER_FEEDBACK"
  | "RESULTS"
  | "ACHIEVEMENTS"
  | "STATISTICS";

export type RoundConfig = {
  category: CategoryId;
  /** A subcategory id, or "mixed" to draw from every subcategory of the category. */
  subcategory: string;
  difficulty: Difficulty;
  mode: GameMode;
};

/** A question as it is played: options shuffled, correct index remapped. */
export type RoundQuestion = {
  source: Question;
  options: [string, string, string, string];
  correctIndex: number;
};

export type PointsBreakdown = {
  base: number;
  streak: number;
  time: number;
  total: number;
};

export type AnswerRecord = {
  questionId: string;
  /** null when the timer ran out */
  selectedIndex: number | null;
  correct: boolean;
  points: PointsBreakdown;
  secondsLeft: number | null;
};

export type RoundSummary = {
  roundId: string;
  config: RoundConfig;
  total: number;
  correct: number;
  incorrect: number;
  score: number;
  bestStreak: number;
  answers: AnswerRecord[];
  completedAt: string;
};
