# ZË-RO Cohort 02 Public Archive Manifest v0.1

Status: PUBLIC ARCHIVE MANIFEST ONLY
Created: 2026-05-09
Cohort: Cohort 02
Decision basis:
- `docs/evals/cohort-02-publication-readiness-decision-v0.2.md`
- `docs/evals/cohort-02-public-paper-outline-v0.1.md`

This is not the final public archive.

This does not upload to Zenodo.

This does not submit to LingBuzz.

This does not update README, registry labels, or Cohort 01.

---

## 1. Archive purpose

The Cohort 02 public archive should preserve enough material for a reader to inspect:

- the planned case set;
- the researcher-reviewed scoring series;
- evidence-pack exports;
- internal summaries;
- pressure-case notes;
- publication-readiness decisions;
- checksum evidence;
- reproduction instructions.

The archive must show both support and pressure evidence.

---

## 2. Archive name

Planned archive name:

`zero-cohort-02-six-language-bracket-evidence-v0.1`

Planned public ZIP name:

`zero-cohort-02-six-language-bracket-evidence-v0.1.zip`

Publication status:

- not public yet;
- not uploaded yet;
- not DOI-linked yet.

---

## 3. Required evidence-pack groups

### 3.1 First subset

Required evidence packs:

| Case | Series |
|---|---|
| Norwegian `/ø/` | `t5-no-oe-v1-v3-researcher-v0.1` |
| Danish `/ø/` | `t5-da-oe-v1-v3-researcher-v0.1` |
| Turkish `/ı/` | `t5-tr-ii-v4-v7-researcher-v0.1` |
| Romanian `/ă/` | `t5-ro-a-breve-v3-v4-researcher-v0.1` |

### 3.2 Second subset

Required evidence packs:

| Case | Series |
|---|---|
| French `/ø~œ/` | `t5-fr-euoe-v5-v7-researcher-v0.1` |
| Portuguese `/â/` original | `t5-pt-aa-v1-v4-researcher-v0.1` |

### 3.3 Pressure redesign

Required evidence packs:

| Case | Series |
|---|---|
| Romanian `/ă/` v0.2 | `t5-ro-a-breve-v2-v5-researcher-v0.2` |
| Portuguese `/â/` v0.2 | `t5-pt-aa-v1-v5-researcher-v0.2` |

### 3.4 Portuguese replication

Required evidence pack:

| Case | Series | SHA256 |
|---|---|---|
| Portuguese `/â/` replication | `t5-pt-aa-v1-v5-researcher-replication-v0.2` | `ec1f800548923114ef08ce582eeb65ba412c6e638aca3c2968df647990ec8352` |

The invalid Portuguese replication `v0.1` export must not be included as final evidence.

---

## 4. Required repo documents

The public archive should include these repo-tracked documents:

| File | Purpose |
|---|---|
| `docs/evals/cohort-02-design-v0.1.md` | Cohort 02 design |
| `docs/evals/cohort-02-token-curation-instructions-v0.1.md` | token curation procedure |
| `docs/evals/cohort-battery-workflow-v0.1.md` | scoring/export workflow |
| `docs/evals/cohort-02-first-subset-summary-v0.1.md` | first subset results |
| `docs/evals/cohort-02-second-subset-summary-v0.1.md` | second subset results |
| `docs/evals/cohort-02-pressure-redesign-plan-v0.2.md` | pressure redesign plan |
| `docs/evals/cohort-02-pressure-redesign-results-v0.2.md` | pressure redesign results |
| `docs/evals/cohort-02-portuguese-replication-summary-v0.1.md` | Portuguese replication summary |
| `docs/evals/cohort-02-romanian-a-breve-pressure-note-v0.1.md` | Romanian pressure explanation |
| `docs/evals/cohort-02-turkish-dotless-i-pressure-audit-note-v0.1.md` | Turkish pressure-audit framing |
| `docs/evals/cohort-02-internal-synthesis-v0.1.md` | internal synthesis |
| `docs/evals/cohort-02-publication-readiness-decision-v0.2.md` | publication-readiness decision |
| `docs/evals/cohort-02-public-paper-outline-v0.1.md` | public paper outline |
| `docs/evals/cohort-02-public-archive-manifest-v0.1.md` | this manifest |

---

## 5. Required archive folder layout

Planned layout:

```text
zero-cohort-02-six-language-bracket-evidence-v0.1/
  README.md
  ARCHIVE_METADATA.md
  evidence-packs/
    first-subset/
    second-subset/
    pressure-redesign/
    portuguese-replication/
  repo-docs/
  checksums/
    SHA256SUMS.txt
    TOP_LEVEL_ARCHIVE_SHA256.txt
  reproduction/
    REPRODUCTION_NOTES.md
6. Required checksum work

Before public release:

compute SHA256 for every included file;
save file-level hashes to checksums/SHA256SUMS.txt;
create the final archive ZIP;
compute top-level archive SHA256;
save top-level hash to checksums/TOP_LEVEL_ARCHIVE_SHA256.txt;
record the final hash in the paper and archive README.
7. Required archive README

The archive README must state:

archive name;
repo commit used;
cohort status;
included cases;
evidence-pack list;
repo-doc list;
how to inspect evidence packs;
claim boundaries;
known limitations;
no claim that Cohort 02 proves the full framework.
8. Public claim boundary

The archive must preserve these public-safe boundaries:

Allowed:

Cohort 02 separates support cases from pressure cases.
French /ø~œ/ is the strongest support case.
Norwegian and Danish /ø/ provide cautious V1-V3 support.
Portuguese /â/ replicated V1-V5 improvement but remains edge-stressed.
Turkish /ı/ improved under V4-V7 but remains pressure-audit.
Romanian /ă/ remains unresolved and is not support.

Blocked:

Cohort 02 proves the framework.
Cohort 02 replaces Cohort 01.
Portuguese /â/ is final headline support.
Turkish /ı/ is settled support.
Romanian /ă/ supports any tested bracket.
French /ø~œ/ alone proves the high-edge bracket.
Registry labels should be migrated based on Cohort 02 alone.
9. Next milestone

Next repo milestone:

docs/evals/cohort-02-public-checksum-table-v0.1.md

That document should record:

actual evidence-pack filenames;
file-level SHA256 values;
final archive ZIP name;
top-level archive SHA256.

Do not upload to Zenodo or submit to LingBuzz before the checksum table exists.

10. Completion criteria

This manifest is complete when:

required evidence-pack groups are listed;
required repo docs are listed;
planned archive layout is listed;
checksum requirements are listed;
archive README requirements are listed;
public claim boundaries are listed;
next milestone is defined;
no public release claim is made;
repo gates pass;
PR is merged.
