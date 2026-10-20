---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: []
---

## Scope
Whole Brain Quest game (all screens), mode: experience (game). Code-led: no image generation on this machine.

## Audience & job
Casual friends/family and profile visitors, mostly on phones, playing 10-question Bible Trivia rounds; learn from explanations, chase personal bests.

## Direction contract
THESIS: Brain Quest is a modern patchwork quilt you sew one answer at a time. Every question is a patch; a round is a row; your history is a growing quilt. Refuses the category default of a quiz card stack with a progress bar and confetti.
OWN-WORLD: Unbleached-muslin ivory ground, navy thread ink. Flat fabric fields (periwinkle, sage, gold, coral, emerald), no gradients, half-square-triangle patches with running-stitch dashed seams, sewn-on quilt labels for branding and stats. Bricolage Grotesque display, Nunito Sans body. Modern-quilt negative space.
STORY: Visitors see their quilt (or a sample block) and learn that a round sews a row. They pick a fabric (category), a real traditional block pattern (subcategory), a difficulty and a mode, then answer. Each answer stitches a patch, and results show the finished row added to their quilt.
FIRST VIEWPORT: The full-width quilt band (an SVG patch grid) is the ground of the top of the page, with a muslin label appliquéd over it holding "Ready for a Brain Quest?", the subhead, and the Start Playing (primary) and My Achievements buttons. Below it sit four stat patches. On mobile, the label overlaps the bottom edge of a shorter band.
FORM: Modern patchwork quilt (candidate 7 of 7 grounded list). seed:6cacca21fec83357
Signature interaction: on answer, the chosen patch is sewn into the round row (scale-in + stitch reveal). Non-chosen options dim and the correct one is isolated.
Raises:
- from Du Bois data portraits: statistics are drawn as quilt geometry (strip-pieced bars), never stock charts; flat colour laid with total commitment.
- from zoot handbill: stitched borders and sawtooth edges repeat in whole units at every width.
- from CRT arcade: palette laws. Gold only for achievements and hints, emerald only for correct, coral only for incorrect.
- from particle display: selecting isolates the answer and dims the rest.
- from orizuru crane (competitive alternate, not built): one gold marker for the active step; every state is recoverable.
- from coiled tower: history is an ascending record. Each completed round adds a row to the home quilt.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Pattern names (real traditional quilt blocks)
Old Testament: Jacob's Ladder · New Testament: Star of Bethlehem · Bible Characters: Joseph's Coat · Life of Jesus: Carpenter's Wheel · Miracles & Wonders: Wonder of the World · Who Said It?: Solomon's Puzzle · Finish the Verse: Tree of Life · Mixed: Crazy Quilt
