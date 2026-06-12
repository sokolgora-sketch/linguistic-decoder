export type RunPacketFixtureValidationIssueCodeV0_1 =
  | "OUTPUT_NOT_OBJECT"
  | "MISSING_FIELD"
  | "INVALID_VALUE"
  | "INVALID_OBJECT"
  | "INVALID_ARRAY";

export type RunPacketFixtureValidationIssueV0_1 = {
  code: RunPacketFixtureValidationIssueCodeV0_1;
  severity: "error";
  message: string;
  path: string;
};

export type RunPacketFixtureValidationResultV0_1 = {
  ok: boolean;
  issues: RunPacketFixtureValidationIssueV0_1[];
};

const REQUIRED_TOP_LEVEL_FIELDS = [
  "schemaVersion",
  "packetId",
  "runId",
  "createdAt",
  "createdBy",
  "status",
  "word",
  "normalizedWord",
  "targetObject",
  "segmentationId",
  "segmentationLabel",
  "chunks",
  "chunkVariants",
  "voicePath",
  "legalTransforms",
  "functionHints",
  "targetLanguages",
  "searchMode",
  "provider",
  "model",
  "providerProfile",
  "endpointType",
  "timeoutBudget",
  "promptContractPath",
  "expectedOutputSchema",
  "artifactPath",
  "reportPath",
  "reviewPath",
  "sourceDesignPath",
  "sourcePreflightPath",
  "claimBoundary",
  "publicationBoundary",
  "providerDefaultBoundary",
  "modelCallAuthorization",
  "artifactCreationAuthorization",
  "rerunAuthorization",
  "openAiApiAuthorization",
  "validatorExpectations",
  "stopConditions",
  "evidenceClassIntent",
  "notes",
] as const;

