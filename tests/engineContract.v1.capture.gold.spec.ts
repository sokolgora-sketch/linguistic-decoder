import { stableStringify } from "../src/shared/engineContract.v1";
import { analyzeWordV1 } from "../src/v1/analyzeWordV1";

describe("Engine Contract v1 — capture engine output (goldens)", () => {
  const cases = [
    { word: "study", mode: "strict", alphabet: "auto" },
    { word: "love", mode: "strict", alphabet: "auto" },
    { word: "damage", mode: "strict", alphabet: "auto" },
    { word: "mathematics", mode: "strict", alphabet: "auto" },
    { word: "father", mode: "strict", alphabet: "auto" },
  ] as const;

  for (const c of cases) {
    it(`${c.word} (${c.mode}, ${c.alphabet})`, async () => {
      // We intentionally keep this flexible while we’re tightening the contract.
      const out = await analyzeWordV1(
        { word: c.word, mode: c.mode, alphabet: c.alphabet } as any
      );

      expect(stableStringify(out)).toMatchSnapshot();
    });
  }
});
