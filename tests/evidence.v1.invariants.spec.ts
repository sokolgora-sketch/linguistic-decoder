import { totalMod7FromSum0to6 } from "@/shared/math7.core";
import { analyzeWordV1 } from "../src/v1/analyzeWordV1";
import { CONTRACT_VERSION_V1 } from "../src/v1/versions.v1";

describe("Evidence v1 invariants", () => {
  it("recomputes totalMod7 deterministically from evidence.basis", () => {
    const out = analyzeWordV1("damage");

    // version is a lever; test should track the single source of truth
    expect(out.meta.contractVersion).toBe(CONTRACT_VERSION_V1);

    // basis should match normalizedWord in v1
    expect(out.evidence.basis).toBe(out.normalizedWord);

    const e = out.evidence;
    const sum = e.math7.indices.reduce((a, b) => a + b, 0);
    const totalMod7 = totalMod7FromSum0to6(sum);

    expect(e.math7.sum).toBe(sum);
    expect(e.math7.totalMod7).toBe(totalMod7);
  });

  it("keeps ë and extracts it into the seven-vowel set", () => {
    const out = analyzeWordV1("zëmër");
    expect(out.normalizedWord).toBe("zëmër");
    expect(out.evidence.surfaceVowels).toContain("Ë");
  });
});
