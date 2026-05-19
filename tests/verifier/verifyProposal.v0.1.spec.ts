import { verifyProposalV0_1 } from "@/shared/verifier/verifyProposal.v0.1";

describe("Verifier API: verifyProposal v0.1", () => {
  it("rejects illegal opsUsed deterministically + reports checks", () => {
    const proposal = {
      word: "damage",
      mode: "strict",
      candidates: [
        {
          form: "damage",
          language: "English",
          opsUsed: ["OP_NOT_REAL___ILLEGAL"],
          decomposition: { action: "damage", statement: "test" },
          vowelPath: ["A", "A", "E"],
        },
        {
          form: "damage",
          language: "English",
          opsUsed: [],
          decomposition: { action: "dam", unit: "age" },
        },
      ],
    };

    const out = verifyProposalV0_1(proposal as any);

    // 1st candidate must fail OPS_ALLOWED OR PATH_MATCH (depending on your canonical path)
    expect(out.results[0].pass).toBe(false);
    expect(out.results[0].checks.find((c) => c.id === "OPS_ALLOWED")?.pass).toBe(false);

    // 2nd candidate should pass v0.1 minimal rules (no provided vowelPath so PATH_MATCH passes)
    expect(out.results[1].pass).toBe(true);

    // overall pass should be true (at least one candidate passed)
    expect(out.overallPass).toBe(true);

    expect(out).toMatchSnapshot();
  });
});
