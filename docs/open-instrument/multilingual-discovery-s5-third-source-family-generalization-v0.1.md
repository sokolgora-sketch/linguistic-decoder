# Open Instrument — Multilingual Discovery S5
# Third Source-Family Generalization Definition / Preregistration v0.1

Status: FROZEN_PREREGISTRATION_DEFINITION

Mode: DEFINITION / PREREGISTRATION ONLY

This document defines one bounded future S5 execution. It does not acquire a
source, add a provider, implement an adapter, build an index, change runtime
Discovery, or change production /chat behavior.

## 1. Repository and authority boundary

Repository: sokolgora-sketch/linguistic-decoder

Repository truth observed before this definition:

BRANCH=main
HEAD=fa87170de9ee394e4869227106dd390c93052546
ORIGIN_MAIN=fa87170de9ee394e4869227106dd390c93052546
DIVERGENCE=0/0
WORKTREE=CLEAN

The existing source-family contract is the primary authority for this
preregistration. It requires exact source-form preservation, separate retrieval
representation, deterministic exact-key matching, per-record provenance,
multiplicity preservation, fail-closed malformed input, and no promotion from
lexical source fact to pronunciation, functional, historical, semantic, or
production authority.

The existing direct substrate contains Albanian and Latin witnesses. English
Kaikki is already defined and implemented behind its own server-only boundary.
S5 tests a new source family; it does not reopen or modify those lanes.

## 2. Frozen research question

Does the existing Open Instrument generic source-witness architecture
generalize to an independently sourced third linguistic family without
changing Seven Voices, pronunciation authority, Gamma, ZC, structural
comparison semantics, candidate eligibility, functional-evidence authority,
ZË-RO hypothesis authority, Null semantics, no_single_winner / user_decides,
representation-boundary semantics, or presentation aggregation semantics?

The preferred outcome is:

NEW_SOURCE_FAMILY_FITS_EXISTING_CONTRACT

The execution must not target a positive result, a coverage increase, or an
attractive lexical match. ARCHITECTURE_CHANGED_TO_FIT_NEW_SOURCE is not a
success condition.

S5_GENERALIZATION_LAYER_SCOPE=RETRIEVAL_PROVENANCE_AND_AUTHORITY_BOUNDARY

S5 is limited to whether an independently sourced third linguistic family can
enter the existing Discovery contract through exact retrieval, provenance
preservation, and authority-boundary projection. It does not establish
cross-family generalization of spoken pronunciation, Seven Voices paths,
Gamma, or ZC because the selected source does not provide authorized
pronunciation data. Those layers remain protected and must remain Null or
unchanged unless a separate authority is explicitly authorized.

## 3. Existing architecture boundary

The future source-family path is bounded to:

verified source snapshot
  -> source-family adapter
  -> source-record validation
  -> existing exact retrieval representation
  -> deterministic index
  -> existing GenericFunctionalWitnessSourceAdapterV1
  -> existing candidate construction
  -> optional separately reviewed evidence enrichment

The analytical candidate producer, Seven Voices, Gamma, ZC, Math7, structural
comparison, functional interpretation, Null, and presentation aggregation are
protected boundaries for S5. A source adapter may carry existing source
provenance through the boundary, but it may not change candidate eligibility,
add a source-specific semantic rule, or derive pronunciation from orthography.

The generic witness projection remains source-fact-only:

SOURCE_RECORD_ONLY
functionalCorrespondence=NOT_EVALUATED
targetMeaning=NOT_CLAIMED
historicalRelation=NOT_CLAIMED
winnerClaim=NOT_CLAIMED
userDecisionPosture=user_decides
noSingleWinner=true

## 4. Candidate source-family comparison

The comparison below was performed without acquiring or downloading any
dataset. Repository facts, external source facts, inferences, and unknowns are
kept separate.

### 4.1 Ancient Greek