const EXPECTED = {
  schemaVersion: "open-instrument.run-packet.v0.1",
  packetId: "fixture.open-instrument.run-packet.v0.1",
  runId: "fixture.open-instrument.run-packet.static.v0.1",
  createdAt: "2026-06-12T00:00:00.000Z",
  createdBy: "docs-only-fixture-design",
  status: "design_fixture",
  word: "study",
  normalizedWord: "study",
  targetObject: "word",
  segmentationId: "fixture.segmentation.study.demo",
  segmentationLabel: "STUDY_DEMO_SEGMENTATION",
  chunks: ["STU", "DY"],
  chunkVariants: [
    {
      chunk: "DY",
      variantOf: "DI",
      legalTransform: "FINAL_Y_TO_I",
      notes: ["Static fixture demo variant."],
    },
  ],
  voicePath: ["U", "Y"],
  legalTransforms: ["FINAL_Y_TO_I"],
  functionHints: [
    {
      voice: "U",
      hints: ["container", "inside", "holding"],
      functionHintSource: "docs-only-fixture-design",
    },
    {
      voice: "Y",
      hints: ["split", "join", "link"],
      functionHintSource: "docs-only-fixture-design",
    },
  ],
  targetLanguages: ["Albanian", "Latin", "Chinese", "Germanic"],
  searchMode: "static-fixture",
  provider: "fixture",
  model: "none",
  providerProfile: "static-fixture-no-provider",
  endpointType: "none",
  timeoutBudget: "not_applicable",
  promptContractPath:
    "docs/open-instrument/open-instrument-run-packet-contract-design-v0.1.md",
  expectedOutputSchema: "open-instrument.run-packet.v0.1",
  artifactPath:
    "docs/open-instrument/artifacts/run-packets/open-instrument-run-packet-fixture-v0.1.json",
  reportPath:
    "docs/open-instrument/open-instrument-run-packet-fixture-report-v0.1.md",
  reviewPath:
    "docs/open-instrument/open-instrument-run-packet-fixture-review-v0.1.md",
  sourceDesignPath:
    "docs/open-instrument/open-instrument-run-packet-fixture-design-v0.1.md",
  sourcePreflightPath: "not_applicable",
  claimBoundary: {
    originClaim: false,
    winnerClaim: false,
    candidateTruthClaim: false,
    languageSuperiorityClaim: false,
    modelQualityProof: false,
    publicationFraming: false,
  },
  publicationBoundary: {
    publicationReady: false,
    publicClaimAllowed: false,
    reason: "static fixture only, not run evidence",
  },
  providerDefaultBoundary: {
    providerDefaultChanged: false,
    providerDefaultRequired: false,
    providerExecutionAllowed: false,
    openAiApiUseAllowed: false,
  },
  modelCallAuthorization: false,
  artifactCreationAuthorization: false,
  rerunAuthorization: false,
  openAiApiAuthorization: false,
  validatorExpectations: [
    "required fields present",
    "identity stable",
    "segmentation explicit",
    "boundaries explicit",
    "false authorization preserved",
    "non-runnable fixture only",
  ],
  stopConditions: [
    "implicit provider",
    "implicit model",
    "missing prompt contract",
    "missing artifact path",
    "missing report path",
    "existing target artifact",
    "existing target report",
    "ambiguous OpenAI API use",
    "ambiguous provider default behavior",
    "absent claim boundary",
    "absent publication boundary",
    "missing validator expectations",
    "segmentationId drift",
    "chunk drift",
    "enum array drift",
    "forbidden claims",
    "hidden null candidates",
    "provider default claims",
  ],
  evidenceClassIntent: "design-only",
  notes: [
    "static fixture only",
    "no model call",
    "no rerun",
    "no provider execution",
    "no artifact creation",
    "no OpenAI API use",
    "not candidate-truth evidence",
    "not origin evidence",
    "future validation may prove schema/traceability alignment only",
    "provider default remains unchanged",
    "not publication framing",
  ],
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function addIssue(
  issues: RunPacketFixtureValidationIssueV0_1[],
  code: RunPacketFixtureValidationIssueCodeV0_1,
  path: string,
  message: string,
): void {
  issues.push({ code, severity: "error", path, message });
}

function isExactJsonValue(actual: unknown, expected: unknown): boolean {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function validateFieldPresence(
  output: Record<string, unknown>,
  field: string,
  issues: RunPacketFixtureValidationIssueV0_1[],
): boolean {
  if (!(field in output)) {
    addIssue(issues, "MISSING_FIELD", field, `missing required field: ${field}`);
    return false;
  }
  return true;
}

function validateExactValue(
  output: Record<string, unknown>,
  field: string,
  expected: unknown,
  issues: RunPacketFixtureValidationIssueV0_1[],
): void {
  if (!validateFieldPresence(output, field, issues)) return;
  if (!isExactJsonValue(output[field], expected)) {
    addIssue(
      issues,
      "INVALID_VALUE",
      field,
      `field ${field} must exactly match the approved static fixture value.`,
    );
  }
}

function validateExactObject(
  output: Record<string, unknown>,
  field: string,
  expected: Record<string, unknown>,
  issues: RunPacketFixtureValidationIssueV0_1[],
): void {
  if (!validateFieldPresence(output, field, issues)) return;
  const actual = output[field];
  if (!isRecord(actual)) {
    addIssue(issues, "INVALID_OBJECT", field, `field ${field} must be an object.`);
    return;
  }
  if (!isExactJsonValue(actual, expected)) {
    addIssue(
      issues,
      "INVALID_VALUE",
      field,
      `field ${field} must exactly match the approved static fixture object.`,
    );
  }
}

function validateExactArray(
  output: Record<string, unknown>,
  field: string,
  expected: readonly unknown[],
  issues: RunPacketFixtureValidationIssueV0_1[],
): void {
  if (!validateFieldPresence(output, field, issues)) return;
  const actual = output[field];
  if (!Array.isArray(actual)) {
    addIssue(issues, "INVALID_ARRAY", field, `field ${field} must be an array.`);
    return;
  }
  if (!isExactJsonValue(actual, expected)) {
    addIssue(
      issues,
      "INVALID_VALUE",
      field,
      `field ${field} must exactly match the approved static fixture array.`,
    );
  }
}

export function validateRunPacketFixtureV0_1(fixture: unknown): RunPacketFixtureValidationResultV0_1 {
  const issues: RunPacketFixtureValidationIssueV0_1[] = [];

  if (!isRecord(fixture)) {
    addIssue(issues, "OUTPUT_NOT_OBJECT", "", "fixture must be a JSON object.");
    return { ok: false, issues };
  }

  for (const field of REQUIRED_TOP_LEVEL_FIELDS) {
    validateFieldPresence(fixture, field, issues);
  }

  validateExactValue(fixture, "schemaVersion", EXPECTED.schemaVersion, issues);
  validateExactValue(fixture, "packetId", EXPECTED.packetId, issues);
  validateExactValue(fixture, "runId", EXPECTED.runId, issues);
  validateExactValue(fixture, "createdAt", EXPECTED.createdAt, issues);
  validateExactValue(fixture, "createdBy", EXPECTED.createdBy, issues);
  validateExactValue(fixture, "status", EXPECTED.status, issues);
  validateExactValue(fixture, "word", EXPECTED.word, issues);
  validateExactValue(fixture, "normalizedWord", EXPECTED.normalizedWord, issues);
  validateExactValue(fixture, "targetObject", EXPECTED.targetObject, issues);
  validateExactValue(fixture, "segmentationId", EXPECTED.segmentationId, issues);
  validateExactValue(fixture, "segmentationLabel", EXPECTED.segmentationLabel, issues);
  validateExactArray(fixture, "chunks", EXPECTED.chunks, issues);
  validateExactArray(fixture, "chunkVariants", EXPECTED.chunkVariants, issues);
  validateExactArray(fixture, "voicePath", EXPECTED.voicePath, issues);
  validateExactArray(fixture, "legalTransforms", EXPECTED.legalTransforms, issues);
  validateExactArray(fixture, "functionHints", EXPECTED.functionHints, issues);
  validateExactArray(fixture, "targetLanguages", EXPECTED.targetLanguages, issues);
  validateExactValue(fixture, "searchMode", EXPECTED.searchMode, issues);
  validateExactValue(fixture, "provider", EXPECTED.provider, issues);
  validateExactValue(fixture, "model", EXPECTED.model, issues);
  validateExactValue(fixture, "providerProfile", EXPECTED.providerProfile, issues);
  validateExactValue(fixture, "endpointType", EXPECTED.endpointType, issues);
  validateExactValue(fixture, "timeoutBudget", EXPECTED.timeoutBudget, issues);
  validateExactValue(
    fixture,
    "promptContractPath",
    EXPECTED.promptContractPath,
    issues,
  );
  validateExactValue(
    fixture,
    "expectedOutputSchema",
    EXPECTED.expectedOutputSchema,
    issues,
  );
  validateExactValue(fixture, "artifactPath", EXPECTED.artifactPath, issues);
  validateExactValue(fixture, "reportPath", EXPECTED.reportPath, issues);
  validateExactValue(fixture, "reviewPath", EXPECTED.reviewPath, issues);
  validateExactValue(
    fixture,
    "sourceDesignPath",
    EXPECTED.sourceDesignPath,
    issues,
  );
  validateExactValue(
    fixture,
    "sourcePreflightPath",
    EXPECTED.sourcePreflightPath,
    issues,
  );
  validateExactObject(fixture, "claimBoundary", EXPECTED.claimBoundary, issues);
  validateExactObject(
    fixture,
    "publicationBoundary",
    EXPECTED.publicationBoundary,
    issues,
  );
  validateExactObject(
    fixture,
    "providerDefaultBoundary",
    EXPECTED.providerDefaultBoundary,
    issues,
  );
  validateExactValue(
    fixture,
    "modelCallAuthorization",
    EXPECTED.modelCallAuthorization,
    issues,
  );
  validateExactValue(
    fixture,
    "artifactCreationAuthorization",
    EXPECTED.artifactCreationAuthorization,
    issues,
  );
  validateExactValue(fixture, "rerunAuthorization", EXPECTED.rerunAuthorization, issues);
  validateExactValue(
    fixture,
    "openAiApiAuthorization",
    EXPECTED.openAiApiAuthorization,
    issues,
  );
  validateExactArray(
    fixture,
    "validatorExpectations",
    EXPECTED.validatorExpectations,
    issues,
  );
  validateExactArray(fixture, "stopConditions", EXPECTED.stopConditions, issues);
  validateExactValue(
    fixture,
    "evidenceClassIntent",
    EXPECTED.evidenceClassIntent,
    issues,
  );
  validateExactArray(fixture, "notes", EXPECTED.notes, issues);

  return {
    ok: issues.length === 0,
    issues,
  };
}
