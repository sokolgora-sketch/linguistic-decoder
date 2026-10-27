/**
 * Research Hypothesis Manifest v0.1.
 *
 * This is a typed, research-only assertion lane. It preserves researcher
 * hypotheses separately from source facts, ontology observations, and the
 * reviewed production AGENT authorization path.
 */

export const RESEARCH_HYPOTHESIS_MANIFEST_SCHEMA_V0_1 =
  "open-instrument.research-hypothesis-manifest.v0_1" as const;

export const RESEARCH_HYPOTHESIS_CLAIM_BOUNDARY_V0_1 =
  "research_only_not_production_authorization" as const;

export const RESEARCH_HYPOTHESIS_PRODUCTION_AUTHORIZATION_V0_1 =
  "NOT_AUTHORIZED" as const;

export const RESEARCH_HYPOTHESIS_HISTORICAL_RELATION_V0_1 =
  "NOT_CLAIMED" as const;

export const RESEARCH_HYPOTHESIS_WINNER_CLAIM_V0_1 =
  "NOT_CLAIMED" as const;

export type ResearchHypothesisStatusV0_1 =
  | "PROPOSED_NOT_REVIEWED"
  | "REVIEWED"
  | "REVIEWED_ALIGNED_AI_OWNER_APPROVED"
  | "REVIEWED_ALIGNED_HUMAN_OWNER_APPROVED"
  | "REJECTED"
  | "UNRESOLVED";

export type ResearchHypothesisReviewTrackV0_1 =
  | "AI_REVIEW"
  | "HUMAN_REVIEW"
  | "NONE";

export type ResearchHypothesisEvidenceAuthorityV0_1 =
  | "SOURCE_ATTESTED"
  | "ONTOLOGY_SUPPORTED"
  | "RESEARCHER_PROPOSED"
  | "UNRESOLVED";

export type ResearchHypothesisSemanticRoleV0_1 =
  | "OCCUPATIONAL_ROLE";

export type ResearchHypothesisEvidenceRefV0_1 = Readonly<{
  evidenceId: string;
  authority: Exclude<
    ResearchHypothesisEvidenceAuthorityV0_1,
    "RESEARCHER_PROPOSED"
  >;
  sourceProfileId: string;
  sourceArtifactSha256: string;
  sourceRecordId: string;
  senseId?: string;
  locator: string;
  note: string;
}>;

export type ResearchHypothesisReviewRationaleProvenanceV0_1 = Readonly<{
  sourceKind: "AUDIT_TRAIL";
  sourceRef: string;
}>;

export type ResearchHypothesisReviewRationaleV0_1 = Readonly<{
  reviewerId: string;
  reviewerKind: "AI" | "HUMAN";
  rationale: string;
  evidenceRefs: readonly string[];
  recordedAt: string;
  recordedBeforePeerExposure: true;
  provenance: ResearchHypothesisReviewRationaleProvenanceV0_1;
}>;

export type ResearchHypothesisReviewCandidateV0_1 = Readonly<{
  status: "PRE_APPROVAL_CANDIDATE_RATIONALE";
  reviewTrack: "AI_REVIEW" | "HUMAN_REVIEW";
  reviewerRecords: readonly [
    ResearchHypothesisReviewRationaleV0_1,
    ResearchHypothesisReviewRationaleV0_1,
  ];
}>;

export type ResearchHypothesisOwnerApprovalV0_1 = Readonly<{
  status: "APPROVED";
  ownerId: string;
  approvedAt: string;
  approvalRef: string;
}>;

