import type { EnginePayload } from "@/shared/engineShape";
import { ENGINE_VERSION } from "@/engine/version";
import { solveWord, type SolveOptions } from "@/functions/sevenVoicesCore";
import { getManifest } from "@/engine/manifest";

export type RunDeterministicOpts = {
  mode?: "strict" | "open";
  alphabet?: string;
};

function emptyPrimaryPath() {
  return {
    voicePath: [],
    ringPath: [],
    levelPath: [],
    ops: [],
    checksums: { V: 0, E: 0, C: 0 },
    kept: 0,
  };
}

export async function runAnalysisDeterministic(
  word: string,
  opts: RunDeterministicOpts = {}
): Promise<EnginePayload> {
  const input = String(word ?? "").trim();
  const mode = opts.mode ?? "strict";
  const alphabet = opts.alphabet ?? "auto";

  const manifest = getManifest();
  const isStrict = mode === "strict";

  const solveOpts: SolveOptions = {
    beamWidth: 8,
    maxOps: isStrict ? 1 : 2,
    allowDelete: !isStrict,
    allowClosure: !isStrict,
    opCost: manifest.opCost,
    alphabet,
    manifest,
    edgeWeight: manifest.edgeWeight,
  };

  const analysis: any = solveWord(input, solveOpts, alphabet);

  const payload: EnginePayload = {
    engineVersion: ENGINE_VERSION,
    word: input,
    mode,
    alphabet: analysis?.alphabet ?? alphabet,
    primaryPath: analysis?.primaryPath ?? emptyPrimaryPath(),
    frontierPaths: analysis?.frontierPaths ?? [],
    windows: analysis?.windows ?? [],
    windowClasses: analysis?.windowClasses ?? [],
    signals: analysis?.signals ?? [],
    solveMs: analysis?.solveMs,
    cacheHit: false,
    recomputed: true,
    languageFamilies: [],
    edgeWindows: analysis?.edgeWindows ?? [],
    math7: analysis?.math7,
  };

  return payload;
}
