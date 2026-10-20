---
name: Brain Quest
description: A patchwork quilt you sew one answer at a time.
colors:
  ground: "#f7f1e5"
  ground-deep: "#efe6d3"
  surface: "#fffbf4"
  surface-raised: "#ffffff"
  ink: "#1f2443"
  ink-soft: "#464c6c"
  ink-faint: "#61668a"
  line: "#e3d8c3"
  stitch: "#b3a68b"
  primary: "#4d53ae"
  primary-press: "#3f4597"
  on-primary: "#fffbf4"
  accent-text: "#4d53ae"
  fab-peri: "#8c92de"
  fab-peri-soft: "#dcddf6"
  fab-sage: "#a3bc9c"
  fab-sage-soft: "#e1eadb"
  fab-gold: "#e3ae4e"
  fab-gold-soft: "#f6e4be"
  fab-coral: "#e8907f"
  fab-coral-soft: "#f8ddd6"
  fab-emerald: "#5bae88"
  fab-emerald-soft: "#d5ede1"
  fab-navy: "#2e3560"
  fab-muslin: "#ebe1cc"
  sage-text: "#46663f"
  gold-text: "#845c10"
  coral-text: "#a8412f"
  emerald-text: "#1f6a49"
typography:
  display:
    fontFamily: "Bricolage Grotesque Variable, Nunito Sans Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 1.6rem + 3.6vw, 4.4rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Bricolage Grotesque Variable, Nunito Sans Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 1.4rem + 3vw, 3.4rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  question:
    fontFamily: "Bricolage Grotesque Variable, Nunito Sans Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.45rem, 1.05rem + 1.9vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Bricolage Grotesque Variable, Nunito Sans Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Nunito Sans Variable, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  lede:
    fontFamily: "Nunito Sans Variable, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Nunito Sans Variable, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.25
  stat:
    fontFamily: "Bricolage Grotesque Variable, Nunito Sans Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    fontFeature: "tnum"
rounded:
  control: "0.75rem"
  button: "1rem"
  answer: "1.1rem"
  card: "1.25rem"
  label: "1.5rem"
  frame: "1.75rem"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  3xl: "40px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.button}"
    padding: "0 20px"
    height: "44px"
  button-primary-lg:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.button}"
    padding: "0 28px"
    height: "56px"
  button-primary-active:
    backgroundColor: "{colors.primary-press}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "0 20px"
    height: "44px"
  button-secondary-active:
    backgroundColor: "{colors.ground-deep}"
  button-ghost:
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.ground-deep}"
  answer-option:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.answer}"
    padding: "12px 16px 12px 12px"
    height: "68px"
  answer-option-correct:
    backgroundColor: "{colors.fab-emerald-soft}"
  answer-option-wrong:
    backgroundColor: "{colors.fab-coral-soft}"
  quilt-label:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.label}"
    padding: "40px"
  category-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "20px"
  reference-chip:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  nav-item:
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.control}"
    height: "44px"
  nav-item-achievements-active:
    backgroundColor: "{colors.fab-gold-soft}"
    textColor: "{colors.ink}"
  nav-item-stats-active:
    backgroundColor: "{colors.fab-peri-soft}"
    textColor: "{colors.ink}"
---

# Design System: Brain Quest

## Overview

**Creative North Star: "The Answer Quilt"**

Brain Quest is a modern patchwork quilt you sew one answer at a time. Every question is a patch, a round is a row of ten, and a player's history is a quilt that grows across the home screen. The ground is unbleached muslin, the ink is navy thread, and colour arrives as flat fabric laid with full commitment: periwinkle, sage, gold, coral and emerald, pieced into half-square triangles and edged with dashed running stitches.

The system is cozy but not childish. Large Bricolage Grotesque headings sit on calm Nunito Sans body copy with generous 1.7 leading; surfaces are sewn-on labels with a running stitch just inside the edge; depth is soft and navy-tinted rather than grey. Modern-quilt negative space matters as much as the fabric: plain muslin patches and quiet ground are the canvas the coloured patches read against. Statistics and progress are drawn as quilt geometry (patch rows, strip-pieced bars), never stock charts.

