# ZË-RO Cohort 01 Reproduction Runbook v0.1

This runbook explains how to inspect and verify the public evidence archive for:

**Seven-Primal-Vowel Bracket Testing: Cohort 01 Evidence Across Ten Languages**

Paper:

    docs/papers/zero-cohort-01-vowel-bracket-battery-v0.1.md

Evidence archive:

    https://doi.org/10.5281/zenodo.20047120

Repository:

    https://github.com/sokolgora-sketch/linguistic-decoder

Reference commit after DOI linkage:

    c1e383e

---

## 1. What this runbook verifies

This runbook verifies that:

1. The public evidence archive exists.
2. The downloaded archive checksum matches the published checksum.
3. The archive contains 16 canonical evidence packs.
4. Each evidence pack can be inspected locally.
5. The repository gates pass at the reference commit.
6. The paper links to the published Zenodo DOI.

This runbook does not claim to reproduce the original LLM token-curation step. Cohort 01 token buckets were ChatGPT-assisted and researcher-reviewed. The reproducible part here is the preserved evidence archive, scorer outputs, checksums, repo state, and paper linkage.

---

## 2. Required tools

Expected local tools:

    git --version
    node --version
    npm --version
    unzip -v
    shasum --version

Recommended:

    rg --version

If `rg` is not installed, use `grep -R` instead.

---

## 3. Clone the repository

    mkdir -p "$HOME/Desktop/zero-reproduction"
    cd "$HOME/Desktop/zero-reproduction" || exit 1

    git clone https://github.com/sokolgora-sketch/linguistic-decoder.git
    cd linguistic-decoder || exit 1

    git fetch --all --prune
    git checkout c1e383e

Confirm:

    git status
    git log -1 --oneline

