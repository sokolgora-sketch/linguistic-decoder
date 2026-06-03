import fs from "node:fs";
import path from "node:path";

type JsonObject = Record<string, unknown>;

const repoRoot = process.cwd();
const artifactDir = path.join(
  repoRoot,
  "docs/open-instrument/artifacts/local-provider-smoke",
);

const allowedSevenVoiceSymbols = ["A", "E", "I", "O", "U", "Y", "Ë"];

const expectedFiveWordSet = [
  "study",
  "damage",
  "language",
  "philosophy",
  "mathematics",
];

function readJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => path.join(dir, name))
    .sort();
}

function isV02Artifact(filePath: string): boolean {
  return path.basename(filePath).endsWith("v0.2.json");
}

function asObject(value: unknown, label = "value"): JsonObject {
  expect(value).toBeTruthy();
  expect(typeof value).toBe("object");
  expect(Array.isArray(value)).toBe(false);
  return value as JsonObject;
}

function getObject(parent: JsonObject, key: string, label = key): JsonObject {
  return asObject(parent[key], label);
}

function getArray(parent: JsonObject, key: string, label = key): unknown[] {
  const value = parent[key];
  expect(Array.isArray(value)).toBe(true);
  return value as unknown[];
}

function assertCommonArtifactContract(
  raw: string,
  artifact: JsonObject,
  filePath: string,
): void {
  expect(artifact.artifactType).toBe("open-instrument-local-provider-smoke");

  const claimBoundary = getObject(artifact, "claimBoundary", "artifact");

  expect(claimBoundary.scientificEvidence).toBe(false);
  expect(claimBoundary.publicationEvidence).toBe(false);
  expect(claimBoundary.evalEvidence).toBe(false);
  expect(claimBoundary.cohortEvidence).toBe(false);
  expect(claimBoundary.defaultProviderChange).toBe(false);

  const redaction = getObject(artifact, "redaction", "artifact");

  expect(redaction.apiKeysStored).toBe(false);
  expect(redaction.bearerTokensStored).toBe(false);
  expect(redaction.fullEnvStored).toBe(false);

  expect(raw).not.toMatch(/sk-[A-Za-z0-9]/);
  expect(raw).not.toContain("Bearer ");
  expect(raw).not.toContain("OPENAI_API_KEY=");
  expect(raw).not.toContain("OPENAI_API_KEY:");

  expect(isV02Artifact(filePath) || filePath.endsWith("v0.1.json")).toBe(true);
}

function assertRunShape(runValue: unknown): JsonObject {
  const run = asObject(runValue, "run");

  expect(typeof run.word).toBe("string");
  expect(run.word).not.toBe("");

  getObject(run, "request", "run");
  getObject(run, "responseSummary", "run");
  const candidateSummary = getObject(run, "candidateSummary", "run");
  getObject(run, "verifierSummary", "run");

  const vowelPath = getObject(candidateSummary, "vowelPath", "candidateSummary");
  expect(typeof vowelPath.present).toBe("boolean");

  return run;
}

function assertV02VowelPath(runValue: unknown): void {
  const run = assertRunShape(runValue);
  const candidateSummary = getObject(run, "candidateSummary", "run");
  const vowelPath = getObject(candidateSummary, "vowelPath", "candidateSummary");

  expect(vowelPath.present).toBe(true);

  const value = getArray(vowelPath, "value", "vowelPath");
  expect(value.length).toBeGreaterThan(0);

  for (const symbol of value) {
    expect(typeof symbol).toBe("string");
    expect(allowedSevenVoiceSymbols).toContain(symbol);
  }
}

describe("Open Instrument local-provider smoke archive artifacts", () => {
  const artifactFiles = readJsonFiles(artifactDir);

  it("has at least one archived local-provider smoke artifact", () => {
    expect(artifactFiles.length).toBeGreaterThan(0);
  });

  it.each(artifactFiles)("keeps archive contract for %s", (filePath) => {
    const raw = fs.readFileSync(filePath, "utf8");
    const artifact = asObject(JSON.parse(raw) as unknown, "artifact");

    assertCommonArtifactContract(raw, artifact, filePath);

    const runs = getArray(artifact, "runs", "artifact");
    expect(runs.length).toBeGreaterThan(0);

    for (const runValue of runs) {
      if (isV02Artifact(filePath)) {
        assertV02VowelPath(runValue);
      } else {
        assertRunShape(runValue);
      }
    }
  });

  it("keeps the current five-word llama smoke artifact word set locked", () => {
    const fiveWordArtifactPath = path.join(
      artifactDir,
      "2026-06-03-open-instrument-local-smoke-ollama-llama3-1-8b-five-word-v0.1.json",
    );

    const artifact = asObject(
      JSON.parse(fs.readFileSync(fiveWordArtifactPath, "utf8")) as unknown,
    );

    const wordSet = getObject(artifact, "wordSet", "fiveWordArtifact");
    const words = getArray(wordSet, "words", "wordSet");

    expect(words).toEqual(expectedFiveWordSet);

    const runs = getArray(artifact, "runs", "fiveWordArtifact");
    const runWords = runs.map((runValue) => asObject(runValue, "run").word);

    expect(runWords).toEqual(expectedFiveWordSet);
  });

  it("accepts valid v0.2 vowelPath values", () => {
    expect(() =>
      assertV02VowelPath({
        word: "study",
        request: {},
        responseSummary: {},
        candidateSummary: {
          vowelPath: {
            present: true,
            value: ["U", "I"],
          },
        },
        verifierSummary: {},
      }),
    ).not.toThrow();
  });

  it("rejects v0.2 runs with missing vowelPath presence", () => {
    expect(() =>
      assertV02VowelPath({
        word: "study",
        request: {},
        responseSummary: {},
        candidateSummary: {
          vowelPath: {
            present: false,
            value: ["U", "I"],
          },
        },
        verifierSummary: {},
      }),
    ).toThrow();
  });

  it("rejects v0.2 runs with empty vowelPath", () => {
    expect(() =>
      assertV02VowelPath({
        word: "study",
        request: {},
        responseSummary: {},
        candidateSummary: {
          vowelPath: {
            present: true,
            value: [],
          },
        },
        verifierSummary: {},
      }),
    ).toThrow();
  });

  it("rejects v0.2 runs with lowercase vowelPath symbols", () => {
    expect(() =>
      assertV02VowelPath({
        word: "study",
        request: {},
        responseSummary: {},
        candidateSummary: {
          vowelPath: {
            present: true,
            value: ["u", "i"],
          },
        },
        verifierSummary: {},
      }),
    ).toThrow();
  });

  it("rejects v0.2 runs with non-Seven-Voice vowelPath symbols", () => {
    expect(() =>
      assertV02VowelPath({
        word: "study",
        request: {},
        responseSummary: {},
        candidateSummary: {
          vowelPath: {
            present: true,
            value: ["Ə"],
          },
        },
        verifierSummary: {},
      }),
    ).toThrow();
  });
});
