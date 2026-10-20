# Brain Quest: Project Documentation

The source of truth for what Brain Quest does and how it works. Update it with every feature change (see `CLAUDE.md`).

## Table of Contents

1. [Overview](#overview)
2. [Visual identity](#visual-identity)
3. [Screens](#screens)
4. [Game flow & state machine](#game-flow--state-machine)
5. [Question bank](#question-bank)
6. [Question selection](#question-selection)
7. [Scoring](#scoring)
8. [Timer (Time Challenge)](#timer-time-challenge)
9. [Hints](#hints)
10. [Achievements](#achievements)
11. [Statistics & storage](#statistics--storage)
12. [Settings](#settings)
13. [Sharing](#sharing)
14. [Accessibility](#accessibility)
15. [Embedding & deployment](#embedding--deployment)
16. [Testing & QA tooling](#testing--qa-tooling)
17. [Known Limitations](#known-limitations)

---

## Overview

Brain Quest is a browser trivia game by Built By Lyka. Players pick a category, a subcategory, a difficulty and a mode, then answer 10 questions with explanations and Bible references. Version 1 has one playable category, **Bible Trivia**. Science, History, Geography, General Knowledge, Movies & Entertainment, and Animals & Nature show **Coming Soon** and cannot be started.

- Stack: React 19, TypeScript, Vite 8, Tailwind CSS v4, shadcn/ui (Dialog, Switch), lucide-react, Motion (`LazyMotion` + `m`), Vitest.
- No backend, accounts, cookies, external APIs or AI calls. Everything is bundled.
- Navigation is a reducer-driven state machine, not a router (works the same standalone and in an iframe).

## Visual identity

**Concept: a modern patchwork quilt you sew one answer at a time.** Every question is a patch, a finished round is a row, and the player's history is a growing quilt.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--ground` | `#F7F1E5` muslin ivory | `#151A2E` | page background |
| `--surface` | `#FFFBF4` | `#1D2340` | labels/cards |
| `--ink` | `#1F2443` navy thread | `#F3ECDD` | text |
| `--primary` | `#4D53AE` | `#A5AAF0` | primary buttons, focus ring |
| `--fab-peri` | `#8C92DE` | `#7E85D4` | periwinkle fabric |
| `--fab-sage` | `#A3BC9C` | `#8AA684` | sage fabric |
| `--fab-gold` | `#E3AE4E` | `#D9A443` | gold: achievements & hints only |
| `--fab-coral` | `#E8907F` | `#D98271` | coral: incorrect only |
| `--fab-emerald` | `#5BAE88` | `#4C9E7A` | emerald: correct only |

- **Colour laws:** emerald means correct, coral means incorrect, gold is reserved for achievements and hints.
- **Type:** Bricolage Grotesque Variable (display, `-0.03em` tracking) and Nunito Sans Variable (body, 1.6–1.7 line-height). Both are self-hosted via Fontsource.
- **Patches:** a correct answer is a half-square triangle in the subcategory's two fabrics. A miss is muslin with a small coral cross-stitch mend, a timeout is muslin with a small dashed coral ring, and an unanswered slot is a dashed seam (the current one has a gold dot).
- **Materials:** half-square-triangle patches, running-stitch dashed seams (`.stitched` utility), flat fabric fields, and a woven grain overlay (SVG noise). There are two faint radial washes on the page background.
- **Depth:** `shadow-lift-1/2/3` are layered navy-tinted shadows (base → elevated label → floating dialog/toast).
- **Motion:** only `transform`/`opacity` animate. `--ease-spring` handles press feedback and `--ease-out-expo` handles reveals. The signature moment is a patch "sewing in" (scale + rotate) when a question is answered.
- **Pattern glyphs:** each Bible subcategory is drawn as a simplified real traditional quilt block: Jacob's Ladder, Star of Bethlehem, Joseph's Coat, Carpenter's Wheel, Wonder of the World, Solomon's Puzzle, Tree of Life and Crazy Quilt (`components/quilt/PatternGlyph.tsx`).
- Logo/favicon: `public/favicon.svg` and `components/layout/BrandMark.tsx` (an original patch with a star).

## Screens

| Screen (state) | File | Contents |
| --- | --- | --- |
| Home (`HOME`) | `pages/Home.tsx` | Quilt band: first-time visitors see a sample of diagonal stripes. Once a round is finished, the sample is retired and the band shows only the player's last 3 rounds as rows (newest on top) on plain muslin. Then a muslin label with **Ready for a Brain Quest?**, subheading, **Start Playing** and **My Achievements** buttons, and a stats strip (games played, best score, questions answered, best streak). First-time visitors see a welcome note instead of the strip. Also has an About section and a link to Statistics. |
| Categories (`CATEGORY_SELECTION`) | `pages/Categories.tsx` | Featured Bible Trivia card with **Play Now**. Six Coming Soon cards (`aria-disabled`, not clickable). |
| Subcategories (`SUBCATEGORY_SELECTION`) | `pages/Subcategories.tsx` | 8 cards, each with a pattern glyph, name, description, quilt block name, and a "played" marker. Mixed Bible Challenge is visually distinguished. |
| Setup (`SETUP`) | `pages/Setup.tsx` | Difficulty (Easy/Medium/Hard radio cards with points), Game mode (Classic / Time Challenge), a **How to play** panel (rules, streaks, time bonus, hints, shortcuts, KJV note), and **Start round**. It shows the pool size and handles short or empty pools. |
| Gameplay (`PLAYING`) | `pages/Gameplay.tsx` | Exit button (confirm dialog), category · subcategory, difficulty chip, mode, **n / 10**, a round row (10 patch slots, current marked with a gold dot) that doubles as the progress bar, a timer thread (timed mode), the question card (Finish the Verse shows a "KJV" chip), four answer buttons A–D, and a sticky bottom bar on all widths with score, streak flame and **Hint** (2 dots). After answering, the page scrolls only as far as needed to reveal **Next**. |
| Feedback (`ANSWER_FEEDBACK`) | `components/game/FeedbackPanel.tsx` | Choices lock. The correct answer shows emerald with a check; a wrong pick shows coral with an X and the rest dim. The panel gives a verdict, the correct answer (when missed), explanation, reference chip (+ translation), points breakdown, and **Next Question** / **See Results**, which gets focus. |
| Results (`RESULTS`) | `pages/Results.tsx` | The finished row sewn in patch by patch, an accuracy title + encouraging message, animated score, correct / incorrect / accuracy / best streak, category / difficulty / mode, **Share results**, **Play Again**, **Choose Another Category** and **Back to Home**. |
| Achievements (`ACHIEVEMENTS`) | `pages/Achievements.tsx` | 8 badges with unlocked (gold, date) and locked (dashed, lock) states, plus an "n of 8 unlocked" count. |
| Statistics (`STATISTICS`) | `pages/Statistics.tsx` | Overview (games, answered, correct, accuracy, highest score, longest streak), strip-pieced bars by difficulty and by category, the full quilt (up to 24 rows), an achievements link, and **Reset Progress** behind a confirm dialog. |
| Settings dialog | `components/layout/SettingsDialog.tsx` | Sound, Reduced motion, Theme (System/Light/Dark). |

The site header (logo → home, Achievements, Stats, Settings) and the footer maker's label (**Made with ♡ by Built By Lyka** → https://builtbylyka.com/) are hidden during gameplay.

## Game flow & state machine

`lib/gameEngine.ts` exports a pure reducer, and `hooks/useGame.ts` wraps it with side effects (sounds, round building, committing results).

States: `HOME → CATEGORY_SELECTION → SUBCATEGORY_SELECTION → SETUP → PLAYING ⇄ ANSWER_FEEDBACK → RESULTS`, plus `ACHIEVEMENTS` and `STATISTICS`.

Guards:
- `ANSWER` and `TIMEOUT` are accepted only in `PLAYING`, and only once per question. A second click is a no-op, so a question can't be scored twice.
- Hidden (hinted-away) options can't be selected.
- `NEXT` works only in `ANSWER_FEEDBACK`, so questions can't be skipped. On the last question it builds the `RoundSummary` and moves to `RESULTS`.
- `EXIT_ROUND` discards the round, which is not saved.
- Results are committed exactly once: once by a ref guard in `useGame`, and once by `lastRoundId` in `applyRound` (idempotent).

## Question bank

- `src/data/bible/*.ts`, one file per subcategory, built with `buildBank()` (`data/bible/build.ts`). Authors write the correct answer first; the helper rotates it into a varied slot.
- **210 questions**: 7 subcategories (Old Testament, New Testament, Bible Characters, Life of Jesus, Miracles & Wonders, Who Said It?, Finish the Verse) × 3 difficulties × 10. That's 70 easy, 70 medium and 70 hard.
- Every question has `id`, `category`, `subcategory`, `difficulty`, `question`, 4 `options`, `correctAnswerIndex`, `explanation` and `reference` (Book chapter:verse).
- **Finish the Verse** uses the **King James Version** only; the blank is shown as `____`. **Who Said It?** quotes use KJV wording, and each cites the passage naming the speaker.
- Mixed Bible Challenge has no stored questions. It draws from all seven.
- `data/questionBank.ts` aggregates every playable bank.

## Question selection

`lib/questionSelector.ts`:
- `filterPool` matches category + difficulty, and the subcategory unless it is `mixed`. It never widens the filter.
- `buildRound` shuffles with Fisher–Yates (injectable RNG) and takes up to 10. A smaller pool gives a shorter round, and an empty pool means no round (Setup explains why).
- **Mixed** deals round-robin across subcategories (all 7 appear in every round, none more than twice), then shuffles.
- `shuffleOptions` shuffles the answers and remaps `correctIndex`.

## Scoring

`lib/scoring.ts`, pure and deterministic:
- Base: Easy 100, Medium 150, Hard 200.
- Streak bonus for a correct answer that makes the streak *n* ≥ 2: `min(10n, 100)`. That's +20, +30, … capped at +100.
- Time bonus (Time Challenge, correct only): `round(50 × secondsLeft / 20)`, clamped 0–50.
- Wrong or timed-out answers score 0 and reset the streak. The score never goes negative.
- Result titles: 0–39% Curious Explorer · 40–59% Growing Learner · 60–79% Knowledge Seeker · 80–99% Wisdom Keeper · 100% Brain Quest Champion.

## Timer (Time Challenge)

`hooks/useTimer.ts`: 20 seconds per question.
- One `setInterval` per running question, keyed by `roundId:index`. It is cleared on answer, question change, exit and unmount.
- Elapsed time is measured from `performance.now()` deltas. Ticks while `document.hidden` are ignored, and the clock restarts on `visibilitychange`. A gap over 1.5 s (device sleep) is not counted.
- It pauses while the Exit confirmation is open.
- At 0 it dispatches `TIMEOUT` once. The question counts as incorrect and the feedback reads "Time's up".

## Hints

`lib/hints.ts`: 2 hints per round. Each hint removes two random **incorrect** options from the shuffled list. A hint can't be used after answering, can't be used twice on one question, and costs no points. Removed options appear struck through and disabled. The **H** key uses a hint.

## Achievements

`data/achievements.ts` (definitions) and `lib/achievements.ts` (rules):

| Id | Name | Unlocks when |
| --- | --- | --- |
| `first-steps` | First Steps | 1 game completed |
| `getting-started` | Getting Started | 10 correct answers total |
| `on-a-roll` | On a Roll | 5 correct in a row (unlocks live, mid-round) |
| `perfect-round` | Perfect Round | 10/10 in a round |
| `bible-explorer` | Bible Explorer | rounds completed in 3 different Bible subcategories (Mixed counts as one) |
| `quick-thinker` | Quick Thinker | a Time Challenge round completed |
| `dedicated-learner` | Dedicated Learner | 10 games completed |
| `bible-scholar` | Bible Scholar | 100 Bible questions correct |

Unlock dates are stored as ISO strings. New unlocks show a non-blocking toast (`components/achievements/AchievementToasts.tsx`, `aria-live="polite"`, auto-dismiss after 4.8 s) and play a chime. On mobile the toast sits at the bottom of the screen, raised above the score bar during gameplay. On desktop it sits bottom-right.

## Statistics & storage

`lib/storage.ts` uses the key `brainquest:progress` (schema v1) and `brainquest:settings`.
- Stats: games played, questions answered, correct answers, highest score, longest streak, Bible correct, perfect rounds, timed rounds, games by category / difficulty / mode, and Bible subcategories completed.
- Quilt: the last 24 rounds as rows of patches (`c` correct, `w` wrong, `t` timed out).
- Safety: every read is wrapped in try/catch, and corrupted JSON falls back to defaults. Each field is validated (finite non-negative integers, known ids only, `correct ≤ answered`). A `migrate()` hook handles older shapes. If `localStorage` is unavailable (private mode or blocked in an iframe), an in-memory store is used.
- **Reset Progress** (Statistics, after confirmation) deletes progress but keeps settings.
- No personal data is collected.

## Settings

The gear in the header opens the dialog:
- **Sound effects:** synthesized Web Audio blips (`lib/sound.ts`) for select, correct, wrong, hint and achievement. Nothing autoplays. If audio fails it is silently disabled.
- **Reduced motion:** turns off non-essential motion (`MotionConfig reducedMotion="always"`, press transforms off). The OS `prefers-reduced-motion` setting is always respected; when it's on, the switch shows as on and locked.
- **Theme:** System / Light / Dark. It is applied before first paint by an inline script in `index.html` (`data-theme` on `<html>`) and updates the `theme-color` meta.

## Sharing

**Share results** builds score-only text (`lib/share.ts`): mode, a row of 🟪/⬜ patches, correct/total, accuracy, points, the title and the site URL. It tries the Web Share API first, then the clipboard, and finally a dialog with a read-only textarea and **Copy text**.

## Accessibility

- Semantic landmarks, a skip link, and one `h1` per screen that takes focus on mount. The question heading takes focus on each new question.
- Visible focus ring (3px primary outline) on everything. Every control has hover, focus-visible and active states.
- Answer buttons carry full labels ("B: Daniel, correct answer"). Feedback sits in a polite live region, and focus moves to **Next**.
- The round progress row is a `progressbar` with value text, and the timer is `role="timer"`.
- Shortcuts: **1–4** / **A–D** answer, **H** hint, **Enter** continue, **Esc** closes dialogs. They are ignored in text fields, while a dialog is open, and with modifier keys.
- Tap targets are at least 44px, and layouts are checked at 320, 375, 430, 768, 1024 and 1440 px in both themes with no horizontal scroll.

## Embedding & deployment

- **Hosting: Vercel.** `vercel.json` sets the Vite preset, build `npm run build`, output `dist`, an SPA rewrite to `index.html`, `Content-Security-Policy: frame-ancestors *` (embeddable anywhere; restrict it as needed), and **no** `X-Frame-Options`. It also sets `nosniff`, a referrer policy, and immutable caching for `/assets/*`.
- The game needs no popups, permissions, cookies or minimum width, and works inside an iframe.
- SEO: title, meta description, Open Graph/Twitter tags, `og-image.png` (1200×630), favicon SVG, apple-touch icon, and per-scheme `theme-color`.
- See `README.md` for pushing to GitHub, Vercel deploy steps, and an iframe snippet.

## Testing & QA tooling

- `npm test` runs 266 Vitest tests: scoring, selection (no duplicates, filters, Mixed spread, shuffle correctness), the engine (double answers, timeouts, NEXT guard, summary), hints, storage (corrupt/missing/invalid/migration/reset), achievements (every rule, idempotence, live streak), the timer (countdown, stop, reset, hidden-tab pause, cleanup, single interval), and question-bank integrity (counts, unique ids, 4 distinct options, reference format against the 66 book names).
- `node serve.mjs` serves `dist/` at http://localhost:3000.
- `node screenshot.mjs <url> [label] [--width=] [--height=] [--theme=light|dark] [--full]` writes to `temporary screenshots/`.

## Known Limitations

| Area | Limitation |
| --- | --- |
| Categories | Only Bible Trivia is playable. Six categories are placeholders marked Coming Soon. |
| Replay variety | Each subcategory × difficulty has exactly 10 questions, so replaying the same combination shows the same 10 in a new order. Mixed rounds vary the most. |
| Question accuracy | Questions were written and cross-checked against the KJV text by hand, without automated verse lookup. A reviewer familiar with scripture should spot-check them before a wide launch. |
| Progress | Stored per browser/device only. No sync, and clearing site data erases it. |
| Link previews | `og:image` is a relative URL. Set it to an absolute URL after the final domain is known. |
| Sound | Synthesized tones only, with no music. Some browsers block audio until first interaction (by design). |
| Bundle | About 172 kB gzipped JS (mostly React DOM and Motion). |

---

_Last updated: 2026-10-20. Initial release (v1.0.0): full Bible Trivia game, quilt visual system, achievements, statistics, settings, sharing, tests, Netlify config. Design-review fixes: home quilt shows only real rows once played; quieter miss patches; sticky gameplay bar; toast placement; Bible card no longer uses gold; body line-height 1.7. See `DESIGN.md` for the design system. Hosting switched from Netlify to Vercel (`vercel.json` replaces `netlify.toml`)._
