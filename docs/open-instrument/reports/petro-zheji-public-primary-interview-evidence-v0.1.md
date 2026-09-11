# Petro Zheji Public Primary-Interview Evidence v0.1

Status: BOUNDED_INTERVIEW_EVIDENCE_RECORD.

Lane: `OPEN_INSTRUMENT_PETRO_ZHEJI_PUBLIC_PRIMARY_INTERVIEW_EVIDENCE_V0_1`

Parent milestone:
`PETRO_ZHEJI_PRIMARY_SOURCE_AND_SYMBOLIC_ALGORITHM_FIDELITY_BASELINE_V0_1`

## Source identity

The primary publication target is the MAPO archive page:

`https://mapo.al/68f76371d74ca-petro-zheji-njeriu-i-veprave-te-medha-i-semure-dhe-i-harruar-nga-akademiket`

The page is dated 21 January 2013, names Ermira Gjata, and presents a direct
interview with Petro Zheji. It is recorded as:

- `sourceId`: `pz-primary-interview-gjata-mapo-2013-v0.1`;
- `sourceClass`: `PETRO_ZHEJI_PRIMARY_INTERVIEW`;
- `sourceAccessStatus`: `ACCESSIBLE_UNVERIFIED_EDITION`;
- `citationStability`: `DIGITAL_LOCATION_ONLY`;
- `verificationStatus`: `CONTENT_LOCATED`.

The access value is intentionally narrower than `VERIFIED_ACCESSIBLE`: the web
text and publication identity are available, but there is no printed page system
or book-edition identity.

## Corroborating republication

Radi & Radi republishes the interview at:

`https://www.radiandradi.com/universi-ne-aforizma-nga-ermira-gjata-petro-zheji-njeriu-i-veprave-te-medha/`

The page is dated 24 July 2025 and attributes the text to Ermira Gjata. It is
retained as a corroborating republication locator only. It is not counted as a
second independent Petro Zheji testimony record.

## Bounded claim matrix

All rows below are bounded paraphrases of first-person interview answers. They
support attribution of what the interview says, not verification of the books
or reconstruction of the complete method.

| Claim ID | Term | Speaker | Source location | Form | Supports | Does not support |
|---|---|---|---|---|---|---|
| `PZ-INTERVIEW-AS-001` | Algoritmi Simbolik | Petro Zheji | MAPO interview Q&A after the interview heading | Paraphrase | He describes it as the mathematics or inner mathematics of the symbol and connects it with universal symbolic structures. | A complete formal algorithm, book definition, or runtime implementation. |
| `PZ-INTERVIEW-E-001` | Kodi E | Petro Zheji | MAPO answer explaining the included third | Paraphrase | He identifies Code E with the included third and associates it with a supreme or mystical centre. | That Open Instrument's Code E fields faithfully implement his concept. |
| `PZ-INTERVIEW-F-001` | Kodi F | Petro Zheji | MAPO answer explaining the excluded third | Paraphrase | He identifies Code F with the excluded third and the material-world/classical-science side of his explanation. | A validated Code F runtime or a complete logical formalization. |
| `PZ-INTERVIEW-THIRD-001` | Included/excluded third | Petro Zheji | MAPO answer contrasting Codes E and F | Paraphrase | The interview records a distinction between included-third and excluded-third logic. | A general truth claim about the logic or its scientific validity. |
| `PZ-INTERVIEW-EQUATION-001` | Symbolic equations | Petro Zheji | MAPO discussion of E/F and physical/spiritual relations | Paraphrase | He presents equations and symbolic relations as part of the explanation. | The equations' completeness, correctness, or equivalence to any repository formula. |
| `PZ-INTERVIEW-GENERAL-001` | Applicability beyond Albanian | Petro Zheji | MAPO question asking whether the algorithm can exist in other languages | Paraphrase | He answers that it can be found in other languages and that sciences can be turned into the Symbolic Algorithm. | Evidence that the claim is historically or scientifically correct, or that the product should implement it. |

## Terminology status

The interview reduces `UNKNOWN` only at the interview-attribution layer:

| Term | Status |
|---|---|
| Algoritmi Simbolik | `INTERVIEW_DIRECT_STATEMENT`; `BOOK_PAGE_VERIFICATION_PENDING` |
| Kodi E | `INTERVIEW_DIRECT_STATEMENT`; `BOOK_PAGE_VERIFICATION_PENDING` |
| Kodi F | `INTERVIEW_DIRECT_STATEMENT`; `BOOK_PAGE_VERIFICATION_PENDING` |

No term is marked `PAGE_CITED`, `BOOK_VERIFIED`, or `FIDELITY_COMPLETE`.

## Boundary and storage policy

This record does not promote any repository component to
`PETRO_ZHEJI_DIRECT`. It does not alter `src/engine/zhejiLens.ts`, Code F, Code
E, Seven-Voices behavior, candidate ranking, API behavior, UI behavior,
provider execution, research execution, Evidence Package, or Reproducible Run
Bundle semantics.

The repository stores source identity, stable digital locators, bounded
paraphrase, and claim boundaries. It does not store the full copyrighted
article or long quotations.

The fidelity milestone remains open. Book-level definitions, exact editions,
page-stable citations, and the required worked-example corpus remain pending.
