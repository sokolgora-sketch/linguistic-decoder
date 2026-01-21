import { buildResonanceProfileV1 } from "@/shared/resonanceProfile.v1";

describe("resonanceProfile v0.1 — deterministic bucket + polarity + color readout", () => {
  it("study: surface=UY (mixed source), normalized=UI (mixed source+manifest) when basis provided", () => {
    const out = buildResonanceProfileV1({
      surfaceWord: "study",
      normalizedBasis: "UI",
      // no primaryVoices here: builder should use normalizedBasis extraction
    });

    // surface vowels: U,Y => source+source => PURE_SOURCE (per bucket definition)
    // NOTE: both U and Y are SOURCE bucket, so this is PURE_SOURCE, not mixed.
    expect(out.surface.vowels).toEqual(["U", "Y"]);
    expect(out.surface.signature).toBe("PURE_SOURCE");
    expect(out.surface.polaritySymbol).toBe("♀");
    expect(out.surface.bucketCounts).toEqual({ source: 2, boundary: 0, manifest: 0 });
    expect(out.surface.colorBand).toEqual(["blue", "indigo"]);
    expect(out.surface.dominantColor).toBe("mixed"); // different colors inside same bucket is allowed

    // normalized vowels: U,I => source + manifest => MIXED_SOURCE_MANIFEST
    expect(out.normalized.vowels).toEqual(["U", "I"]);
    expect(out.normalized.signature).toBe("MIXED_SOURCE_MANIFEST");
    expect(out.normalized.polaritySymbol).toBe("◐");
    expect(out.normalized.bucketCounts).toEqual({ source: 1, boundary: 0, manifest: 1 });
    expect(out.normalized.transitions).toEqual(["source→manifest"]);
  });

  it("ujë: PURE_SOURCE, ♀, violet band included", () => {
    const out = buildResonanceProfileV1({ surfaceWord: "ujë" });

    expect(out.surface.vowels).toEqual(["U", "Ë"]);
    expect(out.surface.signature).toBe("PURE_SOURCE");
    expect(out.surface.polaritySymbol).toBe("♀");
    expect(out.surface.bucketCounts).toEqual({ source: 2, boundary: 0, manifest: 0 });
    expect(out.surface.colorBand).toEqual(["blue", "violet"]);

    // normalized defaults to surface when no normalizedBasis provided
    expect(out.normalized.vowels).toEqual(["U", "Ë"]);
    expect(out.normalized.signature).toBe("PURE_SOURCE");
  });

  it("ha: PURE_MANIFEST, ♂, red", () => {
    const out = buildResonanceProfileV1({ surfaceWord: "ha" });

    expect(out.surface.vowels).toEqual(["A"]);
    expect(out.surface.signature).toBe("PURE_MANIFEST");
    expect(out.surface.polaritySymbol).toBe("♂");
    expect(out.surface.bucketCounts).toEqual({ source: 0, boundary: 0, manifest: 1 });
    expect(out.surface.colorBand).toEqual(["red"]);
    expect(out.surface.dominantColor).toBe("red");
  });

  it("solo: PURE_BOUNDARY, ⚲, green, transitions empty (all O)", () => {
    const out = buildResonanceProfileV1({ surfaceWord: "solo" });

    expect(out.surface.vowels).toEqual(["O", "O"]);
    expect(out.surface.signature).toBe("PURE_BOUNDARY");
    expect(out.surface.polaritySymbol).toBe("⚲");
    expect(out.surface.bucketCounts).toEqual({ source: 0, boundary: 2, manifest: 0 });
    expect(out.surface.colorBand).toEqual(["green", "green"]);
    expect(out.surface.dominantColor).toBe("green");
    expect(out.surface.transitions).toEqual([]);
  });

  it("no vowels: NONE, ∅ (string contains none of A,E,I,O,U,Y,Ë)", () => {
    const out = buildResonanceProfileV1({ surfaceWord: "brrr" });

    expect(out.surface.vowels).toEqual([]);
    expect(out.surface.signature).toBe("NONE");
    expect(out.surface.polaritySymbol).toBe("∅");
    expect(out.surface.bucketCounts).toEqual({ source: 0, boundary: 0, manifest: 0 });
    expect(out.surface.colorBand).toEqual([]);
    expect(out.surface.dominantColor).toBe("none");
    expect(out.surface.transitions).toEqual([]);
  });
});
