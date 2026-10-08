# Open Instrument — Source-Family Lexical Substrate v0.1 Source-Authority Audit

Status: COMPLETED_DOCS_ONLY

Audit ID: OPEN_INSTRUMENT_SOURCE_FAMILY_LEXICAL_SUBSTRATE_V0_1_SOURCE_AUTHORITY_AUDIT

This audit uses repository evidence only. No external source was acquired,
downloaded, imported, or executed. Candidate selection is a recommendation for
a later bounded acquisition/procedure lane, not authorization to acquire a
source.

## 1. Decision context

The parent architecture decision selected
OPTION_C_HYBRID_SCALABLE_SUBSTRATE_PLUS_CURATED_ENRICHMENT. The current
substrate remains 76 direct records: 55 Albanian, 21 Latin, and 0 other.
S3, the broader diagnostic, and the retrieval-key procedure remain preserved
and unchanged. S4 remains NOT_STARTED.

The reusable architecture shows that:

- the verified source adapter is source-fact oriented but has a small
  singular-citation record shape;
- the generic witness dataset is a separate small surface, not a scalable
  source-family registry;
- the research catalog is target-bound and requires target senses,
  functional hypotheses, semantic bridges, and provenance groups;
- source snapshot capture currently supports bounded FJALË and Lewis & Short
  entry capture, but does not provide a complete large-snapshot registry and
  license/hash posture for a scalable family;
- the reviewed source-tradition policy separates tradition authority, record
  validation, and later runtime authorization.

Therefore this audit evaluates source-family authority before acquisition and
does not route catalog rows into a generic substrate.

## 2. Selection rule

The same rule was applied to every candidate:

SOURCE_FAMILY_SELECTED=YES is permitted only when repository evidence
establishes source identity, source-attested form and gloss/sense shape,
machine-readable or deterministically capturable input, reproducible snapshot
identity, stable record/locator strategy, license/attribution posture,
source-only truth boundaries, and a future adapter path that does not require
target-specific semantics.

A known attribution obligation is not a legal conclusion. Absence of a
defensible license or redistribution posture is a hard blocker. Any future
acquisition lane must recheck the exact snapshot terms before acquisition or
indexing.

The rule was frozen before reviewing candidate desirability. No retrieval
outcome, target word, semantic attractiveness, or expected candidate count was
used to select a family.

## 3. Candidate inventory

| Candidate | Identity | Form/gloss | Snapshot/reproducibility | License posture | Adapter fit | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| English Kaikki | English Wiktionary -> Wiktextract -> Kaikki English JSONL; profile open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1 | PASS; word, POS, sense IDs, glosses, tags, raw tags, examples are contract-bound | PASS for external hash-bound snapshot: 3,335,546,346 bytes, SHA-256 9978ce34256e4143c3498387564d293a9a2971ef376c1e038d369a2021c02195 | PASS_WITH_ATTRIBUTION_BOUNDARY; CC-BY-SA/GFDL attribution posture recorded, Wiktextract MIT recorded, no legal conclusion claimed | BOUNDED; new source-family adapter and deterministic IDs still required | STRONG_CANDIDATE |
| FJALË | FJALË — Fjalor Shqip; existing source-tradition mapping and bounded entries | PASS for existing reviewed entry facts | PARTIAL; entry capture exists, but no complete frozen family snapshot/hash registry | UNKNOWN for a scalable redistributed snapshot from current repo evidence | PARTIAL; existing small-record adapter is reusable | DEFER |
| Lewis & Short | Scaife ATLAS / Perseus Lewis & Short; existing source-tradition mapping and entry citations | PASS for existing reviewed entry facts | PARTIAL; entry citations and limited upstream release evidence exist, but no complete frozen family snapshot | UNKNOWN for a scalable redistributed snapshot from current repo evidence | PARTIAL; bounded capture exists | DEFER |
| Middle Liddell | Scaife ATLAS / Perseus Middle Liddell | PASS for limited source identity/entry evidence | PARTIAL or UNKNOWN; no complete source-family capture/hash posture and no current raw capture seam | UNKNOWN | DEFER; no current direct adapter | DEFER |
| Kaikki Albanian pronunciation | Kaikki/Wiktextract pronunciation material | NOT A LEXICAL-SUBSTRATE AUTHORITY; pronunciation is a separate contract | NOT EVALUATED for this lane | NOT A BASIS FOR LEXICAL PROMOTION | REJECT for this purpose | REJECT |

No source family other than English Kaikki passes the complete current
authority screen for a first scalable lexical-substrate procedure. The
existing FJALË and Scaife evidence remains useful and preserved, but current
repository evidence is insufficient to claim a frozen large-source snapshot,
license posture, and reproducible acquisition boundary for them.

