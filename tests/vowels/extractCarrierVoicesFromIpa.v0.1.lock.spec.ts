import { extractCarrierVoicesFromIpaV0_1 } from "@/shared/vowels/extractCarrierVoicesFromIpa.v0.1";

test("phonetic SSOT v0.1 (IPA → carrier voices) lock", () => {
  const cases: unknown[] = [
    "tɪp",
    "/ɹɪðəm/",
    "str",          // should NOT invent carriers
    "ˈəndəɾ",       // random-ish stress/diacritics
    "məˈtæmətɪks",  // longer
    "",
    null,
    123,
    { ipa: "tɪp" },
  ];

  const view = cases.map((ipa) => ({ in: ipa, out: extractCarrierVoicesFromIpaV0_1(ipa) }));
  expect(view).toMatchSnapshot();
});
