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




{
  id: "sq_moter_pass_v0_1",
  input: { word: "mot\u00ebr", mode: "strict", provider: "mock" },
  attempts: [mkPassAttempt("mot\u00ebr", "strict", "mot\u00ebr = mother/sister figure (canon pass v0.1.2)")],
  expect: { status: "PASS", minAccepted: 1 },
},


{
  id: "sq_zemer_pass_v0_1",
  input: { word: "zem\u00ebr", mode: "strict", provider: "mock" },
  attempts: [mkPassAttempt("zem\u00ebr", "strict", "zem\u00ebr = heart (canon pass v0.1.2)")],
  expect: { status: "PASS", minAccepted: 1 },
},


{
  id: "sq_nate_pass_v0_1",
  input: { word: "nat\u00eb", mode: "strict", provider: "mock" },
  attempts: [mkPassAttempt("nat\u00eb", "strict", "nat\u00eb = night (canon pass v0.1.2)")],
  expect: { status: "PASS", minAccepted: 1 },
},


{
  id: "xx_forced_llm_error_v0_1",
  input: { word: "llm_error", mode: "strict", maxAttempts: 1, provider: "mock" },
  attempts: ["__THROW__"],
  expect: { status: "LLM_ERROR", traceStatuses: ["LLM_ERROR"] },
}

,


  {
    id: "xx_open_mode_pass_v0_1",
    input: { word: "open", mode: "open", provider: "mock" },
    attempts: [mkPassAttempt("open", "open", "open-mode PASS (canon v0.1.3)")],
    expect: { status: "PASS", minAccepted: 1 },
  },

  {
    id: "xx_empty_candidates_recover_v0_1",
    input: { word: "empty_candidates", mode: "strict", maxAttempts: 2, provider: "mock" },
    attempts: [
      // parseOk=true, but candidates=[]
      JSON.stringify({ word: "empty_candidates", mode: "strict", candidates: [] }),
      // recovery PASS
      mkPassAttempt("empty_candidates", "strict", "recovered after empty candidates (canon v0.1.3)"),
    ],
    expect: { status: "PASS", minAccepted: 1 },
  }

,


  {
    id: "xx_valid_json_wrong_shape_recover_v0_1",
    input: { word: "shape", mode: "strict", maxAttempts: 2, provider: "mock" },
    attempts: [
      // Valid JSON, WRONG top-level shape -> should FAIL schema/shape validation (NOT parse error)
      JSON.stringify({ not: "a proposer response" }),

      // Recover to PASS
      mkPassAttempt("shape", "strict", "canon pass: shape (recovered after wrong top-level shape)"),
    ],
    expect: { status: "PASS", traceStatuses: ["PARSE_ERROR", "PASS"], minAccepted: 1 },
  }

,


  {
    id: "xx_candidate_missing_fields_recover_v0_1",
    input: { word: "missing_fields", mode: "strict", maxAttempts: 2, provider: "mock" },
    attempts: [
      // Valid JSON + correct top-level keys, but candidate is missing required fields -> should FAIL
      JSON.stringify({
        word: "missing_fields",
        mode: "strict",
        candidates: [
          { opsUsed: [], decomposition: { statement: "missing form should FAIL" } }, // missing `form`
        ],
      }),

      // Recover to PASS
      mkPassAttempt("missing_fields", "strict", "canon pass: missing_fields (recovered after missing candidate fields)"),
    ],
    expect: { status: "PASS", traceStatuses: ["PARSE_ERROR", "PASS"], minAccepted: 1 },
  }

] as const;
