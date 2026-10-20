import { Flame, Lightbulb, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { AnimatedNumber } from "@/components/game/AnimatedNumber";
import { AnswerButton, type AnswerState } from "@/components/game/AnswerButton";
import { FeedbackPanel } from "@/components/game/FeedbackPanel";
import { TimerThread } from "@/components/game/TimerThread";
import { RoundRow } from "@/components/quilt/RoundRow";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getCategory, getSubcategory, VERSE_TRANSLATION } from "@/data/categories";
import type { GameApi } from "@/hooks/useGame";
import { useProgress } from "@/hooks/useProgress";
import { useTimer } from "@/hooks/useTimer";
import { currentQuestion } from "@/lib/gameEngine";
import { SECONDS_PER_QUESTION } from "@/lib/scoring";
import { cn, isTypingTarget } from "@/lib/utils";

const DIFF_LABEL = { easy: "Easy", medium: "Medium", hard: "Hard" } as const;

export function Gameplay({ game }: { game: GameApi }) {
  const { state } = game;
  const round = state.round!;
  const q = currentQuestion(round)!;
  const { reduceMotion } = useProgress();
  const answered = state.screen === "ANSWER_FEEDBACK";
  const record = answered ? round.answers[round.index] : null;
  const timed = round.config.mode === "timed";
  const [confirmExit, setConfirmExit] = useState(false);
  const nextRef = useRef<HTMLButtonElement>(null);
  const questionRef = useRef<HTMLHeadingElement>(null);

  const sub = getSubcategory(round.config.subcategory);
  const category = getCategory(round.config.category);
  const isVerse = q.source.subcategory === "finish-the-verse";
  const isLast = round.index >= round.questions.length - 1;

  const { remaining, read } = useTimer({
    duration: SECONDS_PER_QUESTION,
    running: timed && state.screen === "PLAYING" && !confirmExit,
    resetKey: `${round.id}:${round.index}`,
    onExpire: game.timeout,
  });

  const choose = useCallback(
    (i: number) => {
      if (answered) return;
      game.answer(i, timed ? read() : null);
    },
    [answered, game, timed, read],
  );

  // New question: focus it so screen readers read it out.
  useEffect(() => {
    if (state.screen === "PLAYING") questionRef.current?.focus({ preventScroll: true });
  }, [round.index, state.screen]);

  // After answering: bring the explanation into view and focus "Next".
  useEffect(() => {
    if (!answered) return;
    const t = window.setTimeout(() => {
      // Scroll only as far as needed to reveal "Next", so the header stays in view when it can.
      nextRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
      nextRef.current?.focus({ preventScroll: true });
    }, 60);
    return () => window.clearTimeout(t);
  }, [answered, reduceMotion]);

  // Keyboard: 1–4 / A–D answer, H hint, Enter continue. Ignored while typing or in a dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (confirmExit || e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target)) return;
      const k = e.key.toLowerCase();
      if (!answered) {
        const idx = ["1", "2", "3", "4"].indexOf(k) >= 0 ? Number(k) - 1 : ["a", "b", "c", "d"].indexOf(k);
        if (idx >= 0 && idx < q.options.length && !round.hidden.includes(idx)) {
          e.preventDefault();
          choose(idx);
        } else if (k === "h") {
          e.preventDefault();
          game.useHint();
        }
      } else if (k === "enter" && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        game.next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answered, choose, confirmExit, game, q.options.length, round.hidden]);

  const stateOf = (i: number): AnswerState => {
    if (!record) return round.hidden.includes(i) ? "hidden" : "idle";
    if (i === q.correctIndex) return "correct";
    if (i === record.selectedIndex) return "wrong";
    return round.hidden.includes(i) ? "hidden" : "dimmed";
  };

  const hintDisabled = answered || round.hintsLeft <= 0 || round.hidden.length > 0;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 pt-3 pb-6 sm:px-6 sm:pt-6">
      {/* Top: exit, where you are, and the row being sewn. */}
      <header className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setConfirmExit(true)} aria-label="Exit round" className="-ml-2">
          <X className="h-5 w-5" aria-hidden />
        </Button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink-soft">
            {category?.name} · {sub?.name}
          </p>
          <p className="flex items-center gap-2 text-sm">
            <span className="rounded-full bg-muslin px-2 py-0.5 text-xs font-bold text-ink">{DIFF_LABEL[round.config.difficulty]}</span>
            {timed && <span className="text-xs font-bold text-ink-soft">Time Challenge</span>}
          </p>
        </div>
        <p className="tabular shrink-0 font-display text-lg font-bold" aria-live="off">
          {round.index + 1}
          <span className="text-ink-faint"> / {round.questions.length}</span>
        </p>
      </header>

      <div
        className="mt-4"
        role="progressbar"
        aria-label="Round progress"
        aria-valuemin={0}
        aria-valuemax={round.questions.length}
        aria-valuenow={round.answers.length}
        aria-valuetext={`Question ${round.index + 1} of ${round.questions.length}`}
      >
        <RoundRow
          total={round.questions.length}
          answers={round.answers}
          current={round.index}
          fabrics={sub?.fabrics ?? ["periwinkle", "gold"]}
          className="mx-auto max-w-xl"
        />
      </div>

      {timed && (
        <div className="mt-4">
          <TimerThread remaining={answered ? (record?.secondsLeft ?? 0) : remaining} total={SECONDS_PER_QUESTION} paused={confirmExit} />
        </div>
      )}

      {/* Main: the question and its four answers. */}
      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={`${round.id}:${round.index}`}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 flex flex-1 flex-col sm:mt-8"
        >
          <div className="stitched rounded-[1.5rem] bg-surface px-5 py-7 shadow-lift-2 [--stitch-inset:7px] [--stitch-radius:1.5rem] sm:px-9 sm:py-10">
            <p className="sr-only">
              Question {round.index + 1} of {round.questions.length}
            </p>
            {isVerse && (
              <p className="mb-3 inline-flex rounded-full bg-sage-soft px-2.5 py-1 text-xs font-bold text-sage-text">
                Finish the verse · {VERSE_TRANSLATION}
              </p>
            )}
            <h1
              ref={questionRef}
              tabIndex={-1}
              className={cn(
                "text-[clamp(1.45rem,1.05rem+1.9vw,2.25rem)] leading-[1.18] font-bold outline-none",
                isVerse && "font-sans font-semibold tracking-[-0.01em] [font-variation-settings:normal]",
              )}
            >
              {q.source.question}
            </h1>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2" role="group" aria-label="Answers">
            {q.options.map((opt, i) => (
              <AnswerButton key={i} index={i} text={opt} state={stateOf(i)} disabled={answered} onSelect={choose} />
            ))}
          </div>

          <div className="mt-5" aria-live="polite">
            {record && <FeedbackPanel ref={nextRef} question={q} record={record} translation={isVerse ? VERSE_TRANSLATION : null} isLast={isLast} onNext={game.next} />}
          </div>
        </m.div>
      </AnimatePresence>

      {/* Bottom: score, streak, hints. */}
      <footer className="sticky bottom-0 z-20 -mx-4 mt-6 border-t border-line bg-ground/95 px-4 py-3 sm:bottom-4 sm:mx-0 sm:rounded-2xl sm:border sm:bg-surface sm:px-5 sm:shadow-lift-2">
        <div className="flex items-center justify-between gap-3">
          <dl className="flex items-center gap-5 sm:gap-8">
            <div>
              <dt className="text-xs font-semibold text-ink-soft">Score</dt>
              <dd className="tabular font-display text-xl font-bold">
                <AnimatedNumber value={round.score} />
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-ink-soft">Streak</dt>
              <dd className="flex items-center gap-1 font-display text-xl font-bold">
                <m.span
                  key={round.streak}
                  initial={round.streak > 1 ? { scale: 0.4 } : false}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                  className="inline-flex"
                >
                  <Flame className={cn("h-5 w-5", round.streak >= 2 ? "text-accent-text" : "text-ink-faint")} aria-hidden />
                </m.span>
                <span className="tabular">{round.streak}</span>
              </dd>
            </div>
          </dl>
          <Button variant="secondary" onClick={game.useHint} disabled={hintDisabled} aria-keyshortcuts="h" className="px-4">
            <Lightbulb className={cn("h-5 w-5", !hintDisabled && "text-gold-text")} aria-hidden />
            <span>Hint</span>
            <span className="flex gap-1" aria-label={`${round.hintsLeft} of 2 left`}>
              {[0, 1].map((i) => (
                <span key={i} className={cn("h-2 w-2 rounded-full", i < round.hintsLeft ? "bg-gold" : "border border-stitch")} aria-hidden />
              ))}
            </span>
          </Button>
        </div>
      </footer>

      <Dialog open={confirmExit} onOpenChange={setConfirmExit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave this round?</DialogTitle>
            <DialogDescription>
              Your progress in this round won't be saved. {timed && "The timer is paused while you decide."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setConfirmExit(false)}>
              Keep playing
            </Button>
            <Button
              onClick={() => {
                setConfirmExit(false);
                game.exitRound();
              }}
            >
              Leave round
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
