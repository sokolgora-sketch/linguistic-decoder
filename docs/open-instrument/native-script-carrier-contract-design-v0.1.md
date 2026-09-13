# Open Instrument Native Script / Transliteration / Carrier Contract Design v0.1

Status:

`DESIGN_ONLY`

Milestone ID:

`OPEN_INSTRUMENT_NATIVE_SCRIPT_CARRIER_CONTRACT_DESIGN_V0_1`

Contract posture:

`RESEARCH_ONLY`

This document defines a possible future contract seam. It does not implement
native-script handling, create production transliteration mappings, change
Analyze V1, change the Seven-Voices engine, call a provider, or promote any
linguistic hypothesis to evidence or truth.

## Design decision

Open Instrument can define a deterministic and evidence-safe representation
contract, but the current repository does not justify automatic native-script
transliteration in the production Analyze V1 path.

The smallest defensible posture is a research-only representation seam based
on the existing Seven-Voice Functional Recurrence contracts:

`source form`
-> `explicit comparison form`
-> `declared comparison mode`
-> `authority and provenance`
-> `deterministic Seven-Voice observation`

The seam must not silently convert a native form into an analytical form. A
future production mapping requires its own reviewed, deterministic mapping
contract and an explicit compatibility decision.

## Current repository boundary

Analyze V1 currently accepts `word`, `mode`, `alphabet`, optional `ipa`,
optional `language`, target-sense extensions, and named seed options. Its
production route has no native-script, transliteration, or script-selection
request field. The legacy `/api/analyze` route re-exports the same handlers.

The deterministic runner trims and passes the word to the existing engine.
The core Seven-Voices extraction recognizes the canonical set:

`A E I O U Y Ë`

The current DeepRoot lexical normalization authority is bounded to ASCII
Latin letters plus canonical `Ë`. Unsupported Unicode letters and marks are
not partially deleted and are not silently transliterated. That fail-closed
behavior remains the production boundary.

The shared vowel mapper has deterministic Latin, diacritic, and Greek
orthography support, but it is not a generic transliteration service. Greek
support in that mapper and the research layers must not be interpreted as a
general native-script API.

IPA and Zhuyin carrier paths are separate phonetic/context rails. They do not
define a native-script conversion contract.

## Terms

### Source form

`sourceForm` is the exact lexical surface supplied or attested by the caller
or source. It is retained for audit and is never silently rewritten by a
comparison layer.

### Native-script form

`nativeScriptForm` is a source form written in the source language's original
or declared writing system, when that fact is known. It is a provenance
description, not a promise that the system can analyze that script.

If the script is not established by an explicit source or deterministic
script rule, the script identity is `Null`/Unknown rather than an inferred
label.

### Transliterated form

`transliteratedForm` is a representation converted between writing systems.
For alignment with the existing research contract, the future implementation
should use the established `comparisonForm` name at the recurrence boundary.
A transliteration must be explicitly declared as
`comparisonMode: "transliteration"`; it may not masquerade as orthography.

### Normalized analysis form

`normalizedAnalysisForm` is the exact form consumed by a declared deterministic
Seven-Voice comparison or analysis rail. It is not automatically derived from
`sourceForm` in this design. It exists only when an explicit identity or
reviewed deterministic transformation has produced it.

Outer whitespace trimming, NFC handling, case handling, tone handling, and
lexical conversion are different operations and must not be collapsed into a
vague `normalize` claim.

### IPA form

`ipaForm` is a phonetic representation. It is not a script transliteration and
must remain on the existing bounded IPA/carrier path. IPA-derived carrier
voices do not overwrite orthographic functional truth automatically.

### Carrier

The current repository uses carrier language for bounded phonetic projections,
especially IPA and Zhuyin carrier voice extraction. A carrier is therefore a
derived comparison/context path, not a synonym for a consonant, transliteration,
or native script.

This design does not add a native-script carrier mapping. If a future script
adapter derives a carrier projection, that projection must be explicitly
identified, deterministic, and provenance-bearing. It must remain separate
from the orthographic Seven-Voice path.

## Existing contract seam

The closest existing contract is Seven-Voice Functional Recurrence v0.1. It
already separates:

- `surfaceForm`
- `comparisonForm`
- `comparisonMode`
- `comparisonAuthority`
- `comparisonProvenance`

The evidence-admission contract requires a non-empty `ruleId` for
transliteration and retains `provenanceId`, authority, and evidence references.
The candidate evidence packet permits incomplete proposed comparison data while
it remains research staging. These contracts do not expose API, UI, or runtime
state and do not promote research candidates to production truth.

This existing seam is sufficient for a first research-only representation. A
new production request schema is not justified by the current evidence.

## Minimal conceptual contract

The following is a conceptual research record, not a production TypeScript
type or Analyze V1 request shape:

