import { createHash } from "node:crypto";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import {
  adaptEnglishKaikkiJsonlRecordV0_1,
  ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
} from "@/shared/openInstrument/englishKaikkiSourceFamilyAdapter.v0_1";
import {
  artifactIdentitySha256V0_1,
  createIdentityPayloadV0_1,
  type EnglishKaikkiDeterministicIndexManifestV0_1,
} from "@/shared/openInstrument/englishKaikkiDeterministicIndex.v0_1";
import {
  createEnglishKaikkiServerOnlyExactIndexProviderForSyntheticFixtureV0_1,
  createEnglishKaikkiServerOnlyExactIndexProviderV0_1,
  type EnglishKaikkiServerOnlyExactIndexProviderResultV0_1,
} from "@/shared/openInstrument/englishKaikkiServerOnlyExactIndexProvider.v0_1";

const FIXTURE_ROOT = resolve(
  "tests/fixtures/openInstrument/englishKaikkiDeterministicIndexProvider.v0_1",
);
const SOURCE_PATH = join(FIXTURE_ROOT, "source.jsonl");
const INDEX_PATH = FIXTURE_ROOT;

const fixtureAdapter = (input: Parameters<typeof adaptEnglishKaikkiJsonlRecordV0_1>[0]) =>
  adaptEnglishKaikkiJsonlRecordV0_1({
    ...input,
    // The synthetic fixture has its own manifest identity. The adapter is
    // deliberately injected here so production can keep the frozen identity.
    verifiedSnapshot: ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
  });

async function fixtureProvider(
  adapter = fixtureAdapter,
  fixtureRoot = FIXTURE_ROOT,
) {
  return createEnglishKaikkiServerOnlyExactIndexProviderForSyntheticFixtureV0_1({
    fixtureRoot,
    sourcePath: join(fixtureRoot, "source.jsonl"),
    indexPath: fixtureRoot,
    adaptRecord: adapter,
  });
}

async function copyFixture(): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), "open-instrument-provider-test-"));
  for (const file of ["source.jsonl", "directory.ndjson", "postings.ndjson", "manifest.json"]) {
    await cp(join(FIXTURE_ROOT, file), join(directory, file));
  }
  return directory;
}

function expectNoRecords(
  result: EnglishKaikkiServerOnlyExactIndexProviderResultV0_1,
) {
  expect(result.records).toEqual([]);
}

