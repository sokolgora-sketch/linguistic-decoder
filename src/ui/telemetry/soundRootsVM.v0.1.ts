// SoundRoots VM adapter (v0.1.x)
// Goal: stable, defensive, never-throw VM for UI consumption.
// Accepts either full payload ({ deepRoot: { soundRoots: ... } }) or deepRoot ({ soundRoots: ... }) or raw soundRoots object.

import type { PresentOrMissing, SoundRootsMatchVM, SoundRootsVM, SoundRootsWarningVM } from "./types";

type MissingState = "not_emitted" | "malformed" | "unknown";

function present<T>(value: T): PresentOrMissing<T> {
  return { kind: "present", value };
}
function missing(m: MissingState, note: string): PresentOrMissing<never> {
  return { kind: "missing", missing: m as any, note };
}

function isPlainObject(v: unknown): v is Record<string, any> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}
function asString(v: unknown): string | undefined {
  return typeof v === "string" && v.length ? v : undefined;
}
function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  const out: string[] = [];
  for (const x of v) if (typeof x === "string" && x.length) out.push(x);
  return out;
}
function uniqSorted(xs: readonly string[]): string[] {
  return Array.from(new Set(xs.filter((x) => typeof x === "string" && x.length))).sort();
}

function adaptWarnings(raw: unknown): SoundRootsWarningVM[] {
  if (!Array.isArray(raw)) return [];
  const out: SoundRootsWarningVM[] = [];
  for (const w of raw) {
    if (!isPlainObject(w)) continue;
    const code = asString((w as any).code);
    const domain = asString((w as any).domain);
    if (!code || !domain) continue;
    out.push({ code, domain });
  }
  return out;
}

function adaptMatches(raw: unknown): SoundRootsMatchVM[] {
  if (!Array.isArray(raw)) return [];
  const out: SoundRootsMatchVM[] = [];
  for (const m of raw) {
    if (typeof m === "string") {
      out.push({ domain: m });
      continue;
    }
    if (!isPlainObject(m)) continue;

    const domain =
      asString((m as any).domain) ??
      asString((m as any).id) ??
      asString((m as any).token) ??
      asString((m as any).key);

    if (!domain) continue;

    const root =
      asString((m as any).root) ??
      asString((m as any).rootId) ??
      asString((m as any).soundRoot);

    const carrier =
      asString((m as any).carrier) ??
      asString((m as any).carrierForm) ??
      asString((m as any).form) ??
      asString((m as any).word);

    const gloss =
      asString((m as any).gloss) ??
      asString((m as any).meaning) ??
      asString((m as any).hint);

    const note = asString((m as any).note);

    out.push({ domain, root, carrier, gloss, note });
  }
  return out;
}

function pickSoundRootsObject(input: unknown): unknown {
  if (!isPlainObject(input)) return null;

  // full payload: { deepRoot: { soundRoots } }
  if ("deepRoot" in input && isPlainObject((input as any).deepRoot)) {
    const dr = (input as any).deepRoot;
    if ("soundRoots" in dr) return (dr as any).soundRoots;
  }

  // deepRoot object: { soundRoots }
  if ("soundRoots" in input) return (input as any).soundRoots;

  // raw-ish soundRoots object
  const looksLike =
    "domains" in input ||
    "claimedDomains" in input ||
    "missingDomains" in input ||
    "warnings" in input ||
    "matches" in input;

  return looksLike ? input : null;
}

export function adaptSoundRootsToVM(input: unknown): PresentOrMissing<SoundRootsVM> {
  try {
    if (input == null) return missing("not_emitted", "soundRoots");

    const sr = pickSoundRootsObject(input);
    if (sr == null) return missing("not_emitted", "soundRoots");
    if (sr == null) return missing("not_emitted", "soundRoots");
    if (!isPlainObject(sr)) return missing("malformed", "soundRoots (expected object)");

    const domains = uniqSorted(asStringArray((sr as any).domains));
    const claimedDomains = uniqSorted(asStringArray((sr as any).claimedDomains));
    const missingDomains = uniqSorted(asStringArray((sr as any).missingDomains));

    const warnings = adaptWarnings((sr as any).warnings);
    const matches = adaptMatches((sr as any).matches);

    return present({
      domains,
      claimedDomains,
      missingDomains,
      warnings,
      matches,
    });
  } catch (e) {
    return missing("unknown", `soundRoots adapter threw (caught): ${String(e)}`);
  }
}
