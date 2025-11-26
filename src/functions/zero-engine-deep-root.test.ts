import { describe, it, expect } from "@jest/globals";
import { computeDeepRootForWord } from "./zero-engine-deep-root";

describe("ZË-RO DeepRoot – canon words", () => {
  it("damage / dëmtim → DA-MA-GJE", () => {
    const damage = computeDeepRootForWord("damage");
    const demtim = computeDeepRootForWord("dëmtim");

    expect(damage?.core_function).toMatch(/wholeness/i);
    expect(damage?.core_vowel_motif).toEqual(["A", "A", "E"]);
    expect(damage?.pieces.map(p => p.block)).toEqual(["da", "ma", "gje"]);

    expect(demtim?.core_vowel_motif).toEqual(["A", "A", "E"]);
    expect(demtim?.pieces.map(p => p.block)).toEqual(["da", "ma", "gje"]);
  });

  it("study → SHTU-DI-M", () => {
    const res = computeDeepRootForWord("study");
    expect(res?.core_vowel_motif).toEqual(["U", "I"]);
    expect(res?.pieces.map(p => p.block)).toEqual(["shtu", "di", "m"]);
  });

  it("mathematics → MAT-MAT-TIKA", () => {
    const res = computeDeepRootForWord("mathematics");
    expect(res?.core_vowel_motif).toEqual(["A", "E", "A", "I", "A"]);
    expect(res?.pieces.map(p => p.block)).toEqual(["mat", "mat", "tika"]);
  });

  it("religion → RE-LIGJ-ON", () => {
    const res = computeDeepRootForWord("religion");
    expect(res?.core_vowel_motif).toEqual(["E", "I", "O"]);
    expect(res?.pieces.map(p => p.block)).toEqual(["re", "ligj", "on"]);
  });

  it("mystery → MYS-TER", () => {
    const res = computeDeepRootForWord("mystery");
    expect(res?.pieces.map(p => p.block)).toEqual(["mys", "ter"]);
  });

  it("filozofi / philosophy → FI-(LO-[ZO])-FI", () => {
    const filo = computeDeepRootForWord("filozofi");
    const philo = computeDeepRootForWord("philosophy");

    expect(filo?.core_vowel_motif).toEqual(["I", "O", "O", "I"]);
    expect(filo?.pieces.map(p => p.block)).toEqual(["fi", "lo", "zo", "fi"]);

    expect(philo?.core_vowel_motif).toEqual(["I", "O", "O", "I"]);
    expect(philo?.pieces.map(p => p.block)).toEqual(["fi", "lo", "fi"]);
  });

  it("language → LAN-GUA-GJE", () => {
    const res = computeDeepRootForWord("language");
    expect(res?.pieces.map(p => p.block)).toEqual(["lan", "gua", "gje"]);
  });
});
