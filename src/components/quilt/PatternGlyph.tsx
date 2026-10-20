import { useId, type ReactNode } from "react";
import type { Fabric } from "@/data/categories";
import type { BibleSubcategory } from "@/types/questions";
import { cn } from "@/lib/utils";
import { fabric } from "./fabric";

type Props = { pattern: BibleSubcategory; fabrics: [Fabric, Fabric]; className?: string };

const M = "var(--fab-muslin)";

/** Simplified drawings of the traditional quilt blocks each subcategory is named after. */
export function PatternGlyph({ pattern, fabrics, className }: Props) {
  const clip = `g${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const a = fabric(fabrics[0]);
  const b = fabric(fabrics[1]);
  return (
    <svg viewBox="0 0 48 48" className={cn("block", className)} aria-hidden>
      <clipPath id={clip}>
        <rect width="48" height="48" rx="7" />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        <rect width="48" height="48" fill={M} />
        {DRAW[pattern](a, b)}
      </g>
      <rect x="3.5" y="3.5" width="41" height="41" rx="4" fill="none" stroke="var(--ink)" strokeOpacity=".25" strokeDasharray="2.5 2.5" />
    </svg>
  );
}

const DRAW: Record<BibleSubcategory, (a: string, b: string) => ReactNode> = {
  // Nine-patch of four-patches and half-square triangles making two diagonal "ladders".
  "old-testament": (a, b) => (
    <>
      {[
        [0, 0],
        [32, 0],
        [16, 16],
        [0, 32],
        [32, 32],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="8" height="8" fill={a} />
          <rect x={x + 8} y={y + 8} width="8" height="8" fill={a} />
          <rect x={x + 8} y={y} width="8" height="8" fill={b} />
          <rect x={x} y={y + 8} width="8" height="8" fill={b} />
        </g>
      ))}
      <path d="M16 0h16L16 16z M48 16v16L32 16z M32 48H16l16-16z M0 32V16l16 16z" fill={b} />
    </>
  ),
  // Eight diamonds radiating from the centre.
  "new-testament": (a, b) => (
    <g transform="translate(24 24)">
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d="M0 0L6 -9L0 -22L-6 -9Z" fill={i % 2 ? b : a} transform={`rotate(${i * 45})`} />
      ))}
    </g>
  ),
  // Strips of many colours.
  characters: (a, b) => (
    <>
      {["var(--fab-coral)", b, "var(--fab-peri)", "var(--fab-sage)", a, "var(--fab-emerald)", "var(--fab-gold)", "var(--fab-peri)"].map(
        (fill, i) => (
          <rect key={i} x={i * 6} y="0" width="6" height="48" fill={fill} />
        ),
      )}
      <path d="M0 16h48M0 32h48" stroke="var(--fab-muslin)" strokeWidth="1.5" strokeDasharray="2 2" />
    </>
  ),
  // A diamond star turning inside a wheel.
  "life-of-jesus": (a, b) => (
    <g transform="translate(24 24)">
      <circle r="20" fill="none" stroke={b} strokeWidth="5" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d="M0 0L4.5 -6L0 -15L-4.5 -6Z" fill={a} transform={`rotate(${i * 45 + 22.5})`} />
      ))}
      <circle r="3" fill={b} />
    </g>
  ),
  // Curved "Drunkard's Path" quarter circles meeting as one wonder.
  miracles: (a, b) => (
    <>
      <path d="M24 24V6A18 18 0 0 0 6 24Z" fill={a} />
      <path d="M24 24H42A18 18 0 0 0 24 6Z" fill={b} />
      <path d="M24 24V42A18 18 0 0 0 42 24Z" fill={a} />
      <path d="M24 24H6A18 18 0 0 0 24 42Z" fill={b} />
      <path d="M0 0H12A12 12 0 0 1 0 12Z M48 0V12A12 12 0 0 1 36 0Z M48 48H36A12 12 0 0 1 48 36Z M0 48V36A12 12 0 0 1 12 48Z" fill={b} />
    </>
  ),
  // Quarter circles turned every which way: a puzzle to solve.
  "who-said-it": (a, b) => (
    <>
      {[0, 1, 2, 3].flatMap((r) =>
        [0, 1, 2, 3].map((c) => {
          const turn = (r + c) % 2 === 0 ? (r % 2 ? 90 : 0) : r % 2 ? 180 : 270;
          return (
            <path
              key={`${r}${c}`}
              d="M0 0H8A8 8 0 0 1 0 8Z"
              fill={(r + c) % 2 ? a : b}
              transform={`translate(${c * 12 + 6} ${r * 12 + 6}) rotate(${turn}) translate(-6 -6) scale(1.5)`}
            />
          );
        }),
      )}
    </>
  ),
  // Triangles stacked into a tree with a trunk.
  "finish-the-verse": (a, b) => (
    <>
      <path d="M24 5L36 19H12Z" fill={a} />
      <path d="M24 13L39 29H9Z" fill={a} />
      <path d="M24 21L42 39H6Z" fill={b} />
      <rect x="21" y="38" width="6" height="10" fill="var(--fab-navy)" />
    </>
  ),
  // Irregular scraps with feather-stitched seams.
  mixed: (a, b) => (
    <>
      <path d="M0 0H22L17 19L0 24Z" fill={a} />
      <path d="M22 0H48V14L31 22L17 19Z" fill="var(--fab-gold)" />
      <path d="M48 14V40L35 48H27L31 22Z" fill={b} />
      <path d="M0 24L17 19L31 22L27 48H0Z" fill="var(--fab-sage)" />
      <path d="M17 19L31 22L29 34L18 31Z" fill="var(--fab-peri)" />
      <path d="M0 24L17 19L31 22L48 14M31 22L27 48M17 19L22 0" fill="none" stroke="var(--fab-muslin)" strokeWidth="1.4" strokeDasharray="2 1.6" />
    </>
  ),
};
