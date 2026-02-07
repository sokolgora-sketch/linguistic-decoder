import { ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE } from "@/shared/llm/prompts/rootProposer.v0.2";

describe("LLM prompt: rootProposer v0.2", () => {
  it("base prompt is stable", () => {
    expect(ROOT_PROPOSER_SYSTEM_PROMPT_V0_2_BASE).toMatchSnapshot();
  });
});