The first visit shows a sample cloth of diagonal fabric stripes. Once the player has any history, the quilt shows only their real rows plus plain muslin; the sample is unpicked.

**Key Characteristics:**
- Muslin ground, navy ink, flat fabric fields; no gradients on fabric.
- Half-square-triangle patches with dashed running-stitch seams.
- Sewn-label surfaces: a dashed stitch inset 4 to 8px from the edge of primary buttons, dialogs, question cards and the home label.
- Strict colour law: emerald means correct, coral means incorrect, gold means achievements and hints.
- Soft, layered, navy-tinted elevation; motion is transform and opacity only, with a springy settle.

## Colors

A warm muslin-and-navy ground carrying a small, law-bound set of flat fabric colours; every colour has a light and dark value, switched by `data-theme` on the root.

### Primary
- **Sewing-Box Periwinkle** (primary): the solid fill of primary buttons and the focus ring colour. Pressed state deepens to Primary Press. Text-weight links and accents use Accent Text, which matches primary in light mode and lifts to a paler periwinkle in dark mode.
- **Periwinkle Cloth** (fab-peri / fab-peri-soft): periwinkle as fabric: quilt patches, the timer thread, the active Stats nav item (soft), text selection.

### Secondary
- **Pressed Sage** (fab-sage / fab-sage-soft / sage-text): calm fabric and informational tint. The first-visit welcome note and the Finish-the-Verse tag sit on sage-soft with sage-text.

### Tertiary (the signal fabrics)
- **Ribbon Emerald** (fab-emerald / fab-emerald-soft / emerald-text): correct answers only. Correct answer border, its soft fill, the check tile, the "Correct" feedback heading.
- **Mended Coral** (fab-coral / fab-coral-soft / coral-text): incorrect answers only. Wrong answer border and fill, the cross-stitch on a missed patch, the "Not quite" heading.
- **Medal Gold** (fab-gold / fab-gold-soft / gold-text): achievements and hints only. Unlocked achievement tiles and their stitch, the achievement toast, the Achievements nav state, the hint lightbulb and hint dots.

### Neutral
- **Unbleached Muslin** (ground): page background. Ground Deep is the hover and pressed wash for ghost and secondary controls.
- **Fresh Calico** (surface) and **White Cotton** (surface-raised): sewn labels, cards, answer tiles; raised is for chips and toasts that sit on a surface.
- **Navy Thread** (ink), **Faded Thread** (ink-soft), **Worn Thread** (ink-faint): headings and body, secondary copy, disabled and tertiary copy.
- **Seam Line** (line) and **Running Stitch** (stitch): hairline borders and the dashed stitch colour.
- **Plain Muslin Patch** (fab-muslin): an unsewn or missed patch, letter tiles on idle answers, empty tracks.
- **Quilt Navy** (fab-navy): the dialog scrim and the ink on gold, emerald and coral tiles. As quilt cloth it lifts to a lighter navy in dark mode so it still reads against the dark ground.

### Named Rules
**The Colour Law Rule.** Emerald means correct, coral means incorrect, gold means achievements and hints. No signal colour is borrowed for decoration, status, or emphasis elsewhere in the interface.

**The Cloth Exception Rule.** Inside the quilt itself (patches, category and pattern swatches, the brand mark), every fabric is cloth, not signal, and may be pieced freely. A correct patch is a half-square triangle in the round's two fabrics; a missed answer is a muslin patch with a small coral cross-stitch; a timed-out answer is muslin with a small dashed coral ring.

**The Text-Tone Rule.** Fabric fills are too light for text. Any coloured text uses the matching `-text` token (sage-text, gold-text, coral-text, emerald-text, accent-text).

## Typography

**Display Font:** Bricolage Grotesque Variable (with Nunito Sans Variable, system sans)
**Body Font:** Nunito Sans Variable (with ui-sans-serif, system-ui)

