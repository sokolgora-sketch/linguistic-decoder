# Specs Index

This folder is the entrypoint for active specification and reference-design docs in the ZË-RO repository.

## Purpose

Spec docs describe how major parts of the system are intended to work.

They are more concrete than broad roadmap/governance docs, but they are not the same thing as:
- milestone notes
- validation artifacts
- historical archive material

This lane is for active technical reference docs that help answer:

- what shape a subsystem is supposed to have
- what an endpoint or export surface is supposed to expose
- what a structural or engine-level design intends to preserve

For governing rules, read:
- `docs/constitution/README.md`
- `docs/ENGINE_CONTRACT_FREEZE.md`
- `docs/ROADMAP_V1_BOUNDARY.md`
- `docs/RECOVERY.md`

## Current spec/reference docs

These docs currently live at the root `docs/` level but function as spec/reference material:

- `docs/DEEPR00T_HEART_ALIGNMENT_GATE_v0.1_SPEC.md`
- `docs/engine-core-v2.md`
- `docs/engine-export-v1.md`
- `docs/ENGINE_V1.md`
- `docs/PROJECT_STRUCTURE.md`
- `docs/protoRoots.v1.md`
- `docs/word-matrix-v1.md`

## Interpretation

These docs should generally be read as:
- active design/spec references
- subsystem definitions
- implementation-facing reference material

They are not automatically governing contract law unless a governing doc explicitly says so.

## Reading order

When investigating a spec/design question in this lane:

1. governing docs / constitution
2. relevant spec/reference doc
3. milestone/history docs only if needed
4. validation artifacts if the question is about drift or proof

## Rule

Do not treat a spec doc as the same thing as:
- a frozen public contract
- a milestone completion record
- a validation report
- an archive artifact

Those may relate to the same subsystem, but they serve different roles.

## Status

This folder is being established as the spec/reference lane.  
The listed spec docs still live at the root `docs/` level for now and may be relocated later after classification is complete.
