# JO Third-Operator Source-Readiness Decision v0.1

Status: READINESS_DECISION_ONLY.

Project lane:

- Open Instrument / ZË-RO.

## Decision

The evidence result is:

- `JO_STRONGEST_SOURCE_REVIEW_CANDIDATE`.

The authorized next review lane is:

- `DEDICATED_JO_SOURCE_READINESS_REVIEW`.

This decision selects JO only as the strongest candidate for the next
evidence-readiness review.

It does not select JO as:

- a production operator;
- a historical origin;
- an etymological answer;
- a language winner;
- a canonical operator;
- a canon-lock candidate;
- a runtime source.

No source row, runtime owner or governance owner is created by this decision.

## Basis of the evidence ranking

The authoritative-source discovery compared:

- JO;
- PO;
- TERR;
- TER;
- SHTU;
- LIGJ;
- AT;
- ND.

The ranking was based on evidence completeness, not preference, historical
origin or language superiority.

JO currently provides the smallest complete review package among those
candidates.

## Exact JO article identity

Source environment:

- Digitales Philologisch-Etymologisches Wörterbuch des Altalbanischen;
- Ludwig-Maximilians-Universität München.

Exact article head:

- `JO part.`

Exact DPEWA post identifier:

- `25210`

Stable review locator:

- `https://www.dpwa.gwi.uni-muenchen.de/dictionary/?lemmaid=25210`

Retrieved article SHA-256:

- `f482a54f8f5648803b1eb7c91bed1b2013becf894e4d32f80e06f8f134a66a9e`

Article identity validation:

- requested lexical head:
  `JO`;
- returned lexical head:
  `JO`;
- identity match:
  true;
- reconstructed:
  false;
- article status:
  `EXACT_ATTESTED_HEADWORD_ARTICLE`.

The earlier generic `getPostId` resolver was not used as evidence because it
returned substring-related articles with different lexical heads.

The accepted discovery path was:

1. call the DPEWA quick-search endpoint;
2. normalize and verify the first lexical head;
3. take the post ID from that exact row;
4. retrieve the article through `getLemma`;
5. independently verify the returned article head;
6. distinguish attested articles from reconstructed articles.

## Bounded lexical evidence

Article classification:

- `Simplex`.

Bounded lexical meaning:

- no;
- not.

The article supplies uses covering:

- answer-particle refusal;
- rejection;
- contradiction;
- grammatical negation.

This decision does not collapse those uses into one unrestricted runtime
function.

The future review must determine whether the admissible embryo should be
bounded to:

- answer-particle refusal;
- explicit rejection or contradiction;
- general negation;
- or a narrower intersection of these functions.

Until that boundary is accepted, JO is not ready for source-row design.

## Article authority

Named article authors include:

- Bardhyl Demiraj;
- Olav Hackstein.

Article abbreviation identities include:

- BD;
- OH.

First publication:

- 2024.

Modern dictionary reference:

- `FGJSSH 745f.`

The article includes first-attestation material beginning with evidence dated:

- 1497;
- 1555.

Historical material is contextual source evidence only.

It does not establish an Open Instrument claim about:

- historical origin;
- historical transmission;
- borrowing direction;
- earliest absolute origin;
- linguistic ownership;
- language superiority;
- winner status;
- candidate truth.

## Why JO currently ranks ahead of PO

PO has two exact attested articles:

- `PO 1 cnj.`;
- `PO 2`.

Its reviewed grammatical functions include:

- conjunction;
- particle or preverb.

Its reviewed meanings include:

- but;
- however;
- rather;
- yes;
- indeed;
- certainly;
- particle or preverb behavior.

PO therefore has a larger unresolved homonym and grammatical-isolation burden.

JO currently has one principal exact article with a more compact negative or
refusal function.

This is an evidence-readiness distinction only.

It does not declare JO linguistically superior to PO.

## Why JO currently ranks ahead of TERR

TERR has an exact attested noun article meaning:

- darkness;
- obscurity.

TERR is a valid exact lexical identity for later review.

It does not validate the smaller TER identity.

JO currently ranks ahead because it is:

- shorter;
- non-reconstructed;
- independently exact;
- semantically compact;
- represented by one principal article.

No claim is made that JO is historically or linguistically more important than
TERR.

## TER disposition

Two exact TER articles were found.

Their meanings are:

- bull;
- dry or dry out.

Those articles do not support a darkness function.

TER must not inherit the meaning of TERR.

No shortening operation from TERR to TER is authorized.

## SHTU disposition

The exact DPEWA article is:

- `*SHTÚ`.

It is explicitly reconstructed.

Its bounded meaning includes:

- yes;
- indeed;
- in this way.

A reconstructed article cannot be treated as an attested standalone production
embryo without a separate reconstruction-admission policy.

No such policy exists in the current lane.

## LIGJ, AT and ND disposition

The exact DPEWA quick-search review returned no exact lexical head for:

