# OPEN INSTRUMENT — RETRIEVAL KEY AUTHORITY AND REACHABILITY DEFINITION v0.1

Status: `DEFINED_NOT_EXECUTED`

This is a definition/freeze subordinate to
`OPEN_INSTRUMENT_MULTILINGUAL_DISCOVERY_SUBSTRATE_EXPANSION_V0_2`. It does not
change runtime retrieval, matching, normalization, source data, or any
scientific result. It defines one paired, one-attempt procedure that may return
`AUTHORIZED`, `NOT_AUTHORIZED`, or `INSUFFICIENT_EVIDENCE` for a narrow
retrieval-key representation hypothesis.

## Current authority

The current source record preserves `sourceForm` exactly and binds it to its
citations and provenance. The current record also carries `queryForm` and
`lookupForm`, but the admission contract currently requires both to equal the
English-uppercase NFC representation of `sourceForm`. The generic adapter then
matches `record.lookupForm === input.embryo` after the existing NFC/trim query
normalization. Matching is exact equality only.

The structural query generator remains the existing
`genericQueryKeysForWordV0_2` path. Its structural normalizer accepts ASCII
letters and canonical `ë`; unsupported Unicode letters/marks fail closed. No
pronunciation, gloss, semantic, historical, functional, or candidate outcome
is an input to the retrieval-key procedure.

This definition preserves the authoritative S3 result and the broader
diagnostic result. It does not rerun either one and does not start S4.

## Source form and retrieval key

`sourceForm` is the exact source-attested lexical form. It is citation-bound,
provenance-bound, displayed as source evidence, and never rewritten by a
retrieval operator. A retrieval key is a separate deterministic comparison
representation derived by a versioned operator. It is not a pronunciation,
historical, functional, semantic, or etymological equivalence.

The future procedure keeps exact matching:

```text
match iff authorizedRetrievalKey(left) === authorizedRetrievalKey(right)
```

Substring, prefix, suffix, edit-distance, fuzzy, phonetic, semantic,
embedding, provider, and model matching are not permitted.

## Operator decision at definition time

The definition freezes a bounded candidate operator for a future paired
measurement; it does not authorize it in runtime or assert that it is
linguistically valid. The candidate is deliberately Latin/source-tradition
scoped because the current question arose from the eight Lewis & Short display
forms containing macrons/breves. It is not a generic accent-removal rule.

`RETRIEVAL_KEY_OPERATOR_ID=`
`open-instrument.retrieval-key-canonicalization.latin-scholarly-quantity.v0.1`

At freeze time:

```text
CANDIDATE_OPERATOR_STATUS=PROPOSED_NOT_AUTHORIZED_FOR_RUNTIME
CURRENT_AUTHORITY_DECISION=INSUFFICIENT_EVIDENCE
```

The future pre-execution authority gate may classify the candidate as
`AUTHORIZED`, `NOT_AUTHORIZED`, or `INSUFFICIENT_EVIDENCE`. If it is not
`AUTHORIZED`, Arm B is not scientifically executed and the result class is
`CLASS_E`.

The gate is deterministic and has no post-result discretion. It returns
`AUTHORIZED` only when the frozen evidence includes an explicit
source-tradition authority statement permitting the exact enumerated
transformations, complete coverage of the 21-record set, preservation of all
source/truth fields, no unauthorized equivalence claim, and passing exact-key
and collision invariants. It returns `NOT_AUTHORIZED` if the frozen authority
explicitly prohibits the operator or an invariant fails. Otherwise it returns
`INSUFFICIENT_EVIDENCE`. The current frozen evidence has no explicit
authorization or prohibition, so the bound decision is
`INSUFFICIENT_EVIDENCE`; changing that decision requires a new procedure
version.

### Candidate operator

1. Input is one of the 21 frozen Latin source records from the pinned
   `scaife.lewis-short.v0_1` source tradition.
2. Preserve the source form unchanged.
3. Normalize the comparison string to NFC, then apply deterministic English
   uppercase.
4. Replace only the explicitly enumerated precomposed Latin vowel macron/breve
   code points (lowercase or uppercase) with their ASCII base vowel:
   `ĀĂ→A`, `ĒĔ→E`, `ĪĬ→I`, `ŌŎ→O`, `ŪŬ→U`.
