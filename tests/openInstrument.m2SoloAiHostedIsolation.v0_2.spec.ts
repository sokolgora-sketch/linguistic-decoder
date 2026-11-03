import { createHash } from "node:crypto";

const reviewer = require("../scripts/openInstrument/m2SoloAiRestrictedReviewer.v0_2.cjs") as {
  canonical: (value: unknown) => string;
  sha256: (value: Buffer | string) => string;
  inspectRequestAndBuildDecision: (request: Record<string, unknown>, observations: Record<string, unknown>) => {
    decision: { outcome: string; checks: Record<string, string>; selectionFingerprintBefore: string; selectionFingerprintAfter: string };
    diagnostics: { operationalBoundaryPass: boolean };
  };
  verifyDockerInspection: (inspect: unknown, expected: unknown) => {
    status: string;
    failures: string[];
    controllerPrivateFileExposedByMount: boolean;
  };
};

const sha = (value: string) => createHash("sha256").update(value).digest("hex");
const sourceBytes = Buffer.from("synthetic-source-bytes-v0.1");
const inventoryBytes = Buffer.from("synthetic-exclusion-inventory-v0.1");
const makeMaterial = (artifactId: string, bytes: Buffer) => ({
  artifactId,
  bytesBase64: bytes.toString("base64"),
  expectedSha256: sha(bytes.toString("utf8")),
  expectedByteLength: bytes.byteLength,
});

function fixture() {
  const sourceSha = sha(sourceBytes.toString("utf8"));
  const inventorySha = sha(inventoryBytes.toString("utf8"));
  const manifestSha = sha("synthetic-sealed-manifest-v0.1");
  const selectionFingerprint = sha("synthetic-selection-v0.1");
  const machineChecks = {
    artifactHashesRecomputed: "PASS",
    sourceProvenanceValidated: "PASS",
    exclusionCoverageComplete: "PASS",
    sealedManifestValidated: "PASS",
    reviewerContractReadOnly: "PASS",
    selectionUnchanged: "PASS",
    blindPayloadHasNoTargetSemantics: "PASS",
    frozenContractLocked: "PASS",
  };
  const projection = {
    schemaVersion: "open-instrument.m2-solo-ai-review-workflow.v0.1",
    role: "AI_REVIEWER_READ_ONLY",
    machineCheckStatuses: machineChecks,
    sourceProvenance: [{
      candidateOpaqueId: "m2:synthetic-a",
      sourceTraditionId: "synthetic-source-tradition-v0.1",
      sourceTitle: "Synthetic source fixture",
      sourceRevisionOrAccessDate: "synthetic-v0.1",
      sourceFilePath: "synthetic/source.json",
      sourceHash: sourceSha,
      entryReference: "entry-1",
      senseReference: "sense-1",
      validationStatus: "PASS",
    }],
    evidenceIntegrity: [
      { artifactId: "source-1", expectedSha256: sourceSha, expectedByteLength: sourceBytes.byteLength },
      { artifactId: "inventory-1", expectedSha256: inventorySha, expectedByteLength: inventoryBytes.byteLength },
    ],
    exclusionCoverage: {
      requiredCategories: ["priorTarget", "priorUse"],
      coveredCategories: ["priorTarget", "priorUse"],
      status: "PASS",
    },
    sealedManifest: { sha256: manifestSha, byteLength: 24, validationStatus: "PASS", syntheticOnly: true },
    selection: { selectionFingerprint },
    accessBoundary: {
      readOnly: true,
      canChangeCandidateSelection: false,
      receivesHmacKey: false,
      receivesTargetMeaning: false,
      enforcement: "EXACT_DATA_PROJECTION_AND_REVIEW_SCHEMA",
    },
    reviewerCanReturn: ["PASS", "FAIL", "UNKNOWN"],
    blindPayload: {
      schemaVersion: "open-instrument.one-embryo-proof-m2.v0.1",
      caseOpaqueId: "synthetic:fixture",
      structuralEmbryo: "q",
      structuralFingerprint: sha("synthetic-structure"),
      voicePath: ["A"],
      sourceUniverseId: "synthetic-universe",
      searchPolicyId: "synthetic-policy",
      stopRuleId: "synthetic-stop",
      claimBoundary: ["Null_valid"],
      targetRevealStatus: "FORBIDDEN_UNTIL_REVEAL_GATE",
    },
    blindPayloadCheck: { status: "PASS", forbiddenKeyPaths: [], forbiddenValuePaths: [] },
  };
  const request = {
    schemaVersion: "ze14.m2-restricted-review-request.v0.2",
    reviewerProjection: projection,
    reviewRequest: {
      reviewerInputSha256: reviewer.sha256(reviewer.canonical(projection) + "\n"),
      reviewedArtifactSha256s: [sourceSha, inventorySha, manifestSha].sort(),
      selectionFingerprint,
      machineCheckStatuses: machineChecks,
    },
    artifactMaterials: [
      makeMaterial("source-1", sourceBytes),
      makeMaterial("inventory-1", inventoryBytes),
    ],
    probe: {
      controllerPrivatePath: "/controller-private/private.json",
      controllerPrivateFileExists: true,
      controllerPrivateFileSha256: sha("synthetic-private-fixture"),
      hostMarkerPid: 41,
      hostMarkerToken: "ze14-host-private-process-" + "b".repeat(32),
      hostPidNamespace: "pid:[4026531834]",
      hostNetworkNamespace: "net:[4026531992]",
      runNonce: "a".repeat(32),
    },
  };
  const observations = {
    authorizedInputRead: { succeeded: true, sha256: sha("serialized-request"), byteLength: 100 },
    privateFileRead: { hostFileExists: true, observedErrorCode: "ENOENT", hostFileMounted: false },
    unauthorizedWrite: {
      observedErrorCode: "EROFS",
      requestMountErrorCode: "EROFS",
      reviewerCodeMountErrorCode: "EROFS",
      requestBytesUnchanged: true,
      reviewerCodeBytesUnchanged: true,
      outputMountWritable: true,
    },
    processVisibility: { hostMarkerVisible: false, pidNamespaceDistinct: true, scannedPidCount: 2 },
    network: { reached: false, errorCode: "ENETUNREACH", defaultRoutePresent: false, networkNamespaceDistinct: true },
    credentialBoundary: { secretLikeKeysAbsent: true, secretLikeKeys: [], environmentKeys: ["PATH"] },
    processIdentity: { uid: 1001, gid: 1001, pid: 2, pidNamespace: "pid:[2]", networkNamespace: "net:[2]", processCountVisibleInNamespace: 2 },
    networkInterfaces: ["lo"],
  };
  return { request, observations };
}