- LIGJ;
- AT;
- ND.

This does not prove that no relevant evidence exists anywhere.

It means only that the reviewed DPEWA endpoint pass did not supply an exact
candidate-specific article for those forms.

## Current production machine truth

The current canonical operators remain:

- DA;
- DI.

The current reviewed production source rows remain:

- `reviewed.external.gheg-da.damage.candidate.v0_1`;
- `reviewed.external.di.knowledge.candidate.v0_1`.

The current canonical profiles remain:

- DA;
- DI.

The current operation policies remain:

- DA;
- DI.

The current carrier policies remain:

- DA;
- DI.

The current canon-lock admission set remains:

- DA;
- DI.

Both current canonical operators remain:

- `canon_locked`.

Their admitted scope remains:

- `bounded_functional_lexical_projection`.

No JO identifier currently exists in any reviewed production owner.

## Existing PO/JO repository material

Repository references to PO and JO already occur in conceptual material,
including:

- polarity descriptions;
- mediator-axis discussion;
- doctrine notes;
- candidate-search artifacts;
- tests and research documents.

Those references are not reviewed production source rows.

They do not automatically authorize:

- a JO source ID;
- a JO runtime projection;
- a JO canonical profile;
- a JO operation policy;
- a JO carrier policy.

The dedicated JO review must isolate the new bounded lexical function from any
existing conceptual PO/JO axis.

## Required dedicated JO review

The next review must define the smallest bounded JO functional embryo.

It must distinguish:

- standalone answer-particle refusal;
- rejection or contradiction;
- sentence-level negation;
- prefix behavior;
- substring coincidence;
- conceptual polarity-axis usage.

The review must produce a proposed proof matrix containing:

### Direct positive controls

Potential direct controls must be justified from the exact standalone function.

No positive word is accepted by this decision.

### Larger-form controls

Larger forms may be proposed only when the source evidence and morphological
relationship justify them.

Substring containment alone is insufficient.

### Cross-operator negative controls

The review must define controls against:

- PO;
- DA;
- DI.

### Unrelated-input controls

The review must define inputs that contain:

- `jo` as an accidental substring;
- neighboring letters without the standalone function;
- unrelated lexical material.

### Operation policy

The review must determine whether JO should allow:

- exact only;
- no transformations;
- or another explicitly reviewed operation.

No operation is admitted by this decision.

### Carrier policy

The review must determine whether the only admissible carrier is:

- `jo`.

No carrier form is admitted by this decision.

### Citation isolation

The review must prove:

- complete JO citation availability;
- partial JO citation rejection;
- no DA citation leakage;
- no DI citation leakage;
- no PO citation leakage.

### Shared architecture

Any future JO implementation must use the existing reusable owners:

1. reviewed source-row registry;
2. evidence validation;
3. functional readiness;
4. machine authorization;
5. production membership;
6. runtime projection;
7. canonical operator profile;
8. operation policy;
9. carrier policy;
10. profile-backed live smoke;
11. canon-lock admission.

A future JO lane must not introduce:

- a bespoke RootMap branch;
- a bespoke API branch;
- a bespoke UI branch;
- a duplicate source registry;
- a duplicate citation registry;
- a hidden polarity-specific runtime path.

## Current blockers

Before source-row design, the following remain unresolved:

- exact bounded functional embryo statement;
- repository polarity and mediator-axis isolation;
- answer-particle versus general-negation boundary;
- operation policy;
- carrier policy;
- positive proof matrix;
- negative-control matrix;
- substring collision matrix;
- prefix collision matrix;
- complete citation-leak controls;
- partial citation-leak controls;
- source snapshot preservation strategy;
- review identity and review date;
- machine-readable source-row design.

Therefore the current status is not:

- `READY_FOR_SOURCE_ROW_DESIGN`;
- `READY_FOR_RUNTIME`;
- `READY_FOR_CANON_LOCK`.

The current status is:

- `READY_FOR_DEDICATED_JO_SOURCE_READINESS_REVIEW`.

## Claim boundaries

This decision does not establish:

- historical origin;
- historical transmission;
- borrowing direction;
- earliest absolute attestation;
- linguistic ownership;
- candidate truth;
- winner status;
- language superiority;
- scientific evidence;
- publication-grade Open Instrument evidence.

User-decision posture remains:

- `user_decides`.

## Explicit non-authorization

This decision does not authorize:

- JO production source-row creation;
- JO functional readiness;
- JO machine authorization;
- JO production membership;
- JO runtime projection;
- JO canonical profile registration;
- JO operation-policy registration;
- JO carrier-policy registration;
- JO live-smoke registration;
- JO canon-lock admission;
- RootMap modification;
- API modification;
- UI modification.

## Result

Evidence result:

- `JO_STRONGEST_SOURCE_REVIEW_CANDIDATE`.

Next accepted lane:

- `DEDICATED_JO_SOURCE_READINESS_REVIEW`.

No production candidate has been promoted.
