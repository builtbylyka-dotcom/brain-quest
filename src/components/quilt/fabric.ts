import type { Fabric } from "@/data/categories";

const VARS: Record<Fabric, string> = {
  periwinkle: "var(--fab-peri)",
  sage: "var(--fab-sage)",
  gold: "var(--fab-gold)",
  coral: "var(--fab-coral)",
  emerald: "var(--fab-emerald)",
  muslin: "var(--fab-muslin)",
  navy: "var(--fab-navy-cloth)",
};

export const fabric = (f: Fabric) => VARS[f];

/** Fabric pairs used when a quilt row needs a pattern but has no subcategory. */
export const FALLBACK_PAIR: [Fabric, Fabric] = ["periwinkle", "gold"];
