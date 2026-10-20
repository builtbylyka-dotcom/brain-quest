export type Difficulty = "easy" | "medium" | "hard";

export const DIFFICULTIES: readonly Difficulty[] = ["easy", "medium", "hard"] as const;

export type CategoryId =
  | "bible"
  | "science"
  | "history"
  | "geography"
  | "general"
  | "movies"
  | "animals";

/** Subcategories that own stored questions. "mixed" is a selection, not a bucket. */
export type BibleQuestionSubcategory =
  | "old-testament"
  | "new-testament"
  | "characters"
  | "life-of-jesus"
  | "miracles"
  | "who-said-it"
  | "finish-the-verse";

export type BibleSubcategory = BibleQuestionSubcategory | "mixed";

export type Question<C extends CategoryId = CategoryId, S extends string = string> = {
  id: string;
  category: C;
  subcategory: S;
  difficulty: Difficulty;
  question: string;
  options: [string, string, string, string];
  correctAnswerIndex: 0 | 1 | 2 | 3;
  explanation: string;
  reference: string;
};

export type BibleQuestion = Question<"bible", BibleQuestionSubcategory>;
