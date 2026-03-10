# Process Index

This folder is the entrypoint for workflow, versioning, and operational-process docs in the ZË-RO repository.

## Purpose

Process docs define how work should be done safely and repeatably.

They are not governing engine law by themselves.
They are not subsystem specs.
They are not validation artifacts.

This lane exists to make operational discipline explicit, especially around:

- safe repo workflow
- versioning and snapshot policy
- change-control habits
- anti-drift engineering process

For governing rules, read:
- `docs/constitution/README.md`
- `docs/ENGINE_CONTRACT_FREEZE.md`
- `docs/RECOVERY.md`

## Current process/workflow docs

These docs currently live at the root `docs/` level but function as process/workflow material:

- `docs/dev-workflow.md`
- `docs/versioning-and-snapshot-policy.solo.v1.md`

## Interpretation

These docs should generally be read as:
- operational workflow guidance
- versioning / snapshot discipline
- safe change-management rules
- implementation-process references

They are not the same thing as milestone completion records.

## Relation to milestones

- `docs/MILESTONES.md` remains a milestone ledger / engineering tracking document.
- It is related to process, but it is not the same as the workflow/process lane.

## Reading order

When investigating how work should be done safely in this repo:

1. governing docs / recovery rules
2. process/workflow docs in this lane
3. milestone/history docs only if needed
4. validation/canon artifacts if the question is about drift proof

## Rule

Do not treat a process doc as the same thing as:
- a frozen public contract
- a subsystem spec
- a validation artifact
- a milestone completion record

Those are connected, but they serve different roles.

## Status

This folder is being established as the workflow/process lane.
The listed process docs still live at the root `docs/` level for now and may be relocated later after classification is complete.
