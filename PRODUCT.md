# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
React + TypeScript + Vite + Tailwind CSS v4, shadcn/ui (Dialog, Switch only), lucide-react, Motion. LocalStorage for progress. No backend, no auth, no external APIs. Deploys to Vercel as a static SPA (the brief said Netlify; the user switched to Vercel on 2026-10-20).

## Users
Friends, family, and curious visitors who follow Built By Lyka. They play casually on phones and laptops in short sessions, often from a shared link. Later, visitors to Lyka's AI developer profile will play it embedded in an iframe as a showcase of a polished, AI-assisted build. Bible Trivia players range from casual learners to people who know scripture well.

## Product Purpose
Brain Quest is a browser trivia game: pick a category, pick a difficulty, answer ten questions, and earn points, streaks and achievements while trying to beat your personal best. Success means people actually enjoy a round, learn something from the explanations, and come back for another.

## Positioning
A thoughtfully crafted indie trivia game, not a quiz template. Every answer teaches something: a short explanation plus a real Bible reference follows each question. Progress lives entirely on the player's device.

## Operating Context
- Short play sessions of about 3–6 minutes per 10-question round, often on mobile.
- Two modes: Classic (untimed, for learning) and Time Challenge (20s per question).
- Often played inside an iframe on a developer profile; must not depend on popups, permissions, cookies, or a minimum viewport width.

## Capabilities and Constraints
- V1: only Bible Trivia is playable, with 8 subcategories (7 with stored questions plus a Mixed Challenge). Six other categories show "Coming Soon" and can't be started.
- 210 bundled questions (10 per subcategory × difficulty). Every one is accurate, with a real reference. Finish the Verse uses the KJV only.
- Scoring, streaks, a time bonus, 2 hints per round, 8 achievements, local statistics, and reset progress.
- Settings: sound, reduced motion, light/dark theme.
- No accounts, no personal data, no AI calls during play.

## Brand Commitments
- Name: **Brain Quest**. Tagline: "A little challenge for a curious mind."
- Made by **Built By Lyka** (https://builtbylyka.com/). Branding stays subtle: "Made with ♡ by Built By Lyka".
- Palette pinned by the brief: warm ivory/soft cream background, deep navy/charcoal text, muted periwinkle/lavender primary, soft sage secondary, warm gold for achievements, muted coral for errors, soft emerald for success.
- Feel: beautiful, playful, modern, cozy, premium, memorable. Avoid: SaaS dashboards, corporate layouts, excessive gradients, floating blobs, glassmorphism, childish illustration, emoji clutter, default quiz forms.
- Body font: a friendly modern sans (the brief suggests DM Sans, Nunito Sans or Plus Jakarta Sans). An optional tasteful display face for large headings.

## Evidence on Hand
No logos, photos, or brand assets exist yet; the favicon and illustration are authored originals. There are no player counts, testimonials, or ratings, and none may be invented.

## Product Principles
1. Accuracy over volume: a question that can't be verified gets replaced, never shipped.
2. The player controls the pace: explanations are never auto-skipped.
3. Never make players feel bad: encouraging copy at every score.
4. Private by default: all progress stays on the device.
5. Built to grow: new categories plug in as data, not engine rewrites.

## Accessibility & Inclusion
WCAG 2.1 AA: keyboard play, visible focus, screen-reader announcements for feedback, sufficient contrast, reduced-motion support, and large tap targets on mobile (down to 320px wide).
