# ZË-RO Cohort 02 Cross-Model Supplement: Replication, Cleaner-Provisional Support, and Pressure Evidence

Status: DRAFT FOR LINGBUZZ SUPPLEMENT NOTE
Project: ZË-RO
Author: Sokol Gora
Date drafted: 2026-05-14
Target venue: LingBuzz supplement note
Related paper: `lingbuzz/009986`
Related paper URL: `https://ling.auf.net/lingbuzz/009986`
Supplement archive DOI: `https://doi.org/10.5281/zenodo.20174451`
Supplement all-versions DOI: `https://doi.org/10.5281/zenodo.20174450`
Related Cohort 02 archive DOI: `https://doi.org/10.5281/zenodo.20116021`

## Abstract

This short supplement note documents the post-publication cross-model evidence archive for the ZË-RO Cohort 02 bracket-testing study. The supplement archive contains assistant-assisted, researcher-reviewed evidence for three cases selected from the Cohort 02 result space: French `/ø~œ/`, Danish `/ø/`, and Turkish `/ı/`. The goal is not to upgrade the main Cohort 02 claim, but to record whether a small cross-model curation set preserves the distinction between support, cleaner-provisional support, and unresolved pressure. French `/ø~œ/` remains the strongest cross-model support case in this supplement, Danish `/ø/` remains a cleaner-provisional support case, and Turkish `/ı/` remains an unresolved high-region pressure case. The supplement should therefore be read as a traceability and replication note, not as a proof of the full ZË-RO framework.

## 1. Purpose of this note

The main Cohort 02 paper reported support and pressure cases across six languages. After publication, a smaller cross-model supplement was created to check whether three representative cases remain interpretable when token curation is repeated across assistant-assisted, researcher-reviewed sources.

This note records that supplement in a readable form.

The note has three purposes:

1. to identify the public supplement archive;
2. to explain why the three cases were selected;
3. to preserve conservative interpretation boundaries.

It does not replace the main Cohort 02 paper. It does not change the evaluation task. It does not introduce a new scoring method. It does not claim that the full ZË-RO framework is proven.

## 2. Public supplement archive

The supplement archive is published on Zenodo as:

- title: `ZË-RO Cohort 02 Cross-Model Supplement Archive v0.1`;
- DOI: `https://doi.org/10.5281/zenodo.20174451`;
- all-versions DOI: `https://doi.org/10.5281/zenodo.20174450`;
- file: `cohort-02-cross-model-supplement-v0.2.zip`;
- local SHA256 recorded in repo: `dfc16e7fa6d081fe69fd8a2bb3a5213acecfcbbd6729642dbf080ec1852b3328`;
- Zenodo MD5: `003e62a9ead607f261e79b891e16db85`.

The archive is linked to the Cohort 02 evidence archive:

- `https://doi.org/10.5281/zenodo.20116021`.

The repository publication record is:

- `docs/evals/cohort-02-cross-model-supplement-zenodo-publication-v0.1.md`.

## 3. What was tested

The supplement focuses on three target vowels:

| Case | Role in supplement | Candidate bracket | Control bracket | Interpretation |
|---|---|---:|---:|---|
| French `/ø~œ/` | support case | V5-V7 | V2-V5 | cross-model support |
| Danish `/ø/` | cleaner-provisional support case | V1-V3 | V2-V5 | cleaner than control, but not decisive |
| Turkish `/ı/` | pressure-audit case | V4-V7 | V5-V7 | unresolved high-region pressure |

The three cases were not selected to maximize positive results. They were selected to preserve a balanced support/pressure distinction:

- French tests whether a strong high-edge front-rounded case remains stable.
- Danish tests whether a cleaner low-edge front-rounded case remains stable without overclaiming.
- Turkish tests whether a known high-region pressure case remains unresolved under cross-model curation.

## 4. Method summary

Each case uses the existing `T5_INTERMEDIATE_V0_1` intermediate-triple task format.

Each run preserves:

- a target vowel bucket;
- a lower anchor bucket;
- a higher anchor bucket;
- candidate/control bracket labels;
- assistant-assisted, researcher-reviewed token curation;
- evidence-pack export;
- checksum and archive-level traceability.

The supplement does not alter the scoring engine. It adds a cross-model curation layer around selected cases.

The archive contains 10 evidence-pack ZIP files:

- 4 French packs;
- 3 Danish packs;
- 3 Turkish packs.

These packs are grouped with the supplement manifest, batch docs, checksum files, and archive metadata.

## 5. Case summaries

### 5.1 French `/ø~œ/`

French `/ø~œ/` is treated as the support case in the supplement.

The candidate bracket is V5-V7. The control bracket is V2-V5.

