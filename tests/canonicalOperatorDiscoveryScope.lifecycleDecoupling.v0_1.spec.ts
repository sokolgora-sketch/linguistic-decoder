import {
  getCanonicalOperatorProfileV0_1,
  isCanonicalOperatorProfileDiscoveryTargetV0_1,
  isCanonicalOperatorProfileStructuralCarrierAllowedV0_1,
  type CanonicalOperatorProfileV0_1,
} from "@/shared/canonicalOperatorProfile.v0_1";

describe("canonical operator discovery scope lifecycle decoupling v0.1", () => {
  it("keeps AT target-bounded when governance lifecycle is hypothetically canon_locked", () => {
    const currentAt = getCanonicalOperatorProfileV0_1("AT");

    expect(currentAt).not.toBeNull();

    const canonLockedAt: CanonicalOperatorProfileV0_1 = {
      ...currentAt!,
      canonLifecycleStatus: "canon_locked",
    };

    expect(
      isCanonicalOperatorProfileDiscoveryTargetV0_1(
        canonLockedAt,
        "father",
      ),
    ).toBe(true);

    expect(
      isCanonicalOperatorProfileDiscoveryTargetV0_1(
        canonLockedAt,
        "at",
      ),
    ).toBe(true);

    for (const unrelatedWord of [
      "diet",
      "data",
      "random",
      "later",
    ]) {
      expect(
        isCanonicalOperatorProfileDiscoveryTargetV0_1(
          canonLockedAt,
          unrelatedWord,
        ),
      ).toBe(false);

      expect(
        isCanonicalOperatorProfileStructuralCarrierAllowedV0_1(
          canonLockedAt,
          unrelatedWord,
          "at",
        ),
      ).toBe(false);
    }
  });

  it("preserves legacy AT structural carriers under hypothetical canon lock", () => {
    const currentAt = getCanonicalOperatorProfileV0_1("AT");

    expect(currentAt).not.toBeNull();

    const canonLockedAt: CanonicalOperatorProfileV0_1 = {
      ...currentAt!,
      canonLifecycleStatus: "canon_locked",
    };

    for (const legacyCarrier of [
      "atë",
      "ati",
      "pater",
    ]) {
      expect(
        isCanonicalOperatorProfileStructuralCarrierAllowedV0_1(
          canonLockedAt,
          legacyCarrier,
          legacyCarrier,
        ),
      ).toBe(true);
    }
  });

  it("preserves broad discovery for existing canon-locked DA", () => {
    const da = getCanonicalOperatorProfileV0_1("DA");

    expect(da).not.toBeNull();

    expect(
      isCanonicalOperatorProfileDiscoveryTargetV0_1(
        da!,
        "data",
      ),
    ).toBe(true);

    expect(
      isCanonicalOperatorProfileDiscoveryTargetV0_1(
        da!,
        "random",
      ),
    ).toBe(true);
  });
});
