import { runVerifierRulesV0_1 } from "@/shared/verifier/verifierRules.v0.1";
import { verifyProposalV0_1 } from "@/shared/verifier/verifyProposal.v0.1";

describe("FUNCTION_FIT_NONEMPTY rule v0.1", () => {
  const baseArgs = {
    mode: "strict" as const,
    opsUsedRaw: [],
    extractedVowelPath: ["U", "I"],
  };

  function functionFitCheck(checks: ReturnType<typeof runVerifierRulesV0_1>) {
    return checks.find((c) => c.id === "FUNCTION_FIT_NONEMPTY");
  }

  it("passes when action is non-empty", () => {
    const checks = runVerifierRulesV0_1({
      ...baseArgs,
      candidate: {
        form: "study",
        language: "English",
        decomposition: { action: "study", statement: "study root" },
      },
    });

    expect(functionFitCheck(checks)?.pass).toBe(true);
    expect(functionFitCheck(checks)?.reason).toMatch(/structured function field/i);
  });

  it("passes when instrument is non-empty", () => {
    const checks = runVerifierRulesV0_1({
      ...baseArgs,
      candidate: {
        form: "study",
        language: "English",
        decomposition: { instrument: "study", statement: "instrument/root material" },
      },
    });

    expect(functionFitCheck(checks)?.pass).toBe(true);
  });

  it("passes when unit is non-empty", () => {
    const checks = runVerifierRulesV0_1({
      ...baseArgs,
      candidate: {
        form: "study",
        language: "English",
        decomposition: { unit: "study", statement: "unit/root material" },
      },
    });

    expect(functionFitCheck(checks)?.pass).toBe(true);
  });

  it("fails when only statement is present", () => {
    const checks = runVerifierRulesV0_1({
      ...baseArgs,
      candidate: {
        form: "study",
        language: "English",
        decomposition: { statement: "study statement only" },
      },
    });

    expect(functionFitCheck(checks)?.pass).toBe(false);
    expect(functionFitCheck(checks)?.reason).toMatch(/statement alone is insufficient/i);
  });

  it("fails when structured fields are empty strings", () => {
    const checks = runVerifierRulesV0_1({
      ...baseArgs,
      candidate: {
        form: "study",
        language: "English",
        decomposition: { action: "   ", instrument: "", unit: " ", statement: "study statement only" },
      },
    });

    expect(functionFitCheck(checks)?.pass).toBe(false);
  });

  it("hard-fails overall verification when statement alone is present", () => {
    const out = verifyProposalV0_1({
      word: "study",
      mode: "strict",
      candidates: [
        {
          form: "study",
          language: "English",
          opsUsed: [],
          decomposition: { statement: "study statement only" },
        },
      ],
    } as any);

    expect(out.results[0].pass).toBe(false);
    expect(out.results[0].checks.find((c) => c.id === "FUNCTION_FIT_NONEMPTY")?.pass).toBe(false);
    expect(out.overallPass).toBe(false);
  });

  it("keeps valid proposals passing when action is present", () => {
    const out = verifyProposalV0_1({
      word: "study",
      mode: "strict",
      candidates: [
        {
          form: "study",
          language: "English",
          opsUsed: [],
          decomposition: { action: "study", statement: "study root check" },
        },
      ],
    } as any);

    expect(out.results[0].pass).toBe(true);
    expect(out.results[0].checks.find((c) => c.id === "FUNCTION_FIT_NONEMPTY")?.pass).toBe(true);
    expect(out.overallPass).toBe(true);
  });
});
