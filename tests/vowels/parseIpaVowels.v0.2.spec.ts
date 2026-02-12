import { parseIpaVowelsV0_2 } from "@/shared/vowels/parseIpaVowels.v0.2";

test("IPA v0.2: father /ˈfɑːðər/ => A Ë", () => {
  const out = parseIpaVowelsV0_2("/ˈfɑːðər/");
  expect(out.voices).toEqual(["A", "Ë"]);
  expect(out.diagnostics.unmapped).toEqual([]);
});

test("IPA v0.2: water /ˈwɔːtər/ => O Ë", () => {
  const out = parseIpaVowelsV0_2("/ˈwɔːtər/");
  expect(out.voices).toEqual(["O", "Ë"]);
  expect(out.diagnostics.unmapped).toEqual([]);
});

test("IPA v0.2: hydor /hyːdɔːr/ => Y O", () => {
  const out = parseIpaVowelsV0_2("/hyːdɔːr/");
  expect(out.voices).toEqual(["Y", "O"]);
  expect(out.diagnostics.unmapped).toEqual([]);
});

test("IPA v0.2 ignores combining marks (ã => A)", () => {
  const out = parseIpaVowelsV0_2("ã");
  expect(out.voices).toEqual(["A"]);
});
