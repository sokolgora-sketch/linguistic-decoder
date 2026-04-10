import { normalizeRunIdTemplateV0_1 } from "@/ui/evals/evalsRunMetadata.v0.1";

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

export type EvalsPersistedRunStateV0_1 = {
  savedRuns: EvalsSavedRunRecordV0_1[];
  runSeries: EvalsRunSeriesV0_1[];
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

function emptyPersistedState(): EvalsPersistedRunStateV0_1 {
  return {
    savedRuns: [],
    runSeries: [],
  };
}

function normalizePersistedState(raw: unknown): EvalsPersistedRunStateV0_1 {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return emptyPersistedState();
  }

  const obj = raw as Record<string, unknown>;

  return {
    savedRuns: Array.isArray(obj.savedRuns)
      ? (obj.savedRuns as EvalsSavedRunRecordV0_1[])
      : [],
    runSeries: Array.isArray(obj.runSeries)
      ? (obj.runSeries as EvalsRunSeriesV0_1[])
      : [],
  };
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

export function readLocalPersistedEvalsRunStateV0_1(): EvalsPersistedRunStateV0_1 {
  return {
    savedRuns: readSavedRuns(),
    runSeries: readRunSeries(),
  };
}

export function shouldUseRemotePersistedEvalsRunStateV0_1(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof process !== "undefined") {
    if (process.env.NODE_ENV === "test") return false;
    if (typeof process.env.JEST_WORKER_ID === "string") return false;
  }
  return true;
}

async function fetchRemotePersistedStateV0_1(): Promise<EvalsPersistedRunStateV0_1> {
  const res = await fetch("/api/evals/state", {
    method: "GET",
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.ok) {
    throw new Error(
      typeof data?.message === "string"
        ? data.message
        : `Could not load shared evals state (HTTP ${res.status}).`,
    );
  }

  return normalizePersistedState(data);
}

export async function savePersistedEvalsRunStateV0_1(
  state: EvalsPersistedRunStateV0_1,
): Promise<EvalsPersistedRunStateV0_1> {
  const normalized = normalizePersistedState(state);

  writeSavedRuns(normalized.savedRuns);
  writeRunSeries(normalized.runSeries);

  if (!shouldUseRemotePersistedEvalsRunStateV0_1()) {
    return normalized;
  }

  try {
    const res = await fetch("/api/evals/state", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(normalized),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.ok) {
      throw new Error(
        typeof data?.message === "string"
          ? data.message
          : `Could not save shared evals state (HTTP ${res.status}).`,
      );
    }

    const persisted = normalizePersistedState(data);
    writeSavedRuns(persisted.savedRuns);
    writeRunSeries(persisted.runSeries);
    return persisted;
  } catch {
    return normalized;
  }
}

export async function loadPersistedEvalsRunStateV0_1(): Promise<EvalsPersistedRunStateV0_1> {
  const local = readLocalPersistedEvalsRunStateV0_1();

  if (!shouldUseRemotePersistedEvalsRunStateV0_1()) {
    return local;
  }

  try {
    const remote = await fetchRemotePersistedStateV0_1();
    const remoteHasData = remote.savedRuns.length > 0 || remote.runSeries.length > 0;
    const localHasData = local.savedRuns.length > 0 || local.runSeries.length > 0;

    if (!remoteHasData && localHasData) {
      return savePersistedEvalsRunStateV0_1(local);
    }

    writeSavedRuns(remote.savedRuns);
    writeRunSeries(remote.runSeries);
    return remote;
  } catch {
    return local;
  }
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
  return normalizeRunIdTemplateV0_1(template).replaceAll(
    "{NN}",
    formatSeriesOrdinal(ordinal),
  );
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
    runIdTemplate: normalizeRunIdTemplateV0_1(runIdTemplate),
    createdAt: now,
    updatedAt: now,
  };
}
