import { PROTO_ROOTS_V1, PROTO_ROOTS_V1_BY_ID, getProtoRootV1 } from "../src/shared/protoRoots.v1";

describe("ProtoRoots v1 library", () => {
  it("exports a non-empty library", () => {
    expect(Array.isArray(PROTO_ROOTS_V1)).toBe(true);
    expect(PROTO_ROOTS_V1.length).toBeGreaterThan(0);
  });

  it("has unique ids and stable lookup", () => {
    const ids = PROTO_ROOTS_V1.map((r) => r.id);
    const set = new Set(ids);
    expect(set.size).toBe(ids.length);

    for (const id of ids) {
      const a = getProtoRootV1(id);
      const b = (PROTO_ROOTS_V1_BY_ID as any)[id];
      expect(a).toBeTruthy();
      expect(b).toBeTruthy();
      expect(a?.id).toBe(id);
      expect(b?.id).toBe(id);
    }
  });

  it("carriers are well-formed", () => {
    for (const r of PROTO_ROOTS_V1) {
      expect(typeof r.id).toBe("string");
      expect(r.id.trim().length).toBeGreaterThan(0);
      expect(typeof r.gloss).toBe("string");
      expect(r.gloss.trim().length).toBeGreaterThan(0);
      expect(Array.isArray(r.carriers)).toBe(true);
      expect(r.carriers.length).toBeGreaterThan(0);

      for (const c of r.carriers) {
        expect(typeof c.lang).toBe("string");
        expect(c.lang.trim().length).toBeGreaterThan(0);
        expect(typeof c.form).toBe("string");
        expect(c.form.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
