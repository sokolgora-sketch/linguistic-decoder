/**
 * RootFamily v1
 * Minimal + deterministic. This module exists because DeepRoot output builder
 * optionally attaches "rootFamilies" to deepRoot output.
 *
 * Design goals:
 * - Never throw (adapter must not 500 because a helper failed).
 * - Deterministic: same inputs => same output.
 * - Conservative: return [] unless a clear, safe mapping exists.
 *
 * IMPORTANT:
 * This is NOT the "deepRoot hypothesis engine". It's a light classifier/aggregator.
 */

export type RootFamilyId = string;

export type RootFamilyCarrierV1 = {
  lang: string;        // e.g. "sq", "en", "la", "grc"
  form: string;        // surface form or carrier
  gloss?: string;      // optional
  ops?: string[];      // allowed ops used
};

export type RootFamilyProtoRootV1 = {
  root: string;        // e.g. "DA", "DI", "SHTU"
  function?: string;   // short functional hint
};

export type RootFamilyV1 = {
  id: RootFamilyId;
  label: string;
  protoRoots: RootFamilyProtoRootV1[];
  carriers: RootFamilyCarrierV1[];
  notes?: string[];
};

/**
 * These are intentionally loose "input shapes" so this module doesn't depend
 * on deepRoot/analysis types (prevents circular imports).
 */
type AnyBasis = Record<string, any>;
type AnyDeepRoot = Record<string, any> | null | undefined;

/**
 * Build root families from (basis, deepRoot) in a defensive way.
 * Returns [] if the needed inputs aren't present.
 */
export function buildRootFamiliesV1(args: { basis: AnyBasis; deepRoot: AnyDeepRoot }): RootFamilyV1[] {
  try {
    const { basis, deepRoot } = args;
    if (!deepRoot || typeof deepRoot !== "object") return [];

    // We support two sources:
    // 1) deepRoot.hypotheses (DR5 structure) where each hypothesis has protoRoots and carriers
    // 2) deepRoot.minRoots / candidates (fallback), but only if they explicitly carry protoRoot ids
    const hyps: any[] = Array.isArray((deepRoot as any).hypotheses) ? (deepRoot as any).hypotheses : [];

    // If hypotheses exist, map them to RootFamily objects.
    if (hyps.length > 0) {
      const families = hyps
        .map((h, idx) => hypothesisToFamily(h, idx))
        .filter(Boolean) as RootFamilyV1[];
      return dedupeFamilies(families);
    }

    // No hypotheses: do not guess families from raw candidates yet.
    // (If we guess here, it becomes non-deterministic and will pollute contracts.)
    return [];
  } catch {
    // Never throw.
    return [];
  }
}

function hypothesisToFamily(h: any, idx: number): RootFamilyV1 | null {
  if (!h || typeof h !== "object") return null;

  // protoRoots can be like ["DA","DI"] or [{root:"DA"}...]
  const protoRootsRaw = h.protoRoots ?? h.proto_roots ?? h.roots ?? null;
  const protoRoots = normalizeProtoRoots(protoRootsRaw);
  if (protoRoots.length === 0) return null;

  // label: prefer explicit, else join roots.
  const label = typeof h.label === "string" && h.label.trim()
    ? h.label.trim()
    : protoRoots.map((p) => p.root).join(" + ");

  const carriersRaw = h.carriers ?? h.carrierLines ?? h.carrier_lines ?? null;
  const carriers = normalizeCarriers(carriersRaw);

  // Stable ID: based on roots + index (index only used when same roots appear twice).
  const id = `family_${protoRoots.map((p) => slug(p.root)).join("_")}_v1_${idx + 1}`;

  const notesArr =
    Array.isArray(h.notes)
      ? h.notes
          .filter((x: any) => typeof x === "string")
          .map((s: string) => s.trim())
          .filter(Boolean)
      : [];

  return {
    id,
    label,
    protoRoots,
    carriers,
    ...(notesArr.length > 0 ? { notes: notesArr } : {}),
  };
}

function normalizeProtoRoots(raw: any): RootFamilyProtoRootV1[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    const out: RootFamilyProtoRootV1[] = [];
    for (const item of raw) {
      if (typeof item === "string" && item.trim()) out.push({ root: item.trim().toUpperCase() });
      else if (item && typeof item === "object" && typeof item.root === "string" && item.root.trim()) {
        out.push({
          root: item.root.trim().toUpperCase(),
          function: typeof item.function === "string" ? item.function : undefined,
        });
      }
    }
    return out;
  }
  if (typeof raw === "string" && raw.trim()) return [{ root: raw.trim().toUpperCase() }];
  return [];
}

function normalizeCarriers(raw: any): RootFamilyCarrierV1[] {
  if (!raw) return [];
  if (!Array.isArray(raw)) return [];

  const out: RootFamilyCarrierV1[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;

    // Accept either {lang,form} or {language,form} etc.
    const lang = pickString(item.lang, item.language, item.iso, item.code);
    const form = pickString(item.form, item.surface, item.word);
    if (!lang || !form) continue;

    const gloss = pickString(item.gloss, item.meaning);
    const ops = Array.isArray(item.ops) ? item.ops.filter((x: any) => typeof x === "string") : undefined;

    out.push({ lang, form, gloss: gloss || undefined, ops });
  }

  return out;
}

function pickString(...vals: any[]): string | null {
  for (const v of vals) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

function dedupeFamilies(fams: RootFamilyV1[]): RootFamilyV1[] {
  const seen = new Set<string>();
  const out: RootFamilyV1[] = [];
  for (const f of fams) {
    const key = f.protoRoots.map((p) => p.root).join("|") + "::" + f.label;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(f);
  }
  return out;
}

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
