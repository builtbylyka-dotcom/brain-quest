import { cn } from "@/lib/utils";

/** The Brain Quest mark: one half-square-triangle patch with a star sewn on. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("block", className)} aria-hidden>
      <rect width="64" height="64" rx="14" fill="var(--fab-gold)" />
      <path d="M14 0h36L0 50V14A14 14 0 0 1 14 0z" fill="var(--fab-peri)" />
      <path d="M32 18l3.4 9.6L45 31l-9.6 3.4L32 44l-3.4-9.6L19 31l9.6-3.4z" fill="var(--fab-navy)" />
      <rect x="7" y="7" width="50" height="50" rx="9" fill="none" stroke="var(--fab-navy)" strokeOpacity=".45" strokeWidth="2" strokeDasharray="4 4" />
    </svg>
  );
}
