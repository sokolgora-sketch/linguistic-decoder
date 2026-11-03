#!/usr/bin/env node
import { createHash, randomUUID } from "node:crypto";
import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { execFileSync, spawn } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { verifyDockerInspection } = require("./m2SoloAiRestrictedReviewer.v0_2.cjs");
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const RUNNER = join(ROOT, "scripts/openInstrument/m2SoloAiReviewWorkflow.v0_1.ts");
const TSX = join(ROOT, "node_modules/tsx/dist/cli.mjs");
const REVIEWER_SOURCE = join(ROOT, "scripts/openInstrument/m2SoloAiRestrictedReviewer.v0_2.cjs");
const IMAGE = "node:20-bookworm-slim";
const PRIVATE_CONTAINER_PATH = "/controller-private/private.json";
const BLIND_KEYS = [
  "schemaVersion", "caseOpaqueId", "structuralEmbryo", "structuralFingerprint", "voicePath",
  "sourceUniverseId", "searchPolicyId", "stopRuleId", "claimBoundary", "targetRevealStatus",
];
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = (path, value) => writeFileSync(path, json(value), { flag: "w", mode: 0o600 });
const run = (command, args, options = {}) => execFileSync(command, args, {
  cwd: options.cwd ?? ROOT,
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"],
  ...options,
});
const readLastJsonLine = (value) => {
  const line = value.trim().split(/\r?\n/u).at(-1);
  if (!line) throw new Error("command produced no JSON result line");
  return JSON.parse(line);
};

function runExistingWorkflow(tempRoot, decisionPath = null) {
  const packetPath = join(tempRoot, `v0_1-packet-${randomUUID()}.json`);
  const args = [TSX, RUNNER, `--out=${packetPath}`];
  if (decisionPath) args.push(`--review-decision=${decisionPath}`);
  const stdout = run(process.execPath, args);
  const packet = JSON.parse(readFileSync(packetPath, "utf8"));
  rmSync(packetPath, { force: true });
  return { packet, runnerSummary: readLastJsonLine(stdout) };
}

function makeReviewerRequest(packet, hostProbe, privateBytes) {
  const projection = packet.aiReviewerInput;
  const request = packet.reviewRequest;
  if (!projection || !request || packet.packetClassification !== "SYNTHETIC_REHEARSAL_ONLY") {
    throw new Error("existing v0.1 runner did not produce its expected synthetic reviewer packet");
  }
  const source = projection.evidenceIntegrity.find((item) => item.artifactId === "source-1");
  const inventory = projection.evidenceIntegrity.find((item) => item.artifactId === "inventory-1");
  if (!source || !inventory) throw new Error("synthetic source and exclusion artifact commitments are missing");
  const materials = [
    {
      artifactId: "source-1",
      bytesBase64: Buffer.from("synthetic-source-bytes-v0.1").toString("base64"),
      expectedSha256: source.expectedSha256,
      expectedByteLength: source.expectedByteLength,
    },
    {
      artifactId: "inventory-1",
      bytesBase64: Buffer.from("synthetic-exclusion-inventory-v0.1").toString("base64"),
      expectedSha256: inventory.expectedSha256,
      expectedByteLength: inventory.expectedByteLength,
    },
  ];
  const reviewerRequest = {
    schemaVersion: "ze14.m2-restricted-review-request.v0.2",
    reviewerProjection: projection,
    reviewRequest: {
      reviewerInputSha256: request.reviewerInputSha256,
      reviewedArtifactSha256s: request.reviewedArtifactSha256s,
      selectionFingerprint: request.selectionFingerprint,
      machineCheckStatuses: request.machineCheckStatuses,
    },
    artifactMaterials: materials,
    probe: {
      controllerPrivatePath: PRIVATE_CONTAINER_PATH,
      controllerPrivateFileExists: hostProbe.privateFileExists,
      controllerPrivateFileSha256: hostProbe.privateFileSha256,
      hostMarkerPid: hostProbe.markerPid,
      hostMarkerToken: hostProbe.markerToken,
      hostPidNamespace: hostProbe.pidNamespace,
      hostNetworkNamespace: hostProbe.networkNamespace,
      runNonce: hostProbe.runNonce,
    },
  };
  const bytes = Buffer.from(json(reviewerRequest));
  if (bytes.includes(privateBytes)) throw new Error("controller-private fixture bytes leaked into reviewer input");
  const blindPayload = projection.blindPayload;
  const blindKeySetValid = blindPayload && Object.keys(blindPayload).sort().join("\u0000") === [...BLIND_KEYS].sort().join("\u0000");
  if (!blindKeySetValid || blindPayload.targetRevealStatus !== "FORBIDDEN_UNTIL_REVEAL_GATE") {
    throw new Error("reviewer input did not preserve the target-free blind payload contract");
  }
  return { request: reviewerRequest, bytes, sha256: sha256(bytes), privateBytesAbsent: true };
}

