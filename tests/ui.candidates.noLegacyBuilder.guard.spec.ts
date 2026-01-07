/**
 * Guardrail: Candidate UI must be VM-first only.
 * We do not allow legacy buildCandidateRows(result:any) to exist.
 */

describe("ui guardrail: candidates module is VM-only", () => {
  it("does not export legacy raw-parsing builder", async () => {
    const mod = await import("../src/ui/candidates/candidateModel");
    expect((mod as any).buildCandidateRows).toBeUndefined();
  });
});
