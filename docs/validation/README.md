# Validation Index

This folder is the entrypoint for validation-facing reports and baseline artifacts in the ZË-RO repository.

## Purpose

Validation docs record whether current output still matches locked expectations.

They are not governing engine law by themselves.  
They are evidence and regression artifacts used to detect drift, compare against baselines, and make changes auditable.

For governing rules, read:
- `docs/constitution/README.md`
- `docs/ENGINE_CONTRACT_FREEZE.md`
- `docs/RECOVERY.md`

## What lives here

This folder contains:
- latest human-readable validation reports
- latest canon diff reports
- current vs baseline JSON artifacts
- reproducibility / drift checkpoints

## Current key artifacts

### Latest human-readable reports
- `VALIDATION_REPORT_LATEST_v0.1.md`
- `VALIDATION_REPORT_LATEST_v0.2.md`
- `CANON_C2_DIFF_LATEST_v0.2.md`

### Current JSON artifacts
- `validation.results.current.v0.1.json`
- `validation.results.current.v0.2.json`
- `canonC2.current.v0.2.json`

### Baseline JSON artifacts
- `validation.results.baseline.v0.1.json`
- `validation.results.baseline.v0.2.json`

## How to read this folder

Read in this order:

1. latest markdown report
2. latest canon diff report
3. current JSON artifact
4. baseline JSON artifact

Use markdown files for fast inspection.  
Use JSON files for exact reproducible comparison.

## Rule

When a validation artifact disagrees with current expectations:
- inspect the diff first
- do not blindly refresh baselines
- treat baseline updates as explicit versioned decisions, not cleanup
