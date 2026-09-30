import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

import {
  ALBANIAN_PRONUNCIATION_SOURCE_ARTIFACT_BYTES_V0_1,
  ALBANIAN_PRONUNCIATION_SOURCE_ARTIFACT_SHA256_V0_1,
  ALBANIAN_PRONUNCIATION_SOURCE_PROFILE_ID_V0_1,
  ALBANIAN_PRONUNCIATION_REVIEWED_SOUND_NOTE_QUALIFIERS_V0_1,
  ALBANIAN_PRONUNCIATION_SOURCE_LABELS_V0_1,
  type AlbanianPronunciationProfileQualifierV0_1,
  type AlbanianPronunciationScopeV0_1,
} from "./albanianPronunciationSourceContract.v0_1";

export const ALBANIAN_PRONUNCIATION_SOURCE_OBSERVATION_SCHEMA_V0_1 =
  "open-instrument.albanian-pronunciation-source-observation.v0_1" as const;

export const ALBANIAN_PRONUNCIATION_SOURCE_NOTATION_V0_1 = "IPA" as const;

type AuthoritativeProvenanceV0_1 = Readonly<{
  authority: "AUTHORITATIVE_FROZEN_SOURCE";
  frozenArtifactSha256: typeof ALBANIAN_PRONUNCIATION_SOURCE_ARTIFACT_SHA256_V0_1;
  frozenArtifactBytes: typeof ALBANIAN_PRONUNCIATION_SOURCE_ARTIFACT_BYTES_V0_1;
  fixtureId: null;
  extractionRule: null;
}>;

type NonAuthoritativeFixtureProvenanceV0_1 = Readonly<{
  authority: "NON_AUTHORITATIVE_FIXTURE";
  frozenArtifactSha256: null;
  frozenArtifactBytes: null;
  fixtureId: string;
  extractionRule: string;
}>;

export type AlbanianPronunciationSourceProvenanceV0_1 = Readonly<
  (
    | AuthoritativeProvenanceV0_1
    | NonAuthoritativeFixtureProvenanceV0_1
  ) & {
    readArtifactSha256: string;
    readArtifactBytes: number;
  }
>;

export type AlbanianPronunciationSourceObservationV0_1 = Readonly<{
  schemaVersion: typeof ALBANIAN_PRONUNCIATION_SOURCE_OBSERVATION_SCHEMA_V0_1;
  lexicalForm: string;
  lookupKey: string;
  rawIpa: string;
  sourceProfileId: typeof ALBANIAN_PRONUNCIATION_SOURCE_PROFILE_ID_V0_1;
  sourceScope: AlbanianPronunciationScopeV0_1;
  sourceProfileQualifier: AlbanianPronunciationProfileQualifierV0_1 | null;
  sourceNotation: typeof ALBANIAN_PRONUNCIATION_SOURCE_NOTATION_V0_1;
  notationKind: "UNSPECIFIED";
  directTags: readonly string[];
  notes: readonly string[];
  variantIdentity: string;
  variantOrder: number;
  sourceRecordId: string;
  sourceLocator: Readonly<{
    lineNumber: number;
    byteOffset: number;
    rowSha256: string;
  }>;
  provenance: AlbanianPronunciationSourceProvenanceV0_1;
}>;

export type AlbanianPronunciationSourceArtifactInputV0_1 = Readonly<{
  artifactPath: string;
}>;

export type AlbanianPronunciationSourceFixtureInputV0_1 = Readonly<{
  artifactPath: string;
  expectedArtifactSha256: string;
  expectedArtifactBytes: number;
  fixtureId: string;
  extractionRule: string;
  authority: "NON_AUTHORITATIVE_FIXTURE";
}>;

export type AlbanianPronunciationSourceArtifactVerificationV0_1 = Readonly<
  | {
      ok: true;
      artifactSha256: string;
      artifactBytes: number;
    }
  | {
      ok: false;
      reasonCode: "SOURCE_ARTIFACT_IDENTITY_MISMATCH";
      artifactSha256: string;
      artifactBytes: number;
    }
  | {
      ok: false;
      reasonCode: "SOURCE_ARTIFACT_READ_FAILURE";
      artifactSha256: null;
      artifactBytes: null;
    }
>;

