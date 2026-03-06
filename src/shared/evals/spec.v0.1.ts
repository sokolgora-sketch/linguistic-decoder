// EVALS-0 — Eval Spec Contract v0.1
// Versioned tasks for BYO outputs scoring. No model calls. Deterministic only.

export type BucketId = "V1" | "V2" | "V3" | "V4" | "V5" | "V6" | "V7";
export const BUCKETS_V0_1: BucketId[] = ["V1", "V2", "V3", "V4", "V5", "V6", "V7"];

export type TaskKind = "byo" | "derived";
export type InputShapeV0_1 = "bucketed_single_tokens";

export type PermutationSettingsV0_1 = {
  iters: number; // e.g. 12000
  seed: number;  // deterministic base seed
};

export type ScoringV0_1 = {
  engine: "orthography";
  apertureModel: "apertureProxy.v0.1";
  scoreKeys: Array<"aperturePrimary" | "aperturePresenceMean">;
  permutation: PermutationSettingsV0_1;
};

export type EvalTaskV0_1 = {
  taskId: string; // stable id
  kind: TaskKind;
  title: string;
  prompt: string;

  // Task intent
  targetBuckets: BucketId[]; // subset (T1) or full ladder (T2/T3)
  nPerBucket: number;
  languageHint: string; // e.g. "en" (BCP47-ish, best-effort)

  // Output contract (BYO run must match this)
  inputShape: InputShapeV0_1;

  // Derived-task wiring (v0.1 uses this for Negative Control)
  derivedFromTaskId?: string;         // e.g. "T2_LADDER_V0_1"
  derivedOp?: "shuffle_bucket_labels"; // deterministic label shuffle (tokens fixed)
};

