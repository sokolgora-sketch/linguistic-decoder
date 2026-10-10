# OPEN INSTRUMENT — FUNCTIONAL MOTIVATION INTERPRETATION v0.2

**Milestone ID:** `OPEN_INSTRUMENT_FUNCTIONAL_MOTIVATION_INTERPRETATION_V0_2`

**Status:** `DEFINED_PENDING_IMPLEMENTATION_AUTHORIZATION`

**Definition basis:** `d5b9708f0d7e8ee2cfac6eef46acaba59790cc84`

## 1. Purpose

Move Open Instrument from transparent lexical candidate retrieval toward a
bounded explanation of structural and functional relationships.

The milestone answers this question:

> Given an input word and retrieved lexical candidates, what can ZË-RO explain
> about their nuclei, consonantal structure, source facts, and functional
> relationships without inventing unsupported meaning?

This is an interpretation-contract and product-slice milestone. It does not
implement the interpretation engine, acquire a source, expand language
coverage, execute a provider, or execute S4.

## 2. Current capability baseline

The repository already provides the following bounded capabilities:

* `motivationDiscoveryV0_1` produces an additive Discovery projection with
  source facts, derived structure, candidate records, functional evidence
  status, unresolved fields, provenance, `user_decides`, and
  `noSingleWinner=true`.
* `genericFunctionalWitnessDiscovery.v1` retrieves source records through
  generic adapters and explicitly keeps functional correspondence as
  `NOT_EVALUATED`.
* Existing production analysis supplies authorized spoken pronunciation,
  ordered Seven-Voice paths, Math7, Γ/consonantal context, and ZC structural
  composition where the relevant source authority exists.
* Existing doctrine-reading and functional-profile contracts provide canonical
  per-Voice doctrine metadata. They do not prove that a word means a doctrine
  role or that a path transition has semantic force.
* `/api/analyze-v1` and the existing `/chat` Motivation Discovery card already
  expose additive candidate and provenance surfaces without changing the
  production candidate/status path.

The measured capability gap is not lexical retrieval. The gap is the absence
of one typed, layer-separated interpretation record that lets a user inspect,
for each candidate, the exact structural facts, independently supported
functional evidence, bounded ZË-RO hypothesis, and remaining Null fields.

## 3. Authority and truth layers

Every emitted field belongs to exactly one of these layers:

| Layer | Permitted content | Not permitted |
| --- | --- | --- |
| `SOURCE_FACT` | Source-attested form, language, gloss, citation, locator, provenance, and source status | Treating a gloss as a functional bridge or historical origin |
| `DERIVED_STRUCTURE` | Authorized ordered nuclei/Voice path, Γ, ZC projection, positions, repetition, operations, and deterministic correspondence | Consonant meanings, spelling-as-pronunciation, or semantic conclusions |
| `REVIEWED_FUNCTIONAL_EVIDENCE` | Existing reviewed evidence row and its accepted citations when the carrier and operation policy pass | New evidence, expanded carrier scope, or promotion of a research row |
| `ZRO_FUNCTIONAL_HYPOTHESIS` | A clearly labeled hypothesis that connects an authorized structural relation to independently supported functional evidence | Candidate truth, historical origin, borrowing, cognacy, or language superiority |
| `UNKNOWN_OR_NULL` | Missing authority, unsupported relation, conflicting representation, absent functional evidence, or valid Null | Filling an unresolved field by inference or preferred-example behavior |

`SOURCE_FACT` and `DERIVED_STRUCTURE` are independently useful. A lexical
gloss alone cannot populate `REVIEWED_FUNCTIONAL_EVIDENCE` or
`ZRO_FUNCTIONAL_HYPOTHESIS`. A hypothesis may be emitted only when the
structural relation is authorized and the functional support is independently
available; otherwise the functional layer is `UNKNOWN_OR_NULL`.

## 4. Proposed typed interpretation contract

The first implementation must add one small shared contract, preferably
`src/shared/openInstrument/functionalMotivationInterpretation.v0_2.ts`.
Names below are contract names, not implementation authorization.

### 4.1 Input

```ts
type FunctionalMotivationInterpretationInputV0_2 = Readonly<{
  schemaVersion: "open-instrument.functional-motivation-interpretation.v0_2";
  inputWord: string;
  targetSense: Readonly<{
    id: string;
    label: string;
    authority: "EXPLICIT_USER_OR_AUTHORIZED_SOURCE";
  }> | null;
  sourceFacts: readonly SourceFactV0_2[];
  derivedStructure: DerivedStructureV0_2;
  candidates: readonly ExistingCandidateReferenceV0_2[];
  reviewedFunctionalEvidence: readonly ReviewedFunctionalEvidenceReferenceV0_2[];
}>;
```

