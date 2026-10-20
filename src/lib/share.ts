import { getCategory, getSubcategory } from "@/data/categories";
import type { RoundSummary } from "@/types/game";
import { accuracyOf, resultTitle } from "./scoring";

export const SHARE_URL = typeof window !== "undefined" ? window.location.origin : "https://builtbylyka.com/";

const PATCH = { correct: "🟪", wrong: "⬜" } as const;

/** Score-only share text. Never includes anything personal. */
export function shareText(summary: RoundSummary, url = SHARE_URL): string {
  const accuracy = accuracyOf(summary.correct, summary.total);
  const cat = getCategory(summary.config.category)?.name ?? "Trivia";
  const sub = getSubcategory(summary.config.subcategory)?.name;
  const mode = summary.config.mode === "timed" ? "Time Challenge" : "Classic";
  const diff = summary.config.difficulty[0].toUpperCase() + summary.config.difficulty.slice(1);
  const row = summary.answers.map((a) => (a.correct ? PATCH.correct : PATCH.wrong)).join("");
  return [
    `Brain Quest: ${sub ?? cat} (${diff}, ${mode})`,
    `${row}`,
    `${summary.correct}/${summary.total} correct · ${accuracy}% · ${summary.score.toLocaleString("en-US")} pts`,
    `"${resultTitle(accuracy).title}"`,
    `Play: ${url}`,
  ].join("\n");
}

export type ShareOutcome = "shared" | "copied" | "cancelled" | "manual";

/** Native share sheet, then clipboard; "manual" means the caller should show copyable text. */
export async function shareResults(text: string): Promise<ShareOutcome> {
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title: "Brain Quest", text });
      return "shared";
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return "cancelled";
      // Fall through to clipboard (e.g. share blocked inside an iframe).
    }
  }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return "copied";
    }
  } catch {
    /* fall through */
  }
  return "manual";
}
