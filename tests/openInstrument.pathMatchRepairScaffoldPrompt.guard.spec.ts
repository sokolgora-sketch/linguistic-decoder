import { proposeLoopV0_3 } from "../src/shared/orchestrator/proposeLoop.v0.3";
import type { ProposerRequestV0_2, ProposerResultV0_2 } from "../src/shared/llm/providers/proposerProvider.v0.2";

describe("Open Instrument PATH_MATCH repair scaffold prompt wiring", () => {
  it("adds a structured PATH_MATCH scaffold to the retry prompt and user payload", async () => {
    const requests: ProposerRequestV0_2[] = [];
    let callCount = 0;

    const runProposer = async (request: ProposerRequestV0_2): Promise<ProposerResultV0_2> => {
      requests.push(request);
      callCount += 1;

      if (callCount === 1) {
        return {
          provider: "mock",
          rawText: JSON.stringify({
            word: "damage",
            mode: "strict",
            candidates: [
              {
                form: "damage",
                language: "English",
                opsUsed: [],
                decomposition: {
                  action: "damage",
                },
                vowelPath: ["U"],
              },
            ],
          }),
          meta: { model: "mock" },
        };
      }

      return {
        provider: "mock",
        rawText: JSON.stringify({
          word: "damage",
          mode: "strict",
          candidates: [
            {
              form: "damage",
              language: "English",
              opsUsed: [],
              decomposition: {
                action: "damage",
              },
              vowelPath: ["A", "A", "E"],
            },
          ],
        }),
        meta: { model: "mock" },
      };
    };

    const result = await proposeLoopV0_3(
      { word: "damage", mode: "strict", maxAttempts: 2, provider: "mock" },
      { runProposer, cache: new Map() },
    );

    expect(result.status).toBe("PASS");
    expect(requests).toHaveLength(2);

    const firstTrace = result.trace[0];
    expect(firstTrace.failReasons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ checkId: "PATH_MATCH", form: "damage" }),
      ]),
    );

    const scaffold = firstTrace.repairContexts?.[0];
    expect(scaffold).toMatchObject({
      failedCheckId: "PATH_MATCH",
      acceptedForm: "damage",
      candidateLanguage: "English",
      declaredVowelPath: ["U"],
      extractedVowelPath: ["A", "A", "E"],
      vowelPathPresent: true,
      mismatchKind: "PATH_LENGTH_MISMATCH",
    });
    expect(scaffold?.failedReason).toContain("vowelPath mismatch");
    expect(scaffold?.allowedRepairActions).toEqual(
      expect.arrayContaining([
        "recompute_vowel_path_from_extracted_material",
        "preserve_accepted_form",
        "preserve_language_unless_unsupported",
        "fail_honestly_if_truthful_repair_is_impossible",
      ]),
    );
    expect(scaffold?.blockedRepairActions).toEqual(
      expect.arrayContaining([
        "do_not_change_form_only_to_satisfy_PATH_MATCH",
        "do_not_change_language_only_to_satisfy_PATH_MATCH",
        "do_not_invent_vowels",
        "do_not_remove_vowelPath_to_bypass_checking",
        "do_not_weaken_PATH_MATCH",
      ]),
    );
    expect(scaffold?.repairInstruction).toContain("recompute vowelPath");

    const retryPrompt = requests[1].systemPrompt;
    expect(retryPrompt).toContain("REPAIR_INPUT_JSON");
    expect(retryPrompt).toContain("Repair must make the candidate true");
    expect(retryPrompt).toContain("do_not_change_form_only_to_satisfy_PATH_MATCH");
    expect(retryPrompt).toContain("do_not_change_language_only_to_satisfy_PATH_MATCH");
    expect(retryPrompt).toContain("do_not_invent_vowels");
    expect(retryPrompt).toContain("do_not_remove_vowelPath_to_bypass_checking");

    expect((requests[1].userPayload as any).repair.repairContexts[0]).toMatchObject({
      failedCheckId: "PATH_MATCH",
      declaredVowelPath: ["U"],
      extractedVowelPath: ["A", "A", "E"],
      vowelPathPresent: true,
      mismatchKind: "PATH_LENGTH_MISMATCH",
    });
  });
});
