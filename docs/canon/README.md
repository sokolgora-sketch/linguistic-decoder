# Canon Index

This folder is the entrypoint for canon-battery documentation in the ZË-RO repository.

## Purpose

Canon docs define the small locked batteries used to detect meaningful drift.

They are not general research notes.  
They are not broad validation reports.  
They are the compact deterministic reference layer that helps answer:

- did a change alter locked canon behavior
- which train/holdout sets are part of the canon battery
- where diff-report expectations come from

For governing rules, read:
- `docs/constitution/README.md`
- `docs/ENGINE_CONTRACT_FREEZE.md`
- `docs/RECOVERY.md`

## What lives here

This folder should contain:
- canon battery specs
- train / holdout canon definitions
- canon diff-report references
- canon-specific deterministic acceptance docs

## Current file

- `canonC2.v0.1.md`

## Current interpretation

`canonC2.v0.1.md` defines the Canon C2 deterministic train/holdout + diff-report layer.

It should be read as:
- canon battery specification
- regression-tripwire documentation
- a bridge between tests and baseline expectations

It is more specific than general validation reporting.

## Reading order

If you are investigating canon stability in this lane:

1. governing contract / recovery rules
2. canon spec in this folder
3. validation diff/baseline outputs
4. milestone/history docs only if needed

## Rule

Do not treat canon docs as the same thing as:
- research notes
- milestone prose
- general validation summaries

Canon docs are the locked small-battery reference layer.
