import { runVerifierRulesV0_1 } from "@/shared/verifier/verifierRules.v0.1";
import { verifyProposalV0_1 } from "@/shared/verifier/verifyProposal.v0.1";

describe("ROOT_HAS_VOWEL rule v0.1", () => {
  const baseArgs = {
    mode: "strict" as const,
    opsUsedRaw: [],
  };

  function rootCheck(checks: ReturnType<typeof runVerifierRulesV0_1>) {
    return checks.find((c) => c.id === "ROOT_HAS_VOWEL");
  }

  it("passes when decomposition statement contains a vowel from the extracted path", () => {
    const checks = runVerifierRulesV0_1({
      ...baseArgs,
      extractedVowelPath: ["A", "E"],
      candidate: {
        form: "damage",
        language: "English",
        decomposition: { statement: "dam age" },
      },
    });

    expect(rootCheck(checks)?.pass).toBe(true);
    expect(rootCheck(checks)?.reason).toMatch(/contains extracted vowel/i);
  });

  it("passes when action carries the root vowel", () => {
    const checks = runVerifierRulesV0_1({
      ...baseArgs,
      extractedVowelPath: ["U", "I"],
      candidate: {
        form: "study",
        language: "English",
        decomposition: { action: "study" },
      },
    });

    expect(rootCheck(checks)?.pass).toBe(true);
  });

  it("fails when decomposition/root material has no vowel from the extracted path", () => {
    const checks = runVerifierRulesV0_1({
      ...baseArgs,
      extractedVowelPath: ["A", "E"],
      candidate: {
        form: "damage",
        language: "English",
        decomposition: { statement: "glyph" },
      },
    });

    expect(rootCheck(checks)?.pass).toBe(false);
    expect(rootCheck(checks)?.reason).toMatch(/no vowel from extracted path/i);
  });

  it("fails when decomposition material is missing", () => {
    const checks = runVerifierRulesV0_1({
      ...baseArgs,
      extractedVowelPath: ["A"],
      candidate: {
        form: "damage",
        language: "English",
        decomposition: {},
      },
    });

    expect(rootCheck(checks)?.pass).toBe(false);
    expect(rootCheck(checks)?.reason).toMatch(/no decomposition\/root material/i);
  });

  it("fails when the candidate form has no extracted Seven-Voice vowels", () => {
    const checks = runVerifierRulesV0_1({
      ...baseArgs,
      extractedVowelPath: [],
      candidate: {
        form: "tst",
        language: "English",
        decomposition: { statement: "test" },
      },
    });

    expect(rootCheck(checks)?.pass).toBe(false);
    expect(rootCheck(checks)?.reason).toMatch(/no extracted Seven-Voice vowels/i);
  });

  it("hard-fails overall verification when root material has no overlap", () => {
    const out = verifyProposalV0_1({
      word: "damage",
      mode: "strict",
      candidates: [
        {
          form: "damage",
          language: "English",
          opsUsed: [],
          decomposition: { statement: "glyph" },
        },
      ],
    } as any);

    expect(out.results[0].pass).toBe(false);
    expect(out.results[0].checks.find((c) => c.id === "ROOT_HAS_VOWEL")?.pass).toBe(false);
    expect(out.overallPass).toBe(false);
  });

  it("keeps valid proposals passing when root material overlaps the extracted path", () => {
    const out = verifyProposalV0_1({
      word: "damage",
      mode: "strict",
      candidates: [
        {
          form: "damage",
          language: "English",
          opsUsed: [],
          decomposition: { action: "dam", unit: "age" },
        },
      ],
    } as any);

    expect(out.results[0].pass).toBe(true);
    expect(out.results[0].checks.find((c) => c.id === "ROOT_HAS_VOWEL")?.pass).toBe(true);
    expect(out.overallPass).toBe(true);
  });
});
