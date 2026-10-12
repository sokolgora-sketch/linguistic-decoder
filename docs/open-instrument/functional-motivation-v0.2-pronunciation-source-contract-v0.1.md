# OPEN INSTRUMENT — FUNCTIONAL MOTIVATION v0.2 PRONUNCIATION SOURCE CONTRACT AND SELECTION v0.1

Status: `FROZEN_SOURCE_CONTRACT_SELECTION_ONLY`.

Date: 2026-10-12.

This artifact selects language-specific pronunciation source contracts for a
future Functional Motivation v0.2 candidate path. It does not implement a
candidate adapter, acquire source data, register a source, change candidate
generation, derive Voice/Gamma/ZC, bridge representations, activate v0.2, or
resume the false-Null diagnostic.

## Repository and upstream authority

The selection was made against published `main` at:

```text
REPOSITORY=sokolgora-sketch/linguistic-decoder
MAIN_HEAD=2d0a0e0bcd3475281dd3c016986060b52c14c10f
```

The upstream representation decision remains:

```text
REPRESENTATION_AUTHORITY_DECISION=AUTHORIZE_FUTURE_EXPLICIT_PRONUNCIATION_PATH_ONLY
LOAD_BEARING_REPRESENTATION_DECISION_CHANGED=NO
V0_2_CURRENT_PRODUCT_POSTURE=REMAINS_FAIL_CLOSED_PENDING_AUTHORIZED_PRONUNCIATION
FALSE_NULL_DIAGNOSTIC_DISPOSITION=DEFERRED_PENDING_V0_2_REACHABILITY
TWO_MODE_DESIGN_STATUS=NOT_AUTHORIZED
```

The current production comparison remains `production_spoken` input versus
`orthographic_profile_derived` candidate with
`CROSS_REPRESENTATION` and
`NOT_COMPARABLE_ACROSS_REPRESENTATIONS`. No current candidate is promoted to
`SAME_REPRESENTATION` by this artifact.

## Scope decision

```text
SOURCE_SELECTION_SCOPE=LANGUAGE_SPECIFIC_MULTISOURCE
```

One pronunciation source is not assumed to cover every language. The selected
scope is limited to two already evidenced source families with different
language boundaries:

1. English: frozen bundled CMUdict ARPAbet en-US source profile.
2. Albanian: frozen Wiktionary → Wiktextract → Kaikki Albanian IPA source
   contract.

This is not a convenience selection. CMUdict is selected for English because
the repository contains an exact, hash-bound pronunciation artifact and a
source-profile contract for its ARPAbet variants. The Albanian source is
selected because the repository contains an exact, hash-bound source contract
that preserves explicit IPA, dialect scope, variants, and provenance. Neither
selection is based on the current DI study candidate, and neither selection
authorizes a runtime candidate role by itself.

## Bounded source inventory

The inventory is limited to repository-present or repository-authorized source
families that could plausibly provide candidate pronunciation. It is not a
corpus search and did not transfer source data.

### 1. `open-instrument.cmudict-arpabet-en-us.v0_1`

```text
name=CMUdict / Carnegie Mellon Pronouncing Dictionary
owner=Carnegie Mellon University Speech Group / cmusphinx
type=frozen offline English pronunciation dictionary
pronunciation_field=cmudict.dict ARPAbet token sequence with stress digits
notation=ARPABET
language_variety=English; CMUdict documented English pronunciation inventory
form_linkage=NFC + locale-independent English lowercase lookup; sourceForm and variant suffix preserved
version=revision 74790861f652b15e4ac49015a90074ad62a27690
locator=src/data/openInstrument/pronunciation/cmudict.dict; source repository revision
provenance=source profile, source form, variant id/order, revision, notation, SHA-256
license=Carnegie Mellon permissive redistribution terms; retain notice and disclaimer; attribution requested
reproducible_snapshot=YES; 3618488 bytes; SHA-256 81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22
normalization=existing CMUdict source-profile normalization for lookup and ARPAbet base categories
malformed_unknown_policy=unsupported or unresolved pronunciation remains Null under existing reason codes; candidate-role malformed-record policy still requires a separate contract
repo_present=YES
currently_authorized_as_candidate_role=NO
suitability=SOURCE_LEVEL_ENGLISH_PRONUNCIATION_YES
rejection_reason_for_current_runtime_role=INPUT_PRONUNCIATION_CONTRACT_ONLY; no candidate-role wiring is authorized
```

### 2. `open-instrument.wiktionary-kaikki-albanian-ipa.v0_1`

