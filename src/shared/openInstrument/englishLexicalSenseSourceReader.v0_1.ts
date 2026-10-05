import {
  ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_CODE_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_BYTES_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_SHA256_V0_1,
  EnglishLexicalSenseExampleV0_1,
  EnglishLexicalSenseSourceRecordV0_1,
  validateEnglishLexicalSenseSourceArtifactIdentityV0_1,
} from "@/shared/openInstrument/englishLexicalSenseSourceContract.v0_1";
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";

export const ENGLISH_LEXICAL_SENSE_SOURCE_READER_VERSION_V0_1 =
  "open-instrument.english-kaikki-hash-bound-source-reader.v0_1" as const;

export type EnglishLexicalSenseSourceReaderReasonCodeV0_1 =
  | "SOURCE_FILE_UNAVAILABLE"
  | "SOURCE_IDENTITY_MISMATCH"
  | "SOURCE_RECORD_EMPTY"
  | "SOURCE_RECORD_UTF8_INVALID"
  | "SOURCE_RECORD_JSON_INVALID"
  | "SOURCE_RECORD_SCHEMA_INVALID"
  | "SOURCE_RECORD_CONSUMER_FAILED";

export type EnglishLexicalSenseSourceReaderFailureV0_1 = Readonly<{
  ok: false;
  reasonCode: EnglishLexicalSenseSourceReaderReasonCodeV0_1;
  sourceRecordOrdinal?: number;
  byteOffset?: number;
  message?: string;
  expected?: Readonly<{
    byteLength: typeof ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_BYTES_V0_1;
    sha256: typeof ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_SHA256_V0_1;
  }>;
  observed?: Readonly<{ byteLength: number; sha256: string }>;
}>;

export type EnglishLexicalSenseSourceReaderSuccessV0_1 = Readonly<{
  ok: true;
  recordsRead: number;
  byteLength: number;
  sha256: string;
}>;

export type EnglishLexicalSenseSourceReaderResultV0_1 =
  | EnglishLexicalSenseSourceReaderSuccessV0_1
  | EnglishLexicalSenseSourceReaderFailureV0_1;

export type EnglishLexicalSenseSourceReaderOptionsV0_1 = Readonly<{
  path: string;
  onRecord: (
    record: EnglishLexicalSenseSourceRecordV0_1,
    sourceRecordOrdinal: number,
  ) => void | Promise<void>;
  chunkSize?: number;
}>;

function failure(
  reasonCode: EnglishLexicalSenseSourceReaderReasonCodeV0_1,
  details: Omit<EnglishLexicalSenseSourceReaderFailureV0_1, "ok" | "reasonCode"> = {},
): EnglishLexicalSenseSourceReaderFailureV0_1 {
  return Object.freeze({ ok: false, reasonCode, ...details });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringArray(
  value: unknown,
  field: string,
): { ok: true; value: readonly string[] } | { ok: false; field: string } {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    return { ok: false, field };
  }
  return { ok: true, value: value as readonly string[] };
}

function example(
  value: unknown,
): { ok: true; value: EnglishLexicalSenseExampleV0_1 } | { ok: false } {
  if (!isRecord(value)) return { ok: false };

  const output: {
    text?: string;
    ref?: string;
    bold_text_offsets?: readonly (readonly [number, number])[];
    type?: string;
  } = {};

  if (value.text !== undefined) {
    if (typeof value.text !== "string") return { ok: false };
    output.text = value.text;
  }
  if (value.ref !== undefined) {
    if (typeof value.ref !== "string") return { ok: false };
    output.ref = value.ref;
  }

  if (value.bold_text_offsets !== undefined) {
    if (
      !Array.isArray(value.bold_text_offsets) ||
      value.bold_text_offsets.some(
        (offset) =>
          !Array.isArray(offset) ||
          offset.length !== 2 ||
          typeof offset[0] !== "number" ||
          typeof offset[1] !== "number",
      )
    ) {
      return { ok: false };
    }
    output.bold_text_offsets = value.bold_text_offsets as readonly (readonly [
      number,
      number,
    ])[];
  }

  if (value.type !== undefined) {
    if (typeof value.type !== "string") return { ok: false };
    output.type = value.type;
  }

  return { ok: true, value: output };
}