`targetSense=null` is valid for structural explanation. A functional semantic
bridge requires an explicit sense-bearing input; it must not be inferred from
the word form alone.

### 4.2 Output

```ts
type FunctionalMotivationInterpretationV0_2 = Readonly<{
  schemaVersion: "open-instrument.functional-motivation-interpretation.v0_2";
  status: "INTERPRETATIONS_FOUND" | "NO_SUPPORTED_INTERPRETATION";
  input: InputStructuralLedgerV0_2;
  candidates: readonly CandidateInterpretationV0_2[];
  unresolved: readonly UnknownOrNullV0_2[];
  claimBoundary: InterpretationClaimBoundaryV0_2;
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
}>;
```

Each candidate record must contain:

* stable candidate identity and exact source provenance;
* source-attested language, form, gloss, status, citations, and locator;
* input and candidate representation kinds;
* authorized ordered nucleus/Voice paths, with repetition and path indexes
  preserved;
* Γ and ZC structural data only where authorized;
* structural relation, operation IDs, and unresolved fields;
* reviewed functional evidence references, or an explicit absence state;
* a separately labeled `ZRO_FUNCTIONAL_HYPOTHESIS`, or Null;
* `historicalRelation="not_claimed"`;
* `candidateTruthClaim="not_claimed"`;
* `winnerClaim="not_claimed"`;
* `languageSuperiorityClaim="not_claimed"`;
* `userDecisionPosture="user_decides"` and `noSingleWinner=true`.

The contract is additive and nullable/omittable at the existing API boundary.
Malformed present payloads must fail closed; absence remains distinguishable
from malformed data.

## 5. Nucleus explanation

The interpretation must explain nuclei as structural events, not as invented
meanings:

* use the authorized spoken pronunciation path when present;
* preserve exact order, path indexes, repeated Voices, moving-nucleus
  boundaries, and source/profile identity;
* use an explicitly qualified profile representation only where the existing
  profile contract permits it;
* keep candidate pronunciation Null when the source supplies lexical form and
  gloss but no authorized pronunciation;
* distinguish same-representation comparison from cross-representation or
  non-comparable comparison;
* report Null when pronunciation authority or representation compatibility is
  insufficient.

The output may say what nuclei and Voice events are structurally present. It
may not say that a particular nucleus causes the target word's meaning.

## 6. Consonant and ZC explanation

The interpretation must explain consonants through the existing structural
contracts:

* Γ is the ordered source-pronunciation consonantal sequence when spoken
  authority exists;
* explicit language/profile consonant fields may be used only under their
  existing profile authority;
* ZC `<P,I,S,D,A,R>` is reused only from an authorized valid pronunciation
  variant and preserves source order, nucleus boundaries, position,
  repetition, and exact identity recurrence;
* absent or unauthorized candidate Γ/ZC remains Null;
* consonants may describe configuration, position, ordering, and repetition;
  no consonant is assigned an inherent semantic or functional meaning.

Structural explanation and functional interpretation remain separate output
sections. The former can be present while the latter is Null.

## 7. Functional interpretation rules

The first slice uses these deterministic rules:

1. A source record is factual only at the source-fact layer.
2. A structural relation is factual only when produced by an existing
   authorized operation and representation boundary.
3. Existing reviewed functional evidence is attached only after its current
   source, carrier, operation, and citation policy passes.
4. A ZË-RO functional hypothesis may combine an authorized structural
   relation with that independently supported functional evidence, but must be
   labeled `hypothesis` and retain its evidence references.
5. A source gloss plus structural resemblance alone returns
   `UNKNOWN_OR_NULL`; it is never silently rewritten as a functional bridge.
6. Missing target sense, missing functional evidence, unsupported carrier,
   pronunciation ambiguity, representation mismatch, and conflicting
   authority produce a precise Null reason.
7. No hypothesis changes the existing aggregate analysis status or promotes a
   candidate into production truth.

## 8. Competing motivations and Null

The system must support multiple surviving candidate explanations. Deterministic
ordering is permitted for reproducibility; ordering is not truth ranking.

The contract preserves:

```text
no_single_winner = true
user_decides
historical origin = not_claimed
historical transmission = not_claimed
borrowing/cognacy = not_claimed
language superiority = not_claimed
candidate truth = not_claimed
```

Null is a successful, explainable result when the required authority or
evidence is absent. The implementation must not reduce Nulls by widening
matching, treating glosses as proof, using spelling as pronunciation, or
selecting a preferred language.

## 9. Reuse-first architecture

The implementation must reuse these existing owners:

