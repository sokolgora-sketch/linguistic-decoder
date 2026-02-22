# Preregistration — Decomposition Harness (Position-Scoped) v0.1

Status: **LOCKED (do not edit after first run)**  
Scope: **Methodology only** (no Saussure claims; no “study” yet).  
Rationale: Albanian100 shows a strong association only for **position → A** (p=0.026). This harness validates mechanics + negative controls using that strong domain.

---

## Hypothesis (v0.1)

H1 (position domain): For Albanian position words, **carrier primary** will concentrate on **A** more than expected under permutation controls.  
H0: No association beyond chance.

This harness will be considered **broken** if:
- Negative controls show comparable or higher “lift” than the preregistered positives, OR
- Results are non-deterministic across reruns (same seed/config), OR
- The harness produces “explanations” for gibberish controls.

---

## Data source (SSOT)

- Corpus: `tests/research/albanian100.words.v0.1.txt`
- Meta:   `tests/research/albanian100.meta.v0.1.gemini-blind.json`
- Carriers: `extractCarrierVoicesFromIpaV0_1` (IPA-required, deterministic)
- Mask: `extractOrthographyVoicesFromWordV0_1({ langHint: "sq" })`

---

## Metric (v0.1)

Primary metric (per item):
- `carrierPrimary` = first voice in `carrierVoices` (or NONE if empty)
- `lift_A` = `P_obs(A|position) / P_perm(A|position)`  
  where `P_perm` is estimated by shuffling carrier primaries across items with tags fixed (seeded).

Secondary checks:
- Divergence rate (mask vs carrier) should remain low for Albanian (sanity).
- Negative controls should not produce meaningful lift.

---

## Preregistered test cases (v0.1)

### Positive controls (position-tagged items from Albanian100)

Expected:
- Tag includes `position`
- `carrierPrimary` in most cases should be **A** (not necessarily all)

Cases (IDs must exist in Albanian100 corpus + meta):
- sq.85 **afër**      (position)
- sq.86 **larg**      (position)
- sq.81 **lart**      (position)
- sq.82 **poshtë**    (position)
- sq.83 **brenda**    (position)
- sq.84 **jashtë**    (position)
- sq.89 **para**      (position, order)
- sq.88 **nën**       (position)

### Negative controls (must FAIL)

Policy: these are **not** in Albanian100; they are harness probes.
Expected:
- No “forced” mapping to position; lift should not exceed position positives.
- Should not be assigned “meaning”; only run through carrier/mask extraction and baseline comparison.

Cases:
- nc.01 **buba**      /ˈbuba/
- nc.02 **glabnif**   /ˈɡlab.nif/
- nc.03 **plojusht**  /ˈplɔ.juʃt/
- nc.04 **trenkal**   /ˈtɾen.kal/

---

## Determinism

- Seed: `777001` (fixed)
- Permutation iterations: `5000` (fixed)
- Sorting: stable lexicographic by `(carrierPrimary, word, id)` for tables.

---

## Pass / Fail criteria

PASS (methodology validated) if:
1) Position positives show **lift_A > 1.0** and are **higher than all negative controls** (median lift), AND
2) Negative controls do **not** exceed the positives (no “false meaning”), AND
3) Output is stable across reruns.

FAIL if:
- Any negative control ranks above the positives by lift, OR
- Reruns produce materially different results with same config, OR
- Carrier extraction returns empty for many IPA-provided controls (indicates harness bug).

---

## Output contract (v0.1)

Harness run writes:
- `tests/validation/out/decompositionHarness.position.v0.1.md`

Report must include:
- Config block (seed/iters/files)
- Summary table (positives vs negatives)
- Full table listing each case with: ID, word, IPA, tags, mask, carrier, carrierPrimary, lift_A, status
