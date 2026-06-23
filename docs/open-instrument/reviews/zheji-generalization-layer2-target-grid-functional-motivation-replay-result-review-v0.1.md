# Layer 2 Target-Grid Functional Motivation Replay Result Review v0.1

Status: LAYER2_TARGET_GRID_FUNCTIONAL_MOTIVATION_REPLAY_RESULT_REVIEWED_PARTIAL_INVALIDATED_REPAIR_REQUIRED.

Review date: 2026-06-23.

Reviewed base:

* Short SHA: `a8cbd5f2`
* Full SHA: `a8cbd5f217f381f80200baab5d3efa77766482eb`
* Subject: `test(open-instrument): execute reviewed Layer 2 target-grid functional motivation replay v0.1`

Reviewed artifact:

* Path: `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`
* SHA-256: `3cef1eea4aeb79ead7aa7d0977e26d53ea9fcff3a2d45d1aab6a34288f9072b8`
* Classification: `TARGET_GRID_PARTIAL_INVALIDATED`

## Review decision

The replay artifact is accepted as a faithful execution record.

The replay result is not accepted as a functional motivation signal.

The result is reviewed as `TARGET_GRID_PARTIAL_INVALIDATED`.

No functional embryo should be interpreted from this artifact yet.

No candidate should be promoted.

No result should be treated as an explanation of `comic`.

No rerun is authorized by this review.

## Correct frame

The goal remains motivated meaning decomposition.

The goal is to find whether a word can be decomposed into attested, minimal, functional embryo carriers that motivate the meaning.

The goal is not origin proof.

The goal is not scientific discovery.

The goal is not publication evidence.

The `study` pattern remains the target shape:

* a small embryo carrier like `SHTU`
* a small embryo carrier like `DI`
* a composed meaning-function explanation

But this pattern must not be accepted by backward-fitting glosses.

## Claude / DeepSeek critique accepted

The advisor critique is accepted.

The reframe from origin to functional motivation is correct.

But the evidence standard must not be relaxed.

A candidate can still be a false positive under the functional frame.

Short chunks are high-risk because they can accidentally match many plausible glosses across many languages.

Therefore, future non-null candidates must be stricter than plausibility.

## Required future repair

The next repair must enforce:

### 1. Attested standalone embryo requirement

Every non-null functional embryo candidate must provide an attested isolated standalone form in the carrier language.

Accepted:

* real standalone lexical item
* carrier language stated
* chunk stated
* standalone form stated
* plain standalone gloss stated
* attestation/source status stated as attested

Rejected:

* reasonably inferred only
* constructed root with no standalone attestation
* gloss-only candidate
* language-family handwave
* chunk similarity without standalone form
* model-created embryo

If no attested standalone form exists, the target must return null.

### 2. Non-circular functional gloss requirement

Every non-null candidate must avoid circularity.

Rejected:

* gloss repeats the full word definition
* gloss defines `comic` as comedy-related, funny, humorous, comedian, comic strip, or equivalent without explaining a smaller function
* gloss is only a paraphrase of the whole input word
* candidate meaning is selected only because the final word meaning is already known

Required:

* the embryo gloss must stand on its own
* the embryo gloss must be smaller than the whole-word meaning
* the composed explanation must be built from embryo functions, not copied from the dictionary definition of the input word

### 3. Automated validator requirement

The future implementation should add automated checks before another execution:

* require attestation status for every non-null embryo candidate
* require isolated standalone form for every non-null embryo candidate
* reject `attestationStatus != attested_standalone_form`
* reject missing standalone gloss
* reject circular gloss overlap against full-word definition tokens
* keep existing whole-word anti-tautology checks
* keep existing chunk/language allowlist checks

## Reviewed target grid

The executed target grid was:

* `comic::COM::Albanian`
* `comic::COM::Latin`
* `comic::COM::Greek`
* `comic::COM::Sanskrit`
* `comic::IC::Albanian`
* `comic::IC::Latin`
* `comic::IC::Greek`
* `comic::IC::Sanskrit`

