
import { chooseProfile } from "./valueTables";
import { extractWindowClasses, extractBase, normalizeTerminalY, Vowel } from "./index";
import type { LangProfile } from "./valueTables";

function base(word: string): Vowel[] {
  const raw = extractBase(word);
  const norm = normalizeTerminalY(raw, word);
  return norm.length ? (norm as Vowel[]) : (["O"] as Vowel[]);
}

function classes(word: string, overrideId?: string) {
  const P = chooseProfile(word, overrideId);
  const seq = base(word);
  return extractWindowClasses(word, seq, P); // returns array of CClass
}

describe("Language profiles → window classes are deterministic", () => {
  // Latin
  test("study (Latin fallback)", () => {
    expect(classes("study", "latin")).toEqual(["Plosive"]); // "d"
  });
  test("damage (Latin fallback)", () => {
    expect(classes("damage", "latin")).toEqual(["Nasal"]); // "mag" -> m
  });

  // Albanian
  test("zemër (Albanian)", () => {
    expect(classes("zemër", "albanian")).toEqual(["Nasal"]); // "m"
  });
  test("gjuhë (Albanian)", () => {
    expect(classes("gjuhë", "albanian")).toEqual(["NonSibilantFricative"]); // "h"
  });

  // Sanskrit (romanized)
  test("śakti (Sanskrit)", () => {
    expect(classes("śakti", "sanskrit")).toEqual(["Plosive"]); // "kt" -> k
  });
  test("moksha (Sanskrit)", () => {
    expect(classes("moksha", "sanskrit")).toEqual(["SibilantFricative"]); // "ksh" -> ks
  });

  // Ancient Greek (latinized)
  test("physis (Ancient Greek)", () => {
    expect(classes("physis", "ancient_greek")).toEqual(["SibilantFricative"]); // "s"
  });
  test("philos (Ancient Greek)", () => {
    expect(classes("philos", "ancient_greek")).toEqual(["Liquid"]); // "l"
  });

  // PIE
  test("*h₁éḱwos (PIE)", () => {
    expect(classes("*h₁éḱwos", "pie")).toEqual(["Plosive"]); // "kw"
  });
  test("*dʰugh₂ter (PIE)", () => {
    expect(classes("*dʰugh₂ter", "pie")).toEqual(["Plosive"]); // "ght" -> gh
  });
});
