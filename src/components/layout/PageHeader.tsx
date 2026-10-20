import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: ReactNode;
  lede?: ReactNode;
  back?: { label: string; onClick: () => void };
  aside?: ReactNode;
  className?: string;
};

/** Screen heading. Takes focus on mount so screen readers land on each new screen. */
export function PageHeader({ title, lede, back, aside, className }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className={cn("mb-8 sm:mb-10", className)}>
      {back && (
        <button
          type="button"
          onClick={back.onClick}
          className="press -ml-2 mb-5 inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-semibold text-ink-soft hover:bg-ground-deep hover:text-ink active:bg-line"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {back.label}
        </button>
      )}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="min-w-0 max-w-2xl">
          <h1 ref={ref} tabIndex={-1} className="text-[clamp(2.1rem,1.4rem+3vw,3.4rem)] font-extrabold outline-none">
            {title}
          </h1>
          {lede && <p className="mt-3 text-lg leading-[1.7] text-ink-soft">{lede}</p>}
        </div>
        {aside}
      </div>
    </div>
  );
}
