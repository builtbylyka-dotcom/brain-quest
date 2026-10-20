import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/categories/CategoryIcon";
import { PageHeader } from "@/components/layout/PageHeader";
import { Patch } from "@/components/quilt/Patch";
import { fabric } from "@/components/quilt/fabric";
import { CATEGORIES, type Category } from "@/data/categories";
import type { CategoryId } from "@/types/questions";
import { cn } from "@/lib/utils";

type Props = { onBack: () => void; onSelect: (id: CategoryId) => void };

export function Categories({ onBack, onSelect }: Props) {
  const [featured, ...rest] = [...CATEGORIES].sort((a, b) => Number(b.available) - Number(a.available));
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <PageHeader
        back={{ label: "Home", onClick: onBack }}
        title="Pick a category"
        lede="Bible Trivia is ready to play. More fabrics are on the cutting table."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FeaturedCard category={featured} onSelect={onSelect} />
        {rest.map((c) => (c.available ? <FeaturedCard key={c.id} category={c} onSelect={onSelect} /> : <ComingSoonCard key={c.id} category={c} />))}
      </div>
    </div>
  );
}

function SwatchStrip({ category, className }: { category: Category; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-1", className)} aria-hidden>
      <Patch kind="correct" fabrics={category.fabrics} turn={1} />
      <Patch kind="correct" fabrics={[category.fabrics[1], category.fabrics[0]]} turn={2} />
    </div>
  );
}

function FeaturedCard({ category, onSelect }: { category: Category; onSelect: (id: CategoryId) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(category.id)}
      className="press group stitched relative flex flex-col gap-6 overflow-hidden rounded-[1.5rem] bg-surface p-6 text-left shadow-lift-2 [--stitch-inset:8px] [--stitch-radius:1.5rem] hover:shadow-lift-3 sm:col-span-2 sm:flex-row sm:items-center sm:p-8 lg:col-span-3"
    >
      <span
        className="absolute inset-y-0 right-0 hidden w-2/5 opacity-90 md:block"
        style={{
          backgroundImage: `linear-gradient(135deg, transparent 49.5%, ${fabric(category.fabrics[1])} 50%)`,
        }}
        aria-hidden
      />
      <span className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-peri text-navy shadow-lift-1 sm:h-24 sm:w-24">
        <CategoryIcon icon={category.icon} className="h-10 w-10 sm:h-12 sm:w-12" />
      </span>
      <span className="relative min-w-0 flex-1">
        <span className="block font-display text-[clamp(1.8rem,1.3rem+1.8vw,2.6rem)] leading-none font-extrabold tracking-[-0.03em]">
          {category.name}
        </span>
        <span className="mt-3 block max-w-md text-lg leading-[1.6] text-ink-soft">{category.description}</span>
        <span className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-primary px-6 font-semibold text-on-primary shadow-lift-1 group-hover:shadow-lift-2 group-active:bg-primary-press">
          Play Now
          <ArrowRight className="h-5 w-5" aria-hidden />
        </span>
      </span>
      <SwatchStrip category={category} className="relative hidden w-28 shrink-0 md:grid" />
    </button>
  );
}

function ComingSoonCard({ category }: { category: Category }) {
  return (
    <div
      aria-disabled="true"
      aria-label={`${category.name}: coming soon`}
      className="relative flex items-start gap-4 rounded-[1.25rem] border border-dashed border-stitch bg-surface/60 p-5"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muslin text-ink-soft">
        <CategoryIcon icon={category.icon} className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-display text-xl font-bold tracking-[-0.02em] text-ink">{category.name}</span>
          <span className="rounded-full border border-dashed border-stitch px-2.5 py-0.5 text-xs font-bold text-ink-soft">Coming Soon</span>
        </span>
        <span className="mt-1.5 block text-[0.95rem] leading-[1.7] text-ink-soft">{category.description}</span>
      </span>
      <SwatchStrip category={category} className="hidden w-10 shrink-0 opacity-45 saturate-50 sm:grid" />
    </div>
  );
}
