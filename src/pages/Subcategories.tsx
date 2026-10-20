import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PatternGlyph } from "@/components/quilt/PatternGlyph";
import { BIBLE_SUBCATEGORIES, type Subcategory } from "@/data/categories";
import { useProgress } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

type Props = { onBack: () => void; onSelect: (id: string) => void };

export function Subcategories({ onBack, onSelect }: Props) {
  const { progress } = useProgress();
  const done = new Set(progress.stats.subcategoriesCompleted);
  const mixed = BIBLE_SUBCATEGORIES.find((s) => s.id === "mixed")!;
  const regular = BIBLE_SUBCATEGORIES.filter((s) => s.id !== "mixed");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <PageHeader
        back={{ label: "Categories", onClick: onBack }}
        title="Bible Trivia"
        lede="Choose what to explore. Each set is named for a traditional quilt block."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {regular.map((s) => (
          <SubcategoryCard key={s.id} sub={s} played={done.has(s.id)} onSelect={onSelect} />
        ))}
        <SubcategoryCard sub={mixed} played={done.has(mixed.id)} onSelect={onSelect} featured />
      </div>
    </div>
  );
}

function SubcategoryCard({
  sub,
  played,
  onSelect,
  featured = false,
}: {
  sub: Subcategory;
  played: boolean;
  onSelect: (id: string) => void;
  featured?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(sub.id)}
      className={cn(
        "press group relative flex rounded-[1.25rem] bg-surface p-5 text-left shadow-lift-1 hover:shadow-lift-2",
        "flex-col gap-4",
        featured && "stitched bg-peri-soft [--stitch-color:var(--fab-peri)] [--stitch-inset:6px] [--stitch-radius:1.25rem]",
      )}
    >
      <PatternGlyph pattern={sub.id} fabrics={sub.fabrics} className="h-16 w-16 shrink-0" />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-display text-xl font-bold tracking-[-0.02em]">
          {sub.name}
        </span>
        <span className="mt-1.5 text-[0.95rem] leading-[1.7] text-ink-soft">{sub.description}</span>
        <span className="mt-auto flex items-center justify-between gap-3 pt-4 text-sm text-ink-faint">
          <span>
            <span className="sr-only">Quilt block: </span>
            <em className="not-italic">{sub.pattern}</em>
            {played && <span className="ml-2 text-sage-text">· played</span>}
          </span>
          <ArrowRight className="h-4 w-4 text-ink-soft transition-transform duration-200 group-hover:translate-x-1 group-hover:text-ink" aria-hidden />
        </span>
      </span>
    </button>
  );
}
