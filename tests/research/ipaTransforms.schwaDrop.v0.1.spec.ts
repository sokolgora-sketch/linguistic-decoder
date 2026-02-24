import { applySchwaDropV0_1 } from "./ipaTransforms/schwaDrop.v0.1";

describe("Schwa Shield Transform v0.1 — applySchwaDropV0_1", () => {
  it("is deterministic and idempotent for valid IPA strings", () => {
    const inputs = [
      "/pəɾˈbaɫə/",
      "/pərpaˈɾim/",
      "/pərpaˈɾəsi/",
      "/disiˈplinə/",
      "/jaʃˈtəm/",
      "/tɛj/",
      "/rreth/",
      "/laɾg/",
    ];

    for (const x of inputs) {
      const a = applySchwaDropV0_1(x);
      const b = applySchwaDropV0_1(x);
      expect(a).toBe(b);
      // idempotence: applying twice yields same
      expect(applySchwaDropV0_1(a)).toBe(a);
    }
  });

  it("drops schwa in për- prefix for pəɾ- and pər- forms", () => {
    expect(applySchwaDropV0_1("/pəɾˈtɛj/")).toBe("/pɾˈtɛj/");
    expect(applySchwaDropV0_1("/pəɾˈbaɫə/")).toBe("/pɾˈbaɫ/");
    expect(applySchwaDropV0_1("/pərpaˈɾim/")).toBe("/prpaˈɾim/");
    expect(applySchwaDropV0_1("/pərpaˈɾəsi/")).toBe("/prpaˈɾəsi/");
  });

  it("drops terminal schwa", () => {
    expect(applySchwaDropV0_1("/disiˈplinə/")).toBe("/disiˈplin/");
    expect(applySchwaDropV0_1("/ˈbaɫə/")).toBe("/ˈbaɫ/");
  });

  it("leaves non-slashed inputs unchanged", () => {
    expect(applySchwaDropV0_1("pəɾˈtɛj")).toBe("pəɾˈtɛj");
    expect(applySchwaDropV0_1("")).toBe("");
  });
});