describe("English Kaikki server-only exact index provider v0.1", () => {
  it("binds the synthetic fixture identity and keeps its identity recomputable", async () => {
    const manifest = JSON.parse(
      await readFile(join(FIXTURE_ROOT, "manifest.json"), "utf8"),
    ) as EnglishKaikkiDeterministicIndexManifestV0_1;
    const payload = createIdentityPayloadV0_1({
      sourceSnapshot: manifest.sourceSnapshot,
      adapter: manifest.adapter,
      files: manifest.files,
    });
    expect(artifactIdentitySha256V0_1(payload)).toBe(manifest.artifactIdentity.sha256);
    expect(manifest.sourceSnapshot.expectedBytes).toBe(532);
    expect(manifest.files[0].bytes).toBe(173);
    expect(manifest.files[1].bytes).toBe(1421);
  });

  it("does exact normalized lookup, preserves collision and sense/gloss multiplicity, and reads bounded ranges", async () => {
    const provider = await fixtureProvider();
    const result = await provider.queryWithMetrics("APPLE");
    expect(result.result).toMatchObject({ status: "MATCHES_FOUND", queryForm: "apple" });
    if (result.result.status === "MATCHES_FOUND") {
      expect(result.result.records).toHaveLength(4);
      expect(result.result.records.map((record) => record.sourceForm)).toEqual([
        "Apple",
        "Apple",
        "Apple",
        "apple",
      ]);
      expect(result.result.records.map((record) => record.gloss)).toEqual([
        "A fruit",
        "A tree bearing the fruit",
        "A named fruit",
        "To apply polish",
      ]);
      expect(result.result.records.every((record) => record.embryoRelation === "exact_form")).toBe(true);
      expect(result.result.records.every((record) => record.sourceProvenance?.entryLocator.startsWith("jsonl://record/"))).toBe(true);
    }
    expect(result.metrics.postingsBytesRead).toBe(946);
    expect(result.metrics.sourceBytesRead).toBe(348);
    expect(result.metrics.directoryBytesRead).toBeGreaterThan(0);
    expect(result.metrics.directoryBytesRead).toBeLessThanOrEqual(64 * 1024);
  });

  it("returns valid lexical NULL without opening postings or source bytes", async () => {
    const provider = await fixtureProvider();
    const result = await provider.queryWithMetrics("cantaloupe");
    expect(result.result).toMatchObject({
      status: "LEXICAL_SENSE_SOURCE_NOT_FOUND",
      queryForm: "cantaloupe",
    });
    expectNoRecords(result.result);
    expect(result.metrics.postingsBytesRead).toBe(0);
    expect(result.metrics.sourceBytesRead).toBe(0);
  });

  it("preserves a second source record's multiple senses/glosses and canonical posting order", async () => {
    const provider = await fixtureProvider();
    const result = await provider.queryWithMetrics("banana");
    expect(result.result).toMatchObject({ status: "MATCHES_FOUND", queryForm: "banana" });
    if (result.result.status === "MATCHES_FOUND") {
      expect(result.result.records.map((record) => record.gloss)).toEqual([
        "A tropical fruit",
        "A yellow fruit",
        "The plant",
      ]);
      expect(result.result.records.map((record) => record.sourceProvenance?.sourceRecordId)).toEqual([
        result.result.records[0]?.sourceProvenance?.sourceRecordId,
        result.result.records[1]?.sourceProvenance?.sourceRecordId,
        result.result.records[2]?.sourceProvenance?.sourceRecordId,
      ]);
    }
  });

  it("fails closed for invalid queries and missing production configuration", async () => {
    const provider = await fixtureProvider();
    expect((await provider.query("")).status).toBe("INDEX_LOOKUP_INVALID_QUERY");

    const previousRoot = process.env.OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT;
    delete process.env.OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT;
    try {
      const productionProvider = await createEnglishKaikkiServerOnlyExactIndexProviderV0_1();
      expect(await productionProvider.query("apple")).toMatchObject({
        status: "PROVIDER_CONFIGURATION_FAILURE",
      });
    } finally {
      if (previousRoot === undefined) delete process.env.OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT;
      else process.env.OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT = previousRoot;
    }
  });

  it("distinguishes adapter failure from a source-record hash failure", async () => {
    const adapterFailureProvider = await fixtureProvider(() => ({
      ok: false,
      reasonCode: "SOURCE_ADAPTER_FAILURE",
    }));
    expect(await adapterFailureProvider.query("apple")).toMatchObject({
      status: "SOURCE_ADAPTER_FAILURE",
      reasonCode: "SOURCE_ADAPTER_FAILURE",
    });

    const directory = await copyFixture();
    try {
      const postingsPath = join(directory, "postings.ndjson");
      const postings = await readFile(postingsPath, "utf8");
      const corrupted = postings.replace(
        /"recordSha256":"[0-9a-f]{64}"/u,
        `"recordSha256":"${"f".repeat(64)}"`,
      );
      await writeFile(postingsPath, corrupted, "utf8");
      const provider = await fixtureProvider(fixtureAdapter, directory);
      expect(await provider.query("apple")).toMatchObject({
        status: "SOURCE_RECORD_RECOVERY_FAILURE",
        reasonCode: "SOURCE_RECORD_HASH_MISMATCH",
      });
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("fails closed for an out-of-range posting and a mismatched artifact identity", async () => {
    const directory = await copyFixture();
    try {
      const postingsPath = join(directory, "postings.ndjson");
      const postings = await readFile(postingsPath, "utf8");
      await writeFile(postingsPath, postings.replace('"recordByteLength":221', '"recordByteLength":999'), "utf8");
      const provider = await fixtureProvider(fixtureAdapter, directory);
      expect(await provider.query("apple")).toMatchObject({
        status: "SOURCE_RECORD_RECOVERY_FAILURE",
        reasonCode: "SOURCE_RECORD_RANGE_OUT_OF_BOUNDS",
      });

      const manifestPath = join(directory, "manifest.json");
      const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as {
        sourceSnapshot: { expectedBytes: number };
      };
      manifest.sourceSnapshot.expectedBytes = 531;
      await writeFile(manifestPath, JSON.stringify(manifest), "utf8");
      const mismatchedProvider = await fixtureProvider(fixtureAdapter, directory);
      expect(await mismatchedProvider.query("apple")).toMatchObject({
        status: "PROVIDER_CONFIGURATION_FAILURE",
      });
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  it("keeps the provider server-bound and out of Discovery, analyze-v1, and chat paths", async () => {
    const providerSource = await readFile(
      resolve("src/shared/openInstrument/englishKaikkiServerOnlyExactIndexProvider.v0_1.ts"),
      "utf8",
    );
    expect(providerSource).toContain("node:fs/promises");
    expect(providerSource).not.toContain("register");
    expect(providerSource).not.toContain("/api/analyze-v1");
    expect(providerSource).not.toContain("/chat");
    expect(createHash("sha256").update(providerSource).digest("hex")).toHaveLength(64);
  });
});
