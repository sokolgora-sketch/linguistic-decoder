import { createHash, randomUUID } from "node:crypto";
import { mkdir, open, readdir, rename, rm, stat } from "node:fs/promises";
import { isAbsolute, join } from "node:path";

import { Storage } from "@google-cloud/storage";

import {
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_PATH_ENV_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1,
  createAlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1,
  createAlbanianKaikkiServerOnlyUnavailableProviderV0_1,
  type AlbanianKaikkiExactLexicalSourceLookupResultV0_1,
  type AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1,
} from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";

export const ALBANIAN_KAIKKI_GCS_BUCKET_ENV_V0_1 =
  "OPEN_INSTRUMENT_ALBANIAN_KAIKKI_GCS_BUCKET" as const;
export const ALBANIAN_KAIKKI_GCS_OBJECT_ENV_V0_1 =
  "OPEN_INSTRUMENT_ALBANIAN_KAIKKI_GCS_OBJECT" as const;
export const ALBANIAN_KAIKKI_GCS_GENERATION_ENV_V0_1 =
  "OPEN_INSTRUMENT_ALBANIAN_KAIKKI_GCS_GENERATION" as const;
export const ALBANIAN_KAIKKI_MATERIALIZED_ROOT_ENV_V0_1 =
  "OPEN_INSTRUMENT_ALBANIAN_KAIKKI_MATERIALIZED_ROOT" as const;

const MATERIALIZED_FILE_NAME_V0_1 = "open-instrument-albanian-kaikki-v0.1.jsonl";
const TEMP_FILE_PREFIX_V0_1 = `.${MATERIALIZED_FILE_NAME_V0_1}.tmp-`;
const STALE_TEMP_MAX_AGE_MS_V0_1 = 24 * 60 * 60 * 1000;

type SourceUnavailableReasonCodeV0_1 = Extract<
  AlbanianKaikkiExactLexicalSourceLookupResultV0_1,
  { status: "UNAVAILABLE" }
>["reasonCode"];

export type AlbanianKaikkiGcsSourceDeliveryConfigV0_1 = Readonly<{
  bucket: string;
  object: string;
  generation: string;
  materializedRoot: string;
}>;

export type AlbanianKaikkiSourceObjectReaderV0_1 = Readonly<{
  getMetadata: () => Promise<Readonly<{
    generation: string | number | undefined;
    size: string | number | undefined;
  }>>;
  createReadStream: () => AsyncIterable<Uint8Array>;
}>;

export type AlbanianKaikkiSourceObjectReaderFactoryV0_1 = (
  config: AlbanianKaikkiGcsSourceDeliveryConfigV0_1,
) => AlbanianKaikkiSourceObjectReaderV0_1;

type MaterializationResultV0_1 = Readonly<
  | {
      status: "MATERIALIZED";
      sourcePath: string;
      bytes: number;
      sha256: string;
    }
  | {
      status: "UNAVAILABLE";
      reasonCode: SourceUnavailableReasonCodeV0_1;
    }
>;

type MaterializationOptionsV0_1 = Readonly<{
  expectedBytes?: number;
  expectedSha256?: string;
  objectReaderFactory?: AlbanianKaikkiSourceObjectReaderFactoryV0_1;
}>;

const materializationPromisesV0_1 = new Map<
  string,
  Promise<MaterializationResultV0_1>
>();

function textEnvV0_1(name: string): string {
  return (process.env[name] ?? "").normalize("NFC").trim();
}

function readGcsConfigV0_1(): Readonly<{
  config: AlbanianKaikkiGcsSourceDeliveryConfigV0_1 | null;
  reasonCode: SourceUnavailableReasonCodeV0_1 | null;
}> {
  const bucket = textEnvV0_1(ALBANIAN_KAIKKI_GCS_BUCKET_ENV_V0_1);
  const object = textEnvV0_1(ALBANIAN_KAIKKI_GCS_OBJECT_ENV_V0_1);
  const generation = textEnvV0_1(ALBANIAN_KAIKKI_GCS_GENERATION_ENV_V0_1);
  const materializedRoot = textEnvV0_1(ALBANIAN_KAIKKI_MATERIALIZED_ROOT_ENV_V0_1);
  const supplied = [bucket, object, generation, materializedRoot].filter(Boolean).length;

  if (supplied === 0) return Object.freeze({ config: null, reasonCode: null });
  if (
    supplied !== 4 ||
    !/^\d+$/.test(generation) ||
    !isAbsolute(materializedRoot)
  ) {
    return Object.freeze({
      config: null,
      reasonCode: "ALBANIAN_SOURCE_DELIVERY_CONFIGURATION_INVALID" as const,
    });
  }

  return Object.freeze({
    config: Object.freeze({ bucket, object, generation, materializedRoot }),
    reasonCode: null,
  });
}

