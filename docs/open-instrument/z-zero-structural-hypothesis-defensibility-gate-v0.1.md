# ZË-RO structural hypothesis defensibility gate v0.1

Date: 2026-08-26

Status: IMPLEMENTED_CONTRACT.

## Purpose

The deterministic reduction engine distinguishes two questions:

1. Can an authorized structural operation be performed?
2. Is the resulting terminal branch strong enough to be emitted as a ZË-RO structural hypothesis?

These are not equivalent.

**Permitted reduction does not automatically imply defensible hypothesis.**

The purpose of this gate is to prevent mechanical string peeling from manufacturing structural truth merely because an operation is technically possible.

## Truth boundary

Logic-first discovery may precede lexical or historical evidence.

However:

- lexical attestation is not required
- historical attestation is not required
- independent meaning may remain Unknown
- structural reproducibility is required
- sufficient structural support is required
- Null remains valid

A rejected structural branch is not evidence against the word.

It means only that the current v0.1 structural rules did not produce a sufficiently supported hypothesis.

## v0.1 defensibility rule

A terminal structural branch is eligible for hypothesis emission only when at least one of the following is true.

### Rule A — multi-operation structural support

The branch contains at least **two independently authorized structural reduction steps**.

Examples:

`STER → TER → ER`

contains two authorized left-frame reductions.

`STERILE → STER → TER → ER`

contains three authorized reductions.

The presence of multiple operations provides independent structural support that is stronger than a single trivial edge peel.

### Rule B — pure Seven-Voices terminal

A one-operation branch may survive when every Unicode symbol of the terminal embryo independently maps to one canonical Seven Voice.

This keeps the explicit Y/Ë control:

`SYË → YË`

where terminal `YË` is entirely composed of canonical voices.

This rule must use the canonical Seven-Voices authority in:

`src/shared/math7.core.ts`

No alternate vowel inventory is allowed.

## Weak one-step non-voice terminals

A single edge peel that leaves a mixed voice/consonant terminal is insufficient in v0.1.

Therefore these branches must not become emitted structural hypotheses merely from one operation:

- `XYZ → YZ`
- `DATA → ATA`
- `DIJ → IJ`
- `MODE → ODE`
- `DAMAGE → AMAGE`

The operation itself may be mechanically valid.

The resulting branch nevertheless fails the hypothesis-defensibility gate.

Required rejection reason:

`insufficient_structural_support`

## Existing multi-step research branches

The gate does not automatically reject a branch merely because lexical meaning is unknown.

A reproducible multi-step branch may remain a structural hypothesis.

This preserves the logic-first posture.

It does not turn that branch into reviewed evidence or functional meaning.

## Integration/status boundary

Logic-derived structural hypotheses are candidate-layer outputs.

They must not overwrite stronger aggregate status truth.

Aggregate precedence remains:

1. reviewed functional evidence
2. candidate-only canonical evidence
3. existing RootMap structural output
4. logic-derived structural hypothesis when no stronger status-driving layer exists
5. Null

This is a status-driving precedence rule.

It does not delete lower-ranked structural hypotheses from the candidate list.

## Structural token ownership

`analysisStatusV0_1.structuralTokens` must represent the structural tokens that drive the aggregate status.

Therefore:

- reviewed `damage` keeps existing `["DA"]`
- reviewed `study` keeps existing `["SHTU", "DI"]`
- candidate-only `data` keeps existing `[]`
- candidate-only `dij` keeps existing `["DI"]`
- existing structural `mode` keeps existing `["M", "DA"]`

Logic-derived hypotheses may still exist in the candidate list where defensible.

They do not contaminate stronger status-driving token sets.

When no stronger layer exists and a defensible logic-derived structural hypothesis prevents Null, its embryos become the structural status tokens.

For `sterile`:

`["ER", "ERILE"]`

may drive:

`structural_unreviewed`.

## Null control

`xyz` is the required Null control.

`XYZ → YZ` is only one reduction and terminal `YZ` is not composed solely of canonical Seven Voices.

Therefore it fails the defensibility gate.

Required result:

- no emitted logic-derived structural hypothesis
- `analysisStatusV0_1.status = null_no_supported_candidate`
- `structuralTokens = []`

## STERILE proving case

The gate must preserve:

`STERILE → STER → TER → ER`

and the larger competing terminal:

`STERILE → TERILE → ERILE`

because each branch contains at least two authorized reductions.

Ordering remains embryo-first:

1. ER
2. ERILE

Independent meaning remains null.

No historical origin, winner, reviewed evidence, or candidate truth is claimed.

## Genericity control

`STER → TER → ER`

must remain valid independently of `STERILE`.

No STERILE-specific branch is authorized.

## Y / Ë control

`SYË → YË`

must remain valid through Rule B.

Y and Ë remain canonical Seven Voices.

## No promotion shortcut

This gate does not:

- register ER in protoRoots
- register ER in canonical operator profiles
- register ER in reviewed evidence
- promote TER
- promote SHTER
- assign lexical meaning
- assign historical origin
- claim a single winner

## Rejection reason code

The discovery layer must support:

`insufficient_structural_support`

for terminal branches that were mechanically reachable but fail the v0.1 defensibility gate.

A rejected branch is not emitted as a `StructuralHypothesisV0_1`.

## Determinism

For identical normalized input and configuration:

- emitted hypotheses are identical
- rejected branches are identical
- ordering is identical
- reason-code behavior is identical

No randomness.

No provider call.

No external evidence lookup.
