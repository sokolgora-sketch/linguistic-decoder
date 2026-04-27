# NPM audit triage — 2026-04

## Status

As of 2026-04-27, the ZË-RO repository has addressed the actionable NPM audit findings that had safe non-force remediation paths:

- `fast-xml-parser <5.7.0` was resolved by bumping the transitive lockfile resolution to `5.7.2`.
- `postcss <8.5.10` was resolved by:
  - bumping `next` to `16.2.4`
  - pinning `postcss` to `8.5.10`
  - adding an npm override for `postcss` so nested PostCSS under Next resolves to the patched version.

The remaining audit finding is the transitive `uuid <14.0.0` advisory.

## Remaining advisory

### `uuid <14.0.0`

NPM audit reports:

- severity: moderate
- advisory: missing buffer bounds check in uuid v3/v5/v6 when `buf` is provided
- status: no direct fix available through `npm audit`
- location: transitive dependency paths, not direct application code

Observed dependency paths include:

- `genkit`
- `@genkit-ai/*`
- `firebase-admin`
- `@google-cloud/*`
- `google-gax`
- `googleapis-common`
- `gaxios`
- `exceljs`
- `teeny-request`
- `eventid`

## Decision

This advisory is accepted as a tracked transitive risk for now.

We are not applying a global `uuid` override and we are not running `npm audit fix --force`.

## Reasoning

A forced or global override to `uuid@14` is unsafe because multiple upstream packages depend on older UUID major versions. UUID major upgrades can change module format, import semantics, and runtime behavior. Forcing a major version across Google Cloud, Genkit, Firebase Admin, ExcelJS, and related packages could create hidden runtime failures.

The repository should wait for upstream packages to update their dependency ranges or for an official safe remediation path.

## Current mitigation

- Do not call vulnerable `uuid` v3/v5/v6 APIs with attacker-controlled `buf` values in application code.
- Do not add new direct usage of vulnerable UUID APIs.
- Keep dependency bumps reviewed through PRs with full gates.
- Continue running:
  - `npm audit`
  - `npm run gate:quick`
  - `npm run build`

## Revisit trigger

Revisit this decision when one of the following becomes true:

- `npm audit` reports a safe non-force remediation path.
- Genkit / Firebase Admin / Google Cloud packages publish updates that reduce or remove the vulnerable UUID dependency tree.
- The project adds direct UUID usage that touches v3/v5/v6 buffer APIs.
- The advisory severity or exploitability changes materially.

## Proof commands

```bash
npm audit || true
npm ls uuid || true
npm run gate:quick
npm run build
```

## Current conclusion

The repository has fixed the actionable fast-xml-parser and postcss findings. The remaining uuid advisory is documented and accepted as a transitive dependency risk pending upstream remediation.