```ts
type NativeScriptCarrierResearchRepresentationV0_1 = Readonly<{
  languageId: string | null;
  surfaceForm: string;
  sourceScript: string | null;
  comparisonForm: string | null;
  comparisonMode:
    | "orthography"
    | "transliteration"
    | "z_zero_functional_normalization"
    | null;
  comparisonAuthority: string | null;
  comparisonProvenance: {
    provenanceId: string;
    authority: string;
    ruleId: string | null;
    evidenceRefs: readonly string[];
  } | null;
}>;
```

This record is intentionally smaller than a full source/evidence packet. The
existing candidate and cohort contracts remain the owners of source
attestation, review status, claim boundaries, and admission rules.

The following invariants apply:

- `surfaceForm` is required for an admitted observation and is not silently
  rewritten.
- `sourceScript` is optional descriptive metadata; Unknown/Null is valid.
- `comparisonForm` is Null until a caller or reviewed rule explicitly supplies
  it.
- `comparisonMode` is required whenever `comparisonForm` is used.
- `comparisonMode: "transliteration"` requires explicit authority and a
  non-empty provenance `ruleId` before evidence admission.
- `comparisonAuthority` must agree with provenance authority.
- Missing provenance cannot be admitted; staging remains Null/Unknown or is
  rejected.
- `comparisonForm` is analyzed only under the declared mode and rule.
- A missing or unresolved mapping yields Null/Unknown or remains a research
  candidate; it does not trigger a guessed production conversion.

## Required, optional, and excluded data

### Required for an admitted research comparison

- `surfaceForm`
- `languageId`
- `comparisonForm`
- `comparisonMode`
- `comparisonAuthority`
- `comparisonProvenance.provenanceId`
- `comparisonProvenance.authority`
- `comparisonProvenance.ruleId` for transliteration or functional
  normalization
- `comparisonProvenance.evidenceRefs` as the existing audit reference list

### Optional or Null-capable during research staging

- `sourceScript`
- `languageId` when the staging packet has not yet resolved the language
  identity
- proposed comparison form and mode before admission review
- source citations and language variety, using the existing candidate packet
  contract

### Not part of v0.1

- Analyze V1 native-script request fields
- automatic production transliteration
- a global script detector
- a universal ISO or language-standard registry
- hidden provider or LLM normalization
- a new `requestedForm`/`effectiveForm` response architecture
- a new carrier field in `meta.inputs`
- automatic candidate ranking across transliterations
- automatic etymological, historical, cognacy, or winner claims
- changes to RRB, Evidence Package, OriginClaim, or successful API output

## Script and input support today

The current behavior is layered and must not be described as one universal
script policy:

- ASCII Latin is the established production lexical lane.
- Latin diacritics are handled in selected shared orthography mappers, but
  unsupported Unicode must not be partially deleted by structural lexical
  normalization.
- Canonical `Ë`/`ë` is retained as a Seven-Voice symbol after the existing
  case/NFC handling.
- `Y`/`y` is canonical Seven-Voice `Y` by default. A Turkish `langHint` rule
  explicitly treats `y` as consonantal in that bounded mapper context; this
  does not change the universal canonical `Y` rule.
- Greek vowel orthography is supported by the shared v0.2 mapper with a
  deterministic Greek-specific table and NFD fallback. This is orthography
  mapping, not transliteration.
- Selected language profiles, including Albanian and Turkish, affect existing
  consonant/profile behavior; they do not establish a native-script mapping
  service.
- Cyrillic and other unrecognized scripts have no approved production
  transliteration mapping. Structural lexical paths fail closed or preserve
  their bounded raw fallback according to their existing contract.
- Mixed scripts, unsupported combining marks, and confusables must not be
  silently converted into a new lexical identity.
- Punctuation and combining marks remain subject to each existing rail's
  explicit behavior. They are not evidence that a general script conversion
  exists.
- IPA is a separate phonetic input and carrier path.

## Carrier and Seven-Voice boundary

Vowels drive the Seven-Voices path. Consonants may shape existing structures,
but a transliteration artifact must not silently create or delete a vowel and
thereby change the canonical path without an explicit declared transformation.

The canonical voice order remains:

`A E I O U Y Ë`

The existing Turkish test demonstrates why a transliteration or language rule
must be mode-bound: default `y` in `yol` maps to `Y`, while the explicit Turkish
language hint records `y` as consonantal. A future script rule that uses `y` as
a glide must not change canonical orthographic `Y` implicitly. It must declare
its transformation and remain separately traceable.

Carrier outputs are derived observations. They are not a replacement for the
orthographic path, and they do not establish origin, historical transmission,
candidate truth, or a single winner.

## Authority and status

The source and the transformation have separate authority questions.

Acceptable future authority categories must be explicit, for example:

- a user-supplied comparison form
- a named deterministic published scheme
- a language-specific reviewed mapping
- an internal reviewed project rule
- an unreviewed research candidate
- Unknown

The existing research vocabulary is preferred over inventing a competing
status vocabulary:

- `research_candidate`
- `reviewed_candidate`

