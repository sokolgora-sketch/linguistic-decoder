// src/shared/deepRoot.rootMap.builder.v1.ts
//
// DeepRoot RootMap v0.1 — Functional Key Decoder
// Deterministic builder: chooses the first min-root hypothesis (stable order).
//
// Inputs are *already* curated by:
// - segmenter.v1
// - carrierMatcher.v1
// - protoRoots.v1 (curated truth table)
//
// No scoring. No ranking language wars. Just: tokens + keys + composed meaning.

import type { MinRootHypothesis } from "./deepRoot.minRoots.v1";
import type {
  RootMapV1,
  RootTokenRoleV1,
  RootTokenV1,
  RootKeyV1,
  RootCarrierV1,
  RootKeyStatusV1,
  RootSpanV1,
} from "./deepRoot.rootMap.v1";
import { getProtoRootV1 } from "./protoRoots.v1";
import { extractSevenVowelsFromString } from "@/shared/math7.core";

function roleHintToTokenRole(roleHint?: string): RootTokenRoleV1 {
  switch (roleHint) {
    case "Action":
      return "action";
    case "Function":
    case "Instrument":
      return "instrument";
    case "Unit":
    case "Result":
      return "unit";
    case "Modifier":
      return "modifier";
    default:
      return "unknown";
  }
}


function lastVowelFromAnyPath(v: unknown): string | null {
  // Accept: ["U","I"], "U-I", "U→I", "UI"
  if (Array.isArray(v)) {
    const last = v[v.length - 1];
    const s = String(last ?? "").toUpperCase();
    return s && /^[AEIOUYË]$/.test(s) ? s : null;
  }
  const s = String(v ?? "").toUpperCase();
  const m = extractSevenVowelsFromString(String(s ?? ""));
  if (!m || m.length === 0) return null;
  return m[m.length - 1] ?? null;
}

function hypothesisTerminalVowel(h: any): string | null {
  // Prefer decomposition.function if present; else use last protoRoot vowel.
  const func = h?.decomposition?.function;
  const fromFunc = func ? lastVowelFromAnyPath(func) : null;
  if (fromFunc) return fromFunc;

  const roots = Array.isArray(h?.protoRoots) ? h.protoRoots : [];
  if (!roots.length) return null;
  return lastVowelFromAnyPath(roots[roots.length - 1]);
}

function extractVowelPath(s: string): string | undefined {
  // Keep it simple + deterministic: uppercase, scan for the canonical vowels.
  const up = String(s ?? "").toUpperCase();
  const m = extractSevenVowelsFromString(String(up ?? ""));
  if (!m || m.length === 0) return undefined;
  return m.join("-");
}

function keyStatusForCarrier(
  carrier: { lang?: string; ops?: string[] } | null,
  carrierGloss?: string,
  carrierNotes?: string,
): RootKeyStatusV1 {
  if (!carrier) return "speculative";

  const text = `${carrierGloss ?? ""} ${carrierNotes ?? ""}`.toLocaleLowerCase("en-US");

  if (text.includes("gheg") || text.includes("dialect attestation")) {
    return "dialect_attested_pending_review";
  }

  if (text.includes("weak")) {
    return "carrier_only";
  }

  return "supported";
}

function buildSpansOrNull(params: {
  basis: string;
  protoRoots: string[];
  carriers: any[]; // upstream may include segment, but TS type may not
}): RootSpanV1[] | null {
  const basis = String(params.basis ?? "");
  const basisLower = basis.toLowerCase();
  if (!basisLower) return null;

  // Need a segment for every protoRoot (all-or-nothing).
  const segmentsByRoot = new Map<string, string>();
  for (const r of params.protoRoots) {
    const hit = Array.isArray(params.carriers)
      ? params.carriers.find((c) => c && c.protoRootId === r)
      : null;

    const seg = String(hit?.segment ?? "").trim();
    if (!seg) return null;
    segmentsByRoot.set(r, seg);
  }

  const spans: RootSpanV1[] = [];
  let cursor = 0;

  for (const r of params.protoRoots) {
    const seg = segmentsByRoot.get(r);
    if (!seg) return null;

    const segLower = seg.toLowerCase();

    // Deterministic cursor walk: search from cursor only.
    const idx = basisLower.indexOf(segLower, cursor);

      // v0.1 spans policy (deterministic):
      // - normal case: segment must be found left-to-right within basis
      // - special-case: if the *final* segment is not found, allow an "implied trailing"
      //   span at the current cursor. This supports decompositions where a final unit
      //   marker is conceptually present but not literally present in the surface basis.
      if (idx < 0) {
        const isLast = r === params.protoRoots[params.protoRoots.length - 1];
        const isSingleChar = segLower.length === 1;
        if (!isLast || !isSingleChar) return null;

        const start = cursor;
        const end = cursor + 1;

        {
      const span: any = { token: r, start, end, source: "surface" };
        // implied trailing span: do not emit note
        spans.push(span);
}

        cursor = end;
        continue;
      }
    const start = idx;
    const end = idx + seg.length;

    // note policy: emit when segment differs from token (case-sensitive)
    const note = seg !== String(r) ? `segment=${segLower}` : undefined;

    // Enforce left-to-right monotonicity.
    if (start < cursor) return null;

    // Optional note: only when segment meaningfully differs from token (case-insensitive).

    {
      const span: any = { token: r, start, end, source: "surface" };
      if (note) span.note = note;
      spans.push(span);
    }

    cursor = end;
  }

  return spans.length > 0 ? spans : null;
}

