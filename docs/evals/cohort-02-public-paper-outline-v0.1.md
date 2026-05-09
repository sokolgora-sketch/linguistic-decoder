# ZË-RO Cohort 02 Public Paper Outline v0.1

Status: PUBLIC PAPER OUTLINE ONLY
Created: 2026-05-09
Cohort: Cohort 02
Decision basis: `docs/evals/cohort-02-publication-readiness-decision-v0.2.md`

This is not the final paper.

This is not a publication package.

This does not update Zenodo, LingBuzz, README, registry labels, or Cohort 01.

---

## 1. Working title

Seven-Primal-Vowel Bracket Testing: Cohort 02 Support and Pressure Cases Across Six Languages

Alternative title:

Cohort 02 Evidence for Seven-Primal-Vowel Bracket Testing: Support, Edge Stress, and Pressure Cases

---

## 2. Draft abstract

This paper reports Cohort 02 of the ZË-RO Seven-Primal-Vowel bracket-testing program. Cohort 02 extends the internal evidence chain beyond Cohort 01 by separating cleaner support cases from pressure cases under a researcher-reviewed scoring workflow.

The tested cases include Norwegian `/ø/`, Danish `/ø/`, French `/ø~œ/`, Portuguese `/â/`, Turkish `/ı/`, and Romanian `/ă/`.

The strongest support case is French `/ø~œ/`, where the V5-V7 bracket cleanly separated from V2-V5 controls. Norwegian `/ø/` and Danish `/ø/` support V1-V3 more cautiously because their controls remained intermediate but weaker. Portuguese `/â/` replicated a V1-V5 redesign improvement but remains edge-stressed. Turkish `/ı/` improved under V4-V7 but remains pressure-audit rather than settled support. Romanian `/ă/` remains unresolved central-vowel pressure and is not treated as support.

The main result is not that every case supports the framework. The main result is that Cohort 02 improves classification discipline by documenting both support and pressure evidence.

---

## 3. Scope

Cohort 02 covers six language/vowel cases:

| Language | Vowel | Status |
|---|---|---|
| Norwegian | `/ø/` | V1-V3 cleaner provisional support |
| Danish | `/ø/` | V1-V3 cleaner provisional support |
| French | `/ø~œ/` | V5-V7 cleaner high-edge support |
| Portuguese | `/â/` | replicated V1-V5 redesign improvement, still edge-stressed |
| Turkish | `/ı/` | V4-V7 improvement, pressure-audit retained |
| Romanian | `/ă/` | unresolved central-vowel pressure |

Out of scope:

- no new scoring;
- no new token curation;
- no registry migration;
- no Cohort 01 rewrite;
- no public upload until paper and archive are reviewed.

---

## 4. Method outline

The methods section should describe:

1. Task type:
   - `T5_INTERMEDIATE_V0_1`
   - `intermediate_triple`

2. Run structure:
   - four-run candidate/control series;
   - main and alt candidate runs;
   - main and alt control runs.

3. Metadata convention:
   - provider: `openai`
   - model: `chatgpt-assisted-researcher-reviewed`
   - sourceEngine fields blank for hand-pasted / external-model bucket generation.

4. Evidence-pack handling:
   - export each series evidence pack;
   - inspect run index;
   - inspect series summary;
   - record SHA256 where relevant;
   - do not publish until public archive manifest is complete.

5. Interpretation rules:
   - support requires candidate stability and meaningful control separation;
   - edge-stressed improvement is not headline support;
   - pressure cases must remain visible;
   - failed cases are part of the evidence, not discarded.

---

## 5. Case classification table

| Case | Candidate result | Control result | Public-safe classification |
|---|---|---|---|
| Norwegian `/ø/` | V1-V3 INTERMEDIATE x2 | V2-V5 INTERMEDIATE x2 with weaker margins | cleaner provisional support |
| Danish `/ø/` | V1-V3 INTERMEDIATE x2 | V2-V5 INTERMEDIATE x2 with weaker margins | cleaner provisional support |
| French `/ø~œ/` | V5-V7 INTERMEDIATE x2 | V2-V5 COLLAPSED_HIGH x2 | strongest support case |
| Portuguese `/â/` | V1-V5 INTERMEDIATE x2 in replication | V1-V4 COLLAPSED_HIGH x2 | replicated edge-stressed improvement |
| Turkish `/ı/` | V4-V7 INTERMEDIATE x2 | V5-V7 pressure, one EXCEEDS_LOW | pressure-audit / partial improvement |
| Romanian `/ă/` | split/failing under V2-V5 and V3-V4 | controls also failed | unresolved central-vowel pressure |

