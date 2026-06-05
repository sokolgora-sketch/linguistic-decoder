# Open Instrument study segmentation 004 reduced-language llama v0.4 result

Status: validation failure.
Outcome: validation_failure.

## Purpose
Record the reduced-language `llama3.1:8b` capture outcome honestly.

## Target
- word: study
- segmentationId: study.segmentation.004
- chunks: S + TU + DI
- reduced languages: Albanian, Latin, Chinese, Germanic
- model: llama3.1:8b

## Timeout policy
- preflight timeout: 30000 ms
- first capture timeout: 180000 ms
- retry timeout: 300000 ms
- max retries: 1
- policy doc: docs/open-instrument/local-model-timeout-budget-policy-v0.1.md

## Result summary
- parse ok: true
- validation ok: false
- validation issue count: 36
- checked candidates: 3
- checked null candidates: 3
- covered chunks: S, TU, DI
- missing chunks: none

## Metadata contract
- top-level warnings present: yes
- top-level warnings value: []
- top-level claimBoundary present: yes
- claimBoundary object matches the reinforced development-only contract shape

## Validation issues
- INVALID_CANDIDATE_TYPE at chunkCandidates.0.candidateType: candidateType must be one of the allowed Brain candidate types.
- INVALID_EVIDENCE_TYPE at chunkCandidates.0.evidenceType: evidenceType must be one of the allowed Brain evidence types.
- INVALID_FALSE_FRIEND_RISK at chunkCandidates.0.falseFriendRisk: falseFriendRisk must be one of the allowed values.
- INVALID_NULL_CANDIDATE at chunkCandidates.0.candidateType: nullCandidate=true requires candidateType=null_candidate.
- INVALID_NULL_CANDIDATE at chunkCandidates.0.evidenceType: nullCandidate=true requires evidenceType=none.
- INVALID_NULL_CANDIDATE at chunkCandidates.0.falseFriendRisk: nullCandidate=true requires falseFriendRisk=none.
- INVALID_CANDIDATE_TYPE at chunkCandidates.1.candidateType: candidateType must be one of the allowed Brain candidate types.
- INVALID_EVIDENCE_TYPE at chunkCandidates.1.evidenceType: evidenceType must be one of the allowed Brain evidence types.
- INVALID_FALSE_FRIEND_RISK at chunkCandidates.1.falseFriendRisk: falseFriendRisk must be one of the allowed values.
- INVALID_NULL_CANDIDATE at chunkCandidates.1.candidateType: nullCandidate=true requires candidateType=null_candidate.
- INVALID_NULL_CANDIDATE at chunkCandidates.1.evidenceType: nullCandidate=true requires evidenceType=none.
- INVALID_NULL_CANDIDATE at chunkCandidates.1.falseFriendRisk: nullCandidate=true requires falseFriendRisk=none.
- INVALID_CANDIDATE_TYPE at chunkCandidates.2.candidateType: candidateType must be one of the allowed Brain candidate types.
- INVALID_EVIDENCE_TYPE at chunkCandidates.2.evidenceType: evidenceType must be one of the allowed Brain evidence types.
- INVALID_FALSE_FRIEND_RISK at chunkCandidates.2.falseFriendRisk: falseFriendRisk must be one of the allowed values.
- INVALID_NULL_CANDIDATE at chunkCandidates.2.candidateType: nullCandidate=true requires candidateType=null_candidate.
- INVALID_NULL_CANDIDATE at chunkCandidates.2.evidenceType: nullCandidate=true requires evidenceType=none.
- INVALID_NULL_CANDIDATE at chunkCandidates.2.falseFriendRisk: nullCandidate=true requires falseFriendRisk=none.
- INVALID_CANDIDATE_TYPE at nullCandidates.0.candidateType: candidateType must be one of the allowed Brain candidate types.
- INVALID_EVIDENCE_TYPE at nullCandidates.0.evidenceType: evidenceType must be one of the allowed Brain evidence types.
- INVALID_FALSE_FRIEND_RISK at nullCandidates.0.falseFriendRisk: falseFriendRisk must be one of the allowed values.
- INVALID_NULL_CANDIDATE at nullCandidates.0.candidateType: nullCandidate=true requires candidateType=null_candidate.
- INVALID_NULL_CANDIDATE at nullCandidates.0.evidenceType: nullCandidate=true requires evidenceType=none.
- INVALID_NULL_CANDIDATE at nullCandidates.0.falseFriendRisk: nullCandidate=true requires falseFriendRisk=none.
- INVALID_CANDIDATE_TYPE at nullCandidates.1.candidateType: candidateType must be one of the allowed Brain candidate types.
- INVALID_EVIDENCE_TYPE at nullCandidates.1.evidenceType: evidenceType must be one of the allowed Brain evidence types.
- INVALID_FALSE_FRIEND_RISK at nullCandidates.1.falseFriendRisk: falseFriendRisk must be one of the allowed values.
- INVALID_NULL_CANDIDATE at nullCandidates.1.candidateType: nullCandidate=true requires candidateType=null_candidate.
- INVALID_NULL_CANDIDATE at nullCandidates.1.evidenceType: nullCandidate=true requires evidenceType=none.
- INVALID_NULL_CANDIDATE at nullCandidates.1.falseFriendRisk: nullCandidate=true requires falseFriendRisk=none.
- INVALID_CANDIDATE_TYPE at nullCandidates.2.candidateType: candidateType must be one of the allowed Brain candidate types.
- INVALID_EVIDENCE_TYPE at nullCandidates.2.evidenceType: evidenceType must be one of the allowed Brain evidence types.
- INVALID_FALSE_FRIEND_RISK at nullCandidates.2.falseFriendRisk: falseFriendRisk must be one of the allowed values.
- INVALID_NULL_CANDIDATE at nullCandidates.2.candidateType: nullCandidate=true requires candidateType=null_candidate.
- INVALID_NULL_CANDIDATE at nullCandidates.2.evidenceType: nullCandidate=true requires evidenceType=none.
- INVALID_NULL_CANDIDATE at nullCandidates.2.falseFriendRisk: nullCandidate=true requires falseFriendRisk=none.

## Comparison
- previous llama v0.1 review: docs/open-instrument/study-segmentation-004-reduced-language-llama-result-review-v0.1.md
- previous llama v0.2 review: docs/open-instrument/study-segmentation-004-reduced-language-llama-v0.2-result-review-v0.1.md
- previous llama v0.3 review: docs/open-instrument/study-segmentation-004-reduced-language-llama-v0.3-result-review-v0.1.md
- previous Qwen timeout review: docs/open-instrument/study-segmentation-004-reduced-language-timeout-review-v0.1.md
- metadata reinforcement PR: #1201

## Claim boundary
This is development evidence only. It is not scientific evidence, publication evidence, eval evidence, Cohort evidence, or model-quality proof.

## Next action
Reinforce the remaining top-level Brain contract miss and decide whether another retry is justified.