Expected commit:

    c1e383e docs(papers): add cohort 01 evidence DOI (#936)

---

## 4. Confirm paper DOI linkage

    rg -n "Evidence archive|zenodo.20047120" docs/papers/zero-cohort-01-vowel-bracket-battery-v0.1.md

Expected:

    Evidence archive: https://doi.org/10.5281/zenodo.20047120

---

## 5. Download the Zenodo archive

Download these two files from Zenodo:

    zero-cohort-01-evidence-v0.1.zip
    zero-cohort-01-evidence-v0.1.zip.sha256

DOI page:

    https://doi.org/10.5281/zenodo.20047120

Place both files in:

    mkdir -p "$HOME/Desktop/zero-reproduction/cohort-01-evidence"

---

## 6. Verify top-level archive checksum

    cd "$HOME/Desktop/zero-reproduction/cohort-01-evidence" || exit 1

    ls -lh

    cat zero-cohort-01-evidence-v0.1.zip.sha256
    shasum -a 256 zero-cohort-01-evidence-v0.1.zip

Expected SHA256:

    a65e2b2e3fefbfe0d53d061501ea5e24c26bc4d933abfe3c9285b5a4dea29f7a

The checksum printed by `shasum` must match the checksum in `zero-cohort-01-evidence-v0.1.zip.sha256`.

---

## 7. Test ZIP integrity

    unzip -t zero-cohort-01-evidence-v0.1.zip

Expected final line:

    No errors detected in compressed data of zero-cohort-01-evidence-v0.1.zip.

---

## 8. Unpack the archive

    unzip -q zero-cohort-01-evidence-v0.1.zip

    cd zero-cohort-01-evidence-v0.1 || exit 1

    find . -maxdepth 2 -type f | sort

Expected top-level files:

    ./COHORT_01_EVIDENCE_MANIFEST.md
    ./README.md
    ./SHA256SUMS.txt
    ./paper/zero-cohort-01-vowel-bracket-battery-v0.1.md

Expected evidence folder:

    ./evidence-packs/

---

## 9. Verify internal checksums

    cd "$HOME/Desktop/zero-reproduction/cohort-01-evidence/zero-cohort-01-evidence-v0.1" || exit 1

    shasum -a 256 -c SHA256SUMS.txt

Expected: every file reports `OK`.

---

## 10. Confirm 16 canonical evidence packs

    cd "$HOME/Desktop/zero-reproduction/cohort-01-evidence/zero-cohort-01-evidence-v0.1" || exit 1

    find evidence-packs -maxdepth 1 -type f -name 'evals.series-evidence-pack*.zip' | sort | tee /tmp/cohort_01_pack_list.txt

    wc -l /tmp/cohort_01_pack_list.txt

Expected count:

    16

Canonical packs:

    evals.series-evidence-pack.t5-et-ae-v1-v3-exp-v0.2.v0.1 (1).zip
    evals.series-evidence-pack.t5-fi-ae-v1-v3-core-v0.2.v0.1 (2).zip
    evals.series-evidence-pack.t5-fr-euoe-v2-v5-exp-v0.2.v0.1 (4).zip
    evals.series-evidence-pack.t5-fr-euoe-v5-v7-refine-v0.1.v0.1 (1).zip
    evals.series-evidence-pack.t5-no-oe-v2-v5-exp-v0.2.v0.1 (4).zip
    evals.series-evidence-pack.t5-no-oe-v1-v3-refine-v0.1.v0.1 (1).zip
    evals.series-evidence-pack.t5-da-oe-v1-v3-refine-v0.1.v0.1 (1).zip
    evals.series-evidence-pack.t5-sv-oe-v2-v5-exp-v0.2.v0.1 (3).zip
    evals.series-evidence-pack.t5-sv-oe-v1-v3-refine-v0.1.v0.1 (1).zip
    evals.series-evidence-pack.t5-de-oe-v2-v4-refine-v0.1.v0.1 (1).zip
    evals.series-evidence-pack.t5-pt-aa-v1-v4-core-v0.2.v0.1 (2).zip
    evals.series-evidence-pack.t5-pt-aa-v1-v5-refine-v0.1.v0.1 (1).zip
    evals.series-evidence-pack.t5-tr-ii-v6-v7-core-v0.2.v0.1 (2).zip
    evals.series-evidence-pack.t5-tr-ii-v6-v7-audit-v0.1.v0.1 (1).zip
    evals.series-evidence-pack.t5-tr-ii-wide-sweep-v0.1.v0.1 (1).zip
    evals.series-evidence-pack.t5-ro-a-breve-v3-v4-core-v0.1.v0.1 (1).zip

---

## 11. Inspect one evidence pack

Example using the Norwegian V1-V3 refinement pack:

    cd "$HOME/Desktop/zero-reproduction/cohort-01-evidence/zero-cohort-01-evidence-v0.1" || exit 1

    ZIP="evidence-packs/evals.series-evidence-pack.t5-no-oe-v1-v3-refine-v0.1.v0.1 (1).zip"

    unzip -l "$ZIP" | sed -n '1,120p'

    echo
    echo "=== run index ==="
    unzip -p "$ZIP" 01_RUN_INDEX.md | sed -n '1,160p'

    echo
    echo "=== series summary ==="
    unzip -p "$ZIP" series-summary.csv | sed -n '1,80p'

Expected contents include:

    01_RUN_INDEX.md
    series-summary.csv
    runs/.../input.json
    runs/.../report.json
    runs/.../report.md
    runs/.../report.pdf
    runs/.../workbook.xlsx
    runs/.../summary.csv
    runs/.../notes.md

---

## 12. Inspect provenance inside evidence packs

    cd "$HOME/Desktop/zero-reproduction/cohort-01-evidence/zero-cohort-01-evidence-v0.1" || exit 1

    for ZIP in evidence-packs/evals.series-evidence-pack*.zip; do
      echo
      echo "============================================================"
      echo "ZIP: $ZIP"

      for f in $(unzip -Z1 "$ZIP" | grep 'runs/.*/input.json$'); do
        echo "FILE: $f"
        unzip -p "$ZIP" "$f" \
          | grep -E '"provider"|"model"|"label"|"sourceEngineId"|"sourceEngineVersion"|"sourceEngineBuild"' \
          | sed -n '1,20p'
      done
    done

Canonical provenance:

    provider: openai
    model: chatgpt-assisted-researcher-reviewed
    sourceEngineId: external-llm-curation
    sourceEngineVersion: t5-battery-2026-05-chatgpt-assisted-v0.1
    sourceEngineBuild: 6ef31a5

---

## 13. Run repository gates

From the cloned repository:

    cd "$HOME/Desktop/zero-reproduction/linguistic-decoder" || exit 1

    npm install
    npm run gate:quick
    npm run build

Expected:

    ✅ gate:quick passed

and a successful Next.js production build.

---

## 14. Interpretation boundary

Passing this runbook confirms:

- the DOI-linked evidence archive is downloadable;
- the archive integrity is valid;
- the archive contains the canonical 16 packs;
- the internal checksums pass;
- evidence-pack contents are inspectable;
- provenance fields are present;
- the repository gates pass at the DOI-linked commit.

It does not independently rerun the original LLM-assisted token generation step. That step is documented as ChatGPT-assisted researcher-reviewed curation and is preserved through the evidence inputs.

---

## 15. Citation

Dataset citation:

    Gora, S. (2026). ZË-RO Cohort 01 Evidence Archive v0.1 (v0.1) [Data set]. Zenodo. https://doi.org/10.5281/zenodo.20047120