describe("ZE-14 hosted restricted reviewer configuration contract", () => {
  test("emits a passing synthetic decision only when the allowlisted evidence and probe observations agree", () => {
    const { request, observations } = fixture();
    const result = reviewer.inspectRequestAndBuildDecision(request, observations);

    expect(result.decision.outcome).toBe("PASS");
    expect(result.diagnostics.operationalBoundaryPass).toBe(true);
    expect(result.decision.selectionFingerprintBefore).toBe(request.reviewRequest.selectionFingerprint);
    expect(result.decision.selectionFingerprintAfter).toBe(request.reviewRequest.selectionFingerprint);
  });

  test("fails when the reviewer projection is tampered without updating its bound hash", () => {
    const { request, observations } = fixture();
    request.reviewerProjection.accessBoundary.canChangeCandidateSelection = true;
    const result = reviewer.inspectRequestAndBuildDecision(request, observations);

    expect(result.decision.outcome).toBe("FAIL");
    expect(result.decision.checks.artifactHashesRecomputed).toBe("FAIL");
    expect(result.decision.checks.reviewerContractReadOnly).toBe("FAIL");
  });

  test("fails closed when filesystem or process restrictions are missing", () => {
    const { request, observations } = fixture();
    observations.privateFileRead.observedErrorCode = "EACCES";
    observations.unauthorizedWrite.observedErrorCode = "EACCES";
    observations.processVisibility.hostMarkerVisible = true;
    const result = reviewer.inspectRequestAndBuildDecision(request, observations);

    expect(result.decision.outcome).toBe("FAIL");
    expect(result.diagnostics.operationalBoundaryPass).toBe(false);
  });

  test("accepts only the inspected read-only container and exact explicit mounts", () => {
    const expected = {
      imageTag: "node:20-bookworm-slim",
      imageId: "sha256:image",
      imageEnv: ["PATH=/usr/local/bin:/usr/bin:/bin"],
      user: "1001:1001",
      privateFilePath: "/runner/_temp/private.json",
      mounts: [
        { destination: "/reviewer/request.json", source: "/runner/_temp/request.json", writable: false },
        { destination: "/reviewer/reviewer.cjs", source: "/runner/_temp/reviewer.cjs", writable: false },
        { destination: "/reviewer/output", source: "/runner/_temp/output", writable: true },
      ],
    };
    const inspect = {
      Image: "sha256:image",
      Config: { Image: "node:20-bookworm-slim", User: "1001:1001", Env: expected.imageEnv },
      State: { ExitCode: 0 },
      HostConfig: {
        ReadonlyRootfs: true,
        Privileged: false,
        NetworkMode: "none",
        PidMode: "",
        IpcMode: "private",
        PidsLimit: 64,
        Memory: 268435456,
        NanoCpus: 1000000000,
        CapDrop: ["ALL"],
        CapAdd: [],
        SecurityOpt: ["no-new-privileges:true"],
      },
      Mounts: expected.mounts.map((mount) => ({
        Type: "bind",
        Source: mount.source,
        Destination: mount.destination,
        RW: mount.writable,
      })),
    };

    expect(reviewer.verifyDockerInspection(inspect, expected).status).toBe("PASS");
    const unsafe = JSON.parse(JSON.stringify(inspect));
    unsafe.Mounts.push({ Type: "bind", Source: "/runner/_work/repo", Destination: "/repo", RW: true });
    expect(reviewer.verifyDockerInspection(unsafe, expected).status).toBe("FAIL");

    const privateMount = JSON.parse(JSON.stringify(inspect));
    privateMount.Mounts.push({ Type: "bind", Source: "/runner/_temp", Destination: "/host-temp", RW: true });
    const privateMountResult = reviewer.verifyDockerInspection(privateMount, expected);
    expect(privateMountResult.status).toBe("FAIL");
    expect(privateMountResult.controllerPrivateFileExposedByMount).toBe(true);

    const injectedCredential = JSON.parse(JSON.stringify(inspect));
    injectedCredential.Config.Env.push("GITHUB_TOKEN=must-not-be-present");
    expect(reviewer.verifyDockerInspection(injectedCredential, expected).failures).toContain("SECRET_LIKE_ENV_KEY_PRESENT");
  });
});
