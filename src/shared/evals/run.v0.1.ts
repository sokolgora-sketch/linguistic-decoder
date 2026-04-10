// EVALS-2 — Eval Run Contract v0.1
// BYO outputs bundle. No model calls. Deterministic parse + validation only.

import {
  BUCKETS_V0_1,
  INTERMEDIATE_BUCKETS_V0_1,
  type BucketId,
  type EvalBucketKeyV0_1,
  type InputShapeV0_1,
} from "./spec.v0.1";

export type EvalRunTaskPayloadV0_1 = {
  taskId: string;
  inputShape: InputShapeV0_1;
  languageHint?: string;
  vowelUnderTest?: string;
  anchorLow?: BucketId;
  anchorHigh?: BucketId;
  buckets: Partial<Record<EvalBucketKeyV0_1, string[]>>;
};

export type EvalRunBundleV0_1 = {
  evalRunVersion: "evalRun.v0.1";
  evalSpecVersion: "evalSpec.v0.1";
  specId: "public-grounding-probe.v0.1";
  runId: string;
  meta?: {
    provider?: string;
    model?: string;
    label?: string;
    sourceEngineId?: string;
    sourceEngineVersion?: string;
    sourceEngineBuild?: string;
  };
  tasks: EvalRunTaskPayloadV0_1[];
};

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function asString(x: unknown, path: string): string {
  assert(typeof x === "string", `${path}: expected string`);
  return x;
}

function asTrimmedString(x: unknown, path: string): string {
  return asString(x, path).trim();
}

function asStringArray(x: unknown, path: string): string[] {
  assert(Array.isArray(x), `${path}: expected array`);
  x.forEach((v, i) =>
    assert(typeof v === "string", `${path}[${i}]: expected string`),
  );
  return x as string[];
}

function asBucketId(x: unknown, path: string): BucketId {
  const s = asString(x, path);
  assert(
    (BUCKETS_V0_1 as string[]).includes(s),
    `${path}: invalid bucket '${s}'`,
  );
  return s as BucketId;
}

function asEvalBucketKeyForShape(
  x: unknown,
  inputShape: InputShapeV0_1,
  path: string,
): EvalBucketKeyV0_1 {
  const s = asString(x, path);
  const allowed =
    inputShape === "intermediate_triple"
      ? INTERMEDIATE_BUCKETS_V0_1
      : BUCKETS_V0_1;
  assert(
    (allowed as string[]).includes(s),
    `${path}: invalid bucket '${s}' for inputShape '${inputShape}'`,
  );
  return s as EvalBucketKeyV0_1;
}

