import { Check, Copy, Home as HomeIcon, LayoutGrid, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatedNumber } from "@/components/game/AnimatedNumber";
import { RoundRow } from "@/components/quilt/RoundRow";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getCategory, getSubcategory } from "@/data/categories";
import { shareResults, shareText } from "@/lib/share";
import { accuracyOf, resultTitle } from "@/lib/scoring";
import type { RoundSummary } from "@/types/game";
import { cn, seamClasses } from "@/lib/utils";

type Props = {
  summary: RoundSummary;
  onPlayAgain: () => void;
  onCategories: () => void;
  onHome: () => void;
};

export function Results({ summary, onPlayAgain, onCategories, onHome }: Props) {
  const accuracy = accuracyOf(summary.correct, summary.total);
  const { title, message } = resultTitle(accuracy);
  const sub = getSubcategory(summary.config.subcategory);
  const category = getCategory(summary.config.category);
  const [shareStatus, setShareStatus] = useState<string>("");
  const [manualOpen, setManualOpen] = useState(false);
  const text = shareText(summary);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus({ preventScroll: true }), []);

  const onShare = async () => {
    const outcome = await shareResults(text);
    if (outcome === "copied") setShareStatus("Copied to your clipboard.");
    else if (outcome === "shared") setShareStatus("Thanks for sharing!");
    else if (outcome === "manual") setManualOpen(true);
  };

  const facts = [
    { label: "Correct", value: summary.correct },
    { label: "Incorrect", value: summary.incorrect },
    { label: "Accuracy", value: `${accuracy}%` },
    { label: "Best streak", value: summary.bestStreak },
  ];
  const meta = [
    { label: "Category", value: `${category?.name ?? ""} · ${sub?.name ?? ""}` },
    { label: "Difficulty", value: summary.config.difficulty[0].toUpperCase() + summary.config.difficulty.slice(1) },
    { label: "Mode", value: summary.config.mode === "timed" ? "Time Challenge" : "Classic" },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
      <section aria-labelledby="results-title" className="stitched rounded-[1.75rem] bg-surface p-6 shadow-lift-3 [--stitch-inset:9px] [--stitch-radius:1.75rem] sm:p-10">
        <h2 className="sr-only">Your new quilt row</h2>
        <RoundRow
          total={summary.total}
          answers={summary.answers}
          current={-1}
          fabrics={sub?.fabrics ?? ["periwinkle", "gold"]}
          size="lg"
          sewIn
        />

        <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <h1 id="results-title" ref={heading} tabIndex={-1} className="text-[clamp(2.2rem,1.5rem+3vw,3.6rem)] font-extrabold outline-none">
              {title}
            </h1>
            <p className="mt-3 max-w-md text-lg leading-[1.7] text-ink-soft">{message}</p>
          </div>
          <p className="sm:text-right">
            <span className="tabular block font-display text-[clamp(2.6rem,2rem+3vw,4rem)] leading-none font-extrabold tracking-[-0.03em]">
              <AnimatedNumber value={summary.score} duration={1.2} />
            </span>
            <span className="mt-1 block text-sm font-semibold text-ink-soft">points</span>
          </p>
        </div>

        <dl className="mt-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-dashed border-stitch sm:grid-cols-4">
          {facts.map((f, i) => (
            <div
              key={f.label}
              className={cn("p-4", seamClasses(i, 4))}
            >
              <dt className="text-sm text-ink-soft">{f.label}</dt>
              <dd className="tabular mt-1 font-display text-2xl font-bold">{f.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {meta.map((m) => (
              <div key={m.label} className="flex gap-1.5">
                <dt className="text-ink-faint">{m.label}:</dt>
                <dd className="font-semibold">{m.value}</dd>
              </div>
            ))}
          </dl>
          <Button variant="secondary" onClick={onShare}>
            <Share2 className="h-5 w-5" aria-hidden />
            Share results
          </Button>
        </div>
        <p className={shareStatus ? "mt-3 text-right text-sm font-semibold text-sage-text" : "sr-only"} role="status">
          {shareStatus}
        </p>
      </section>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button size="lg" onClick={onPlayAgain}>
          <RotateCcw className="h-5 w-5" aria-hidden />
          Play Again
        </Button>
        <Button size="lg" variant="secondary" onClick={onCategories}>
          <LayoutGrid className="h-5 w-5" aria-hidden />
          Choose Another Category
        </Button>
        <Button size="lg" variant="secondary" onClick={onHome}>
          <HomeIcon className="h-5 w-5" aria-hidden />
          Back to Home
        </Button>
      </div>

      <ManualShareDialog open={manualOpen} onOpenChange={setManualOpen} text={text} />
    </div>
  );
}

function ManualShareDialog({ open, onOpenChange, text }: { open: boolean; onOpenChange: (o: boolean) => void; text: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    ref.current?.select();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      try {
        setCopied(document.execCommand("copy"));
      } catch {
        setCopied(false);
      }
    }
  };
  return (
    <Dialog open={open} onOpenChange={(o) => (onOpenChange(o), setCopied(false))}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share your results</DialogTitle>
          <DialogDescription>Copy this and paste it anywhere. It only includes your score.</DialogDescription>
        </DialogHeader>
        <label htmlFor="share-text" className="sr-only">
          Results text
        </label>
        <textarea
          id="share-text"
          ref={ref}
          readOnly
          value={text}
          rows={6}
          onFocus={(e) => e.currentTarget.select()}
          className="w-full resize-none rounded-xl border border-line bg-ground p-3 font-sans text-sm leading-[1.7] text-ink"
        />
        <div className="mt-4 flex justify-end">
          <Button onClick={copy}>
            {copied ? <Check className="h-5 w-5" aria-hidden /> : <Copy className="h-5 w-5" aria-hidden />}
            {copied ? "Copied" : "Copy text"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
