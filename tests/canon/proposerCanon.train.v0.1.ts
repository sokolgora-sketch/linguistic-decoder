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

function mkIllegalOpAttempt(word: string, mode: "strict" | "open") {
  return JSON.stringify({
    word,
    mode,
    candidates: [
      {
        form: word,
        opsUsed: ["E_INSERT_NOT_ALLOWED"], // intentionally illegal
        decomposition: { statement: "illegal op token should fail OPS_ALLOWED" },
      },
    ],
  });
}

export const proposerCanonTrainV0_1: readonly CanonCaseV0_1[] = [
  // Loop exercise: PARSE_ERROR -> FAIL -> PASS
  {
    id: "sq_kuzhine_loop_v0_1",
    input: { word: "kuzhin\u00eb", mode: "strict", maxAttempts: 4, provider: "mock" },
    attempts: [
      // 1) PARSE_ERROR (invalid JSON)
      `{"word":"kuzhin\\u00eb","mode":"strict","candidates":[{"form":"kuzhin\\u00eb","opsUsed":[],"decomposition":{"statement":"place where it cooks"}}]`,
      // 2) FAIL (illegal op token)
      mkIllegalOpAttempt("kuzhin\u00eb", "strict"),
      // 3) PASS
      mkPassAttempt("kuzhin\u00eb", "strict", "kuzhin\u00eb = place where it cooks"),
    ],
    expect: {
      status: "PASS",
      traceStatuses: ["PARSE_ERROR", "FAIL", "PASS"],
      mustIncludeFailCheckIds: ["OPS_ALLOWED"],
      minAccepted: 1,
    },
  },

  // A few simple PASS train cases (can expand later)
  {
    id: "sq_shtepi_pass_v0_1",
    input: { word: "sht\u00ebpi", mode: "strict", provider: "mock" },
    attempts: [mkPassAttempt("sht\u00ebpi", "strict", "house (canon pass v0.1)")],
    expect: { status: "PASS", minAccepted: 1 },
  },
  {
    id: "sq_mesim_pass_v0_1",
    input: { word: "m\u00ebsim", mode: "strict", provider: "mock" },
    attempts: [mkPassAttempt("m\u00ebsim", "strict", "lesson/learning (canon pass v0.1)")],
    expect: { status: "PASS", minAccepted: 1 },
  },
  {
    id: "sq_gjuhe_pass_v0_1",
    input: { word: "gjuh\u00eb", mode: "strict", provider: "mock" },
    attempts: [mkPassAttempt("gjuh\u00eb", "strict", "language/tongue (canon pass v0.1)")],
    expect: { status: "PASS", minAccepted: 1 },
  },



  {
    id: "sq_drite_pass_v0_1",
    input: { word: "drit\u00eb", mode: "strict", maxAttempts: 2, provider: "mock" },
    attempts: [
      JSON.stringify({
        word: "drit\u00eb",
        mode: "strict",
        candidates: [
          { form: "drit\u00eb", opsUsed: [], decomposition: { statement: "canon pass: dritë" } },
        ],
      }),
    ],
    expect: { status: "PASS", minAccepted: 1 },
  },


  {
    id: "sq_mesim_missing_decomp_v0_1",
    input: { word: "m\u00ebsim", mode: "strict", maxAttempts: 3, provider: "mock" },
    attempts: [
      // FAIL: missing decomposition entirely
      JSON.stringify({
        word: "m\u00ebsim",
        mode: "strict",
        candidates: [{ form: "m\u00ebsim", opsUsed: [] }],
      }),
      // PASS
      JSON.stringify({
        word: "m\u00ebsim",
        mode: "strict",
        candidates: [
          { form: "m\u00ebsim", opsUsed: [], decomposition: { statement: "canon pass: mësim" } },
        ],
      }),
    ],
    expect: { status: "PASS", traceStatuses: ["FAIL", "PASS"], mustIncludeFailCheckIds: ["DECOMP_PRESENT"], minAccepted: 1 },
  },


  {
    id: "en_damage_path_mismatch_v0_1",
    input: { word: "damage", mode: "strict", maxAttempts: 3, provider: "mock" },
    attempts: [
      // FAIL: vowelPath provided but wrong -> PATH_MATCH should fail
      JSON.stringify({
        word: "damage",
        mode: "strict",
        candidates: [
          { form: "damage", opsUsed: [], vowelPath: ["U"], decomposition: { statement: "bad vowelPath on purpose" } },
        ],
      }),
      // PASS: omit vowelPath entirely (v0.1 allows this)
      JSON.stringify({
        word: "damage",
        mode: "strict",
        candidates: [
          { form: "damage", opsUsed: [], decomposition: { statement: "canon pass: damage" } },
        ],
      }),
    ],
    expect: { status: "PASS", traceStatuses: ["FAIL", "PASS"], mustIncludeFailCheckIds: ["PATH_MATCH"], minAccepted: 1 },
  },


  {
    id: "en_sterile_illegal_ops_v0_1",
    input: { word: "sterile", mode: "strict", maxAttempts: 3, provider: "mock" },
    attempts: [
      // FAIL: illegal op token
      JSON.stringify({
        word: "sterile",
        mode: "strict",
        candidates: [
          { form: "sterile", opsUsed: ["E_INSERT_NOT_ALLOWED"], decomposition: { statement: "illegal op token" } },
        ],
      }),
      // PASS
      JSON.stringify({
        word: "sterile",
        mode: "strict",
        candidates: [
          { form: "sterile", opsUsed: [], decomposition: { statement: "canon pass: sterile" } },
        ],
      }),
    ],
    expect: { status: "PASS", traceStatuses: ["FAIL", "PASS"], mustIncludeFailCheckIds: ["OPS_ALLOWED"], minAccepted: 1 },
  },

] as const;
