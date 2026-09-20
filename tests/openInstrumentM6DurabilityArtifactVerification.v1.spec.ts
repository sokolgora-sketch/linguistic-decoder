import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { verifyM6DurabilityPackage } from "../scripts/openInstrumentM6DurabilityArtifactVerification.v1.mjs";

const root = process.cwd();
const manifestPath = resolve(root, "docs/open-instrument/research-artifacts/m6-one-embryo-proof-v1/hash-manifest.json");

describe("Open Instrument M6 durability artifact", () => {
  test("verifies archival bytes, manifest linkage, and research-only boundaries", () => {
    expect(verifyM6DurabilityPackage()).toMatchObject({ artifactCount: 1, reportedOriginalCount: 6 });
  });

  test("keeps reported original hashes distinct from archival hashes", () => {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    const entry = manifest.artifacts[0];
    expect(entry.reportedOriginalSha256).not.toBe(entry.archivalSha256);
    expect(entry.originalBytesRecovered).toBe(false);
    expect(entry.originalSha256IndependentlyVerifiedNow).toBe(false);
  });
});
