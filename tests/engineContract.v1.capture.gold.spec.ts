import { stableStringify } from "../src/shared/engineContract.v1";
import { analyzeWordV1 } from "../src/v1/analyzeWordV1";

type Mode = string;
type Alphabet = string;

async function runAnalyzeWordV1(word: string, mode: Mode, alphabet: Alphabet) {
  const fn: any = analyzeWordV1;

  const attempts: Array<() => Promise<any>> = [
    () => fn({ word, mode, alphabet }),
    () => fn(word, mode, alphabet),
    () => fn(word, { mode, alphabet }),
    () => fn({ word, opts: { mode, alphabet } }),
  ];

  const looksValid = (out: any) => {
    if (!out || typeof out !== "object") return false;

    const w =
      (typeof out.word === "string" && out.word) ||
      (out.input && typeof out.input.word === "string" && out.input.word) ||
      "";

    if (w !== word) return false;
    if (String(w).includes("[object Object]")) return false;

    return true;
  };

  let lastErr: unknown = null;

  for (const attempt of attempts) {
    try {
      const out = await attempt();
      if (looksValid(out)) return out;
    } catch (e) {
      lastErr = e;
    }
  }

  throw new Error(
    `analyzeWordV1 invocation failed or returned invalid output for "${word}". Last error: ${String(
      (lastErr as any)?.message ?? lastErr
    )}`
  );
}

describe("Engine Contract v1 — capture engine output (goldens)", () => {
  const cases = [
    { word: "study", mode: "strict", alphabet: "auto" },
    { word: "love", mode: "strict", alphabet: "auto" },
    { word: "damage", mode: "strict", alphabet: "auto" },
    { word: "mathematics", mode: "strict", alphabet: "auto" },
    { word: "father", mode: "strict", alphabet: "auto" },
    { word: "gjak", mode: "strict", alphabet: "auto" },
    { word: "zemër", mode: "strict", alphabet: "auto" },
    { word: "internet", mode: "strict", alphabet: "auto" },

    // v2 expansion
    { word: "shter", mode: "strict", alphabet: "auto" },
    { word: "algorithm", mode: "strict", alphabet: "auto" },
    { word: "philosophy", mode: "strict", alphabet: "auto" },
  ] as const;

  for (const c of cases) {
    it(`${c.word} (${c.mode}, ${c.alphabet})`, async () => {
      const out = await runAnalyzeWordV1(c.word, c.mode, c.alphabet);
      const json = stableStringify(out);
      expect(() => JSON.parse(json)).not.toThrow();
      expect(json).toMatchSnapshot();
    });
  }
});