SOURCE_FAMILY=Perseus Digital Library Greek lexica
TARGET_LANGUAGE_STAGE=Ancient Greek; exact dictionary/stage to be frozen later
WHY_INDEPENDENT_TEST=Greek script/diacritics and historical lexicography differ from Albanian, Latin, and English
LIKELY_AUTHORITATIVE_LEXICAL_SOURCES=PerseusDL/lexica, including Greek lexica
SOURCE_ACCESSIBILITY=Public GitHub repository observed
SOURCE_LICENSE_OR_REUSE_STATUS=Repository states CC-BY-SA-4.0 unless otherwise indicated; component copyright varies
STRUCTURED_DATA_AVAILABILITY=Public lexica repository with CTS/XML-TEI path observed
LEMMA_IDENTITY_QUALITY=LIKELY_USABLE; exact selected-lexicon identity not audited here
SENSE_GRANULARITY=LIKELY_USABLE; exact selected-lexicon projection not audited here
PRONUNCIATION_OR_PHONOLOGICAL_DATA=UNKNOWN_FOR_SELECTED_LEXICON; pronunciation would remain Null unless separately authorized
HISTORICAL_STAGE_CLARITY=REQUIRES_SELECTED_LEXICON_AUDIT
MORPHOLOGY_COMPLEXITY=HIGH_EXPECTED; inference, not an execution result
ORTHOGRAPHY_RISK=HIGH
TRANSLITERATION_RISK=HIGH
DIACRITIC_NORMALIZATION_RISK=HIGH
SOURCE_PROVENANCE_GRANULARITY=LIKELY_USABLE; exact record locator policy not yet frozen
GENERIC_ADAPTER_COMPATIBILITY=CONDITIONAL
RISK_OF_LANGUAGE_SPECIFIC_HACKS=MEDIUM
EXPECTED_GENERALIZATION_VALUE=HIGH

The positive evidence is real but incomplete: the public Perseus lexica
repository exposes lexica files and a default CC-BY-SA-4.0 reuse posture, while
also warning that materials have varying copyright status and that a specific
component needs review. Ancient Greek is not selected because that
component-level authority is not yet frozen.

### 4.2 Sanskrit

SOURCE_FAMILY=Cologne Digital Sanskrit Dictionaries / Monier-Williams 1899
TARGET_LANGUAGE_STAGE=Vedic through late Classical Sanskrit
WHY_INDEPENDENT_TEST=Sanskrit introduces a distinct linguistic family, source-native SLP1 representation, IAST/Devanagari handling, compounds, homonyms, and dense historical dictionary structure
LIKELY_AUTHORITATIVE_LEXICAL_SOURCES=Monier-Williams Sanskrit-English Dictionary, 1899 digital edition
SOURCE_ACCESSIBILITY=Public Cologne download/index and public MWS maintenance repository observed
SOURCE_LICENSE_OR_REUSE_STATUS=Digital edition documented as CC-BY-SA-4.0; printed 1899 source documented as public domain; attribution and exact component review remain required
STRUCTURED_DATA_AVAILABILITY=mw.txt and mw.xml downloads; documented tagged record structure
LEMMA_IDENTITY_QUALITY=Strong candidate: source-native L record number plus k1/k2, homonym and sub-entry markers
SENSE_GRANULARITY=Strong but hierarchical: entry blocks and div sense/derivative markers must be preserved, not flattened silently
PRONUNCIATION_OR_PHONOLOGICAL_DATA=No authorized spoken-pronunciation authority in the selected lexical source; pronunciation remains Null
HISTORICAL_STAGE_CLARITY=Documented broad range, Vedic through late Classical; exact execution population must narrow it before acquisition
MORPHOLOGY_COMPLEXITY=High expected; inference from documented lexical/morphological structure, not an execution result
ORTHOGRAPHY_RISK=MEDIUM_HIGH
TRANSLITERATION_RISK=MEDIUM_HIGH; SLP1 is source-native and IAST/Devanagari are separate representations
DIACRITIC_NORMALIZATION_RISK=MEDIUM_HIGH
SOURCE_PROVENANCE_GRANULARITY=Strong candidate: L, pc page/column, source references, and exact source fields
GENERIC_ADAPTER_COMPATIBILITY=Conditional, with exact-key contract stop
RISK_OF_LANGUAGE_SPECIFIC_HACKS=Low if no transliteration equivalence or semantic rule is added; otherwise immediate stop
EXPECTED_GENERALIZATION_VALUE=HIGH

