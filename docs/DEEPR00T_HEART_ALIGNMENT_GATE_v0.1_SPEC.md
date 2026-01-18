# DeepRoot–Heart Alignment Gate v0.1 (Spec)

Status: DRAFT (contract-first).  
Intent: Introduce a scientific gate that evaluates whether a DeepRoot hypothesis (or candidate) is structurally aligned with the Heart primary vowel path.  
Non-goals: No scoring, no ranking, no “winner,” no UI inference.

This gate exists to prevent **vowel-path drift**: a hypothesis may be semantically interesting but structurally inconsistent with the Heart. The instrument must show this explicitly.

## Authority Chain (strict)
1) Heart primary path is authoritative (derived from the emitted Heart evidence).
2) DeepRoot hypotheses/candidates declare their own resolved vowel path.
3) Gate compares these two (no extra heuristics).

UI MUST render gate state from TelemetryVM only. No raw payload inference.

## Definitions
### HeartPrimaryPath
A normalized canonical vowel path emitted by the Heart layer.
- Example: "U→I"
- Must be treated as authoritative for “alignment” comparisons.

### CandidateResolvedPath
A candidate/hypothesis-level vowel path (resolved from its decomposition).
- Example: "U→A" for a DA-root hypothesis.

## Gate Outcome Model (binary-first)
We start binary:
- aligned
- misaligned
- insufficient_data

No gradients. No numeric confidence. No scores.

### Alignment Rule (v0.1)
A candidate is ALIGNED if:
- Heart primary path exists AND candidate resolved path exists, AND
- Candidate resolved path does not contradict Heart primary destination (the terminal vowel),
  and does not contradict the minimal monotonic movement implied by Heart primary path.

**v0.1 minimal check (safe, deterministic):**
- Compare terminal vowel (destination). If different => MISALIGNED.
- If either path is missing/malformed => INSUFFICIENT_DATA.

We may expand to stronger path-shape checks in v0.2+ (still binary), but v0.1 is terminal-vowel alignment only.

## Contract Shape (v0.1)
Gate attaches at hypothesis/candidate level (preferred), OR can be summarized at the DeepRoot block if hypotheses are not first-class yet.

### Candidate Gate Object
deepRootHeartGate: {
  status: "aligned" | "misaligned" | "insufficient_data";
  reasonCodes: string[];
  evidenceRefs: string[];
}

### Required Reason Codes (v0.1)
- HEART_PRIMARY_PATH_MISSING
- CANDIDATE_PATH_MISSING
- TERMINAL_VOWEL_CONFLICT

### EvidenceRefs (rules)
- evidenceRefs MUST use stable public anchors already used elsewhere, e.g.:
  - primaryPath.voicePath
  - heart.math7.primary
  - deepRoot.candidates[i].<...>
No internal/private references.

## Determinism Requirements
- Pure function of emitted JSON fields.
- Stable ordering of reasonCodes and evidenceRefs.
- No randomness, no model calls, no external lookups.

## Tests (must exist before implementation)
1) aligned: Heart terminal vowel == candidate terminal vowel
2) misaligned: terminal vowel differs
3) insufficient: missing heart primary path
4) insufficient: missing candidate path
5) determinism: repeated calls yield identical output objects

