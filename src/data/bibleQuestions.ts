import type { BibleQuestion } from "@/types/questions";
import { characters } from "./bible/characters";
import { finishTheVerse } from "./bible/finishTheVerse";
import { lifeOfJesus } from "./bible/lifeOfJesus";
import { miracles } from "./bible/miracles";
import { newTestament } from "./bible/newTestament";
import { oldTestament } from "./bible/oldTestament";
import { whoSaidIt } from "./bible/whoSaidIt";

/** Every Bible question. "Mixed" rounds draw from this whole list. */
export const BIBLE_QUESTIONS: BibleQuestion[] = [
  ...oldTestament,
  ...newTestament,
  ...characters,
  ...lifeOfJesus,
  ...miracles,
  ...whoSaidIt,
  ...finishTheVerse,
];
