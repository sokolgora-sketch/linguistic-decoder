"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");

const SCHEMA = "ze14.m2-restricted-review-request.v0.2";
const RESPONSE_SCHEMA = "open-instrument.m2-solo-ai-review-workflow.v0.1";
const CLASSIFICATION = "AI_ASSISTED_NOT_HUMAN_INDEPENDENT";
const CHECKS = [
  "artifactHashesRecomputed",
  "sourceProvenanceValidated",
  "exclusionCoverageComplete",
  "sealedManifestValidated",
  "reviewerContractReadOnly",
  "selectionUnchanged",
  "blindPayloadHasNoTargetSemantics",
  "frozenContractLocked",
];
const BLIND_KEYS = [
  "schemaVersion",
  "caseOpaqueId",
  "structuralEmbryo",
  "structuralFingerprint",
  "voicePath",
  "sourceUniverseId",
  "searchPolicyId",
  "stopRuleId",
  "claimBoundary",
  "targetRevealStatus",
];
const SHA256 = /^[a-f0-9]{64}$/u;
const SECRET_ENV_KEY = /(TOKEN|SECRET|PASSWORD|CREDENTIAL|API_KEY|PRIVATE_KEY|GITHUB|ACTIONS|RUNNER)/iu;

const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const canonical = (value) => {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  const record = value;
  return "{" + Object.keys(record).sort().map((key) =>
    JSON.stringify(key) + ":" + canonical(record[key])).join(",") + "}";
};
const sortedUnique = (values) => [...new Set(values)].sort();
const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const errorCode = (error) => typeof error?.code === "string" ? error.code : "UNKNOWN_ERROR";
const hasExactKeys = (value, keys) => isRecord(value) &&
  Object.keys(value).sort().join("\u0000") === [...keys].sort().join("\u0000");

const scanProcessTableForMarker = (marker) => {
  const pids = fs.readdirSync("/proc").filter((value) => /^\d+$/u.test(value));
  for (const pid of pids) {
    try {
      const commandLine = fs.readFileSync("/proc/" + pid + "/cmdline");
      if (commandLine.includes(Buffer.from(marker))) return { visible: true, observedPid: Number(pid), scannedPidCount: pids.length };
    } catch {
      // Process exit during enumeration is an ordinary race; continue scanning.
    }
  }
  return { visible: false, observedPid: null, scannedPidCount: pids.length };
};

const probeNetwork = () => new Promise((resolve) => {
  const socket = net.createConnection({ host: "1.1.1.1", port: 443 });
  const timer = setTimeout(() => {
    socket.destroy();
    resolve({ reached: false, errorCode: "ETIMEDOUT" });
  }, 1800);
  socket.once("connect", () => {
    clearTimeout(timer);
    socket.destroy();
    resolve({ reached: true, errorCode: null });
  });
  socket.once("error", (error) => {
    clearTimeout(timer);
    resolve({ reached: false, errorCode: errorCode(error) });
  });
});

const hasDefaultRoute = () => {
  try {
    const rows = fs.readFileSync("/proc/net/route", "utf8").trim().split("\n").slice(1);
    return rows.some((line) => line.split(/\s+/u)[1] === "00000000");
  } catch {
    return null;
  }
};

