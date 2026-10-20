import { ArrowRight, BookOpen, Flame, Keyboard, Lightbulb, Timer } from "lucide-react";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PatternGlyph } from "@/components/quilt/PatternGlyph";
import { Button } from "@/components/ui/button";
import { BIBLE_SUBCATEGORIES, getCategory, getSubcategory, VERSE_TRANSLATION } from "@/data/categories";
import { QUESTION_BANK } from "@/data/questionBank";
import type { Draft } from "@/lib/gameEngine";
import { HINTS_PER_ROUND } from "@/lib/hints";
import { poolSize, ROUND_SIZE } from "@/lib/questionSelector";
import { BASE_POINTS, MAX_TIME_BONUS, SECONDS_PER_QUESTION } from "@/lib/scoring";
import { cn } from "@/lib/utils";
import type { GameMode } from "@/types/game";
import type { Difficulty } from "@/types/questions";

type Props = {
  draft: Draft;
  onBack: () => void;
  onDifficulty: (d: Difficulty) => void;
  onMode: (m: GameMode) => void;
  onStart: () => void;
};

const DIFFICULTY_COPY: Record<Difficulty, { name: string; blurb: string }> = {
  easy: { name: "Easy", blurb: "For beginners and casual players." },
  medium: { name: "Medium", blurb: "For players familiar with Bible stories." },
  hard: { name: "Hard", blurb: "For players who want a serious challenge." },
};

const MODE_COPY: Record<GameMode, { name: string; blurb: string; icon: typeof Timer }> = {
  classic: { name: "Classic", blurb: "No timer. Take your time and learn as you go.", icon: BookOpen },
  timed: {
    name: "Time Challenge",
    blurb: `${SECONDS_PER_QUESTION} seconds per question. Answer fast for bonus points.`,
    icon: Timer,
  },
};

export function Setup({ draft, onBack, onDifficulty, onMode, onStart }: Props) {
  const sub = getSubcategory(draft.subcategory ?? "") ?? BIBLE_SUBCATEGORIES[0];
  const category = getCategory(draft.category ?? "bible");
  const available = poolSize(QUESTION_BANK, {
    category: draft.category ?? "bible",
    subcategory: sub.id,
    difficulty: draft.difficulty,
  });
  const roundLength = Math.min(available, ROUND_SIZE);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
      <PageHeader
        back={{ label: category?.name ?? "Back", onClick: onBack }}
        title={sub.name}
        lede={sub.description}
        aside={<PatternGlyph pattern={sub.id} fabrics={sub.fabrics} className="hidden h-24 w-24 sm:block" />}
      />

      <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
        <div className="space-y-8">
          <ChoiceGroup legend="Difficulty">
            <div className="grid gap-3 sm:grid-cols-3">
              {(Object.keys(DIFFICULTY_COPY) as Difficulty[]).map((d, i) => (
                <Choice
                  key={d}
                  name="difficulty"
                  checked={draft.difficulty === d}
                  onChange={() => onDifficulty(d)}
                  title={DIFFICULTY_COPY[d].name}
                  blurb={DIFFICULTY_COPY[d].blurb}
                  badge={<DifficultyPips level={i + 1} />}
                  meta={`${BASE_POINTS[d]} pts each`}
                />
              ))}
            </div>
          </ChoiceGroup>

          <ChoiceGroup legend="Game mode">
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(MODE_COPY) as GameMode[]).map((m) => {
                const Icon = MODE_COPY[m].icon;
                return (
                  <Choice
                    key={m}
                    name="mode"
                    checked={draft.mode === m}
                    onChange={() => onMode(m)}
                    title={MODE_COPY[m].name}
                    blurb={MODE_COPY[m].blurb}
                    badge={<Icon className="h-5 w-5" aria-hidden />}
                    meta={`${ROUND_SIZE} questions`}
                  />
                );
              })}
            </div>
          </ChoiceGroup>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button size="lg" onClick={onStart} disabled={available === 0}>
              Start round
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Button>
            <p className="text-sm text-ink-soft" aria-live="polite">
              {available === 0
                ? "No questions here yet. Try another difficulty."
                : available < ROUND_SIZE
                  ? `This set has ${available} questions, so this round will be ${roundLength} questions long.`
                  : `${roundLength} questions, picked fresh and shuffled.`}
            </p>
          </div>
        </div>

        <aside aria-labelledby="how-title" className="h-fit rounded-[1.25rem] bg-ground-deep p-6 sm:p-7">
          <h2 id="how-title" className="text-2xl font-bold">
            How to play
          </h2>
          <ul className="mt-5 space-y-4 text-[0.97rem] leading-[1.7] text-ink-soft">
            <Rule icon={<BookOpen className="h-5 w-5" />}>
              Pick one of four answers. You'll see the right answer, a short explanation, and the Bible reference before you
              move on.
            </Rule>
            <Rule icon={<Flame className="h-5 w-5" />}>
              Correct answers in a row build a streak: +20 for two, +30 for three, up to +100 each.
            </Rule>
            {draft.mode === "timed" && (
              <Rule icon={<Timer className="h-5 w-5" />}>
                Answer correctly with time to spare for up to +{MAX_TIME_BONUS}. If time runs out, the question counts as
                missed.
              </Rule>
            )}
            <Rule icon={<Lightbulb className="h-5 w-5" />}>
              You have {HINTS_PER_ROUND} hints per round. Each one removes two wrong answers.
            </Rule>
            <Rule icon={<Keyboard className="h-5 w-5" />}>
              Keys <Kbd>1</Kbd>–<Kbd>4</Kbd> answer, <Kbd>H</Kbd> uses a hint, <Kbd>Enter</Kbd> continues.
            </Rule>
          </ul>
          {sub.id === "finish-the-verse" && (
            <p className="mt-5 border-t border-dashed border-stitch pt-4 text-sm text-ink-soft">
              Verses are quoted from the King James Version ({VERSE_TRANSLATION}).
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

function ChoiceGroup({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 font-display text-xl font-bold tracking-[-0.02em]">{legend}</legend>
      {children}
    </fieldset>
  );
}

function Choice({
  name,
  checked,
  onChange,
  title,
  blurb,
  badge,
  meta,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  blurb: string;
  badge: ReactNode;
  meta: string;
}) {
  return (
    <label
      className={cn(
        "press relative flex cursor-pointer flex-col rounded-[1.1rem] border-2 bg-surface p-4 shadow-lift-1 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
        checked ? "border-primary bg-peri-soft" : "border-transparent hover:border-line hover:shadow-lift-2 active:bg-ground-deep",
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      <span className="flex items-center justify-between gap-3">
        <span className="font-display text-lg font-bold">{title}</span>
        <span className={cn("text-ink-soft", checked && "text-ink")}>{badge}</span>
      </span>
      <span className="mt-1 text-sm leading-[1.7] text-ink-soft">{blurb}</span>
      <span className="mt-3 text-xs font-semibold text-ink-faint">{meta}</span>
    </label>
  );
}

function DifficultyPips({ level }: { level: number }) {
  return (
    <span className="flex gap-1" aria-hidden>
      {[1, 2, 3].map((n) => (
        <span key={n} className={cn("h-2.5 w-2.5 rotate-45 rounded-[2px]", n <= level ? "bg-current" : "border border-current opacity-40")} />
      ))}
    </span>
  );
}

function Rule({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 shrink-0 text-ink" aria-hidden>
        {icon}
      </span>
      <span>{children}</span>
    </li>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-sans text-xs font-bold text-ink shadow-lift-1">
      {children}
    </kbd>
  );
}
