# Cohort 02 Cross-Model Supplement Zenodo Upload Plan v0.1

Status: UPLOAD PLAN ONLY
Project: ZË-RO
Cohort: Cohort 02
Archive ID: `cohort-02-cross-model-supplement-v0.1`
Date recorded: 2026-05-14

This document defines the planned Zenodo upload for the Cohort 02 cross-model supplement archive.

It does not upload to Zenodo. It does not publish a record. It does not update README, LingBuzz, registry labels, or public claims.

## 1. Current local archive candidate

Local archive ZIP:

`cohort-02-cross-model-supplement-v0.1.zip`

Top-level SHA256:

`aa9b6684632cda9b49c8d135161969d3e7c9a676cc0821586de39c9070af94b7`

Recorded in repo:

`docs/evals/cohort-02-cross-model-supplement-archive-build-result-v0.1.md`

Current archive status:

- local archive candidate exists;
- ZIP integrity was verified with `unzip -t`;
- all 10 evidence-pack hashes matched expected values;
- archive build result was repo-recorded in PR #988;
- no Zenodo upload has been made.

## 2. Recommended publication route

Use a two-step Zenodo route:

1. Create a Zenodo draft and reserve a DOI.
2. Rebuild a DOI-linked archive before publishing.

Reason:

- the current archive is verified, but it does not contain the future Zenodo DOI inside its README or build metadata;
- reserving the DOI first allows the DOI to be written into the archive metadata before final publication;
- after Zenodo publication, files should be treated as immutable for citation and reproducibility.

Therefore:

- do not publish the current `v0.1` ZIP directly unless accepting that the archive files will not contain their own DOI;
- preferred route is to reserve the DOI, then build `cohort-02-cross-model-supplement-v0.2` with DOI-linked metadata.

## 3. Planned Zenodo metadata

### 3.1 Title

`ZË-RO Cohort 02 Cross-Model Supplement Archive v0.1`

### 3.2 Resource type

Recommended resource type:

`Dataset`

Reason:

- the archive is primarily evidence data;
- it contains evidence-pack ZIPs, checksums, and result documentation;
- it is not a standalone paper/preprint.

### 3.3 Creator

Creator:

`Sokol Gora`

### 3.4 Version

Version:

`v0.1`

### 3.5 Publication date

Publication date:

`2026-05-14`

If publication happens on another date, use the actual Zenodo publication date.

### 3.6 Description / abstract

Use this description:

> This archive provides post-publication supplementary evidence for the ZË-RO Cohort 02 bracket-testing study. It contains cross-model assistant-assisted, researcher-reviewed evidence for three cases: French `/ø~œ/`, Danish `/ø/`, and Turkish `/ı/`. The archive preserves the distinction between strong support, cleaner-provisional support, and unresolved pressure evidence. French `/ø~œ/` is recorded as cross-model support for V5-V7 over V2-V5. Danish `/ø/` is recorded as cleaner-provisional support for V1-V3 over V2-V5. Turkish `/ı/` is recorded as unresolved high-region pressure evidence, not support. This supplement does not claim to prove the full ZË-RO framework.

### 3.7 Keywords

Use these keywords:

- `ZË-RO`
- `vowel bracket testing`
- `cross-model replication`
- `phonology`
- `front-rounded vowels`
- `Turkish dotless i`
- `evidence archive`
- `assistant-assisted curation`
- `researcher-reviewed`
- `replication`

### 3.8 License

Recommended license:

`Creative Commons Attribution 4.0 International`

Short form:

`CC BY 4.0`

Reason:

- this is a research evidence archive intended for citation and reuse;
- attribution is required;
- Zenodo requires license/rights metadata.

### 3.9 Related identifiers

Recommended related identifier:

`https://doi.org/10.5281/zenodo.20116021`

Relationship:

`supplements`

Reason:

- the new upload is a supplement to the already-published Cohort 02 evidence archive.

If Zenodo UI does not offer `supplements`, use the closest available relation such as:

- `is supplement to`;
- `is related to`.

Do not use the Cohort 02 DOI as the DOI for this new upload. The supplement must receive its own DOI.

### 3.10 Language

Recommended language:

`English`

### 3.11 Communities

No required community.

Leave community blank unless a relevant Zenodo community is intentionally selected later.

## 4. File to upload

Current verified local candidate:

`/Users/wei/Desktop/ZËRO /Dwnlosads /FINAL paper evidence /cohort-02-cross-model-supplement-v0.1.zip`

Current top-level SHA256:

`aa9b6684632cda9b49c8d135161969d3e7c9a676cc0821586de39c9070af94b7`

Preferred final upload file after DOI reservation:

`cohort-02-cross-model-supplement-v0.2.zip`

The v0.2 archive should include:

- reserved Zenodo DOI;
- Zenodo draft record URL or DOI metadata where appropriate;
- updated `README.md`;
- updated `ARCHIVE_BUILD_METADATA.md`;
- updated checksum table;
- new top-level SHA256.

## 5. Upload click order

Do not publish during the first pass.

Planned click order:

1. Open Zenodo.
2. Create a new upload.
3. Upload the current archive ZIP only if using the simple route, or skip file upload until DOI-linked rebuild if using the preferred route.
4. Fill metadata from this plan.
5. In DOI field:
   - answer that there is no existing DOI for this upload;
   - reserve a Zenodo DOI.
6. Copy the reserved DOI.
7. Do not publish yet.
8. Return to repo/local build workflow.
9. Rebuild the archive with DOI-linked metadata.
10. Verify the rebuilt archive.
11. Repo-record the DOI-linked archive build result.
12. Only then return to Zenodo and publish.

## 6. Claim boundaries

Allowed:

- This is a cross-model supplement archive.
- It contains post-publication supplementary evidence.
- French `/ø~œ/` is cross-model support evidence.
- Danish `/ø/` is cleaner-provisional support evidence.
- Turkish `/ı/` is unresolved high-region pressure evidence.
- The archive improves traceability.

Blocked:

- Do not use the word proof.
- Do not say the ZË-RO framework is proven.
- Do not say all front-rounded vowels are solved.
- Do not say Turkish `/ı/` is support.
- Do not say the supplement upgrades the main Cohort 02 claim.
- Do not update README before the Zenodo record is published.
- Do not update LingBuzz before the Zenodo DOI exists.

## 7. Publication status

Current status:

- Zenodo draft: not created.
- Zenodo DOI: not reserved.
- Zenodo upload: no.
- Zenodo publish: no.
- README update: no.
- LingBuzz update: no.
- Registry migration: no.

Next required action after this plan merges:

1. Create Zenodo draft.
2. Reserve DOI.
3. Paste DOI back into repo workflow.
4. Build DOI-linked archive candidate.
5. Verify and repo-record the DOI-linked archive build.
6. Publish only after verification.
