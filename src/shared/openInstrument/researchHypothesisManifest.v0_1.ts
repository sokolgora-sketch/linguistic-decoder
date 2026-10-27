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

export type ResearchHypothesisStatusV0_1 =
  | "PROPOSED_NOT_REVIEWED"
  | "REVIEWED"
  | "REJECTED"
  | "UNRESOLVED";

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
  productionAuthorization: typeof RESEARCH_HYPOTHESIS_PRODUCTION_AUTHORIZATION_V0_1;
  functionalOperation: null;
  embryoFunction: "UNKNOWN_OR_NULL";
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
    value === "REJECTED" ||
    value === "UNRESOLVED"
  );
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
    value.claimBoundary !== RESEARCH_HYPOTHESIS_CLAIM_BOUNDARY_V0_1
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
    productionAuthorization: RESEARCH_HYPOTHESIS_PRODUCTION_AUTHORIZATION_V0_1,
    functionalOperation: null,
    embryoFunction: "UNKNOWN_OR_NULL",
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
  }));
}
