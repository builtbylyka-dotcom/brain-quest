import { Calendar, Compass, Crown, Flame, Footprints, Scroll, Sprout, Zap, type LucideIcon } from "lucide-react";
import type { Achievement } from "@/data/achievements";

const ICONS: Record<Achievement["icon"], LucideIcon> = {
  footprints: Footprints,
  sprout: Sprout,
  flame: Flame,
  crown: Crown,
  compass: Compass,
  zap: Zap,
  calendar: Calendar,
  scroll: Scroll,
};

export function AchievementIcon({ icon, className }: { icon: Achievement["icon"]; className?: string }) {
  const Icon = ICONS[icon];
  return <Icon className={className} aria-hidden strokeWidth={2} />;
}
