
import { solveWord } from "@/functions/sevenVoicesCore";
import { chooseProfile } from "@/functions/languages";
import { readWindowsDebug, extractBase, normalizeTerminalY } from "@/functions/sevenVoicesC";
import { Vowel } from "@/functions/sevenVoicesCore";

describe("word: hope", () => {
  const mode = "strict" as const;
  const alphabet = "auto" as const;
  const opts = { beamWidth: 8, maxOps: 1, allowDelete: false, allowClosure: false, opCost: { sub:1, del:3, insClosure:2 } };

  test("primary path and consonant pressure", () => {
    const { primaryPath: primary, signals } = solveWord("hope", opts, alphabet);

    expect(primary.voicePath).toEqual(["O","E"]);
    expect(primary.ringPath).toEqual([0,2]);
    
    // checksum V may vary if primes ever change; assert the product as a sanity check
    expect(primary.checksums?.V).toBe(21);

    const base = normalizeTerminalY(extractBase("hope"), "hope");
    const prof = chooseProfile("hope", undefined);
    const { classes } = readWindowsDebug("hope", base, prof);
    expect(classes.join(" ")).toMatch(/Plosive/);

    // Debug signal should include alphabet id
    expect(signals.join(" ")).toMatch(/alphabet=/);
  });
});
