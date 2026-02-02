describe("originClaim brainCandidates — seed fallback v0.1", () => {
  it("non-canon word 'hope' includes brainCandidates via seed fallback", async () => {
    const mod = await import("@/engine/analyzeWord");
    const out = await mod.analyzeWordWithMath7(
      "hope",
      "strict",
      "auto",
      { brainCandidatesSeedFallback: true }
    );

    const bc = (out as any)?.originClaim?.meta?.inputs?.brainCandidates;
    expect(Array.isArray(bc)).toBe(true);
    expect(bc.length).toBeGreaterThan(0);

    expect(bc[0]?.v).toBe("brain.candidateRecord.v0.1");
    expect(bc[0]?.source?.kind).toBe("SEED");
  });
});
