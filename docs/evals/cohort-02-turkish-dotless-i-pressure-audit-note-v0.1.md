# ZË-RO Cohort 02 Turkish /ı/ Pressure-Audit Framing Note v0.1

Status: INTERNAL PRESSURE-AUDIT NOTE ONLY
Created: 2026-05-09
Cohort: Cohort 02
Scope: Turkish `/ı/`
Branch base: `f66f6e5`

Depends on:
- `docs/evals/cohort-02-first-subset-summary-v0.1.md`
- `docs/evals/cohort-02-internal-synthesis-v0.1.md`
- `docs/evals/cohort-02-publication-readiness-decision-v0.1.md`
- `docs/evals/cohort-02-portuguese-replication-summary-v0.1.md`
- `docs/evals/cohort-02-romanian-a-breve-pressure-note-v0.1.md`

This document explains why Turkish `/ı/` remains a Cohort 02 pressure-audit case.

This is not a new score run.

This is not a token-redesign proposal.

This is not a paper.

This is not a publication package.

This does not update Zenodo, LingBuzz, README, registry labels, or Cohort 01.

---

## 1. Decision

Turkish `/ı/` should remain classified as:

- pressure-audit / partial redesign improvement;
- not settled support;
- not final publication evidence by itself;
- useful evidence that V4-V7 is cleaner than V5-V7 for this researcher-reviewed subset.

Current decision:

- do not rerun Turkish immediately;
- do not claim Turkish `/ı/` is settled;
- keep Turkish visible as high-region pressure evidence.

---

## 2. Evidence basis

Series:

- `t5-tr-ii-v4-v7-researcher-v0.1`

Candidate bracket:

- V4-V7

Control bracket:

- V5-V7

Result table:

| Ordinal | Run ID | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `t5.tr.ii.v4-v7.researcher.main.r01` | V4-V7 | INTERMEDIATE | 0.614663 | 0.400556 | 0.251111 | none |
| 2 | `t5.tr.ii.v4-v7.researcher.alt.r02` | V4-V7 | INTERMEDIATE | 0.474286 | 0.276667 | 0.306667 | none |
| 3 | `t5.tr.ii.v5-v7.researcher.ctrl.r03` | V5-V7 | INTERMEDIATE | 0.192982 | 0.055000 | 0.230000 | BOUNDARY_UNCERTAIN_LOW |
| 4 | `t5.tr.ii.v5-v7.researcher.ctrl-alt.r04` | V5-V7 | EXCEEDS_LOW | -0.063380 | -0.015000 | 0.251667 | BOUNDARY_UNCERTAIN_LOW |

---

## 3. What improved

Turkish `/ı/` improved under the V4-V7 researcher redesign.

Evidence:

- both V4-V7 candidate runs returned INTERMEDIATE;
- both V4-V7 candidate runs had no diagnostic flags;
- V5-V7 controls showed low-boundary pressure;
- one V5-V7 control failed as EXCEEDS_LOW.

This supports V4-V7 as a cleaner diagnostic bracket than V5-V7 for this researcher-reviewed subset.

---

## 4. Why this is still pressure-audit

Turkish `/ı/` should not be upgraded to settled support yet.

Reasons:

1. The control separation is useful but not absolute.
   - One V5-V7 control still returned INTERMEDIATE.
   - The control failure pattern is pressure-based, not a full clean separation.

2. The case sits in the high-region model.
   - Turkish `/ı/` historically stresses the high-region treatment.
   - Cohort 02 improved the bracket but did not eliminate the pressure.

3. The result is a redesign improvement.
   - V4-V7 is cleaner than V5-V7.
   - That is not the same as proving the final bracket.

4. Prior Turkish evidence was unstable.
   - Turkish `/ı/` had already been treated as a serious pressure case before Cohort 02.
   - The new result improves the situation but should not erase the caution.

Therefore the correct status is:

- V4-V7 redesign improvement;
- pressure-audit retained;
- not settled support.

---

## 5. Working model explanation

Turkish `/ı/` behaves like a high-region pressure case because it sits close to the upper-side area where the current model distinguishes flow, tension, and point-like high-vowel behavior.

The V4-V7 redesign likely works better because it gives the vowel more room than V5-V7.

But the control pressure shows that the high-region distinction is still not fully resolved.

Likely pressure sources:

1. **High-region overlap**
   - `/ı/` sits near the zone where V5, V6, and V7 distinctions become tight.
   - Small token changes can push the result toward low-boundary or high-boundary stress.

2. **Orthographic and phonological specificity**
   - Turkish dotless `/ı/` is not simply equivalent to English `i`.
   - It needs to remain its own pressure case rather than being flattened into generic high-vowel behavior.

3. **Bracket-width sensitivity**
   - V5-V7 was too narrow or too high-side stressed.
   - V4-V7 gives a cleaner result, but that wider bracket is also less precise.

4. **Model granularity**
   - The seven-voice evaluator currently detects improvement under V4-V7.
   - It does not yet prove that Turkish `/ı/` has a final stable high-region placement.

This note does not define a future Turkish-specific subrule.

It records the pressure-audit framing.

---

## 6. Why not rerun now

More immediate Turkish reruns would not add much unless they are preregistered as a new Turkish-specific audit.

The current evidence already shows:

- V4-V7 is cleaner than V5-V7;
- Turkish still belongs in pressure-audit framing;
- the high-region model needs cautious language.

Therefore the next step should be synthesis/publication-gate updating, not more Turkish token buckets.

---

## 7. Allowed internal claims

Allowed internal claims:

- Turkish `/ı/` improved under V4-V7 compared with V5-V7.
- Turkish `/ı/` remains pressure-audit.
- Turkish `/ı/` is not settled support.
- V4-V7 is the cleaner current diagnostic bracket for this researcher-reviewed subset.
- Turkish `/ı/` remains useful for high-region model refinement.

---

## 8. Blocked claims

Do not claim:

- Turkish `/ı/` is settled.
- Turkish `/ı/` proves V4-V7 as a final bracket.
- Turkish `/ı/` is publication-ready headline support.
- Turkish `/ı/` should be treated the same as a clean support case.
- Turkish `/ı/` pressure has been solved.
- Turkish `/ı/` should be rerun repeatedly until all controls collapse.
- Cohort 02 proves the high-region model from Turkish alone.

---

## 9. Publication-readiness effect

This note addresses one publication-readiness blocker:

| Requirement | Previous status | Updated status |
|---|---|---|
| Turkish pressure-audit framing note | required | completed internally |

This does not make Cohort 02 publication-ready by itself.

Remaining blockers:

| Requirement | Status |
|---|---|
| Updated publication-readiness decision | still required |
| Public paper outline | still required |
| Public archive manifest | still required |
| Final public checksum table | still required |
| Methods section | still required |
| Limitations section | still required |
| Claim-boundary section | still required |
| Review of all public wording against blocked claims | still required |

---

## 10. Recommended next action

Next Cohort 02 work:

1. Update the Cohort 02 publication-readiness decision note.
2. Decide whether Cohort 02 can move to a public paper outline.
3. If public work resumes, prepare a paper-safe claim table before touching Zenodo, LingBuzz, or README.

Do not run more Turkish now.

Do not update:

- Zenodo;
- LingBuzz;
- README;
- registry labels;
- Cohort 01.

---

## 11. Completion criteria

This note is complete when:

1. Turkish `/ı/` evidence is summarized;
2. V4-V7 improvement over V5-V7 is recorded;
3. pressure-audit framing is preserved;
4. settled-support claims are blocked;
5. publication-readiness effect is stated;
6. no public publication claim is made;
7. repo gates pass;
8. PR is merged.
