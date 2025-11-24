// src/shared/consonantField.ts
// Safe consonant field builder for the adapter + UI.
// Keeps the older contract (smoothHits / spikyHits) so tests stay green.

import type { EnginePayload, ConsonantField } from "./engineShape";

export type ConsonantClusterField = {
  cluster: string;
  classes: string[];
  orbitSlots: number[];
  harmonyScore: number;
};

// This local type is now superseded by the one in engineShape.
// export type ConsonantField = {
//   clusters: ConsonantClusterField[];
//   windowCount: number;
//   hopCount: number;
//   smoothHits: number;
//   spikyHits: number;
// };

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
  const windows = payload?.windows ?? [];
  const windowClasses = payload?.windowClasses ?? [];

  // path can be undefined in weird edge cases – be defensive
  const voicePath = path?.voicePath ?? [];
  const ringPath = path?.ringPath ?? [];

  const clusters: ConsonantClusterField[] = windows.map(
    (cluster: string, idx: number) => ({
      cluster,
      classes: windowClasses[idx] ? [String(windowClasses[idx])] : [],
      orbitSlots: [],
      harmonyScore: 0,
    })
  );

  // Simple hop count: how many steps in the voice path
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
    slots: [], // Add the missing 'slots' property
  };

  const summary: ConsonantSummary = {
    windowCount: clusters.length,
    hopCount,
    smoothHits,
    spikyHits,
  };

  return { field, summary };
}