function materializedPathV0_1(config: AlbanianKaikkiGcsSourceDeliveryConfigV0_1): string {
  return join(config.materializedRoot, MATERIALIZED_FILE_NAME_V0_1);
}

function materializationKeyV0_1(
  config: AlbanianKaikkiGcsSourceDeliveryConfigV0_1,
  expectedBytes: number,
  expectedSha256: string,
): string {
  return [
    config.bucket,
    config.object,
    config.generation,
    config.materializedRoot,
    expectedBytes,
    expectedSha256,
  ].join("\u0000");
}

function errorCodeV0_1(error: unknown): number | string | undefined {
  if (!error || typeof error !== "object") return undefined;
  const value = (error as { code?: unknown }).code;
  return typeof value === "number" || typeof value === "string" ? value : undefined;
}

function metadataFailureReasonV0_1(error: unknown): SourceUnavailableReasonCodeV0_1 {
  const code = errorCodeV0_1(error);
  if (code === 404 || code === "404") return "ALBANIAN_SOURCE_OBJECT_GENERATION_MISMATCH";
  return "ALBANIAN_SOURCE_OBJECT_ACCESS_FAILURE";
}

function createGoogleCloudStorageObjectReaderV0_1(
  config: AlbanianKaikkiGcsSourceDeliveryConfigV0_1,
): AlbanianKaikkiSourceObjectReaderV0_1 {
  const storage = new Storage({ retryOptions: { autoRetry: false, maxRetries: 0 } });
  const file = storage.bucket(config.bucket).file(config.object, {
    generation: config.generation,
  });

  return Object.freeze({
    getMetadata: async () => {
      const [metadata] = await file.getMetadata();
      return Object.freeze({
        generation: metadata.generation,
        size: metadata.size,
      });
    },
    createReadStream: () => file.createReadStream({ validation: false }),
  });
}

async function cleanupStaleTemporaryFilesV0_1(root: string): Promise<void> {
  const entries = await readdir(root, { withFileTypes: true });
  const cutoff = Date.now() - STALE_TEMP_MAX_AGE_MS_V0_1;
  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.startsWith(TEMP_FILE_PREFIX_V0_1))
      .map(async (entry) => {
        const path = join(root, entry.name);
        try {
          const details = await stat(path);
          if (details.mtimeMs < cutoff) await rm(path, { force: true });
        } catch {
          // A concurrent cleanup or instance termination may have removed it.
        }
      }),
  );
}