**Character:** A chunky, slightly quirky grotesque for headings and numbers, paired with a round, friendly humanist sans that stays easy to read at length.

### Hierarchy
- **Display** (800, clamp 2.4 to 4.4rem, 1.05, -0.03em): the home welcome heading on the quilt label only.
- **Headline** (800, clamp 2.1 to 3.4rem, 1.05, -0.03em): each screen's page heading. Section headings step down to 700 at clamp 1.6 to 2.3rem.
- **Question** (700, clamp 1.45 to 2.25rem, 1.18): the question on the gameplay card. Finish-the-Verse questions switch to Nunito Sans 600 so scripture reads as text, not a headline.
- **Title** (700, 1.25 to 1.5rem, -0.02em): card names, dialog titles, feedback headings.
- **Body** (400, 1rem, 1.7): all running copy; ledes step up to 1.125rem at the same 1.7. Explanations cap at 62ch, ledes around 34 to 38rem.
- **Label** (600, 0.75 to 0.875rem, sentence case): stat captions, footer readouts, chip text. Never uppercase, never tracked out.
- **Stat** (700 display, 1.25 to 1.5rem, tabular figures): scores, streaks, counts, the timer.

### Named Rules
**The Two-Thread Rule.** Bricolage is for headings and numbers; Nunito Sans is for everything you read. Body copy never sets in the display face.

**The 1.7 Rule.** Body and lede copy run at line-height 1.7. Headings run tight (1.05) with -0.03em tracking and balanced wrapping.

## Layout

A single centred column, max 72rem wide (max-w-6xl) with 16px gutters on phones and 24px from 640px up; play and setup screens narrow further (48 to 64rem). Spacing follows a 4px base: 12px is the default gap between sibling controls, 16 to 24px inside cards, 32 to 40px inside sewn labels, 64 to 80px between home sections.

The home screen opens on the full-width quilt band (a patch grid of 14 columns, 10 under 560px wide, five rows) set in a padded surface frame. The muslin label overlaps the band's lower edge (pulled up 56px on phones, 128 to 160px on larger screens). Gameplay hides the site chrome: round row, question card, a two-column answer grid from 640px, then a sticky footer bar for score, streak and hints. Layout must hold at 320px wide.

## Elevation & Depth

Depth is a hybrid: tonal surfaces (ground, surface, raised) plus three soft, layered shadows tinted with navy (and near-black in dark mode). Shadows describe how far a sewn piece sits above the cloth; they are never hard-edged or offset.

### Shadow Vocabulary
- **Lift 1** (shadow-lift-1): resting answer tiles, secondary buttons, chips.
- **Lift 2** (shadow-lift-2): primary buttons, question card, quilt frame, hover state of Lift 1 elements.
- **Lift 3** (shadow-lift-3): the home label, dialogs, toasts, primary button hover.

A static woven-cotton grain (SVG fractal noise, 7% multiply in light, 9% overlay in dark) sits over the whole page and never intercepts input. The ground carries two very faint radial washes (periwinkle top-left, sage bottom-right, around 10%); fabric fields themselves stay flat.

### Named Rules
**The Sewn-Piece Rule.** Elevation rises one step on hover and settles on press. Nothing floats without a reason: the scrim (navy at 45%) is the only full-screen layer.

## Shapes

Softly rounded rectangles throughout, scaled to the size of the piece: 12px for icon controls and nav items, 16px for buttons, about 18px for answer tiles, 20px for cards, 24px for sewn labels and dialogs, 28px for the quilt frame, and full pills for chips. Patches are 40-unit squares with 5-unit corners alone and square corners when pieced edge to edge in the quilt.

The recurring form is the running stitch: a 1.5px dashed line inset 4 to 8px inside a piece, its radius following the piece's corner. Grids of stats are separated by dashed seams, not solid rules. Disabled or coming-soon pieces use a dashed border on a translucent surface.

## Components

