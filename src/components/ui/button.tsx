import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "quiet";
type Size = "md" | "lg" | "icon";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size };

const VARIANTS: Record<Variant, string> = {
  // A sewn tab: solid periwinkle with a running stitch just inside the edge.
  primary:
    "stitched bg-primary text-on-primary shadow-lift-2 [--stitch-color:color-mix(in_oklab,var(--on-primary)_45%,transparent)] [--stitch-inset:4px] [--stitch-radius:1rem] hover:shadow-lift-3 active:bg-primary-press",
  secondary:
    "bg-surface text-ink border border-line shadow-lift-1 hover:border-stitch hover:shadow-lift-2 active:bg-ground-deep",
  ghost: "text-ink hover:bg-ground-deep active:bg-line",
  quiet: "text-ink-soft underline decoration-stitch underline-offset-4 hover:text-ink hover:decoration-ink",
};

const SIZES: Record<Size, string> = {
  md: "min-h-11 px-5 text-[0.95rem] rounded-2xl gap-2",
  lg: "min-h-14 px-7 text-[1.05rem] rounded-2xl gap-2.5",
  icon: "h-11 w-11 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "press inline-flex shrink-0 items-center justify-center font-semibold select-none disabled:opacity-50",
        VARIANTS[variant],
        variant !== "quiet" && SIZES[size],
        className,
      )}
      {...props}
    />
  );
});