export type AlbanianPronunciationSourceLookupOutcomeV0_1 =
  | "DEFINED"
  | "LEXICAL_FORM_NOT_FOUND"
  | "FORM_WITHOUT_EXPLICIT_IPA"
  | "ARTIFACT_INVALID"
  | "SOURCE_ROW_INVALID";

export type AlbanianPronunciationSourceLookupResultV0_1 = Readonly<
  | {
      status: "defined";
      normalizedLookupKey: string;
      outcome: "DEFINED";
      observations: readonly AlbanianPronunciationSourceObservationV0_1[];
      artifact: AlbanianPronunciationSourceArtifactVerificationV0_1 & { ok: true };
    }
  | {
      status: "null";
      normalizedLookupKey: string;
      outcome: Exclude<AlbanianPronunciationSourceLookupOutcomeV0_1, "DEFINED">;
      observations: readonly [];
      reasonCode:
        | "PRONUNCIATION_NOT_FOUND"
        | "SOURCE_ARTIFACT_IDENTITY_MISMATCH"
        | "SOURCE_ARTIFACT_READ_FAILURE"
        | "SOURCE_ROW_INVALID";
      artifact: AlbanianPronunciationSourceArtifactVerificationV0_1;
    }
>;

type ArtifactIdentityV0_1 = Readonly<{
  sha256: string;
  bytes: number;
}>;

type ProvenanceSeedV0_1 = AuthoritativeProvenanceV0_1 | NonAuthoritativeFixtureProvenanceV0_1;

type JsonRecordV0_1 = Record<string, unknown>;

type ParsedSourceRowV0_1 = Readonly<{
  lineNumber: number;
  byteOffset: number;
  rawLine: Buffer;
  value: JsonRecordV0_1;
}>;

function scopeEntriesV0_1(
  tags: readonly string[],
  scope: AlbanianPronunciationScopeV0_1,
): readonly (readonly [string, AlbanianPronunciationScopeV0_1])[] {
  return tags.map((tag) => [tag, scope] as const);
}

const DIRECT_SCOPE_TAG_TO_SCOPE_V0_1: ReadonlyMap<string, AlbanianPronunciationScopeV0_1> =
  new Map([
    ...scopeEntriesV0_1(
      ALBANIAN_PRONUNCIATION_SOURCE_LABELS_V0_1.STANDARD_EXPLICIT,
      "STANDARD_EXPLICIT",
    ),
    ...scopeEntriesV0_1(
      ALBANIAN_PRONUNCIATION_SOURCE_LABELS_V0_1.GHEG_EXPLICIT,
      "GHEG_EXPLICIT",
    ),
    ...scopeEntriesV0_1(
      ALBANIAN_PRONUNCIATION_SOURCE_LABELS_V0_1.TOSK_EXPLICIT,
      "TOSK_EXPLICIT",
    ),
    ...scopeEntriesV0_1(
      ALBANIAN_PRONUNCIATION_SOURCE_LABELS_V0_1.REGIONAL_EXPLICIT,
      "REGIONAL_EXPLICIT",
    ),
  ]);

function isRecordV0_1(value: unknown): value is JsonRecordV0_1 {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeLookupKeyV0_1(value: string): string {
  return value.normalize("NFC").trim().toLowerCase();
}

function sha256V0_1(value: Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

function isFilesystemReadFailureV0_1(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string"
  );
}

function readArtifactBytesV0_1(
  artifactPath: string,
): { ok: true; bytes: Buffer } | { ok: false } {
  try {
    return { ok: true, bytes: readFileSync(artifactPath) };
  } catch (error) {
    if (isFilesystemReadFailureV0_1(error)) return { ok: false };
    throw error;
  }
}

function stringArrayV0_1(value: unknown): readonly string[] | null {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    return null;
  }
  return value as readonly string[];
}

function notesV0_1(value: unknown): readonly string[] | null {
  if (value === undefined || value === null) return [];
  if (typeof value === "string") return [value];
  return stringArrayV0_1(value);
}

function sourceScopeFromTagsV0_1(
  tags: readonly string[],
): AlbanianPronunciationScopeV0_1 {
  const scopes = new Set(
    tags
      .map((tag) => DIRECT_SCOPE_TAG_TO_SCOPE_V0_1.get(tag))
      .filter((scope): scope is AlbanianPronunciationScopeV0_1 => scope !== undefined),
  );

  if (scopes.size !== 1) return "ALBANIAN_UNSPECIFIED";
  return [...scopes][0];
}

