import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const packagePath = resolve(root, "docs/open-instrument/research-artifacts/m6-one-embryo-proof-v1/one-embryo-proof-v1.archival.json");
const manifestPath = resolve(root, "docs/open-instrument/research-artifacts/m6-one-embryo-proof-v1/hash-manifest.json");

export function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

export function verifyM6DurabilityPackage() {
  if (!existsSync(packagePath)) throw new Error(`missing archival artifact: ${packagePath}`);
  if (!existsSync(manifestPath)) throw new Error(`missing hash manifest: ${manifestPath}`);
  const archive = JSON.parse(readFileSync(packagePath, "utf8"));
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (archive.experiment.result !== "INSUFFICIENT_CORRESPONDENCE") throw new Error("classification drift");
  if (archive.originalRecovery.exactOriginalBytesRecovered !== false) throw new Error("original recovery flag drift");
  if (archive.originalRecovery.originalHashesIndependentlyVerifiedNow !== false) throw new Error("unrecovered original marked independently verified");
  if (!archive.claimBoundaries.includes("RESEARCH_ONLY") || !archive.claimBoundaries.includes("NON_PRODUCTION")) throw new Error("claim boundary missing");
  const actualSha256 = sha256File(packagePath);
  const actualByteLength = readFileSync(packagePath).byteLength;
  const entry = manifest.artifacts.find((item) => item.artifactId === "m6.archival.experiment-record");
  if (!entry) throw new Error("archival manifest entry missing");
  const expectedOriginalIds = ["m2.target-pool", "m2.controller", "m2.blind-payload", "m2.preregistration", "m3.pre-reveal", "m5.post-reveal"];
  if (manifest.reportedOriginals.length !== expectedOriginalIds.length || expectedOriginalIds.some((id, index) => manifest.reportedOriginals[index].artifactId !== id)) throw new Error("reported original manifest entries mismatch");
  for (const original of manifest.reportedOriginals) {
    if (original.originalBytesRecovered !== false || original.originalSha256IndependentlyVerifiedNow !== false) throw new Error(`reported original falsely verified: ${original.artifactId}`);
    if (original.archivalRepresentationByteLength !== actualByteLength || original.archivalRepresentationSha256 !== actualSha256) throw new Error(`archival relationship mismatch: ${original.artifactId}`);
  }
  if (entry.archivalSha256 !== actualSha256) throw new Error("archival SHA mismatch");
  if (entry.archivalByteLength !== actualByteLength) throw new Error("archival byte length mismatch");
  if (entry.originalBytesRecovered !== false || entry.originalSha256IndependentlyVerifiedNow !== false) throw new Error("manifest falsely verifies original bytes");
  return { actualSha256, actualByteLength, artifactCount: manifest.artifacts.length, reportedOriginalCount: manifest.reportedOriginals.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(verifyM6DurabilityPackage()));
}
