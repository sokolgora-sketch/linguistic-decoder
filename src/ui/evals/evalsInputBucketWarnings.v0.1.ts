import {
  summarizeTokenGeometryBucketV0_1,
  type TokenGeometryBucketSummaryV0_1,
} from "@/shared/evals/tokenGeometryInspection.v0.1";

export type EvalsInputBucketWarningSummaryV0_1 = {
  readonly taskId: string;
  readonly inputShape: string;
  readonly targetVowel: string;
  readonly bucketSummaries: readonly TokenGeometryBucketSummaryV0_1[];
  readonly warnings: readonly string[];
};

const INTERMEDIATE_BUCKET_IDS_V0_1 = ["anchor_low", "x_vowel", "anchor_high"] as const;
const EXPECTED_INTERMEDIATE_BUCKET_COUNT_V0_1 = 10;

export function buildEvalsInputBucketWarningsV0_1(args: {
  readonly inputProbe: unknown;
}): EvalsInputBucketWarningSummaryV0_1 | null {
  const task = extractTaskPayloadV0_1(args.inputProbe);
  if (!task) return null;

  const buckets = task.buckets;
  if (!hasIntermediateBucketsV0_1(buckets)) return null;

  const targetVowel =
    typeof task.vowelUnderTest === "string" && task.vowelUnderTest.trim()
      ? task.vowelUnderTest.trim()
      : "i";

  const bucketSummaries = INTERMEDIATE_BUCKET_IDS_V0_1.map((bucketId) =>
    summarizeTokenGeometryBucketV0_1({
      bucketId,
      tokens: buckets[bucketId],
      targetVowel,
    }),
  );

  return {
    taskId: typeof task.taskId === "string" ? task.taskId : "unknown",
    inputShape: typeof task.inputShape === "string" ? task.inputShape : "unknown",
    targetVowel,
    bucketSummaries,
    warnings: buildWarningsV0_1(bucketSummaries),
  };
}

function extractTaskPayloadV0_1(inputProbe: unknown): {
  readonly taskId?: unknown;
  readonly inputShape?: unknown;
  readonly vowelUnderTest?: unknown;
  readonly buckets?: unknown;
} | null {
  if (!isPlainObjectV0_1(inputProbe)) return null;

  const kind = inputProbe.kind;
  const parsed = inputProbe.parsed;

  if (kind === "single_task_payload" && isPlainObjectV0_1(parsed)) {
    return parsed;
  }

  if (kind === "other_json" && isPlainObjectV0_1(parsed)) {
    return extractTaskFromRunLikeJsonV0_1(parsed);
  }

  return null;
}

function extractTaskFromRunLikeJsonV0_1(value: Record<string, unknown>): {
  readonly taskId?: unknown;
  readonly inputShape?: unknown;
  readonly vowelUnderTest?: unknown;
  readonly buckets?: unknown;
} | null {
  if (isPlainObjectV0_1(value.buckets)) return value;

  const tasks = value.tasks;
  if (!Array.isArray(tasks)) return null;

  for (const task of tasks) {
    if (isPlainObjectV0_1(task) && isPlainObjectV0_1(task.buckets)) return task;
  }

  return null;
}

function hasIntermediateBucketsV0_1(
  buckets: unknown,
): buckets is Record<(typeof INTERMEDIATE_BUCKET_IDS_V0_1)[number], string[]> {
  if (!isPlainObjectV0_1(buckets)) return false;

  return INTERMEDIATE_BUCKET_IDS_V0_1.every((bucketId) => {
    const value = buckets[bucketId];
    return Array.isArray(value) && value.every((token) => typeof token === "string");
  });
}

function buildWarningsV0_1(
  summaries: readonly TokenGeometryBucketSummaryV0_1[],
): readonly string[] {
  const warnings: string[] = [];

  for (const summary of summaries) {
    if (summary.tokenCount !== EXPECTED_INTERMEDIATE_BUCKET_COUNT_V0_1) {
      warnings.push(
        `${summary.bucketId}: expected ${EXPECTED_INTERMEDIATE_BUCKET_COUNT_V0_1} tokens, found ${summary.tokenCount}.`,
      );
    }
  }

  const target = summaries.find((summary) => summary.bucketId === "x_vowel");

  if (target) {
    if (
      target.tokenCount > 0 &&
      target.finalTargetVowelTokenCount >= Math.ceil(target.tokenCount * 0.4)
    ) {
      warnings.push(
        `x_vowel: final target-vowel inflation (${target.finalTargetVowelTokenCount}/${target.tokenCount}).`,
      );
    }

    if (target.meanTargetVowelCount >= 1.5) {
      warnings.push(
        `x_vowel: high average target-vowel count (${target.meanTargetVowelCount.toFixed(2)}).`,
      );
    }
  }

  return warnings;
}

function isPlainObjectV0_1(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
