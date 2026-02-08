// src/shared/soundRoots/soundRoots.attach.v0.1.ts
import { matchSoundRootsV0_1 } from "./soundRoots.match.v0.1";

function safeStr(x: unknown): string {
  return typeof x === "string" ? x : "";
}

/**
 * Attach SoundRoots signals into deepRoot output.
 * - No origin logic here; pure string signal layer.
 * - Uses normalized word if available.
 */
export function attachSoundRootsV0_1(result: any): void {
  if (!result || typeof result !== "object") return;

  const deepRoot = (result as any).deepRoot;
  if (!deepRoot || typeof deepRoot !== "object") return;

  const word =
    safeStr((result as any).normalized) ||
    safeStr((result as any).norm) ||
    safeStr((result as any).basis) ||
    safeStr((result as any).word) ||
    safeStr((result as any)?.input?.word);

  if (!word) return;

  const matches = matchSoundRootsV0_1(word);
  (deepRoot as any).soundRoots = { matches };
}