export type ResearchHypothesisAssertionV0_1 = Readonly<{
  schemaVersion: typeof RESEARCH_HYPOTHESIS_MANIFEST_SCHEMA_V0_1;
  hypothesisId: string;
  sourceProfileId: string;
  sourceArtifactSha256: string;
  sourceRecordId: string;
  senseId: string;
  targetLemma: string;
  baseLemma: string;
  proposedSemanticRole: ResearchHypothesisSemanticRoleV0_1;
  hypothesisStatus: ResearchHypothesisStatusV0_1;
  assertionAuthor: string;
  assertionDate: string;
  evidenceRefs: readonly string[];
  evidenceAuthority: ResearchHypothesisEvidenceAuthorityV0_1;
  reasonCodes: readonly string[];
  claimBoundary: typeof RESEARCH_HYPOTHESIS_CLAIM_BOUNDARY_V0_1;
  reviewTrack: ResearchHypothesisReviewTrackV0_1;
  reviewCandidate: ResearchHypothesisReviewCandidateV0_1 | null;
  ownerApproval: ResearchHypothesisOwnerApprovalV0_1 | null;
}>;

export type ResearchHypothesisManifestV0_1 = Readonly<{
  schemaVersion: typeof RESEARCH_HYPOTHESIS_MANIFEST_SCHEMA_V0_1;
  manifestId: string;
  evidence: readonly ResearchHypothesisEvidenceRefV0_1[];
  assertions: readonly ResearchHypothesisAssertionV0_1[];
}>;

export type ResearchHypothesisCandidateEvidenceV0_1 = Readonly<{
  candidateId: string;
  sourceKind: "research_hypothesis_manifest";
  sourceStatus: "research_candidate";
  admissionScope: "research_hypothesis_only";
  sourceProfileId: string;
  sourceArtifactSha256: string;
  sourceRecordId: string;
  senseId: string;
  targetLemma: string;
  baseLemma: string;
  proposedSemanticRole: ResearchHypothesisSemanticRoleV0_1;
  hypothesisStatus: ResearchHypothesisStatusV0_1;
  evidenceRefs: readonly string[];
  evidenceAuthority: ResearchHypothesisEvidenceAuthorityV0_1;
  reasonCodes: readonly string[];
  claimBoundary: typeof RESEARCH_HYPOTHESIS_CLAIM_BOUNDARY_V0_1;
  reviewTrack: ResearchHypothesisReviewTrackV0_1;
  reviewCandidate: ResearchHypothesisReviewCandidateV0_1 | null;
  ownerApproval: ResearchHypothesisOwnerApprovalV0_1 | null;
  productionAuthorization: typeof RESEARCH_HYPOTHESIS_PRODUCTION_AUTHORIZATION_V0_1;
  functionalOperation: null;
  embryoFunction: "UNKNOWN_OR_NULL";
  historicalRelation: typeof RESEARCH_HYPOTHESIS_HISTORICAL_RELATION_V0_1;
  winnerClaim: typeof RESEARCH_HYPOTHESIS_WINNER_CLAIM_V0_1;
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
}>;

export type ParseResearchHypothesisManifestResultV0_1 =
  | Readonly<{
      ok: true;
      manifest: ResearchHypothesisManifestV0_1;
    }>
  | Readonly<{
      ok: false;
      reasonCodes: readonly string[];
    }>;

type UnknownRecordV0_1 = Record<string, unknown>;

