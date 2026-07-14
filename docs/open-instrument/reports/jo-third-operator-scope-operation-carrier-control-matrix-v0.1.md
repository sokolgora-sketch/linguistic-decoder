# JO Third-Operator Scope, Operation, Carrier and Control Matrix v0.1

Status: `SCOPE_AND_CONTROL_MATRIX_DESIGN_ONLY`.

Project lane:

- Open Instrument / ZË-RO.

## Input decision

The preceding source-readiness inspection established:

- `READY_FOR_JO_SCOPE_AND_CONTROL_MATRIX_REVIEW`.

The evidence identity remains:

- `EXACT_ATTESTED_HEADWORD_ARTICLE`.

Exact article:

- `JO part.`

Exact DPEWA post identifier:

- `25210`

Stable locator:

- `https://www.dpwa.gwi.uni-muenchen.de/dictionary/?lemmaid=25210`

Reviewed article SHA-256:

- `f482a54f8f5648803b1eb7c91bed1b2013becf894e4d32f80e06f8f134a66a9e`

Source-snapshot status:

- `UNCHANGED_FROM_PR1737_REVIEW`

Current production or governance ownership:

- `JO_PRODUCTION_OR_GOVERNANCE_OWNER=NONE`

## Design result

The smallest proposed functional embryo is:

- `standalone_refusal_or_explicit_rejection`

Human-readable boundary:

- standalone “no” used as an answer, refusal, rejection, or direct
  contradiction.

This is narrower than every use documented by the source article.

The source article also contains grammatical-negation uses, but those broader
uses are excluded from the proposed v0.1 scope.

This design does not treat all occurrences of letters `j` and `o` as JO
evidence.

## Why the narrow scope is preferred

The source directly supports standalone refusal and rejection.

A narrow scope:

- preserves the smallest functional embryo;
- avoids converting every negative construction into JO evidence;
- avoids conflating a lexical particle with a productive prefix;
- avoids substring-based projection;
- reduces collision with existing conceptual PO/JO polarity material;
- remains reversible before production implementation.

The following broader scope is not accepted by this design:

- `general_sentence_level_negation`

The following conceptual scope is not accepted by this design:

- unrestricted negative polarity;
- symbolic opposition to PO;
- every lexical or doctrinal “no” function.

## Proposed operation policy

Proposed operation:

- `exact`

Proposed effective operation list:

- `["exact"]`

Not proposed:

- prefix extraction;
- suffix extraction;
- substring extraction;
- vowel transformation;
- consonant transformation;
- shortening;
- expansion;
- reconstruction;
- cross-form inheritance.

An omitted operation may be interpreted as exact only when the future generic
policy owner confirms that:

- the segment is `jo`;
- the carrier form is `jo`;
- the normalized segment and normalized carrier are identical.

This report does not register that policy in production.

## Proposed carrier policy

Proposed carrier:

- `jo`

Proposed carrier list:

- `["jo"]`

Not proposed as carriers:

- `j`;
- `o`;
- `jo-`;
- `-jo`;
- larger words containing `jo`;
- reconstructed forms;
- PO;
- any conceptual polarity marker.

Substring containment is insufficient.

No larger carrier form is admitted by this report.

## Proposed direct-positive matrix

| ID | Input | Proposed segment | Proposed operation | Proposed carrier | Expected JO evidence | Reason |
|---|---|---|---|---|---|---|
| `JO-P01` | `jo` | `jo` | `exact` | `jo` | present | Exact standalone reviewed form under the proposed narrow refusal/rejection scope |

The positive matrix contains exactly one direct form:

- `jo`

No larger positive proof word is accepted by this design.

Capitalization, punctuation, sentence parsing, and language-specific
normalization remain outside this matrix until separately reviewed.

## Cross-operator negative matrix

| ID | Input | Expected JO evidence | Reason |
|---|---|---|---|
| `JO-N01` | `po` | absent | PO must not satisfy JO |
| `JO-N02` | `da` | absent | DA must not satisfy JO |
| `JO-N03` | `di` | absent | DI must not satisfy JO |

These controls preserve isolation from:

- PO affirmative or conjunction material;
- DA split/divide evidence;
- DI know/knowledge evidence.

## Substring and position-collision matrix

| ID | Input | Collision class | Expected JO evidence | Reason |
|---|---|---|---|---|
| `JO-N04` | `major` | internal contiguous substring | absent | Internal `jo` letters are not standalone JO |
| `JO-N05` | `enjoy` | internal contiguous substring | absent | Internal `jo` letters are not standalone JO |
| `JO-N06` | `joke` | prefix-like material | absent | Initial `jo` is not automatically the reviewed standalone particle |
| `JO-N07` | `joint` | prefix-like material | absent | Initial `jo` is not automatically the reviewed standalone particle |
| `JO-N08` | `banjo` | suffix-like material | absent | Final `jo` is not automatically the reviewed standalone particle |
| `JO-N09` | `judo` | separated `j` and `o` | absent | Non-contiguous letters cannot create JO evidence |

