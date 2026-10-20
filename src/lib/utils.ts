import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const LETTERS = ["A", "B", "C", "D"] as const;

export function makeRoundId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }
}

export const formatNumber = (n: number) => n.toLocaleString("en-US");

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/** True when a key event comes from a field where typing should not trigger shortcuts. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

/** Dashed seams between cells of a grid that is 2 columns on mobile and `smCols` from the sm breakpoint. */
export function seamClasses(i: number, smCols: number): string {
  return [
    "border-dashed border-stitch",
    i % 2 === 1 ? "border-l" : "border-l-0",
    i >= 2 ? "border-t" : "border-t-0",
    i % smCols !== 0 ? "sm:border-l" : "sm:border-l-0",
    i >= smCols ? "sm:border-t" : "sm:border-t-0",
  ].join(" ");
}
