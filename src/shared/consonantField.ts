// src/shared/consonantField.ts
// Safe consonant field builder for the adapter + UI.
// If there is no primary path, we just return an "empty" field instead of crashing.

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
};

export type ConsonantSummary = {
  windowCount: number;
  hopCount: number;
};

export function buildConsonantField(
  payload: EnginePayload,
  path: any
): { field: ConsonantField; summary: ConsonantSummary } {
  if (!path || !path.voicePath) {
    const empty = {
      clusters: [],
      windowCount: 0,
      hopCount: 0,
    };
    return { field: empty, summary: { windowCount: 0, hopCount: 0 } };
  }

  const windows = payload?.windows ?? [];
  const windowClasses = payload?.windowClasses ?? [];

  const voicePath = path?.voicePath ?? [];
  const ringPath = path?.ringPath ?? [];

  const clusters: ConsonantClusterField[] = windows.map(
    (cluster: string, idx: number) => ({
      cluster,
      classes: windowClasses[idx] ? [windowClasses[idx] as string] : [],
      orbitSlots: [],
      harmonyScore: 0,
    })
  );

  const hopCount = Math.max(voicePath.length - 1, 0);

  const field: ConsonantField = {
    clusters,
    windowCount: clusters.length,
    hopCount,
  };

  const summary: ConsonantSummary = {
    windowCount: clusters.length,
    hopCount,
  };

  return { field, summary };
}
