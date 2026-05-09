# Cohort 02 Public Archive Build Result v0.5

Status: FINAL LOCAL ARCHIVE BUILD RESULT
Version: v0.5
Created: 2026-05-09
Project: ZË-RO
Cohort: Cohort 02

This document records the final local Cohort 02 archive candidate after the v0.5 paper PDF was generated and the archive was rebuilt.

This is not a Zenodo upload.

This is not a LingBuzz submission.

This does not update README public links.

This does not migrate registry labels.

## 1. Archive identity

Archive folder:

`zero-cohort-02-six-language-bracket-evidence-v0.1/`

Archive ZIP:

`zero-cohort-02-six-language-bracket-evidence-v0.1.zip`

Local archive path:

`/Users/wei/Desktop/ZËRO /Dwnlosads /FINAL paper evidence /zero-cohort-02-six-language-bracket-evidence-v0.1.zip`

## 2. Final archive SHA256

Top-level archive ZIP SHA256:

`341418850f14a5a2c3f59b06c9b0eff7942d3ff231662a6a1edef87758d0e1db`

Important boundary:

The top-level archive SHA256 is intentionally recorded outside the archive ZIP. It is not embedded inside the paper body or inside archive metadata because the archive contains the paper PDF and would otherwise become self-referential.

## 3. Final paper PDF

Paper PDF inside archive:

`paper/zero-cohort-02-paper-v0.5.pdf`

Local paper PDF path:

`/Users/wei/Desktop/ZËRO /Dwnlosads /FINAL paper evidence /zero-cohort-02-paper-v0.5.pdf`

Paper PDF SHA256:

`90295b78becde2380a8146b5c19eff5c488f9d691c651ef664223def0108cd21`

Paper source inside archive:

`repo-docs/cohort-02-paper-draft-v0.5.md`

Repo source:

`docs/evals/cohort-02-paper-draft-v0.5.md`

## 4. Included evidence packs

Included evidence-pack count:

`9`

Expected evidence-pack groups:

1. Norwegian `/ø/` V1-V3 vs V2-V5
2. Danish `/ø/` V1-V3 vs V2-V5
3. French `/ø~œ/` V5-V7 vs V2-V5
4. Portuguese `/â/` original V1-V4 vs V2-V4
5. Romanian `/ă/` v0.1 V3-V4 vs V2-V4
6. Turkish `/ı/` V4-V7 vs V5-V7
7. Romanian `/ă/` v0.2 V2-V5 vs V3-V4
8. Portuguese `/â/` v0.2 V1-V5 vs V1-V4
9. Portuguese `/â/` corrected replication V1-V5 vs V1-V4

## 5. Included repo documents

The archive includes Cohort 02 repo-tracked documents needed for interpretation and reproduction, including:

- `repo-docs/cohort-02-paper-draft-v0.5.md`
- `repo-docs/cohort-02-token-curation-instructions-v0.1.md`
- Cohort 02 design, subset summaries, pressure notes, publication-readiness, public archive manifest, checksum table, and paper outline documents
- `repo-docs/cohort-battery-workflow-v0.1.md`

Archive-build-result documents are intentionally excluded from the archive to avoid stale/self-referential build metadata.

## 6. Excluded stale files

The rebuilt ZIP was checked to exclude:

- stale paper PDFs:
  - `zero-cohort-02-paper-v0.2.pdf`
  - `zero-cohort-02-paper-v0.3.pdf`
  - `zero-cohort-02-paper-v0.4.pdf`
- stale paper Markdown:
  - `cohort-02-paper-draft-v0.1.md`
  - `cohort-02-paper-draft-v0.2.md`
  - `cohort-02-paper-draft-v0.3.md`
  - `cohort-02-paper-draft-v0.4.md`
- stale archive-build-result docs:
  - `cohort-02-public-archive-build-result-v0.1.md`
  - `cohort-02-public-archive-build-result-v0.2.md`
  - `cohort-02-public-archive-build-result-v0.3.md`
  - `cohort-02-public-archive-build-result-v0.4.md`
- macOS `.DS_Store` files

## 7. Verification commands

Commands run locally:

```bash
unzip -t "/Users/wei/Desktop/ZËRO /Dwnlosads /FINAL paper evidence /zero-cohort-02-six-language-bracket-evidence-v0.1.zip"
shasum -a 256 "/Users/wei/Desktop/ZËRO /Dwnlosads /FINAL paper evidence /zero-cohort-02-six-language-bracket-evidence-v0.1.zip"
shasum -a 256 "/Users/wei/Desktop/ZËRO /Dwnlosads /FINAL paper evidence /zero-cohort-02-paper-v0.5.pdf"
unzip -l "/Users/wei/Desktop/ZËRO /Dwnlosads /FINAL paper evidence /zero-cohort-02-six-language-bracket-evidence-v0.1.zip" | rg "paper/zero-cohort-02-paper-v0.5.pdf|repo-docs/cohort-02-paper-draft-v0.5.md|repo-docs/cohort-02-token-curation-instructions-v0.1.md|PAPER_INCLUDED.md|SHA256SUMS.txt|REPRODUCTION_NOTES.md|ARCHIVE_METADATA.md"
unzip -l "/Users/wei/Desktop/ZËRO /Dwnlosads /FINAL paper evidence /zero-cohort-02-six-language-bracket-evidence-v0.1.zip" | rg "paper-v0\.[234]|paper-draft-v0\.[1234]|public-archive-build-result-v0\.[1234]|\.DS_Store" || echo "OK"
```

Result:

- archive ZIP integrity passed;
- final v0.5 paper PDF is present;
- final v0.5 paper source is present;
- token curation protocol is present;
- checksums and reproduction notes are present;
- stale v0.2/v0.3/v0.4 paper files are absent;
- stale archive-build-result docs are absent;
- `.DS_Store` files are absent.

## 8. Public status

At this point:

- Zenodo upload: no
- DOI: no
- LingBuzz submission: no
- README public chain update: no
- registry migration: no

## 9. Next step

Next step is Zenodo upload using:

`/Users/wei/Desktop/ZËRO /Dwnlosads /FINAL paper evidence /zero-cohort-02-six-language-bracket-evidence-v0.1.zip`

with top-level SHA256:

`341418850f14a5a2c3f59b06c9b0eff7942d3ff231662a6a1edef87758d0e1db`
