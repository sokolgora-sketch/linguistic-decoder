import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const repoRoot = path.resolve(__dirname, "..");
const harness = path.join(
  repoRoot,
  "scripts/openInstrumentAnalyzeV1StableRegressionFingerprint.v0.1.mjs",
);
const policyReview = path.join(
  repoRoot,
  "docs/open-instrument/reviews/analyze-v1-stable-regression-fingerprint-policy-review-v0.1.md",
);

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

describe("analyze-v1 stable regression fingerprint harness v0.1", () => {
  let tempDir = "";

  beforeEach(() => {
    tempDir = mkdtempSync(path.join(tmpdir(), "analyze-v1-fingerprint-"));
  });

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { force: true, recursive: true });
    }
  });

  it("is cleared by the reviewed fingerprint policy", () => {
    const review = readFileSync(policyReview, "utf8");

    expect(review).toContain(
      "ANALYZE_V1_STABLE_REGRESSION_FINGERPRINT_POLICY_REVIEWED_ACCEPTED_READY_FOR_HARNESS",
    );
    expect(review).toContain(
      "Known volatile timestamp fields must be removed recursively before hashing.",
    );
    expect(review).toContain("Normalized hash equality is required.");
    expect(review).toContain(
      "test(open-instrument): implement analyze-v1 stable regression fingerprint harness v0.1",
    );
  });

  it("normalizes timestamp-only differences to the same stable hash", () => {
    const first = {
      meta: {
        created: "2026-06-25T14:29:20.347Z",
        engineVersion: "0.2.0-symbolic",
        generatedAt: "2026-06-25T14:29:20.348Z",
      },
      heart: {
        math7: {
          primary: {
            basis: "UI",
            generatedAt: "2026-06-25T14:29:20.348Z",
            principlesPath: ["UNITY", "INSIGHT"],
          },
        },
      },
      candidates: [
        {
          createdAt: "2026-06-25T14:29:20.348Z",
          id: "latin.studium",
          status: "pass",
          updatedAt: "2026-06-25T14:29:20.349Z",
        },
      ],
      timestamp: "2026-06-25T14:29:20.350Z",
      word: "study",
    };

    const second = {
      timestamp: "2026-06-25T14:29:21.000Z",
      candidates: [
        {
          updatedAt: "2026-06-25T14:29:21.002Z",
          status: "pass",
          id: "latin.studium",
          createdAt: "2026-06-25T14:29:21.001Z",
        },
      ],
      heart: {
        math7: {
          primary: {
            principlesPath: ["UNITY", "INSIGHT"],
            generatedAt: "2026-06-25T14:29:21.003Z",
            basis: "UI",
          },
        },
      },
      meta: {
        generatedAt: "2026-06-25T14:29:21.004Z",
        engineVersion: "0.2.0-symbolic",
        created: "2026-06-25T14:29:21.005Z",
      },
      word: "study",
    };

    const firstRaw = path.join(tempDir, "first.raw.json");
    const secondRaw = path.join(tempDir, "second.raw.json");
    const firstNormalized = path.join(tempDir, "first.normalized.json");
    const secondNormalized = path.join(tempDir, "second.normalized.json");

    writeFileSync(firstRaw, JSON.stringify(first, null, 2));
    writeFileSync(secondRaw, JSON.stringify(second, null, 2));

    const firstResult = runHarness(firstRaw, firstNormalized);
    const secondResult = runHarness(secondRaw, secondNormalized);

    expect(firstResult.schemaVersion).toBe(
      "open-instrument.analyze-v1-stable-regression-fingerprint.v0.1",
    );
    expect(firstResult.volatileTimestampFieldsRemoved).toEqual([
      "created",
      "generatedAt",
      "createdAt",
      "updatedAt",
      "timestamp",
      "time",
    ]);
    expect(firstResult.sha256).toBe(secondResult.sha256);

    const normalizedA = readFileSync(firstNormalized, "utf8");
    const normalizedB = readFileSync(secondNormalized, "utf8");

    expect(normalizedA).toBe(normalizedB);
    expect(normalizedA).toContain('"engineVersion": "0.2.0-symbolic"');
    expect(normalizedA).toContain('"basis": "UI"');
    expect(normalizedA).not.toContain("2026-06-25T14:29");
    expect(normalizedA).not.toContain('"created"');
    expect(normalizedA).not.toContain('"generatedAt"');
    expect(normalizedA).not.toContain('"createdAt"');
    expect(normalizedA).not.toContain('"updatedAt"');
    expect(normalizedA).not.toContain('"timestamp"');
  });

  it("changes the stable hash when non-volatile content changes", () => {
    const firstRaw = path.join(tempDir, "first.raw.json");
    const changedRaw = path.join(tempDir, "changed.raw.json");
    const firstNormalized = path.join(tempDir, "first.normalized.json");
    const changedNormalized = path.join(tempDir, "changed.normalized.json");

    writeFileSync(
      firstRaw,
      JSON.stringify({
        meta: { created: "one", engineVersion: "0.2.0-symbolic" },
        heart: { math7: { primary: { basis: "UI" } } },
        word: "study",
      }),
    );

    writeFileSync(
      changedRaw,
      JSON.stringify({
        meta: { created: "two", engineVersion: "0.2.0-symbolic" },
        heart: { math7: { primary: { basis: "AE" } } },
        word: "study",
      }),
    );

    const firstResult = runHarness(firstRaw, firstNormalized);
    const changedResult = runHarness(changedRaw, changedNormalized);

    expect(firstResult.sha256).not.toBe(changedResult.sha256);
    expect(readFileSync(firstNormalized, "utf8")).toContain('"basis": "UI"');
    expect(readFileSync(changedNormalized, "utf8")).toContain('"basis": "AE"');
  });

  it("prints usage text for --help", () => {
    const output = execFileSync(process.execPath, [harness, "--help"], {
      cwd: repoRoot,
      encoding: "utf8",
    });

    expect(output).toContain("Usage:");
    expect(output).toContain("created, generatedAt, createdAt, updatedAt, timestamp, time");
  });
});