---

## 6. Support cases section

This section should discuss:

### 6.1 French `/ø~œ/`

Public-safe framing:

- strongest current Cohort 02 support case;
- V5-V7 candidate runs remained intermediate;
- V2-V5 controls collapsed high;
- should not be framed as proving the full framework alone.

### 6.2 Norwegian `/ø/`

Public-safe framing:

- V1-V3 cleaner provisional support;
- candidate margins cleaner than V2-V5 controls;
- controls did not fully collapse;
- not an absolute falsification of V2-V5.

### 6.3 Danish `/ø/`

Public-safe framing:

- parallel to Norwegian;
- V1-V3 cleaner provisional support;
- controls remained intermediate;
- useful support but cautious.

---

## 7. Edge-stressed improvement section

### Portuguese `/â/`

Public-safe framing:

- Portuguese `/â/` replicated V1-V5 improvement over V1-V4 controls;
- both V1-V5 candidate runs were intermediate in corrected replication;
- both V1-V4 controls collapsed high;
- r02 remained high-side leaning;
- result is replicated edge-stressed improvement, not final headline support.

---

## 8. Pressure cases section

### 8.1 Turkish `/ı/`

Public-safe framing:

- V4-V7 improved over V5-V7;
- V4-V7 candidate runs were clean intermediate;
- V5-V7 controls showed pressure;
- Turkish remains pressure-audit;
- not settled support.

### 8.2 Romanian `/ă/`

Public-safe framing:

- Romanian remains unresolved central-vowel pressure;
- V3-V4 failed;
- V2-V5 widened candidate split and did not stabilize;
- controls also failed;
- not support for any tested bracket.

---

## 9. Limitations

Required limitations:

1. Cohort 02 is small.
2. Token curation is researcher-reviewed and ChatGPT-assisted.
3. Some support cases are cleaner provisional support, not absolute falsification.
4. Portuguese remains edge-stressed.
5. Turkish remains pressure-audit.
6. Romanian remains unresolved pressure.
7. The method tests bracket behavior; it does not prove a complete theory of phonology.
8. Public claims must stay weaker than internal enthusiasm.

---

## 10. Claim boundaries

Allowed public claims:

- Cohort 02 separates support cases from pressure cases.
- French `/ø~œ/` is the strongest support case.
- Norwegian and Danish `/ø/` provide cautious V1-V3 support.
- Portuguese `/â/` replicated V1-V5 improvement but remains edge-stressed.
- Turkish `/ı/` improved under V4-V7 but remains pressure-audit.
- Romanian `/ă/` remains unresolved and is not support.

Blocked public claims:

- Cohort 02 proves the framework.
- Cohort 02 replaces Cohort 01.
- Portuguese `/â/` is final headline support.
- Turkish `/ı/` is settled support.
- Romanian `/ă/` supports any tested bracket.
- French `/ø~œ/` alone proves the high-edge bracket.
- Registry labels should be migrated based on Cohort 02 alone.

---

## 11. Public archive plan

Before public release, create:

- public archive manifest;
- final checksum table;
- included evidence-pack list;
- included repo-doc list;
- method notes;
- reproduction notes;
- public README for the archive.

Do not upload to Zenodo until:

1. the paper outline is reviewed;
2. claim boundaries are checked;
3. archive manifest exists;
4. checksum table exists;
5. final publish/no-publish decision is made.

---

## 12. Proposed paper structure

1. Abstract
2. Introduction
3. Method
4. Evidence inventory
5. Support cases
6. Edge-stressed improvement cases
7. Pressure cases
8. Discussion
9. Limitations
10. Claim boundaries
11. Reproducibility and archive
12. Conclusion

---

## 13. Next milestone

Next repo milestone:

- `docs/evals/cohort-02-public-archive-manifest-v0.1.md`

Do not create Zenodo, LingBuzz, or README updates before the archive manifest and checksum table exist.

---

## 14. Completion criteria

This outline is complete when:

1. scope is defined;
2. case table is included;
3. support cases are separated from pressure cases;
4. limitations are explicit;
5. claim boundaries are explicit;
6. public archive plan is sketched;
7. next milestone is defined;
8. no public release claim is made;
9. repo gates pass;
10. PR is merged.
