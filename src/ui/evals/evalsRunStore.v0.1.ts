import type { EvalReportBundleV0_1 } from "@/shared/evals/report.v0.1";

export type EvalsWorkbenchStateV0_1 = {
  mode: "run_bundle" | "task_buckets";
  taskId: string;
  runId: string;
  provider: string;
  model: string;
  label: string;
  sourceEngineId: string;
  sourceEngineVersion: string;
  sourceEngineBuild: string;
  inputText: string;
  pickedFileName: string;
  report: EvalReportBundleV0_1 | null;
  md: string;
};

export type EvalsSavedRunRecordV0_1 = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  seriesId: string | null;
  ordinal: number | null;
  workbench: EvalsWorkbenchStateV0_1;
};

export type EvalsRunSeriesV0_1 = {
  id: string;
  label: string;
  targetCount: number;
  nextOrdinal: number;
  runIdTemplate: string;
  createdAt: number;
  updatedAt: number;
};

const SAVED_RUNS_KEY = "zro.evals.savedRuns.v0.1";
const RUN_SERIES_KEY = "zro.evals.runSeries.v0.1";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeParseArray<T>(raw: string | null): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function readSavedRuns(): EvalsSavedRunRecordV0_1[] {
  if (!canUseStorage()) return [];
  return safeParseArray<EvalsSavedRunRecordV0_1>(
    window.localStorage.getItem(SAVED_RUNS_KEY),
  );
}

export function writeSavedRuns(rows: EvalsSavedRunRecordV0_1[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(SAVED_RUNS_KEY, JSON.stringify(rows));
}

export function readRunSeries(): EvalsRunSeriesV0_1[] {
  if (!canUseStorage()) return [];
  return safeParseArray<EvalsRunSeriesV0_1>(
    window.localStorage.getItem(RUN_SERIES_KEY),
  );
}

export function writeRunSeries(rows: EvalsRunSeriesV0_1[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(RUN_SERIES_KEY, JSON.stringify(rows));
}

export function makeSavedRunId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `saved-run-${Date.now()}`;
}

export function makeSeriesId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `run-series-${Date.now()}`;
}

export function formatSeriesOrdinal(n: number) {
  const safe = Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
  return `r${String(safe).padStart(2, "0")}`;
}

export function applySeriesRunIdTemplate(template: string, ordinal: number) {
  return template.replaceAll("{NN}", formatSeriesOrdinal(ordinal));
}

export function makeDefaultRunSeries(
  label: string,
  runIdTemplate: string,
  targetCount = 15,
): EvalsRunSeriesV0_1 {
  const now = Date.now();
  return {
    id: makeSeriesId(),
    label,
    targetCount,
    nextOrdinal: 1,
    runIdTemplate,
    createdAt: now,
    updatedAt: now,
  };
}
