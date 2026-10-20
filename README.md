# Brain Quest

**A little challenge for a curious mind.** A browser trivia game by [Built By Lyka](https://builtbylyka.com/).

Pick a category, choose a difficulty and mode, and answer ten questions. Every answer becomes a patch in your quilt, and every finished round is sewn in as a new row. Version 1 ships **Bible Trivia** (210 questions across 7 subcategories plus a Mixed Challenge). The other categories are shown as "Coming Soon".

Everything runs in the browser. There's no backend, no account, and no external API calls. Progress is stored in `localStorage` on the player's device.

## Run it locally

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with hot reload |
| `npm run build` | Type-checks (`tsc -b`) and builds to `dist/` |
| `npm run preview` | Serves the built `dist/` via Vite |
| `npm test` | Runs the Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |
| `node serve.mjs` | Serves `dist/` at http://localhost:3000 (used for screenshots) |
| `node screenshot.mjs <url> [label] [--width=375] [--theme=dark] [--full]` | Puppeteer screenshot into `temporary screenshots/` |

Requires Node 20+ (built and tested on Node 24). No environment variables are needed.

## Tech

React 19 · TypeScript · Vite 8 · Tailwind CSS v4 · shadcn/ui (Dialog, Switch on Radix) · lucide-react · Motion (LazyMotion) · Vitest. Fonts (Bricolage Grotesque, Nunito Sans) are self-hosted via Fontsource, so nothing loads from third-party hosts.

## Project layout

```
src/
  data/            categories, achievements, question banks (data/bible/*.ts)
  lib/             pure game logic: gameEngine (reducer), scoring, questionSelector,
                   hints, achievements, storage, share, sound
  hooks/           useGame, useTimer, useProgress (context)
  components/      quilt/, game/, layout/, achievements/, categories/, ui/
  pages/           Home, Categories, Subcategories, Setup, Gameplay, Results,
                   Achievements, Statistics
```

All game rules live in `src/lib` as pure functions and are unit-tested. The UI only dispatches actions.

## Adding a category or questions

1. Create a question file (see `src/data/bible/build.ts` for the authoring helper). Each question needs an `id`, `category`, `subcategory`, `difficulty`, `question`, four `options`, `correctAnswerIndex`, `explanation`, and `reference`.
2. Spread it into `QUESTION_BANK` in `src/data/questionBank.ts`.
3. Set `available: true` for the category in `src/data/categories.ts`, and give it subcategories.
4. Add an integrity test like `src/data/bibleQuestions.test.ts`.

The engine, selector and scoring need no changes.

## Push to GitHub

One-time setup (skip any step you've already done):

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Create an **empty** repository on github.com (no README, .gitignore, or license), then from the project folder:

```bash
git add .
git commit -m "Brain Quest v1"
git remote add origin https://github.com/YOUR-USERNAME/brain-quest.git
git push -u origin main
```

When Git asks for a password, use a GitHub **personal access token**, not your account password. Alternatively, use GitHub Desktop or `gh auth login` with the GitHub CLI.

## Deploy to Vercel

`vercel.json` is included: Vite framework preset, build `npm run build`, output `dist`, an SPA rewrite, and embed-friendly headers. No environment variables are needed.

- **From GitHub (recommended):** go to vercel.com → **Add New… → Project** → import the GitHub repo → **Deploy**. Every push to `main` redeploys automatically, and pull requests get preview URLs.
- **From the terminal:** `npm i -g vercel`, then `vercel` (preview) and `vercel --prod` (production).

After you know the final URL, consider making `og:image` in `index.html` an absolute URL (e.g. `https://your-project.vercel.app/og-image.png`) for the most reliable link previews.

## Embedding

The game works inside an iframe: no popups, permissions, cookies, or minimum width.

```html
<iframe
  src="https://YOUR-PROJECT.vercel.app/"
  title="Brain Quest trivia game"
  style="width: 100%; max-width: 960px; height: 820px; border: 0; border-radius: 16px"
  loading="lazy"
></iframe>
```

`vercel.json` sends `Content-Security-Policy: frame-ancestors *`, which allows any site to embed the game. To restrict it to your own pages, change it to e.g. `frame-ancestors 'self' https://builtbylyka.com`. Don't add `X-Frame-Options: DENY`/`SAMEORIGIN`; that would block embedding. If a browser blocks storage inside the iframe, the game still plays and keeps progress in memory for the session.