const inspectRequestAndBuildDecision = (request, observations) => {
  const reasons = [];
  const conflicts = [];
  const projection = request?.reviewerProjection;
  const reviewRequest = request?.reviewRequest;
  const materials = request?.artifactMaterials;
  const probe = request?.probe;
  const checks = Object.fromEntries(CHECKS.map((name) => [name, "UNKNOWN"]));

  let projectedBytesSha = null;
  if (isRecord(projection)) {
    projectedBytesSha = sha256(canonical(projection) + "\n");
    checks.artifactHashesRecomputed = projectedBytesSha === reviewRequest?.reviewerInputSha256 ? "PASS" : "FAIL";
  } else {
    reasons.push("REVIEWER_PROJECTION_MISSING");
    checks.artifactHashesRecomputed = "FAIL";
  }

  const expectedRequestKeys = ["schemaVersion", "reviewerProjection", "reviewRequest", "artifactMaterials", "probe"];
  const expectedProbeKeys = ["controllerPrivatePath", "controllerPrivateFileExists", "controllerPrivateFileSha256", "hostMarkerPid", "hostMarkerToken", "hostPidNamespace", "hostNetworkNamespace", "runNonce"];
  const requestShapeValid = hasExactKeys(request, expectedRequestKeys) && hasExactKeys(probe, expectedProbeKeys) &&
    hasExactKeys(reviewRequest, ["reviewerInputSha256", "reviewedArtifactSha256s", "selectionFingerprint", "machineCheckStatuses"]) &&
    hasExactKeys(reviewRequest.machineCheckStatuses, CHECKS) &&
    canonical(reviewRequest.machineCheckStatuses) === canonical(projection?.machineCheckStatuses) &&
    probe.controllerPrivatePath === "/controller-private/private.json" &&
    probe.controllerPrivateFileExists === true && SHA256.test(probe.controllerPrivateFileSha256) &&
    Number.isInteger(probe.hostMarkerPid) && probe.hostMarkerPid > 0 &&
    typeof probe.hostMarkerToken === "string" && /^ze14-host-private-process-[a-f0-9]{32}$/u.test(probe.hostMarkerToken) &&
    typeof probe.hostPidNamespace === "string" && typeof probe.hostNetworkNamespace === "string" &&
    typeof probe.runNonce === "string" && /^[a-f0-9]{32}$/u.test(probe.runNonce);
  if (!requestShapeValid) reasons.push("REVIEW_REQUEST_SCHEMA_INVALID");

  const materialResults = [];
  if (requestShapeValid && Array.isArray(materials) && materials.length === 2) {
    for (const item of materials) {
      if (!hasExactKeys(item, ["artifactId", "bytesBase64", "expectedSha256", "expectedByteLength"]) ||
          typeof item.artifactId !== "string" || typeof item.bytesBase64 !== "string") {
        materialResults.push({ artifactId: null, status: "FAIL", errorCode: "MATERIAL_SCHEMA_INVALID" });
        continue;
      }
      const bytes = Buffer.from(item.bytesBase64, "base64");
      const digest = sha256(bytes);
      const matched = digest === item.expectedSha256 &&
        bytes.byteLength === item.expectedByteLength &&
        Array.isArray(reviewRequest?.reviewedArtifactSha256s) &&
        reviewRequest.reviewedArtifactSha256s.includes(digest);
      materialResults.push({
        artifactId: item.artifactId,
        observedSha256: digest,
        observedByteLength: bytes.byteLength,
        expectedSha256: item.expectedSha256,
        expectedByteLength: item.expectedByteLength,
        status: matched ? "PASS" : "FAIL",
      });
    }
  } else {
    reasons.push("ARTIFACT_MATERIALS_MISSING");
  }
  const materialsAreExactSyntheticInputs = Array.isArray(materials) && materialResults.map((item) => item.artifactId).sort().join("\u0000") === "inventory-1\u0000source-1" &&
    materials.every((item) => {
      if (!isRecord(item) || typeof item.bytesBase64 !== "string") return false;
      const bytes = Buffer.from(item.bytesBase64, "base64").toString("utf8");
      return item.artifactId === "source-1" ? bytes === "synthetic-source-bytes-v0.1" : bytes === "synthetic-exclusion-inventory-v0.1";
    });
  const hashesValid = requestShapeValid && materialsAreExactSyntheticInputs && checks.artifactHashesRecomputed === "PASS" &&
    materialResults.length > 0 &&
    materialResults.every((item) => item.status === "PASS") &&
    Array.isArray(reviewRequest?.reviewedArtifactSha256s) &&
    reviewRequest.reviewedArtifactSha256s.every((value) => typeof value === "string" && SHA256.test(value)) &&
    sortedUnique(reviewRequest.reviewedArtifactSha256s).length === reviewRequest.reviewedArtifactSha256s.length;
  checks.artifactHashesRecomputed = hashesValid ? "PASS" : "FAIL";
  if (!hashesValid) reasons.push("ARTIFACT_HASH_RECOMPUTATION_FAILED");

  const sourceRows = projection?.sourceProvenance;
  const sourceMaterial = materialResults.find((item) => item.artifactId === "source-1");
  const provenanceValid = Array.isArray(sourceRows) && sourceRows.length > 0 &&
    sourceRows.every((row) => hasExactKeys(row, ["candidateOpaqueId", "sourceTraditionId", "sourceTitle", "sourceRevisionOrAccessDate", "sourceFilePath", "sourceHash", "entryReference", "senseReference", "validationStatus"]) &&
      typeof row.candidateOpaqueId === "string" && row.candidateOpaqueId.startsWith("m2:synthetic-") &&
      typeof row.sourceTraditionId === "string" && row.sourceTraditionId.startsWith("synthetic-") &&
      typeof row.sourceTitle === "string" && row.sourceTitle.startsWith("Synthetic ") &&
      typeof row.sourceRevisionOrAccessDate === "string" &&
      typeof row.sourceFilePath === "string" && row.sourceFilePath.startsWith("synthetic/") &&
      row.entryReference === "entry-1" && row.senseReference === "sense-1" &&
      row.validationStatus === "PASS" && row.sourceHash === sourceMaterial?.observedSha256) &&
    sourceRows.every((row, index) => sourceRows.slice(index + 1).every((other) =>
      row.sourceTraditionId !== other.sourceTraditionId || row.sourceHash === other.sourceHash));
  checks.sourceProvenanceValidated = provenanceValid ? "PASS" : "FAIL";
  if (!provenanceValid) {
    reasons.push("SOURCE_PROVENANCE_INVALID");
    conflicts.push("SOURCE_PROVENANCE_CONFLICT");
  }

  const exclusion = projection?.exclusionCoverage;
  const exclusionValid = isRecord(exclusion) &&
    Array.isArray(exclusion.requiredCategories) &&
    Array.isArray(exclusion.coveredCategories) &&
    exclusion.status === "PASS" &&
    sortedUnique(exclusion.requiredCategories).join("\u0000") === sortedUnique(exclusion.coveredCategories).join("\u0000") &&
    sortedUnique(exclusion.requiredCategories).length === exclusion.requiredCategories.length &&
    sortedUnique(exclusion.coveredCategories).length === exclusion.coveredCategories.length &&
    materialResults.some((item) => item.artifactId === "inventory-1" && item.status === "PASS");
  checks.exclusionCoverageComplete = exclusionValid ? "PASS" : "FAIL";
  if (!exclusionValid) reasons.push("EXCLUSION_COVERAGE_INCOMPLETE");

  const manifest = projection?.sealedManifest;
  const manifestDigest = manifest?.sha256;
  const manifestValid = isRecord(manifest) &&
    manifest.syntheticOnly === true &&
    manifest.validationStatus === "PASS" &&
    typeof manifestDigest === "string" && SHA256.test(manifestDigest) &&
    Number.isInteger(manifest.byteLength) && manifest.byteLength > 0 &&
    Array.isArray(reviewRequest?.reviewedArtifactSha256s) &&
    reviewRequest.reviewedArtifactSha256s.includes(manifestDigest);
  checks.sealedManifestValidated = manifestValid ? "PASS" : "FAIL";
  if (!manifestValid) reasons.push("SEALED_MANIFEST_COMMITMENT_INVALID");

  const boundary = projection?.accessBoundary;
  const reviewerContractValid = projection?.role === "AI_REVIEWER_READ_ONLY" &&
    hasExactKeys(boundary, ["readOnly", "canChangeCandidateSelection", "receivesHmacKey", "receivesTargetMeaning", "enforcement"]) && boundary.readOnly === true &&
    boundary.canChangeCandidateSelection === false &&
    boundary.receivesHmacKey === false &&
    boundary.receivesTargetMeaning === false &&
    boundary.enforcement === "EXACT_DATA_PROJECTION_AND_REVIEW_SCHEMA" &&
    Array.isArray(projection?.reviewerCanReturn) &&
    projection.reviewerCanReturn.length === 3 &&
    [...projection.reviewerCanReturn].sort().join("\u0000") === ["FAIL", "PASS", "UNKNOWN"].join("\u0000");
  checks.reviewerContractReadOnly = reviewerContractValid ? "PASS" : "FAIL";
  if (!reviewerContractValid) reasons.push("REVIEWER_CONTRACT_NOT_READ_ONLY");

  const selectionFingerprint = projection?.selection?.selectionFingerprint;
  const selectionValid = typeof selectionFingerprint === "string" &&
    SHA256.test(selectionFingerprint) &&
    selectionFingerprint === reviewRequest?.selectionFingerprint &&
    selectionFingerprint === request?.reviewRequest?.selectionFingerprint;
  checks.selectionUnchanged = selectionValid ? "PASS" : "FAIL";
  if (!selectionValid) reasons.push("SELECTION_FINGERPRINT_MISMATCH");

  const blindPayload = projection?.blindPayload;
  const blindCheck = projection?.blindPayloadCheck;
  const blindValid = isRecord(blindPayload) &&
    sortedUnique(Object.keys(blindPayload)).join("\u0000") === sortedUnique(BLIND_KEYS).join("\u0000") &&
    typeof blindPayload.caseOpaqueId === "string" && blindPayload.caseOpaqueId.startsWith("synthetic:") &&
    blindPayload.targetRevealStatus === "FORBIDDEN_UNTIL_REVEAL_GATE" &&
    !("targetWord" in blindPayload) && !("targetSenseDefinition" in blindPayload) &&
    !("translation" in blindPayload) && !("expectedFunction" in blindPayload) &&
    isRecord(blindCheck) && blindCheck.status === "PASS" &&
    Array.isArray(blindCheck.forbiddenKeyPaths) && blindCheck.forbiddenKeyPaths.length === 0 &&
    Array.isArray(blindCheck.forbiddenValuePaths) && blindCheck.forbiddenValuePaths.length === 0;
  checks.blindPayloadHasNoTargetSemantics = blindValid ? "PASS" : "FAIL";
  if (!blindValid) reasons.push("BLIND_PAYLOAD_NOT_ALLOWLISTED");

  const frozenCheck = projection?.machineCheckStatuses?.frozenContractLocked;
  checks.frozenContractLocked = frozenCheck === "PASS" ? "PASS" : frozenCheck === "FAIL" ? "FAIL" : "UNKNOWN";
  if (checks.frozenContractLocked !== "PASS") reasons.push("FROZEN_CONTRACT_NOT_CONFIRMED");

  const privateRead = observations.privateFileRead;
  const unauthorizedWrite = observations.unauthorizedWrite;
  const processVisibility = observations.processVisibility;
  const network = observations.network;
  const credentialBoundary = observations.credentialBoundary;
  const operationalBoundaryPass = privateRead?.hostFileExists === true &&
    privateRead?.observedErrorCode === "ENOENT" &&
    privateRead?.hostFileMounted === false &&
    unauthorizedWrite?.observedErrorCode === "EROFS" &&
    ["EROFS", "EACCES", "EPERM"].includes(unauthorizedWrite?.requestMountErrorCode) &&
    ["EROFS", "EACCES", "EPERM"].includes(unauthorizedWrite?.reviewerCodeMountErrorCode) &&
    unauthorizedWrite?.requestBytesUnchanged === true &&
    unauthorizedWrite?.reviewerCodeBytesUnchanged === true &&
    unauthorizedWrite?.outputMountWritable === true &&
    processVisibility?.hostMarkerVisible === false &&
    processVisibility?.pidNamespaceDistinct === true &&
    network?.networkNamespaceDistinct === true &&
    network?.reached === false &&
    ["ENETUNREACH", "EHOSTUNREACH", "EPERM", "EACCES"].includes(network.errorCode) &&
    network?.defaultRoutePresent === false &&
    credentialBoundary?.secretLikeKeysAbsent === true;
  if (!operationalBoundaryPass) {
    reasons.push("PROCESS_BOUNDARY_PROBE_FAILED_OR_UNKNOWN");
    if (checks.reviewerContractReadOnly === "PASS") checks.reviewerContractReadOnly = "UNKNOWN";
  }

  const failed = Object.values(checks).some((value) => value === "FAIL") ||
    reasons.includes("PROCESS_BOUNDARY_PROBE_FAILED_OR_UNKNOWN");
  const unknown = Object.values(checks).some((value) => value === "UNKNOWN");
  const outcome = failed ? "FAIL" : unknown ? "UNKNOWN" : "PASS";
  const selection = selectionFingerprint;
  const reviewedHashes = Array.isArray(reviewRequest?.reviewedArtifactSha256s)
    ? [...reviewRequest.reviewedArtifactSha256s]
    : [];
  const decision = {
    schemaVersion: RESPONSE_SCHEMA,
    reviewerIdentity: {
      provider: "OpenAI",
      agent: "Codex",
      modelId: "synthetic-deterministic-reviewer",
      sessionId: "codex-thread:ze14-v0-2-synthetic-container",
      identityBasis: "CALLER_DECLARED",
    },
    classification: CLASSIFICATION,
    outcome,
    reviewedInputSha256: projectedBytesSha,
    reviewedArtifactSha256s: reviewedHashes,
    selectionFingerprintBefore: selection,
    selectionFingerprintAfter: selection,
    checks,
    conflicts: [...new Set(conflicts)].sort(),
    failures: [...new Set(reasons)].sort().map((value) => value.replaceAll("-", "_").toUpperCase()),
    claimsHumanIndependentReview: false,
  };
  return {
    decision,
    diagnostics: {
      reviewerExecution: "DETERMINISTIC_SYNTHETIC_PROCESS_NOT_AI",
      recomputedProjectionSha256: projectedBytesSha,
      recomputedMaterials: materialResults,
      operationalBoundaryPass,
      processIdentity: observations.processIdentity ?? null,
      environment: {
        keys: credentialBoundary?.environmentKeys ?? [],
        secretLikeKeys: observations.credentialBoundary?.secretLikeKeys ?? [],
      },
      networkInterfaces: observations.networkInterfaces ?? [],
      observedInputFileSha256: observations.authorizedInputRead?.sha256 ?? null,
    },
  };
};

