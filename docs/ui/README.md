# UI Docs Index

This folder is the canonical entrypoint for UI-facing contracts in the ZË-RO repository.

## Purpose

These docs define how the UI is allowed to read, render, and constrain engine output.

They are not feature notes.  
They are the place to look when the question is:

- what may the UI show
- what must the UI not invent
- what is the authority chain from engine → adapter → VM → render
- which UI docs are current contract vs historical record

## Canonical UI contract docs

### Primary UI telemetry contract
- [`../ui-telemetry-contract.v0.1.md`](../ui-telemetry-contract.v0.1.md)

Use this as the main semantic contract for:
- UI telemetry meaning
- UI authority chain
- prohibited UI behavior
- allowed read-only telemetry outputs

### UI instrument hardening / adapter discipline
- [`UI_INSTRUMENT_CONTRACT.v0.1.1.md`](./UI_INSTRUMENT_CONTRACT.v0.1.1.md)

Use this for:
- adapter lock
- missing-state discipline
- stricter correctness enforcement for instrument rendering

## Historical / milestone / proof docs

These are important, but they are not the primary entrypoint for UI contract reading:

- `../UI_TELEMETRY_CONTRACT_v0.1_DONE.md`
- `../contracts/UI_Telemetry_Contract_v0.1_DONE.md`
- `../milestones/ui-telemetry-contract-v0.1.md`
- `../milestones/UI_TELEMETRY_v0.1.2_FROZEN.md`
- `UI_INSTRUMENT_CONTRACT.v0.1.md`

These documents capture:
- done criteria
- proof of completion
- milestone state
- earlier or narrower contract forms

## Current reading order

If you need to understand the UI contract surface, read in this order:

1. `../ui-telemetry-contract.v0.1.md`
2. `./UI_INSTRUMENT_CONTRACT.v0.1.1.md`
3. historical proof / milestone docs only if needed

## Rule

When a UI doc conflict appears:
- prefer the current contract doc over milestone prose
- prefer semantic contract over “DONE” records
- prefer adapter/VM discipline over older ad-hoc UI notes