### Buttons
Tactile sewn tabs that lift on hover and press in on click.
- **Shape:** gently rounded (16px); icon buttons 44px square at 12px.
- **Primary:** solid periwinkle with on-primary text, semibold, a dashed stitch 4px inside the edge, Lift 2. Sizes 44px (20px side padding) and 56px (28px).
- **Hover / Focus / Active:** rises 2px on a spring (220ms), Lift 3 on hover; press drops 1px and scales to 0.98 in 90ms and switches to Primary Press. Focus is a 3px periwinkle outline offset 3px. Colour changes are instant; only transform and opacity animate.
- **Secondary:** calico surface, hairline line border that darkens to stitch on hover, Lift 1 rising to Lift 2.
- **Ghost / Quiet:** ghost is text on a ground-deep hover wash; quiet is underlined secondary text for low-stakes actions.

### Chips
- **Style:** full pills. The scripture reference chip is white cotton with Lift 1 and a book icon; the Finish-the-Verse tag is sage-soft with sage-text.

### Cards / Containers
- **Corner Style:** 20px for category cards, 24px for sewn labels and the question card.
- **Background:** surface on the muslin ground.
- **Shadow Strategy:** Lift 2 at rest for primary content, Lift 3 for the home label (see Elevation).
- **Border:** the inset running stitch on labels; dashed stitch border for coming-soon cards.
- **Internal Padding:** 20px on cards; 24px rising to 40px on sewn labels.

### Answer Options
The core interaction. A calico tile at least 68px tall with a 40px muslin letter tile and semibold copy at 1.05 to 1.125rem.
- **Idle:** transparent 2px border, Lift 1, hover border and Lift 2.
- **Correct:** emerald border, emerald-soft fill, emerald check tile, a brief 1.03 pulse.
- **Wrong:** coral border, coral-soft fill, coral cross tile, a short horizontal shake.
- **Dimmed / Removed by hint:** other options fade to 50%; hinted-away options become dashed and struck through at 35%.

### Navigation
- **Style:** header with the brand mark and wordmark (Bricolage 800, -0.03em) on the left and three 44px nav items on the right (text-sm, semibold, ink-soft). Labels hide below 640px, leaving icons with screen-reader text.
- **States:** ground-deep wash on hover; the current page wears its own soft fabric (gold-soft for Achievements, peri-soft for Stats).

### Dialogs
A floating sewn label: surface, 24px corners, inset stitch at 8px, Lift 3, over a 45% navy scrim. Opens with a 12px rise and 0.97 scale on an expo-out curve (320ms).

### Quilt Patch and Round Row (signature)
The patch is the system's atom: a 40-unit square with an inner dashed seam at 28% ink. The round row is ten patches in a grid that doubles as the progress indicator; each patch sews in on answer with a spring from 0.55 scale and -8 degrees. The home quilt band pieces the most recent rounds into its top rows, newest first, and leaves the rest as plain muslin.

## Do's and Don'ts

### Do:
- **Do** draw progress and statistics as quilt geometry: patch rows and strip-pieced bars.
- **Do** keep fabric fills flat and let plain muslin carry the negative space.
- **Do** put a running stitch inside every sewn piece that matters (primary buttons, labels, dialogs, toasts), inset 4 to 8px.
- **Do** use the `-text` tokens for any coloured text, and tabular figures for every number.
- **Do** give every clickable element hover, focus-visible and active states, with a 44px minimum target.
- **Do** honour reduced motion from both the OS setting and the in-app setting.

### Don't:
- **Don't** use emerald, coral or gold as interface signals for anything but correct, incorrect, and achievements-and-hints respectively; inside the quilt they are cloth.
- **Don't** show the sample stripes once a player has history; real rows plus plain muslin only.
- **Don't** use stock charts, confetti, or a plain progress bar for round progress.
- **Don't** animate colour, size or layout properties; animate transform and opacity only.
- **Don't** use uppercase or letter-spaced labels; labels are sentence case.
- **Don't** use grey or hard offset shadows; elevation is soft and navy-tinted.
