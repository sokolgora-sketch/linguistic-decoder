import { readFileSync } from "node:fs";
import path from "node:path";
import { extractFeaturesV0_1 } from "../../src/shared/validation/extractFeatures.v0.1";

type ValidationRecordV01 = {
  id: string;
  lang: string;
  word: string;
  ipa?: string;
  semanticTag: string;
  knownEtymology: string;
  notes?: string;
};

function loadDataset(): ValidationRecordV01[] {
  const p = path.join(process.cwd(), "tests/validation/datasets/validation.dataset.v0.1.json");
  return JSON.parse(readFileSync(p, "utf8")) as ValidationRecordV01[];
}

test("extractFeatures v0.1 smoke: never throws on dataset", () => {
  const ds = loadDataset();

  for (const r of ds) {
    const out = extractFeaturesV0_1({ word: r.word, lang: r.lang, ipa: r.ipa });

    expect(Array.isArray(out.orthographyVoices)).toBe(true);
    expect(typeof out.orthographyVoiceCount).toBe("number");

    if (r.ipa) {
      expect(Array.isArray(out.phoneticVoices)).toBe(true);
      expect(typeof out.phoneticVoiceCount).toBe("number");
      expect(typeof out.maskCarrierMismatch).toBe("boolean");
    }
  }
});
