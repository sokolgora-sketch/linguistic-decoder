import type { CanonCaseV0_1 } from "./proposerCanon.types.v0.1";

function canonFixtureLanguage(word: string): "Albanian" | "English" {
  const albanian = new Set(["bukuri", "matematikë", "sy"]);
  return albanian.has(word) ? "Albanian" : "English";
}

function mkPassAttempt(word: string, mode: "strict" | "open", statement: string) {
  return JSON.stringify({
    word,
    mode,
    candidates: [
      {
        form: word,
        language: canonFixtureLanguage(word),
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



  {
    id: "sq_bukuri_pass_v0_1",
    input: { word: "bukuri", mode: "strict", maxAttempts: 2, provider: "mock" },
    attempts: [
      JSON.stringify({
        word: "bukuri",
        mode: "strict",
        candidates: [
          { form: "bukuri", language: "Albanian", opsUsed: [], decomposition: { statement: "holdout pass: bukuri" } },
        ],
      }),
    ],
    expect: { status: "PASS", minAccepted: 1 },
  },


  {
    id: "sq_matematike_pass_v0_1",
    input: { word: "matematik\u00eb", mode: "strict", maxAttempts: 2, provider: "mock" },
    attempts: [
      JSON.stringify({
        word: "matematik\u00eb",
        mode: "strict",
        candidates: [
          { form: "matematik\u00eb", language: "Albanian", opsUsed: [], decomposition: { statement: "holdout pass: matematikë" } },
        ],
      }),
    ],
    expect: { status: "PASS", minAccepted: 1 },
  },


  {
    id: "sq_sy_pass_v0_1",
    input: { word: "sy", mode: "strict", maxAttempts: 2, provider: "mock" },
    attempts: [
      JSON.stringify({
        word: "sy",
        mode: "strict",
        candidates: [
          { form: "sy", language: "Albanian", opsUsed: [], decomposition: { statement: "holdout pass: sy" } },
        ],
      }),
    ],
    expect: { status: "PASS", minAccepted: 1 },
  },




{
  id: "en_mother_pass_v0_1",
  input: { word: "mother", mode: "strict", provider: "mock" },
  attempts: [mkPassAttempt("mother", "strict", "canon holdout pass v0.1.2 (O coverage)")],
  expect: { status: "PASS", minAccepted: 1 },
}

] as const;