export function buildRootMapV1(params: {
basis: string;
  minRoots: MinRootHypothesis[] | null | undefined;
  heartPrimaryPath?: unknown; // optional: prefer Heart-aligned hypothesis
}): RootMapV1 | null {
  const basis = String(params.basis ?? "").trim();
  const minRoots = Array.isArray(params.minRoots) ? params.minRoots : [];

  if (!basis) return null;
  if (minRoots.length === 0) {
    return {
      tokens: [],
      keys: [],
      composedMeaning: "",
      notes: ["No minRoots hypotheses available; RootMap not emitted."],
    };
  }


  // Deterministic choice (v0.1.1):


  // Prefer the first hypothesis whose terminal vowel matches Heart primary terminal vowel.


  // Fallback: first hypothesis (stable order).


  const heartTerm = lastVowelFromAnyPath(params.heartPrimaryPath);


  const h =


    (heartTerm


      ? (minRoots.find((hh) => hypothesisTerminalVowel(hh) === heartTerm) ?? minRoots[0])


      : minRoots[0]);

const tokens: RootTokenV1[] = [];
  const keys: RootKeyV1[] = [];
  const carriersOut: RootCarrierV1[] = [];

  for (let i = 0; i < h.protoRoots.length; i++) {
    const protoRootId = h.protoRoots[i];
    const proto = getProtoRootV1(protoRootId);

    const chosenCarrier =
      Array.isArray(h.carriers) ? h.carriers.find((c) => c.protoRootId === protoRootId) : null;

    const role: RootTokenRoleV1 = proto?.roleHint
      ? roleHintToTokenRole(proto.roleHint)
      : // fallback: use derived decomposition hints if proto is missing
        (i === 0 && h.decomposition?.action ? "action" : "unknown");

    const token: RootTokenV1 = {
      token: protoRootId,
      role,
      vowel_path: extractVowelPath(protoRootId),
    };
    tokens.push(token);

    // Build key entry (the “explainer”)
    const gloss = proto?.gloss ?? "unknown";
    const language = String(chosenCarrier?.lang ?? "unknown");
    const carrierForm = String(chosenCarrier?.carrierForm ?? "");
    const ops = Array.isArray(chosenCarrier?.ops) ? chosenCarrier!.ops : [];

    const evidence: string[] = [];

    // Keep evidence short bullets, no essays.
    if (carrierForm) evidence.push(`${language}: ${carrierForm}`);
    if (ops.length > 0) evidence.push(`ops: ${ops.join(", ")}`);

    const protoCarrierHit =
      proto?.carriers && carrierForm
        ? proto.carriers.find((c) => c.lang === chosenCarrier?.lang && c.form === carrierForm)
        : undefined;

    if (protoCarrierHit?.gloss) evidence.push(`gloss: ${protoCarrierHit.gloss}`);
    const shouldExposeCarrierNote =
      protoCarrierHit?.notes &&
      /dialect attestation|gheg|weak|homophone|do not use/i.test(protoCarrierHit.notes);
    if (shouldExposeCarrierNote) evidence.push(`note: ${protoCarrierHit.notes}`);

    const status: RootKeyStatusV1 = keyStatusForCarrier(
      chosenCarrier ?? null,
      protoCarrierHit?.gloss,
      protoCarrierHit?.notes,
    );

    keys.push({
      token: protoRootId,
      language,
      gloss,
      evidence: evidence.length > 0 ? evidence : ["No carrier evidence (speculative)."],
      status,
      ops: ops.length > 0 ? ops : undefined,
    });

    // Optional carriers list (secondary “carriers”, not keys)
    if (proto?.carriers) {
      for (const c of proto.carriers) {
        // Don’t duplicate the chosen carrier; RootMap keys already cover it.
        if (c.lang === chosenCarrier?.lang && c.form === carrierForm) continue;
        carriersOut.push({
          token: protoRootId,
          language: c.lang,
          carrierForm: c.form,
          note: c.gloss ? `gloss: ${c.gloss}` : undefined,
        });
      }
    }
  }

  const composedMeaning = tokens
    .map((t) => {
      const proto = getProtoRootV1(t.token);
      return proto?.gloss ?? t.token;
    })
    .filter(Boolean)
    .join(" + ");

  const notes: string[] = [];
  if (!h.checks?.opsWithinLimits) notes.push("Hypothesis opsWithinLimits=false (unexpected); check upstream guardrails.");
  if (!h.checks?.skeletonExplained) notes.push("Hypothesis skeletonExplained=false (unexpected); check upstream guardrails.");

  // Spans: only emit if we can do it deterministically (all-or-nothing).
  const spans = buildSpansOrNull({
    basis,
    protoRoots: h.protoRoots,
    carriers: Array.isArray(h.carriers) ? (h.carriers as any[]) : [],
  });

  return {
    tokens,
    keys,
    carriers: carriersOut.length > 0 ? carriersOut : undefined,
    spans: spans ?? undefined,
    composedMeaning,
    notes: notes.length > 0 ? notes : undefined,
  };
}
