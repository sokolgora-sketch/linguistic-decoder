/**
 * IPA Normalize v0.1
 * Deterministic, minimal cleanup for downstream scanning/classification.
 * IMPORTANT: must NOT strip combining marks like U+0329 (syllabic mark).
 */
export function normalizeIpaV0_1(raw: unknown): string {
  if (typeof raw !== "string") return "";
  let s = raw.trim();

  // strip common wrappers: /.../  [...]  (...)
  // only if they wrap the full string
  if (
    (s.startsWith("/") && s.endsWith("/")) ||
    (s.startsWith("[") && s.endsWith("]")) ||
    (s.startsWith("(") && s.endsWith(")"))
  ) {
    s = s.slice(1, -1).trim();
  }

  // normalize unicode to make combining marks explicit and stable
  s = s.normalize("NFD");

  // remove suprasegmentals + separators that should not affect nucleus physics
  // (keep combining marks \p{M} intact)
  const DROP = new Set([
    "ˈ", // primary stress
    "ˌ", // secondary stress
    "ː", // length
    "ˑ", // half-length
    ".", // syllable break
    "‿", // liaison
    "|", // prosodic break
    "‖",
    " ", // whitespace
    "\t",
    "\n",
    "\r",
  ]);

  let out = "";
  for (const ch of s) {
    if (DROP.has(ch)) continue;
    out += ch;
  }

  return out;
}
