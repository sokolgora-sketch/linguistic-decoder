import { buildOriginClaimV1 } from "@/shared/originClaim.builder.v1";
import { ORIGIN_CLAIM_REASON_TEXT } from "@/shared/originClaim.v1";

describe("OriginClaim v1 — voice seq extraction (string vowelPath)", () => {
  it("treats candidate vowelPath string like 'U-I' as a real sequence (no UNKNOWN)", () => {
    const result: any = {
      word: "study",
      mode: "strict",
      alphabet: "auto",
      heart: {
        math7: {
          primary: {
            vowels: ["U", "I"],
          },
        },
      },
      candidates: [
        {
          id: "latin-studium",
          language: "Latin",
          form: "studium",
          status: "pass",
          vowelPath: "U-I",
        },
      ],
    };

    const oc = buildOriginClaimV1(result);
    expect(oc.candidates).toHaveLength(1);

    const c = oc.candidates[0];
    const unknown = ORIGIN_CLAIM_REASON_TEXT["OC_C3_VOICEPATH_UNKNOWN"];
    const match = ORIGIN_CLAIM_REASON_TEXT["OC_C3_VOICEPATH_MATCH"];

    expect(c.reasons).not.toContain(unknown);
    expect(c.reasons).toContain(match);
  });
});