const run = async () => {
  const args = process.argv.slice(2);
  const getArg = (name) => {
    const prefix = name + "=";
    const item = args.find((value) => value.startsWith(prefix));
    return item ? item.slice(prefix.length) : null;
  };
  const requestPath = getArg("--request");
  const outputPath = getArg("--output");
  if (!requestPath || !outputPath) throw new Error("request and output paths are required");

  const requestBytes = fs.readFileSync(requestPath);
  const request = JSON.parse(requestBytes.toString("utf8"));
  if (request.schemaVersion !== SCHEMA) throw new Error("unsupported synthetic review request schema");
  if (!hasExactKeys(request, ["schemaVersion", "reviewerProjection", "reviewRequest", "artifactMaterials", "probe"])) {
    throw new Error("review request contains fields outside the synthetic allowlist");
  }

  let privateRead;
  try {
    fs.readFileSync(request.probe.controllerPrivatePath);
    privateRead = { hostFileExists: request.probe.controllerPrivateFileExists, hostFileSha256: request.probe.controllerPrivateFileSha256, hostFileMounted: true, observedErrorCode: null };
  } catch (error) {
    privateRead = {
      hostFileExists: request.probe.controllerPrivateFileExists,
      hostFileSha256: request.probe.controllerPrivateFileSha256,
      hostFileMounted: false,
      observedErrorCode: errorCode(error),
    };
  }

  let unauthorizedWrite;
  let requestMountErrorCode = null;
  let reviewerCodeMountErrorCode = null;
  let requestBytesUnchanged = false;
  let reviewerCodeBytesUnchanged = false;
  const requestDigestBeforeWrite = sha256(requestBytes);
  let reviewerCodeDigestBeforeWrite = null;
  try {
    reviewerCodeDigestBeforeWrite = sha256(fs.readFileSync("/reviewer/reviewer.cjs"));
  } catch {
    reviewerCodeDigestBeforeWrite = null;
  }
  try {
    fs.appendFileSync(requestPath, "unauthorized");
  } catch (error) {
    requestMountErrorCode = errorCode(error);
  }
  try {
    fs.appendFileSync("/reviewer/reviewer.cjs", "unauthorized");
  } catch (error) {
    reviewerCodeMountErrorCode = errorCode(error);
  }
  try {
    requestBytesUnchanged = sha256(fs.readFileSync(requestPath)) === requestDigestBeforeWrite;
  } catch {
    requestBytesUnchanged = false;
  }
  try {
    reviewerCodeBytesUnchanged = sha256(fs.readFileSync("/reviewer/reviewer.cjs")) === reviewerCodeDigestBeforeWrite;
  } catch {
    reviewerCodeBytesUnchanged = false;
  }
  try {
    fs.writeFileSync("/tmp/ze14-unauthorized-write-" + request.probe.runNonce, "must-not-persist");
    unauthorizedWrite = { observedErrorCode: null, writeSucceeded: true };
  } catch (error) {
    unauthorizedWrite = { observedErrorCode: errorCode(error), writeSucceeded: false };
  }
  unauthorizedWrite.requestMountErrorCode = requestMountErrorCode;
  unauthorizedWrite.reviewerCodeMountErrorCode = reviewerCodeMountErrorCode;
  unauthorizedWrite.requestBytesUnchanged = requestBytesUnchanged;
  unauthorizedWrite.reviewerCodeBytesUnchanged = reviewerCodeBytesUnchanged;

  let outputMountWritable = false;
  try {
    fs.writeFileSync(outputPath + ".probe", "authorized-output-probe", { flag: "wx", mode: 0o600 });
    fs.unlinkSync(outputPath + ".probe");
    outputMountWritable = true;
  } catch {
    outputMountWritable = false;
  }
  unauthorizedWrite.outputMountWritable = outputMountWritable;

  const markerScan = scanProcessTableForMarker(request.probe.hostMarkerToken);
  let hostPidPathHasMarker = false;
  let hostPidPathPresent = false;
  try {
    const bytes = fs.readFileSync("/proc/" + request.probe.hostMarkerPid + "/cmdline");
    hostPidPathPresent = true;
    hostPidPathHasMarker = bytes.includes(Buffer.from(request.probe.hostMarkerToken));
  } catch {
    hostPidPathPresent = false;
  }
  const processVisibility = {
    hostMarkerVisible: markerScan.visible || hostPidPathHasMarker,
    hostMarkerTokenVisibleInProc: markerScan.visible,
    hostPidPathPresent,
    hostPidPathHasMarker,
    hostPid: request.probe.hostMarkerPid,
    scannedPidCount: markerScan.scannedPidCount,
    pidNamespaceDistinct: fs.readlinkSync("/proc/self/ns/pid") !== request.probe.hostPidNamespace,
  };

  const networkProbe = await probeNetwork();
  const network = {
    ...networkProbe,
    defaultRoutePresent: hasDefaultRoute(),
    networkNamespaceDistinct: fs.readlinkSync("/proc/self/ns/net") !== request.probe.hostNetworkNamespace,
  };
  const secretLikeKeys = Object.keys(process.env).filter((key) => SECRET_ENV_KEY.test(key)).sort();
  const credentialBoundary = {
    environmentKeys: Object.keys(process.env).sort(),
    secretLikeKeys,
    secretLikeKeysAbsent: secretLikeKeys.length === 0,
  };

  const observations = {
    authorizedInputRead: { succeeded: true, sha256: sha256(requestBytes), byteLength: requestBytes.byteLength },
    privateFileRead: privateRead,
    unauthorizedWrite,
    processVisibility,
    network,
    credentialBoundary,
    processIdentity: {
      uid: typeof process.getuid === "function" ? process.getuid() : null,
      gid: typeof process.getgid === "function" ? process.getgid() : null,
      pid: process.pid,
      pidNamespace: fs.readlinkSync("/proc/self/ns/pid"),
      networkNamespace: fs.readlinkSync("/proc/self/ns/net"),
      processCountVisibleInNamespace: processVisibility.scannedPidCount,
    },
    networkInterfaces: Object.keys(os.networkInterfaces()).sort(),
  };
  const result = inspectRequestAndBuildDecision(request, observations);
  const envelope = {
    schemaVersion: "ze14.m2-restricted-review-response.v0.2",
    executionKind: "DETERMINISTIC_SYNTHETIC_PROCESS_NOT_AI",
    decision: result.decision,
    diagnostics: result.diagnostics,
    probes: observations,
  };
  fs.writeFileSync(outputPath, JSON.stringify(envelope, null, 2) + "\n", { flag: "wx", mode: 0o600 });
  process.stdout.write(JSON.stringify({
    outputPath,
    outcome: result.decision.outcome,
    authorizedInputRead: observations.authorizedInputRead.succeeded,
    privateReadError: privateRead.observedErrorCode,
    writeError: unauthorizedWrite.observedErrorCode,
    hostMarkerVisible: processVisibility.hostMarkerVisible,
    networkError: network.errorCode,
    selectionUnchanged: result.decision.selectionFingerprintBefore === result.decision.selectionFingerprintAfter,
  }) + "\n");
};

