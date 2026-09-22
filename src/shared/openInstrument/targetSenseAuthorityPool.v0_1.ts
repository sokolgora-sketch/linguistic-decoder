import rawPool from "../../data/openInstrument/targetSenseAuthorityPool.v0_1.json";

export const TARGET_SENSE_AUTHORITY_POOL_SCHEMA_V0_1 =
  "open-instrument.target-sense-authority-pool.v0_1" as const;
export const TARGET_SENSE_AUTHORITY_POOL_ID_V0_1 =
  "open-instrument-target-sense-authority-pool-v0-1" as const;
export const TARGET_SENSE_AUTHORITY_POOL_VERSION_V0_1 = "0.1" as const;

export type TargetSenseAuthorityEntryV0_1 = Readonly<{
  caseId: string;
  targetWord: string;
  partOfSpeech: "noun" | "verb";
  targetSenseLabel: string;
  targetSenseId: string;
  targetSenseDefinition: string;
  targetSenseTruth: "FACT_FROM_SOURCE";
  sourceAuthority: "Cambridge Dictionary English";
  sourcePublisherOrHost: "Cambridge University Press & Assessment";
  sourceUrlOrArchiveRef: string;
  sourceDateOrVersion: string;
  entryLocator: string;
  sourceStatus: "VERIFIED_SOURCE_LOOKUP";
  freezeStatus: "FROZEN";
  useBoundary: "TARGET_SENSE_AUTHORITY_ONLY";
}>;

export type TargetSenseAuthorityUnresolvedCaseV0_1 = Readonly<{
  caseId: string;
  targetWord: string;
  sourceAuthority: "Cambridge Dictionary English";
  sourcePublisherOrHost: "Cambridge University Press & Assessment";
  sourceUrlOrArchiveRef: string;
  sourceDateOrVersion: string;
  resolutionStatus: "TARGET_SENSE_UNRESOLVED";
  reason: string;
  useBoundary: "TARGET_SENSE_AUTHORITY_ONLY";
}>;

export type TargetSenseAuthorityPoolV0_1 = Readonly<{
  schemaVersion: typeof TARGET_SENSE_AUTHORITY_POOL_SCHEMA_V0_1;
  poolId: typeof TARGET_SENSE_AUTHORITY_POOL_ID_V0_1;
  poolVersion: typeof TARGET_SENSE_AUTHORITY_POOL_VERSION_V0_1;
  poolStatus: "FROZEN";
  freezeDate: string;
  authorityPolicy: Readonly<{
    authority: "Cambridge Dictionary English";
    selectionRule: string;
    sourcePolicy: string;
    accessDate: string;
  }>;
  entries: readonly TargetSenseAuthorityEntryV0_1[];
  unresolvedCases: readonly TargetSenseAuthorityUnresolvedCaseV0_1[];
  prohibitedUses: readonly [
    "FUNCTIONAL_CORRESPONDENCE",
    "STRUCTURAL_EMBRYO_EVIDENCE",
    "HISTORICAL_ORIGIN",
    "WINNER_SELECTION",
  ];
}>;

type ValidationResultV0_1 =
  | Readonly<{ ok: true; value: TargetSenseAuthorityPoolV0_1 }>
  | Readonly<{ ok: false; errors: readonly string[] }>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const exactKeys = (value: Record<string, unknown>, expected: readonly string[]) =>
  Object.keys(value).sort().join("\u0000") === [...expected].sort().join("\u0000");

const ENTRY_KEYS = [
  "caseId",
  "targetWord",
  "partOfSpeech",
  "targetSenseLabel",
  "targetSenseId",
  "targetSenseDefinition",
  "targetSenseTruth",
  "sourceAuthority",
  "sourcePublisherOrHost",
  "sourceUrlOrArchiveRef",
  "sourceDateOrVersion",
  "entryLocator",
  "sourceStatus",
  "freezeStatus",
  "useBoundary",
] as const;

const UNRESOLVED_KEYS = [
  "caseId",
  "targetWord",
  "sourceAuthority",
  "sourcePublisherOrHost",
  "sourceUrlOrArchiveRef",
  "sourceDateOrVersion",
  "resolutionStatus",
  "reason",
  "useBoundary",
] as const;