The Cologne/MWS source is selected because its public documentation exposes the
data format, source-native record identity, page/column locator, source
references, and digital reuse status before any source bytes are acquired.
The selection is a preregistration decision, not a claim that the future
adapter will pass.

### 4.3 Slavic candidate: Old Church Slavonic

SOURCE_FAMILY=Old Church Slavonic machine-readable lexicon candidate
TARGET_LANGUAGE_STAGE=Old Church Slavonic; exact tradition/edition not frozen
WHY_INDEPENDENT_TEST=Distinct Slavic source family with historical script and morphology unlike the current substrate
LIKELY_AUTHORITATIVE_LEXICAL_SOURCES=MultiSlavDict / early Church Slavonic dictionaries; machine-readable Kaikki extraction as a possible technical source
SOURCE_ACCESSIBILITY=Public machine-readable page observed
SOURCE_LICENSE_OR_REUSE_STATUS=UNKNOWN for the exact source components needed by S5
STRUCTURED_DATA_AVAILABILITY=JSONL download and word/sense browsing observed
LEMMA_IDENTITY_QUALITY=Potentially usable; exact source-native identity not established here
SENSE_GRANULARITY=Potentially usable; extraction-specific semantics require audit
PRONUNCIATION_OR_PHONOLOGICAL_DATA=UNKNOWN; pronunciation would remain Null unless separately authorized
HISTORICAL_STAGE_CLARITY=Potentially strong, but exact tradition/edition must be selected
MORPHOLOGY_COMPLEXITY=High expected; inference, not an execution result
ORTHOGRAPHY_RISK=HIGH
TRANSLITERATION_RISK=HIGH
DIACRITIC_NORMALIZATION_RISK=HIGH
SOURCE_PROVENANCE_GRANULARITY=Insufficiently established for the extracted candidate
GENERIC_ADAPTER_COMPATIBILITY=CONDITIONAL
RISK_OF_LANGUAGE_SPECIFIC_HACKS=HIGH until source identity and representation are frozen
EXPECTED_GENERALIZATION_VALUE=HIGH

The observed machine-readable OCS page reports that its JSONL is extracted
from Wiktionary and that additional information is merged from other sources.
That is useful technical evidence but not yet a single independently bounded
source tradition with the required record-level authority. OCS remains a
future candidate, not the selected S5 family.

## 5. Frozen S5 selection

S5_SELECTED_SOURCE_FAMILY=COLONGE_DIGITAL_SANSKRIT_DICTIONARIES_MONIER_WILLIAMS_1899
S5_SELECTION_CLASSIFICATION=S5_SOURCE_SELECTED_PENDING_SEPARATE_SNAPSHOT_AUTHORITY
S5_SELECTION_JUSTIFICATION=The candidate has the strongest presently evidenced combination of an independently different linguistic family, public reproducible machine-readable data, documented source-native record identity, granular locators/provenance, and explicit digital reuse status. It can test script/transliteration/morphology boundaries without granting pronunciation or semantic authority. Ancient Greek remains blocked on component-level source authority; Old Church Slavonic remains blocked on exact source-tradition and provenance identity.

This selection does not authorize acquisition or implementation. It only fixes
which source family a later, separately authorized lane may audit.

## 6. Selected-source identity to freeze before acquisition

