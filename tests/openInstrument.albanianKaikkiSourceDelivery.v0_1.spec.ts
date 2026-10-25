import { createHash } from "node:crypto";
import { mkdtemp, readFile, readdir, rm, utimes, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Readable } from "node:stream";

import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import {
  createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticSourceFileV0_1,
} from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";
import {
  ALBANIAN_KAIKKI_GCS_BUCKET_ENV_V0_1,
  ALBANIAN_KAIKKI_GCS_GENERATION_ENV_V0_1,
  ALBANIAN_KAIKKI_GCS_OBJECT_ENV_V0_1,
  ALBANIAN_KAIKKI_MATERIALIZED_ROOT_ENV_V0_1,
  createAlbanianKaikkiServerOnlyProductionProviderV0_1,
  materializeAlbanianKaikkiSourceV0_1,
  type AlbanianKaikkiGcsSourceDeliveryConfigV0_1,
  type AlbanianKaikkiSourceObjectReaderFactoryV0_1,
} from "@/shared/openInstrument/albanianKaikkiServerOnlySourceDelivery.v0_1";
import { buildMotivationEngineDiscoveryServerOnlyV0_1 } from "@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1";

const LOCAL_SOURCE_ENV = "OPEN_INSTRUMENT_ALBANIAN_LEXICAL_SOURCE_PATH";
const PAYLOAD = Buffer.from(
  '{"word":"mal","lang_code":"sq","pos":"noun","senses":[{"glosses":["mountain"]}]}\n',
  "utf8",
);

