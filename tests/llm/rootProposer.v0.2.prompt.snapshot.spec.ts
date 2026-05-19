import { ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE } from "@/shared/llm/prompts/rootProposer.v0.2";

describe("LLM prompt: rootProposer v0.2", () => {
  it("base prompt is stable", () => {
    expect(ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE).toMatchSnapshot();
  });

  it("states the Phase 2 verifier contract fields", () => {
    expect(ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE).toContain('"language": string');
    expect(ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE).toContain("language (non-empty documented human language");
    expect(ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE).toContain("action, instrument, unit");
    expect(ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE).toContain("statement alone is insufficient");
    expect(ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE).toContain("LANG_KNOWN failed");
    expect(ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE).toContain("ROOT_HAS_VOWEL failed");
    expect(ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE).toContain("FUNCTION_FIT_NONEMPTY failed");
  });
});
