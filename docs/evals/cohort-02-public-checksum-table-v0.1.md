# ZË-RO Cohort 02 Public Checksum Table v0.1

Status: PUBLIC CHECKSUM TABLE ONLY
Created: 2026-05-09
Cohort: Cohort 02
Decision basis:
- `docs/evals/cohort-02-publication-readiness-decision-v0.2.md`
- `docs/evals/cohort-02-public-paper-outline-v0.1.md`
- `docs/evals/cohort-02-public-archive-manifest-v0.1.md`

This is not the final public archive.

This does not upload to Zenodo.

This does not submit to LingBuzz.

This does not update README, registry labels, or Cohort 01.

---

## 1. Purpose

This table records the evidence-pack ZIP filenames and SHA256 hashes planned for the Cohort 02 public archive.

It is a planning/checksum document only.

The final public archive ZIP has not been created yet.

---

## 2. Evidence-pack checksums

| Case | Series | Group | ZIP filename | SHA256 |
|---|---|---|---|---|
| Norwegian /ø/ | `t5-no-oe-v1-v3-researcher-v0.1` | first-subset | `evals.series-evidence-pack.t5-no-oe-v1-v3-researcher-v0.1.v0.1.zip` | `3a976caaf223f5dd1fb9c810d13856967b3b3cfd9ceb6130a88a6fe7336857b3` |
| Danish /ø/ | `t5-da-oe-v1-v3-researcher-v0.1` | first-subset | `evals.series-evidence-pack.t5-da-oe-v1-v3-researcher-v0.1.v0.1.zip` | `db8f2781603ce2e676f75e920299750765402ca0b4d3032cb95b2b9514d26f3a` |
| Turkish /ı/ | `t5-tr-ii-v4-v7-researcher-v0.1` | first-subset | `evals.series-evidence-pack.t5-tr-ii-v4-v7-researcher-v0.1.v0.1.zip` | `6847026235fd3829638b5264c24c1724666c2dc139b3f143da74b9f03f4f4c90` |
| Romanian /ă/ v0.1 | `t5-ro-a-breve-v3-v4-researcher-v0.1` | first-subset | `evals.series-evidence-pack.t5-ro-a-breve-v3-v4-researcher-v0.1.v0.1.zip` | `4657743d988608dcdec20a75776d53cf26dde52cc2d0202211fbb01e29e7084e` |
| French /ø~œ/ | `t5-fr-euoe-v5-v7-researcher-v0.1` | second-subset | `evals.series-evidence-pack.t5-fr-euoe-v5-v7-researcher-v0.1.v0.1.zip` | `f39f07e87222a3310b168bab569efc064246c27d433b383ade4d9aba7227e336` |
| Portuguese /â/ original | `t5-pt-aa-v1-v4-researcher-v0.1` | second-subset | `evals.series-evidence-pack.t5-pt-aa-v1-v4-researcher-v0.1.v0.1.zip` | `aaf97cf63fef83b872e1500bf158599cf9340b2db4303a388bc96e688ccf8465` |
| Romanian /ă/ v0.2 | `t5-ro-a-breve-v2-v5-researcher-v0.2` | pressure-redesign | `evals.series-evidence-pack.t5-ro-a-breve-v2-v5-researcher-v0.2.v0.1.zip` | `8176707a8cb878ea01d8c1bef0d5a823b49a5f009a9900bbee384332d6eff213` |
| Portuguese /â/ v0.2 | `t5-pt-aa-v1-v5-researcher-v0.2` | pressure-redesign | `evals.series-evidence-pack.t5-pt-aa-v1-v5-researcher-v0.2.v0.1.zip` | `0f22286ccb9ecb3da4b33255cd2ccd7de4f4ba09d8acc5ecc0013a33c4c06158` |
| Portuguese /â/ replication | `t5-pt-aa-v1-v5-researcher-replication-v0.2` | portuguese-replication | `evals.series-evidence-pack.t5-pt-aa-v1-v5-researcher-replication-v0.2.v0.1.zip` | `ec1f800548923114ef08ce582eeb65ba412c6e638aca3c2968df647990ec8352` |

---

## 3. Excluded evidence

The invalid Portuguese replication `v0.1` export is excluded from final evidence because r02 was accidentally scored with `anchorHigh: V4` while the run ID claimed V1-V5.

Only the corrected Portuguese replication `v0.2` pack is eligible for the public archive.

---

## 4. Final archive checksum

Final archive ZIP:

`zero-cohort-02-six-language-bracket-evidence-v0.1.zip`

Status:

- not built yet;
- no top-level archive SHA256 yet;
- no Zenodo upload yet;
- no LingBuzz submission yet;
- no README link yet.

The top-level archive SHA256 must be filled only after the final archive folder is built and zipped.

---

## 5. Required next archive build step

Next local build step:

1. create final archive folder;
2. copy all listed evidence packs;
3. copy all required repo docs;
4. write archive `README.md`;
5. write `ARCHIVE_METADATA.md`;
6. create `checksums/SHA256SUMS.txt`;
7. create final archive ZIP;
8. create `checksums/TOP_LEVEL_ARCHIVE_SHA256.txt`;
9. update this checksum table with the final archive hash if needed.

---

## 6. Public claim boundary

Allowed:

- Cohort 02 separates support cases from pressure cases.
- French `/ø~œ/` is the strongest support case.
- Norwegian and Danish `/ø/` provide cautious V1-V3 support.
- Portuguese `/â/` replicated V1-V5 improvement but remains edge-stressed.
- Turkish `/ı/` improved under V4-V7 but remains pressure-audit.
- Romanian `/ă/` remains unresolved and is not support.

Blocked:

- Cohort 02 proves the framework.
- Cohort 02 replaces Cohort 01.
- Portuguese `/â/` is final headline support.
- Turkish `/ı/` is settled support.
- Romanian `/ă/` supports any tested bracket.
- French `/ø~œ/` alone proves the high-edge bracket.
- Registry labels should be migrated based on Cohort 02 alone.

---

## 7. Next milestone

Next milestone:

`docs/evals/cohort-02-public-archive-build-plan-v0.1.md`

Do not upload to Zenodo or submit to LingBuzz before the final archive ZIP exists and the top-level archive SHA256 is recorded.

---

## 8. Completion criteria

This checksum table is complete when:

1. evidence-pack filenames are listed;
2. SHA256 values are listed;
3. invalid Portuguese replication v0.1 is excluded;
4. final archive checksum status is stated;
5. public claim boundaries are preserved;
6. next archive-build milestone is defined;
7. no public release claim is made;
8. repo gates pass;
9. PR is merged.
