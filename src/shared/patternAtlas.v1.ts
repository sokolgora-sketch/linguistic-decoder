export type Voice = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";
export type PatternPolarity = "centrifugal" | "centripetal" | "orbital";

export type PatternAtlasClassification = {
  raw: string;
  normalized: string;   // e.g. "O → E" or "E"
  voices: Voice[];
  steps: number;        // voices.length - 1
  from: Voice;
  to: Voice;
  ringFrom: 0 | 1 | 2 | 3;
  ringTo: 0 | 1 | 2 | 3;
  ringDelta: number;    // ringTo - ringFrom
  polarity: PatternPolarity;
  label: string;
  summary: string;
};

const VOICE_SET = new Set<Voice>(["A", "E", "I", "O", "U", "Y", "Ë"]);

export function ringOf(v: Voice): 0 | 1 | 2 | 3 {
  // Heart rings (canonical):
  // 0: O (mediator)
  // 1: I/U (inner)
  // 2: E/Y (middle)
  // 3: A/Ë (outer)
  switch (v) {
    case "O":
      return 0;
    case "I":
    case "U":
      return 1;
    case "E":
    case "Y":
      return 2;
    case "A":
    case "Ë":
      return 3;
  }
}

export function parseVoicePath(raw: string): Voice[] {
  const s = String(raw ?? "").trim();
  if (!s) return [];

  // Uppercase so "ë" becomes "Ë" reliably.
  const upper = s.toUpperCase();

  const matches = upper.match(/[AEIOUYË]/g) ?? [];
  const voices: Voice[] = [];
  for (const m of matches) {
    const v = m as Voice;
    if (VOICE_SET.has(v)) voices.push(v);
  }
  return voices;
}

export function normalizeVoicePath(raw: string): string {
  const voices = parseVoicePath(raw);
  if (voices.length === 0) return "";
  if (voices.length === 1) return voices[0];
  return voices.join(" → ");
}

export function classifyVoicePath(raw: string): PatternAtlasClassification {
  const voices = parseVoicePath(raw);
  if (voices.length === 0) {
    throw new Error("patternAtlas.v1: cannot classify empty voice path");
  }

  const from = voices[0];
  const to = voices[voices.length - 1];
  const ringFrom = ringOf(from);
  const ringTo = ringOf(to);
  const ringDelta = ringTo - ringFrom;

  const steps = Math.max(0, voices.length - 1);

  const polarity: PatternPolarity =
    steps === 0 ? "orbital" : ringDelta > 0 ? "centrifugal" : ringDelta < 0 ? "centripetal" : "orbital";

  const normalized = normalizeVoicePath(raw);

  const label =
    steps === 0
      ? `Single voice (${from})`
      : polarity === "centrifugal"
        ? "Outward move"
        : polarity === "centripetal"
          ? "Inward move"
          : "Same-ring move";

  const summary =
    steps === 0
      ? `Static on ring ${ringFrom}.`
      : `Moves ${polarity} from ring ${ringFrom} to ring ${ringTo} (${from} → ${to}).`;

  return {
    raw: String(raw ?? ""),
    normalized,
    voices,
    steps,
    from,
    to,
    ringFrom,
    ringTo,
    ringDelta,
    polarity,
    label,
    summary,
  };
}
