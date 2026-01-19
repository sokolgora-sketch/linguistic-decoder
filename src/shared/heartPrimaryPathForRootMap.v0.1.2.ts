// src/shared/heartPrimaryPathForRootMap.v0.1.2.ts
//
// v0.1.2 — Heart-primary RootMap audit hint.
// Goal: provide buildRootMapV1 a usable heartPrimaryPath even when payload shape differs,
// and apply a constrained terminal-Y→I hint under strict mode for words ending in 'y'.
//
// This does NOT rewrite the word. It only affects RootMap hypothesis selection.

function lastVowelFromAnyPath(v: unknown): string | null {
  if (Array.isArray(v)) {
    const last = v[v.length - 1];
    const s = String(last ?? "").toUpperCase();
    return s && /^[AEIOUYË]$/.test(s) ? s : null;
  }
  const s = String(v ?? "").toUpperCase();
  const m = s.match(/[AEIOUYË]/g);
  if (!m || m.length === 0) return null;
  return m[m.length - 1] ?? null;
}

function replaceTerminalVowelWithI(v: unknown): unknown {
  // Preserve array type when possible.
  if (Array.isArray(v) && v.length > 0) {
    const out = v.slice();
    out[out.length - 1] = "I";
    return out;
  }

  const s = String(v ?? "");
  if (!s) return v;

  // Replace only the LAST vowel occurrence if it's Y.
  const up = s.toUpperCase();
  const vowels = up.match(/[AEIOUYË]/g);
  if (!vowels || vowels.length === 0) return v;

  const last = vowels[vowels.length - 1];
  if (last !== "Y") return v;

  const idx = up.lastIndexOf("Y");
  if (idx < 0) return v;

  return s.slice(0, idx) + "I" + s.slice(idx + 1);
}

function pickMode(p: any): string {
  // Current payloads: top-level `mode` exists (your probe shows it as a key).
  // But be defensive across versions.
  const m =
    (typeof p?.mode === "string" ? p.mode : p?.mode?.mode) ??
    p?.engine_meta?.mode ??
    p?.engineMeta?.mode ??
    p?.meta?.mode ??
    undefined;

  return String(m ?? "").toLowerCase();
}

function pickWord(p: any): string {
  // Current payloads: top-level `word` exists (your probe shows it as a key).
  const w =
    p?.word ??
    p?.basis ??
    p?.sanitized ??
    p?.sanitizedWord ??
    p?.normalizedWord ??
    undefined;

  return String(w ?? "");
}

export function pickHeartPrimaryPathForRootMap(payload: any): unknown {
  const p = payload ?? {};

  // Try canonical-ish fields first (if they exist in some engine versions)
  const candidates: unknown[] = [
    p?.primaryPath?.voicePath,
    p?.primaryPath?.vowels,
    p?.evidence?.math7?.primary?.vowels,
    p?.evidence?.math7?.primary?.voicePath,
    p?.heart?.math7?.primary?.vowels,
    p?.heart?.math7?.primary?.voicePath,
    p?.heart?.math7?.primary?.vowelPath,

    // Observed in your current payloads (study strict):
    p?.math7_summary?.path,
    p?.stress_test_v1?.voicePathRaw,
    p?.stress_test_v1?.voicePath,
    p?.stress_test_v1?.ui?.voicePath,
  ];

  const heartPath = candidates.find((x) => x != null);
  if (heartPath == null) return undefined;

  // Constrained hint (v0.1.2):
  // If strict mode and word ends with 'y', treat terminal Y as I-family for RootMap selection.
  const mode = pickMode(p);
  const word = pickWord(p);

  const term = lastVowelFromAnyPath(heartPath);
  const endsWithY = /y$/i.test(word);

  if (mode === "strict" && endsWithY && term === "Y") {
    return replaceTerminalVowelWithI(heartPath);
  }

  return heartPath;
}
