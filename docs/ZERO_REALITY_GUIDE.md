# ZË-RO Reality Guide v1 — Deterministic instrument, not vibes

## Purpose
This guide keeps ZË-RO honest. We stop self-deception by enforcing deterministic rules, explicit evidence, and canon tests. If a claim cannot be reproduced and checked by code, it is not a result.

## What ZË-RO is
- A deterministic linguistic instrument that produces auditable outputs.
- Not a persuasive storytelling app. Outputs must be reproducible, versioned, and testable.

## Two meanings of “right”
- Mechanical right (objective): same input -> same output; one contract; no internal contradictions.
- Etymology right (rule-based): meaning/function is produced as candidates that pass explicit constraints (allowed ops, functional decomposition, principle alignment).

## Authority chain (single source of truth)
- basis = exact string analyzed (sanitized, NFC normalized)
- surface vowels extracted from basis (A, E, I, O, U, Y, Ë only)
- surface PrinciplesPath derived from vowel sequence (1 vowel -> 1 principle step)
- surface Math7 derived from the same vowels (values, sum, total, wrap, jumps, events)
- candidate layer may transform only with explicit allowed ops; candidates get their own vowels/path/math

## Layer separation (non-negotiable)
- Surface (Heart): literal vowels from basis; emits an “instrument packet” (evidence). No invented meaning.
- Candidates (DeepRoot): transformed forms only with recorded ops; each candidate shows vowels/path/math + functional decomposition + pass/fail.

## Success conditions (proof we are not drifting)
- Tooling stable: lint/test/build reproducible.
- Engine contract locked: runtime schema + snapshots.
- Math7 & PrinciplesPath coherence enforced by invariants tests.
- Canon battery exists and expands (strict+open snapshots).
- Rule changes are versioned and justified by canon diffs.
