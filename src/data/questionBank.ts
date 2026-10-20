import type { Question } from "@/types/questions";
import { BIBLE_QUESTIONS } from "./bibleQuestions";

/**
 * All playable questions. To add a category: create its question file,
 * spread it in here, and flip `available` in data/categories.ts.
 */
export const QUESTION_BANK: readonly Question[] = [...BIBLE_QUESTIONS];
