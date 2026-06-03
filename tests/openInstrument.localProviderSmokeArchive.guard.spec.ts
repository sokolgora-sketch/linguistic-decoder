import fs from "node:fs";
import path from "node:path";

type JsonObject = Record<string, unknown>;

const repoRoot = process.cwd();
const artifactDir = path.join(
  repoRoot,
  "docs/open-instrument/artifacts/local-provider-smoke",
);

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

function asObject(value: unknown): JsonObject {
  expect(value).toBeTruthy();
  expect(typeof value).toBe("object");
  expect(Array.isArray(value)).toBe(false);
  return value as JsonObject;
}

function getObject(parent: JsonObject, key: string): JsonObject {
  return asObject(parent[key]);
}

function getArray(parent: JsonObject, key: string): unknown[] {
  const value = parent[key];
  expect(Array.isArray(value)).toBe(true);
  return value as unknown[];
}

describe("Open Instrument local-provider smoke archive artifacts", () => {
  const artifactFiles = readJsonFiles(artifactDir);

  it("has at least one archived local-provider smoke artifact", () => {
    expect(artifactFiles.length).toBeGreaterThan(0);
  });

  it.each(artifactFiles)("keeps archive contract for %s", (filePath) => {
    const raw = fs.readFileSync(filePath, "utf8");
    const artifact = asObject(JSON.parse(raw) as unknown);

    expect(artifact.artifactType).toBe(
      "open-instrument-local-provider-smoke",
    );

    const claimBoundary = getObject(artifact, "claimBoundary");

    expect(claimBoundary.scientificEvidence).toBe(false);
    expect(claimBoundary.publicationEvidence).toBe(false);
    expect(claimBoundary.evalEvidence).toBe(false);
    expect(claimBoundary.cohortEvidence).toBe(false);
    expect(claimBoundary.defaultProviderChange).toBe(false);

    const redaction = getObject(artifact, "redaction");

    expect(redaction.apiKeysStored).toBe(false);
    expect(redaction.bearerTokensStored).toBe(false);
    expect(redaction.fullEnvStored).toBe(false);

    expect(raw).not.toMatch(/sk-[A-Za-z0-9]/);
    expect(raw).not.toContain("Bearer ");
    expect(raw).not.toContain("OPENAI_API_KEY=");
    expect(raw).not.toContain("OPENAI_API_KEY:");

    const runs = getArray(artifact, "runs");
    expect(runs.length).toBeGreaterThan(0);

    for (const runValue of runs) {
      const run = asObject(runValue);

      expect(typeof run.word).toBe("string");
      expect(run.word).not.toBe("");

      getObject(run, "request");
      getObject(run, "responseSummary");
      const candidateSummary = getObject(run, "candidateSummary");
      getObject(run, "verifierSummary");

      const vowelPath = getObject(candidateSummary, "vowelPath");
      expect(typeof vowelPath.present).toBe("boolean");
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

    const wordSet = getObject(artifact, "wordSet");
    const words = getArray(wordSet, "words");

    expect(words).toEqual(expectedFiveWordSet);

    const runs = getArray(artifact, "runs");
    const runWords = runs.map((runValue) => asObject(runValue).word);

    expect(runWords).toEqual(expectedFiveWordSet);
  });
});