export function parseEvalRunBundleV0_1(input: unknown): EvalRunBundleV0_1 {
  assert(isRecord(input), "run: expected object");

  const evalRunVersion = asString(input.evalRunVersion, "run.evalRunVersion");
  assert(
    evalRunVersion === "evalRun.v0.1",
    "run.evalRunVersion: expected 'evalRun.v0.1'",
  );

  const evalSpecVersion = asString(
    input.evalSpecVersion,
    "run.evalSpecVersion",
  );
  assert(
    evalSpecVersion === "evalSpec.v0.1",
    "run.evalSpecVersion: expected 'evalSpec.v0.1'",
  );

  const specId = asString(input.specId, "run.specId");
  assert(
    specId === "public-grounding-probe.v0.1",
    "run.specId: expected 'public-grounding-probe.v0.1'",
  );

  const runId = asTrimmedString(input.runId, "run.runId");
  assert(runId.length > 0, "run.runId: must be non-empty");

  // meta (optional)
  let meta: EvalRunBundleV0_1["meta"] | undefined;
  if (input.meta !== undefined) {
    assert(isRecord(input.meta), "run.meta: expected object");
    const m = input.meta;
    meta = {
      provider:
        m.provider === undefined
          ? undefined
          : asTrimmedString(m.provider, "run.meta.provider"),
      model:
        m.model === undefined
          ? undefined
          : asTrimmedString(m.model, "run.meta.model"),
      label:
        m.label === undefined
          ? undefined
          : asTrimmedString(m.label, "run.meta.label"),
      sourceEngineId:
        m.sourceEngineId === undefined
          ? undefined
          : asTrimmedString(m.sourceEngineId, "run.meta.sourceEngineId"),
      sourceEngineVersion:
        m.sourceEngineVersion === undefined
          ? undefined
          : asTrimmedString(m.sourceEngineVersion, "run.meta.sourceEngineVersion"),
      sourceEngineBuild:
        m.sourceEngineBuild === undefined
          ? undefined
          : asTrimmedString(m.sourceEngineBuild, "run.meta.sourceEngineBuild"),
    };
  }

  assert(Array.isArray(input.tasks), "run.tasks: expected array");
  const tasks: EvalRunTaskPayloadV0_1[] = input.tasks.map((t, i) => {
    assert(isRecord(t), `run.tasks[${i}]: expected object`);
    const taskId = asString(t.taskId, `run.tasks[${i}].taskId`);
    const inputShape = asString(t.inputShape, `run.tasks[${i}].inputShape`);
    assert(
      inputShape === "bucketed_single_tokens" ||
        inputShape === "intermediate_triple",
      `run.tasks[${i}].inputShape: expected 'bucketed_single_tokens'|'intermediate_triple'`,
    );

    const languageHint =
      t.languageHint === undefined
        ? undefined
        : asTrimmedString(t.languageHint, `run.tasks[${i}].languageHint`);

    const vowelUnderTest =
      t.vowelUnderTest === undefined
        ? undefined
        : asTrimmedString(t.vowelUnderTest, `run.tasks[${i}].vowelUnderTest`);

    const anchorLow =
      t.anchorLow === undefined
        ? undefined
        : asBucketId(t.anchorLow, `run.tasks[${i}].anchorLow`);

    const anchorHigh =
      t.anchorHigh === undefined
        ? undefined
        : asBucketId(t.anchorHigh, `run.tasks[${i}].anchorHigh`);

    if (inputShape === "intermediate_triple") {
      assert(
        typeof languageHint === "string" && languageHint.length > 0,
        `run.tasks[${i}].languageHint: required for 'intermediate_triple'`,
      );
      assert(
        typeof vowelUnderTest === "string" && vowelUnderTest.length > 0,
        `run.tasks[${i}].vowelUnderTest: required for 'intermediate_triple'`,
      );
      assert(
        typeof anchorLow === "string",
        `run.tasks[${i}].anchorLow: required for 'intermediate_triple'`,
      );
      assert(
        typeof anchorHigh === "string",
        `run.tasks[${i}].anchorHigh: required for 'intermediate_triple'`,
      );
      assert(
        anchorLow !== anchorHigh,
        `run.tasks[${i}]: anchorLow and anchorHigh must differ`,
      );
    }

    assert(isRecord(t.buckets), `run.tasks[${i}].buckets: expected object`);
    const bucketsRaw = t.buckets;

    const buckets: Partial<Record<EvalBucketKeyV0_1, string[]>> = {};
    for (const [k, v] of Object.entries(bucketsRaw)) {
      const b = asEvalBucketKeyForShape(
        k,
        inputShape as InputShapeV0_1,
        `run.tasks[${i}].buckets.key`,
      );
      buckets[b] = asStringArray(v, `run.tasks[${i}].buckets['${b}']`);
    }

    return {
      taskId,
      inputShape: inputShape as InputShapeV0_1,
      languageHint,
      vowelUnderTest,
      anchorLow,
      anchorHigh,
      buckets,
    };
  });

  return {
    evalRunVersion: "evalRun.v0.1",
    evalSpecVersion: "evalSpec.v0.1",
    specId: "public-grounding-probe.v0.1",
    runId,
    meta,
    tasks,
  };
}
