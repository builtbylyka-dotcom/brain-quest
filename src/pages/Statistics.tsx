import { Trash2 } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Patch } from "@/components/quilt/Patch";
import { fabric, FALLBACK_PAIR } from "@/components/quilt/fabric";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ACHIEVEMENTS } from "@/data/achievements";
import { CATEGORIES, getSubcategory, type Fabric } from "@/data/categories";
import { useProgress } from "@/hooks/useProgress";
import { accuracyOf } from "@/lib/scoring";
import { cn, formatNumber, seamClasses } from "@/lib/utils";

export function Statistics({ onBack, onAchievements }: { onBack: () => void; onAchievements: () => void }) {
  const { progress, resetProgress } = useProgress();
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const s = progress.stats;
  const unlocked = ACHIEVEMENTS.filter((a) => progress.achievements[a.id]).length;

  const overview = [
    { label: "Games played", value: formatNumber(s.gamesPlayed) },
    { label: "Questions answered", value: formatNumber(s.questionsAnswered) },
    { label: "Correct answers", value: formatNumber(s.correctAnswers) },
    { label: "Overall accuracy", value: `${accuracyOf(s.correctAnswers, s.questionsAnswered)}%` },
    { label: "Highest score", value: formatNumber(s.highestScore) },
    { label: "Longest streak", value: formatNumber(s.longestStreak) },
  ];

  const byDifficulty: { label: string; value: number; fabric: Fabric }[] = [
    { label: "Easy", value: s.byDifficulty.easy, fabric: "sage" },
    { label: "Medium", value: s.byDifficulty.medium, fabric: "periwinkle" },
    { label: "Hard", value: s.byDifficulty.hard, fabric: "coral" },
  ];
  const byCategory = CATEGORIES.filter((c) => c.available || (s.byCategory[c.id] ?? 0) > 0).map((c) => ({
    label: c.name,
    value: s.byCategory[c.id] ?? 0,
    fabric: c.fabrics[0],
  }));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
      <PageHeader back={{ label: "Home", onClick: onBack }} title="Your statistics" lede="Everything here is stored only on this device." />

      <dl className="stitched grid grid-cols-2 rounded-[1.4rem] bg-surface p-2 shadow-lift-2 [--stitch-inset:6px] [--stitch-radius:1.4rem] sm:grid-cols-3 sm:p-3">
        {overview.map((o, i) => (
          <div
            key={o.label}
            className={cn("p-4 sm:p-5", seamClasses(i, 3))}
          >
            <dt className="text-sm text-ink-soft">{o.label}</dt>
            <dd className="tabular mt-1 font-display text-3xl font-bold">{o.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <StripChart title="Games by difficulty" rows={byDifficulty} />
        <StripChart title="Games by category" rows={byCategory} note="More categories are coming soon." />
      </div>

      <section aria-labelledby="quilt-title" className="mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="quilt-title" className="text-2xl font-bold">
            Your quilt
          </h2>
          <button type="button" onClick={onAchievements} className="press rounded-lg px-1 text-sm font-semibold text-accent-text underline underline-offset-4 hover:decoration-2">
            {unlocked} of {ACHIEVEMENTS.length} achievements unlocked
          </button>
        </div>
        {progress.quilt.length === 0 ? (
          <p className="mt-3 text-ink-soft">No rows yet. Finish a round and it will be sewn in here.</p>
        ) : (
          <>
            <p className="mt-2 text-ink-soft">
              {progress.quilt.length === 1 ? "Your first round, sewn in." : `Your last ${progress.quilt.length} rounds, one row each, oldest first.`}
            </p>
            <ol className="mt-4 space-y-1.5 rounded-[1.25rem] bg-surface p-3 shadow-lift-1 sm:p-4">
              {progress.quilt.map((row) => {
                const pair = getSubcategory(row.subcategory)?.fabrics ?? FALLBACK_PAIR;
                const correct = row.patches.filter((p) => p === "c").length;
                return (
                  <li key={row.roundId} className="grid grid-cols-[repeat(10,minmax(0,1fr))] gap-1.5 sm:max-w-xl">
                    <span className="sr-only">
                      {getSubcategory(row.subcategory)?.name}, {row.difficulty}: {correct} of {row.patches.length} correct
                    </span>
                    {row.patches.map((p, i) => (
                      <Patch key={i} kind={p === "c" ? "correct" : p === "t" ? "timeout" : "wrong"} fabrics={pair} turn={i % 2 ? 1 : 2} />
                    ))}
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </section>

      <section aria-labelledby="reset-title" className="mt-12 flex flex-col gap-4 rounded-[1.25rem] border border-dashed border-stitch p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 id="reset-title" className="text-xl font-bold">
            Start fresh
          </h2>
          <p className="mt-1 text-ink-soft">Deletes your statistics, achievements, and quilt. Settings are kept.</p>
        </div>
        <Button variant="secondary" onClick={() => setConfirm(true)} className="text-coral-text">
          <Trash2 className="h-5 w-5" aria-hidden />
          Reset Progress
        </Button>
      </section>
      <p className="mt-3 min-h-6 text-sm font-semibold text-sage-text" role="status">
        {done ? "Progress reset. A clean quilt awaits." : ""}
      </p>

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset all progress?</DialogTitle>
            <DialogDescription>
              This permanently deletes your statistics, achievements, and quilt from this device. It can't be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setConfirm(false)}>
              Cancel
            </Button>
            <Button
              className="bg-coral-text text-surface"
              onClick={() => {
                resetProgress();
                setConfirm(false);
                setDone(true);
              }}
            >
              Yes, reset everything
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Strip-pieced bars: each row is a strip of fabric cut to length. */
function StripChart({
  title,
  rows,
  note,
}: {
  title: string;
  rows: { label: string; value: number; fabric: Fabric }[];
  note?: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <section aria-label={title}>
      <h2 className="text-2xl font-bold">{title}</h2>
      <ul className="mt-4 space-y-3">
        {rows.map((r) => (
          <li key={r.label}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-semibold">{r.label}</span>
              <span className="tabular font-bold">{r.value}</span>
            </div>
            <div className="mt-1.5 h-4 overflow-hidden rounded-md bg-muslin">
              <div
                className="h-full origin-left rounded-md"
                style={{
                  transform: `scaleX(${r.value / max})`,
                  backgroundColor: fabric(r.fabric),
                  backgroundImage:
                    "repeating-linear-gradient(90deg, transparent 0 18px, color-mix(in oklab, var(--ink) 22%, transparent) 18px 19.5px)",
                }}
              />
            </div>
          </li>
        ))}
      </ul>
      {note && <p className="mt-4 text-sm text-ink-faint">{note}</p>}
    </section>
  );
}