export function sourceProfileQualifierFromDirectTagsV0_1(
  tags: readonly string[],
): AlbanianPronunciationProfileQualifierV0_1 | null {
  const tagSet = new Set(tags);
  if (tagSet.has("Northern") && tagSet.has("Tosk")) {
    return "NORTHERN_TOSK_EXPLICIT";
  }
  if (tagSet.has("Southern") && tagSet.has("Gheg")) {
    return "SOUTHERN_GHEG_EXPLICIT";
  }
  return null;
}

export function sourceProfileQualifierFromSoundMetadataV0_1(
  tags: readonly string[],
  notes: readonly string[],
): AlbanianPronunciationProfileQualifierV0_1 | null {
  const directQualifier = sourceProfileQualifierFromDirectTagsV0_1(tags);
  if (directQualifier !== null) return directQualifier;

  // A note is admissible only as one exact reviewed sound-level label, with
  // no direct tags that could conflict or require interpretation.
  if (tags.length !== 0 || notes.length !== 1) return null;
  const note = notes[0];
  if (note === undefined) return null;
  return (
    ALBANIAN_PRONUNCIATION_REVIEWED_SOUND_NOTE_QUALIFIERS_V0_1[
      note as keyof typeof ALBANIAN_PRONUNCIATION_REVIEWED_SOUND_NOTE_QUALIFIERS_V0_1
    ] ?? null
  );
}

function artifactVerificationV0_1(
  expected: ArtifactIdentityV0_1,
  bytes: Buffer,
): AlbanianPronunciationSourceArtifactVerificationV0_1 {
  const artifactSha256 = sha256V0_1(bytes);
  const artifactBytes = bytes.byteLength;

  if (artifactSha256 !== expected.sha256 || artifactBytes !== expected.bytes) {
    return {
      ok: false,
      reasonCode: "SOURCE_ARTIFACT_IDENTITY_MISMATCH",
      artifactSha256,
      artifactBytes,
    };
  }

  return { ok: true, artifactSha256, artifactBytes };
}

function parseJsonlRowsV0_1(bytes: Buffer):
  | { ok: true; rows: readonly ParsedSourceRowV0_1[] }
  | { ok: false } {
  const rows: ParsedSourceRowV0_1[] = [];
  let byteOffset = 0;
  const text = bytes.toString("utf8");
  const lines = text.split("\n");

  for (const [index, line] of lines.entries()) {
    const rawLineText = line.endsWith("\r") ? line.slice(0, -1) : line;
    const rawLine = Buffer.from(rawLineText, "utf8");
    const lineNumber = index + 1;
    byteOffset += Buffer.byteLength(line, "utf8") + (index < lines.length - 1 ? 1 : 0);

    if (!rawLineText) continue;

    let value: unknown;
    try {
      value = JSON.parse(rawLineText) as unknown;
    } catch {
      return { ok: false };
    }
    if (!isRecordV0_1(value)) return { ok: false };

    rows.push({
      lineNumber,
      byteOffset: byteOffset - rawLine.byteLength - (index < lines.length - 1 ? 1 : 0),
      rawLine,
      value,
    });
  }

  return { ok: true, rows };
}