Across Claude-, Gemini-, Grok-, and DeepSeek-assisted researcher-reviewed curation, the French case remains the clearest support pattern in the supplement. The candidate bracket repeatedly remains more stable than the control bracket, while the control condition tends toward high-boundary stress or collapse.

Interpretation:

> French `/ø~œ/` remains cross-model support evidence for V5-V7 over V2-V5.

Boundary:

> This does not mean French alone proves the high-edge bracket, and it does not prove the full framework.

### 5.2 Danish `/ø/`

Danish `/ø/` is treated as the cleaner-provisional support case in the supplement.

The candidate bracket is V1-V3. The control bracket is V2-V5.

Across Claude-, Grok-, and DeepSeek-assisted researcher-reviewed curation, Danish remains cleaner under the V1-V3 candidate bracket than under the V2-V5 control bracket. However, the controls do not categorically collapse in a way that would justify stronger language.

Interpretation:

> Danish `/ø/` remains cleaner-provisional support evidence for V1-V3 over V2-V5.

Boundary:

> Danish should not be described as a decisive falsification of V2-V5. It is a cleaner provisional result, not a final bracket proof.

### 5.3 Turkish `/ı/`

Turkish `/ı/` is treated as the pressure-audit case in the supplement.

The candidate bracket is V4-V7. The control bracket is V5-V7.

Across Claude-, Grok-, and DeepSeek-assisted researcher-reviewed curation, Turkish does not become a stable support case. The wider V4-V7 candidate condition does not consistently rescue the target, and the V5-V7 control condition remains high-boundary unstable.

Interpretation:

> Turkish `/ı/` remains unresolved high-region pressure evidence.

Boundary:

> Turkish `/ı/` should not be promoted to support. It remains a visible pressure case for the high-region model.

## 6. Supplement-level interpretation

The supplement is useful because it does not contain only positive evidence.

The result pattern is:

| Class | Case | Supplement reading |
|---|---|---|
| Support | French `/ø~œ/` | strongest cross-model support case |
| Cleaner-provisional support | Danish `/ø/` | cleaner than control, but cautiously framed |
| Pressure | Turkish `/ı/` | unresolved pressure, not support |

This pattern supports a modest claim:

> Cross-model assistant-assisted researcher-reviewed curation preserves the distinction between support, cleaner-provisional support, and unresolved pressure in this three-case supplement.

This is narrower than saying the full model is correct. The supplement is a traceability extension, not a theory-wide validation.

## 7. Limitations

This supplement has several limits.

First, it covers only three cases. It cannot represent the full Cohort 02 result space.

Second, the supplement uses assistant-assisted token curation. Researcher review is present, but token generation is not purely human-only.

Third, the supplement tests selected bracket contrasts rather than all possible bracket placements.

Fourth, the archive records evidence packs and checksums, but it is not a new scoring method.

Fifth, Turkish `/ı/` remains unresolved. This is important because a support-only supplement would be misleading.

## 8. Recommended citation

Cite the main Cohort 02 paper as the primary paper:

> Gora, S. (2026). *Seven-Primal-Vowel Bracket Testing: Cohort 02 Support and Pressure Cases Across Six Languages*. LingBuzz, `lingbuzz/009986`.

Cite the supplement archive for the cross-model evidence packs:

> Gora, S. (2026). *ZË-RO Cohort 02 Cross-Model Supplement Archive v0.1* (v0.1) [Data set]. Zenodo. `https://doi.org/10.5281/zenodo.20174451`.

The all-versions supplement DOI is:

> `https://doi.org/10.5281/zenodo.20174450`.

## 9. Claim boundaries

Allowed:

- The supplement archive is public.
- The supplement improves traceability.
- French `/ø~œ/` remains cross-model support evidence.
- Danish `/ø/` remains cleaner-provisional support evidence.
- Turkish `/ı/` remains unresolved pressure evidence.
- The supplement preserves a support/pressure distinction.

Blocked:

- Do not say the supplement proves the full ZË-RO framework.
- Do not say all front-rounded vowels are solved.
- Do not say Turkish `/ı/` is support.
- Do not say Danish `/ø/` decisively falsifies V2-V5.
- Do not say French `/ø~œ/` alone proves the high-edge bracket.
- Do not upgrade the main Cohort 02 claim.

## 10. Publication status

Current status:

- Zenodo supplement archive: published.
- Repository README: linked.
- LingBuzz supplement note: draft only.
- LingBuzz upload: not done.
- README LingBuzz link: not added.

Next operational steps:

1. Review this draft.
2. Convert to PDF if accepted.
3. Upload as a short LingBuzz supplement note.
4. Record the LingBuzz reference in repo after publication.
5. Update README only after the LingBuzz reference exists.