export type EnglishLexicalSenseSourceRecordParseResultV0_1 =
  | { ok: true; record: EnglishLexicalSenseSourceRecordV0_1 }
  | {
      ok: false;
      reasonCode:
        | "SOURCE_RECORD_EMPTY"
        | "SOURCE_RECORD_UTF8_INVALID"
        | "SOURCE_RECORD_JSON_INVALID"
        | "SOURCE_RECORD_SCHEMA_INVALID";
      message?: string;
    };

export function parseEnglishLexicalSenseSourceRecordV0_1(
  recordBytes: Uint8Array,
): EnglishLexicalSenseSourceRecordParseResultV0_1 {
  if (recordBytes.length === 0) return { ok: false, reasonCode: "SOURCE_RECORD_EMPTY" };

  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(recordBytes);
  } catch (error) {
    return {
      ok: false,
      reasonCode: "SOURCE_RECORD_UTF8_INVALID",
      message: error instanceof Error ? error.message : String(error),
    };
  }

  let raw: unknown;
  try {
    raw = JSON.parse(text) as unknown;
  } catch (error) {
    return {
      ok: false,
      reasonCode: "SOURCE_RECORD_JSON_INVALID",
      message: error instanceof Error ? error.message : String(error),
    };
  }

  const projected = projectRecord(raw);
  if (!projected.ok) return { ok: false, reasonCode: "SOURCE_RECORD_SCHEMA_INVALID" };
  return projected;
}

function projectRecord(
  raw: unknown,
):
  | { ok: true; record: EnglishLexicalSenseSourceRecordV0_1 }
  | { ok: false } {
  if (!isRecord(raw)) return { ok: false };
  if (
    typeof raw.word !== "string" ||
    raw.lang !== ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_V0_1 ||
    raw.lang_code !== ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_CODE_V0_1 ||
    typeof raw.pos !== "string" ||
    !Array.isArray(raw.senses)
  ) {
    return { ok: false };
  }

  const senses: EnglishLexicalSenseSourceRecordV0_1["senses"][number][] = [];
  for (const rawSense of raw.senses) {
    if (!isRecord(rawSense) || typeof rawSense.id !== "string") {
      return { ok: false };
    }

    let glosses: readonly string[] = [];
    if (rawSense.glosses !== undefined) {
      const result = stringArray(rawSense.glosses, "senses[].glosses");
      if (!result.ok) return { ok: false };
      glosses = result.value;
    } else if (rawSense.raw_glosses !== undefined) {
      // Kaikki emits a small number of source senses with only raw_glosses.
      // The frozen reviewed "usable gloss" measurement treats that source
      // text as the sense text; it is still projected into the admitted
      // source-only gloss field and never becomes semantic authority.
      const result = stringArray(rawSense.raw_glosses, "senses[].raw_glosses");
      if (!result.ok) return { ok: false };
      glosses = result.value;
    }

    const sense: {
      id: string;
      glosses: readonly string[];
      tags?: readonly string[];
      raw_tags?: readonly string[];
      examples?: readonly EnglishLexicalSenseExampleV0_1[];
    } = { id: rawSense.id, glosses };

    if (rawSense.tags !== undefined) {
      const result = stringArray(rawSense.tags, "senses[].tags");
      if (!result.ok) return { ok: false };
      sense.tags = result.value;
    }
    if (rawSense.raw_tags !== undefined) {
      const result = stringArray(rawSense.raw_tags, "senses[].raw_tags");
      if (!result.ok) return { ok: false };
      sense.raw_tags = result.value;
    }
    if (rawSense.examples !== undefined) {
      if (!Array.isArray(rawSense.examples)) return { ok: false };
      const examples: EnglishLexicalSenseExampleV0_1[] = [];
      for (const rawExample of rawSense.examples) {
        const result = example(rawExample);
        if (!result.ok) return { ok: false };
        examples.push(result.value);
      }
      sense.examples = examples;
    }
    senses.push(sense);
  }

  return {
    ok: true,
    record: { word: raw.word, lang: raw.lang, lang_code: raw.lang_code, pos: raw.pos, senses },
  };
}