function isRecordV0_1(value: unknown): value is UnknownRecordV0_1 {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function textV0_1(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.normalize("NFC").trim();
  return normalized || null;
}

function sha256V0_1(value: unknown): string | null {
  const normalized = textV0_1(value);
  return normalized && /^[a-f0-9]{64}$/i.test(normalized)
    ? normalized.toLowerCase()
    : null;
}

function dateV0_1(value: unknown): string | null {
  const normalized = textV0_1(value);
  return normalized && /^\d{4}-\d{2}-\d{2}$/.test(normalized)
    ? normalized
    : null;
}

function dateTimeV0_1(value: unknown): string | null {
  const normalized = textV0_1(value);
  if (
    !normalized ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(normalized)
  ) {
    return null;
  }
  return normalized;
}

function uniqueStringsV0_1(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const normalized = value.map(textV0_1);
  if (normalized.some((item) => item === null)) return null;
  const result = normalized as string[];
  return result.length > 0 && new Set(result).size === result.length
    ? result
    : null;
}

function allowedEvidenceAuthorityV0_1(
  value: unknown,
): value is ResearchHypothesisEvidenceAuthorityV0_1 {
  return (
    value === "SOURCE_ATTESTED" ||
    value === "ONTOLOGY_SUPPORTED" ||
    value === "RESEARCHER_PROPOSED" ||
    value === "UNRESOLVED"
  );
}

function allowedEvidenceRefAuthorityV0_1(
  value: unknown,
): value is ResearchHypothesisEvidenceRefV0_1["authority"] {
  return (
    value === "SOURCE_ATTESTED" ||
    value === "ONTOLOGY_SUPPORTED" ||
    value === "UNRESOLVED"
  );
}

function allowedStatusV0_1(
  value: unknown,
): value is ResearchHypothesisStatusV0_1 {
  return (
    value === "PROPOSED_NOT_REVIEWED" ||
    value === "REVIEWED" ||
    value === "REVIEWED_ALIGNED_AI_OWNER_APPROVED" ||
    value === "REVIEWED_ALIGNED_HUMAN_OWNER_APPROVED" ||
    value === "REJECTED" ||
    value === "UNRESOLVED"
  );
}

function allowedReviewTrackV0_1(
  value: unknown,
): value is ResearchHypothesisReviewTrackV0_1 {
  return value === "AI_REVIEW" || value === "HUMAN_REVIEW" || value === "NONE";
}

function terminalReviewTrackV0_1(
  value: ResearchHypothesisStatusV0_1,
): "AI_REVIEW" | "HUMAN_REVIEW" | null {
  if (value === "REVIEWED_ALIGNED_AI_OWNER_APPROVED") return "AI_REVIEW";
  if (value === "REVIEWED_ALIGNED_HUMAN_OWNER_APPROVED") {
    return "HUMAN_REVIEW";
  }
  return null;
}

function parseOwnerApprovalV0_1(
  value: unknown,
  index: number,
  reasonCodes: string[],
): ResearchHypothesisOwnerApprovalV0_1 | null {
  if (value === undefined || value === null) return null;
  if (!isRecordV0_1(value)) {
    reasonCodes.push(`ASSERTION_${index}_OWNER_APPROVAL_NOT_OBJECT`);
    return null;
  }

  const ownerId = textV0_1(value.ownerId);
  const approvedAt = dateTimeV0_1(value.approvedAt);
  const approvalRef = textV0_1(value.approvalRef);

  if (value.status !== "APPROVED") {
    reasonCodes.push(`ASSERTION_${index}_OWNER_APPROVAL_STATUS_INVALID`);
  }
  if (!ownerId) reasonCodes.push(`ASSERTION_${index}_OWNER_ID_REQUIRED`);
  if (!approvedAt) {
    reasonCodes.push(`ASSERTION_${index}_OWNER_APPROVED_AT_INVALID`);
  }
  if (!approvalRef) {
    reasonCodes.push(`ASSERTION_${index}_OWNER_APPROVAL_REF_REQUIRED`);
  }

  if (
    value.status !== "APPROVED" ||
    !ownerId ||
    !approvedAt ||
    !approvalRef
  ) {
    return null;
  }

  return { status: "APPROVED", ownerId, approvedAt, approvalRef };
}

function parseReviewCandidateV0_1(
  value: unknown,
  index: number,
  evidenceById: ReadonlyMap<string, ResearchHypothesisEvidenceRefV0_1>,
  assertionEvidenceRefs: readonly string[] | null,
  reasonCodes: string[],
): ResearchHypothesisReviewCandidateV0_1 | null {
  if (value === undefined || value === null) return null;
  if (!isRecordV0_1(value)) {
    reasonCodes.push(`ASSERTION_${index}_REVIEW_CANDIDATE_NOT_OBJECT`);
    return null;
  }

  const reviewTrack = value.reviewTrack;
  const candidateTrack =
    reviewTrack === "AI_REVIEW" || reviewTrack === "HUMAN_REVIEW"
      ? reviewTrack
      : null;
  const rawReviewerRecords = value.reviewerRecords;
  if (value.status !== "PRE_APPROVAL_CANDIDATE_RATIONALE") {
    reasonCodes.push(`ASSERTION_${index}_REVIEW_CANDIDATE_STATUS_INVALID`);
  }
  if (candidateTrack === null) {
    reasonCodes.push(`ASSERTION_${index}_REVIEW_CANDIDATE_TRACK_INVALID`);
  }
  if (!Array.isArray(rawReviewerRecords) || rawReviewerRecords.length !== 2) {
    reasonCodes.push(`ASSERTION_${index}_REVIEW_CANDIDATE_REVIEWERS_INVALID`);
  }

  const parsedRecords = (
    Array.isArray(rawReviewerRecords) ? rawReviewerRecords : []
  ).map<ResearchHypothesisReviewRationaleV0_1 | null>(
    (rawRecord, reviewerIndex) => {
    if (!isRecordV0_1(rawRecord)) {
      reasonCodes.push(
        `ASSERTION_${index}_REVIEWER_${reviewerIndex}_NOT_OBJECT`,
      );
      return null;
    }

    const reviewerId = textV0_1(rawRecord.reviewerId);
    const reviewerKind = rawRecord.reviewerKind;
    const parsedReviewerKind =
      reviewerKind === "AI" || reviewerKind === "HUMAN"
        ? reviewerKind
        : null;
    const rationale = textV0_1(rawRecord.rationale);
    const evidenceRefs = uniqueStringsV0_1(rawRecord.evidenceRefs);
    const recordedAt = dateTimeV0_1(rawRecord.recordedAt);
    const provenance = isRecordV0_1(rawRecord.provenance)
      ? rawRecord.provenance
      : null;
    const sourceRef = textV0_1(provenance?.sourceRef);

    if (!reviewerId) {
      reasonCodes.push(
        `ASSERTION_${index}_REVIEWER_${reviewerIndex}_ID_REQUIRED`,
      );
    }
    if (parsedReviewerKind === null) {
      reasonCodes.push(
        `ASSERTION_${index}_REVIEWER_${reviewerIndex}_KIND_INVALID`,
      );
    }
    if (!rationale) {
      reasonCodes.push(
        `ASSERTION_${index}_REVIEWER_${reviewerIndex}_RATIONALE_REQUIRED`,
      );
    }
    if (!evidenceRefs) {
      reasonCodes.push(
        `ASSERTION_${index}_REVIEWER_${reviewerIndex}_EVIDENCE_REFS_INVALID`,
      );
    }
    if (!recordedAt) {
      reasonCodes.push(
        `ASSERTION_${index}_REVIEWER_${reviewerIndex}_RECORDED_AT_INVALID`,
      );
    }
    if (rawRecord.recordedBeforePeerExposure !== true) {
      reasonCodes.push(
        `ASSERTION_${index}_REVIEWER_${reviewerIndex}_INDEPENDENCE_REQUIRED`,
      );
    }
    if (provenance?.sourceKind !== "AUDIT_TRAIL" || !sourceRef) {
      reasonCodes.push(
        `ASSERTION_${index}_REVIEWER_${reviewerIndex}_PROVENANCE_INVALID`,
      );
    }

    if (
      !reviewerId ||
      parsedReviewerKind === null ||
      !rationale ||
      !evidenceRefs ||
      !recordedAt ||
      rawRecord.recordedBeforePeerExposure !== true ||
      provenance?.sourceKind !== "AUDIT_TRAIL" ||
      !sourceRef
    ) {
      return null;
    }

    for (const evidenceRef of evidenceRefs) {
      if (!evidenceById.has(evidenceRef)) {
        reasonCodes.push(
          `ASSERTION_${index}_REVIEWER_${reviewerIndex}_EVIDENCE_REF_MISSING:${evidenceRef}`,
        );
      }
      if (!assertionEvidenceRefs?.includes(evidenceRef)) {
        reasonCodes.push(
          `ASSERTION_${index}_REVIEWER_${reviewerIndex}_EVIDENCE_REF_NOT_BOUND:${evidenceRef}`,
        );
      }
    }

      return {
        reviewerId,
        reviewerKind: parsedReviewerKind,
        rationale,
        evidenceRefs,
        recordedAt,
        recordedBeforePeerExposure: true,
        provenance: { sourceKind: "AUDIT_TRAIL", sourceRef },
      };
    },
  );

  const records = parsedRecords.filter(
    (record): record is ResearchHypothesisReviewRationaleV0_1 =>
      record !== null,
  );
  if (records.length === 2) {
    if (new Set(records.map((record) => record.reviewerId)).size !== 2) {
      reasonCodes.push(`ASSERTION_${index}_REVIEWER_IDS_NOT_DISTINCT`);
    }
    if (new Set(records.map((record) => record.provenance.sourceRef)).size !== 2) {
      reasonCodes.push(`ASSERTION_${index}_REVIEWER_PROVENANCE_NOT_DISTINCT`);
    }
    if (candidateTrack === "AI_REVIEW") {
      const reviewerIds = new Set(records.map((record) => record.reviewerId));
      if (
        records.some((record) => record.reviewerKind !== "AI") ||
        reviewerIds.size !== 2 ||
        !reviewerIds.has("ChatGPT") ||
        !reviewerIds.has("DeepSeek")
      ) {
        reasonCodes.push(`ASSERTION_${index}_AI_REVIEWER_SET_INVALID`);
      }
    }
    if (
      candidateTrack === "HUMAN_REVIEW" &&
      records.some((record) => record.reviewerKind !== "HUMAN")
    ) {
      reasonCodes.push(`ASSERTION_${index}_HUMAN_REVIEWER_SET_INVALID`);
    }
  }

  if (
    value.status !== "PRE_APPROVAL_CANDIDATE_RATIONALE" ||
    candidateTrack === null ||
    !Array.isArray(rawReviewerRecords) ||
    rawReviewerRecords.length !== 2 ||
    records.length !== 2
  ) {
    return null;
  }

  return {
    status: "PRE_APPROVAL_CANDIDATE_RATIONALE",
    reviewTrack: candidateTrack,
    reviewerRecords: [records[0], records[1]],
  };
}

function parseEvidenceRefV0_1(
  value: unknown,
  index: number,
  reasonCodes: string[],
): ResearchHypothesisEvidenceRefV0_1 | null {
  if (!isRecordV0_1(value)) {
    reasonCodes.push(`EVIDENCE_REF_${index}_NOT_OBJECT`);
    return null;
  }

  const evidenceId = textV0_1(value.evidenceId);
  const sourceProfileId = textV0_1(value.sourceProfileId);
  const sourceArtifactSha256 = sha256V0_1(value.sourceArtifactSha256);
  const sourceRecordId = textV0_1(value.sourceRecordId);
  const senseId = textV0_1(value.senseId);
  const locator = textV0_1(value.locator);
  const note = textV0_1(value.note);

  if (!evidenceId) reasonCodes.push(`EVIDENCE_REF_${index}_ID_REQUIRED`);
  if (!allowedEvidenceRefAuthorityV0_1(value.authority)) {
    reasonCodes.push(`EVIDENCE_REF_${index}_AUTHORITY_INVALID`);
  }
  if (!sourceProfileId) reasonCodes.push(`EVIDENCE_REF_${index}_PROFILE_REQUIRED`);
  if (!sourceArtifactSha256) reasonCodes.push(`EVIDENCE_REF_${index}_SHA256_INVALID`);
  if (!sourceRecordId) reasonCodes.push(`EVIDENCE_REF_${index}_RECORD_REQUIRED`);
  if (!locator) reasonCodes.push(`EVIDENCE_REF_${index}_LOCATOR_REQUIRED`);
  if (!note) reasonCodes.push(`EVIDENCE_REF_${index}_NOTE_REQUIRED`);

  if (
    !evidenceId ||
    !allowedEvidenceRefAuthorityV0_1(value.authority) ||
    !sourceProfileId ||
    !sourceArtifactSha256 ||
    !sourceRecordId ||
    !locator ||
    !note
  ) {
    return null;
  }

  return {
    evidenceId,
    authority: value.authority,
    sourceProfileId,
    sourceArtifactSha256,
    sourceRecordId,
    ...(senseId ? { senseId } : {}),
    locator,
    note,
  };
}

function parseAssertionV0_1(
  value: unknown,
  index: number,
  evidenceById: ReadonlyMap<string, ResearchHypothesisEvidenceRefV0_1>,
  reasonCodes: string[],
): ResearchHypothesisAssertionV0_1 | null {
  if (!isRecordV0_1(value)) {
    reasonCodes.push(`ASSERTION_${index}_NOT_OBJECT`);
    return null;
  }

  const schemaVersion = value.schemaVersion;
  const hypothesisId = textV0_1(value.hypothesisId);
  const sourceProfileId = textV0_1(value.sourceProfileId);
  const sourceArtifactSha256 = sha256V0_1(value.sourceArtifactSha256);
  const sourceRecordId = textV0_1(value.sourceRecordId);
  const senseId = textV0_1(value.senseId);
  const targetLemma = textV0_1(value.targetLemma);
  const baseLemma = textV0_1(value.baseLemma);
  const assertionAuthor = textV0_1(value.assertionAuthor);
  const assertionDate = dateV0_1(value.assertionDate);
  const evidenceRefs = uniqueStringsV0_1(value.evidenceRefs);
  const reasonList = uniqueStringsV0_1(value.reasonCodes);
  const reviewTrack =
    value.reviewTrack === undefined
      ? "NONE"
      : allowedReviewTrackV0_1(value.reviewTrack)
        ? value.reviewTrack
        : null;

  if (schemaVersion !== RESEARCH_HYPOTHESIS_MANIFEST_SCHEMA_V0_1) {
    reasonCodes.push(`ASSERTION_${index}_SCHEMA_VERSION_INVALID`);
  }
  if (!hypothesisId) reasonCodes.push(`ASSERTION_${index}_ID_REQUIRED`);
  if (!sourceProfileId) reasonCodes.push(`ASSERTION_${index}_PROFILE_REQUIRED`);
  if (!sourceArtifactSha256) reasonCodes.push(`ASSERTION_${index}_SHA256_INVALID`);
  if (!sourceRecordId) reasonCodes.push(`ASSERTION_${index}_RECORD_REQUIRED`);
  if (!senseId) reasonCodes.push(`ASSERTION_${index}_SENSE_REQUIRED`);
  if (!targetLemma) reasonCodes.push(`ASSERTION_${index}_TARGET_REQUIRED`);
  if (!baseLemma) reasonCodes.push(`ASSERTION_${index}_BASE_REQUIRED`);
  if (value.proposedSemanticRole !== "OCCUPATIONAL_ROLE") {
    reasonCodes.push(`ASSERTION_${index}_ROLE_INVALID`);
  }
  if (!allowedStatusV0_1(value.hypothesisStatus)) {
    reasonCodes.push(`ASSERTION_${index}_STATUS_INVALID`);
  }
  if (!assertionAuthor) reasonCodes.push(`ASSERTION_${index}_AUTHOR_REQUIRED`);
  if (!assertionDate) reasonCodes.push(`ASSERTION_${index}_DATE_INVALID`);
  if (!evidenceRefs) reasonCodes.push(`ASSERTION_${index}_EVIDENCE_REFS_INVALID`);
  if (!allowedEvidenceAuthorityV0_1(value.evidenceAuthority)) {
    reasonCodes.push(`ASSERTION_${index}_EVIDENCE_AUTHORITY_INVALID`);
  }
  if (!reasonList) reasonCodes.push(`ASSERTION_${index}_REASON_CODES_INVALID`);
  if (value.claimBoundary !== RESEARCH_HYPOTHESIS_CLAIM_BOUNDARY_V0_1) {
    reasonCodes.push(`ASSERTION_${index}_CLAIM_BOUNDARY_INVALID`);
  }
  if (reviewTrack === null) {
    reasonCodes.push(`ASSERTION_${index}_REVIEW_TRACK_INVALID`);
  }

  if (
    !hypothesisId ||
    !sourceProfileId ||
    !sourceArtifactSha256 ||
    !sourceRecordId ||
    !senseId ||
    !targetLemma ||
    !baseLemma ||
    value.proposedSemanticRole !== "OCCUPATIONAL_ROLE" ||
    !allowedStatusV0_1(value.hypothesisStatus) ||
    !assertionAuthor ||
    !assertionDate ||
    !evidenceRefs ||
    !allowedEvidenceAuthorityV0_1(value.evidenceAuthority) ||
    !reasonList ||
    value.claimBoundary !== RESEARCH_HYPOTHESIS_CLAIM_BOUNDARY_V0_1 ||
    reviewTrack === null
  ) {
    return null;
  }

  for (const ref of evidenceRefs) {
    if (!evidenceById.has(ref)) {
      reasonCodes.push(`ASSERTION_${index}_EVIDENCE_REF_MISSING:${ref}`);
    }
  }

  const sourceIdentityMatched = evidenceRefs.some((ref) => {
    const evidence = evidenceById.get(ref);
    return (
      evidence?.authority === "SOURCE_ATTESTED" &&
      evidence.sourceProfileId === sourceProfileId &&
      evidence.sourceArtifactSha256 === sourceArtifactSha256 &&
      evidence.sourceRecordId === sourceRecordId &&
      evidence.senseId === senseId
    );
  });
  if (!sourceIdentityMatched) {
    reasonCodes.push(`ASSERTION_${index}_SOURCE_IDENTITY_MISMATCH`);
  }

  const reviewCandidate = parseReviewCandidateV0_1(
    value.reviewCandidate,
    index,
    evidenceById,
    evidenceRefs,
    reasonCodes,
  );
  const ownerApproval = parseOwnerApprovalV0_1(
    value.ownerApproval,
    index,
    reasonCodes,
  );
  const terminalTrack = terminalReviewTrackV0_1(value.hypothesisStatus);

  if (terminalTrack) {
    if (reasonList.includes("REVIEWER_DISAGREEMENT_RETAINED_UNRESOLVED")) {
      reasonCodes.push(`ASSERTION_${index}_TERMINAL_REVIEW_DISAGREEMENT`);
    }
    if (reviewTrack !== terminalTrack) {
      reasonCodes.push(`ASSERTION_${index}_TERMINAL_REVIEW_TRACK_MISMATCH`);
    }
    if (!reviewCandidate) {
      reasonCodes.push(`ASSERTION_${index}_TERMINAL_REVIEW_CANDIDATE_REQUIRED`);
    } else if (reviewCandidate.reviewTrack !== terminalTrack) {
      reasonCodes.push(`ASSERTION_${index}_TERMINAL_CANDIDATE_TRACK_MISMATCH`);
    }
    if (!ownerApproval) {
      reasonCodes.push(`ASSERTION_${index}_TERMINAL_OWNER_APPROVAL_REQUIRED`);
    }
  } else {
    if (reviewTrack !== "NONE") {
      reasonCodes.push(`ASSERTION_${index}_NONTERMINAL_REVIEW_TRACK_ACTIVE`);
    }
    if (ownerApproval) {
      reasonCodes.push(`ASSERTION_${index}_NONTERMINAL_OWNER_APPROVAL_FORBIDDEN`);
    }
  }

  return {
    schemaVersion: RESEARCH_HYPOTHESIS_MANIFEST_SCHEMA_V0_1,
    hypothesisId,
    sourceProfileId,
    sourceArtifactSha256,
    sourceRecordId,
    senseId,
    targetLemma,
    baseLemma,
    proposedSemanticRole: "OCCUPATIONAL_ROLE",
    hypothesisStatus: value.hypothesisStatus,
    assertionAuthor,
    assertionDate,
    evidenceRefs,
    evidenceAuthority: value.evidenceAuthority,
    reasonCodes: reasonList,
    claimBoundary: RESEARCH_HYPOTHESIS_CLAIM_BOUNDARY_V0_1,
    reviewTrack,
    reviewCandidate,
    ownerApproval,
  };
}

export function parseResearchHypothesisManifestV0_1(
  value: unknown,
): ParseResearchHypothesisManifestResultV0_1 {
  const reasonCodes: string[] = [];

  if (!isRecordV0_1(value)) {
    return { ok: false, reasonCodes: ["MANIFEST_NOT_OBJECT"] };
  }

  if (value.schemaVersion !== RESEARCH_HYPOTHESIS_MANIFEST_SCHEMA_V0_1) {
    reasonCodes.push("MANIFEST_SCHEMA_VERSION_INVALID");
  }

  const manifestId = textV0_1(value.manifestId);
  if (!manifestId) reasonCodes.push("MANIFEST_ID_REQUIRED");

  const rawEvidence = value.evidence;
  const evidence = Array.isArray(rawEvidence)
    ? rawEvidence
        .map((item, index) => parseEvidenceRefV0_1(item, index, reasonCodes))
        .filter((item): item is ResearchHypothesisEvidenceRefV0_1 => item !== null)
    : null;
  if (!evidence) reasonCodes.push("MANIFEST_EVIDENCE_REQUIRED");

  const evidenceById = new Map(
    (evidence ?? []).map((item) => [item.evidenceId, item]),
  );
  if (evidenceById.size !== (evidence ?? []).length) {
    reasonCodes.push("DUPLICATE_EVIDENCE_ID");
  }

  const rawAssertions = value.assertions;
  const assertions = Array.isArray(rawAssertions)
    ? rawAssertions
        .map((item, index) =>
          parseAssertionV0_1(item, index, evidenceById, reasonCodes),
        )
        .filter((item): item is ResearchHypothesisAssertionV0_1 => item !== null)
    : null;
  if (!assertions) reasonCodes.push("MANIFEST_ASSERTIONS_REQUIRED");

  const hypothesisIds = (assertions ?? []).map((item) => item.hypothesisId);
  if (new Set(hypothesisIds).size !== hypothesisIds.length) {
    reasonCodes.push("DUPLICATE_HYPOTHESIS_ID");
  }

  if (reasonCodes.length > 0) {
    return { ok: false, reasonCodes: [...new Set(reasonCodes)].sort() };
  }

  return {
    ok: true,
    manifest: {
      schemaVersion: RESEARCH_HYPOTHESIS_MANIFEST_SCHEMA_V0_1,
      manifestId: manifestId!,
      evidence: evidence!,
      assertions: assertions!,
    },
  };
}

export function projectResearchHypothesisManifestToCandidateEvidenceV0_1(
  manifest: ResearchHypothesisManifestV0_1,
): readonly ResearchHypothesisCandidateEvidenceV0_1[] {
  return manifest.assertions.map((assertion) => ({
    candidateId: `research-hypothesis:${assertion.hypothesisId}`,
    sourceKind: "research_hypothesis_manifest",
    sourceStatus: "research_candidate",
    admissionScope: "research_hypothesis_only",
    sourceProfileId: assertion.sourceProfileId,
    sourceArtifactSha256: assertion.sourceArtifactSha256,
    sourceRecordId: assertion.sourceRecordId,
    senseId: assertion.senseId,
    targetLemma: assertion.targetLemma,
    baseLemma: assertion.baseLemma,
    proposedSemanticRole: assertion.proposedSemanticRole,
    hypothesisStatus: assertion.hypothesisStatus,
    evidenceRefs: [...assertion.evidenceRefs],
    evidenceAuthority: assertion.evidenceAuthority,
    reasonCodes: [...assertion.reasonCodes],
    claimBoundary: assertion.claimBoundary,
    reviewTrack: assertion.reviewTrack,
    reviewCandidate: assertion.reviewCandidate,
    ownerApproval: assertion.ownerApproval,
    productionAuthorization: RESEARCH_HYPOTHESIS_PRODUCTION_AUTHORIZATION_V0_1,
    functionalOperation: null,
    embryoFunction: "UNKNOWN_OR_NULL",
    historicalRelation: RESEARCH_HYPOTHESIS_HISTORICAL_RELATION_V0_1,
    winnerClaim: RESEARCH_HYPOTHESIS_WINNER_CLAIM_V0_1,
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
  }));
}
