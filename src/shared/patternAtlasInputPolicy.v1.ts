import { parseVoicePath, type Voice } from "./patternAtlas.v1";

export type StressInputPolicyV1 = {
  strictInput: boolean;
};

export function extractVoicesForStressTestV1(
  raw: string,
  policy: StressInputPolicyV1
): Voice[] {
  const s = String(raw ?? "");

  // Legacy behavior: treat any text as parseable (includes y => Y).
  if (!policy?.strictInput) {
    return parseVoicePath(s);
  }

  // STRICT behavior:
  // - Must contain at least one of the seven voice letters (case-insensitive).
  // - Any other alphabetic letters besides AEIOUYË makes it invalid.
  const hasAnyVoiceLetter = /[AEIOUYË]/i.test(s);
  if (!hasAnyVoiceLetter) return [];

  // Strip separators/punctuation/digits/spaces; keep only letters for legality check.
  const stripped = s
    .replace(/[0-9\s]/g, "")
    .replace(/[→\-\_,;:|/\\()\[\]{}.'"!?+=<>]/g, "");

  // If anything remains besides the seven vowels, reject.
  const illegal = stripped.replace(/[AEIOUYË]/gi, "");
  if (illegal.length > 0) return [];

  // Otherwise, parse normally (handles arrows/spaces, etc.)
  return parseVoicePath(s);
}