const POOL_KEYS = [
  "schemaVersion",
  "poolId",
  "poolVersion",
  "poolStatus",
  "freezeDate",
  "authorityPolicy",
  "entries",
  "unresolvedCases",
  "prohibitedUses",
] as const;

const validateEntry = (value: unknown, index: number, errors: string[]) => {
  if (!isRecord(value) || !exactKeys(value, ENTRY_KEYS)) {
    errors.push(`entries[${index}] has an invalid field set`);
    return;
  }
  const entry = value;
  for (const key of [
    "caseId",
    "targetWord",
    "targetSenseLabel",
    "targetSenseId",
    "targetSenseDefinition",
    "sourceAuthority",
    "sourcePublisherOrHost",
    "sourceUrlOrArchiveRef",
    "sourceDateOrVersion",
    "entryLocator",
  ]) {
    if (!isNonEmptyString(entry[key])) errors.push(`entries[${index}].${key} must be non-empty`);
  }
  if (entry.partOfSpeech !== "noun" && entry.partOfSpeech !== "verb") {
    errors.push(`entries[${index}].partOfSpeech is invalid`);
  }
  if (entry.targetSenseTruth !== "FACT_FROM_SOURCE") {
    errors.push(`entries[${index}].targetSenseTruth is invalid`);
  }
  if (entry.sourceAuthority !== "Cambridge Dictionary English") {
    errors.push(`entries[${index}].sourceAuthority is invalid`);
  }
  if (entry.sourcePublisherOrHost !== "Cambridge University Press & Assessment") {
    errors.push(`entries[${index}].sourcePublisherOrHost is invalid`);
  }
  if (entry.sourceStatus !== "VERIFIED_SOURCE_LOOKUP") {
    errors.push(`entries[${index}].sourceStatus is invalid`);
  }
  if (entry.freezeStatus !== "FROZEN") errors.push(`entries[${index}].freezeStatus is invalid`);
  if (entry.useBoundary !== "TARGET_SENSE_AUTHORITY_ONLY") {
    errors.push(`entries[${index}].useBoundary is invalid`);
  }
  if (!/^cambridge\.en\.[a-z0-9-]+\.(noun|verb)\.[a-z0-9-]+-1$/.test(entry.targetSenseId as string)) {
    errors.push(`entries[${index}].targetSenseId does not use the Cambridge ID convention`);
  }
};

const validateUnresolvedCase = (value: unknown, index: number, errors: string[]) => {
  if (!isRecord(value) || !exactKeys(value, UNRESOLVED_KEYS)) {
    errors.push(`unresolvedCases[${index}] has an invalid field set`);
    return;
  }
  const item = value;
  for (const key of [
    "caseId",
    "targetWord",
    "sourceAuthority",
    "sourcePublisherOrHost",
    "sourceUrlOrArchiveRef",
    "sourceDateOrVersion",
    "reason",
  ]) {
    if (!isNonEmptyString(item[key])) errors.push(`unresolvedCases[${index}].${key} must be non-empty`);
  }
  if (item.sourceAuthority !== "Cambridge Dictionary English") {
    errors.push(`unresolvedCases[${index}].sourceAuthority is invalid`);
  }
  if (item.sourcePublisherOrHost !== "Cambridge University Press & Assessment") {
    errors.push(`unresolvedCases[${index}].sourcePublisherOrHost is invalid`);
  }
  if (item.resolutionStatus !== "TARGET_SENSE_UNRESOLVED") {
    errors.push(`unresolvedCases[${index}].resolutionStatus is invalid`);
  }
  if (item.useBoundary !== "TARGET_SENSE_AUTHORITY_ONLY") {
    errors.push(`unresolvedCases[${index}].useBoundary is invalid`);
  }
};

