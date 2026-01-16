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
} from "./deepRoot.rootMap.v1";
import { getProtoRootV1 } from "./protoRoots.v1";

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

function extractVowelPath(s: string): string | undefined {
  // Keep it simple + deterministic: uppercase, scan for the canonical vowels.
  const up = String(s ?? "").toUpperCase();
  const m = up.match(/[AEIOUYË]/g);
  if (!m || m.length === 0) return undefined;
  return m.join("-");
}

function keyStatusForCarrier(carrier: { lang?: string; ops?: string[] } | null): RootKeyStatusV1 {
  // v0.1 policy:
  // - supported: a concrete carrier match exists (any lang) AND ops are within limits (already checked upstream)
  // - speculative: missing carrier
  if (!carrier) return "speculative";
  return "supported";
}

export function buildRootMapV1(params: {
  basis: string;
  minRoots: MinRootHypothesis[] | null | undefined;
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

  // Deterministic choice: first hypothesis only.
  const h = minRoots[0];

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

    // If we can find the specific carrier gloss in protoRoots, add 1 line (optional).
    if (proto?.carriers && carrierForm) {
      const hit = proto.carriers.find((c) => c.lang === chosenCarrier?.lang && c.form === carrierForm);
      if (hit?.gloss) evidence.push(`gloss: ${hit.gloss}`);
    }

    const status: RootKeyStatusV1 = keyStatusForCarrier(chosenCarrier ?? null);

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

  return {
    tokens,
    keys,
    carriers: carriersOut.length > 0 ? carriersOut : undefined,
    composedMeaning,
    notes: notes.length > 0 ? notes : undefined,
  };
}