```text
name=English Wiktionary Albanian-language entries -> Wiktextract -> Kaikki Albanian JSONL
owner=Wiktionary contributors; Wiktextract; Kaikki distribution
type=frozen Albanian pronunciation-text source profile
pronunciation_field=explicit IPA plus sound-level tags/notes
notation=IPA as preserved source text; wrapper/scope doctrine remains separately governed
language_variety=Albanian sq; explicit Standard/Gheg/Tosk/regional scope or ALBANIAN_UNSPECIFIED
form_linkage=source lexical form and source observation locator; no spelling-derived dialect inference
version=upstream dump 2026-09-02; Kaikki build 2026-09-25; Wiktextract 1a05e46f9efbccda6a2b2f8e21b30a9c0c46513a; Wikitextprocessor e3d6d4edb77618f4d6680edc66e3f774bea59820
locator=https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl; frozen artifact identity by SHA-256
provenance=lexical form, language/code, explicit IPA, sound tags/notes, variant identity/order, locator, build metadata
license=source data CC BY-SA/GFDL posture with attribution; Wiktextract software MIT; license notice required
reproducible_snapshot=HASH_BOUND_YES; 67438755 bytes; SHA-256 7bd411e2b3cdfd83b7f09af9700791c01e81f36224ec5134e118ff26e83d0aa0; complete replay not proven
normalization=raw pronunciation preserved; source-specific notation/input processing exists, but candidate spoken normalization is not authorized here
malformed_unknown_policy=PRONUNCIATION_NOT_FOUND, DIALECT_SCOPE_UNRESOLVED, or PRONUNCIATION_VARIANT_AMBIGUOUS; missing IPA is not filled from spelling
repo_present=YES
currently_authorized_as_candidate_role=NO
suitability=SOURCE_LEVEL_ALBANIAN_PRONUNCIATION_YES
rejection_reason_for_current_runtime_role=SOURCE_CONTRACT_ONLY; runtime lookup and IPA-to-Voice projection are explicitly undefined
```

### 3. `open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1`

```text
name=English Wiktionary -> Wiktextract -> Kaikki English lexical-sense snapshot
owner=Wiktionary/Wiktextract/Kaikki
type=English lexical-sense JSONL source family
pronunciation_field=not admitted by the frozen English lexical adapter
notation=NOT_APPLICABLE
language_variety=English lexical senses
form_linkage=exact frozen lexical lookup key and source-record/sense locator
version=snapshot 2026-10-03; SHA-256 9978ce34256e4143c3498387564d293a9a2971ef376c1e038d369a2021c02195
locator=https://kaikki.org/dictionary/English/kaikki.org-dictionary-English.jsonl
provenance=lexical source record, sense, snapshot, hash, and JSONL locator
license=CC BY-SA/GFDL data posture with attribution; Wiktextract MIT software
reproducible_snapshot=HASH_BOUND_YES in lexical adapter contract
normalization=lexical lookup only
malformed_unknown_policy=lexical adapter failure/Null; pronunciation requests are NULL_UNAUTHORIZED
repo_present=YES
currently_authorized_as_candidate_role=NO
suitability=REJECTED_LEXICAL_ONLY
rejection_reason=the frozen adapter explicitly excludes pronunciation and returns NULL_UNAUTHORIZED for pronunciation requests
```

### 4. Existing Latin lexical substrate

```text
name=repository Latin lexical substrate / S1 source family
owner=Open Instrument frozen research substrate
type=lexical source records
pronunciation_field=none under the current contract
notation=NOT_APPLICABLE
language_variety=Latin source-specific lexical scope
form_linkage=source lexical record identity
version=frozen repository research artifact
locator=repository Latin lexical substrate contract and records
provenance=lexical source identity only
license=repository source policy; pronunciation license not established
reproducible_snapshot=YES for the existing lexical artifact; pronunciation snapshot NO
normalization=lexical lookup only
malformed_unknown_policy=existing lexical Null behavior
repo_present=YES
currently_authorized_as_candidate_role=NO
suitability=REJECTED_NO_PRONUNCIATION_SURFACE
rejection_reason=no current pronunciation field or pronunciation authority
```

## Source authority selection

