# Cohort 02 Cross-Model Supplement Archive Build Result v0.1

Status: LOCAL ARCHIVE CANDIDATE
Project: ZË-RO
Cohort: Cohort 02
Archive ID: `cohort-02-cross-model-supplement-v0.1`
Date recorded: 2026-05-13

This document records the local archive build result for the Cohort 02 cross-model supplement set.

It is not a Zenodo upload. It does not update README, LingBuzz, registry labels, or public claims.

## 1. Archive file

Local archive ZIP:

`cohort-02-cross-model-supplement-v0.1.zip`

Local archive path at build time:

`/Users/wei/Desktop/ZËRO /Dwnlosads /FINAL paper evidence /cohort-02-cross-model-supplement-v0.1.zip`

Top-level SHA256:

`aa9b6684632cda9b49c8d135161969d3e7c9a676cc0821586de39c9070af94b7`

Archive size:

`1.0M`

Archive file count:

`25 files`

Build repo commit:

`f39d0f8`

Build repo branch:

`main`

## 2. Included repo documents

The archive includes these repo-tracked documents:

- `docs/cohort-02-cross-model-supplement-manifest-v0.1.md`
- `docs/cohort-02-french-cross-model-replication-batch-v0.1.md`
- `docs/cohort-02-danish-cross-model-replication-batch-v0.1.md`
- `docs/cohort-02-turkish-cross-model-pressure-audit-batch-v0.1.md`

Source repo documents:

- `docs/evals/cohort-02-cross-model-supplement-manifest-v0.1.md`
- `docs/evals/cohort-02-french-cross-model-replication-batch-v0.1.md`
- `docs/evals/cohort-02-danish-cross-model-replication-batch-v0.1.md`
- `docs/evals/cohort-02-turkish-cross-model-pressure-audit-batch-v0.1.md`

## 3. Included evidence packs

The archive includes 10 evidence-pack ZIP files.

### 3.1 French `/ø~œ/`

| Source | Evidence pack | SHA256 |
|---|---|---|
| Claude | `evals.series-evidence-pack.French_Claude-assisted_researcher-reviewed_cross-model_replication_v0.1.v0.1.zip` | `9b569621dad195f2ba35803b15a50c0a2ce7955fa9219032ceb5979e260185c4` |
| Gemini | `evals.series-evidence-pack.t5-fr-euoe-v5-v7-gemini-assisted-researcher-reviewed-v0.1.v0.1.zip` | `6ae1cb2f9d5702cc86945198eb8313385bb7788a32e5fc7390efe06802a37511` |
| Grok | `evals.series-evidence-pack.t5-fr-euoe-v5-v7-grok-assisted-researcher-reviewed-v0.1.v0.1.zip` | `641f78e0ba56516bded61bed4a465d86ca5ac96a2f6aae71bced215740f334cb` |
| DeepSeek | `evals.series-evidence-pack.t5-fr-euoe-v5-v7-deepseek-assisted-researcher-reviewed-v0.1.v0.1 (1).zip` | `770dc1f9c5f2187636116153e4dee0789b828f25f23770c83ae21af6c96d9e17` |

### 3.2 Danish `/ø/`

| Source | Evidence pack | SHA256 |
|---|---|---|
| Claude | `evals.series-evidence-pack.Danish_Claude-assisted_researcher-reviewed_cross-model_replication_v0.1.v0.1.zip` | `4bcf0bbd081116730e676efc39448e4dfd34732c6024bb73714e0cf52ef7974a` |
| Grok | `evals.series-evidence-pack.Danish_Grok-assisted_researcher-reviewed_cross-model_replication_v0.1.v0.1.zip` | `0dc7cc6579e07208c322773e45c8a0cf25a6c46c47e3750a3ecba37f65ee59e9` |
| DeepSeek | `evals.series-evidence-pack.Danish_DeepSeek-assisted_researcher-reviewed_cross-model_replication_v0.1.v0.1 (1).zip` | `e3c90bf81a2a39299c6edc3a42a1ed097504ada56901b346c71756cc54e50575` |

### 3.3 Turkish `/ı/`

| Source | Evidence pack | SHA256 |
|---|---|---|
| Claude | `evals.series-evidence-pack.Turkish_Claude-assisted_researcher-reviewed_cross-model_pressure_audit_v0.1.v0.1.zip` | `9fda8ff51236a38aa9ae5f4ce9e504ee2dcc383c19e003c75d8f3088d6eb04ff` |
| Grok | `evals.series-evidence-pack.Turkish_Grok-assisted_researcher-reviewed_cross-model_pressure_audit_v0.1.v0.1.zip` | `ca191962b8f093087f08f59956c3dbd3e7782de307071abb0ddc5e97c6fcc2b7` |
| DeepSeek | `evals.series-evidence-pack.Turkish_DeepSeek-assisted_researcher-reviewed_cross-model_pressure_audit_v0.1.v0.1.zip` | `b1e34556039f4c65b892068d427f0a0069b7dce0ec5212c122a4aab04bddbe42` |

## 4. Archive structure

The archive contains:

- `README.md`
- `ARCHIVE_BUILD_METADATA.md`
- `docs/`
- `evidence-packs/french/`
- `evidence-packs/danish/`
- `evidence-packs/turkish/`
- `checksums/ARCHIVE_FILELIST.txt`
- `checksums/SHA256SUMS.txt`

## 5. Verification performed

The local build script performed these checks:

- repo was on clean synced `main`;
- required repo docs existed;
- all 10 evidence packs existed;
- all 10 evidence-pack SHA256 hashes matched expected values;
- staging tree was created;
- file-level checksum table was generated;
- archive ZIP was created;
- `unzip -t` reported no errors;
- top-level archive SHA256 was recorded;
- repo status remained unchanged after local archive build.

## 6. Claim boundaries

Allowed:

- This is a local archive candidate for the cross-model supplement.
- The archive contains French, Danish, and Turkish cross-model evidence packs.
- The archive preserves the support / cleaner-provisional support / pressure-audit distinction.

Blocked:

- This is not a public release.
- This is not a Zenodo upload.
- This does not update README.
- This does not update LingBuzz.
- This does not migrate registry labels.
- This does not prove the full ZË-RO framework.
- This does not make Turkish `/ı/` support.

## 7. Publication status

Current status:

- Local archive ZIP exists.
- Top-level SHA256 exists.
- Archive build result is repo-recorded after this PR.
- Zenodo upload: no.
- README update: no.
- LingBuzz update: no.
- Registry migration: no.

Recommended next step:

- Decide whether to keep this archive local/internal or prepare a Zenodo supplement upload.
- Do not update README/LingBuzz/Zenodo until an explicit publication decision is made.
