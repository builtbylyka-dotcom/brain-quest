import type { BibleQuestion, BibleQuestionSubcategory, Difficulty } from "@/types/questions";

/** [question, [correct, ...three distractors], explanation, reference] */
export type Entry = [string, [string, string, string, string], string, string];

/**
 * Turns authoring tuples into questions. Authors always write the correct
 * answer first; it is rotated into a varied slot here so the raw data is not
 * biased. Answer order is shuffled again at play time regardless.
 */
export function buildBank(
  prefix: string,
  subcategory: BibleQuestionSubcategory,
  entries: Record<Difficulty, Entry[]>,
): BibleQuestion[] {
  return (Object.keys(entries) as Difficulty[]).flatMap((difficulty) =>
    entries[difficulty].map(([question, [correct, ...wrong], explanation, reference], i) => {
      const slot = (i % 4) as 0 | 1 | 2 | 3;
      const options = [...wrong];
      options.splice(slot, 0, correct);
      return {
        id: `${prefix}-${difficulty[0]}${String(i + 1).padStart(2, "0")}`,
        category: "bible" as const,
        subcategory,
        difficulty,
        question,
        options: options as BibleQuestion["options"],
        correctAnswerIndex: slot,
        explanation,
        reference,
      };
    }),
  );
}
