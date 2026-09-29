require("./helpers/whatwgGlobals.cjs");

describe("/api/analyze-v1 spoken-first pronunciation runtime v0.1", () => {
  async function analyze(word: string): Promise<any> {
    const { GET } = require("../app/api/analyze-v1/route");
    const response = await GET({
      url: `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
    } as any);
    expect(response.status).toBe(200);
    return response.json();
  }

  test.each([
    ["stone", ["O", "U"]],
    ["make", ["E", "I"]],
    ["time", ["A", "I"]],
    ["home", ["O", "U"]],
    ["name", ["E", "I"]],
    ["cat", ["A"]],
  ])("%s uses the canonical spoken path for Heart/Math7", async (word, path) => {
    const body = await analyze(word);
    expect(body.heartInstrumentV1.canonicalSpokenVoicePath).toEqual(path);
    expect(body.primaryPath.voicePath).toEqual(path);
    expect(body.heart.math7.primary.vowels).toEqual(path);
    expect(body.evidence.vowelPath).toEqual(path);
    expect(body.heartInstrumentV1.spokenPronunciation.sourceNotation).toBe("ARPABET");
  });

  test("stone keeps orthographic final e separate from spoken authority", async () => {
    const body = await analyze("stone");
    expect(body.heartInstrumentV1.orthographicVowels).toEqual(["O", "E"]);
    expect(body.heartInstrumentV1.canonicalSpokenVoicePath).toEqual(["O", "U"]);
    expect(body.primaryPath.voicePath).not.toContain("E");
    expect(body.doctrineReading.analyzedVoicePath).toEqual(["O", "U"]);
  });

  test("missing pronunciation does not fall back to orthographic vowels", async () => {
    const body = await analyze("zzzzzz-v0-1-missing");
    expect(body.heartInstrumentV1.canonicalSpokenVoicePath).toBeNull();
    expect(body.heartInstrumentV1.spokenPronunciation.reasonCode).toBe("PRONUNCIATION_NOT_FOUND");
    expect(body.primaryPath).toBeUndefined();
    expect(body.heart.math7.primary.vowels).toEqual([]);
    expect(body.evidence.vowelPath).toBeNull();
    expect(body.heartInstrumentV1.orthographicVowels).toEqual(["I", "I"]);
  });
});
