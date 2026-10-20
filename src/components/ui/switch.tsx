import * as SwitchPrimitive from "@radix-ui/react-switch";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import { cn } from "@/lib/utils";

export const Switch = forwardRef<
  ElementRef<typeof SwitchPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(function Switch({ className, ...props }, ref) {
  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(
        "peer inline-flex h-7 w-12 shrink-0 items-center rounded-full border border-line bg-ground-deep p-0.5",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary disabled:opacity-60",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block h-[1.375rem] w-[1.375rem] rounded-full bg-surface-raised shadow-lift-1",
          "transition-transform duration-200 ease-[var(--ease-spring)] data-[state=checked]:translate-x-5",
        )}
      />
    </SwitchPrimitive.Root>
  );
});
