import {
  DA_FREE_OPERATOR_PROFILE_V0_1,
  FREE_OPERATOR_PROFILES_V0_1,
  freeOperatorProfileFormMatchesV0_1,
  freeOperatorProfileGlossMatchesV0_1,
} from "../src/shared/freeOperatorProfile.v0_1";

describe("free operator profile contract v0.1", () => {
  it("keeps DA as data instead of a hardcoded-only concept", () => {
    expect(FREE_OPERATOR_PROFILES_V0_1).toContain(DA_FREE_OPERATOR_PROFILE_V0_1);
    expect(DA_FREE_OPERATOR_PROFILE_V0_1).toMatchObject({
      profileVersion: "free-operator-profile.v0_1",
      operator: "da",
      historicalOriginClaim: "not_claimed",
      userDecisionPosture: "user_decides",
      requiresFunctionalBridgeFor: "functional_motivation_supported",
    });
  });

  it("models direct DA free-operator evidence", () => {
    expect(DA_FREE_OPERATOR_PROFILE_V0_1.directFreeOperator.forms).toEqual(["da", "daj"]);
    expect(DA_FREE_OPERATOR_PROFILE_V0_1.directFreeOperator.categories).toEqual([
      "free_operator_attested",
    ]);

    expect(freeOperatorProfileFormMatchesV0_1(
      DA_FREE_OPERATOR_PROFILE_V0_1.directFreeOperator.forms,
      "DA",
    )).toBe(true);
    expect(freeOperatorProfileGlossMatchesV0_1(
      DA_FREE_OPERATOR_PROFILE_V0_1.directFreeOperator.glossTerms,
      "to split, cut, divide",
    )).toBe(true);
  });

  it("models DA-family derivative support without pretending exact free-operator proof", () => {
    expect(DA_FREE_OPERATOR_PROFILE_V0_1.derivativeFamilySupport.forms).toEqual([
      "ndaj",
      "ndarë",
      "ndare",
    ]);
    expect(DA_FREE_OPERATOR_PROFILE_V0_1.derivativeFamilySupport.categories).toEqual([
      "derivative_family_support",
    ]);

    expect(freeOperatorProfileFormMatchesV0_1(
      DA_FREE_OPERATOR_PROFILE_V0_1.derivativeFamilySupport.forms,
      "ndarë",
    )).toBe(true);
    expect(freeOperatorProfileGlossMatchesV0_1(
      DA_FREE_OPERATOR_PROFILE_V0_1.derivativeFamilySupport.glossTerms,
      "divide or separate",
    )).toBe(true);
  });

  it("models DA gave as a homophone collision lane", () => {
    const [collision] = DA_FREE_OPERATOR_PROFILE_V0_1.homophoneCollisions;

    expect(collision).toMatchObject({
      forms: ["da"],
      glossTerms: ["give", "gave", "given"],
      categories: ["homophone_collision"],
    });

    expect(freeOperatorProfileFormMatchesV0_1(collision.forms, "da")).toBe(true);
    expect(freeOperatorProfileGlossMatchesV0_1(collision.glossTerms, "gave")).toBe(true);
  });
});
