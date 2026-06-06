import {
  BRAIN_CANDIDATE_TYPES,
  BRAIN_EVIDENCE_TYPES,
  BRAIN_FALSE_FRIEND_RISKS,
} from "./brainCandidateSearchPrompt.v0.1";

export type BrainCandidateEnumRepairStatus =
  | "repaired"
  | "unchanged"
  | "unresolved";

export type BrainCandidateEnumRepairAuditEntry = {
  path: string;
  field: string;
  originalValue: unknown;
  normalizedValue: unknown;
  mappingRuleId: string;
  status: BrainCandidateEnumRepairStatus;
  reason: string;
  extractedValue?: unknown;
  objectShape?: string;
  carrierKey?: string;
};

export type BrainCandidateEnumRepairResult = {
  rawBrainOutput: unknown;
  normalizedBrainOutput: unknown;
  audit: BrainCandidateEnumRepairAuditEntry[];
  unresolved: BrainCandidateEnumRepairAuditEntry[];
};

type BrainCandidateEnumField =
  | "candidateType"
  | "evidenceType"
  | "falseFriendRisk";

type EnumRule = {
  field: BrainCandidateEnumField;
  allowedValues: readonly string[];
};

type BrainCandidateEnumObjectCarrierKey = "type";

const APPROVED_OBJECT_CARRIER_KEYS: readonly BrainCandidateEnumObjectCarrierKey[] = [
  "type",
] as const;

const ENUM_RULES: readonly EnumRule[] = [
  { field: "candidateType", allowedValues: BRAIN_CANDIDATE_TYPES },
  { field: "evidenceType", allowedValues: BRAIN_EVIDENCE_TYPES },
  { field: "falseFriendRisk", allowedValues: BRAIN_FALSE_FRIEND_RISKS },
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneJsonLike<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => cloneJsonLike(item)) as T;
  }

  if (isRecord(value)) {
    const cloned: Record<string, unknown> = {};
    for (const [key, nestedValue] of Object.entries(value)) {
      cloned[key] = cloneJsonLike(nestedValue);
    }
    return cloned as T;
  }

  return value;
}