async function materializeOnceV0_1(
  config: AlbanianKaikkiGcsSourceDeliveryConfigV0_1,
  options: Required<Pick<MaterializationOptionsV0_1, "expectedBytes" | "expectedSha256">> &
    Pick<MaterializationOptionsV0_1, "objectReaderFactory">,
): Promise<MaterializationResultV0_1> {
  const expectedBytes = options.expectedBytes;
  const expectedSha256 = options.expectedSha256;
  const objectReader = (options.objectReaderFactory ?? createGoogleCloudStorageObjectReaderV0_1)(config);
  let metadata: Readonly<{ generation: string | number | undefined; size: string | number | undefined }>;

  try {
    metadata = await objectReader.getMetadata();
  } catch (error) {
    return Object.freeze({
      status: "UNAVAILABLE" as const,
      reasonCode: metadataFailureReasonV0_1(error),
    });
  }

  if (String(metadata.generation ?? "") !== config.generation) {
    return Object.freeze({
      status: "UNAVAILABLE" as const,
      reasonCode: "ALBANIAN_SOURCE_OBJECT_GENERATION_MISMATCH" as const,
    });
  }

  if (Number(metadata.size) !== expectedBytes) {
    return Object.freeze({
      status: "UNAVAILABLE" as const,
      reasonCode: "ALBANIAN_SOURCE_IDENTITY_MISMATCH" as const,
    });
  }

  const targetPath = materializedPathV0_1(config);
  const temporaryPath = join(
    config.materializedRoot,
    `${TEMP_FILE_PREFIX_V0_1}${process.pid}-${randomUUID()}`,
  );
  let temporaryHandle: Awaited<ReturnType<typeof open>> | null = null;

  try {
    await mkdir(config.materializedRoot, { recursive: true, mode: 0o700 });
    await cleanupStaleTemporaryFilesV0_1(config.materializedRoot);
    temporaryHandle = await open(temporaryPath, "wx", 0o600);
    const hash = createHash("sha256");
    let byteCount = 0;

    try {
      for await (const chunk of objectReader.createReadStream()) {
        const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        byteCount += bytes.byteLength;
        if (byteCount > expectedBytes) {
          return Object.freeze({
            status: "UNAVAILABLE" as const,
            reasonCode: "ALBANIAN_SOURCE_IDENTITY_MISMATCH" as const,
          });
        }
        hash.update(bytes);
        await temporaryHandle.write(bytes);
      }
    } catch {
      return Object.freeze({
        status: "UNAVAILABLE" as const,
        reasonCode: "ALBANIAN_SOURCE_DOWNLOAD_FAILURE" as const,
      });
    }

    const sha256 = hash.digest("hex");
    if (byteCount !== expectedBytes || sha256 !== expectedSha256) {
      return Object.freeze({
        status: "UNAVAILABLE" as const,
        reasonCode: "ALBANIAN_SOURCE_IDENTITY_MISMATCH" as const,
      });
    }

    try {
      await temporaryHandle.sync();
      await temporaryHandle.close();
      temporaryHandle = null;
      await rename(temporaryPath, targetPath);
    } catch {
      return Object.freeze({
        status: "UNAVAILABLE" as const,
        reasonCode: "ALBANIAN_SOURCE_MATERIALIZATION_FAILURE" as const,
      });
    }

    return Object.freeze({
      status: "MATERIALIZED" as const,
      sourcePath: targetPath,
      bytes: byteCount,
      sha256,
    });
  } catch {
    return Object.freeze({
      status: "UNAVAILABLE" as const,
      reasonCode: "ALBANIAN_SOURCE_MATERIALIZATION_FAILURE" as const,
    });
  } finally {
    if (temporaryHandle) await temporaryHandle.close().catch(() => undefined);
    await rm(temporaryPath, { force: true }).catch(() => undefined);
  }
}

export function materializeAlbanianKaikkiSourceV0_1(
  config: AlbanianKaikkiGcsSourceDeliveryConfigV0_1,
  options: MaterializationOptionsV0_1 = {},
): Promise<MaterializationResultV0_1> {
  const expectedBytes = options.expectedBytes ?? ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1;
  const expectedSha256 = options.expectedSha256 ?? ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1;
  const key = materializationKeyV0_1(config, expectedBytes, expectedSha256);
  const existing = materializationPromisesV0_1.get(key);
  if (existing) return existing;

  const promise = materializeOnceV0_1(config, {
    expectedBytes,
    expectedSha256,
    objectReaderFactory: options.objectReaderFactory,
  });
  materializationPromisesV0_1.set(key, promise);
  return promise;
}

export async function createAlbanianKaikkiServerOnlyProductionProviderV0_1(
  options: MaterializationOptionsV0_1 = {},
): Promise<AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1> {
  const localSourcePath = textEnvV0_1(ALBANIAN_KAIKKI_LEXICAL_SOURCE_PATH_ENV_V0_1);
  if (localSourcePath) {
    return createAlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1(localSourcePath);
  }

  const delivery = readGcsConfigV0_1();
  if (delivery.reasonCode) {
    return createAlbanianKaikkiServerOnlyUnavailableProviderV0_1(delivery.reasonCode);
  }
  if (!delivery.config) {
    return createAlbanianKaikkiServerOnlyUnavailableProviderV0_1(
      "ALBANIAN_SOURCE_PATH_NOT_CONFIGURED",
    );
  }

  const materialized = await materializeAlbanianKaikkiSourceV0_1(delivery.config, options);
  if (materialized.status !== "MATERIALIZED") {
    return createAlbanianKaikkiServerOnlyUnavailableProviderV0_1(materialized.reasonCode);
  }

  return createAlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1(
    materialized.sourcePath,
  );
}
