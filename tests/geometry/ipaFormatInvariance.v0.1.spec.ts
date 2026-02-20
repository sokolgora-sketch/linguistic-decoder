import { extractCarrierVoicesFromIpaV0_1 } from "@/shared/vowels/extractCarrierVoicesFromIpa.v0.1";

describe("IPA format invariance v0.1 (wrappers/diacritics must not change carriers)", () => {
  test("rhythm variants normalize to same carrier voices", () => {
    const variants = [
      "/ɹɪðəm/",
      "ɹɪðəm",
      "[ɹɪðəm]",
      "ˈɹɪðəm",
      "/ˈɹɪðəm/",
      " /ˈɹɪðəm/ ",
    ];

    const outs = variants.map((ipa) => ({
      ipa,
      out: extractCarrierVoicesFromIpaV0_1(ipa),
    }));

    // lock first output as reference
    const ref = outs[0].out;
    for (const row of outs) {
      expect(row.out).toEqual(ref);
    }
  });

  test("empty/null/non-string are safe and stable", () => {
    const cases: unknown[] = ["", "   ", null, 123, { ipa: "tɪp" }];
    const outs = cases.map((x) => extractCarrierVoicesFromIpaV0_1(x as any));
    // strict behavior: we don't accept object.ipa here; only raw input string.
    expect(outs).toMatchSnapshot();
  });
});
