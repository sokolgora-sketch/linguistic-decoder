import { ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE } from "@/shared/llm/prompts/rootProposer.v0.2";

describe("Open Instrument PATH_MATCH repair prompt", () => {
  it("contains the repair doctrine required by PR #1154", () => {
    expect(ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE).toContain("Repair must make the candidate true");
    expect(ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE).toContain("PATH_MATCH");
    expect(ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE).toContain("accepted form");
    expect(ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE).toContain("recompute vowelPath");
    expect(ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE).toContain("vowelPath");
    expect(ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE).toContain("Do not change form");
    expect(ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE).toContain("Do not change language");
    expect(ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE).toContain("Do not invent vowels");
    expect(ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE).toContain("Do not omit vowelPath");
    expect(ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE).toContain("fail honestly");
  });
});