export type EvalSpecV0_1 = {
  evalSpecVersion: "evalSpec.v0.1";
  specId: "public-grounding-probe.v0.1";
  title: string;
  description: string;
  tasks: EvalTaskV0_1[];
  scoring: ScoringV0_1;
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

function asNumber(x: unknown, path: string): number {
  assert(typeof x === "number" && Number.isFinite(x), `${path}: expected finite number`);
  return x;
}

function asBucketId(x: unknown, path: string): BucketId {
  const s = asString(x, path);
  assert((BUCKETS_V0_1 as string[]).includes(s), `${path}: invalid bucket '${s}'`);
  return s as BucketId;
}

function asStringArray(x: unknown, path: string): string[] {
  assert(Array.isArray(x), `${path}: expected array`);
  x.forEach((v, i) => assert(typeof v === "string", `${path}[${i}]: expected string`));
  return x as string[];
}

export function parseEvalSpecV0_1(input: unknown): EvalSpecV0_1 {
  assert(isRecord(input), `spec: expected object`);

  const evalSpecVersion = asString(input.evalSpecVersion, "spec.evalSpecVersion");
  assert(evalSpecVersion === "evalSpec.v0.1", `spec.evalSpecVersion: expected 'evalSpec.v0.1'`);

  const specId = asString(input.specId, "spec.specId");
  assert(specId === "public-grounding-probe.v0.1", `spec.specId: expected 'public-grounding-probe.v0.1'`);

  const title = asString(input.title, "spec.title");
  const description = asString(input.description, "spec.description");

  // scoring
  assert(isRecord(input.scoring), "spec.scoring: expected object");
  const scoringRaw = input.scoring;

  const engine = asString(scoringRaw.engine, "spec.scoring.engine");
  assert(engine === "orthography", "spec.scoring.engine: expected 'orthography'");

  const apertureModel = asString(scoringRaw.apertureModel, "spec.scoring.apertureModel");
  assert(apertureModel === "apertureProxy.v0.1", "spec.scoring.apertureModel: expected 'apertureProxy.v0.1'");

  const scoreKeys = asStringArray(scoringRaw.scoreKeys, "spec.scoring.scoreKeys") as ScoringV0_1["scoreKeys"];
  scoreKeys.forEach((k, i) => {
    assert(k === "aperturePrimary" || k === "aperturePresenceMean", `spec.scoring.scoreKeys[${i}]: invalid '${k}'`);
  });

  assert(isRecord(scoringRaw.permutation), "spec.scoring.permutation: expected object");
  const permutation = {
    iters: asNumber(scoringRaw.permutation.iters, "spec.scoring.permutation.iters"),
    seed: asNumber(scoringRaw.permutation.seed, "spec.scoring.permutation.seed"),
  };
  assert(Number.isInteger(permutation.iters) && permutation.iters > 0, "spec.scoring.permutation.iters: must be int > 0");
  assert(Number.isInteger(permutation.seed) && permutation.seed >= 0, "spec.scoring.permutation.seed: must be int >= 0");

  // tasks
  assert(Array.isArray(input.tasks), "spec.tasks: expected array");
  const tasks: EvalTaskV0_1[] = input.tasks.map((t, idx) => {
    assert(isRecord(t), `spec.tasks[${idx}]: expected object`);

    const taskId = asString(t.taskId, `spec.tasks[${idx}].taskId`);
    const kind = asString(t.kind, `spec.tasks[${idx}].kind`);
    assert(kind === "byo" || kind === "derived", `spec.tasks[${idx}].kind: expected 'byo'|'derived'`);

    const title = asString(t.title, `spec.tasks[${idx}].title`);
    const prompt = asString(t.prompt, `spec.tasks[${idx}].prompt`);

    assert(Array.isArray(t.targetBuckets), `spec.tasks[${idx}].targetBuckets: expected array`);
    const targetBuckets = t.targetBuckets.map((b, j) => asBucketId(b, `spec.tasks[${idx}].targetBuckets[${j}]`));

    const nPerBucket = asNumber(t.nPerBucket, `spec.tasks[${idx}].nPerBucket`);
    assert(Number.isInteger(nPerBucket) && nPerBucket > 0, `spec.tasks[${idx}].nPerBucket: must be int > 0`);

    const languageHint = asString(t.languageHint, `spec.tasks[${idx}].languageHint`);

    const inputShape = asString(t.inputShape, `spec.tasks[${idx}].inputShape`);
    assert(inputShape === "bucketed_single_tokens", `spec.tasks[${idx}].inputShape: expected 'bucketed_single_tokens'`);

    const derivedFromTaskId = t.derivedFromTaskId === undefined ? undefined : asString(t.derivedFromTaskId, `spec.tasks[${idx}].derivedFromTaskId`);
    const derivedOp = t.derivedOp === undefined ? undefined : asString(t.derivedOp, `spec.tasks[${idx}].derivedOp`);
    if (kind === "derived") {
      assert(typeof derivedFromTaskId === "string" && derivedFromTaskId.length > 0, `spec.tasks[${idx}]: derivedFromTaskId required`);
      assert(derivedOp === "shuffle_bucket_labels", `spec.tasks[${idx}]: derivedOp must be 'shuffle_bucket_labels'`);
    }

    return {
      taskId,
      kind,
      title,
      prompt,
      targetBuckets,
      nPerBucket,
      languageHint,
      inputShape: "bucketed_single_tokens",
      derivedFromTaskId,
      derivedOp: derivedOp as EvalTaskV0_1["derivedOp"],
    };
  });

  // taskId uniqueness
  const ids = new Set<string>();
  for (const t of tasks) {
    assert(!ids.has(t.taskId), `spec.tasks: duplicate taskId '${t.taskId}'`);
    ids.add(t.taskId);
  }

  // derivedFromTaskId existence
  const idList = new Set(tasks.map((t) => t.taskId));
  for (const t of tasks) {
    if (t.kind === "derived") {
      assert(t.derivedFromTaskId && idList.has(t.derivedFromTaskId), `task '${t.taskId}': derivedFromTaskId not found`);
    }
  }

  return {
    evalSpecVersion: "evalSpec.v0.1",
    specId: "public-grounding-probe.v0.1",
    title,
    description,
    tasks,
    scoring: {
      engine: "orthography",
      apertureModel: "apertureProxy.v0.1",
      scoreKeys,
      permutation,
    },
  };
}

// SSOT spec constant (used by UI + scorer)
export const EVAL_SPEC_V0_1: EvalSpecV0_1 = parseEvalSpecV0_1({
  evalSpecVersion: "evalSpec.v0.1",
  specId: "public-grounding-probe.v0.1",
  title: "ZË-RO Evals v0.1 — Public Grounding Probe (BYO Outputs)",
  description:
    "Controlled tasks for measuring aperture–semantics consistency (orthography) with deterministic scoring and baseline-lockable reports.",
  scoring: {
    engine: "orthography",
    apertureModel: "apertureProxy.v0.1",
    scoreKeys: ["aperturePrimary", "aperturePresenceMean"],
    permutation: { iters: 12000, seed: 90924101 },
  },
  tasks: [
    {
      taskId: "T1_BUCKET_V1_V0_1",
      kind: "byo",
      title: "Bucket Targeting — V1 (Expansion/Space)",
      languageHint: "en",
      inputShape: "bucketed_single_tokens",
      targetBuckets: ["V1"],
      nPerBucket: 20,
      prompt:
        "Return STRICT JSON only. No prose.\n\n" +
        "Goal: produce 20 SINGLE-TOKEN words that best match semantic bucket V1 (Expansion/Space).\n" +
        "Rules: each entry must be a single orthographic token (no spaces). Avoid punctuation.\n\n" +
        "Output shape:\n" +
        "{ \"V1\": [\"token1\", \"token2\", ... 20 total] }",
    },
    {
      taskId: "T1_BUCKET_V4_V0_1",
      kind: "byo",
      title: "Bucket Targeting — V4 (Ground/Balance)",
      languageHint: "en",
      inputShape: "bucketed_single_tokens",
      targetBuckets: ["V4"],
      nPerBucket: 20,
      prompt:
        "Return STRICT JSON only. No prose.\n\n" +
        "Goal: produce 20 SINGLE-TOKEN words that best match semantic bucket V4 (Ground/Balance).\n" +
        "Rules: each entry must be a single orthographic token (no spaces). Avoid punctuation.\n\n" +
        "Output shape:\n" +
        "{ \"V4\": [\"token1\", \"token2\", ... 20 total] }",
    },
    {
      taskId: "T1_BUCKET_V7_V0_1",
      kind: "byo",
      title: "Bucket Targeting — V7 (Focus/Linearity)",
      languageHint: "en",
      inputShape: "bucketed_single_tokens",
      targetBuckets: ["V7"],
      nPerBucket: 20,
      prompt:
        "Return STRICT JSON only. No prose.\n\n" +
        "Goal: produce 20 SINGLE-TOKEN words that best match semantic bucket V7 (Focus/Linearity).\n" +
        "Rules: each entry must be a single orthographic token (no spaces). Avoid punctuation.\n\n" +
        "Output shape:\n" +
        "{ \"V7\": [\"token1\", \"token2\", ... 20 total] }",
    },
    {
      taskId: "T2_LADDER_V0_1",
      kind: "byo",
      title: "Full Ladder — V1..V7",
      languageHint: "en",
      inputShape: "bucketed_single_tokens",
      targetBuckets: ["V1", "V2", "V3", "V4", "V5", "V6", "V7"],
      nPerBucket: 10,
      prompt:
        "Return STRICT JSON only. No prose.\n\n" +
        "Goal: produce a full ladder: 10 SINGLE-TOKEN words per bucket V1..V7.\n" +
        "Rules: each entry must be a single orthographic token (no spaces). Avoid punctuation.\n\n" +
        "STRICT CONSTRAINT: Each of the 70 tokens must be a unique, single-word entry. Do not repeat any word across different buckets.\n" +
        "Before outputting the final JSON, perform a self-audit to ensure zero duplicates.\n\n" +
        "Output shape:\n" +
        "{\n" +
        "  \"V1\": [\"...\"],\n" +
        "  \"V2\": [\"...\"],\n" +
        "  \"V3\": [\"...\"],\n" +
        "  \"V4\": [\"...\"],\n" +
        "  \"V5\": [\"...\"],\n" +
        "  \"V6\": [\"...\"],\n" +
        "  \"V7\": [\"...\"]\n" +
        "}",
    },
    {
      taskId: "T3_NEGATIVE_CONTROL_SHUFFLE_V0_1",
      kind: "derived",
      title: "Negative Control — Deterministic Label Shuffle (tokens fixed)",
      languageHint: "en",
      inputShape: "bucketed_single_tokens",
      targetBuckets: ["V1", "V2", "V3", "V4", "V5", "V6", "V7"],
      nPerBucket: 10,
      derivedFromTaskId: "T2_LADDER_V0_1",
      derivedOp: "shuffle_bucket_labels",
      prompt:
        "This task is derived automatically from T2 by deterministically shuffling bucket labels while keeping tokens fixed.\n" +
        "Expected behavior: slope collapses (false-positive detector).",
    },
  ],
});
