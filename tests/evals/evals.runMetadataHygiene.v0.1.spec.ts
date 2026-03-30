import { describe, expect, it } from "@jest/globals";

import { parseEvalRunBundleV0_1 } from "@/shared/evals/run.v0.1";
import {
  normalizeEvalsMetaTextV0_1,
  normalizeRunIdTemplateV0_1,
} from "@/ui/evals/evalsRunMetadata.v0.1";
import {
  applySeriesRunIdTemplate,
  makeDefaultRunSeries,
} from "@/ui/evals/evalsRunStore.v0.1";

describe("evals run metadata hygiene v0.1", () => {
  it("trims runId and meta fields during parse", () => {
    const run = parseEvalRunBundleV0_1({
      evalRunVersion: "evalRun.v0.1",
      evalSpecVersion: "evalSpec.v0.1",
      specId: "public-grounding-probe.v0.1",
      runId: "  battery.r01  ",
      meta: {
        provider: "  openai  ",
        model: "  chatgpt52thinking  ",
        label: "  fresh-chat  ",
        sourceEngineId: "  zero-api  ",
        sourceEngineVersion: "  analyze-v1  ",
        sourceEngineBuild: "  845bb5a  ",
      },
      tasks: [
        {
          taskId: "T2_LADDER_V0_1",
          inputShape: "bucketed_single_tokens",
          buckets: {
            V1: ["a"],
            V2: ["o"],
          },
        },
      ],
    });

    expect(run.runId).toBe("battery.r01");
    expect(run.meta).toEqual({
      provider: "openai",
      model: "chatgpt52thinking",
      label: "fresh-chat",
      sourceEngineId: "zero-api",
      sourceEngineVersion: "analyze-v1",
      sourceEngineBuild: "845bb5a",
    });
  });

  it("normalizes metadata text and runId templates", () => {
    expect(normalizeEvalsMetaTextV0_1("  openai  ")).toBe("openai");
    expect(normalizeEvalsMetaTextV0_1("   ")).toBe("");
    expect(normalizeRunIdTemplateV0_1("")).toBe("battery.{NN}");
    expect(normalizeRunIdTemplateV0_1("fresh-chat")).toBe("fresh-chat.{NN}");
    expect(normalizeRunIdTemplateV0_1("battery.{NN}")).toBe("battery.{NN}");
  });

  it("wires normalized runIdTemplate into series creation and preview", () => {
    const series = makeDefaultRunSeries("fresh-chat", "fresh-chat", 3);

    expect(series.runIdTemplate).toBe("fresh-chat.{NN}");
    expect(applySeriesRunIdTemplate("fresh-chat", 1)).toBe("fresh-chat.r01");
    expect(applySeriesRunIdTemplate(series.runIdTemplate, 12)).toBe("fresh-chat.r12");
  });
});