## 4. Selected source family

SOURCE_FAMILY_SELECTED=YES

FIRST_SOURCE_FAMILY_ID=open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1

FIRST_SOURCE_FAMILY=English Wiktionary -> Wiktextract -> Kaikki English JSONL

LANGUAGE=English

SOURCE_FORMAT=POSTPROCESSED_JSONL

SOURCE_ARTIFACT_BYTES=3335546346

SOURCE_ARTIFACT_SHA256=9978ce34256e4143c3498387564d293a9a2971ef376c1e038d369a2021c02195

SOURCE_VERSION=Upstream Wiktionary dump 2026-09-02; Kaikki build 2026-10-03;
Wiktextract 1a05e46; Wikitextprocessor e3d6d4e

SOURCE_LICENSE_POSTURE=CC-BY-SA and GFDL attribution posture recorded by the
existing contract; Wiktextract MIT; legal conclusion not claimed

SOURCE_ACQUISITION_AUTHORIZED=NO

SOURCE_IMPORT_AUTHORIZED=NO

SOURCE_RUNTIME_AUTHORIZED=NO

The selection is bounded and conditional. It means that this family is the
best repository-supported candidate for a separate snapshot-acquisition and
adapter-definition lane. It does not permit downloading the 3.3 GB artifact,
creating a repository slice, adding an index, or changing runtime.

The future procedure must bind exact acquisition mechanics, attribution
handling, external storage, snapshot bytes/hash, deterministic source-record
identity, sense/entry locators, and any redistribution constraints before
source use. If those checks fail, the selected family returns Null and no
records are admitted.

## 5. Repository evidence for the selection

The existing English source-authority contract records:

- source identity and profile;
- machine-readable JSONL format;
- source field allowlist;
- exact word/source-form boundary;
- sense and gloss preservation without primary-sense selection;
- exact NFC/lowercase join semantics for its own lexical contract;
- hash-bound external snapshot identity and byte count;
- source license/attribution posture;
- external-not-bundled storage;
- source-only firewalls for functional, historical, pronunciation,
  consonantal, manifestation, and production claims.

The contract deliberately does not authorize acquisition, runtime, semantic
ranking, or a derived functional slice. Those remain future gates.

## 6. Required future acquisition/projection procedure

The next lane must define and freeze, before acquisition:

1. snapshot retrieval and byte/hash verification;
2. attribution and license-record handling;
3. external artifact storage and access path;
4. deterministic JSONL decoding and record ordering;
5. stable sourceRecordId and entryLocator construction;
6. source-form and source-attested gloss/sense preservation;
7. POS, sense, polysemy, and collision policy;
8. source-only adapter validation and fail-closed reasons;
9. deterministic retrieval representation, without importing the rejected
   canonicalization hypothesis;
10. offline index construction and hash binding;
11. focused source-only round-trip tests;
12. explicit prohibition on target-bound functional promotion.

The procedure must not use candidate retrieval outcomes to select source
records, senses, or languages. The whole family or a predeclared deterministic
projection rule must be fixed before any coverage result is inspected.

## 7. Non-selected candidates and future recovery

FJALË remains the strongest existing Albanian entry surface, but its current
repository evidence is a bounded entry-capture seam rather than a complete
hash-bound scalable snapshot. Lewis & Short has the strongest existing Latin
entry identity, but the same snapshot/license gap remains. Middle Liddell
cannot be selected while its capture and authority posture remain incomplete.

The pronunciation source is deliberately excluded from lexical-source
selection. Lexical source authority and pronunciation authority remain
separate.

The target-bound research catalog is not a fallback source family. Its
admission contract must not be weakened to recover rows for generic lexical
retrieval.

## 8. Truth and lifecycle boundary

This audit establishes only:

- a source-family contract is frozen;
- English Kaikki is the recommended first source-family candidate;
- no source has been acquired or imported;
- no runtime, query, matching, normalization, API, UI, pronunciation,
  functional, historical, or production behavior changed;
- S0, S1, S2, S3, the broader diagnostic, and the retrieval-key result remain
  preserved;
- S4 remains NOT_STARTED.

It does not establish English source coverage in Discovery, candidate quality,
functional motivation, historical relation, pronunciation authority, semantic
equivalence, production readiness, or a positive scientific result.

## 9. Next action

NEXT_ACTION=DEFINE_AND_FREEZE_ENGLISH_KAIKKI_SNAPSHOT_ACQUISITION_PROCEDURE

The next action is a separate authorization boundary. This audit lane is
complete without acquisition, import, index generation, runtime integration,
or experiment execution.
