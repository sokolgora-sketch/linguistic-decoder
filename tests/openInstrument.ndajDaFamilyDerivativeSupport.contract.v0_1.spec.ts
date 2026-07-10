import { FREE_OPERATOR_PROFILES_V0_1 } from "../src/shared/freeOperatorProfile.v0_1";
import { PROTO_ROOTS_V1 } from "../src/shared/protoRoots.v1";
import { readFileSync } from "node:fs";

describe("Open Instrument NDAJ / NDARË DA-family derivative support contract v0.1", () => {
  it("keeps ndaj and ndarë inside DA derivative-family support, not standalone operator promotion", () => {
    const da = FREE_OPERATOR_PROFILES_V0_1.find((row) => row.operator === "da");
    expect(da).toBeTruthy();

    expect(da).toEqual(
      expect.objectContaining({
        derivativeFamilySupport: expect.objectContaining({
          forms: expect.arrayContaining(["ndaj", "ndarë", "ndare"]),
          categories: expect.arrayContaining(["derivative_family_support"]),
        }),
      }),
    );
  });

  it("keeps ndaj and ndarë in DA-family carrier/dialect support", () => {
    const da = PROTO_ROOTS_V1.find((row) => row.id === "DA");
    expect(da).toBeTruthy();

    expect(da?.carriers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          lang: "sq",
          dialect: "Tosk",
          form: "ndaj",
          gloss: "divide / share",
          notes: expect.stringContaining("DA-family derivative support"),
        }),
        expect.objectContaining({
          lang: "sq",
          dialect: "Tosk",
          form: "ndarë",
          gloss: "divided",
          notes: expect.stringContaining("DA-family derivative support"),
        }),
      ]),
    );
  });

  it("keeps reviewed-source contract doc explicit that derivative evidence does not validate DA by itself", () => {
    const source = readFileSync(
      "docs/open-instrument/reviews/reviewed-external-lexicon-source-row-contract-review-v0.1.md",
      "utf8",
    );

    expect(source).toContain("It correctly rejects:");
    expect(source).toContain("`ndaj`");
    expect(source).toContain("`ndarë`");
    expect(source).toContain("derivative evidence");
    expect(source).toContain("morphology evidence without reviewed bridge");
  });

  it("locks the NDAJ / NDARË derivative-support contract doc boundary", () => {
    const source = readFileSync(
      "docs/open-instrument/reports/ndaj-da-family-derivative-support-contract-v0.1.md",
      "utf8",
    );

    expect(source).toContain("NDAJ / NDARË are currently allowed as **DA-family derivative support**.");
    expect(source).toContain("They are **not** currently allowed as standalone reviewed-source evidence.");
    expect(source).toContain("They are **not** currently promoted as standalone reviewed-runtime evidence.");
    expect(source).toContain("Derivative evidence must not replace exact isolated reviewed-source evidence for `da`.");
  });
});
