import {
  TARGET_SENSE_AUTHORITY_POOL_V0_1,
  canonicalSerializeTargetSenseAuthorityPoolV0_1,
  getTargetSenseAuthorityEntryByCaseIdV0_1,
  getTargetSenseAuthorityEntriesV0_1,
  validateTargetSenseAuthorityPoolV0_1,
} from "../src/shared/openInstrument/targetSenseAuthorityPool.v0_1";

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const allKeys = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.flatMap(allKeys);
  if (value === null || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) => [key, ...allKeys(child)]);
};

describe("Open Instrument target-sense authority pool v0.1", () => {
  test("freezes seven resolved ordinary target senses and two fail-closed cases", () => {
    expect(validateTargetSenseAuthorityPoolV0_1(TARGET_SENSE_AUTHORITY_POOL_V0_1).ok).toBe(true);
    expect(TARGET_SENSE_AUTHORITY_POOL_V0_1.poolStatus).toBe("FROZEN");
    expect(getTargetSenseAuthorityEntriesV0_1(TARGET_SENSE_AUTHORITY_POOL_V0_1)).toHaveLength(7);
    expect(TARGET_SENSE_AUTHORITY_POOL_V0_1.unresolvedCases).toHaveLength(2);
    expect(TARGET_SENSE_AUTHORITY_POOL_V0_1.entries.map((entry) => entry.caseId)).toEqual([
      "scale50.blood.body",
      "scale50.child.human-social",
      "scale50.mother.human-social",
      "scale50.mountain.nature",
      "scale50.river.nature",
      "scale50.speak.action",
      "scale50.woman.human-social",
    ]);
    expect(TARGET_SENSE_AUTHORITY_POOL_V0_1.unresolvedCases.map((item) => item.caseId)).toEqual([
      "scale50.memory.abstract",
      "scale50.truth.abstract",
    ]);
  });

  test("uses the existing Cambridge deterministic ID convention", () => {
    expect(TARGET_SENSE_AUTHORITY_POOL_V0_1.entries.every((entry) =>
      /^cambridge\.en\.[a-z0-9-]+\.(noun|verb)\.[a-z0-9-]+-1$/.test(entry.targetSenseId),
    )).toBe(true);
    expect(getTargetSenseAuthorityEntryByCaseIdV0_1(
      TARGET_SENSE_AUTHORITY_POOL_V0_1,
      "scale50.mother.human-social",
    )?.targetSenseId).toBe("cambridge.en.mother.noun.female-parent-1");
  });

  test("is source-backed target identity only, not functional or structural evidence", () => {
    expect(TARGET_SENSE_AUTHORITY_POOL_V0_1.entries.every((entry) =>
      entry.targetSenseTruth === "FACT_FROM_SOURCE" &&
      entry.useBoundary === "TARGET_SENSE_AUTHORITY_ONLY",
    )).toBe(true);
    expect(allKeys(TARGET_SENSE_AUTHORITY_POOL_V0_1)).not.toContain("semanticBridge");
    expect(allKeys(TARGET_SENSE_AUTHORITY_POOL_V0_1)).not.toContain("functionalMechanism");
    expect(allKeys(TARGET_SENSE_AUTHORITY_POOL_V0_1)).not.toContain("embryo");
    expect(allKeys(TARGET_SENSE_AUTHORITY_POOL_V0_1)).not.toContain("structuralHypothesisId");
    expect(allKeys(TARGET_SENSE_AUTHORITY_POOL_V0_1)).not.toContain("historicalOrigin");
    expect(TARGET_SENSE_AUTHORITY_POOL_V0_1.prohibitedUses).toContain("FUNCTIONAL_CORRESPONDENCE");
    expect(TARGET_SENSE_AUTHORITY_POOL_V0_1.prohibitedUses).toContain("STRUCTURAL_EMBRYO_EVIDENCE");
  });

  test("fails closed for unresolved polysemous target senses", () => {
    expect(TARGET_SENSE_AUTHORITY_POOL_V0_1.unresolvedCases.every((item) =>
      item.resolutionStatus === "TARGET_SENSE_UNRESOLVED" && item.reason.length > 0,
    )).toBe(true);
    expect(getTargetSenseAuthorityEntryByCaseIdV0_1(
      TARGET_SENSE_AUTHORITY_POOL_V0_1,
      "scale50.truth.abstract",
    )).toBeUndefined();
    expect(getTargetSenseAuthorityEntryByCaseIdV0_1(
      TARGET_SENSE_AUTHORITY_POOL_V0_1,
      "scale50.memory.abstract",
    )).toBeUndefined();
  });

  test("rejects missing source authority and missing freeze status", () => {
    const invalid = clone(TARGET_SENSE_AUTHORITY_POOL_V0_1) as any;
    delete invalid.entries[0].sourceUrlOrArchiveRef;
    invalid.entries[1].freezeStatus = "DRAFT";
    const result = validateTargetSenseAuthorityPoolV0_1(invalid);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.join(" ")).toMatch(/invalid field set|freezeStatus/);
  });

  test("has deterministic canonical serialization and reload behavior", () => {
    const parsed = JSON.parse(JSON.stringify(TARGET_SENSE_AUTHORITY_POOL_V0_1));
    expect(validateTargetSenseAuthorityPoolV0_1(parsed).ok).toBe(true);
    expect(canonicalSerializeTargetSenseAuthorityPoolV0_1(parsed)).toBe(
      canonicalSerializeTargetSenseAuthorityPoolV0_1(TARGET_SENSE_AUTHORITY_POOL_V0_1),
    );
  });

  test("exposes only resolved entries to a future target-selection consumer", () => {
    const resolved = getTargetSenseAuthorityEntriesV0_1(TARGET_SENSE_AUTHORITY_POOL_V0_1);
    expect(resolved.every((entry) => entry.freezeStatus === "FROZEN")).toBe(true);
    expect(resolved.map((entry) => entry.targetWord)).not.toContain("truth");
    expect(resolved.map((entry) => entry.targetWord)).not.toContain("memory");
  });
});
