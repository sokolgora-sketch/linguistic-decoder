import {
  ALB_IPA_NORTHERN_TOSK_SOURCE_PROFILE_ID_V0_1,
} from "./albanianPronunciationSourceProfiles.v0_1";
export {
  ALB_IPA_NORTHERN_TOSK_SOURCE_PROFILE_ID_V0_1,
} from "./albanianPronunciationSourceProfiles.v0_1";
import type {
  AlbanianPronunciationProfileQualifierV0_1,
  AlbanianPronunciationScopeV0_1,
} from "./albanianPronunciationSourceContract.v0_1";
import type { AlbanianPhonologicalCategoryProjectionInputV0_1 } from "./albanianPhonologicalCategoryProjector.v0_1";

export const ALB_IPA_NORTHERN_TOSK_GIT_COMMIT_V0_1 =
  "60855d1ffe6471bd9a3aa12aa03afdc11f36e690" as const;
export const ALB_IPA_NORTHERN_TOSK_OSF_ARCHIVE_SHA256_V0_1 =
  "aced72224e60b6f9a20f6dda831a1558ca9d4a906d53031f887f48328601572a" as const;
export const ALB_IPA_NORTHERN_TOSK_OSF_ARCHIVE_BYTES_V0_1 = 1544137143 as const;
export const ALB_IPA_NORTHERN_TOSK_OSF_DOWNLOAD_URL_V0_1 =
  "https://osf.io/download/h4s6j/" as const;
export const ALB_IPA_NORTHERN_TOSK_REPOSITORY_URL_V0_1 =
  "https://github.com/stefanocoretta/alb-ipa" as const;
export const ALB_IPA_NORTHERN_TOSK_DATA_LICENSE_V0_1 = "CC-BY-4.0" as const;
export const ALB_IPA_NORTHERN_TOSK_SOURCE_NOTATION_V0_1 =
  "SAMPA_KAN_MAU_PHONE_TRANSCRIPTION" as const;

export type AlbIpaNorthernToskPhoneRowV0_1 = Readonly<{
  lexicalForm: string;
  speakerId: string;
  rawPhoneSequence: string;
  variantOrder: number;
  sourceLocator: string;
}>;

export type AlbIpaNorthernToskObservationV0_1 =
  AlbanianPhonologicalCategoryProjectionInputV0_1 &
  Readonly<{
    schemaVersion: "open-instrument.alb-ipa-northern-tosk-source-observation.v0_1";
    lexicalForm: string;
    lookupKey: string;
    rawPhoneSequence: string;
    normalizedIpa: string;
    sourceNotation: typeof ALB_IPA_NORTHERN_TOSK_SOURCE_NOTATION_V0_1;
    notationKind: "PHONEMIC";
    speakerId: string;
    variantIdentity: string;
    variantOrder: number;
    sourceLocator: string;
    provenance: Readonly<{
      repositoryUrl: typeof ALB_IPA_NORTHERN_TOSK_REPOSITORY_URL_V0_1;
      gitCommit: typeof ALB_IPA_NORTHERN_TOSK_GIT_COMMIT_V0_1;
      osfDownloadUrl: typeof ALB_IPA_NORTHERN_TOSK_OSF_DOWNLOAD_URL_V0_1;
      archiveSha256: typeof ALB_IPA_NORTHERN_TOSK_OSF_ARCHIVE_SHA256_V0_1;
      archiveBytes: typeof ALB_IPA_NORTHERN_TOSK_OSF_ARCHIVE_BYTES_V0_1;
      dataLicense: typeof ALB_IPA_NORTHERN_TOSK_DATA_LICENSE_V0_1;
    }>;
  }>;

const SAMPA_TO_IPA_V0_1: Readonly<Record<string, string>> = Object.freeze({
  "@": "ə",
  "4": "ɾ",
  "5": "ɫ",
  D: "ð",
  J: "ɲ",
  "J\\": "ɟ",
  S: "ʃ",
  T: "θ",
  Z: "ʒ",
  a: "a",
  b: "b",
  c: "c",
  d: "d",
  dz: "dz",
  dZ: "dʒ",
  e: "e",
  f: "f",
  g: "g",
  h: "h",
  i: "i",
  j: "j",
  k: "k",
  l: "l",
  m: "m",
  n: "n",
  o: "o",
  p: "p",
  r: "r",
  s: "s",
  t: "t",
  tS: "tʃ",
  ts: "ts",
  u: "u",
  v: "v",
  y: "y",
  z: "z",
});

export function normalizeAlbIpaSampaPhoneSequenceV0_1(
  rawPhoneSequence: string,
): string | null {
  const tokens = rawPhoneSequence.trim().split(/\s+/u).filter(Boolean);
  if (tokens.length === 0) return null;

  const normalized = tokens.map((token) => SAMPA_TO_IPA_V0_1[token]);
  if (normalized.some((token) => token === undefined)) return null;
  return normalized.join("");
}

export function createAlbIpaNorthernToskObservationV0_1(
  row: AlbIpaNorthernToskPhoneRowV0_1,
): AlbIpaNorthernToskObservationV0_1 | null {
  const normalizedIpa = normalizeAlbIpaSampaPhoneSequenceV0_1(row.rawPhoneSequence);
  if (normalizedIpa === null || row.lexicalForm.trim() === "") return null;

  const sourceScope: AlbanianPronunciationScopeV0_1 = "TOSK_EXPLICIT";
  const sourceProfileQualifier: AlbanianPronunciationProfileQualifierV0_1 =
    "NORTHERN_TOSK_EXPLICIT";

  return Object.freeze({
    schemaVersion: "open-instrument.alb-ipa-northern-tosk-source-observation.v0_1",
    lexicalForm: row.lexicalForm,
    lookupKey: row.lexicalForm.normalize("NFC").trim().toLowerCase(),
    rawIpa: `/${normalizedIpa}/`,
    normalizedIpa,
    rawPhoneSequence: row.rawPhoneSequence,
    sourceProfileId: ALB_IPA_NORTHERN_TOSK_SOURCE_PROFILE_ID_V0_1,
    sourceScope,
    sourceProfileQualifier,
    sourceNotation: ALB_IPA_NORTHERN_TOSK_SOURCE_NOTATION_V0_1,
    notationKind: "PHONEMIC",
    speakerId: row.speakerId,
    variantIdentity: `${row.lexicalForm}:${row.speakerId}:${row.variantOrder}`,
    variantOrder: row.variantOrder,
    sourceLocator: row.sourceLocator,
    provenance: Object.freeze({
      repositoryUrl: ALB_IPA_NORTHERN_TOSK_REPOSITORY_URL_V0_1,
      gitCommit: ALB_IPA_NORTHERN_TOSK_GIT_COMMIT_V0_1,
      osfDownloadUrl: ALB_IPA_NORTHERN_TOSK_OSF_DOWNLOAD_URL_V0_1,
      archiveSha256: ALB_IPA_NORTHERN_TOSK_OSF_ARCHIVE_SHA256_V0_1,
      archiveBytes: ALB_IPA_NORTHERN_TOSK_OSF_ARCHIVE_BYTES_V0_1,
      dataLicense: ALB_IPA_NORTHERN_TOSK_DATA_LICENSE_V0_1,
    }),
  });
}
