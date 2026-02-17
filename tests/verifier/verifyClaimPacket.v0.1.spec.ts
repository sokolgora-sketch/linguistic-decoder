import { parseVowelPathStringV0_1 } from "../../src/shared/verifier/verifyClaimPacket.v0.1";

test("parseVowelPathStringV0_1: accepts arrows/hyphens/spaces", () => {
  expect(parseVowelPathStringV0_1("U→I")).toEqual(["U", "I"]);
  expect(parseVowelPathStringV0_1("U->I")).toEqual(["U", "I"]);
  expect(parseVowelPathStringV0_1("U-I")).toEqual(["U", "I"]);
  expect(parseVowelPathStringV0_1("U I")).toEqual(["U", "I"]);
});

test("parseVowelPathStringV0_1: filters unknown tokens", () => {
  expect(parseVowelPathStringV0_1("U-X-I")).toEqual(["U", "I"]);
});
