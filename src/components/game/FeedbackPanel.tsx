import { m } from "motion/react";
import { ArrowRight, BookOpen } from "lucide-react";
import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import type { AnswerRecord, RoundQuestion } from "@/types/game";
import { LETTERS, cn } from "@/lib/utils";

type Props = {
  question: RoundQuestion;
  record: AnswerRecord;
  translation: string | null;
  isLast: boolean;
  onNext: () => void;
};

const PRAISE = ["Sewn in!", "Right on!", "Beautifully done!", "That's it!", "Spot on!"];

/** Shown after every answer. The player decides when to move on. */
export const FeedbackPanel = forwardRef<HTMLButtonElement, Props>(function FeedbackPanel(
  { question, record, translation, isLast, onNext },
  nextRef,
) {
  const correct = record.correct;
  const timedOut = record.selectedIndex === null;
  const verdict = correct ? PRAISE[[...question.source.id].reduce((n, ch) => n + ch.charCodeAt(0), 0) % PRAISE.length] : timedOut ? "Time's up" : "Not quite";
  const answerText = question.options[question.correctIndex];

  return (
    <m.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="feedback-title"
      className={cn(
        "stitched rounded-[1.4rem] p-5 shadow-lift-2 [--stitch-inset:6px] [--stitch-radius:1.4rem] sm:p-7",
        correct ? "bg-emerald-soft [--stitch-color:var(--fab-emerald)]" : "bg-surface [--stitch-color:var(--fab-coral)]",
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="feedback-title" className={cn("text-2xl font-extrabold sm:text-3xl", correct ? "text-emerald-text" : "text-coral-text")}>
          {verdict}
        </h2>
        {correct ? (
          <p className="tabular font-display text-xl font-bold text-ink">
            +{record.points.total}
            <span className="sr-only"> points</span>
          </p>
        ) : (
          <p className="text-sm font-semibold text-ink-soft">No points this time. Your streak starts fresh.</p>
        )}
      </div>

      {!correct && (
        <p className="mt-3 text-lg leading-snug">
          The answer is <strong className="font-bold">{LETTERS[question.correctIndex]}. {answerText}</strong>
        </p>
      )}

      <p className="mt-3 max-w-[62ch] leading-[1.7] text-ink-soft">{question.source.explanation}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-raised px-3 py-1.5 font-bold text-ink shadow-lift-1">
          <BookOpen className="h-4 w-4 text-accent-text" aria-hidden />
          {question.source.reference}
          {translation && <span className="font-semibold text-ink-faint">({translation})</span>}
        </span>
        {correct && (
          <span className="text-ink-soft">
            {record.points.base} base
            {record.points.streak > 0 && <> · +{record.points.streak} streak</>}
            {record.points.time > 0 && <> · +{record.points.time} time</>}
          </span>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button ref={nextRef} size="lg" onClick={onNext} className="w-full scroll-mb-28 sm:w-auto">
          {isLast ? "See Results" : "Next Question"}
          <ArrowRight className="h-5 w-5" aria-hidden />
        </Button>
      </div>
    </m.section>
  );
});
