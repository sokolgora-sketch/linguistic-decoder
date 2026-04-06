# Evals Help + Input Clarity v0.1 — Status

## Status
Done
Merged

## Milestone summary
This milestone made the Evals workbench more understandable to first-time users without private explanation.

## Shipped
- added \`/evals/help\` page
- added Help entry in the \`/evals\` hero action row
- replaced the generic input-ready chip with explicit input detection
- added focused tests for help page and input-chip clarity

## Acceptance criteria reached
- first-time users can discover help directly from \`/evals\`
- first-time users can distinguish help vs reference
- the workbench now labels pasted JSON more explicitly before scoring
- focused tests passed
- gate passed
- build passed

## PR
- PR #846 — feat(evals): add help page and explicit input detection

## Next milestone
- tighten remaining input helper copy around the upload/paste section
- improve metric legibility on the live scored summary
- continue toward public-beta release blockers: examples, validation clarity, shareability, screenshot polish
