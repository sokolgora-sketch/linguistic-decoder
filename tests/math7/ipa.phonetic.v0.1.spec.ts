import { extractSevenVowelsFromIpa, totalMod7FromIpa } from "@/shared/math7.phonetic.v0.1";

test("phonetic math7: island /ˈaɪlənd/ => A I Ë", () => {
  expect(extractSevenVowelsFromIpa("/ˈaɪlənd/")).toEqual(["A", "I", "Ë"]);
  // A(0)+I(2)+Ë(6)=8 -> 1
  expect(totalMod7FromIpa("/ˈaɪlənd/")).toBe(1);
});

test("phonetic math7: knife /naɪf/ => A I", () => {
  expect(extractSevenVowelsFromIpa("/naɪf/")).toEqual(["A", "I"]);
  expect(totalMod7FromIpa("/naɪf/")).toBe(2);
});

test("phonetic math7: rhythm /ɹɪðəm/ => I Ë", () => {
  expect(extractSevenVowelsFromIpa("/ɹɪðəm/")).toEqual(["I", "Ë"]);
  // 2+6=8 -> 1
  expect(totalMod7FromIpa("/ɹɪðəm/")).toBe(1);
});

test("phonetic math7: water /ˈwɔːtər/ => O Ë", () => {
  expect(extractSevenVowelsFromIpa("/ˈwɔːtər/")).toEqual(["O", "Ë"]);
  // 3+6=9 -> 2
  expect(totalMod7FromIpa("/ˈwɔːtər/")).toBe(2);
});

test("phonetic math7: father /ˈfɑːðər/ => A Ë", () => {
  expect(extractSevenVowelsFromIpa("/ˈfɑːðər/")).toEqual(["A", "Ë"]);
  // 0+6=6
  expect(totalMod7FromIpa("/ˈfɑːðər/")).toBe(6);
});

test("phonetic math7: bread /brɛd/ => E", () => {
  expect(extractSevenVowelsFromIpa("/brɛd/")).toEqual(["E"]);
  expect(totalMod7FromIpa("/brɛd/")).toBe(1);
});
