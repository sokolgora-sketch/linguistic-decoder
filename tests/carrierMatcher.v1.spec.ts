import { matchSegmentToProtoRoots } from "../src/shared/carrierMatcher.v1";

describe("DR2 carrierMatcher v1 (allowed ops only)", () => {
  it("DI: exact match should be first and cost 0", () => {
    const m = matchSegmentToProtoRoots("di", { langAllowList: ["sq"] });
    expect(m.length).toBeGreaterThan(0);
    expect(m[0].protoRootId).toBe("DI");
    expect(m[0].isExact).toBe(true);
    expect(m[0].cost).toBe(0);
    expect(m[0].ops).toContain("exact");
  });

  it("SHTU: 'stu' can match via s↔sh (when enabled) to Albanian carrier", () => {
    const m = matchSegmentToProtoRoots("stu", { allowSSh: true, langAllowList: ["sq"] });
    const hit = m.find((x) => x.protoRootId === "SHTU");
    expect(hit).toBeTruthy();
    expect(hit!.isExact).toBe(false);
    expect(hit!.ops.includes("s_to_sh") || hit!.ops.includes("sh_to_s")).toBe(true);
  });

  it("SHTU: if s↔sh disabled, 'stu' should not match SHTU", () => {
    const m = matchSegmentToProtoRoots("stu", { allowSSh: false, langAllowList: ["sq"] });
    const hit = m.find((x) => x.protoRootId === "SHTU");
    expect(hit).toBeFalsy();
  });

  it("Final -a/-ë: 'ata' -> 'ate' should match AT via final swap", () => {
    const m = matchSegmentToProtoRoots("ata", { allowFinalAE: true, langAllowList: ["sq"] });
    const hit = m.find((x) => x.protoRootId === "AT");
    expect(hit).toBeTruthy();
  });

  it("Determinism: same input returns same ordered list", () => {
    const a = matchSegmentToProtoRoots("stu", { allowSSh: true, langAllowList: ["sq"] });
    const b = matchSegmentToProtoRoots("stu", { allowSSh: true, langAllowList: ["sq"] });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});
