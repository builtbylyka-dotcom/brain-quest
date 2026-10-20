import { Monitor, Moon, Sun } from "lucide-react";
import { useId } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useProgress } from "@/hooks/useProgress";
import { playSound } from "@/lib/sound";
import type { Theme } from "@/lib/storage";
import { cn } from "@/lib/utils";

const THEMES: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

export function SettingsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { settings, updateSettings, systemReducedMotion } = useProgress();
  const soundId = useId();
  const motionId = useId();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Saved on this device only.</DialogDescription>
        </DialogHeader>

        <div className="divide-y divide-line">
          <div className="flex items-center justify-between gap-4 py-4">
            <label htmlFor={soundId} className="min-w-0">
              <span className="block font-semibold">Sound effects</span>
              <span className="block text-sm text-ink-soft">Soft chimes for answers and achievements.</span>
            </label>
            <Switch
              id={soundId}
              checked={settings.sound}
              onCheckedChange={(sound) => {
                updateSettings({ sound });
                playSound("select", sound);
              }}
            />
          </div>

          <div className="flex items-center justify-between gap-4 py-4">
            <label htmlFor={motionId} className="min-w-0">
              <span className="block font-semibold">Reduced motion</span>
              <span className="block text-sm text-ink-soft">
                {systemReducedMotion ? "Your device already asks for less motion." : "Calmer transitions, no bouncing."}
              </span>
            </label>
            <Switch
              id={motionId}
              checked={settings.reduceMotion || systemReducedMotion}
              disabled={systemReducedMotion}
              onCheckedChange={(reduceMotion) => updateSettings({ reduceMotion })}
            />
          </div>

          <fieldset className="py-4">
            <legend className="font-semibold">Theme</legend>
            <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Theme">
              {THEMES.map(({ value, label, icon: Icon }) => {
                const active = settings.theme === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => updateSettings({ theme: value })}
                    className={cn(
                      "press flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl border text-sm font-semibold",
                      active
                        ? "border-primary bg-peri-soft text-ink"
                        : "border-line bg-surface text-ink-soft hover:border-stitch hover:text-ink active:bg-ground-deep",
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    {label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
      </DialogContent>
    </Dialog>
  );
}
