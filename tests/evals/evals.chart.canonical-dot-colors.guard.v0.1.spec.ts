import fs from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "../..");

function readUtf8(rel: string) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

describe("Evals chart canonical dot colors guard v0.1", () => {
  it("locks chart dots to doctrine canonical voice colors", () => {
    const ui = readUtf8("src/ui/evals/EvalsPageClient.v0.1.tsx");

    expect(ui).toContain(
      'import { COLORS_HEX_BY_VOICE_V0_1 } from "@/shared/doctrine/voiceDoctrine.v0.1";',
    );

    expect(ui).toContain("const bucketVoice =");
    expect(ui).toContain('["A", "O", "E", "Ë", "U", "Y", "I"] as const');
    expect(ui).toContain('] ?? "I";');

    expect(ui).toContain("const dotColor =");
    expect(ui).toContain("COLORS_HEX_BY_VOICE_V0_1[bucketVoice]");
    expect(ui).toContain("fill={dotColor}");
  });
});
