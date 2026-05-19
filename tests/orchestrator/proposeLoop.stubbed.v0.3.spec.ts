import { proposeLoopV0_3 } from "@/shared/orchestrator/proposeLoop.v0.3";

describe("Proposer loop: proposeLoop v0.3 (stubbed)", () => {
  it("retries parse->fail->pass with stable trace + cacheHit", async () => {
    const cache = new Map<string, any>();
    let calls = 0;

    const runProposerStub = async (_req: any, _provider: any) => {
      calls++;

      // 1) invalid JSON => PARSE_ERROR
      if (calls === 1) return { provider: "mock", rawText: "not json", meta: { model: "mock" } };

      // 2) valid JSON but FAIL (illegal op) => OPS_ALLOWED failReason
      if (calls === 2) {
        return {
          provider: "mock",
          meta: { model: "mock" },
          rawText: JSON.stringify(
            {
              word: "study",
              mode: "strict",
              candidates: [
                { form: "study", language: "English", opsUsed: ["OP_NOT_REAL___ILLEGAL"], decomposition: { statement: "study x" } },
              ],
            },
            null,
            2
          ),
        };
      }

      // 3) pass
      return {
        provider: "mock",
        meta: { model: "mock" },
        rawText: JSON.stringify(
          {
            word: "study",
            mode: "strict",
            candidates: [{ form: "study", language: "English", opsUsed: [], decomposition: { statement: "study ok" } }],
          },
          null,
          2
        ),
      };
    };

    const out = await proposeLoopV0_3(
      { word: "study", mode: "strict", maxAttempts: 4, provider: "mock" },
      { runProposer: runProposerStub as any, cache }
    );

    expect(out.status).toBe("PASS");
    expect(out.meta.attemptsUsed).toBe(3);
    expect(out.meta.cacheHit).toBe(false);

    expect(out.trace).toHaveLength(3);
    expect(out.trace[0].status).toBe("PARSE_ERROR");
    expect(out.trace[0].parseOk).toBe(false);

    expect(out.trace[1].status).toBe("FAIL");
    expect(out.trace[1].parseOk).toBe(true);
    expect(out.trace[1].failReasons?.[0]).toMatchObject({
      form: "study",
      checkId: "OPS_ALLOWED",
    });

    expect(out.trace[2].status).toBe("PASS");
    expect(out.final?.acceptedCandidateForms).toEqual(["study"]);

    // 2nd call: should be cacheHit and not call proposer again
    const out2 = await proposeLoopV0_3(
      { word: "study", mode: "strict", maxAttempts: 4, provider: "mock" },
      { runProposer: runProposerStub as any, cache }
    );
    expect(out2.meta.cacheHit).toBe(true);
    expect(calls).toBe(3);
  });
});
