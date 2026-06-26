import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const repoRoot = path.resolve(__dirname, "..");
const harness = path.join(
  repoRoot,
  "scripts/openInstrumentAnalyzeV1StableRegressionFingerprint.v0.1.mjs",
);
const fixtureDir = path.join(
  repoRoot,
  "tests/fixtures/openInstrument/analyze-v1/post-ssot-word-regression-v0.1",
);
const harnessReview = path.join(
  repoRoot,
  "docs/open-instrument/reviews/analyze-v1-stable-regression-fingerprint-harness-implementation-review-v0.1.md",
);
const evidenceReview = path.join(
  repoRoot,
  "docs/open-instrument/reviews/post-ssot-word-regression-pack-review-v0.1.md",
);

const expectedCases = [
  {
    word: "study",
    fixture: "study.run1.raw.json",
    expectedSha:
      "2f1d1436923f0992cecaa3c94b9b06e899e167a0ef2fd7be2b7a94c8bd3893ec",
    primaryBasis: "UI",
    principlesPath: "UNITY",
  },
  {
    word: "damage",
    fixture: "damage.run1.raw.json",
    expectedSha:
      "184eb8df2b5ebeae007ecafece6fc1a71d7b24eef9c2e4a5253ee238d12687cb",
    primaryBasis: "AE",
    principlesPath: "TRUTH",
  },
  {
    word: "mystery",
    fixture: "mystery.run1.raw.json",
    expectedSha:
      "2092a448486243b7d84843a6b8a83ccd91f33580692a0cfa42de86698f07ecd1",
    primaryBasis: "YEI",
    principlesPath: "REFLECTION",
  },
  {
    word: "water",
    fixture: "water.run1.raw.json",
    expectedSha:
      "364d3d6ee689dff3a88cf9168939902c5dd6fe4252ddfab08c2dc2a63f46756d",
    primaryBasis: "AE",
    principlesPath: "TRUTH",
  },
] as const;

function runHarness(inputPath: string, outputPath: string): {
  schemaVersion: string;
  inputPath: string;
  outputPath: string;
  sha256: string;
  volatileTimestampFieldsRemoved: string[];
} {
  return JSON.parse(
    execFileSync(process.execPath, [harness, inputPath, "--out", outputPath], {
      cwd: repoRoot,
      encoding: "utf8",
    }),
  );
}

describe("analyze-v1 stable fingerprint fixture regression v0.1", () => {
  let tempDir = "";

  beforeEach(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), "analyze-v1-fixture-regression-"));
  });

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { force: true, recursive: true });
    }
  });

  it("is cleared by the reviewed harness and reviewed post-SSOT pack", () => {
    const harnessText = readFileSync(harnessReview, "utf8");
    const evidenceText = readFileSync(evidenceReview, "utf8");

    expect(harnessText).toContain(
      "ANALYZE_V1_STABLE_REGRESSION_FINGERPRINT_HARNESS_REVIEWED_ACCEPTED_READY_FOR_FIXTURE_REGRESSION",
    );
    expect(harnessText).toContain(
      "The analyze-v1 stable regression fingerprint harness implementation is accepted.",
    );
    expect(evidenceText).toContain("POST_SSOT_WORD_REGRESSION_PACK_REVIEWED_ACCEPTED");
    expect(evidenceText).toContain("The post-SSOT word regression evidence record is accepted.");
  });

  it("locks reviewed post-SSOT fixture fingerprints", () => {
    for (const item of expectedCases) {
      const fixturePath = path.join(fixtureDir, item.fixture);
      const normalizedPath = path.join(tempDir, `${item.word}.normalized.json`);
      const result = runHarness(fixturePath, normalizedPath);
      const normalized = readFileSync(normalizedPath, "utf8");

      expect(result.schemaVersion).toBe(
        "open-instrument.analyze-v1-stable-regression-fingerprint.v0.1",
      );
      expect(result.sha256).toBe(item.expectedSha);
      expect(result.volatileTimestampFieldsRemoved).toEqual([
        "created",
        "generatedAt",
        "createdAt",
        "updatedAt",
        "timestamp",
        "time",
      ]);

      expect(normalized).toContain('"engineVersion": "0.2.0-symbolic"');
      expect(normalized).toContain(`"basis": "${item.primaryBasis}"`);
      expect(normalized).toContain(item.principlesPath);
      expect(normalized).not.toContain('"created"');
      expect(normalized).not.toContain('"generatedAt"');
      expect(normalized).not.toContain('"createdAt"');
      expect(normalized).not.toContain('"updatedAt"');
      expect(normalized).not.toContain('"timestamp"');
    }
  });

  it("keeps the damage fixture locked to regression evidence, not etymology proof", () => {
    const evidenceText = readFileSync(evidenceReview, "utf8");

    expect(evidenceText).toContain(
      "For damage, this does not prove da, dëm, ndarje, or mythic-register decomposition.",
    );

    const damageFixture = path.join(fixtureDir, "damage.run1.raw.json");
    const normalizedPath = path.join(tempDir, "damage.normalized.json");
    const result = runHarness(damageFixture, normalizedPath);

    expect(result.sha256).toBe(
      "184eb8df2b5ebeae007ecafece6fc1a71d7b24eef9c2e4a5253ee238d12687cb",
    );
  });
});