function verifyDockerInspection(inspect, expected) {
  const failures = [];
  const host = inspect?.HostConfig ?? {};
  const config = inspect?.Config ?? {};
  const state = inspect?.State ?? {};
  const expectedMounts = expected?.mounts ?? [];
  const systemDestinations = new Set(["/etc/hosts", "/etc/hostname", "/etc/resolv.conf"]);

  if (host.ReadonlyRootfs !== true) failures.push("ROOT_FILESYSTEM_NOT_READ_ONLY");
  if (host.Privileged !== false) failures.push("CONTAINER_PRIVILEGED_OR_UNKNOWN");
  if (host.NetworkMode !== "none") failures.push("NETWORK_MODE_NOT_NONE");
  if (host.PidMode && host.PidMode !== "private") failures.push("HOST_PID_NAMESPACE_REQUESTED");
  if (host.IpcMode !== "private") failures.push("IPC_NAMESPACE_NOT_PRIVATE");
  if (host.PidsLimit !== 64) failures.push("PROCESS_LIMIT_NOT_APPLIED");
  if (host.Memory !== 268435456) failures.push("MEMORY_LIMIT_NOT_APPLIED");
  if (host.NanoCpus !== 1000000000) failures.push("CPU_LIMIT_NOT_APPLIED");
  if (!Array.isArray(host.CapDrop) || !host.CapDrop.includes("ALL")) failures.push("CAPABILITIES_NOT_DROPPED");
  if (Array.isArray(host.CapAdd) && host.CapAdd.length > 0) failures.push("CAPABILITIES_ADDED");
  if (!Array.isArray(host.SecurityOpt) || !host.SecurityOpt.some((item) => item === "no-new-privileges:true")) {
    failures.push("NO_NEW_PRIVILEGES_NOT_ENFORCED");
  }
  if (config.User !== expected?.user) failures.push("CONTAINER_USER_MISMATCH");
  if (config.Image !== expected?.imageTag) failures.push("CONTAINER_IMAGE_MISMATCH");
  if (inspect?.Image !== expected?.imageId) failures.push("CONTAINER_IMAGE_ID_MISMATCH");
  if (state.ExitCode !== 0) failures.push("CONTAINER_EXIT_NOT_ZERO");

  const env = Array.isArray(config.Env) ? config.Env : [];
  const imageEnv = Array.isArray(expected?.imageEnv) ? expected.imageEnv : [];
  const envKeys = env.map((entry) => entry.split("=", 1)[0]);
  if (envKeys.some((key) => SECRET_ENV_KEY.test(key))) failures.push("SECRET_LIKE_ENV_KEY_PRESENT");
  if ([...env].sort().join("\u0000") !== [...imageEnv].sort().join("\u0000")) failures.push("CONTAINER_ENV_DIFFERS_FROM_IMAGE_DEFAULTS");

  const mounts = Array.isArray(inspect?.Mounts) ? inspect.Mounts : [];
  for (const required of expectedMounts) {
    const matches = mounts.filter((mount) => mount.Destination === required.destination);
    if (matches.length !== 1) {
      failures.push("EXPECTED_MOUNT_MISSING_OR_DUPLICATED:" + required.destination);
      continue;
    }
    const mount = matches[0];
    if (mount.Type !== "bind" || mount.Source !== required.source) failures.push("EXPECTED_MOUNT_SOURCE_MISMATCH:" + required.destination);
    if (mount.RW !== required.writable) failures.push("EXPECTED_MOUNT_ACCESS_MISMATCH:" + required.destination);
  }
  const expectedDestinations = new Set(expectedMounts.map((mount) => mount.destination));
  const unexpectedBinds = mounts.filter((mount) => mount.Type === "bind" &&
    !expectedDestinations.has(mount.Destination) && !systemDestinations.has(mount.Destination));
  if (unexpectedBinds.length > 0) failures.push("UNEXPECTED_HOST_BIND_MOUNT_PRESENT");

  const privatePath = expected?.privateFilePath ? path.resolve(expected.privateFilePath) : null;
  const privateFileExposed = privatePath !== null && mounts.some((mount) => {
    if (mount.Type !== "bind" || typeof mount.Source !== "string") return false;
    const source = path.resolve(mount.Source);
    return privatePath === source || privatePath.startsWith(source + path.sep);
  });
  if (privateFileExposed) failures.push("CONTROLLER_PRIVATE_FILE_MOUNTED");

  return {
    status: failures.length === 0 ? "PASS" : "FAIL",
    failures,
    controllerPrivateFileExposedByMount: privateFileExposed,
    configuration: {
      readonlyRootfs: host.ReadonlyRootfs === true,
      privileged: host.Privileged === true,
      networkMode: host.NetworkMode ?? null,
      pidMode: host.PidMode || "private-default",
      ipcMode: host.IpcMode ?? null,
      pidsLimit: host.PidsLimit ?? null,
      memoryLimitBytes: host.Memory ?? null,
      nanoCpus: host.NanoCpus ?? null,
      capDrop: host.CapDrop ?? [],
      capAdd: host.CapAdd ?? [],
      securityOptions: host.SecurityOpt ?? [],
      user: config.User ?? null,
      image: config.Image ?? null,
      imageId: inspect?.Image ?? null,
      environmentKeys: envKeys.sort(),
      environmentMatchesImageDefaults: [...env].sort().join("\u0000") === [...imageEnv].sort().join("\u0000"),
      explicitMounts: expectedMounts.map((mount) => ({ ...mount })),
      dockerManagedSystemMounts: mounts.filter((mount) => systemDestinations.has(mount.Destination)).map((mount) => ({
        destination: mount.Destination,
        type: mount.Type,
        writable: mount.RW,
      })),
      otherRuntimeMounts: mounts.filter((mount) => !expectedDestinations.has(mount.Destination) && !systemDestinations.has(mount.Destination)).map((mount) => ({
        destination: mount.Destination,
        type: mount.Type,
        writable: mount.RW,
      })),
      unexpectedBindMountCount: unexpectedBinds.length,
      exitCode: state.ExitCode ?? null,
    },
  };
}

module.exports = { inspectRequestAndBuildDecision, verifyDockerInspection, canonical, sha256 };

if (require.main === module) {
  run().catch((error) => {
    process.stderr.write("restricted reviewer failed: " + (error?.message || "UNKNOWN_ERROR") + "\n");
    process.exitCode = 1;
  });
}
