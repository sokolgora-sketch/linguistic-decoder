export type CanonStatusV0_1 = "PASS" | "FAIL" | "PARSE_ERROR" | "LLM_ERROR";

export type CanonCaseV0_1 = {
  id: string;
  input: {
    word: string;
    mode: "strict" | "open";
    maxAttempts?: number;
    provider?: "mock";
  };
  attempts: readonly string[];
  expect: {
    status: CanonStatusV0_1;
    traceStatuses?: readonly CanonStatusV0_1[];
    mustIncludeFailCheckIds?: readonly string[]; // e.g. ["OPS_ALLOWED"]
    minAccepted?: number; // PASS: minimum accepted forms
  };
};