```text
PRONUNCIATION_SOURCE_DECISION=AUTHORIZE_LANGUAGE_SPECIFIC_SOURCE_CONTRACTS
SELECTED_SOURCE_ID=\
open-instrument.cmudict-arpabet-en-us.v0_1;\
open-instrument.wiktionary-kaikki-albanian-ipa.v0_1
SELECTED_SOURCE_NAME=\
CMUdict ARPAbet en-US;\
Wiktionary-Wiktextract-Kaikki Albanian IPA
SELECTED_LANGUAGE_SCOPE=English; Albanian (sq)
SELECTED_PRONUNCIATION_NOTATION=ARPABET; IPA
SELECTED_VARIETY_SCOPE=CMUdict documented English pronunciation inventory; Albanian explicit scope values with ALBANIAN_UNSPECIFIED preserved
SELECTED_VARIANT_POLICY=preserve all authorized variants, source order where meaningful, deterministic non-semantic order otherwise, recoverable variant identity, no winner
SELECTED_VERSION_POLICY=bind every record to the frozen revision/snapshot identity and content hash; mutable live URLs are not identity
SELECTED_PROVENANCE_POLICY=retain exact source form, raw pronunciation, source/profile identity, variant identity/order, language/variety, locator, revision/build metadata, and license metadata
SELECTED_LICENSE_STATUS=reviewed and recordable; attribution and source/license notices required; no legal conclusion implied
SELECTED_NULL_POLICY=fail closed with explicit source/version/provenance/license/notation/variant reason; never infer pronunciation from spelling, gloss, translation, history, or functional status
```

The selection authorizes only a future source-level candidate-pronunciation
contract for the two named language scopes. It does not authorize source data
acquisition, source registration, runtime lookup, adapter implementation,
candidate generation, candidate eligibility, or production activation.

## Source versus projection authority

The fields below are intentionally independent for the selected language
contracts:

```text
SOURCE_PRONUNCIATION_AUTHORITY=AUTHORIZED_AT_SOURCE_CONTRACT_LEVEL_ONLY
NOTATION_AUTHORITY=EXISTING_AUTHORIZED_CONTRACT_FOR_ARPABET; EXISTING_SOURCE_INPUT_CONTRACT_FOR_ALBANIAN_IPA
NORMALIZATION_AUTHORITY=EXISTING_AUTHORIZED_CONTRACT_FOR_CMUDICT_INPUT; REQUIRES_SEPARATE_CANDIDATE_PRONUNCIATION_CONTRACT_FOR_ALBANIAN
VOICE_PROJECTION_AUTHORITY=REQUIRES_SEPARATE_CONTRACT
GAMMA_PROJECTION_AUTHORITY=REQUIRES_SEPARATE_CONTRACT
ZC_PROJECTION_AUTHORITY=REQUIRES_SEPARATE_CONTRACT
REPRESENTATION_BRIDGE_AUTHORITY=REQUIRES_SEPARATE_CONTRACT
SAME_REPRESENTATION_AUTHORIZED_NOW=NO
```

The existing CMUdict pronunciation-to-Voice contract is authorized for the
English spoken input profile. It does not cause lexical candidate records to
inherit that authority. The existing Albanian source contract preserves IPA
observations and source scope, but explicitly does not define IPA-to-Voice,
runtime lookup, moving-nucleus, or production authority. No selected source
therefore establishes candidate `production_spoken`, Voice, Gamma, ZC, or
`SAME_REPRESENTATION` authority in the current product.

## CMUdict candidate-role classification

```text
CMUDICT_CANDIDATE_ROLE_CLASSIFICATION=INPUT_ONLY_NOT_REUSABLE_CURRENTLY
```

Evidence: `docs/open-instrument/pronunciation-to-voice-authority-contract-v0.1.md`
and `src/shared/openInstrument/cmudictArpabetPronunciation.v0_1.ts` define a
bounded English input pronunciation source profile, its ARPAbet notation,
variants, source revision, and input projection chain. The representation
authority contract separately states that the CMUdict input contract does not
authorize lexical source records to inherit candidate pronunciation. A future
candidate-role contract is required; notation familiarity is not role
authority.

## Current candidate and Albanian state

```text
UPSTREAM_REPRESENTATION_AUTHORITY_CONTRACT_READ=YES
CURRENT_INPUT_PRONUNCIATION_SOURCE=CMUdict ARPAbet en-US input profile when the input path is English
CURRENT_INPUT_PRONUNCIATION_NOTATION=ARPABET with stress digits
CURRENT_INPUT_LANGUAGE_VARIETY=English; CMUdict documented English pronunciation inventory
CURRENT_INPUT_VARIANT_POLICY=preserve source variants and order; no source-level winner
CURRENT_CANDIDATE_PRONUNCIATION_SOURCE=NONE_AUTHORIZED
CURRENT_CANDIDATE_PRONUNCIATION_AUTHORITY=NOT_AUTHORIZED
CURRENT_ALBANIAN_PRONUNCIATION_SOURCE_EXISTS=YES_AT_SOURCE_CONTRACT_LEVEL
CURRENT_ALBANIAN_PRONUNCIATION_SOURCE=open-instrument.wiktionary-kaikki-albanian-ipa.v0_1
CURRENT_ALBANIAN_PRONUNCIATION_AUTHORITY=AUTHORIZED_AT_SOURCE_CONTRACT_LEVEL_ONLY
```

