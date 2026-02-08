import type { CanonCaseV0_1 } from "./proposerCanon.types.v0.1";

function mkPassAttempt(word: string, mode: "strict" | "open", statement: string) {
  return JSON.stringify({
    word,
    mode,
    candidates: [
      {
        form: word,
        opsUsed: [],
        decomposition: { statement },
      },
    ],
  });
}

export const proposerCanonHoldoutV0_1: readonly CanonCaseV0_1[] = [
  {
    id: "en_study_pass_v0_1",
    input: { word: "study", mode: "strict", provider: "mock" },
    attempts: [mkPassAttempt("study", "strict", "canon holdout pass v0.1")],
    expect: { status: "PASS", minAccepted: 1 },
  },
  {
    id: "en_damage_pass_v0_1",
    input: { word: "damage", mode: "strict", provider: "mock" },
    attempts: [mkPassAttempt("damage", "strict", "canon holdout pass v0.1")],
    expect: { status: "PASS", minAccepted: 1 },
  },
] as const;
