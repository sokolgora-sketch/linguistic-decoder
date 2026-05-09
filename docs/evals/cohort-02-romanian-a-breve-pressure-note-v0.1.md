# ZË-RO Cohort 02 Romanian /ă/ Model-Level Pressure Note v0.1

Status: INTERNAL MODEL-LEVEL PRESSURE NOTE ONLY
Created: 2026-05-09
Cohort: Cohort 02
Scope: Romanian `/ă/`
Branch base: `a8f58a9`

Depends on:
- `docs/evals/cohort-02-first-subset-summary-v0.1.md`
- `docs/evals/cohort-02-pressure-redesign-results-v0.2.md`
- `docs/evals/cohort-02-internal-synthesis-v0.1.md`
- `docs/evals/cohort-02-publication-readiness-decision-v0.1.md`
- `docs/evals/cohort-02-portuguese-replication-summary-v0.1.md`

This document explains why Romanian `/ă/` remains an unresolved Cohort 02 pressure case.

This is not a new score run.

This is not a token-redesign proposal.

This is not a paper.

This is not a publication package.

This does not update Zenodo, LingBuzz, README, registry labels, or Cohort 01.

---

## 1. Decision

Romanian `/ă/` should remain classified as:

- unresolved central-vowel pressure;
- not bracket support;
- not publication-ready evidence;
- not a case for more immediate token tweaking.

Current decision:

- do not rerun Romanian immediately;
- do not claim Romanian `/ă/` supports a bracket;
- move Romanian `/ă/` to model-level review.

---

## 2. Evidence basis

Romanian `/ă/` has already been tested in two Cohort 02 stages.

### 2.1 v0.1 researcher redesign

Series:

- `t5-ro-a-breve-v3-v4-researcher-v0.1`

Candidate bracket:

- V3-V4

Control bracket:

- V2-V4

Result table:

| Ordinal | Run ID | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `t5.ro.a-breve.v3-v4.researcher.main.r01` | V3-V4 | EXCEEDS_LOW | -4.256410 | -0.276667 | 0.341667 | none |
| 2 | `t5.ro.a-breve.v3-v4.researcher.alt.r02` | V3-V4 | EXCEEDS_LOW | 1.483283 | -0.271111 | 0.088333 | none |
| 3 | `t5.ro.a-breve.v2-v4.researcher.ctrl.r03` | V2-V4 | EXCEEDS_LOW | -2.382979 | -0.062222 | 0.088333 | BOUNDARY_UNCERTAIN_LOW |
| 4 | `t5.ro.a-breve.v2-v4.researcher.ctrl-alt.r04` | V2-V4 | COLLAPSED_HIGH | 1.360577 | 0.078611 | -0.020833 | BOUNDARY_UNCERTAIN_LOW, BOUNDARY_UNCERTAIN_HIGH |

v0.1 interpretation:

- V3-V4 did not stabilize Romanian `/ă/`.
- V2-V4 controls also failed or carried boundary pressure.
- Romanian `/ă/` could not be treated as support.

### 2.2 v0.2 pressure redesign

Series:

- `t5-ro-a-breve-v2-v5-researcher-v0.2`

Candidate bracket:

- V2-V5

Control bracket:

- V3-V4

Result table:

| Ordinal | Run ID | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags |
|---:|---|---|---|---:|---:|---:|---|
| 1 | `t5.ro.a-breve.v2-v5.researcher.main.r01` | V2-V5 | EXCEEDS_LOW | -0.288566 | -0.088333 | 0.394444 | none |
| 2 | `t5.ro.a-breve.v2-v5.researcher.alt.r02` | V2-V5 | INTERMEDIATE | 0.107258 | 0.036944 | 0.307500 | NEAR_COLLAPSE_LOW, BOUNDARY_UNCERTAIN_LOW |
| 3 | `t5.ro.a-breve.v3-v4.researcher.ctrl.r03` | V3-V4 | EXCEEDS_LOW | 1.483283 | -0.271111 | 0.088333 | none |
| 4 | `t5.ro.a-breve.v3-v4.researcher.ctrl-alt.r04` | V3-V4 | EXCEEDS_LOW | 0.960256 | -0.208056 | -0.008611 | BOUNDARY_UNCERTAIN_HIGH |

v0.2 interpretation:

- V2-V5 widened the candidate interval, but did not stabilize the case.
- One candidate run improved to INTERMEDIATE.
- The other candidate run remained EXCEEDS_LOW.
- The INTERMEDIATE run still carried low-boundary pressure.
- V3-V4 controls also failed.
- Romanian `/ă/` remained unresolved.

