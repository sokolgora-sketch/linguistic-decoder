# LingBuzz 009808 — Release Lock (schema v0.1)

## Publication
- LingBuzz ID: 009808
- Reference: lingbuzz/009808
- Public URL: https://ling.auf.net/lingbuzz/009808
- Title: ZË-RO v0.2 Note: Morphological Masking & Recovery in Albanian200 (Controlled Ablation)
- Author(s): Sokol Gora
- Published: March 2026

## Repo source
- Primary manuscript (Markdown): `docs/lingbuzz/albanian200.morph-mask.ablation.v0.1.md`
- SHA256(manuscript): `4a6fb5cea23cafc1a9df2153ccf72815edd1796118e895c1ca53394a4eb7e47c`

## Evidence (anchored subset N=28; row-aligned)
- CompoundStress (Tosk-anchored): `tests/research/albanian200.compoundStress.v0.2.txt`
  - SHA256: `abcb820ed853fc32f308364cc4e71a579a5da9427563cff4f29e1c16ded395e1`
  - Reported: position 64.3% (9/14, p=0.013); order 100.0% (14/14, p=0.001)
- GegProbe (simulated Ë-drop perturbation; **not** real Gegë IPA): `tests/research/albanian200.gegProbe.v0.1.txt`
  - SHA256: `581e743310148718ffe3bebcff81950882fd6e52a25f10327f8135e27555be63`
  - Reported: position 64.3%→100.0% (9/14 p=0.010 → 14/14 p=0.001); order 100.0%→100.0% (14/14 p=0.001 → 14/14 p<0.001)
  - Recovered failures (për- prefixed): përballë, përtej, përreth, përparim, përparësi

## Non-claims (must remain explicit)
- Not “true Gegë pronunciation”
- Not “semantic proof”
- Not a universal sound-meaning law
- Not “Albanian proves non-arbitrariness”

## Reproduction (repo-level)
1. Checkout: `git checkout lingbuzz-009808-v0.2` (after tag is created)
2. Sanity: `npm ci && npm run gate:quick`
3. Verify evidence integrity (hashes above) and that manuscript numbers match the cited lines.

## Lock metadata
- Created (UTC): 2026-03-03T01:54:47Z
- Release tag (annotated): `lingbuzz-009808-v0.2`