SOURCE_FAMILY_ID=open-instrument.cologne-mw-sanskrit-lexicon.v0_1
SOURCE_TRADITION_ID=cologne-digital-sanskrit-dictionaries.monier-williams-1899.v0_1
SOURCE_TITLE=Monier-Williams Sanskrit-English Dictionary, 1899 digital edition
SOURCE_LANGUAGE=Sanskrit
SOURCE_STAGE=Vedic through late Classical Sanskrit, subject to future population freeze
SOURCE_FORMAT=mw.txt or mw.xml, exact choice to be frozen before acquisition
SOURCE_SNAPSHOT_ID=UNBOUND_UNTIL_SEPARATE_ACQUISITION_LANE
SOURCE_SNAPSHOT_SHA256=UNBOUND_UNTIL_SEPARATE_ACQUISITION_LANE
SOURCE_LICENSE_OR_REUSE_STATUS=CC-BY-SA-4.0_DIGITAL_EDITION_WITH_ATTRIBUTION; printed 1899 source documented public-domain; exact component/license review required before acquisition
SOURCE_ACQUISITION_STATUS=NOT_AUTHORIZED

The future snapshot must bind exact bytes, byte count, encoding, source version,
acquisition timestamp, URL/archive reference, license metadata, record order,
and SHA-256 before any record is read. A live URL alone is not a source
identity.

## 7. Source-record admissibility

An S5 record is admissible only when all required identity and provenance fields
are present and internally consistent:

1. SOURCE_FAMILY_ID and SOURCE_SNAPSHOT_ID match the frozen snapshot.
2. SOURCE_RECORD_ID is source-native and stable. The default proposal is the
   exact L value, extended with a deterministic sub-entry/byte locator only
   when required to distinguish source records. A fabricated ordinal may not
   replace a source-native identity.
3. Exact k1/k2 source form is preserved. Homonym, sub-entry, accent, compound,
   and variant markers remain recoverable.
4. Source language/stage, exact source gloss/sense text, source status, and
   attestation truth are present or explicitly Null/Unknown.
5. Citation identity includes source title, author/editor, edition/version,
   canonical reference, record locator, and page/column locator when present.
6. Source references such as literary citations are preserved as source facts;
   they do not become historical or functional claims.
7. Any sense/block segmentation is source-derived and deterministic. The
   adapter may not merge senses or select a primary sense.
8. Missing pronunciation is valid Null. No spelling, transliteration, accent
   notation, or historical reconstruction is admitted as pronunciation.
9. Missing or contradictory identity, locator, encoding, license binding,
   attestation, or provenance fails closed with no salvaged record.

## 8. Normalization and transliteration policy

ORIGINAL_SCRIPT_PRESERVATION=Preserve exact source-native SLP1 fields and raw bytes; preserve source-native IAST/plain-text fields as source facts with their original field identity; any adapter-derived Devanagari or IAST representation is an additional attributed field, never a replacement
UNICODE_NORMALIZATION=NFC is the only preregistered normalization, applied for Unicode metadata and derived display fields only; never rewrite the source byte boundary
CASE_NORMALIZATION=NONE for source and lookup identity; no case folding
DIACRITIC_POLICY=Preserve every source distinction, including IAST diacritics and Vedic accent markers; no accent/diacritic stripping
TRANSLITERATION_POLICY=SLP1 remains the source-native lookup representation; source-native IAST/plain-text fields such as s1, ls, and etym remain source facts with their original field identity; IAST or Devanagari generated by an authorized transliteration step must be separately named as derived/display representations
TRANSLITERATION_AUTHORITY=Cologne/MWS documented representation conventions; no new transliteration mapping is authorized in S5
DISPLAY_FORM_POLICY=Display exact source form with any derived representation explicitly labeled and provenance-linked
LOOKUP_FORM_POLICY=EXACT source-native SLP1 lookup representation after the explicitly preregistered NFC validation boundary; no transliteration equivalence, case equivalence, stemming, fuzzy match, phonetic match, or semantic match
SOURCE_NATIVE_SLP1_LOOKUP_FIELD=K1
SOURCE_NATIVE_SLP1_LOOKUP_RULE=Use the source k1 primary headword as the sole exact lookup key; preserve k2 as an individually attributable secondary source-form field and do not create an alternate lookup key from k2 in S5
LOOKUP_FORM_CASE_POLICY=NO_LOWERCASE; SLP1 lookup is case-sensitive and preserves the exact source-native representation
PRONUNCIATION_FROM_TRANSLITERATION_ALLOWED=NO

