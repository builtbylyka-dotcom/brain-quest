import { AnimatePresence, m } from "motion/react";
import { X } from "lucide-react";
import { useEffect } from "react";
import { ACHIEVEMENTS } from "@/data/achievements";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";
import { AchievementIcon } from "./AchievementIcon";

const TOAST_MS = 4800;

/** Small, non-blocking unlock notices. Announced politely to screen readers. */
/** `raised` lifts mobile toasts above the gameplay score bar. */
export function AchievementToasts({ raised = false }: { raised?: boolean }) {
  const { toasts, dismissToast } = useProgress();

  useEffect(() => {
    if (toasts.length === 0) return;
    const first = toasts[0];
    const t = window.setTimeout(() => dismissToast(first.key), TOAST_MS);
    return () => window.clearTimeout(t);
  }, [toasts, dismissToast]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 z-[70] flex flex-col items-center gap-2 px-4 sm:right-5 sm:bottom-5 sm:left-auto sm:items-end",
        raised ? "bottom-[calc(env(safe-area-inset-bottom)+5.5rem)]" : "bottom-[calc(env(safe-area-inset-bottom)+1rem)]",
      )}
      role="status"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.slice(0, 3).map((t) => {
          const a = ACHIEVEMENTS.find((x) => x.id === t.id);
          if (!a) return null;
          return (
            <m.div
              key={t.key}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="stitched pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl bg-surface-raised p-3 pr-2 shadow-lift-3 [--stitch-color:var(--fab-gold)] [--stitch-inset:4px] [--stitch-radius:1rem]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold text-navy">
                <AchievementIcon icon={a.icon} className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-lg leading-tight font-bold">{a.name}</span>
                <span className="block text-sm text-gold-text">Achievement unlocked</span>
              </span>
              <button
                type="button"
                onClick={() => dismissToast(t.key)}
                className="press inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-ink-soft hover:bg-ground-deep hover:text-ink active:bg-line"
                aria-label={`Dismiss ${a.name}`}
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </m.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
