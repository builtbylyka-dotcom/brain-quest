import type { AnswerRecord, GameMode, RoundConfig, RoundQuestion, RoundSummary, Screen } from "@/types/game";
import type { CategoryId, Difficulty } from "@/types/questions";
import { HINTS_PER_ROUND } from "./hints";
import { addScore, scoreAnswer } from "./scoring";

export type RoundState = {
  id: string;
  config: RoundConfig;
  questions: RoundQuestion[];
  index: number;
  answers: AnswerRecord[];
  score: number;
  streak: number;
  bestStreak: number;
  hintsLeft: number;
  /** Option indices hidden by a hint on the current question. */
  hidden: number[];
};

export type Draft = {
  category: CategoryId | null;
  subcategory: string | null;
  difficulty: Difficulty;
  mode: GameMode;
};

export type GameState = {
  screen: Screen;
  draft: Draft;
  round: RoundState | null;
  summary: RoundSummary | null;
};

export type GameAction =
  | { type: "NAVIGATE"; screen: "HOME" | "CATEGORY_SELECTION" | "ACHIEVEMENTS" | "STATISTICS" }
  | { type: "SELECT_CATEGORY"; category: CategoryId }
  | { type: "SELECT_SUBCATEGORY"; subcategory: string }
  | { type: "BACK_TO_SUBCATEGORIES" }
  | { type: "SET_DIFFICULTY"; difficulty: Difficulty }
  | { type: "SET_MODE"; mode: GameMode }
  | { type: "START_ROUND"; roundId: string; questions: RoundQuestion[] }
  | { type: "ANSWER"; index: number; secondsLeft: number | null }
  | { type: "TIMEOUT" }
  | { type: "USE_HINT"; removed: number[] }
  | { type: "NEXT"; completedAt: string }
  | { type: "EXIT_ROUND" };

export const initialGameState: GameState = {
  screen: "HOME",
  draft: { category: null, subcategory: null, difficulty: "easy", mode: "classic" },
  round: null,
  summary: null,
};

export function currentQuestion(round: RoundState | null): RoundQuestion | null {
  if (!round) return null;
  return round.questions[round.index] ?? null;
}

function resolveAnswer(state: GameState, selectedIndex: number | null, secondsLeft: number | null): GameState {
  const round = state.round;
  const q = currentQuestion(round);
  if (!round || !q || state.screen !== "PLAYING") return state;
  // One answer per question, ever.
  if (round.answers.length > round.index) return state;
  if (selectedIndex !== null && (selectedIndex < 0 || selectedIndex >= q.options.length)) return state;
  if (selectedIndex !== null && round.hidden.includes(selectedIndex)) return state;

  const correct = selectedIndex !== null && selectedIndex === q.correctIndex;
  const streak = correct ? round.streak + 1 : 0;
  const points = scoreAnswer({
    correct,
    difficulty: q.source.difficulty,
    streak,
    mode: round.config.mode,
    secondsLeft,
  });
  const record: AnswerRecord = {
    questionId: q.source.id,
    selectedIndex,
    correct,
    points,
    secondsLeft: round.config.mode === "timed" ? secondsLeft : null,
  };
  return {
    ...state,
    screen: "ANSWER_FEEDBACK",
    round: {
      ...round,
      answers: [...round.answers, record],
      score: addScore(round.score, points.total),
      streak,
      bestStreak: Math.max(round.bestStreak, streak),
    },
  };
}

export function summarize(round: RoundState, completedAt: string): RoundSummary {
  const correct = round.answers.filter((a) => a.correct).length;
  return {
    roundId: round.id,
    config: round.config,
    total: round.questions.length,
    correct,
    incorrect: round.answers.length - correct,
    score: round.score,
    bestStreak: round.bestStreak,
    answers: round.answers,
    completedAt,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "NAVIGATE":
      return { ...state, screen: action.screen, round: null };

    case "SELECT_CATEGORY":
      return {
        ...state,
        screen: "SUBCATEGORY_SELECTION",
        draft: { ...state.draft, category: action.category, subcategory: null },
      };

    case "SELECT_SUBCATEGORY":
      if (!state.draft.category) return state;
      return { ...state, screen: "SETUP", draft: { ...state.draft, subcategory: action.subcategory } };

    case "BACK_TO_SUBCATEGORIES":
      return state.draft.category ? { ...state, screen: "SUBCATEGORY_SELECTION", round: null } : state;

    case "SET_DIFFICULTY":
      return { ...state, draft: { ...state.draft, difficulty: action.difficulty } };

    case "SET_MODE":
      return { ...state, draft: { ...state.draft, mode: action.mode } };

    case "START_ROUND": {
      const { category, subcategory, difficulty, mode } = state.draft;
      if (!category || !subcategory || action.questions.length === 0) return state;
      return {
        ...state,
        screen: "PLAYING",
        summary: null,
        round: {
          id: action.roundId,
          config: { category, subcategory, difficulty, mode },
          questions: action.questions,
          index: 0,
          answers: [],
          score: 0,
          streak: 0,
          bestStreak: 0,
          hintsLeft: HINTS_PER_ROUND,
          hidden: [],
        },
      };
    }

    case "ANSWER":
      return resolveAnswer(state, action.index, action.secondsLeft);

    case "TIMEOUT":
      if (state.round?.config.mode !== "timed") return state;
      return resolveAnswer(state, null, 0);

    case "USE_HINT": {
      const round = state.round;
      const q = currentQuestion(round);
      if (!round || !q || state.screen !== "PLAYING") return state;
      if (round.hintsLeft <= 0 || round.hidden.length > 0) return state;
      const removed = [...new Set(action.removed)];
      const valid =
        removed.length === 2 && removed.every((i) => i !== q.correctIndex && i >= 0 && i < q.options.length);
      if (!valid) return state;
      return { ...state, round: { ...round, hintsLeft: round.hintsLeft - 1, hidden: removed } };
    }

    case "NEXT": {
      const round = state.round;
      if (!round || state.screen !== "ANSWER_FEEDBACK") return state;
      const isLast = round.index >= round.questions.length - 1;
      if (isLast) {
        return { ...state, screen: "RESULTS", summary: summarize(round, action.completedAt), round: null };
      }
      return { ...state, screen: "PLAYING", round: { ...round, index: round.index + 1, hidden: [] } };
    }

    case "EXIT_ROUND":
      return { ...state, screen: state.draft.category ? "SETUP" : "HOME", round: null };

    default:
      return state;
  }
}
