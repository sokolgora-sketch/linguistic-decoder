import { pickVoicePaths } from "@/ui/instrument/voicePathPicker";

describe("voicePathPicker precedence", () => {
  it("Detected prefers evidence.surfaceVowels over heartInstrumentV1.surfaceVowels", () => {
    const payload = {
      evidence: { surfaceVowels: ["U", "I"] },
      heartInstrumentV1: { surfaceVowels: ["U", "Y"] },
      deepRoot: { functionalRoots: [{ vowelPath: "U→I" }] },
      heart: { math7: { primary: { basis: "UY" } } },
    };

    const out = pickVoicePaths(payload as any);
    expect(out.detected).toBe("U-I");
    expect(out.surface).toBe("U-Y");
    expect(out.functional).toBe("U-I");
  });
});
