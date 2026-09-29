import { NextRequest } from "next/server";
import { GET } from "@/app/api/analyze-v1/route";
import { pickHeartPrimaryPathForRootMap } from "@/shared/heartPrimaryPathForRootMap.v0.1.2";
import { resolveCmuDictPronunciationToVoiceV0_1 } from "@/shared/openInstrument/pronunciationToVoice.v0_1";

async function analyze(word: string): Promise<any> {
  const response = await GET(
    new NextRequest(
      `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict&alphabet=auto`,
    ),
  );
  expect(response.status).toBe(200);
  return response.json();
}

describe("Open Instrument spoken Voice authority v0.1", () => {
  it.each([
    ["y", ["A", "I"]],
    ["my", ["A", "I"]],
    ["sky", ["A", "I"]],
    ["fly", ["A", "I"]],
    ["study", ["Ë", "I"]],
    ["mystery", ["I", "Ë", "I"]],
  ])("%s uses the bundled pronunciation path rather than spelling", async (word, expectedPath) => {
    const out = await analyze(word);
    expect(resolveCmuDictPronunciationToVoiceV0_1(word).canonicalSpokenVoicePath).toEqual(expectedPath);
    expect(out.primaryPath.voicePath).toEqual(expectedPath);
    expect(out.heart.math7.primary.vowels).toEqual(expectedPath);
    expect(out.evidence.vowelPath).toEqual(expectedPath);
    expect(out.evidence.surfaceVowelsRaw).toEqual(out.heartInstrumentV1.orthographicVowels);
    expect(out.evidence.surfaceVowelsRaw).not.toEqual(expectedPath);
  });

  it.each(["xyz", "yol", "dij"])("%s fails closed when CMUdict has no entry", async (word) => {
    const out = await analyze(word);
    expect(out.primaryPath).toBeUndefined();
    expect(out.heartInstrumentV1.canonicalSpokenVoicePath).toBeNull();
    expect(out.heartInstrumentV1.spokenPronunciation.reasonCode).toBe("PRONUNCIATION_NOT_FOUND");
    expect(out.evidence.vowelPath).toBeNull();
  });

  it("keeps Y in the canonical seven-Voice inventory for explicit path consumers", () => {
    expect(
      pickHeartPrimaryPathForRootMap({
        word: "study",
        mode: "strict",
        primaryPath: { voicePath: ["U", "Y"] },
      }),
    ).toEqual(["U", "Y"]);
  });

  it("does not let candidate paths replace the spoken primary path", async () => {
    const out = await analyze("study");
    expect(out.primaryPath.voicePath).toEqual(["Ë", "I"]);
    const candidatePaths = Array.isArray(out.candidates)
      ? out.candidates.map((candidate: any) => candidate?.vowelPath).filter(Boolean)
      : [];
    expect(candidatePaths.length).toBeGreaterThan(0);
    expect(candidatePaths).toContain("U-I");
  });
});
