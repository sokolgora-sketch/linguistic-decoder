import { extractOrthographyVoicesFromWordV0_1 } from "@/shared/vowels/extractOrthographyVoicesFromWord.v0.1";

test("orthography SSOT v0.1 (Latin + diacritics) lock", () => {
  const cases = [
    { word: "father", langHint: "en" },
    { word: "bread", langHint: "en" },
    { word: "study", langHint: "en" },
    { word: "zë", langHint: "sq" },
    { word: "ëndërr", langHint: "sq" },
    { word: "çift", langHint: "sq" },
    { word: "matematikë", langHint: "sq" },
  ];

  const view = cases.map((c) => extractOrthographyVoicesFromWordV0_1(c));
  expect(view).toMatchSnapshot();
});