These statuses do not create production truth. A source citation can attest a
lexical form without validating the functional interpretation or transliteration
rule. Provider-generated suggestions, if ever collected under an authorized
future workflow, remain candidate material until independently reviewed.

## Determinism and ambiguity

Deterministic transformations are allowed only when the authority, procedure,
version, and rule identifier are fixed. Examples include a frozen table for a
declared script, an explicitly declared tone-stripping rule, or NFC handling
where that operation is part of the named rule. A hidden model decision is not
deterministic contract behavior.

When a source has multiple defensible transliterations:

1. retain the alternatives as separately declared research representations;
2. preserve the source and each transformation's provenance;
3. do not select the alternative that produces a preferred Seven-Voice result;
4. require an explicit caller or reviewed selection rule for any single
   comparison form;
5. keep unresolved alternatives Null/Unknown or under
   `no_single_winner`/`user_decides` posture.

For confirmatory research, the applicable authority, selection rule, rule ID,
and comparison form must be frozen before examining the relevant evidence.
Post-hoc transliteration selection remains exploratory.

## Evidence and truth boundary

Script identity and transliteration are representational metadata unless an
independent source supports a separate evidence claim. A resemblance between a
native form and a Latin comparison form is not etymological evidence.

The future seam must preserve the existing layers:

`source attestation`
-> `comparison/transformation provenance`
-> `deterministic voice observation`
-> `research hypothesis`

It must not create:

- historical origin evidence
- candidate-truth evidence
- reviewed lexical truth from resemblance
- Petro evidence
- provider evidence
- a forced winner

The existing claim boundary remains `not_claimed` for origin, transmission,
cognacy, borrowing, universality, candidate truth, and winner claims, with
`user_decides` where a user decision is required.

## API, exports, and UI impact

No Analyze V1 or `/api/analyze` change belongs in this design. Existing `word`
remains valid and current callers remain unchanged. A later additive request
contract, if ever authorized, must make the representation and transformation
explicit rather than overloading `word` or `alphabet`.

The `/api/analyze` shim would inherit any future Analyze V1 change, so it must
not be changed independently. No RRB, Evidence Package, or OriginClaim field
or behavior is changed here. If a future research artifact stores the
representation, it should use an explicit research packet/projection and must
not silently alter production result or bundle identity.

The current `/chat`, analyze client, console, and compare surfaces have no
native-script or transliteration controls. No UI change is justified by this
design alone. A future UI would need to show source and comparison forms with
their modes and provenance rather than hiding a conversion.

## Security and input safety

This design does not introduce a material security issue. The relevant safety
requirements are bounded:

- retain input size and framework body limits;
- use explicit Unicode handling and do not partially delete unsupported marks;
- treat mixed-script/confusable detection as a separate reviewed concern;
- reject or classify malformed transformation records without echoing secrets;
- never use provider output as an implicit normalization step;
- avoid serializing raw input into production exports merely because a research
  record exists.

These constraints do not constitute a general Unicode-security redesign.

## Future implementation tests

A later implementation must add deterministic tests before runtime wiring:

- existing ASCII Latin input is unchanged;
- `Ë` remains canonical `Ë`;
- default `Y` remains canonical `Y`;
- any language-bound consonantal-Y rule is explicit and does not alter the
  default rail;
- a frozen reviewed mapping gives the same comparison form on repeated runs;
- the mapping rule, authority, and evidence references are retained;
- an unknown or unsupported script yields Null/Unknown rather than a guessed
  analysis form;
- multiple transliterations remain separate and do not force a winner;
- missing transliteration provenance is rejected by evidence admission;
- source attestation is not relabeled as transformation or origin evidence;
- carrier output remains separate from orthographic functional truth;
- Analyze V1, `/api/analyze`, RRB, Evidence Package, and OriginClaim remain
  unchanged until an additive runtime contract is separately approved;
- no provider execution occurs in deterministic contract tests.

## Recommended sequencing

1. Select one concrete language/script and a real source/mapping authority.
2. Audit the proposed mapping and ambiguity policy read-only.
3. Implement or extend a research-only candidate packet using the existing FVR
   comparison/provenance contracts.
4. Add admission and negative-control tests.
5. Obtain the required review/evidence decision.
6. Only then consider a separately authorized production/API contract.

No step above authorizes provider execution, production transliteration, native
script input in Analyze V1, or evidence promotion.

## Decision and next lane

Design decision:

`GO_NATIVE_SCRIPT_CARRIER_CONTRACT_V0_1`

Recommended implementation posture:

`OPTION_E_RESEARCH_ONLY`

The next executable lane should not be a generic mapping implementation. It
should be a read-only audit of one concrete, source-backed script/mapping
proposal after a real authority is selected:

`OPEN_INSTRUMENT_NATIVE_SCRIPT_CARRIER_MAPPING_EVIDENCE_AUDIT_V0_1`

That lane would be blocked until a concrete language/script, source authority,
and proposed deterministic rule are available. This design does not authorize
it automatically.
