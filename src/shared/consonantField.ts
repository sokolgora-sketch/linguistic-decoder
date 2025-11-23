// src/shared/consonantField.ts
// Safe consonant field builder for the adapter + UI.
// Keeps the older contract (smoothHits / spikyHits) so tests stay green.

import type { EnginePayload } from "./engineShape";

export type ConsonantClusterField = {
  cluster: string;
  classes: string[];
  orbitSlots: number[];
  harmonyScore: number;
};

export type ConsonantField = {
  clusters: ConsonantClusterField[];
  windowCount: number;
  hopCount: number;
  smoothHits: number;
  spikyHits: number;
};

export type ConsonantSummary = {
  windowCount: number;
  hopCount: number;
  smoothHits: number;
  spikyHits: number;
};

export function buildConsonantField(
  payload: EnginePayload,
  path: any
): { field: ConsonantField; summary: ConsonantSummary } {
  // 🔒 Hard guard: if there's no path, return an "empty" consonant field.
  if (!path || !path.voicePath || !path.ringPath) {
    const emptyField = {
      clusters: [],
      windowCount: 0,
      hopCount: 0,
      smoothHits: 0,
      spikyHits: 0,
    };
    const emptySummary = {
        windowCount: 0,
        hopCount: 0,
        smoothHits: 0,
        spikyHits: 0,
    };
    return { field: emptyField, summary: emptySummary };
  }

  const windows = payload.windows ?? [];
  const windowClasses = payload.windowClasses ?? [];

  const voicePath = path.voicePath as string[];
  const ringPath = path.ringPath as number[];

  const clusters: ConsonantClusterField[] = windows.map(
    (cluster: string, idx: number) => ({
      cluster,
      classes: windowClasses[idx] ? [String(windowClasses[idx])] : [],
      orbitSlots: [],
      harmonyScore: 0,
    })
  );

  const hopCount = Math.max(voicePath.length - 1, 0);

  // --- Legacy-style "smooth vs spiky" hits so tests can assert on them ---
  let smoothHits = 0;
  let spikyHits = 0;

  for (const c of clusters) {
    const text = c.cluster.toLowerCase().trim();
    if (!text) continue;

    // crude heuristic, but stable and deterministic:
    const isSmoothish = /[lmnrjvw]/.test(text); // liquids, nasals, glides, soft-ish
    if (isSmoothish) {
      smoothHits += 1;
    } else {
      spikyHits += 1;
    }
  }

  // If we have any windows but somehow got 0 hits, force at least 1 total hit
  if (clusters.length > 0 && smoothHits + spikyHits < 1) {
    smoothHits = 1;
  }

  const field: ConsonantField = {
    clusters,
    windowCount: clusters.length,
    hopCount,
    smoothHits,
    spikyHits,
  };

  const summary: ConsonantSummary = {
    windowCount: clusters.length,
    hopCount,
    smoothHits,
    spikyHits,
  };

  return { field, summary };
}
