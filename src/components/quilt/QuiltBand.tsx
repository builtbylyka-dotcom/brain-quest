import { useEffect, useMemo, useRef, useState } from "react";
import { getSubcategory, type Fabric } from "@/data/categories";
import type { QuiltRow } from "@/lib/storage";
import { FALLBACK_PAIR } from "./fabric";
import { Patch, type PatchKind } from "./Patch";

const ROWS = 5;
const ROW_LEN = 10;
/** Rows of your own history shown at the top, newest first, where nothing covers them. */
const HISTORY_ROWS = 3;

type Cell = { kind: PatchKind; fabrics: [Fabric, Fabric]; turn: number };

/**
 * The sample cloth: bold diagonal stripes pieced from half-square triangles,
 * the way a modern quilt uses lots of quiet muslin and a few confident lines.
 */
const STRIPES: { from: number; to: number; fabric: Fabric }[] = [
  { from: 0, to: 1, fabric: "periwinkle" },
  { from: 4, to: 3, fabric: "gold" }, // to < from: a thin stripe of two half-triangles
  { from: 7, to: 7, fabric: "sage" },
  { from: 11, to: 10, fabric: "coral" },
  { from: 14, to: 14, fabric: "periwinkle" },
];

function sampleCell(r: number, c: number): Cell | null {
  const d = c - r;
  for (const s of STRIPES) {
    if (d >= s.from && d <= s.to) return { kind: "solid", fabrics: [s.fabric, s.fabric], turn: 0 };
    if (d === s.from - 1) return { kind: "correct", fabrics: [s.fabric, "muslin"], turn: 1 };
    if (d === s.to + 1) return { kind: "correct", fabrics: [s.fabric, "muslin"], turn: 3 };
  }
  return null;
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

/**
 * The home-screen quilt. First-time visitors see a sample; after that only
 * real rounds appear, sewn in as rows of ten along the top, newest first.
 */
export function QuiltBand({ rows }: { rows: QuiltRow[] }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const cols = width > 0 && width < 560 ? ROW_LEN : 14;

  const grid = useMemo(() => {
    const recent = rows.slice(-HISTORY_ROWS).reverse();
    const start = Math.floor((cols - ROW_LEN) / 2);
    return Array.from({ length: ROWS }, (_, r) => {
      const history = recent[r];
      const pair = history ? (getSubcategory(history.subcategory)?.fabrics ?? FALLBACK_PAIR) : null;
      return Array.from({ length: cols }, (_, c): Cell | null => {
        const i = c - start;
        if (history && pair && i >= 0 && i < history.patches.length) {
          const p = history.patches[i];
          return { kind: p === "c" ? "correct" : p === "t" ? "timeout" : "wrong", fabrics: pair, turn: (i + r) % 2 ? 1 : 2 };
        }
        // Once you've sewn anything, the sample is unpicked: the rest is plain, unsewn muslin.
        return rows.length > 0 ? null : sampleCell(r, c + (cols === ROW_LEN ? 2 : 0));
      });
    });
  }, [rows, cols]);

  return (
    <div ref={ref} className="w-full" aria-hidden>
      <div className="grid w-full" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {grid.flatMap((line, r) =>
          line.map((cell, c) => (
            <div key={`${r}-${c}`} className="aspect-square shadow-[inset_0_0_0_0.5px_var(--line)]">
              {cell ? (
                <Patch kind={cell.kind} fabrics={cell.fabrics} turn={cell.turn} square className="h-full w-full" />
              ) : (
                <Patch kind="plain" square className="h-full w-full" />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
