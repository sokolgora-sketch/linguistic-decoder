// SoundRoots v0.2 — deterministic "nature sound" signals + claim/missing warnings (NOT proof of origin).
import { matchSoundRootsV0_1 } from "./soundRoots.match.v0.1";

type SoundRootsDomainId = string;

export type SoundRootsWarningV0_2 = Readonly<{
  code: "SOUNDROOTS_DOMAIN_CLAIM_UNSUPPORTED";
  domain: SoundRootsDomainId;
}>;

function uniqSorted(xs: readonly string[]): string[] {
  return Array.from(new Set(xs.filter((x) => typeof x === "string" && x.length > 0))).sort();
}

// Deterministic keyword → domain claims.
// IMPORTANT: This reads only from already-emitted DeepRoot gloss text (no AI).
const DOMAIN_KEYWORDS_V0_2: Readonly<Record<SoundRootsDomainId, readonly string[]>> = Object.freeze({
  rain_water: ["rain", "water", "hiss", "drip"],
  water_splash: ["splash", "plop", "pour"],
  wind_air: ["wind", "whoosh", "rustle", "air"],
  silence_wind: ["silence", "hush", "quiet"],
  fire_cook: ["fire", "cook", "sizzle", "fry", "heat"],
  impact_generic: ["impact", "knock", "tap", "hit", "strike"],
  impact_heavy: ["bang", "boom", "slam", "thud", "heavy"],
  break_crack: ["break", "crack", "snap", "split"],
  impact_wood: ["wood", "timber"],
  impact_stone: ["stone", "rock", "clack"],
});

function inferClaimedDomainsV0_2(texts: readonly string[]): string[] {
  const hay = texts
    .filter((t) => typeof t === "string" && t.trim().length > 0)
    .map((t) => t.toLowerCase())
    .join(" | ");

  if (!hay) return [];

  const out: string[] = [];
  for (const [domain, kws] of Object.entries(DOMAIN_KEYWORDS_V0_2)) {
    for (const kw of kws) {
      if (kw && hay.includes(kw)) {
        out.push(domain);
        break;
      }
    }
  }
  return uniqSorted(out);
}

/**
 * Attach SoundRoots signals into deepRoot output.
 * - Writes ONLY under result.deepRoot.soundRoots (no new top-level keys).
 * - Deterministic, stable ordering.
 */
export function attachSoundRootsV0_2(result: any): void {
  const dr = (result as any)?.deepRoot;
  if (!dr || typeof dr !== "object") return;

  const wordRaw =
    (typeof (result as any)?.sanitized === "string" ? (result as any).sanitized : null) ??
    (typeof (result as any)?.word === "string" ? (result as any).word : null) ??
    "";
  const word = String(wordRaw);

  const matches = matchSoundRootsV0_1(word);
  const domains = uniqSorted(matches.map((m: any) => String(m?.domain ?? "")).filter(Boolean));

  const fr = Array.isArray((dr as any)?.functionalRoots) ? (dr as any).functionalRoots : [];
  const glosses = fr
    .map((x: any) => (typeof x?.gloss === "string" ? x.gloss : ""))
    .filter((s: string) => s.trim().length > 0);

  const claimedDomains = inferClaimedDomainsV0_2(glosses);
  const missingDomains = claimedDomains.filter((d) => !domains.includes(d));

  const warnings: SoundRootsWarningV0_2[] = missingDomains.map((d) => ({
    code: "SOUNDROOTS_DOMAIN_CLAIM_UNSUPPORTED",
    domain: d,
  }));

  (dr as any).soundRoots = {
    version: "soundRoots-v0.2",
    matches,
    domains,
    claimedDomains,
    missingDomains,
    warnings,
  };
}