The Albanian source contract is not relabeled as a current runtime candidate
source. Orthography, profile-derived Voice/Gamma, transliteration, gloss, and
reviewed functional evidence remain distinct from pronunciation.

## Minimum source contract

```text
MINIMUM_SOURCE_CONTRACT_COMPLETE=YES_AT_SOURCE_LEVEL; CANDIDATE_ROLE_AND_PROJECTION_STAGES_REMAIN_UNAUTHORIZED
```

Each selected source contract freezes exact identity, owner/project, revision
or snapshot, license posture, lexical form, language/variety, raw pronunciation
and notation, variant identity/order, locator/provenance, normalization status,
and fail-closed handling. The selection does not define notation-conversion,
Voice, Gamma, or ZC algorithms.

## Variant, lookup, and Null policy

```text
VARIANT_POLICY=preserve all authorized source variants; preserve meaningful source order; otherwise use deterministic non-semantic ordering; recover variant identity; fail closed per variant
VARIANT_WINNER_SELECTION=NO
NO_SINGLE_WINNER_PRESERVED=YES
SOURCE_LOOKUP_KEY=source-specific exact lexical form under the selected source contract; CMUdict normalized lexical word for its existing input profile; Albanian source form plus source observation identity
SOURCE_LOOKUP_NORMALIZATION=source/profile-bound and deterministic only; no gloss, semantic, historical, translation, fuzzy, phonetic, or spelling shortcut
SOURCE_LOOKUP_AMBIGUITY_POLICY=preserve all recoverable variants and scope values; unresolved scope, malformed notation, unsupported notation, or ambiguous variant remains Null
SOURCE_NULL_POLICY=SOURCE_NOT_AVAILABLE; FORM_NOT_FOUND; LANGUAGE_NOT_SUPPORTED; VARIETY_NOT_SUPPORTED; PRONUNCIATION_MISSING; PRONUNCIATION_MALFORMED; PRONUNCIATION_NOTATION_UNSUPPORTED; PRONUNCIATION_AMBIGUOUS; SOURCE_VERSION_UNRESOLVED; PROVENANCE_UNRESOLVED; LICENSE_UNRESOLVED; UNAUTHORIZED_SOURCE
```

No pronunciation is inferred from spelling, transliteration, gloss, semantic
similarity, reviewed functional status, historical relation, or candidate
identity. The source lane does not establish functional motivation, etymology,
cognacy, borrowing, consonant meaning, language priority, or ZË-RO correctness.

## Explicit firewalls

```text
SOURCE_DATA_ACQUIRED=NO
NETWORK_SOURCE_DATA_TRANSFER=NO
SOURCE_REGISTRATION=NO
SOURCE_ADAPTER_IMPLEMENTATION=NO
PRODUCTION_ACTIVATION=NO
REPRESENTATION_BRIDGE=NO
SAME_REPRESENTATION=NO
FALSE_NULL_EXECUTION=NO
TWO_MODE_DESIGN=NO
S5_REOPENED=NO
SANSKRIT_SOURCE_SELECTED=NO
```

## Next-lane recommendation

The selected sources have source-level identity and pronunciation authority,
but candidate-role wiring is absent and the Albanian path still lacks a
candidate-compatible normalization authority. The next lane must therefore
define notation/normalization authority before any candidate-role adapter or
runtime work:

```text
NEXT_RECOMMENDED_LANE=PRONUNCIATION_NOTATION_AND_NORMALIZATION_AUTHORITY_CONTRACT
NEXT_ACTION=AWAIT_DF_DECISION
```

No next lane is executed by this artifact.

## Documentation research references

The bounded documentation review used official source documentation only:

- CMUdict repository and README: https://github.com/cmusphinx/cmudict
- CMUdict license: https://github.com/cmusphinx/cmudict/blob/master/LICENSE
- Kaikki machine-readable dictionary list: https://kaikki.org/dictionary/
- Kaikki raw-data documentation: https://kaikki.org/dictionary/rawdata.html
- Wiktionary copyrights: https://en.wiktionary.org/wiki/Wiktionary:Copyrights
- Wiktextract README: https://github.com/tatuylonen/wiktextract
- Wiktextract license: https://github.com/tatuylonen/wiktextract/blob/master/LICENSE

These references establish source/documentation facts only. They do not
authorize data acquisition or override repository contracts.
