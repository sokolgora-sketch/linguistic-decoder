import { buildEvalsInputBucketWarningsV0_1 } from "@/ui/evals/evalsInputBucketWarnings.v0.1";

describe("evalsInputBucketWarnings v0.1", () => {
  it("summarizes intermediate-triple single-task payloads", () => {
    const out = buildEvalsInputBucketWarningsV0_1({
      inputProbe: {
        kind: "single_task_payload",
        parsed: {
          taskId: "T5_INTERMEDIATE_V0_1",
          inputShape: "intermediate_triple",
          vowelUnderTest: "i",
          buckets: {
            anchor_low: ["raah", "safar"],
            x_vowel: ["nadi", "sabit"],
            anchor_high: ["rekha", "seema"],
          },
        },
      },
    });

    expect(out?.taskId).toBe("T5_INTERMEDIATE_V0_1");
    expect(out?.inputShape).toBe("intermediate_triple");
    expect(out?.targetVowel).toBe("i");
    expect(out?.bucketSummaries.map((summary) => summary.bucketId)).toEqual([
      "anchor_low",
      "x_vowel",
      "anchor_high",
    ]);
    expect(out?.warnings).toContain("anchor_low: expected 10 tokens, found 2.");
    expect(out?.warnings).toContain("x_vowel: expected 10 tokens, found 2.");
    expect(out?.warnings).toContain("anchor_high: expected 10 tokens, found 2.");
  });

  it("summarizes evalRun bundle tasks", () => {
    const out = buildEvalsInputBucketWarningsV0_1({
      inputProbe: {
        kind: "other_json",
        parsed: {
          evalRunVersion: "evalRun.v0.1",
          tasks: [
            {
              taskId: "T5_INTERMEDIATE_V0_1",
              inputShape: "intermediate_triple",
              vowelUnderTest: "i",
              buckets: {
                anchor_low: Array.from({ length: 10 }, (_, index) => `low${index}`),
                x_vowel: [
                  "mini",
                  "chini",
                  "bimari",
                  "tithi",
                  "nadi",
                  "khushi",
                  "sabit",
                  "vidit",
                  "nimit",
                  "safar",
                ],
                anchor_high: Array.from({ length: 10 }, (_, index) => `high${index}`),
              },
            },
          ],
        },
      },
    });

    expect(out?.warnings).toContain("x_vowel: final target-vowel inflation (6/10).");
    expect(out?.warnings).toContain("x_vowel: high average target-vowel count (1.50).");
  });

  it("ignores unsupported bucket shapes", () => {
    expect(
      buildEvalsInputBucketWarningsV0_1({
        inputProbe: {
          kind: "bucket_only",
          parsed: {
            V1: ["a"],
            V2: ["b"],
            V3: ["c"],
            V4: ["d"],
            V5: ["e"],
            V6: ["f"],
            V7: ["g"],
          },
        },
      }),
    ).toBeNull();
  });
});