async function hashArtifactV0_1(
  path: string,
  chunkSize?: number,
): Promise<
  | { ok: true; byteLength: number; sha256: string }
  | EnglishLexicalSenseSourceReaderFailureV0_1
> {
  try {
    const hash = createHash("sha256");
    let byteLength = 0;
    for await (const chunk of createReadStream(path, { highWaterMark: chunkSize })) {
      const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      byteLength += bytes.length;
      hash.update(bytes);
    }
    return { ok: true, byteLength, sha256: hash.digest("hex") };
  } catch (error) {
    return failure("SOURCE_FILE_UNAVAILABLE", {
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function readEnglishLexicalSenseSourceV0_1(
  options: EnglishLexicalSenseSourceReaderOptionsV0_1,
): Promise<EnglishLexicalSenseSourceReaderResultV0_1> {
  const identity = await hashArtifactV0_1(options.path, options.chunkSize);
  if (!identity.ok) return identity;

  const identityCheck = validateEnglishLexicalSenseSourceArtifactIdentityV0_1(identity);
  if (!identityCheck.ok) {
    return failure("SOURCE_IDENTITY_MISMATCH", {
      expected: identityCheck.expected,
      observed: identityCheck.observed,
    });
  }

  let recordsRead = 0;
  let byteOffset = 0;
  let pending: Buffer[] = [];
  let pendingBytes = 0;

  const consume = async (recordBytes: Buffer, recordOffset: number) => {
    if (recordBytes.length === 0) {
      return failure("SOURCE_RECORD_EMPTY", { byteOffset: recordOffset });
    }

    const parsed = parseEnglishLexicalSenseSourceRecordV0_1(recordBytes);
    if (!parsed.ok) {
      return failure(parsed.reasonCode, {
        sourceRecordOrdinal: recordsRead + 1,
        byteOffset: recordOffset,
        message: parsed.message,
      });
    }

    try {
      await options.onRecord(parsed.record, recordsRead + 1);
    } catch (error) {
      return failure("SOURCE_RECORD_CONSUMER_FAILED", {
        sourceRecordOrdinal: recordsRead + 1,
        byteOffset: recordOffset,
        message: error instanceof Error ? error.message : String(error),
      });
    }
    recordsRead += 1;
    return null;
  };

  try {
    for await (const chunk of createReadStream(options.path, {
      highWaterMark: options.chunkSize,
    })) {
      const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      let segmentStart = 0;
      for (let index = 0; index < bytes.length; index += 1) {
        if (bytes[index] !== 0x0a) continue;
        const part = bytes.subarray(segmentStart, index);
        const recordBytes =
          pendingBytes === 0 ? part : Buffer.concat([...pending, part], pendingBytes + part.length);
        const result = await consume(recordBytes, byteOffset + segmentStart - pendingBytes);
        if (result) return result;
        pending = [];
        pendingBytes = 0;
        segmentStart = index + 1;
      }
      if (segmentStart < bytes.length) {
        const part = bytes.subarray(segmentStart);
        pending.push(part);
        pendingBytes += part.length;
      }
      byteOffset += bytes.length;
    }

    if (pendingBytes > 0) {
      const result = await consume(Buffer.concat(pending, pendingBytes), byteOffset - pendingBytes);
      if (result) return result;
    }
  } catch (error) {
    return failure("SOURCE_FILE_UNAVAILABLE", {
      byteOffset,
      message: error instanceof Error ? error.message : String(error),
    });
  }

  return Object.freeze({
    ok: true,
    recordsRead,
    byteLength: identity.byteLength,
    sha256: identity.sha256,
  });
}
