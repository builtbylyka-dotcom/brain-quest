import { ChartColumn, Settings, Trophy } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BrandMark } from "./BrandMark";
import { SettingsDialog } from "./SettingsDialog";

type Props = {
  children: ReactNode;
  onHome: () => void;
  onAchievements: () => void;
  onStats: () => void;
  /** Gameplay hides the site chrome to stay distraction-free. */
  focus?: boolean;
  active?: "achievements" | "stats" | null;
};

export function AppShell({ children, onHome, onAchievements, onStats, focus = false, active = null }: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navBtn =
    "press inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl px-2.5 text-sm font-semibold text-ink-soft hover:bg-ground-deep hover:text-ink active:bg-line sm:px-3.5";

  return (
    <div className="relative flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-xl bg-primary px-4 py-2 font-semibold text-on-primary focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      {!focus && (
        <header className="relative z-20">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
            <button
              type="button"
              onClick={onHome}
              className="press -ml-1.5 flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-ground-deep active:bg-line"
              aria-label="Brain Quest, back to home"
            >
              <BrandMark className="h-8 w-8 min-[360px]:h-9 min-[360px]:w-9" />
              <span className="font-display text-lg font-extrabold tracking-[-0.03em] whitespace-nowrap min-[360px]:text-xl">Brain Quest</span>
            </button>
            <nav aria-label="Main" className="flex items-center gap-0.5 sm:gap-1">
              <button
                type="button"
                onClick={onAchievements}
                className={cn(navBtn, active === "achievements" && "bg-gold-soft text-ink")}
                aria-current={active === "achievements" ? "page" : undefined}
              >
                <Trophy className="h-5 w-5" aria-hidden />
                <span className="hidden sm:inline">Achievements</span>
                <span className="sr-only sm:hidden">Achievements</span>
              </button>
              <button
                type="button"
                onClick={onStats}
                className={cn(navBtn, active === "stats" && "bg-peri-soft text-ink")}
                aria-current={active === "stats" ? "page" : undefined}
              >
                <ChartColumn className="h-5 w-5" aria-hidden />
                <span className="hidden sm:inline">Stats</span>
                <span className="sr-only sm:hidden">Statistics</span>
              </button>
              <button type="button" onClick={() => setSettingsOpen(true)} className={navBtn} aria-label="Settings">
                <Settings className="h-5 w-5" aria-hidden />
              </button>
            </nav>
          </div>
        </header>
      )}

      <main id="main" className="relative z-10 flex-1">
        {children}
      </main>

      {!focus && <Footer />}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}

/** A maker's label, the way quilters sign the back corner of a finished quilt. */
function Footer() {
  return (
    <footer className="relative z-10 px-4 pt-12 pb-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl justify-center">
        <a
          href="https://builtbylyka.com/"
          target="_blank"
          rel="noopener"
          className="press stitched inline-flex items-center gap-2 rounded-xl bg-surface px-5 py-3 text-sm font-semibold text-ink-soft no-underline shadow-lift-1 [--stitch-inset:4px] [--stitch-radius:0.75rem] hover:text-ink hover:shadow-lift-2 active:bg-ground-deep"
        >
          Made with <span className="text-coral-text" aria-label="love">♡</span> by
          <span className="font-display font-bold text-ink">Built By Lyka</span>
        </a>
      </div>
    </footer>
  );
}
