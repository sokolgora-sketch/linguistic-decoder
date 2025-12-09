import { cleanShareSnippetForPublic } from "../src/lib/shareSnippet";

describe("cleanShareSnippetForPublic", () => {
  it("keeps core info but strips experimental noise for LOVE", () => {
    const devSnippet = [
      "Linguistic Decoder — love",
      "Summary: V1.1",
      "Engine: core-2 · strict · auto",
      "Languages: Latin – amor (pivot: am-, tag: attraction); Albanian – dashuri (pivot: dash, tag: attraction)",
      "Symbolic (experimental): Attraction — Attraction",
    ].join("\n");

    const result = cleanShareSnippetForPublic(devSnippet);

    // Still has the core info
    expect(result).toContain("Linguistic Decoder — love");
    expect(result).toContain("Summary: V1.1");
    expect(result).toContain("Engine: core-2 · strict · auto");
    expect(result).toContain(
      "Languages: Latin – amor (pivot: am-, tag: attraction); Albanian – dashuri (pivot: dash, tag: attraction)"
    );

    // Symbolic line cleaned
    expect(result).toContain("Symbolic: Attraction — Attraction");
    expect(result).not.toContain("(experimental)");
  });
});
