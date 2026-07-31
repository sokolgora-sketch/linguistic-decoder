// src/shared/heartPrimaryPathForRootMap.v0.1.2.ts
//
// Select the first real upstream Heart path using stable field precedence.
//
// Canonical Seven-Voices paths are passed through unchanged.
// Candidate transformations such as y_to_i belong to candidate/carrier
// evidence and must not silently rewrite the authoritative Heart path.

export function pickHeartPrimaryPathForRootMap(payload: any): unknown {
  const p = payload ?? {};

  const candidates: unknown[] = [
    p?.primaryPath?.voicePath,
    p?.primaryPath?.vowels,
    p?.evidence?.math7?.primary?.vowels,
    p?.evidence?.math7?.primary?.voicePath,
    p?.heart?.math7?.primary?.vowels,
    p?.heart?.math7?.primary?.voicePath,
    p?.heart?.math7?.primary?.vowelPath,
    p?.math7_summary?.path,
    p?.stress_test_v1?.voicePathRaw,
    p?.stress_test_v1?.voicePath,
    p?.stress_test_v1?.ui?.voicePath,
  ];

  return candidates.find((candidate) => candidate != null);
}