function canonicalizeEnumString(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function isCanonicalEnumValue(
  field: BrainCandidateEnumField,
  value: string,
): boolean {
  const rule = ENUM_RULES.find((candidateRule) => candidateRule.field === field);
  return rule ? rule.allowedValues.includes(value) : false;
}

function describeObjectShape(value: Record<string, unknown>): string {
  const keys = Object.keys(value).sort();
  return keys.length > 0 ? keys.join("|") : "(empty object)";
}

function normalizeScalarEnumValue(
  field: BrainCandidateEnumField,
  originalValue: unknown,
  path: string,
): {
  normalizedValue: unknown;
  audit: BrainCandidateEnumRepairAuditEntry;
} {
  if (originalValue === undefined) {
    return {
      normalizedValue: undefined,
      audit: {
        path,
        field,
        originalValue,
        normalizedValue: undefined,
        mappingRuleId: "missing_field",
        status: "unresolved",
        reason: "Enum field is missing and cannot be safely invented.",
      },
    };
  }

  if (typeof originalValue !== "string") {
    return {
      normalizedValue: originalValue,
      audit: {
        path,
        field,
        originalValue,
        normalizedValue: originalValue,
        mappingRuleId: "non_scalar_value",
        status: "unresolved",
        reason: "Enum field is non-scalar and cannot be coerced into a string.",
      },
    };
  }

  const trimmed = originalValue.trim();
  if (trimmed.length === 0) {
    return {
      normalizedValue: originalValue,
      audit: {
        path,
        field,
        originalValue,
        normalizedValue: originalValue,
        mappingRuleId: "unknown_enum_value",
        status: "unresolved",
        reason: "Empty string is not a valid enum value.",
      },
    };
  }

  if (isCanonicalEnumValue(field, trimmed)) {
    return {
      normalizedValue: trimmed,
      audit: {
        path,
        field,
        originalValue,
        normalizedValue: trimmed,
        mappingRuleId: "already_canonical",
        status: "unchanged",
        reason: "Enum value is already canonical.",
      },
    };
  }

  const normalized = canonicalizeEnumString(trimmed);
  if (isCanonicalEnumValue(field, normalized)) {
    return {
      normalizedValue: normalized,
      audit: {
        path,
        field,
        originalValue,
        normalizedValue: normalized,
        mappingRuleId: "case_space_hyphen_underscore_normalization",
        status: "repaired",
        reason: "Enum value was deterministically normalized to a canonical scalar string.",
      },
    };
  }

  return {
    normalizedValue: originalValue,
    audit: {
      path,
      field,
      originalValue,
      normalizedValue: originalValue,
      mappingRuleId: "unknown_enum_value",
      status: "unresolved",
      reason: "Enum value does not map to a known canonical value.",
    },
  };
}

function normalizeObjectWrappedEnumValue(
  field: BrainCandidateEnumField,
  originalValue: Record<string, unknown>,
  path: string,
): {
  normalizedValue: unknown;
  audit: BrainCandidateEnumRepairAuditEntry;
} {
  const objectShape = describeObjectShape(originalValue);
  const carrierKey: BrainCandidateEnumObjectCarrierKey = "type";
  const keys = Object.keys(originalValue);
  const hasApprovedCarrier = Object.prototype.hasOwnProperty.call(
    originalValue,
    carrierKey,
  );

  if (!hasApprovedCarrier) {
    return {
      normalizedValue: originalValue,
      audit: {
        path,
        field,
        originalValue,
        normalizedValue: originalValue,
        objectShape,
        mappingRuleId: "object_missing_carrier_key",
        status: "unresolved",
        reason:
          "Object wrapper is missing the approved scalar carrier key and cannot be normalized.",
      },
    };
  }

  if (keys.length !== APPROVED_OBJECT_CARRIER_KEYS.length) {
    return {
      normalizedValue: originalValue,
      audit: {
        path,
        field,
        originalValue,
        normalizedValue: originalValue,
        objectShape,
        carrierKey,
        mappingRuleId: "object_multiple_carrier_keys",
        status: "unresolved",
        reason:
          "Object wrapper must contain exactly one approved scalar carrier key.",
      },
    };
  }

  const extractedValue = originalValue[carrierKey];
  if (typeof extractedValue !== "string") {
    return {
      normalizedValue: originalValue,
      audit: {
        path,
        field,
        originalValue,
        normalizedValue: originalValue,
        extractedValue,
        objectShape,
        carrierKey,
        mappingRuleId: "object_non_scalar_carrier_value",
        status: "unresolved",
        reason:
          "Object wrapper carrier value is not a scalar string and cannot be normalized.",
      },
    };
  }

  const scalarResult = normalizeScalarEnumValue(field, extractedValue, path);
  if (scalarResult.audit.status === "unresolved") {
    return {
      normalizedValue: originalValue,
      audit: {
        path,
        field,
        originalValue,
        normalizedValue: originalValue,
        extractedValue,
        objectShape,
        carrierKey,
        mappingRuleId: "object_unknown_enum_value",
        status: "unresolved",
        reason:
          "Object wrapper carrier string does not map to a known canonical enum value.",
      },
    };
  }

  return {
    normalizedValue: scalarResult.normalizedValue,
    audit: {
      path,
      field,
      originalValue,
      normalizedValue: scalarResult.normalizedValue,
      extractedValue,
      objectShape,
      carrierKey,
      mappingRuleId: "object_type_scalar_enum_wrapper",
      status: "repaired",
      reason:
        scalarResult.audit.status === "repaired"
          ? "Object wrapper extracted a scalar string and normalized it to a canonical enum value."
          : "Object wrapper extracted an already canonical scalar enum value.",
    },
  };
}

function normalizeEnumValue(
  field: BrainCandidateEnumField,
  originalValue: unknown,
  path: string,
): {
  normalizedValue: unknown;
  audit: BrainCandidateEnumRepairAuditEntry;
} {
  if (isRecord(originalValue)) {
    return normalizeObjectWrappedEnumValue(field, originalValue, path);
  }

  return normalizeScalarEnumValue(field, originalValue, path);
}

function repairCandidateArray(
  normalizedRoot: unknown,
  arrayPath: "chunkCandidates" | "nullCandidates",
  audit: BrainCandidateEnumRepairAuditEntry[],
  unresolved: BrainCandidateEnumRepairAuditEntry[],
): void {
  if (!isRecord(normalizedRoot)) return;

  const candidates = normalizedRoot[arrayPath];
  if (!Array.isArray(candidates)) return;

  candidates.forEach((candidate, index) => {
    const candidatePath = `${arrayPath}.${index}`;
    if (!isRecord(candidate)) {
      for (const { field } of ENUM_RULES) {
        const entry: BrainCandidateEnumRepairAuditEntry = {
          path: `${candidatePath}.${field}`,
          field,
          originalValue: candidate,
          normalizedValue: candidate,
          mappingRuleId: "non_scalar_value",
          status: "unresolved",
          reason: "Candidate entry is not an object, so enum fields cannot be normalized.",
        };
        audit.push(entry);
        unresolved.push(entry);
      }
      return;
    }

    for (const { field } of ENUM_RULES) {
      const { normalizedValue, audit: entry } = normalizeEnumValue(
        field,
        candidate[field],
        `${candidatePath}.${field}`,
      );

      audit.push(entry);
      if (entry.status === "unresolved") {
        unresolved.push(entry);
      }

      if (candidate[field] !== normalizedValue && entry.status !== "unresolved") {
        candidate[field] = normalizedValue;
      }
    }
  });
}

export function normalizeBrainCandidateEnums(
  rawBrainOutput: unknown,
): BrainCandidateEnumRepairResult {
  const normalizedBrainOutput = cloneJsonLike(rawBrainOutput);
  const audit: BrainCandidateEnumRepairAuditEntry[] = [];
  const unresolved: BrainCandidateEnumRepairAuditEntry[] = [];

  repairCandidateArray(normalizedBrainOutput, "chunkCandidates", audit, unresolved);
  repairCandidateArray(normalizedBrainOutput, "nullCandidates", audit, unresolved);

  return {
    rawBrainOutput,
    normalizedBrainOutput,
    audit,
    unresolved,
  };
}
