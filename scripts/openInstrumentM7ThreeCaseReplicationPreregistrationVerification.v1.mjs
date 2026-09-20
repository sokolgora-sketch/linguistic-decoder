import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const dir = resolve(root, "docs/open-instrument/research-artifacts/m7-three-case-replication-v1");
const artifactPath = resolve(dir, "preregistration.json");
const manifestPath = resolve(dir, "hash-manifest.json");

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const canonical = (value) => JSON.stringify(value);
const without = (value, key) => Object.fromEntries(Object.entries(value).filter(([name]) => name !== key));

export function verifyM7Preregistration() {
  const artifactBytes = readFileSync(artifactPath);
  const artifact = JSON.parse(artifactBytes.toString("utf8"));
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (artifact.experimentId !== "open-instrument-m7-three-case-replication-v1") throw new Error("experiment identity mismatch");
  if (artifact.status !== "PREREGISTERED_BEFORE_BLIND_RESEARCH") throw new Error("preregistration status mismatch");
  if (artifact.protocolIntegrity.embryoResearchPerformed !== false || artifact.protocolIntegrity.blindRunsPerformed !== false) throw new Error("research contamination flag");
  if (artifact.selectedControllers.length !== 3 || artifact.blindPayloads.length !== 3) throw new Error("replication size mismatch");
  if (artifact.firstExperimentExclusion.targetWord !== "support" || artifact.firstExperimentExclusion.embryo !== "UPP") throw new Error("first experiment exclusion mismatch");
  const forbiddenPayloadKeys = ["targetWord","partOfSpeech","targetSenseId","targetSenseDefinition","targetSenseLocator","expansionChain","translation","etymology","expectedFunction","operationIds"];
  for (const payload of artifact.blindPayloads) {
    for (const key of forbiddenPayloadKeys) if (Object.hasOwn(payload, key)) throw new Error(`blind payload leakage: ${key}`);
    if (!payload.embryo || !payload.replicationSlot) throw new Error("blind payload incomplete");
  }
  const controllerHashes = artifact.selectedControllers.map((controller) => sha256(Buffer.from(canonical(without(controller, "controllerSha256")), "utf8")));
  const blindHashes = artifact.blindPayloads.map((payload) => sha256(Buffer.from(canonical(without(payload, "blindPayloadSha256")), "utf8")));
  const candidatePoolSha256 = sha256(Buffer.from(canonical(artifact.frozenCandidatePool), "utf8"));
  const artifactSha256 = sha256(artifactBytes);
  if (manifest.artifactByteLength !== artifactBytes.byteLength || manifest.artifactSha256 !== artifactSha256) throw new Error("artifact manifest mismatch");
  if (manifest.candidatePoolSha256 !== candidatePoolSha256) throw new Error("candidate pool hash mismatch");
  if (JSON.stringify(manifest.controllerSha256) !== JSON.stringify(controllerHashes)) throw new Error("controller hash mismatch");
  if (JSON.stringify(manifest.blindPayloadSha256) !== JSON.stringify(blindHashes)) throw new Error("blind payload hash mismatch");
  if (artifact.selectedControllers.some((c, i) => c.controllerSha256 !== controllerHashes[i])) throw new Error("controller embedded hash mismatch");
  if (artifact.blindPayloads.some((p, i) => p.blindPayloadSha256 !== blindHashes[i])) throw new Error("blind embedded hash mismatch");
  return { artifactByteLength: artifactBytes.byteLength, artifactSha256, candidatePoolSha256, controllerHashes, blindHashes, selectedWords: artifact.selectedControllers.map((c) => c.targetWord) };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(verifyM7Preregistration()));
