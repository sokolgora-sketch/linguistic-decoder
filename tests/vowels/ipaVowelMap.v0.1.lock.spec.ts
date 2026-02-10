import { IPA_VOWEL_MAP_V0_1, IPA_VOWEL_TOKENS_V0_1 } from "../../src/shared/vowels/ipaVowelMap.v0.1";

describe("vowels/ipaVowelMap v0.1 (lock)", () => {
  it("locks token→voice mapping (ordered)", () => {
    const pairs = IPA_VOWEL_TOKENS_V0_1.map((t) => [t, IPA_VOWEL_MAP_V0_1[t]]);
    expect(pairs).toMatchSnapshot();
  });
});