function projectRowObservationsV0_1(
  row: ParsedSourceRowV0_1,
  provenanceSeed: ProvenanceSeedV0_1,
  verification: Extract<AlbanianPronunciationSourceArtifactVerificationV0_1, { ok: true }>,
  variantOrderOffset: number,
):
  | { ok: true; lexicalForm: string; observations: readonly AlbanianPronunciationSourceObservationV0_1[] }
  | { ok: false } {
  const word = row.value.word;
  const lang = row.value.lang;
  const langCode = row.value.lang_code;
  const soundsValue = row.value.sounds;

  if (typeof word !== "string" || lang !== "Albanian" || langCode !== "sq") {
    return { ok: false };
  }
  if (soundsValue !== undefined && !Array.isArray(soundsValue)) return { ok: false };

  const sounds = Array.isArray(soundsValue) ? soundsValue : [];
  const ipaSounds: Array<{
    index: number;
    rawIpa: string;
    tags: readonly string[];
    notes: readonly string[];
  }> = [];

  for (const [index, soundValue] of sounds.entries()) {
    if (!isRecordV0_1(soundValue)) return { ok: false };
    if (Object.hasOwn(soundValue, "ipa") && soundValue.ipa !== undefined && soundValue.ipa !== null && typeof soundValue.ipa !== "string") {
      return { ok: false };
    }
    const rawIpa = soundValue.ipa;
    if (typeof rawIpa !== "string" || rawIpa.length === 0) continue;

    const tags = stringArrayV0_1(soundValue.tags);
    const notes = notesV0_1(soundValue.note);
    if (tags === null || notes === null) return { ok: false };
    ipaSounds.push({ index, rawIpa, tags, notes });
  }

  const lookupKey = normalizeLookupKeyV0_1(word);
  const rowSha256 = sha256V0_1(row.rawLine);
  const observations = ipaSounds.map((sound, rowVariantOrder) => {
    const sourceRecordId = `${ALBANIAN_PRONUNCIATION_SOURCE_PROFILE_ID_V0_1}:line:${row.lineNumber}:sound:${sound.index}`;
    return Object.freeze({
      schemaVersion: ALBANIAN_PRONUNCIATION_SOURCE_OBSERVATION_SCHEMA_V0_1,
      lexicalForm: word,
      lookupKey,
      rawIpa: sound.rawIpa,
      sourceProfileId: ALBANIAN_PRONUNCIATION_SOURCE_PROFILE_ID_V0_1,
      sourceScope: sourceScopeFromTagsV0_1(sound.tags),
      sourceProfileQualifier: sourceProfileQualifierFromSoundMetadataV0_1(
        sound.tags,
        sound.notes,
      ),
      sourceNotation: ALBANIAN_PRONUNCIATION_SOURCE_NOTATION_V0_1,
      notationKind: "UNSPECIFIED" as const,
      directTags: Object.freeze([...sound.tags]),
      notes: Object.freeze([...sound.notes]),
      variantIdentity: sourceRecordId,
      variantOrder: variantOrderOffset + rowVariantOrder,
      sourceRecordId,
      sourceLocator: Object.freeze({
        lineNumber: row.lineNumber,
        byteOffset: row.byteOffset,
        rowSha256,
      }),
      provenance: Object.freeze({
        ...provenanceSeed,
        readArtifactSha256: verification.artifactSha256,
        readArtifactBytes: verification.artifactBytes,
      }),
    });
  });

  return { ok: true, lexicalForm: word, observations };
}

export function verifyAlbanianPronunciationSourceArtifactV0_1(
  input: AlbanianPronunciationSourceArtifactInputV0_1,
): AlbanianPronunciationSourceArtifactVerificationV0_1 {
  const read = readArtifactBytesV0_1(input.artifactPath);
  if (!read.ok) {
    return {
      ok: false,
      reasonCode: "SOURCE_ARTIFACT_READ_FAILURE",
      artifactSha256: null,
      artifactBytes: null,
    };
  }
  return artifactVerificationV0_1(
    {
      sha256: ALBANIAN_PRONUNCIATION_SOURCE_ARTIFACT_SHA256_V0_1,
      bytes: ALBANIAN_PRONUNCIATION_SOURCE_ARTIFACT_BYTES_V0_1,
    },
    read.bytes,
  );
}

export function verifyAlbanianPronunciationFixtureArtifactV0_1(
  input: AlbanianPronunciationSourceFixtureInputV0_1,
): AlbanianPronunciationSourceArtifactVerificationV0_1 {
  const read = readArtifactBytesV0_1(input.artifactPath);
  if (!read.ok) {
    return {
      ok: false,
      reasonCode: "SOURCE_ARTIFACT_READ_FAILURE",
      artifactSha256: null,
      artifactBytes: null,
    };
  }
  return artifactVerificationV0_1(
    { sha256: input.expectedArtifactSha256, bytes: input.expectedArtifactBytes },
    read.bytes,
  );
}

