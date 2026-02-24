// Schwa Shield Transform v0.1
// Deterministic IPA normalization lens for Albanian research probes.
//
// IMPORTANT:
// - This is not a claim about any dialect. It is a controlled perturbation ("ablation").
// - We intentionally keep the rules minimal and versioned.
// - Scope: just enough to reproduce the Geg-sim probe behavior used in v0.1.
//
// Rules v0.1:
// 1) Prefix schwa drop for për-:
//    - /pəɾ.../  -> /pɾ.../
//    - /pər.../  -> /pr.../
// 2) Terminal schwa drop:
//    - ...ə/ -> .../
//
// Notes:
// - We do NOT try to be a full phonology engine.
// - We do NOT change stress markers or other vowels.
// - We keep output as an IPA string with surrounding slashes.

export function applySchwaDropV0_1(ipa: string): string {
  let s = String(ipa ?? "").trim();
  if (!s) return s;

  // Normalize: require surrounding slashes to be present, otherwise leave as-is.
  if (!(s.startsWith("/") && s.endsWith("/"))) return s;

  // Rule 1: për- prefix schwa drop (first occurrence only, after the initial '/')
  // /pəɾ/ -> /pɾ/ and /pər/ -> /pr/
  s = s.replace(/^\/pə([rɾ])/, "/p$1");
  s = s.replace(/^\/pər/, "/pr");

  // Rule 2: terminal schwa drop: ...ə/ -> .../
  s = s.replace(/ə\/$/, "/");

  return s;
}