Do not expand the language grid yet.

Do not rerun yet.

## Artifact diagnostic snapshot

Generic diagnostic scan:

* `targetGrid.0.targetStatus`: `pending`
* `targetGrid.1.targetStatus`: `pending`
* `targetGrid.2.targetStatus`: `pending`
* `targetGrid.3.targetStatus`: `pending`
* `targetGrid.4.targetStatus`: `pending`
* `targetGrid.5.targetStatus`: `pending`
* `targetGrid.6.targetStatus`: `pending`
* `targetGrid.7.targetStatus`: `pending`
* `targetResults.0.target.targetStatus`: `pending`
* `targetResults.0.outcomeClassification`: `TARGET_INVALIDATED`
* `targetResults.0.validation.status`: `failed`
* `targetResults.0.validation.errors`: `["response.word must be present", "response.stage must be present", "response.segmentation must be present", "response.chunk must be present", "response.candidateLanguage must be present", "response.nullAccepted must be present", "response.claimBoundary must be present", "response.word must equal target.word", "response.stage must equal target.stage", "response.segmentation must equal target.segmentation", "response.chunk must equal target.chunk", "response.candidateLanguage must equal target.candidateLanguage", "claimBoundary.developmentOnly must be true", "claimBoundary.publicationEvidence m`
* `targetResults.0.response.error`: `JSON object is not valid`
* `targetResults.1.target.targetStatus`: `pending`
* `targetResults.1.outcomeClassification`: `TARGET_INVALIDATED`
* `targetResults.1.validation.status`: `failed`
* `targetResults.1.validation.errors`: `["response.nullAccepted must be present", "response.claimBoundary must be present", "claimBoundary.developmentOnly must be true", "claimBoundary.publicationEvidence must be false", "claimBoundary.originEvidence must be false", "claimBoundary.ownershipEvidence must be false", "claimBoundary.modelQualityEvidence must be false", "claimBoundary.providerOutputCorrectnessEvidence must be false", "claimBoundary.candidateTruthEvidence must be false", "claimBoundary.evidencePromotion must be false", "claimBoundary.winnerCrowned must be false", "response.candidate must be object or null"]`
* `targetResults.2.target.targetStatus`: `pending`
* `targetResults.2.outcomeClassification`: `TARGET_INVALIDATED`
* `targetResults.2.validation.status`: `failed`
* `targetResults.2.validation.errors`: `["response.nullAccepted must be present", "response.claimBoundary must be present", "claimBoundary.developmentOnly must be true", "claimBoundary.publicationEvidence must be false", "claimBoundary.originEvidence must be false", "claimBoundary.ownershipEvidence must be false", "claimBoundary.modelQualityEvidence must be false", "claimBoundary.providerOutputCorrectnessEvidence must be false", "claimBoundary.candidateTruthEvidence must be false", "claimBoundary.evidencePromotion must be false", "claimBoundary.winnerCrowned must be false", "response.candidate must be object or null"]`
* `targetResults.3.target.targetStatus`: `pending`
* `targetResults.3.outcomeClassification`: `TARGET_INVALIDATED`
* `targetResults.3.validation.status`: `failed`
* `targetResults.3.validation.errors`: `["response.word must be present", "response.stage must be present", "response.segmentation must be present", "response.chunk must be present", "response.candidateLanguage must be present", "response.nullAccepted must be present", "response.claimBoundary must be present", "response.word must equal target.word", "response.stage must equal target.stage", "response.segmentation must equal target.segmentation", "response.chunk must equal target.chunk", "response.candidateLanguage must equal target.candidateLanguage", "claimBoundary.developmentOnly must be true", "claimBoundary.publicationEvidence m`
* `targetResults.3.response.error`: `JSON object is not valid`
* `targetResults.4.target.targetStatus`: `pending`
* `targetResults.4.outcomeClassification`: `TARGET_INVALIDATED`
* `targetResults.4.validation.status`: `failed`
* `targetResults.4.validation.errors`: `["response.nullAccepted must be present", "response.claimBoundary must be present", "claimBoundary.developmentOnly must be true", "claimBoundary.publicationEvidence must be false", "claimBoundary.originEvidence must be false", "claimBoundary.ownershipEvidence must be false", "claimBoundary.modelQualityEvidence must be false", "claimBoundary.providerOutputCorrectnessEvidence must be false", "claimBoundary.candidateTruthEvidence must be false", "claimBoundary.evidencePromotion must be false", "claimBoundary.winnerCrowned must be false", "response.candidate must be object or null"]`
* `targetResults.5.target.targetStatus`: `pending`
* `targetResults.5.outcomeClassification`: `TARGET_INVALIDATED`
* `targetResults.5.validation.status`: `failed`
* `targetResults.5.validation.errors`: `["response.nullAccepted must be present", "response.claimBoundary must be present", "claimBoundary.developmentOnly must be true", "claimBoundary.publicationEvidence must be false", "claimBoundary.originEvidence must be false", "claimBoundary.ownershipEvidence must be false", "claimBoundary.modelQualityEvidence must be false", "claimBoundary.providerOutputCorrectnessEvidence must be false", "claimBoundary.candidateTruthEvidence must be false", "claimBoundary.evidencePromotion must be false", "claimBoundary.winnerCrowned must be false", "response.candidate must be object or null"]`
* `targetResults.6.target.targetStatus`: `pending`
* `targetResults.6.outcomeClassification`: `TARGET_INVALIDATED`
* `targetResults.6.validation.status`: `failed`
* `targetResults.6.validation.errors`: `["response.nullAccepted must be present", "response.claimBoundary must be present", "claimBoundary.developmentOnly must be true", "claimBoundary.publicationEvidence must be false", "claimBoundary.originEvidence must be false", "claimBoundary.ownershipEvidence must be false", "claimBoundary.modelQualityEvidence must be false", "claimBoundary.providerOutputCorrectnessEvidence must be false", "claimBoundary.candidateTruthEvidence must be false", "claimBoundary.evidencePromotion must be false", "claimBoundary.winnerCrowned must be false", "response.candidate must be object or null"]`
* `targetResults.7.target.targetStatus`: `pending`
* `targetResults.7.outcomeClassification`: `TARGET_INVALIDATED`
* `targetResults.7.validation.status`: `failed`
* `targetResults.7.validation.errors`: `["response.nullAccepted must be present", "response.claimBoundary must be present", "claimBoundary.developmentOnly must be true", "claimBoundary.publicationEvidence must be false", "claimBoundary.originEvidence must be false", "claimBoundary.ownershipEvidence must be false", "claimBoundary.modelQualityEvidence must be false", "claimBoundary.providerOutputCorrectnessEvidence must be false", "claimBoundary.candidateTruthEvidence must be false", "claimBoundary.evidencePromotion must be false", "claimBoundary.winnerCrowned must be false", "response.candidate must be object or null"]`
* `aggregateClassification`: `TARGET_GRID_PARTIAL_INVALIDATED`
* `scaffoldAggregateClassification`: `TARGET_GRID_PARTIAL_INVALIDATED`

## Boundary

Provider output remains development-only functional motivation observation.

The artifact is not origin evidence.

The artifact is not candidate-truth evidence.

The artifact is not publication evidence.

The artifact is not ownership evidence.

The artifact is not model-quality evidence.

The artifact is not execution-safety evidence.

No evidence promotion occurred in this review.

No publication framing occurred in this review.

No winner-crowning occurred in this review.

## Next accepted task

`docs(open-instrument): define functional embryo attestation and non-circularity repair after partial invalidated replay v0.1`