If the existing generic query boundary cannot carry the source-native lookup
representation under its already-authorized exact-key semantics, the future
execution must classify the result as
S5_GENERALIZATION_BLOCKED_BY_CONTRACT_MISMATCH. It may not add a
Sanskrit-only canonicalizer or change the generic query contract inside the
implementation lane.

## 9. Provenance and truth-boundary policy

Every projected record must retain:

- source family and tradition identity;
- immutable snapshot identity and hash;
- source-native record ID;
- exact source form and exact selected gloss/sense text;
- source citation and entry/page/column locator;
- original and derived representation labels;
- attestation truth and source status;
- adapter and retrieval-operator identity.

The following are not allowed to change in S5:

- Seven Voices, including canonical Y;
- Gamma, ZC, Math7, or structural comparison semantics;
- candidate eligibility or analytical candidate generation;
- pronunciation authority;
- functional evidence authority or reviewed promotion;
- historical or etymological claims;
- valid Null, UNKNOWN_OR_NULL, user_decides, or no_single_winner;
- presentation aggregation semantics;
- source-record multiplicity and individual recoverability.

A lexical gloss is a source fact, not functional evidence. A source form is not
spoken pronunciation. A source citation is not historical descent. A structural
match is not semantic equivalence. Any future record lacking authorized
pronunciation must project NULL_UNAUTHORIZED or the equivalent existing
contract posture.

S5 does not establish cross-family generalization of spoken pronunciation,
Seven Voices paths, Gamma, or ZC because the selected source lacks authorized
pronunciation data.

## 10. Future execution sampling and proof plan

The future execution population and snapshot must be frozen before inspecting
retrieval outcomes. The default sample is deterministic and source-derived:

1. Sort admissible records by source-native L identity, then sub-entry
   identity, then exact source-byte offset.
2. Select the first fixed-size bounded sample after applying only the frozen
   admissibility predicate. The execution document must state the size before
   acquisition; the default proposal is 32 records.
3. Within that bounded source-order sample, report available strata for simple
   entries, homonyms, sub-entries/compounds, multiple sense blocks, source
   citations, accent/diacritic forms, and transliteration representations.
4. If a requested stratum is absent, report UNAVAILABLE rather than
   substituting an outcome-selected record.
5. Independently test every exact-key collision in the frozen sample and retain
   every underlying source record.

Future proof must cover, where the frozen source provides them:

- successful source-record admission with complete provenance;
- missing pronunciation producing valid Null;
- multiple lexical senses without primary-sense selection;
- multiple morphological/sub-entry forms without silent merging;
- SLP1/IAST/Devanagari and diacritic edge cases without erased distinctions;
- exact source-family and snapshot provenance;
- Null functional interpretation when no reviewed evidence exists;
- presentation aggregation with every source record recoverable;
- deterministic repeatability from the same snapshot and adapter identity.

No sample may be chosen because it is expected to produce a positive,
functional, historical, or attractive correspondence.

## 11. Pre-registered success and failure criteria

Success requires all of the following in the future execution:

