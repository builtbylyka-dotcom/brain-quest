import { shuffle, type Rng } from "./questionSelector";

export const HINTS_PER_ROUND = 2;

/** Two incorrect option indices to hide. Never includes the correct index. */
export function pickHintRemovals(correctIndex: number, optionCount = 4, rng: Rng = Math.random): number[] {
  const wrong = Array.from({ length: optionCount }, (_, i) => i).filter((i) => i !== correctIndex);
  return shuffle(wrong, rng).slice(0, 2).sort((a, b) => a - b);
}
