import { COLORS_HEX_BY_VOICE_V0_1 } from "@/shared/doctrine/voiceDoctrine.v0.1";
import { VOICE_COLOR_MAP } from "@/shared/voiceColors";

describe("canonical voice colors guard v0.1", () => {
  it("locks doctrine canonical hex mapping", () => {
    expect(COLORS_HEX_BY_VOICE_V0_1).toEqual({
      A: "#EF4444",
      E: "#EAB308",
      I: "#C026D3",
      O: "#F97316",
      U: "#3B82F6",
      Y: "#4F46E5",
      Ë: "#22C55E",
    });
  });

  it("keeps voiceColors shim aligned with doctrine", () => {
    expect(VOICE_COLOR_MAP.A).toBe(COLORS_HEX_BY_VOICE_V0_1.A);
    expect(VOICE_COLOR_MAP.O).toBe(COLORS_HEX_BY_VOICE_V0_1.O);
    expect(VOICE_COLOR_MAP.E).toBe(COLORS_HEX_BY_VOICE_V0_1.E);
    expect(VOICE_COLOR_MAP["Ë"]).toBe(COLORS_HEX_BY_VOICE_V0_1["Ë"]);
    expect(VOICE_COLOR_MAP.U).toBe(COLORS_HEX_BY_VOICE_V0_1.U);
    expect(VOICE_COLOR_MAP.Y).toBe(COLORS_HEX_BY_VOICE_V0_1.Y);
    expect(VOICE_COLOR_MAP.I).toBe(COLORS_HEX_BY_VOICE_V0_1.I);
  });
});