5. Normalize the comparison result to NFC and require an ASCII alphabetic
   retrieval key. No other code point is transformed.

No combining-mark deletion, transliteration, consonant rewrite, language-wide
Unicode folding, or source-display mutation is authorized by this definition.
The operator is deterministic and idempotent. Unsupported characters, empty
keys, non-Latin source traditions, and unenumerated transformations fail
closed.

### Option comparison

| Option | Definition decision |
| --- | --- |
| `OPTION_0` current uppercase NFC identity | Control arm. Deterministic, source-preserving, no new operator, and currently authorized. |
| `OPTION_1` decomposition plus only authorized scholarly quantity marks | Not selected: it requires an explicit mark taxonomy and decomposition policy not present in the current contract. |
| `OPTION_2` explicit Latin macron/breve mapping | Selected as the bounded future candidate only. It is deterministic and narrow, but remains not runtime-authorized pending the frozen authority gate. |
| `OPTION_3` generic Unicode diacritic removal | Rejected. It conflates quantity, phonemic, orthographic, lexical, and transliteration distinctions and creates avoidable truth/collision risk. |
| `OPTION_4` no operator | The required fallback if the authority gate returns `NOT_AUTHORIZED` or `INSUFFICIENT_EVIDENCE`. |

No option grants pronunciation, historical, functional, or semantic authority.

## Collision policy

The procedure reports source-form, retrieval-key, within-language,
cross-language, and within-source-tradition collisions separately. Distinct
source records are never silently deduplicated. One retrieval key may map to
multiple preserved source records; all source forms, citations, glosses,
attestation states, and provenance remain visible. No winner is selected and
`no_single_winner` / `user_decides` remain true.

If the existing candidate representation cannot safely carry a multi-record
collision, that arm is `INVALID`/fail-closed for the bounded measurement; no
record is dropped and no collision policy is invented after results appear.
Empty or unsupported keys fail closed.

For the predeclared aggregate classes, `CLASS_C` requires zero new
retrieval-key collisions in Arm B relative to Arm A, complete source-record
and citation preservation, and all truth gates passing. Any new within-language,
cross-language, or within-source-tradition collision, or any failed truth gate,
is an unacceptable collision/truth risk and makes an otherwise improving Arm B
result `CLASS_D`. Existing collisions are reported and preserved separately.

## Frozen 21-record test set

The exact 21-record identity is stored in the machine-readable procedure. It
contains the existing two Lewis & Short records plus the 19 S1-projected rows.
The current partition is 13 ASCII-compatible lookup keys and 8 scholarly
quantity-mark display keys. The future procedure preserves for every row:
source-record ID, exact source form, current lookup form, proposed key, source
tradition, complete citation identity set, attestation, source status,
transformation, reason, and collision status.

The eight current display keys are `CAERŬLĔUS`, `LĪBERTAS`, `MŪTĀTIŌ`,
`PĀNIS`, `SPĒS`, `VĪSĬO`, `VĬR`, and `ĂQUA`. The 13 current ASCII keys are
`AMO`, `ARBOR`, `ARS`, `CAELUM`, `FAMILIARIS`, `FRANGO`, `MARE`, `NIMBUS`,
`NIX`, `ORDO`, `PELLIS`, `SOMNUS`, and `STELLA`.

## Whole-population paired procedure

The future execution uses the complete existing prepared CMUdict population
(`117389` ordered eligible normalized words) bound to the existing source,
population specification, M7 preparation procedure, exclusion rules, and
ordering. The population fingerprint is the deterministic hash of the frozen
input identity tuple in `procedure.json`; execution must recompute and compare
that tuple before query generation. The tuple materializes `117473` raw
eligible normalized words, the 84 explicit M7 exclusions, the 31 inherited
substrate-derived exclusions, their 109-word union, and the resulting prepared
population fingerprint. No source response, gloss, semantic attractiveness,
known success, target word, or candidate outcome may select or exclude a
population item.