---

## 3. Why this is model-level pressure

Romanian `/ă/` is not failing in only one narrow setup.

It failed or pressured across:

- V3-V4 candidate;
- V2-V4 control;
- V2-V5 widened candidate;
- V3-V4 repeated control.

That pattern means the issue should not be treated as a single bad bucket or a single bad bracket.

The better interpretation is:

- Romanian `/ă/` is exposing pressure in the current central-vowel treatment.
- The current discrete bracket model does not yet cleanly place this vowel.
- The current token-level method can show the instability, but cannot fully explain it.

---

## 4. Working model explanation

Romanian `/ă/` behaves like a central-vowel pressure case because it sits near the zone where the current evaluator has to separate neighboring central/interior brackets.

The current model is strong enough to detect that Romanian `/ă/` is not behaving like a clean support case.

The current model is not yet strong enough to assign Romanian `/ă/` to a stable bracket without further theory.

Likely pressure sources:

1. **Central-vowel ambiguity**
   - `/ă/` behaves as a central vowel.
   - Central vowels are expected to stress bracket boundaries more than clear front-rounded or open vowels.

2. **Mixed-token vowel environment**
   - Many Romanian `/ă/` words contain other vowels besides `/ă/`.
   - The score can be pulled by the whole token environment, not only by the target character.

3. **Boundary overlap**
   - V3-V4 was too narrow.
   - V2-V5 was wider, but still split.
   - This suggests overlap rather than simple misplacement.

4. **Current model granularity**
   - The current seven-voice bracket protocol may need a better central-vowel subrule.
   - Romanian `/ă/` may require a specific central-vowel handling rule before it can be retested fairly.

This note does not define that future subrule.

It only records the pressure.

---

## 5. Why not rerun now

More immediate Romanian reruns would risk looking like token fishing.

The scientific sequence already shows:

- original researcher redesign failed;
- widened redesign failed to stabilize;
- controls also failed;
- one candidate improvement did not repeat cleanly.

Therefore the next step should not be more token buckets.

The next step should be model-level explanation and later, if needed, a preregistered Romanian-specific redesign.

---

## 6. Allowed internal claims

Allowed internal claims:

- Romanian `/ă/` remains unresolved after v0.1 and v0.2.
- Romanian `/ă/` is a central-vowel pressure case.
- Romanian `/ă/` does not currently support any tested bracket.
- Romanian `/ă/` should move to model-level review.
- More immediate token tweaking is discouraged.

---

## 7. Blocked claims

Do not claim:

- Romanian `/ă/` supports V3-V4.
- Romanian `/ă/` supports V2-V5.
- Romanian `/ă/` supports any tested bracket.
- Romanian `/ă/` is publication-ready evidence.
- Romanian `/ă/` should be hidden or ignored.
- Romanian `/ă/` proves the framework wrong by itself.
- Romanian `/ă/` should be rerun repeatedly until it passes.

---

## 8. Publication-readiness effect

This note addresses one publication-readiness blocker:

| Requirement | Previous status | Updated status |
|---|---|---|
| Romanian model-level pressure explanation | required | completed internally |

This does not make Cohort 02 publication-ready by itself.

Remaining blockers:

| Requirement | Status |
|---|---|
| Turkish pressure-audit framing note | still required |
| Updated publication-readiness decision | still required |
| Public paper outline | still required |
| Public archive manifest | still required |
| Final public checksum table | still required |
| Methods section | still required |
| Limitations section | still required |
| Claim-boundary section | still required |
| Review of all public wording against blocked claims | still required |

---

## 9. Recommended next action

Next Cohort 02 work:

1. Create Turkish `/ı/` pressure-audit framing note.
2. Then update the publication-readiness decision note.
3. Then decide whether Cohort 02 can move to a public paper outline.

Do not run more Romanian now.

Do not update:

- Zenodo;
- LingBuzz;
- README;
- registry labels;
- Cohort 01.

---

## 10. Completion criteria

This note is complete when:

1. v0.1 and v0.2 Romanian evidence are summarized;
2. Romanian `/ă/` is explicitly kept unresolved;
3. model-level pressure explanation is recorded;
4. rerun/fishing risk is stated;
5. allowed and blocked claims are listed;
6. publication-readiness effect is stated;
7. no public publication claim is made;
8. repo gates pass;
9. PR is merged.
