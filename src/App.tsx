import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import { useEffect } from "react";
import { AchievementToasts } from "@/components/achievements/AchievementToasts";
import { AppShell } from "@/components/layout/AppShell";
import { useGame } from "@/hooks/useGame";
import { ProgressProvider, useProgress } from "@/hooks/useProgress";
import { Achievements } from "@/pages/Achievements";
import { Categories } from "@/pages/Categories";
import { Gameplay } from "@/pages/Gameplay";
import { Home } from "@/pages/Home";
import { Results } from "@/pages/Results";
import { Setup } from "@/pages/Setup";
import { Statistics } from "@/pages/Statistics";
import { Subcategories } from "@/pages/Subcategories";
import type { Screen } from "@/types/game";

/** Playing and feedback are one screen; everything else is its own. */
const screenKey = (s: Screen) => (s === "PLAYING" || s === "ANSWER_FEEDBACK" ? "PLAY" : s);

function Game() {
  const game = useGame();
  const { reduceMotion } = useProgress();
  const { state } = game;
  const key = screenKey(state.screen);
  const playing = key === "PLAY" && state.round !== null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [key]);

  let page: React.ReactNode;
  switch (state.screen) {
    case "CATEGORY_SELECTION":
      page = <Categories onBack={() => game.go("HOME")} onSelect={game.selectCategory} />;
      break;
    case "SUBCATEGORY_SELECTION":
      page = <Subcategories onBack={() => game.go("CATEGORY_SELECTION")} onSelect={game.selectSubcategory} />;
      break;
    case "SETUP":
      page = (
        <Setup
          draft={state.draft}
          onBack={game.backToSubcategories}
          onDifficulty={game.setDifficulty}
          onMode={game.setMode}
          onStart={game.startRound}
        />
      );
      break;
    case "PLAYING":
    case "ANSWER_FEEDBACK":
      page = state.round ? <Gameplay game={game} /> : null;
      break;
    case "RESULTS":
      page = state.summary ? (
        <Results
          summary={state.summary}
          onPlayAgain={game.startRound}
          onCategories={() => game.go("CATEGORY_SELECTION")}
          onHome={() => game.go("HOME")}
        />
      ) : null;
      break;
    case "ACHIEVEMENTS":
      page = <Achievements onBack={() => game.go("HOME")} />;
      break;
    case "STATISTICS":
      page = <Statistics onBack={() => game.go("HOME")} onAchievements={() => game.go("ACHIEVEMENTS")} />;
      break;
    default:
      page = (
        <Home
          onStart={() => game.go("CATEGORY_SELECTION")}
          onAchievements={() => game.go("ACHIEVEMENTS")}
          onStats={() => game.go("STATISTICS")}
        />
      );
  }

  return (
    <LazyMotion features={domAnimation} strict>
    <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>
      <AppShell
        focus={playing}
        onHome={() => game.go("HOME")}
        onAchievements={() => game.go("ACHIEVEMENTS")}
        onStats={() => game.go("STATISTICS")}
        active={state.screen === "ACHIEVEMENTS" ? "achievements" : state.screen === "STATISTICS" ? "stats" : null}
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={playing ? "" : "pt-2 pb-4 sm:pt-6"}
          >
            {page}
          </m.div>
        </AnimatePresence>
      </AppShell>
      <AchievementToasts raised={playing} />
    </MotionConfig>
    </LazyMotion>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <Game />
    </ProgressProvider>
  );
}
