import { BookOpen, Clapperboard, FlaskConical, Globe, Landmark, Leaf, Lightbulb, type LucideIcon } from "lucide-react";
import type { Category } from "@/data/categories";

const ICONS: Record<Category["icon"], LucideIcon> = {
  book: BookOpen,
  flask: FlaskConical,
  landmark: Landmark,
  globe: Globe,
  lightbulb: Lightbulb,
  clapperboard: Clapperboard,
  leaf: Leaf,
};

export function CategoryIcon({ icon, className }: { icon: Category["icon"]; className?: string }) {
  const Icon = ICONS[icon];
  return <Icon className={className} aria-hidden strokeWidth={1.9} />;
}
