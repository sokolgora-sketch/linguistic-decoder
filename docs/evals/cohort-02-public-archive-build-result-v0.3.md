# ZË-RO Cohort 02 Public Archive Build Result v0.3

Status: LOCAL ARCHIVE BUILD RESULT ONLY
Created: 2026-05-09
Cohort: Cohort 02
Repo commit at build: `a2285d9`

This document records the final local archive candidate after adding the Cohort 02 paper v0.3 PDF and removing stale v0.2 paper files.

This supersedes:

- `docs/evals/cohort-02-public-archive-build-result-v0.1.md`
- the closed/stale PR #968 v0.2 archive result branch

Reason:

- v0.1 archive build result recorded the archive before the paper PDF existed.
- v0.2 archive build result recorded the archive before the scoring-mechanics paper correction.
- v0.3 records the corrected archive candidate with the final v0.3 paper PDF included.

This is not a Zenodo upload.

This is not a LingBuzz submission.

This does not update README, registry labels, or Cohort 01.

---

## 1. Archive result

Archive folder:

`zero-cohort-02-six-language-bracket-evidence-v0.1/`

Archive ZIP:

`zero-cohort-02-six-language-bracket-evidence-v0.1.zip`

Local path:

`/Users/wei/Desktop/ZËRO /Dwnlosads /FINAL paper evidence /zero-cohort-02-six-language-bracket-evidence-v0.1.zip`

ZIP size:

`1.4M`

Top-level archive SHA256:

`8fbc7d0196ef7c7f808cec68e663fba160b47ff835daef34889bf2b90e5991d5`

---

## 2. Paper PDF result

Included paper PDF:

`paper/zero-cohort-02-paper-v0.3.pdf`

Local paper path:

`/Users/wei/Desktop/ZËRO /Dwnlosads /FINAL paper evidence /zero-cohort-02-paper-v0.3.pdf`

PDF size:

`706K`

PDF pages:

`8`

Paper PDF SHA256:

`18d6ef128d4b00ecd2390284d4ccff778ce13a5be726713dfb938e98785d445b`

Markdown source included in archive:

`repo-docs/cohort-02-paper-draft-v0.3.md`

---

## 3. Included evidence packs

Included evidence-pack count:

`9`

Included evidence:

- Norwegian `/ø/` — `t5-no-oe-v1-v3-researcher-v0.1`
- Danish `/ø/` — `t5-da-oe-v1-v3-researcher-v0.1`
- Turkish `/ı/` — `t5-tr-ii-v4-v7-researcher-v0.1`
- Romanian `/ă/` v0.1 — `t5-ro-a-breve-v3-v4-researcher-v0.1`
- French `/ø~œ/` — `t5-fr-euoe-v5-v7-researcher-v0.1`
- Portuguese `/â/` original — `t5-pt-aa-v1-v4-researcher-v0.1`
- Romanian `/ă/` v0.2 — `t5-ro-a-breve-v2-v5-researcher-v0.2`
- Portuguese `/â/` v0.2 — `t5-pt-aa-v1-v5-researcher-v0.2`
- Portuguese `/â/` replication — `t5-pt-aa-v1-v5-researcher-replication-v0.2`

The invalid Portuguese replication `v0.1` export is excluded.

---

## 4. Included archive files

The rebuilt archive contains:

- `README.md`
- `ARCHIVE_METADATA.md`
- `paper/PAPER_INCLUDED.md`
- `paper/zero-cohort-02-paper-v0.3.pdf`
- `checksums/SHA256SUMS.txt`
- `reproduction/REPRODUCTION_NOTES.md`
- `evidence-packs/`
- `repo-docs/`

The archive ZIP was verified with:

`unzip -t`

The archive ZIP listing confirms the v0.3 paper PDF is inside the archive.

The archive ZIP listing confirms no stale v0.2 paper files remain.

---

## 5. Public status

Current status:

- local archive candidate rebuilt with final v0.3 paper PDF;
- no Zenodo DOI yet;
- no LingBuzz submission yet;
- no README public link yet;
- no registry migration yet;
- no Cohort 01 modification.

---

## 6. Claim boundary

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

Zenodo archive upload.

Upload candidate:

`zero-cohort-02-six-language-bracket-evidence-v0.1.zip`

Expected upload SHA256:

`8fbc7d0196ef7c7f808cec68e663fba160b47ff835daef34889bf2b90e5991d5`

Do not submit to LingBuzz or update README before the Zenodo DOI exists.

---

## 8. Completion criteria

This v0.3 build result is complete when:

1. rebuilt archive ZIP name is recorded;
2. rebuilt archive SHA256 is recorded;
3. final paper PDF path and SHA256 are recorded;
4. final paper source path is recorded;
5. included evidence packs are listed;
6. invalid Portuguese replication v0.1 remains excluded;
7. no stale v0.2 paper files remain in the archive;
8. public status is stated;
9. claim boundaries are preserved;
10. repo gates pass;
11. PR is merged.
