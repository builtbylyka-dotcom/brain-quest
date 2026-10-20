import { useCallback, useEffect, useReducer, useRef } from "react";
import { QUESTION_BANK } from "@/data/questionBank";
import { currentQuestion, gameReducer, initialGameState, type GameAction } from "@/lib/gameEngine";
import { pickHintRemovals } from "@/lib/hints";
import { buildRound } from "@/lib/questionSelector";
import { playSound } from "@/lib/sound";
import { makeRoundId } from "@/lib/utils";
import type { GameMode } from "@/types/game";
import type { CategoryId, Difficulty } from "@/types/questions";
import { useProgress } from "./useProgress";

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const { commitRound, noteStreak, settings } = useProgress();
  const sound = settings.sound;
  const committed = useRef<string | null>(null);

  // Commit each finished round exactly once (guarded here and by round id in storage).
  useEffect(() => {
    const s = state.summary;
    if (state.screen !== "RESULTS" || !s || committed.current === s.roundId) return;
    committed.current = s.roundId;
    const unlocked = commitRound(s);
    if (unlocked.length) playSound("achievement", sound);
  }, [state.screen, state.summary, commitRound, sound]);

  // "On a Roll" unlocks live, without interrupting play.
  const streak = state.round?.streak ?? 0;
  useEffect(() => {
    if (streak >= 5 && noteStreak(streak).length) playSound("achievement", sound);
  }, [streak, noteStreak, sound]);

  const go = useCallback(
    (screen: Extract<GameAction, { type: "NAVIGATE" }>["screen"]) => dispatch({ type: "NAVIGATE", screen }),
    [],
  );

  const startRound = useCallback(() => {
    const { category, subcategory, difficulty, mode } = state.draft;
    if (!category || !subcategory) return;
    const questions = buildRound(QUESTION_BANK, { category, subcategory, difficulty, mode });
    dispatch({ type: "START_ROUND", roundId: makeRoundId(), questions });
  }, [state.draft]);

  const answer = useCallback(
    (index: number, secondsLeft: number | null) => {
      const q = currentQuestion(state.round);
      if (!q || state.screen !== "PLAYING") return;
      playSound(index === q.correctIndex ? "correct" : "wrong", sound);
      dispatch({ type: "ANSWER", index, secondsLeft });
    },
    [state.round, state.screen, sound],
  );

  const timeout = useCallback(() => {
    playSound("wrong", sound);
    dispatch({ type: "TIMEOUT" });
  }, [sound]);

  const useHint = useCallback(() => {
    const q = currentQuestion(state.round);
    if (!q || !state.round || state.round.hintsLeft <= 0 || state.round.hidden.length > 0) return;
    playSound("hint", sound);
    dispatch({ type: "USE_HINT", removed: pickHintRemovals(q.correctIndex, q.options.length) });
  }, [state.round, sound]);

  const next = useCallback(() => dispatch({ type: "NEXT", completedAt: new Date().toISOString() }), []);

  return {
    state,
    go,
    selectCategory: (category: CategoryId) => dispatch({ type: "SELECT_CATEGORY", category }),
    selectSubcategory: (subcategory: string) => dispatch({ type: "SELECT_SUBCATEGORY", subcategory }),
    backToSubcategories: () => dispatch({ type: "BACK_TO_SUBCATEGORIES" }),
    setDifficulty: (difficulty: Difficulty) => dispatch({ type: "SET_DIFFICULTY", difficulty }),
    setMode: (mode: GameMode) => dispatch({ type: "SET_MODE", mode }),
    startRound,
    answer,
    timeout,
    useHint,
    next,
    exitRound: () => dispatch({ type: "EXIT_ROUND" }),
  };
}

export type GameApi = ReturnType<typeof useGame>;
