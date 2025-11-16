
export type Alphabet = "auto"|"albanian"|"latin"|"sanskrit"|"ancient_greek"|"pie";

const ALB_CUES = /[ëç]|gj|xh|ll|rr|nj|zh|sh|dh|th|q|shq|vend|vet/i;

export function autoDetectAlphabet(word: string, selected: Alphabet): Alphabet {
  if (selected !== "auto") return selected;
  const w = word.normalize("NFC");
  if (ALB_CUES.test(w)) return "albanian";
  return "latin"; // safe fallback for ASCII
}
