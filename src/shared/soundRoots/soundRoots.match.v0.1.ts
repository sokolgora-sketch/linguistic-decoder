// src/shared/soundRoots/soundRoots.match.v0.1.ts
import { SOUND_ROOTS_V0_1 } from "./soundRoots.lexicon.v0.1";

export type SoundRootMatchV0_1 = Readonly<{
  id: string;
  cluster: string;
  at: number; // index in normalized string
  domain: string;
  gloss: string;
  strength: string;
}>;

function normV0_1(s: string): string {
  // Keep diacritics (ë etc). No fuzzy transforms in v0.1.
  // Deterministic: NFC + lower + trim.
  return (s ?? "").normalize("NFC").toLocaleLowerCase().trim();
}

/**
 * Deterministic matching rules (v0.1):
 * - substring match only
 * - lexicon order determines output order
 * - one match per root: choose longest cluster; tie -> earliest index; tie -> earliest cluster order
 */
export function matchSoundRootsV0_1(word: string): SoundRootMatchV0_1[] {
  const w = normV0_1(word);
  if (!w) return [];

  const out: SoundRootMatchV0_1[] = [];

  for (const sr of SOUND_ROOTS_V0_1) {
    let best: { cluster: string; at: number; len: number; order: number } | null = null;

    for (let i = 0; i < sr.clusters.length; i++) {
      const c0 = sr.clusters[i];
      const c = normV0_1(c0);
      if (!c) continue;

      const at = w.indexOf(c);
      if (at < 0) continue;

      const len = c.length;

      if (!best) {
        best = { cluster: c0, at, len, order: i };
        continue;
      }

      if (len > best.len) {
        best = { cluster: c0, at, len, order: i };
        continue;
      }

      if (len === best.len && at < best.at) {
        best = { cluster: c0, at, len, order: i };
        continue;
      }

      if (len === best.len && at === best.at && i < best.order) {
        best = { cluster: c0, at, len, order: i };
        continue;
      }
    }

    if (best) {
      out.push({
        id: sr.id,
        cluster: best.cluster,
        at: best.at,
        domain: sr.domain,
        gloss: sr.gloss,
        strength: sr.strength,
      });
    }
  }

  return out;
}
