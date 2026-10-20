import { Lock } from "lucide-react";
import { AchievementIcon } from "@/components/achievements/AchievementIcon";
import { PageHeader } from "@/components/layout/PageHeader";
import { ACHIEVEMENTS } from "@/data/achievements";
import { useProgress } from "@/hooks/useProgress";
import { cn, formatDate } from "@/lib/utils";

export function Achievements({ onBack }: { onBack: () => void }) {
  const { progress } = useProgress();
  const unlockedCount = ACHIEVEMENTS.filter((a) => progress.achievements[a.id]).length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <PageHeader
        back={{ label: "Home", onClick: onBack }}
        title="Achievements"
        lede="Little milestones, sewn on like labels. Each one stays with you on this device."
        aside={
          <p className="tabular rounded-2xl bg-gold-soft px-4 py-2 font-display text-lg font-bold text-ink">
            {unlockedCount} <span className="text-ink-soft">of {ACHIEVEMENTS.length} unlocked</span>
          </p>
        }
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ACHIEVEMENTS.map((a) => {
          const date = progress.achievements[a.id];
          const unlocked = Boolean(date);
          return (
            <li
              key={a.id}
              className={cn(
                "relative flex flex-col rounded-[1.25rem] p-5",
                unlocked
                  ? "stitched bg-surface shadow-lift-2 [--stitch-color:var(--fab-gold)] [--stitch-inset:6px] [--stitch-radius:1.25rem]"
                  : "border border-dashed border-stitch bg-surface/50",
              )}
            >
              <span
                className={cn(
                  "relative flex h-14 w-14 items-center justify-center rounded-2xl",
                  unlocked ? "bg-gold text-navy shadow-lift-1" : "bg-muslin text-ink-faint",
                )}
              >
                <AchievementIcon icon={a.icon} className="h-7 w-7" />
                {!unlocked && (
                  <span className="absolute -right-1.5 -bottom-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-surface text-ink-soft shadow-lift-1">
                    <Lock className="h-3.5 w-3.5" aria-hidden />
                  </span>
                )}
              </span>
              <h2 className={cn("mt-4 text-xl font-bold", !unlocked && "text-ink-soft")}>{a.name}</h2>
              <p className="mt-1 text-[0.95rem] leading-[1.7] text-ink-soft">{a.description}</p>
              <p className={cn("mt-auto pt-4 text-sm font-semibold", unlocked ? "text-gold-text" : "text-ink-faint")}>
                {unlocked ? `Unlocked ${formatDate(date!)}` : "Locked"}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