function dockerMount(source, destination, writable) {
  if (source.includes(",")) throw new Error("Docker bind source contains an unsupported comma");
  return `type=bind,source=${source},target=${destination}${writable ? "" : ",readonly"}`;
}

function runRestrictedReviewer({ request, reviewerPath, outputDir, privateFilePath, imageId, imageEnv, runName }) {
  const requestPath = join(dirname(outputDir), `${outputDir.split("/").at(-1)}-request.json`);
  const outputPath = join(outputDir, "response.json");
  const cidPath = join(dirname(outputDir), "container.cid");
  const uid = typeof process.getuid === "function" ? process.getuid() : null;
  const gid = typeof process.getgid === "function" ? process.getgid() : null;
  if (!Number.isInteger(uid) || !Number.isInteger(gid) || uid === 0) throw new Error("host runner lacks a non-root numeric uid/gid");
  writeFileSync(requestPath, request.bytes, { mode: 0o400, flag: "wx" });
  chmodSync(requestPath, 0o400);
  mkdirSync(outputDir, { recursive: true, mode: 0o700 });
  chmodSync(outputDir, 0o700);
  const requestSource = realpathSync(requestPath);
  const reviewerSource = realpathSync(reviewerPath);
  const outputSource = realpathSync(outputDir);
  const mounts = [
    { destination: "/reviewer/request.json", source: requestSource, writable: false },
    { destination: "/reviewer/reviewer.cjs", source: reviewerSource, writable: false },
    { destination: "/reviewer/output", source: outputSource, writable: true },
  ];
  const args = [
    "run", "--cidfile", cidPath, "--name", runName,
    "--read-only", "--cap-drop=ALL", "--security-opt=no-new-privileges:true",
    "--network=none", "--ipc=private", "--pids-limit=64", "--memory=256m", "--cpus=1",
    "--user", `${uid}:${gid}`,
    "--mount", dockerMount(requestSource, "/reviewer/request.json", false),
    "--mount", dockerMount(reviewerSource, "/reviewer/reviewer.cjs", false),
    "--mount", dockerMount(outputSource, "/reviewer/output", true),
    IMAGE, "node", "/reviewer/reviewer.cjs",
    "--request=/reviewer/request.json", "--output=/reviewer/output/response.json",
  ];
  let dockerRunExitCode = 0;
  let dockerStdout = "";
  let dockerStderr = "";
  try {
    dockerStdout = run("docker", args);
  } catch (error) {
    dockerRunExitCode = Number.isInteger(error?.status) ? error.status : 1;
    dockerStdout = Buffer.isBuffer(error?.stdout) ? error.stdout.toString("utf8") : String(error?.stdout ?? "");
    dockerStderr = Buffer.isBuffer(error?.stderr) ? error.stderr.toString("utf8") : String(error?.stderr ?? error?.message ?? "");
  }
  let inspectResult = null;
  let dockerInspectError = null;
  let containerId = null;
  if (existsSync(cidPath)) {
    containerId = readFileSync(cidPath, "utf8").trim();
    try {
      inspectResult = JSON.parse(run("docker", ["inspect", containerId]))[0] ?? null;
    } catch (error) {
      dockerInspectError = String(error?.stderr ?? error?.message ?? "docker inspect failed").slice(0, 500);
    }
    try { run("docker", ["rm", "--force", containerId]); } catch { /* preserve earlier evidence */ }
  }
  const inspection = inspectResult ? verifyDockerInspection(inspectResult, {
    imageTag: IMAGE,
    imageId,
    imageEnv,
    user: `${uid}:${gid}`,
    mounts,
    privateFilePath,
  }) : { status: "FAIL", failures: ["DOCKER_INSPECTION_UNAVAILABLE"], configuration: null };
  let response = null;
  let responseBytes = null;
  if (existsSync(outputPath)) {
    responseBytes = readFileSync(outputPath);
    try { response = JSON.parse(responseBytes.toString("utf8")); } catch { response = null; }
  }
  return {
    containerId,
    dockerRunExitCode,
    dockerStdout: dockerStdout.trim().slice(0, 1000),
    dockerStderr: dockerStderr.trim().slice(0, 1000),
    dockerInspectError,
    inspection,
    response,
    responseBytes,
    responseSha256: responseBytes ? sha256(responseBytes) : null,
    responseByteLength: responseBytes?.byteLength ?? null,
  };
}

