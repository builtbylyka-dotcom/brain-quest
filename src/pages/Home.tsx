import { ArrowRight, Sprout, Trophy } from "lucide-react";
import { useEffect, useRef } from "react";
import { QuiltBand } from "@/components/quilt/QuiltBand";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/useProgress";
import { cn, formatNumber, seamClasses } from "@/lib/utils";

type Props = { onStart: () => void; onAchievements: () => void; onStats: () => void };

export function Home({ onStart, onAchievements, onStats }: Props) {
  const { progress } = useProgress();
  const s = progress.stats;
  const firstVisit = s.gamesPlayed === 0;
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus({ preventScroll: true }), []);

  const stats = [
    { label: "Games played", value: s.gamesPlayed },
    { label: "Best score", value: s.highestScore },
    { label: "Questions answered", value: s.questionsAnswered },
    { label: "Best streak", value: s.longestStreak },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <section aria-labelledby="home-title" className="relative">
        {/* The quilt: sample block at first, then a row for every finished round. */}
        <div className="rounded-[1.75rem] bg-surface p-1.5 shadow-lift-2 sm:p-2">
          <div className="overflow-hidden rounded-[1.4rem]">
            <QuiltBand rows={progress.quilt} />
          </div>
        </div>

        <div className="stitched relative z-10 mx-2 -mt-14 max-w-2xl rounded-[1.5rem] bg-surface p-6 shadow-lift-3 [--stitch-inset:8px] [--stitch-radius:1.5rem] sm:mx-0 sm:-mt-32 sm:ml-10 sm:p-10 lg:-mt-40 lg:ml-14">
          <h1
            id="home-title"
            ref={heading}
            tabIndex={-1}
            className="text-[clamp(2.4rem,1.6rem+3.6vw,4.4rem)] font-extrabold outline-none"
          >
            Ready for a Brain&nbsp;Quest?
          </h1>
          <p className="mt-4 max-w-[34rem] text-lg leading-[1.7] text-ink-soft">
            Pick a category, challenge yourself, and discover something new with every question.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={onStart}>
              Start Playing
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Button>
            <Button size="lg" variant="secondary" onClick={onAchievements}>
              <Trophy className="h-5 w-5 text-gold-text" aria-hidden />
              My Achievements
            </Button>
          </div>

          {firstVisit ? (
            <p className="mt-8 flex gap-3 rounded-2xl bg-sage-soft p-4 leading-[1.7] text-ink">
              <Sprout className="mt-0.5 h-5 w-5 shrink-0 text-sage-text" aria-hidden />
              <span>
                <strong className="font-bold">Welcome, curious mind.</strong> The quilt above is a sample. Every answer
                you give becomes a patch, and every finished round is sewn in as a new row.
              </span>
            </p>
          ) : (
            <dl className="mt-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-dashed border-stitch sm:grid-cols-4">
              {stats.map((st, i) => (
                <div
                  key={st.label}
                  className={cn("p-4", seamClasses(i, 4))}
                >
                  <dt className="text-[0.8rem] leading-tight text-ink-soft">{st.label}</dt>
                  <dd className="tabular mt-1 font-display text-2xl font-bold">{formatNumber(st.value)}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      <section aria-labelledby="about-title" className="mt-16 grid gap-6 sm:mt-20 md:grid-cols-[1fr_1.3fr] md:gap-12">
        <h2 id="about-title" className="text-[clamp(1.6rem,1.2rem+1.6vw,2.3rem)] font-bold">
          About Brain Quest
        </h2>
        <div className="max-w-[38rem] text-lg leading-[1.7] text-ink-soft">
          <p>
            Brain Quest is a little trivia game created by Built By Lyka to make learning fun, one question at a time.
          </p>
          <p className="mt-4">
            Your progress, achievements, and quilt stay on this device. There's no account and nothing to sign up for.{" "}
            <button type="button" onClick={onStats} className="font-semibold text-accent-text underline decoration-2 underline-offset-4 hover:decoration-[3px] focus-visible:rounded-sm">
              See your statistics
            </button>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