function digest(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function config(root: string, generation = "123456789"): AlbanianKaikkiGcsSourceDeliveryConfigV0_1 {
  return {
    bucket: "private-test-bucket",
    object: "frozen/albanian.jsonl",
    generation,
    materializedRoot: root,
  };
}

function readerFactory(input: Readonly<{
  bytes?: Buffer;
  generation?: string;
  metadataSize?: number;
  metadataError?: unknown;
  streamError?: unknown;
  onCreate?: () => void;
}>): AlbanianKaikkiSourceObjectReaderFactoryV0_1 {
  return () => ({
    getMetadata: async () => {
      if (input.metadataError) throw input.metadataError;
      return {
        generation: input.generation ?? "123456789",
        size: input.metadataSize ?? (input.bytes ?? PAYLOAD).byteLength,
      };
    },
    createReadStream: () => {
      input.onCreate?.();
      if (input.streamError) {
        return (async function* () {
          throw input.streamError;
        })();
      }
      return Readable.from([input.bytes ?? PAYLOAD]);
    },
  });
}

async function freshRoot(): Promise<string> {
  return mkdtemp(join(tmpdir(), "open-instrument-albanian-delivery-"));
}

describe("Albanian frozen source delivery v0.1", () => {
  const originalEnvironment = {
    local: process.env[LOCAL_SOURCE_ENV],
    bucket: process.env[ALBANIAN_KAIKKI_GCS_BUCKET_ENV_V0_1],
    object: process.env[ALBANIAN_KAIKKI_GCS_OBJECT_ENV_V0_1],
    generation: process.env[ALBANIAN_KAIKKI_GCS_GENERATION_ENV_V0_1],
    root: process.env[ALBANIAN_KAIKKI_MATERIALIZED_ROOT_ENV_V0_1],
  };

  beforeEach(() => {
    delete process.env[LOCAL_SOURCE_ENV];
    delete process.env[ALBANIAN_KAIKKI_GCS_BUCKET_ENV_V0_1];
    delete process.env[ALBANIAN_KAIKKI_GCS_OBJECT_ENV_V0_1];
    delete process.env[ALBANIAN_KAIKKI_GCS_GENERATION_ENV_V0_1];
    delete process.env[ALBANIAN_KAIKKI_MATERIALIZED_ROOT_ENV_V0_1];
  });

  afterAll(() => {
    for (const [name, value] of Object.entries({
      [LOCAL_SOURCE_ENV]: originalEnvironment.local,
      [ALBANIAN_KAIKKI_GCS_BUCKET_ENV_V0_1]: originalEnvironment.bucket,
      [ALBANIAN_KAIKKI_GCS_OBJECT_ENV_V0_1]: originalEnvironment.object,
      [ALBANIAN_KAIKKI_GCS_GENERATION_ENV_V0_1]: originalEnvironment.generation,
      [ALBANIAN_KAIKKI_MATERIALIZED_ROOT_ENV_V0_1]: originalEnvironment.root,
    })) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  });

  it("materializes a verified isolated artifact and preserves the local provider seam", async () => {
    const root = await freshRoot();
    try {
      const result = await materializeAlbanianKaikkiSourceV0_1(config(root), {
        expectedBytes: PAYLOAD.byteLength,
        expectedSha256: digest(PAYLOAD),
        objectReaderFactory: readerFactory({}),
      });

      expect(result).toMatchObject({
        status: "MATERIALIZED",
        bytes: PAYLOAD.byteLength,
        sha256: digest(PAYLOAD),
      });
      if (result.status !== "MATERIALIZED") throw new Error("fixture did not materialize");
      await expect(readFile(result.sourcePath)).resolves.toEqual(PAYLOAD);
      await expect(readdir(root)).resolves.toEqual(["open-instrument-albanian-kaikki-v0.1.jsonl"]);

      const provider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticSourceFileV0_1({
        sourcePath: result.sourcePath,
        sourceSha256: result.sha256,
        sourceBytes: result.bytes,
      });
      await expect(provider.query("mal")).resolves.toMatchObject({
        status: "MATCHES_FOUND",
        queryForm: "mal",
      });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("fails closed when no local or complete GCS configuration is present", async () => {
    const provider = await createAlbanianKaikkiServerOnlyProductionProviderV0_1();
    await expect(provider.query("mal")).resolves.toMatchObject({
      status: "UNAVAILABLE",
      reasonCode: "ALBANIAN_SOURCE_PATH_NOT_CONFIGURED",
    });

    process.env[ALBANIAN_KAIKKI_GCS_BUCKET_ENV_V0_1] = "private-test-bucket";
    const partialProvider = await createAlbanianKaikkiServerOnlyProductionProviderV0_1();
    await expect(partialProvider.query("mal")).resolves.toMatchObject({
      status: "UNAVAILABLE",
      reasonCode: "ALBANIAN_SOURCE_DELIVERY_CONFIGURATION_INVALID",
    });
  });

  it("preserves unavailable production source evidence as a Null Albanian reading", async () => {
    const provider = await createAlbanianKaikkiServerOnlyProductionProviderV0_1();
    const word = "mal";
    const analysis = enginePayloadToAnalysisResult(await runAnalysisDeterministic(word, {
      mode: "strict",
      alphabet: "albanian",
    }));
    const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word,
      inputLanguage: "sq",
      inputProfile: "albanian",
      analysis,
      heart: buildHeartInstrumentV1(word),
      albanianLexicalSourceProvider: provider,
    });

    expect(result.discovery.albanianLexicalReading).toMatchObject({
      status: "NULL",
      functionalMeaningBridge: { status: "NULL" },
      composition: { status: "NULL" },
    });
  });

  it("maps inaccessible objects to an explicit unavailable reason", async () => {
    const root = await freshRoot();
    try {
      const error = Object.assign(new Error("forbidden"), { code: 403 });
      await expect(materializeAlbanianKaikkiSourceV0_1(config(root), {
        objectReaderFactory: readerFactory({ metadataError: error }),
      })).resolves.toEqual({
        status: "UNAVAILABLE",
        reasonCode: "ALBANIAN_SOURCE_OBJECT_ACCESS_FAILURE",
      });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("rejects a requested generation that the object does not expose", async () => {
    const root = await freshRoot();
    try {
      await expect(materializeAlbanianKaikkiSourceV0_1(config(root), {
        objectReaderFactory: readerFactory({ generation: "999" }),
      })).resolves.toEqual({
        status: "UNAVAILABLE",
        reasonCode: "ALBANIAN_SOURCE_OBJECT_GENERATION_MISMATCH",
      });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("rejects incorrect bytes or hashes and removes the partial target", async () => {
    const root = await freshRoot();
    try {
      const wrongBytes = Buffer.from("wrong\n", "utf8");
      const result = await materializeAlbanianKaikkiSourceV0_1(config(root), {
        expectedBytes: PAYLOAD.byteLength,
        expectedSha256: digest(PAYLOAD),
        objectReaderFactory: readerFactory({ bytes: wrongBytes, metadataSize: PAYLOAD.byteLength }),
      });
      expect(result).toEqual({
        status: "UNAVAILABLE",
        reasonCode: "ALBANIAN_SOURCE_IDENTITY_MISMATCH",
      });
      await expect(readdir(root)).resolves.toEqual([]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("converges concurrent initialization on one download promise", async () => {
    const root = await freshRoot();
    let streamCreations = 0;
    try {
      const options = {
        expectedBytes: PAYLOAD.byteLength,
        expectedSha256: digest(PAYLOAD),
        objectReaderFactory: readerFactory({ onCreate: () => { streamCreations += 1; } }),
      };
      const results = await Promise.all(
        Array.from({ length: 8 }, () => materializeAlbanianKaikkiSourceV0_1(config(root), options)),
      );
      expect(results).toHaveLength(8);
      expect(results.every((value) => value.status === "MATERIALIZED")).toBe(true);
      expect(streamCreations).toBe(1);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("maps stream failures to unavailable without leaving temporary files", async () => {
    const root = await freshRoot();
    try {
      const result = await materializeAlbanianKaikkiSourceV0_1(config(root), {
        expectedBytes: PAYLOAD.byteLength,
        expectedSha256: digest(PAYLOAD),
        objectReaderFactory: readerFactory({ streamError: new Error("network down") }),
      });
      expect(result).toEqual({
        status: "UNAVAILABLE",
        reasonCode: "ALBANIAN_SOURCE_DOWNLOAD_FAILURE",
      });
      await expect(readdir(root)).resolves.toEqual([]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("cleans stale delivery temp files without touching unrelated files", async () => {
    const root = await freshRoot();
    try {
      const stalePath = join(root, ".open-instrument-albanian-kaikki-v0.1.jsonl.tmp-stale");
      const unrelatedPath = join(root, "unrelated.tmp");
      await writeFile(stalePath, "stale", "utf8");
      await writeFile(unrelatedPath, "keep", "utf8");
      const staleTime = new Date(Date.now() - 48 * 60 * 60 * 1000);
      await utimes(stalePath, staleTime, staleTime);

      const result = await materializeAlbanianKaikkiSourceV0_1(config(root, "123456790"), {
        expectedBytes: PAYLOAD.byteLength,
        expectedSha256: digest(PAYLOAD),
        objectReaderFactory: readerFactory({ generation: "123456790" }),
      });

      expect(result.status).toBe("MATERIALIZED");
      await expect(readFile(unrelatedPath, "utf8")).resolves.toBe("keep");
      await expect(readdir(root)).resolves.toEqual([
        "open-instrument-albanian-kaikki-v0.1.jsonl",
        "unrelated.tmp",
      ]);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