function cleanDecisionFile(path) { rmSync(path, { force: true }); }

async function main() {
  const evidencePath = process.env.ZE14_ISOLATION_EVIDENCE_PATH;
  const preflightPath = process.env.ZE14_DOCKER_PREFLIGHT_PATH;
  if (!evidencePath || !preflightPath) throw new Error("hosted Docker preflight and evidence paths are required");
  const preflight = JSON.parse(readFileSync(preflightPath, "utf8"));
  if (preflight.status !== "PASS") throw new Error("Docker client/daemon preflight did not pass");
  mkdirSync(dirname(evidencePath), { recursive: true });
  const tempRoot = mkdtempSync(join(tmpdir(), "ze14-hosted-isolation-"));
  const privateDir = join(tempRoot, "controller-private");
  const privateFilePath = join(privateDir, "private-fixture.json");
  const privateBytes = Buffer.from(JSON.stringify({ fixture: "synthetic-private-controller-data-v0.2", targetSemantics: "NOT_PRESENT" }) + "\n");
  mkdirSync(privateDir, { mode: 0o700 });
  writeFileSync(privateFilePath, privateBytes, { mode: 0o600, flag: "wx" });
  const runNonce = randomUUID().replaceAll("-", "");
  const markerToken = `ze14-host-private-process-${runNonce}`;
  const marker = spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)", markerToken], {
    stdio: "ignore",
    env: { PATH: process.env.PATH ?? "/usr/bin:/bin" },
  });
  let finalEvidence = {
    schemaVersion: "ze14.hosted-isolation-evidence.v0.2",
    classification: {
      PROCESS_ISOLATION: "NOT_RUN",
      AI_REVIEW_EXECUTED: "NOT_RUN",
      SYNTHETIC_REVIEW_RESULT: "UNKNOWN",
      REAL_M2_READINESS: "UNKNOWN",
    },
    dockerPreflight: preflight,
    controller: { syntheticOnly: true, realTargetOrSourceDataUsed: false },
  };
  try {
    if (marker.pid === undefined) throw new Error("host marker process did not start");
    const markerDeadline = Date.now() + 3000;
    while (!existsSync(`/proc/${marker.pid}/cmdline`) && Date.now() < markerDeadline) {
      await new Promise((resolvePromise) => setTimeout(resolvePromise, 25));
    }
    if (!existsSync(`/proc/${marker.pid}/cmdline`)) throw new Error("host marker process was not observable before container launch");
    const hostProbe = {
      privateFileExists: statSync(privateFilePath).isFile(),
      privateFileSha256: sha256(readFileSync(privateFilePath)),
      markerPid: marker.pid,
      markerToken,
      pidNamespace: readlinkSync(`/proc/${marker.pid}/ns/pid`),
      networkNamespace: readlinkSync("/proc/self/ns/net"),
      runNonce,
    };
    if (!hostProbe.privateFileExists || hostProbe.privateFileSha256 !== sha256(privateBytes)) {
      throw new Error("host controller-private synthetic fixture existence/hash verification failed");
    }
    const baseRun = runExistingWorkflow(tempRoot);
    const packet = baseRun.packet;
    if (packet.result !== "UNKNOWN" || packet.aiReview?.evaluation?.status !== "UNKNOWN") {
      throw new Error("existing v0.1 runner did not produce the expected missing-response UNKNOWN baseline");
    }
    const reviewerRequest = makeReviewerRequest(packet, hostProbe, privateBytes);
    const sourceCodeBytes = readFileSync(REVIEWER_SOURCE);
    const copiedReviewer = join(tempRoot, "reviewer.cjs");
    copyFileSync(REVIEWER_SOURCE, copiedReviewer);
    chmodSync(copiedReviewer, 0o400);
    if (sha256(readFileSync(copiedReviewer)) !== sha256(sourceCodeBytes)) throw new Error("reviewer executable copy hash mismatch");

    run("docker", ["pull", IMAGE]);
    const imageInspect = JSON.parse(run("docker", ["image", "inspect", IMAGE]))[0];
    const imageEnv = imageInspect?.Config?.Env ?? [];
    const mainDir = join(tempRoot, "main-output");
    mkdirSync(mainDir, { mode: 0o700 });
    const mainResult = runRestrictedReviewer({
      request: reviewerRequest,
      reviewerPath: copiedReviewer,
      outputDir: mainDir,
      privateFilePath,
      imageId: imageInspect.Id,
      imageEnv,
      runName: `ze14-reviewer-${runNonce.slice(0, 10)}`,
    });
    if (mainResult.dockerRunExitCode !== 0 || mainResult.inspection.status !== "PASS" ||
        mainResult.response?.schemaVersion !== "ze14.m2-restricted-review-response.v0.2" ||
        mainResult.response?.executionKind !== "DETERMINISTIC_SYNTHETIC_PROCESS_NOT_AI") {
      throw new Error("restricted reviewer execution or Docker configuration verification failed");
    }
    const mainEnvelope = mainResult.response;
    const mainDecisionPath = join(tempRoot, "valid-decision.json");
    writeJson(mainDecisionPath, mainEnvelope.decision);
    const validRunner = runExistingWorkflow(tempRoot, mainDecisionPath);

    const tamperedRequest = structuredClone(reviewerRequest);
    tamperedRequest.request.reviewerProjection.accessBoundary.canChangeCandidateSelection = true;
    tamperedRequest.bytes = Buffer.from(json(tamperedRequest.request));
    tamperedRequest.sha256 = sha256(tamperedRequest.bytes);
    const tamperedDir = join(tempRoot, "tampered-output");
    mkdirSync(tamperedDir, { mode: 0o700 });
    const tamperedRun = runRestrictedReviewer({
      request: tamperedRequest,
      reviewerPath: copiedReviewer,
      outputDir: tamperedDir,
      privateFilePath,
      imageId: imageInspect.Id,
      imageEnv,
      runName: `ze14-tampered-${runNonce.slice(0, 10)}`,
    });
    const tamperedDecisionPath = join(tempRoot, "tampered-decision.json");
    if (tamperedRun.response?.decision) writeJson(tamperedDecisionPath, tamperedRun.response.decision);
    const tamperedRunner = existsSync(tamperedDecisionPath)
      ? runExistingWorkflow(tempRoot, tamperedDecisionPath)
      : null;

    const selectionOverridePath = join(tempRoot, "selection-override.json");
    const selectionOverride = { ...mainEnvelope.decision, selectedOpaqueCandidateId: "m2:reviewer-selected" };
    writeJson(selectionOverridePath, selectionOverride);
    const selectionOverrideRunner = runExistingWorkflow(tempRoot, selectionOverridePath);
    const blindKeys = Object.keys(packet.blindResearchHandoff?.payload ?? {}).sort();
    const blindHandoffValid = blindKeys.join("\u0000") === [...BLIND_KEYS].sort().join("\u0000") &&
      packet.blindResearchHandoff?.targetSemanticsProvided === false &&
      packet.blindResearchHandoff?.selectionControlProvided === false &&
      packet.blindResearchHandoff?.m3ExecutionPerformed === false;
    const selectionUnchanged = packet.selection?.unchanged === true &&
      mainEnvelope.decision.selectionFingerprintBefore === packet.reviewRequest.selectionFingerprint &&
      mainEnvelope.decision.selectionFingerprintAfter === packet.reviewRequest.selectionFingerprint &&
      !("selectedOpaqueCandidateId" in mainEnvelope.decision);
    const processIsolationPass = mainResult.dockerRunExitCode === 0 && mainResult.inspection.status === "PASS" &&
      mainEnvelope.diagnostics?.operationalBoundaryPass === true &&
      tamperedRun.dockerRunExitCode === 0 && tamperedRun.inspection.status === "PASS" &&
      tamperedRun.response?.diagnostics?.operationalBoundaryPass === true;
    const syntheticWorkflowPass = mainEnvelope.decision.outcome === "PASS" &&
      validRunner.packet.aiReview?.evaluation?.status === "PASS" &&
      tamperedRun.dockerRunExitCode === 0 && tamperedRun.inspection.status === "PASS" &&
      tamperedRun.response?.decision?.outcome === "FAIL" &&
      tamperedRunner?.packet.aiReview?.evaluation?.status === "FAIL" &&
      tamperedRunner?.packet.aiReview?.evaluation?.reasonCodes?.includes("REVIEW_INPUT_HASH_MISMATCH") === true &&
      selectionOverrideRunner.packet.aiReview?.evaluation?.status === "FAIL" &&
      selectionOverrideRunner.packet.aiReview?.evaluation?.reasonCodes?.includes("REVIEW_DECISION_SCHEMA_INVALID") === true &&
      blindHandoffValid && selectionUnchanged &&
      packet.frozenContract?.executionAuthorized === false &&
      packet.frozenContract?.realTargetSelected === false;
    const executionChecksPass = processIsolationPass && syntheticWorkflowPass;
    const sourceMaterials = mainEnvelope.diagnostics?.recomputedMaterials ?? [];
    finalEvidence = {
      schemaVersion: "ze14.hosted-isolation-evidence.v0.2",
      classification: {
        PROCESS_ISOLATION: processIsolationPass ? "PASS" : "FAIL",
        AI_REVIEW_EXECUTED: "NOT_RUN",
        SYNTHETIC_REVIEW_RESULT: syntheticWorkflowPass ? "PASS" : "FAIL",
        REAL_M2_READINESS: "UNKNOWN",
      },
      environment: {
        runnerOs: process.platform,
        runnerArch: process.arch,
        githubRunnerImage: process.env.ImageOS ?? null,
        dockerPreflight: preflight,
        dockerImage: {
          requestedTag: IMAGE,
          imageId: imageInspect.Id,
          repoDigests: imageInspect.RepoDigests ?? [],
          configEnvironmentKeys: imageEnv.map((entry) => entry.split("=", 1)[0]).sort(),
        },
      },
      controller: {
        syntheticOnly: true,
        realTargetOrSourceDataUsed: false,
        privateFixture: {
          existsOnHost: hostProbe.privateFileExists,
          byteLength: privateBytes.byteLength,
          sha256: hostProbe.privateFileSha256,
          bytesPassedToReviewer: false,
          mounted: false,
        },
        reviewerExecutable: {
          sourceRelativePath: "scripts/openInstrument/m2SoloAiRestrictedReviewer.v0_2.cjs",
          sha256: sha256(sourceCodeBytes),
          stagedCopySha256: sha256(readFileSync(copiedReviewer)),
          repositoryMounted: false,
        },
        reviewerInput: {
          sha256: reviewerRequest.sha256,
          byteLength: reviewerRequest.bytes.byteLength,
          privateFixtureBytesAbsent: reviewerRequest.privateBytesAbsent,
          targetFreeBlindPayload: blindHandoffValid,
          recomputedProjectionSha256: mainEnvelope.diagnostics?.recomputedProjectionSha256 ?? null,
          recomputedSyntheticMaterials: sourceMaterials,
          hashScope: "reviewer projection plus the two supplied synthetic source/inventory materials; other v0.1 packet artifacts remain controller-verified and hash-bound but are not independently byte-recomputed inside the container",
        },
      },
      executions: {
        validReview: {
          dockerRunExitCode: mainResult.dockerRunExitCode,
          dockerInspectError: mainResult.dockerInspectError,
          isolationInspection: mainResult.inspection,
          responseSha256: mainResult.responseSha256,
          responseByteLength: mainResult.responseByteLength,
          responseEnvelope: mainEnvelope,
          existingV0_1Verifier: {
            packetResult: validRunner.packet.result,
            evaluation: validRunner.packet.aiReview.evaluation,
          },
        },
        tamperedInput: {
          inputHashMatchesOriginal: tamperedRun.response?.diagnostics?.recomputedProjectionSha256 === packet.reviewRequest.reviewerInputSha256,
          reviewerOutcome: tamperedRun.response?.decision?.outcome ?? "NO_RESPONSE",
          dockerRunExitCode: tamperedRun.dockerRunExitCode,
          isolationInspection: tamperedRun.inspection,
          responseSha256: tamperedRun.responseSha256,
          existingV0_1VerifierStatus: tamperedRunner?.packet.aiReview?.evaluation?.status ?? "UNKNOWN",
          existingV0_1VerifierReasonCodes: tamperedRunner?.packet.aiReview?.evaluation?.reasonCodes ?? [],
          expectedFailureCode: "REVIEW_INPUT_HASH_MISMATCH",
        },
        missingResponse: {
          existingV0_1VerifierStatus: baseRun.packet.aiReview.evaluation.status,
          expected: "UNKNOWN",
        },
        selectionOverride: {
          reviewerSelectionFieldInjected: true,
          existingV0_1VerifierStatus: selectionOverrideRunner.packet.aiReview.evaluation.status,
          existingV0_1VerifierReasonCodes: selectionOverrideRunner.packet.aiReview.evaluation.reasonCodes,
          expected: "FAIL",
        },
      },
      verification: {
        processIsolationPass,
        syntheticWorkflowPass,
        completeRehearsalPass: executionChecksPass,
      },
      processProbes: mainEnvelope.probes,
      selection: {
        fingerprint: packet.reviewRequest.selectionFingerprint,
        before: mainEnvelope.decision.selectionFingerprintBefore,
        after: mainEnvelope.decision.selectionFingerprintAfter,
        unchanged: selectionUnchanged,
        reviewerCanReturnSelectedId: "NO",
      },
      blindResearchHandoff: {
        status: packet.blindResearchHandoff.status,
        allowedKeys: blindKeys,
        targetSemanticsProvided: packet.blindResearchHandoff.targetSemanticsProvided,
        sourceIdentityProvided: packet.blindResearchHandoff.sourceIdentityProvided,
        selectionControlProvided: packet.blindResearchHandoff.selectionControlProvided,
        m3ExecutionPerformed: packet.blindResearchHandoff.m3ExecutionPerformed,
      },
      limitations: [
        "The restricted process produced a deterministic synthetic decision, not an AI assessment.",
        "The inherited v0.1 decision schema labels this a solo AI review workflow; its PASS here is only a contract evaluation of caller-declared synthetic process output.",
        "No real candidate intake, HMAC key, target selection, M3 research, or reveal occurred.",
        "The reviewer independently recomputed the projection and the supplied synthetic source/inventory hashes; other artifacts were verified by the v0.1 controller and their hashes were bound into the reviewer request.",
        "Docker isolation evidence applies to this GitHub-hosted Ubuntu runner and does not establish real M2 readiness or protection against host-kernel vulnerabilities.",
      ],
    };
    writeJson(evidencePath, finalEvidence);
    if (!executionChecksPass) process.exitCode = 1;
    cleanDecisionFile(mainDecisionPath);
    cleanDecisionFile(tamperedDecisionPath);
    cleanDecisionFile(selectionOverridePath);
  } finally {
    marker.kill("SIGTERM");
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  const evidencePath = process.env.ZE14_ISOLATION_EVIDENCE_PATH;
  if (evidencePath) {
    try {
      writeJson(evidencePath, {
        schemaVersion: "ze14.hosted-isolation-evidence.v0.2",
        classification: {
          PROCESS_ISOLATION: "BLOCKED",
          AI_REVIEW_EXECUTED: "NOT_RUN",
          SYNTHETIC_REVIEW_RESULT: "UNKNOWN",
          REAL_M2_READINESS: "UNKNOWN",
        },
        error: { name: error?.name ?? "Error", message: String(error?.message ?? error).slice(0, 500) },
        dockerPreflightPath: process.env.ZE14_DOCKER_PREFLIGHT_PATH ?? null,
      });
    } catch { /* workflow retains its preflight artifact if evidence cannot be replaced */ }
  }
  process.stderr.write(`hosted isolation rehearsal failed: ${String(error?.message ?? error).slice(0, 500)}\n`);
  process.exitCode = 1;
});
