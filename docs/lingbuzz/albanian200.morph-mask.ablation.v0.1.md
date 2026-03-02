# ZË-RO v0.2 Note — Morphological Masking & Recovery in Albanian200 (Controlled Ablation)

## What this is
This note reports a **diagnostic** result from ZË-RO’s deterministic analysis harnesses.
It tests whether **schwa-heavy morphology (notably për-/përë-) can mask root-aligned carrier primaries**
in a small, root-anchored Albanian subset.

This is **not** a claim about “semantic proof”, and it is **not** a claim about real dialect pronunciation.
The “Gegë” condition below is a **controlled perturbation** (simulation) used as an ablation probe.

## Definitions (what is being measured)
- **carrierP(word)**: the *primary* vowel carrier extracted from IPA by the SSOT phonetic extractor.
- **anchorP(root)**: the primary vowel carrier extracted from the anchor root’s IPA.
- **retains**: `carrierP(compound) == anchorP(anchor)`.

## Inputs
- Root-anchored stress set (N=28):
  - `tests/research/albanian200.compoundStress.v0.2.txt`
- “Gegë-sim” probe set (N=28, row-aligned):
  - `tests/research/albanian200.gegProbe.v0.1.txt`

## Harness outputs (baseline-locked artifacts)
- Compound Stress (root retention):
  - `tests/validation/baselines/compoundStress.albanian200.v0.2.md`
- Gegë Probe (ablation via simulated schwa-drop):
  - `tests/validation/baselines/gegProbe.albanian200.v0.1.md`

## Results (verbatim from harness reports)

### Compound Stress v0.2 — root-anchored retention
Retention summary (`carrierP(compound) == carrierP(anchor)`), N=14 per tag:

- **position**: 64.3% (9/14), p=0.013
- **order**: 100.0% (14/14), p=0.001

Mismatch cases in **position** (all are për- prefixed; compound carrierP becomes Ë while anchor is A/E):
- përballë: Ë vs A
- përtej: Ë vs E
- përreth: Ë vs E
- përparim: Ë vs A
- përparësi: Ë vs A

### Gegë Probe v0.1 — Ë-drop diagnostic (simulated)
Retention by tag (Tosk-anchored vs Gegë-sim), N=14 per tag:

- **order**: 100.0% → 100.0% (14/14, p=0.001 → 14/14, p<0.001)
- **position**: 64.3% → 100.0% (9/14, p=0.010 → 14/14, p=0.001)

Delta cases (recoveries under simulated schwa-drop):
- përballë: Ë/A → A/A
- përtej: Ë/E → E/E
- përreth: Ë/E → E/E
- përparim: Ë/A → A/A
- përparësi: Ë/A → A/A

## Interpretation (what this supports — and what it does NOT)
Supported by the diagnostic:
- In this anchored subset, the **për- prefix schwa** can **dominate carrierP** under standard/Tosk IPA,
  producing **apparent washout** relative to the anchor root.
- Under a controlled schwa-drop perturbation, the masked cases **recover** to anchor-aligned carrier primaries.

Not supported / not claimed here:
- No claim that this is “true Gegë pronunciation”.
- No claim of a universal sound-meaning law.
- No claim that Albanian “proves” non-arbitrariness.

This is best read as a **mechanistic masking-and-recovery diagnostic**: the harness can detect when
a consistent surface vowel (Ë) is acting as a shield over a root-aligned carrier primary (A/E) in prefixed forms.

## Reproduce (exact commands)
```bash
npm install
npm run gate:quick

npm run research:albanian200:compoundStress:v0.2
npm run research:albanian200:gegProbe
```
