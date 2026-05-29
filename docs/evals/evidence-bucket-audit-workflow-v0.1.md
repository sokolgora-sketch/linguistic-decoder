# Evidence Bucket Audit Workflow v0.1

Purpose: define the repeatable pre-interpretation workflow for checking Evals evidence bucket geometry before scoring, interpretation, or publication planning.

This workflow is an Evals quality check only. It does not score a run, validate a scientific claim, or authorize publication.

Use it when reviewing an exported evidence ZIP, checking a future rerun before interpretation, or comparing the terminal audit output against the `/evals` Bucket geometry check panel.

---

## 1. What This Workflow Checks

The audit checks the three intermediate-triple buckets used by `T5_INTERMEDIATE_V0_1`:

- `anchor_low`
- `x_vowel`
- `anchor_high`

For each bucket, it reports:

- token count;
- open-final / closed-final count;
- final target-vowel count;
- average token length;
- average target-vowel count;
- token-level final-shape and target-vowel positions.

The same target-vowel geometry is shared across:

- the evidence bucket audit CLI;
- the CLI JSON output;
- the shared token-geometry helper;
- the `/evals` Bucket geometry check panel.

---

## 2. Human CLI Audit

Use the default CLI output for direct terminal review.

Run from the repository root:

```bash
npm run evals:audit-buckets -- "/absolute/path/to/evidence.zip"
```

Expected output sketch:

```text
Evidence ZIP: /absolute/path/to/evidence.zip
Input JSON files: 1

RUN example-run
targetVowel=i
anchor_low: count=10 open=0 closed=10 finalTarget=0 avgLen=4.20 avgTargetCount=0.00
x_vowel: count=10 open=6 closed=4 finalTarget=6 avgLen=5.10 avgTargetCount=1.50
anchor_high: count=10 open=10 closed=0 finalTarget=0 avgLen=4.80 avgTargetCount=0.00
WARNINGS:
  - x_vowel: WARN final-target inflation=6
```

Use this mode when a human needs to inspect token shape quickly and decide whether the buckets are ready for scoring or interpretation.

---

## 3. JSON CLI Audit

Use JSON output when the audit needs to be archived, diffed, attached to an evidence note, or consumed by a downstream script.

Run from the repository root:

```bash
npm run evals:audit-buckets -- --json "/absolute/path/to/evidence.zip"
```

Expected output sketch:

```json
{
  "zipPath": "/absolute/path/to/evidence.zip",
  "inputJsonFiles": 1,
  "runs": [
    {
      "runId": "example-run",
      "targetVowel": "i",
      "buckets": [
        {
          "bucketId": "x_vowel",
          "count": 10,
          "openFinal": 6,
          "closedFinal": 4,
          "finalTarget": 6,
          "avgLength": 5.1,
          "avgTargetCount": 1.5,
          "tokens": [
            {
              "token": "nadi",
              "finalShape": "open_final",
              "length": 4,
              "targetCount": 1,
              "targetPositions": "4"
            }
          ]
        }
      ],
      "warnings": ["x_vowel: WARN final-target inflation=6"]
    }
  ]
}
```

JSON mode must emit valid JSON only. If a future change adds prose around JSON output, treat that as a CLI regression.

---

## 4. `/evals` Bucket Geometry Panel

The `/evals` page includes a read-only Bucket geometry check panel for pasted intermediate-triple input.

It appears before scoring when the pasted task includes:

- `anchor_low`
- `x_vowel`
- `anchor_high`

The panel is warning-only. It does not:

- change scorer math;
- change API behavior;
- change result interpretation;
- validate a claim;
- authorize publication.

Use the panel as a fast pre-score check. Use the CLI when inspecting exported evidence ZIPs or when a durable audit record is needed.

If the CLI JSON audit contradicts the `/evals` panel for the same input, stop and treat that as a bug in the audit path.

---

## 5. Warning Meanings

### Non-10 Bucket Counts

Each intermediate-triple bucket should normally contain 10 tokens.

If a bucket reports a non-10 count, review the input before scoring or interpreting the result. A non-10 bucket can still be useful for synthetic smoke checks, but not for controlled evidence interpretation.

### Final Target-Vowel Inflation

Final target-vowel inflation means the `x_vowel` bucket has many tokens ending in the target vowel.

This can make a target bucket look structurally special for a reason unrelated to the intended vowel-bracket test.

### High Average Target-Vowel Count

High average target-vowel count means target tokens contain the target vowel multiple times on average.

This can overpressure the tested vowel signal and make the bucket less comparable against the anchors.

---

## 6. What This Does Not Prove

This audit does not prove:

- part-of-speech balance;
- morphology balance;
- semantic comparability;
- historical or typological interpretation;
- a bracket claim;
- a publication-ready result.

It also does not replace researcher curation review. It is a structural warning layer before scoring and interpretation.

---

## 7. When To Stop

Stop before scoring or interpretation when:

- any evidence bucket has the wrong token count;
- `x_vowel` shows final target-vowel inflation;
- `x_vowel` shows high average target-vowel count;
- the CLI human output and JSON output disagree;
- the CLI output and `/evals` panel disagree for the same input;
- token geometry looks structurally suspicious even if no automated warning appears.

After stopping, review the bucket source, repair the input if needed, and rerun the audit before scoring.

---

## 8. Lane Boundary

This workflow belongs to Evals tooling only.

It does not authorize changes to:

- scorer math;
- API routes;
- `/evals` UI behavior;
- Open Instrument;
- VoiceLab;
- publication files;
- token JSON;
- evidence ZIPs.

Future changes to this workflow should stay docs-only unless a separate engineering task explicitly scopes tooling or UI work.