export function validateTargetSenseAuthorityPoolV0_1(
  value: unknown,
): ValidationResultV0_1 {
  const errors: string[] = [];
  if (!isRecord(value) || !exactKeys(value, POOL_KEYS)) {
    return { ok: false, errors: ["pool has an invalid field set"] };
  }
  if (value.schemaVersion !== TARGET_SENSE_AUTHORITY_POOL_SCHEMA_V0_1) {
    errors.push("schemaVersion is invalid");
  }
  if (value.poolId !== TARGET_SENSE_AUTHORITY_POOL_ID_V0_1) errors.push("poolId is invalid");
  if (value.poolVersion !== TARGET_SENSE_AUTHORITY_POOL_VERSION_V0_1) errors.push("poolVersion is invalid");
  if (value.poolStatus !== "FROZEN") errors.push("poolStatus is invalid");
  if (!isNonEmptyString(value.freezeDate)) errors.push("freezeDate must be non-empty");
  if (!isRecord(value.authorityPolicy)) errors.push("authorityPolicy must be an object");
  const policy = value.authorityPolicy;
  if (isRecord(policy)) {
    if (!exactKeys(policy, ["authority", "selectionRule", "sourcePolicy", "accessDate"])) {
      errors.push("authorityPolicy has an invalid field set");
    }
    if (policy.authority !== "Cambridge Dictionary English") errors.push("authorityPolicy.authority is invalid");
    if (!isNonEmptyString(policy.selectionRule)) errors.push("authorityPolicy.selectionRule must be non-empty");
    if (!isNonEmptyString(policy.sourcePolicy)) errors.push("authorityPolicy.sourcePolicy must be non-empty");
    if (!isNonEmptyString(policy.accessDate)) errors.push("authorityPolicy.accessDate must be non-empty");
  }
  if (!Array.isArray(value.entries)) errors.push("entries must be an array");
  if (!Array.isArray(value.unresolvedCases)) errors.push("unresolvedCases must be an array");
  if (!Array.isArray(value.prohibitedUses)) errors.push("prohibitedUses must be an array");
  if (Array.isArray(value.entries)) value.entries.forEach((entry, index) => validateEntry(entry, index, errors));
  if (Array.isArray(value.unresolvedCases)) {
    value.unresolvedCases.forEach((item, index) => validateUnresolvedCase(item, index, errors));
  }
  if (JSON.stringify(value.prohibitedUses) !== JSON.stringify([
    "FUNCTIONAL_CORRESPONDENCE",
    "STRUCTURAL_EMBRYO_EVIDENCE",
    "HISTORICAL_ORIGIN",
    "WINNER_SELECTION",
  ])) {
    errors.push("prohibitedUses is invalid");
  }
  if (Array.isArray(value.entries) && Array.isArray(value.unresolvedCases)) {
    const caseIds = [
      ...value.entries.map((entry) => isRecord(entry) ? entry.caseId : undefined),
      ...value.unresolvedCases.map((item) => isRecord(item) ? item.caseId : undefined),
    ];
    const definedCaseIds = caseIds.filter((caseId): caseId is string => typeof caseId === "string");
    if (new Set(definedCaseIds).size !== definedCaseIds.length) errors.push("caseId values must be unique");
    for (const [label, items] of [["entries", value.entries], ["unresolvedCases", value.unresolvedCases]] as const) {
      const ids = items
        .map((item) => isRecord(item) ? item.caseId : undefined)
        .filter((caseId): caseId is string => typeof caseId === "string");
      if ([...ids].sort().join("\u0000") !== ids.join("\u0000")) {
        errors.push(`${label} caseId values must be in deterministic order`);
      }
    }
  }
  return errors.length > 0
    ? { ok: false, errors }
    : { ok: true, value: value as TargetSenseAuthorityPoolV0_1 };
}

const canonicalize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!isRecord(value)) return value;
  return Object.fromEntries(
    Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]),
  );
};

export const canonicalSerializeTargetSenseAuthorityPoolV0_1 = (
  value: TargetSenseAuthorityPoolV0_1,
): string => JSON.stringify(canonicalize(value));

export const getTargetSenseAuthorityEntriesV0_1 = (
  pool: TargetSenseAuthorityPoolV0_1,
): readonly TargetSenseAuthorityEntryV0_1[] => pool.entries;

export const getTargetSenseAuthorityEntryByCaseIdV0_1 = (
  pool: TargetSenseAuthorityPoolV0_1,
  caseId: string,
): TargetSenseAuthorityEntryV0_1 | undefined =>
  pool.entries.find((entry) => entry.caseId === caseId);

export const TARGET_SENSE_AUTHORITY_POOL_V0_1 = rawPool as unknown as TargetSenseAuthorityPoolV0_1;

const initialValidation = validateTargetSenseAuthorityPoolV0_1(TARGET_SENSE_AUTHORITY_POOL_V0_1);
if (!initialValidation.ok) {
  throw new Error(`Invalid target-sense authority pool: ${initialValidation.errors.join("; ")}`);
}
