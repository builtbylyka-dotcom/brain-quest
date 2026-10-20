import { Timer } from "lucide-react";
import { cn } from "@/lib/utils";

/** The countdown as a thread being used up: a line that shortens, plus the seconds. */
export function TimerThread({ remaining, total, paused }: { remaining: number; total: number; paused: boolean }) {
  const ratio = Math.max(0, Math.min(1, remaining / total));
  const secs = Math.ceil(remaining);
  const urgent = secs <= 5 && remaining > 0;
  return (
    <div className="flex items-center gap-3" role="timer" aria-label={`${secs} seconds left${paused ? ", paused" : ""}`}>
      <Timer className={cn("h-5 w-5 shrink-0", urgent ? "text-coral-text" : "text-ink-soft")} aria-hidden />
      <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-muslin">
        <div
          className={cn("absolute inset-0 origin-left rounded-full", urgent ? "bg-coral" : "bg-peri")}
          style={{ transform: `scaleX(${ratio})`, transition: "transform 120ms linear" }}
        />
      </div>
      <span className={cn("tabular w-9 text-right font-display text-xl font-bold", urgent && "text-coral-text")} aria-hidden>
        {secs}
      </span>
    </div>
  );
}
