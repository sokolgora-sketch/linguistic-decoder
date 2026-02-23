# Preregistration — Albanian200 Compound Stress-Test v0.1

Purpose
- Measure whether previously observed tag↔vowel anchors (Position→A, Order→I) remain detectable under morphological complexity.

Inputs
- Core baseline: tests/research/albanian200.words.v0.1.txt + albanian200.meta.v0.1.mixed.json
- Stress set: tests/research/albanian200.compoundStress.v0.1.txt (single-tag compounds with IPA)

Outputs
- tests/validation/out/compoundStress.albanian200.v0.1.md

Method (deterministic)
- For each item: extract carrier voices from IPA; derive carrier primary (first carrier).
- Compute per-tag vowel counts and shares.
- Compute per-tag anchor cell p-values via permutation shuffle of carrier primaries within tag (fixed seed, fixed iters).
- Compare baseline vs stress deltas (share and p).

Non-claims
- This harness does not assert linguistic causality or universality.
- It is a durability diagnostic for the instrument.

Determinism
- Fixed seed, fixed permutation iters.
- No network, no date, no locale dependencies.
