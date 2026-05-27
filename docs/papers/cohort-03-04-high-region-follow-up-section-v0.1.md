# Cohort 03/04 High-Region Hindi `/i/` Follow-Up Section v0.1

Status: draft section  
Publication status: not published  
Scope: Cohort 03 Hindi `/i/` + Cohort 04 Hindi `/i/`

## 1. Draft claim

Cohort 03 and Cohort 04 jointly support a cautious high-region mechanism account for Hindi `/i/`.

The combined evidence does not prove the full high-region model, and it does not justify publishing Cohort 04 as a standalone result. The stronger supported statement is narrower:

> Hindi `/i/` high-region bracket behavior appears sensitive to token geometry, especially final-shape distribution, inside the tested evidence packs.

## 2. Evidence summary

| Cohort | Evidence role | Checkpoint | Current internal status |
|---|---|---|---|
| Cohort 03 Hindi `/i/` | Primary high-region pressure lane | `docs/papers/cohort-03-hi-i-evidence-checkpoint-index-v0.1.md` | Evidence-hardened internally; not publication-ready alone |
| Cohort 04 Hindi `/i/` | Mechanism refinement / replication-support lane | `docs/papers/cohort-04-hi-i-evidence-checkpoint-index-v0.1.md` | Evidence-hardened internally; ready for future paper drafting; not published |
| Cohort 03/04 mechanism overview | Shared mechanism framing | `docs/evals/cohort-03-04-high-region-mechanism-overview-v0.1.md` | Internal synthesis source |

## 3. Cohort 03 contribution

Cohort 03 provides the primary Hindi `/i/` high-region evidence lane.

Its role is not to prove the bracket alone. Its role is to provide a traceable pressure case with enough provenance for future paper drafting.

Use Cohort 03 for:

- primary evidence-lane framing;
- high-region pressure context;
- connection to earlier Hindi `/i/` interpretation;
- comparison against Cohort 04 refinement.

Do not use Cohort 03 as a standalone proof.

## 4. Cohort 04 contribution

Cohort 04 refines the Hindi `/i/` story by testing final-shape distribution.

The key internal result pattern:

- all eight Cohort 04 runs returned `INTERMEDIATE`;
- open-final target and replication rows carried no diagnostic flags;
- closed-final/reference/baseline/mixed rows preserved or repeated `BOUNDARY_UNCERTAIN_HIGH`;
- all runs used `T5_INTERMEDIATE_V0_1`, `intermediate_triple`, `hi`, `i`, `V6→V7`, and `10/10/10` bucket counts.

This makes Cohort 04 useful as a mechanism-support lane.

Do not use Cohort 04 as a standalone publication.

## 5. Combined interpretation

The combined Cohort 03/04 interpretation is:

> Hindi `/i/` remains a high-region pressure case, but Cohort 04 suggests the pressure is not only about the vowel bracket itself. It is also shaped by token geometry, especially final-shape distribution inside the tested packs.

This matters because it keeps the claim falsifiable and narrow.

The claim is not:

> Hindi `/i/` proves the high-region model.

The claim is:

> Hindi `/i/` gives traceable high-region pressure evidence, and Cohort 04 sharpens the mechanism account by showing final-shape sensitivity.

## 6. Draft paper paragraph

Draft paragraph for future paper use:

> The Hindi `/i/` evidence lane was treated as a high-region pressure case rather than as a standalone confirmation case. Cohort 03 established the primary traceable evidence lane. Cohort 04 then tested a narrower final-shape mechanism by contrasting open-final, closed-final, mixed, and replication packs under the same `V6→V7` bracket. Across eight Cohort 04 runs, all results remained `INTERMEDIATE`; open-final target and replication rows carried no diagnostic flags, while closed-final/reference/baseline/mixed rows preserved or repeated `BOUNDARY_UNCERTAIN_HIGH`. This pattern supports a cautious interpretation: Hindi `/i/` behavior in the tested packs is sensitive to token geometry, especially final-shape distribution. The evidence does not prove the high-region model alone, but it provides an internally traceable basis for a future high-region mechanism discussion.

## 7. Do-not-use claims

Do not claim:

- Cohort 04 is published.
- Cohort 04 should be published alone.
- Cohort 04 proves Hindi `/i/`.
- Cohort 04 replaces Cohort 03.
- Cohort 03/04 proves the full high-region model.
- README, Zenodo, or LingBuzz should be updated from this draft alone.

## 8. Next useful PR

Next useful PR:

> Draft the actual follow-up paper skeleton around this section.

That future PR should create or update a paper file, not publish it publicly yet.
