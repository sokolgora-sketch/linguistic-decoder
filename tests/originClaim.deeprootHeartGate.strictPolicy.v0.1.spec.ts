import { buildOriginClaimV1 } from "@/shared/originClaim.builder.v1";
import { ORIGIN_CLAIM_REASON_TEXT } from "@/shared/originClaim.v1";

describe("OriginClaim DeepRoot–Heart gate strict policy v0.1", () => {
  test("strict caps medium->weak when gate misaligned (even if DeepRoot align is present)", () => {
    const resultBase: any = {
      word: "x",
      mode: "strict",
      heartPrimaryPath: "U-I",
      primaryPath: { voicePath: ["U", "I"] },
      deepRoot: { carriers: ["Latin"] },
      candidates: [
        {
          id: "c1",
          language: "Latin",
          form: "test",
          status: "pass",
          vowelPath: "U-A",
        },
      ],
    };

    const ocStrict = buildOriginClaimV1(resultBase);
    const cStrict = ocStrict.candidates.find((c: any) => c.language === "Latin")!;
    expect(cStrict.confidence).toBe("weak");
    expect(cStrict.reasons).toEqual(
      expect.arrayContaining([ORIGIN_CLAIM_REASON_TEXT.OC_G5_DR_HEART_MISALIGNED])
    );
    expect(cStrict.evidenceRefs).toEqual(
      expect.arrayContaining(["heartPrimaryPath", "candidates[c1].vowelPath"])
    );

    const ocLoose = buildOriginClaimV1({ ...resultBase, mode: "loose" });
    const cLoose = ocLoose.candidates.find((c: any) => c.language === "Latin")!;
    expect(cLoose.confidence).toBe("medium");
  });

  test("strict allows medium+ when gate aligned", () => {
    const result: any = {
      word: "x",
      mode: "strict",
      heartPrimaryPath: "U-I",
      primaryPath: { voicePath: ["U", "I"] },
      deepRoot: { carriers: ["Latin"] },
      candidates: [
        {
          id: "c2",
          language: "Latin",
          form: "ok",
          status: "pass",
          vowelPath: "U-I",
        },
      ],
    };

    const oc = buildOriginClaimV1(result);
    const c = oc.candidates.find((c: any) => c.language === "Latin")!;
    expect(c.confidence === "strong" || c.confidence === "medium").toBe(true);
    expect(c.reasons).toEqual(
      expect.arrayContaining([ORIGIN_CLAIM_REASON_TEXT.OC_C5_DR_HEART_ALIGNED])
    );
  });
});