Both arms use the same prepared population, pronunciation/profile eligibility,
structural query generator, structural normalizer, source forms, citations,
exact matching semantics, and exclusions. Raw generated query-key occurrences
must be identical between arms. Arm B may only derive comparison retrieval
keys from those same raw keys and the frozen candidate operator; it may not
change query generation.

Arm A is the current uppercase-NFC lookup representation. Arm B is conditional
on the authority gate returning `AUTHORIZED`; otherwise it is marked
`NOT_AUTHORIZED` and no result artifact is created by this definition lane.

## Predeclared metrics and classes

Metrics are frozen in `procedure.json` before execution, including population
and valid/invalid counts, query-key occurrence and distinct-key counts, current
and candidate Latin key reachability, ASCII/diacritic partitions, input-level
intersections, per-key/per-record counts, collision distributions, reachability
rates/delta, and valid Null count. No metric combines structural reachability
with meaning, function, history, or pronunciation.

The aggregate class is determined mechanically:

* `CLASS_A_NO_LATIN_REACHABILITY_UNDER_EITHER_REPRESENTATION`: neither arm
  reaches a Latin key and Arm B was authorized.
* `CLASS_B_CURRENT_REPRESENTATION_ALREADY_REACHES_LATIN_KEYS_AND_CANONICALIZATION_ADDS_NO_VALUE`:
  Arm A reaches Latin and Arm B adds no new reached Latin key, with no
  unacceptable collision.
* `CLASS_C_CANONICAL_RETRIEVAL_REPRESENTATION_INCREASES_LATIN_KEY_REACHABILITY_WITHOUT_UNACCEPTABLE_COLLISIONS`:
  Arm B reaches more Latin keys than Arm A and collision/truth gates pass.
* `CLASS_D_CANONICALIZATION_INCREASES_REACHABILITY_BUT_CREATES_UNACCEPTABLE_COLLISION_OR_TRUTH_RISK`:
  Arm B adds reachability but any frozen collision/truth gate fails.
* `CLASS_E_OPERATOR_NOT_AUTHORIZED_OR_NOT_SCIENTIFICALLY_DEFENSIBLE`:
  the authority gate is `NOT_AUTHORIZED` or `INSUFFICIENT_EVIDENCE`.
* `CLASS_F_OTHER_PREDECLARED_RESULT`: only a mechanically specified result not
  covered by A–E; no discretionary post-result class is allowed.

`AUTHORITATIVE_EXECUTION_ATTEMPTS_MAX=1`. No adaptive replication, operator
swapping, fixture change, query-generator change, matching change, source-form
change, citation change, exclusion change, or candidate-shopping rerun is
allowed. Infrastructure failure must be distinguished from a completed
scientific attempt under the repository’s existing experiment conventions.

## S4 and v0.2 relationship

This definition does not run S4. A future `CLASS_C` authorizes only a separately
reviewed minimal retrieval-key implementation lane before any S4 decision.
`CLASS_A` or `CLASS_B` sends the project back to bounded v0.2 closure versus
substrate/source architecture review. `CLASS_D` requires collision-safe
architecture review without implementation. `CLASS_E` closes the
canonicalization hypothesis as unsupported for this procedure. No class
automatically acquires sources, adds a language, starts S4, or closes v0.2.

## Frozen status and boundaries

```text
STATUS=DEFINED_NOT_EXECUTED
AUTHORITATIVE_ATTEMPTS=0
RESULT_ARTIFACT_CREATED=NO
S3_RERUN=NO
BROADER_DIAGNOSTIC_RERUN=NO
S4_STARTED=NO
RUNTIME_CANONICALIZATION=NO
CURRENT_MATCHING_CHANGED=NO
SOURCE_ACQUISITION=NO
NEW_LANGUAGE=NO
PRODUCTION_PROMOTION=NO
```

`SOURCE_FORM_MUTATED=NO`, `CITATION_MUTATED=NO`, `GLOSS_MUTATED=NO`,
`ATTESTATION_MUTATED=NO`, `PRONUNCIATION_AUTHORITY_GRANTED=NO`,
`HISTORICAL_EQUIVALENCE_GRANTED=NO`, `FUNCTIONAL_EQUIVALENCE_GRANTED=NO`,
and `SEMANTIC_EQUIVALENCE_GRANTED=NO` are invariant properties of both arms.