function readAlbanianPronunciationObservationsFromArtifactV0_1(
  lexicalForm: string,
  artifactPath: string,
  expected: ArtifactIdentityV0_1,
  provenanceSeed: ProvenanceSeedV0_1,
): AlbanianPronunciationSourceLookupResultV0_1 {
  const normalizedLookupKey = normalizeLookupKeyV0_1(lexicalForm);
  const read = readArtifactBytesV0_1(artifactPath);
  if (!read.ok) {
    return {
      status: "null",
      normalizedLookupKey,
      outcome: "ARTIFACT_INVALID",
      observations: [],
      reasonCode: "SOURCE_ARTIFACT_READ_FAILURE",
      artifact: {
        ok: false,
        reasonCode: "SOURCE_ARTIFACT_READ_FAILURE",
        artifactSha256: null,
        artifactBytes: null,
      },
    };
  }

  const artifact = artifactVerificationV0_1(expected, read.bytes);
  if (!artifact.ok) {
    return {
      status: "null",
      normalizedLookupKey,
      outcome: "ARTIFACT_INVALID",
      observations: [],
      reasonCode: artifact.reasonCode,
      artifact,
    };
  }

  const parsed = parseJsonlRowsV0_1(read.bytes);
  if (!parsed.ok) {
    return {
      status: "null",
      normalizedLookupKey,
      outcome: "SOURCE_ROW_INVALID",
      observations: [],
      reasonCode: "SOURCE_ROW_INVALID",
      artifact,
    };
  }

  let matchingForm = false;
  const observations: AlbanianPronunciationSourceObservationV0_1[] = [];
  for (const row of parsed.rows) {
    if (normalizeLookupKeyV0_1(String(row.value.word ?? "")) !== normalizedLookupKey) continue;
    const projected = projectRowObservationsV0_1(
      row,
      provenanceSeed,
      artifact,
      observations.length,
    );
    if (!projected.ok) {
      return {
        status: "null",
        normalizedLookupKey,
        outcome: "SOURCE_ROW_INVALID",
        observations: [],
        reasonCode: "SOURCE_ROW_INVALID",
        artifact,
      };
    }
    matchingForm = true;
    observations.push(...projected.observations);
  }

  if (observations.length === 0) {
    return {
      status: "null",
      normalizedLookupKey,
      outcome: matchingForm ? "FORM_WITHOUT_EXPLICIT_IPA" : "LEXICAL_FORM_NOT_FOUND",
      observations: [],
      reasonCode: "PRONUNCIATION_NOT_FOUND",
      artifact,
    };
  }

  return {
    status: "defined",
    normalizedLookupKey,
    outcome: "DEFINED",
    observations: Object.freeze(observations),
    artifact,
  };
}

export function readAlbanianPronunciationObservationsV0_1(
  lexicalForm: string,
  input: AlbanianPronunciationSourceArtifactInputV0_1,
): AlbanianPronunciationSourceLookupResultV0_1 {
  return readAlbanianPronunciationObservationsFromArtifactV0_1(
    lexicalForm,
    input.artifactPath,
    {
      sha256: ALBANIAN_PRONUNCIATION_SOURCE_ARTIFACT_SHA256_V0_1,
      bytes: ALBANIAN_PRONUNCIATION_SOURCE_ARTIFACT_BYTES_V0_1,
    },
    {
      authority: "AUTHORITATIVE_FROZEN_SOURCE",
      frozenArtifactSha256: ALBANIAN_PRONUNCIATION_SOURCE_ARTIFACT_SHA256_V0_1,
      frozenArtifactBytes: ALBANIAN_PRONUNCIATION_SOURCE_ARTIFACT_BYTES_V0_1,
      fixtureId: null,
      extractionRule: null,
    },
  );
}

export function readAlbanianPronunciationFixtureObservationsV0_1(
  lexicalForm: string,
  input: AlbanianPronunciationSourceFixtureInputV0_1,
): AlbanianPronunciationSourceLookupResultV0_1 {
  return readAlbanianPronunciationObservationsFromArtifactV0_1(
    lexicalForm,
    input.artifactPath,
    { sha256: input.expectedArtifactSha256, bytes: input.expectedArtifactBytes },
    {
      authority: input.authority,
      frozenArtifactSha256: null,
      frozenArtifactBytes: null,
      fixtureId: input.fixtureId,
      extractionRule: input.extractionRule,
    },
  );
}