SOURCE_RECORDS_INGESTED_WITH_PROVENANCE=PASS
GENERIC_WITNESS_CONTRACT_REUSED=PASS
SEVEN_VOICES_CHANGED=NO
GAMMA_CHANGED=NO
ZC_CHANGED=NO
FUNCTIONAL_AUTHORITY_CHANGED=NO
NULL_SEMANTICS_CHANGED=NO
NO_SINGLE_WINNER_CHANGED=NO
PRESENTATION_AGGREGATION_SEMANTICS_CHANGED=NO
LANGUAGE_SPECIFIC_SEMANTIC_RULES_ADDED=NO
SPELLING_AS_PRONUNCIATION_ADDED=NO
SOURCE_RECORDS_RECOVERABLE=PASS

Allowed classifications are:

- S5_GENERALIZATION_PASS;
- S5_GENERALIZATION_PASS_WITH_BOUNDED_ADAPTER;
- S5_GENERALIZATION_BLOCKED_BY_SOURCE;
- S5_GENERALIZATION_BLOCKED_BY_CONTRACT_MISMATCH;
- S5_GENERALIZATION_REQUIRES_ARCHITECTURAL_REVIEW.

The following are hard stops, not defects to hide:

- snapshot, license, encoding, or identity cannot be verified;
- record-level provenance or stable locator cannot be preserved;
- source multiplicity cannot be represented without loss;
- the existing exact-query boundary cannot carry the source without a new
  operator;
- pronunciation would require inference from spelling/transliteration;
- language-specific semantic, historical, or functional rules are proposed;
- a candidate producer or existing source contract must change;
- any record is selected or removed based on observed outcomes;
- any required field is silently fabricated or omitted.

## 12. Implementation firewall

This preregistration does not authorize:

- source acquisition, download, import, or source inspection;
- adapter, provider, index, runtime, API, or UI implementation;
- changes to /chat, candidate generation, Seven Voices, Gamma, ZC, Math7,
  functional interpretation, English Kaikki, Albanian, Latin, or presentation
  aggregation;
- S4, S3, broader-diagnostic, or diachronic execution;
- historical derivation claims, consonant meanings, semantic heuristics, or
  promotion of glosses to functional evidence;
- a language-specific matching or transliteration shortcut.

The only repository artifact in this lane is this definition/preregistration
document.

## 13. External source evidence

These public references support source feasibility only; they do not authorize
acquisition:

- Perseus Digital Library lexica repository and reuse notice:
  https://github.com/PerseusDL/lexica
- Perseus Digital Library organization/repository inventory:
  https://github.com/PerseusDL
- Cologne Sanskrit Lexicon Monier-Williams downloads (mw.txt, mw.xml, and
  licensing metadata):
  https://sanskrit-lexicon.uni-koeln.de/scans/MWScan/2020/web/webtc/download.html
- Sanskrit Lexicon MWS repository and correction/data lineage:
  https://github.com/sanskrit-lexicon/MWS
- MWS dictionary profile, record conventions, stage, and digital license:
  https://github.com/sanskrit-lexicon/MWS/blob/master/DICT_PROFILE.md
- MWS data dictionary, L/k1/k2/pc/ls and sense-block structure:
  https://github.com/sanskrit-lexicon/MWS/blob/master/DATA_DICTIONARY.md
- Old Church Slavonic machine-readable candidate and extraction/provenance
  notice:
  https://kaikki.org/dictionary/Old%20Church%20Slavonic/index.html

External facts are limited to source feasibility and representation. They are
not treated as ZË-RO evidence, functional evidence, pronunciation authority,
historical authority, or a positive S5 result.

## 14. Lane closeout boundary

PRODUCTION_CODE_CHANGED=NO
SOURCE_ACQUISITION_PERFORMED=NO
PROVIDER_ADDED=NO
ANALYTICAL_CONTRACT_CHANGED=NO
PRESENTATION_AGGREGATION_CHANGED=NO
S4_EXECUTED=NO

The definition lane may be published as one documentation-only PR after the
focused documentation/path/consistency checks pass. Any later implementation
requires a new explicit authorization and a separate acquisition procedure.
