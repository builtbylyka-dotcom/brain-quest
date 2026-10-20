import { useId } from "react";
import type { Fabric } from "@/data/categories";
import { cn } from "@/lib/utils";
import { fabric } from "./fabric";

export type PatchKind = "correct" | "solid" | "wrong" | "timeout" | "empty" | "current" | "plain";

type Props = {
  kind: PatchKind;
  fabrics?: [Fabric, Fabric];
  /** Quarter turns for the half-square triangle, so a row reads as a pattern. */
  turn?: number;
  className?: string;
  title?: string;
  /** Square corners, for patches pieced edge to edge in a quilt. */
  square?: boolean;
};

/**
 * One quilt patch. A correct answer is a half-square triangle in the round's
 * two fabrics; a miss is plain muslin with a small coral cross-stitch mend; an unanswered
 * slot is just its seam.
 */
export function Patch({ kind, fabrics = ["periwinkle", "gold"], turn = 0, className, title, square = false }: Props) {
  const [a, b] = fabrics;
  const clip = `p${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const rotate = `rotate(${(turn % 4) * 90} 20 20)`;
  const rx = square ? 0 : 5;
  return (
    <svg viewBox="0 0 40 40" className={cn("block", className)} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      {kind === "correct" && (
        <>
          <clipPath id={clip}>
            <rect width="40" height="40" rx={rx} />
          </clipPath>
          <g clipPath={`url(#${clip})`}>
            <rect width="40" height="40" fill={fabric(b)} />
            <path d="M0 0H40L0 40Z" fill={fabric(a)} transform={rotate} />
          </g>
        </>
      )}
      {kind === "solid" && <rect width="40" height="40" rx={rx} fill={fabric(a)} />}
      {(kind === "wrong" || kind === "timeout" || kind === "plain") && <rect width="40" height="40" rx={rx} fill="var(--fab-muslin)" />}
      {kind === "wrong" && (
        <g stroke="var(--fab-coral)" strokeWidth="2" strokeLinecap="round">
          <path d="M17.5 17.5l5 5M22.5 17.5l-5 5" />
        </g>
      )}
      {kind === "timeout" && (
        <circle cx="20" cy="20" r="3.5" fill="none" stroke="var(--fab-coral)" strokeWidth="2" strokeDasharray="2 2" />
      )}
      {(kind === "empty" || kind === "current") && (
        <rect x="1" y="1" width="38" height="38" rx="5" fill="var(--surface)" stroke="var(--stitch)" strokeWidth="1.5" strokeDasharray="3.5 3" />
      )}
      {kind === "current" && <circle cx="20" cy="20" r="4.5" fill="var(--fab-gold)" />}
      {kind !== "empty" && kind !== "current" && (
        <rect
          x="4"
          y="4"
          width="32"
          height="32"
          rx="2.5"
          fill="none"
          stroke="var(--ink)"
          strokeOpacity="0.28"
          strokeWidth="1"
          strokeDasharray="2.5 2.5"
        />
      )}
    </svg>
  );
}
