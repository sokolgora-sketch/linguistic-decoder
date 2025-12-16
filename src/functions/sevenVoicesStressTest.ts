// src/functions/sevenVoicesStressTest.ts

export function runSevenVoicesStressTest(word: string) {
    // Slice 1: keep it deterministic + fast.
    // Later we can call analyzeWord / analyzeWordV1 here when you decide the exact stress payload.
    return {
      word,
      len: word.length,
      vowels: (word.match(/[AEIOUYËaeiouyë]/g) ?? []).join(""),
    };
  }
  