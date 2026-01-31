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
});
