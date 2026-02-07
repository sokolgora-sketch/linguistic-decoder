# CANON_VERIFIER_BATTERY v0.1

## Goal
Freeze a small, deterministic Proposal corpus for `verifyProposalV0_1` so any verifier/rules/surface drift becomes an explicit diff.

## What it is
A Jest snapshot suite that:
- loads Proposal fixtures from `tests/__fixtures__/verifier.proposals/*.json`
- runs `verifyProposalV0_1`
- snapshots the full Verification JSON output

## Fixtures (baseline)
- study
- damage
- father
- mother
- language
- dëm (Ë extraction)

## Tests
- `tests/verifier/verifyProposal.corpus.gold.v0.1.spec.ts`

## DONE criteria
- `npm run gate:quick` passes
- corpus snapshots committed
- future diffs require an explicit PR explanation
