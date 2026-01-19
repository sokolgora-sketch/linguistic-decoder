

// RootMap VM adapter (v0.1.x)
// Goal: stable, defensive, never-throw VM for UI consumption.

export type MissingReason = "not_emitted" | "malformed" | "unknown";

export type MissingDetailCode =
  | "NULL_INPUT"
  | "NOT_OBJECT"
  | "NO_ROOTMAP_SHAPE"
  | "ABSENT_ROOTMAP"
  | "UNKNOWN_ERROR";

export type Present<T> = { kind: "present"; value: T };
export type Missing = {
  kind: "missing";
  missing: MissingReason;
  note?: string;
  // v0.1.x: deterministic, UI-friendly explanation for why it's missing
  detailCode?: MissingDetailCode;
  detail?: string;
};
export type Maybe<T> = Present<T> | Missing;

export type RootMapTokenVM = {
  token: string;
  role?: string;
  vowel_path?: string;
};

export type RootMapKeyVM = {
  token: string;
  language?: string;
  gloss?: string;
  status?: string;
  ops?: string[];
  evidence?: string[];
};

export type RootMapCarrierVM = {
  token: string;
  language?: string;
  carrierForm?: string;
  note?: string;
};

export type RootMapSpanVM = {
  token: string;
  start?: number;
  end?: number;
  source?: string;
  note?: string;
};

export type RootMapVM = {
  tokens: RootMapTokenVM[];
  keys: RootMapKeyVM[];
  carriers: RootMapCarrierVM[];
  spans: RootMapSpanVM[];
  composedMeaning?: string;
};

function isPlainObject(v: unknown): v is Record<string, any> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function asNumber(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

function asStringArray(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out: string[] = [];
  for (const x of v) if (typeof x === "string") out.push(x);
  return out.length ? out : [];
}

function missing(
  missingReason: MissingReason,
  detailCode: MissingDetailCode,
  detail: string,
  note?: string
): Missing {
  return { kind: "missing", missing: missingReason, detailCode, detail, note };
}

export function adaptRootMapToVM(input: unknown): Maybe<RootMapVM> {
  try {
    if (input == null) {
      return missing("not_emitted", "NULL_INPUT", "RootMap not emitted (null/undefined input).");
    }
    if (!isPlainObject(input)) {
      return missing("malformed", "NOT_OBJECT", "RootMap payload malformed (expected object).");
    }

    // Accept either the full payload ({ rootMap: {...} }) or a raw rootMap object.
    // IMPORTANT: If input is a full payload WITHOUT rootMap, return missing:not_emitted.
    // Only treat input as a raw rootMap when it actually looks like one.
    const hasRootMapKey = "rootMap" in input;
    const looksLikeRootMap =
      "tokens" in input ||
      "keys" in input ||
      "spans" in input ||
      "carriers" in input ||
      "composedMeaning" in input;

    if (!hasRootMapKey && !looksLikeRootMap) {
      return missing(
        "not_emitted",
        "NO_ROOTMAP_SHAPE",
        "RootMap not emitted (payload does not include rootMap or rootMap-shaped fields)."
      );
    }

    const rootMap = hasRootMapKey ? (input as any).rootMap : input;
    if (rootMap == null) {
      return missing("not_emitted", "ABSENT_ROOTMAP", "RootMap not emitted (rootMap is null/undefined).");
    }
    if (!isPlainObject(rootMap)) {
      return missing("malformed", "NOT_OBJECT", "RootMap payload malformed (rootMap is not an object).");
    }

    const tokensRaw = (rootMap as any).tokens;
    const keysRaw = (rootMap as any).keys;
    const carriersRaw = (rootMap as any).carriers;
    const spansRaw = (rootMap as any).spans;

    const tokens: RootMapTokenVM[] = [];
    if (Array.isArray(tokensRaw)) {
      for (const t of tokensRaw) {
        if (!isPlainObject(t)) continue;
        const token = asString((t as any).token);
        if (!token) continue;
        tokens.push({
          token,
          role: asString((t as any).role),
          vowel_path: asString((t as any).vowel_path),
        });
      }
    }

    const keys: RootMapKeyVM[] = [];
    if (Array.isArray(keysRaw)) {
      for (const k of keysRaw) {
        if (!isPlainObject(k)) continue;
        const token = asString((k as any).token);
        if (!token) continue;
        keys.push({
          token,
          language: asString((k as any).language),
          gloss: asString((k as any).gloss),
          status: asString((k as any).status),
          ops: asStringArray((k as any).ops),
          evidence: asStringArray((k as any).evidence),
        });
      }
    }

    const carriers: RootMapCarrierVM[] = [];
    if (Array.isArray(carriersRaw)) {
      for (const c of carriersRaw) {
        if (!isPlainObject(c)) continue;
        const token = asString((c as any).token);
        if (!token) continue;
        carriers.push({
          token,
          language: asString((c as any).language),
          carrierForm: asString((c as any).carrierForm),
          note: asString((c as any).note),
        });
      }
    }

    const spans: RootMapSpanVM[] = [];
    if (Array.isArray(spansRaw)) {
      for (const s of spansRaw) {
        if (!isPlainObject(s)) continue;
        const token = asString((s as any).token);
        if (!token) continue;
        spans.push({
          token,
          start: asNumber((s as any).start),
          end: asNumber((s as any).end),
          source: asString((s as any).source),
          note: asString((s as any).note),
        });
      }
    }

    const composedMeaning = asString((rootMap as any).composedMeaning);

    return {
      kind: "present",
      value: {
        tokens,
        keys,
        carriers,
        spans,
        composedMeaning,
      },
    };
  } catch (e) {
    return missing(
      "unknown",
      "UNKNOWN_ERROR",
      "RootMap adapter threw unexpectedly (caught).",
      String(e)
    );
  }
}

// Compatibility alias for tests / callers
export const rootMapMaybe = adaptRootMapToVM;