* `src/shared/openInstrument/motivationEngineDiscovery.v0_1.ts`
* `src/shared/openInstrument/genericFunctionalWitnessDiscovery.v1.ts`
* `src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts`
* `src/shared/openInstrument/functionalVoiceNormalization.v0.1.ts`
* `src/shared/openInstrument/doctrineReadingContract.v1.ts`
* `src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts`
* `src/shared/openInstrument/zeroConsonantalStructuralComposition.v0_1.ts`
* `src/shared/openInstrument/pronunciationToVoice.v0_1.ts`
* `src/shared/analyzeWordResult.v1.contract.ts`
* `app/api/analyze-v1/route.ts`
* `src/ui/instrument/contractAdapter.ts`
* `src/ui/instrument/sections/MotivationDiscoveryCard.v0_1.tsx`

The first implementation slice is one additive interpretation projector and
one extension of the existing Discovery card. It must not create a second
Discovery engine, a second evidence registry, a new pronunciation system, or
a parallel UI hierarchy.

## 10. First implementation slice

After explicit implementation authorization, the single bounded slice is:

1. Add the typed interpretation contract and pure fail-closed projector.
2. Consume existing `motivationDiscoveryV0_1`, source witnesses, reviewed
   evidence rows, doctrine profiles, Γ, and ZC data.
3. Add an optional additive field to the existing analyze-v1 projection; do
   not change existing status, candidate, pronunciation, or historical fields.
4. Extend the existing Motivation Discovery card with a readable layer order:
   structural facts → candidate correspondence → reviewed evidence → bounded
   hypothesis or Null → provenance and unresolved fields.
5. Keep provider execution disabled for the first slice. No network or new
   source access is required.
6. Preserve the existing `/chat` result hierarchy and avoid a broad UI redesign.

Required API behavior is additive only. Existing consumers that do not receive
the optional field must behave unchanged. The contract must remain valid for
provider-free analysis and for source/provider degradation paths.

## 11. Validation procedure

Tests must use both prepared fixtures and at least one previously unprepared
input. The matrix must include:

* English, Albanian, and Latin lexical candidates;
* a candidate with reviewed functional evidence;
* source-only candidates with no functional evidence;
* missing pronunciation authority;
* missing target sense and missing functional evidence;
* multiple competing candidates;
* exact lexical self-match;
* a valid structural Null;
* malformed and provenance-mismatched payloads;
* repeated nuclei/Voices and consonant repetition;
* candidate/input representation mismatch;
* preservation of source locators, citation references, source status, and
  `user_decides` / `no_single_winner`.

Examples such as `study`, `DI`, or `DA` may be diagnostics only. No preferred
word, language, carrier, or candidate may be hard-coded into production
behavior.

## 12. Acceptance criteria / Definition of Done

This definition milestone is complete when the merged implementation lane
later demonstrates that:

1. The interpretation contract is versioned, typed, deterministic, and
   provider-independent.
2. Every emitted statement is assigned to the correct truth layer.
3. Nucleus order, repetition, representation, and authority are preserved.
4. Γ and ZC explanation is structural only and fail-closed when unauthorized.
5. Reviewed functional evidence cannot be manufactured from a lexical gloss.
6. Functional hypotheses retain independent evidence references and an
   explicit hypothesis label.
7. Competing candidates remain visible without semantic ranking or winner
   promotion.
8. A well-explained Null is emitted for each unsupported case in the matrix.
9. Existing API, candidate, pronunciation, doctrine, evidence, and historical
   contracts remain backward-compatible.
10. Existing S0–S4 research artifacts and source identities remain unchanged.
11. Focused contract, projector, adapter, UI, provenance, and Null tests pass.
12. Appropriate documentation/contract checks, `npm run gate:quick`, build,
    CI, review resolution, post-merge main synchronization, and browser proof
    pass for the implementation lane.
13. Linear and DF_BRAIN record the merged implementation truth without
    modifying unrelated milestones or remotely pushing DF_BRAIN.

## 13. Explicit exclusions

This milestone does not authorize:

* implementation in this definition lane;
* new lexical-source acquisition, source import, or language expansion;
* English Kaikki rebuild or index changes;
* rerunning S2, S3, or S4 research;
* provider/model execution or semantic-alignment execution;
* a new historical-etymology or borrowing investigation;
* consonant semantics or spelling-derived pronunciation;
* automatic language superiority, historical priority, or winner selection;
* aggregate status promotion or production runtime authorization;
* broad architecture or UI redesign;
* reopening the parked Diachronic Binary Transition Experiment v0.2;
* VoiceLab, Evals, Cohort/publication, scorer, or unrelated security lanes.

## 14. Next authorized action

```text
AUTHORIZE_FUNCTIONAL_MOTIVATION_INTERPRETATION_V0_2_FIRST_IMPLEMENTATION_SLICE
```

The implementation lane must begin with a fresh inspect-first check against
the merged definition and must remain one focused PR.
