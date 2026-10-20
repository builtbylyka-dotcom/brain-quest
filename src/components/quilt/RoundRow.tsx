import { m } from "motion/react";
import type { Fabric } from "@/data/categories";
import type { AnswerRecord } from "@/types/game";
import { cn } from "@/lib/utils";
import { Patch } from "./Patch";

type Props = {
  total: number;
  answers: AnswerRecord[];
  /** Index of the question being played, marked with the gold dot. -1 when finished. */
  current: number;
  fabrics: [Fabric, Fabric];
  size?: "sm" | "lg";
  className?: string;
  /** Stagger the patches in, as on the results screen. */
  sewIn?: boolean;
};

/** The row being sewn this round. Doubles as the progress indicator. */
export function RoundRow({ total, answers, current, fabrics, size = "sm", className, sewIn = false }: Props) {
  return (
    <ol
      className={cn("grid gap-1.5", size === "lg" && "gap-2 sm:gap-2.5", className)}
      style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: total }, (_, i) => {
        const a = answers[i];
        const kind = a ? (a.correct ? "correct" : a.selectedIndex === null ? "timeout" : "wrong") : i === current ? "current" : "empty";
        const label = a
          ? `Question ${i + 1}: ${a.correct ? "correct" : a.selectedIndex === null ? "time ran out" : "incorrect"}`
          : i === current
            ? `Question ${i + 1}: current`
            : `Question ${i + 1}: not yet answered`;
        return (
          <li key={i} className="aspect-square list-none">
            {/* Re-keyed on kind so a patch "sews in" the moment its question is answered. */}
            <m.div
              key={kind}
              className="h-full w-full"
              initial={sewIn || a ? { scale: 0.55, opacity: 0, rotate: -8 } : false}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 480, damping: 24, delay: sewIn ? 0.2 + i * 0.07 : 0 }}
            >
              <Patch kind={kind} fabrics={fabrics} turn={i % 2 ? 1 : 2} className="h-full w-full" title={label} />
            </m.div>
          </li>
        );
      })}
    </ol>
  );
}