These words are collision controls only.

The report makes no linguistic claim about their historical structure.

## Conceptual-collision matrix

| ID | Input or condition | Expected JO evidence | Reason |
|---|---|---|---|
| `JO-N10` | generic negative-polarity doctrine note | absent | Doctrine is not reviewed lexical evidence |
| `JO-N11` | conceptual PO/JO opposition statement | absent | Conceptual polarity does not create a production source row |
| `JO-N12` | source article discussing general negation only | absent under v0.1 scope | Proposed scope is standalone refusal or explicit rejection |

## Source and citation-isolation matrix

| ID | Evidence condition | Expected result |
|---|---|---|
| `JO-C01` | Exact `JO part.` article, post ID `25210`, accepted snapshot and required metadata | eligible for future source-row review |
| `JO-C02` | Missing post ID | reject |
| `JO-C03` | Wrong post ID | reject |
| `JO-C04` | Wrong returned article head | reject |
| `JO-C05` | Reconstructed article substituted for JO | reject |
| `JO-C06` | Generic DPEWA portal or search page only | reject |
| `JO-C07` | PO article or citation supplied for JO | reject |
| `JO-C08` | DA citation supplied for JO | reject |
| `JO-C09` | DI citation supplied for JO | reject |
| `JO-C10` | Partial JO metadata without exact candidate identity | reject |
| `JO-C11` | Source hash changes while identity fields appear stable | block and require source-field reassessment |

The exact JO package must keep candidate-specific identity.

Institutional portal availability alone is not candidate evidence.

## Required future source-row fields

A future source-row design review must define, without implementing:

- proposed source ID;
- embryo:
  `JO`;
- language:
  `sq`;
- isolated standalone form:
  `jo`;
- bounded lexical function:
  `standalone refusal or explicit rejection`;
- exact article title;
- exact source host;
- exact stable locator;
- exact post identifier;
- reviewed source hash;
- article authors;
- article publication year;
- modern dictionary reference;
- exact attested form;
- exact bounded gloss;
- review identity;
- review date;
- source note;
- claim-boundary fields;
- candidate-specific citation completeness rules.

This report does not create that source row.

## Shared-architecture requirement

Any later JO implementation must reuse the existing generic owners for:

1. reviewed source-row registry;
2. evidence validation;
3. functional readiness;
4. machine authorization;
5. production membership;
6. runtime projection;
7. canonical operator profile;
8. evidence-operation policy;
9. carrier policy;
10. profile-backed live smoke;
11. canon-lock admission.

A later lane must not create:

- a bespoke JO RootMap branch;
- a bespoke JO analyze-v1 branch;
- a bespoke JO UI branch;
- a hidden polarity-specific runtime path;
- a duplicate source registry;
- a duplicate citation registry;
- implicit evidence from repository prose.

## Current machine truth

Current reviewed production operators remain:

- DA;
- DI.

Current canonical profiles remain:

- DA;
- DI.

Current canon-lock admission remains:

- DA;
- DI.

Their canonical lifecycle remains:

- `canon_locked`

JO remains absent from:

- reviewed production source rows;
- functional machine authorization;
- production membership;
- runtime projection;
- canonical profiles;
- evidence-operation policy;
- carrier policy;
- profile-backed live smoke;
- canon-lock admission.

## Claim boundaries

This design does not establish:

- historical origin;
- historical transmission;
- borrowing direction;
- earliest absolute origin;
- linguistic ownership;
- winner status;
- language superiority;
- scientific proof;
- publication-grade Open Instrument proof;
- candidate truth;
- general grammatical-negation ownership.

Historical material remains contextual.

User-decision posture remains:

- `user_decides`

## Explicit non-authorization

This report does not authorize:

- production source-row creation;
- functional machine authorization;
- production membership;
- runtime projection;
- canonical profile registration;
- evidence-operation-policy registration;
- carrier-policy registration;
- live-smoke registration;
- canon-lock admission;
- RootMap modification;
- analyze-v1 modification;
- UI modification.

## Result

Design result:

- `JO_SCOPE_OPERATION_CARRIER_AND_CONTROL_MATRIX_DESIGNED`

Proposed narrow scope:

- `standalone_refusal_or_explicit_rejection`

Proposed operation:

- `exact`

Proposed carrier:

- `jo`

Next accepted review lane:

- `JO_SOURCE_ROW_DESIGN_REVIEW`

Not authorized:

- `JO_SOURCE_ROW_OR_RUNTIME_IMPLEMENTATION`
