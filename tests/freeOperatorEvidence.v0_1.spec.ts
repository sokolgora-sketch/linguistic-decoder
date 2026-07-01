import { readFileSync } from "node:fs";
import { classifyFreeOperatorEvidenceV0_1 } from "../src/shared/freeOperatorEvidence.v0_1";

describe("free operator evidence model v0.1", () => {
  it("classifies Gheg da as a direct free operator with functional motivation support", () => {
    const result = classifyFreeOperatorEvidenceV0_1({
      operator: "DA",
      attestedForm: "da",
      attestedGloss: "split / divide",
      dialect: "Gheg",
      functionalBridge: "what is split or divided can motivate damage/harm",
    });

    expect(result).toMatchObject({
      operator: "da",
      attestedForm: "da",
      historicalOriginClaim: "not_claimed",
      userDecisionPosture: "user_decides",
    });
    expect(result.categories).toEqual(
      expect.arrayContaining([
        "free_operator_attested",
        "functional_motivation_supported",
        "historical_origin_not_claimed",
        "user_decides",
      ]),
    );
    expect(result.categories).not.toContain("homophone_collision");
  });

  it("classifies Tosk daj as a direct free-operator cognate path", () => {
    const result = classifyFreeOperatorEvidenceV0_1({
      operator: "DA",
      attestedForm: "daj",
      attestedGloss: "split / divide",
      dialect: "Tosk",
      functionalBridge: "split/divide motivates damaged/harmed",
    });

    expect(result.categories).toEqual(
      expect.arrayContaining([
        "free_operator_attested",
        "functional_motivation_supported",
      ]),
    );
    expect(result.categories).not.toContain("derivative_family_support");
  });

  it("classifies ndaj and ndarë as DA-family support, not garbage rejection", () => {
    const ndaj = classifyFreeOperatorEvidenceV0_1({
      operator: "DA",
      attestedForm: "ndaj",
      attestedGloss: "divide / share",
    });
    const ndare = classifyFreeOperatorEvidenceV0_1({
      operator: "DA",
      attestedForm: "ndarë",
      attestedGloss: "divided",
    });

    expect(ndaj.categories).toEqual(
      expect.arrayContaining(["derivative_family_support"]),
    );
    expect(ndare.categories).toEqual(
      expect.arrayContaining(["derivative_family_support"]),
    );
    expect(ndaj.categories).not.toContain("homophone_collision");
    expect(ndare.categories).not.toContain("homophone_collision");
  });

  it("classifies da equals gave as homophone collision, not split evidence", () => {
    const result = classifyFreeOperatorEvidenceV0_1({
      operator: "DA",
      attestedForm: "da",
      attestedGloss: "gave",
      functionalBridge: "gave does not motivate split/divide damage",
    });

    expect(result.categories).toEqual(
      expect.arrayContaining([
        "homophone_collision",
        "historical_origin_not_claimed",
        "user_decides",
      ]),
    );
    expect(result.categories).not.toContain("free_operator_attested");
    expect(result.categories).not.toContain("functional_motivation_supported");
  });

  it("does not claim historical origin or winner status", () => {
    const result = classifyFreeOperatorEvidenceV0_1({
      operator: "DA",
      attestedForm: "da",
      attestedGloss: "split / divide",
      functionalBridge: "split/divide motivates damaged/harmed",
    });

    expect(result.historicalOriginClaim).toBe("not_claimed");
    expect(result.userDecisionPosture).toBe("user_decides");
    expect(result.categories).toContain("historical_origin_not_claimed");
    expect(result.categories).toContain("user_decides");
  });
  it("uses free-operator profiles instead of DA-specific classifier branches", () => {
    const classifierSource = readFileSync(
      "src/shared/freeOperatorEvidence.v0_1.ts",
      "utf8",
    );

    expect(classifierSource).toContain("FREE_OPERATOR_PROFILES_V0_1");
    expect(classifierSource).toContain("profile.directFreeOperator");
    expect(classifierSource).toContain("profile.derivativeFamilySupport");
    expect(classifierSource).toContain("profile.homophoneCollisions");
    expect(classifierSource).not.toContain('operator === "da"');
    expect(classifierSource).not.toContain('form === "ndaj"');
    expect(classifierSource).not.toContain("hasGiveGlossV0_1");
  });

  it("classifies DI through the free-operator profile registry", () => {
    const result = classifyFreeOperatorEvidenceV0_1({
      operator: "DI",
      attestedForm: "di",
      attestedGloss: "know / knowledge",
      functionalBridge: "knowledge can motivate study and learning functionally",
    });

    expect(result).toEqual({
      operator: "di",
      attestedForm: "di",
      categories: [
        "free_operator_attested",
        "functional_motivation_supported",
        "historical_origin_not_claimed",
        "user_decides",
      ],
      historicalOriginClaim: "not_claimed",
      userDecisionPosture: "user_decides",
    });
  });

});
