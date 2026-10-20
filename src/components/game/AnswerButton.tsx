import { m } from "motion/react";
import { Check, X } from "lucide-react";
import { LETTERS, cn } from "@/lib/utils";

export type AnswerState = "idle" | "hidden" | "correct" | "wrong" | "dimmed";

type Props = {
  index: number;
  text: string;
  state: AnswerState;
  disabled: boolean;
  onSelect: (index: number) => void;
};

/** One answer choice. After answering, the right one is isolated and the rest step back. */
export function AnswerButton({ index, text, state, disabled, onSelect }: Props) {
  const letter = LETTERS[index];
  const status =
    state === "correct" ? ", correct answer" : state === "wrong" ? ", your answer, incorrect" : state === "hidden" ? ", removed by hint" : "";

  return (
    <m.button
      type="button"
      onClick={() => onSelect(index)}
      disabled={disabled || state === "hidden"}
      aria-label={`${letter}: ${text}${status}`}
      aria-keyshortcuts={String(index + 1)}
      animate={
        state === "wrong"
          ? { x: [0, -6, 6, -4, 4, 0], opacity: 1 }
          : state === "correct"
            ? { scale: [1, 1.03, 1], opacity: 1 }
            : { x: 0, scale: 1, opacity: state === "hidden" ? 0.35 : state === "dimmed" ? 0.5 : 1 }
      }
      transition={{ duration: state === "wrong" ? 0.42 : 0.36, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex min-h-[4.25rem] w-full items-center gap-4 rounded-[1.1rem] border-2 p-3 pr-4 text-left shadow-lift-1",
        "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary",
        state === "idle" &&
          "press border-transparent bg-surface hover:border-line hover:shadow-lift-2 active:bg-ground-deep",
        state === "hidden" && "border-dashed border-stitch bg-transparent shadow-none",
        state === "dimmed" && "border-transparent bg-surface shadow-none",
        state === "correct" && "border-emerald bg-emerald-soft",
        state === "wrong" && "border-coral bg-coral-soft",
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-lg font-bold",
          state === "correct" ? "bg-emerald text-navy" : state === "wrong" ? "bg-coral text-navy" : "bg-muslin text-ink",
        )}
        aria-hidden
      >
        {state === "correct" ? <Check className="h-5 w-5" strokeWidth={3} /> : state === "wrong" ? <X className="h-5 w-5" strokeWidth={3} /> : letter}
      </span>
      <span className={cn("min-w-0 flex-1 text-[1.05rem] leading-snug font-semibold sm:text-lg", state === "hidden" && "line-through decoration-2")}>
        {text}
      </span>
    </m.button>
  );
}
