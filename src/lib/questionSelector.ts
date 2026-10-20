import type { RoundConfig, RoundQuestion } from "@/types/game";
import type { Question } from "@/types/questions";

export type Rng = () => number;

export const ROUND_SIZE = 10;
export const MIXED = "mixed";

/** Fisher–Yates on a copy. */
export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Questions matching category + difficulty, and subcategory unless "mixed". Never widens the filter. */
export function filterPool(bank: readonly Question[], config: Pick<RoundConfig, "category" | "subcategory" | "difficulty">) {
  return bank.filter(
    (q) =>
      q.category === config.category &&
      q.difficulty === config.difficulty &&
      (config.subcategory === MIXED || q.subcategory === config.subcategory),
  );
}

export function poolSize(bank: readonly Question[], config: Pick<RoundConfig, "category" | "subcategory" | "difficulty">) {
  return filterPool(bank, config).length;
}

export function shuffleOptions(question: Question, rng: Rng = Math.random): RoundQuestion {
  const order = shuffle([0, 1, 2, 3], rng);
  return {
    source: question,
    options: order.map((i) => question.options[i]) as RoundQuestion["options"],
    correctIndex: order.indexOf(question.correctAnswerIndex),
  };
}

/** Round-robin across subcategories so a mixed round is evenly spread. */
function pickMixed(pool: readonly Question[], size: number, rng: Rng): Question[] {
  const groups = new Map<string, Question[]>();
  for (const q of pool) {
    const list = groups.get(q.subcategory) ?? [];
    list.push(q);
    groups.set(q.subcategory, list);
  }
  const queues = shuffle([...groups.values()], rng).map((g) => shuffle(g, rng));
  const picked: Question[] = [];
  while (picked.length < size && queues.some((q) => q.length > 0)) {
    for (const queue of queues) {
      const next = queue.shift();
      if (next) picked.push(next);
      if (picked.length === size) break;
    }
  }
  // Interleaving is predictable (A, B, C, A, B, C…); shuffle the final order too.
  return shuffle(picked, rng);
}

export function buildRound(
  bank: readonly Question[],
  config: RoundConfig,
  { size = ROUND_SIZE, rng = Math.random }: { size?: number; rng?: Rng } = {},
): RoundQuestion[] {
  const pool = filterPool(bank, config);
  const chosen = config.subcategory === MIXED ? pickMixed(pool, size, rng) : shuffle(pool, rng).slice(0, size);
  return chosen.map((q) => shuffleOptions(q, rng));
}

/** Small deterministic PRNG for tests and reproducible rounds. */
export function seededRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
