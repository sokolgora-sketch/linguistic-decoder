import { proposeOnceV0_2 } from "@/shared/orchestrator/proposeOnce.v0.2";

describe("Proposer loop: proposeOnce v0.2 (mock)", () => {
  it("returns proposal + verification deterministically (mock provider)", async () => {
    const out = await proposeOnceV0_2({ word: "study", mode: "strict", provider: "mock" });

    expect(out.ok).toBe(true);
    expect(out.proposal?.word).toBe("study");
    expect(out.verification?.overallPass).toBe(true);

    // snapshot should be stable because mock provider is deterministic
    expect(out).toMatchSnapshot();
  });
});
