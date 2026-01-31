import { buildRootLightMapV01 } from "@/shared/rootLightMap.v0.1";

describe("buildRootLightMapV01", () => {
  it("always includes world", () => {
    const out = buildRootLightMapV01({});
    expect(out.lights.some((l) => l.nodeId === "world")).toBe(true);
  });

  it("maps OriginClaim candidate languages to tree nodes", () => {
    const out = buildRootLightMapV01({
      originClaim: { candidates: [{ language: "Latin" }, { language: "Albanian" }] },
    });

    expect(out.lights.some((l) => l.nodeId === "ie.italic")).toBe(true);
    expect(out.lights.some((l) => l.nodeId === "ie.albanian")).toBe(true);
  });

  it("accepts short aliases like sq", () => {
    const out = buildRootLightMapV01({
      rootMap: { supportedKeys: [{ lang: "sq" }] },
    });

    expect(out.lights.some((l) => l.nodeId === "ie.albanian")).toBe(true);
  });
  it("harvests languageFamilies into tree nodes", () => {
    const input: any = {
      languageFamilies: ["Indo-European", "Albanian", "Semitic"],
      originClaim: { candidates: [] },
    };
    const lm = buildRootLightMapV01(input);
    const ids = lm.lights.map((l) => l.nodeId);
    expect(ids).toContain("fam.ie");
    expect(ids).toContain("ie.albanian");
    expect(ids).toContain("afro_asiatic.semitic");
  });

  it("harvests top-level candidates into tree nodes", () => {
    const input: any = {
      candidates: [{ language: "Latin" }, { lang: "en" }, { label: "Greek" }],
      originClaim: { candidates: [] },
    };
    const lm = buildRootLightMapV01(input);
    const ids = lm.lights.map((l) => l.nodeId);
    expect(ids).toContain("ie.italic");
    expect(ids).toContain("ie.germanic");
    expect(ids).toContain("ie.hellenic");
  });
});
