import { resolveWorldLangNodeId, WORLD_LANGUAGE_TREE_V01 } from "@/shared/worldLanguageTree.v0.1";

export type RootLightReason =
  | "origin_claim_candidate"
  | "rootmap_carrier"
  | "explicit_language"
  | "unknown";

export type RootLight = {
  nodeId: string;
  label: string;
  reason: RootLightReason;
  source: string; // short trace string for audit
};

export type RootLightMapV01 = {
  version: "root_light_map.v0.1";
  lights: RootLight[];
};

function uniqBy<T>(arr: T[], key: (t: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of arr) {
    const k = key(item);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

function nodeLabel(id: string): string {
  return WORLD_LANGUAGE_TREE_V01.nodes[id]?.label ?? id;
}

function safeArray(x: any): any[] {
  return Array.isArray(x) ? x : [];
}

function safeStr(x: any): string {
  return typeof x === "string" ? x : "";
}

// v0.1 inputs: keep it forgiving.
// We accept either the whole /api/analyze-v1 response OR a partial object.
export function buildRootLightMapV01(input: any): RootLightMapV01 {
  const lights: RootLight[] = [];

  // 1) OriginClaim candidates (most stable, already in instrument)
  const ocCandidates =
    safeArray(input?.originClaim?.candidates) ??
    safeArray(input?.originClaim?.rows) ??
    safeArray(input?.ui?.originClaim?.candidates);

  for (const c of ocCandidates) {
    const lang =
      safeStr(c?.language) ||
      safeStr(c?.lang) ||
      safeStr(c?.family) ||
      safeStr(c?.meta?.language);

    if (!lang) continue;

    const nodeId = resolveWorldLangNodeId(lang);
    lights.push({
      nodeId,
      label: nodeLabel(nodeId),
      reason: "origin_claim_candidate",
      source: `originClaim.candidates.language=${lang}`,
    });
  }

  // 2) RootMap carriers (optional, engine evolving)
  // We support a few shapes without breaking.
  const rm = input?.rootMap ?? input?.deepRoot?.rootMap ?? input?.ui?.rootMap ?? null;

  // a) rootMap.carriers[] might exist later
  const carriers = safeArray(rm?.carriers);
  for (const c of carriers) {
    const lang = safeStr(c?.language) || safeStr(c?.lang) || safeStr(c?.carrierLang);
    if (!lang) continue;
    const nodeId = resolveWorldLangNodeId(lang);
    lights.push({
      nodeId,
      label: nodeLabel(nodeId),
      reason: "rootmap_carrier",
      source: `rootMap.carriers.language=${lang}`,
    });
  }

  // b) rootMap.supportedKeys entries already show "sq" in UI; try to harvest any "lang"/"locale"
  const supported = safeArray(rm?.supportedKeys) || safeArray(rm?.supported_keys);
  for (const s of supported) {
    const lang = safeStr(s?.lang) || safeStr(s?.locale) || safeStr(s?.language) || safeStr(s?.meta?.lang);
    if (!lang) continue;
    const nodeId = resolveWorldLangNodeId(lang);
    lights.push({
      nodeId,
      label: nodeLabel(nodeId),
      reason: "rootmap_carrier",
      source: `rootMap.supportedKeys.lang=${lang}`,
    });
  }

  // 3) evidencePackage hint (if present)
  const ep = input?.evidencePackage ?? null;
  const epLang = safeStr(ep?.summary?.language) || safeStr(ep?.language);
  if (epLang) {
    const nodeId = resolveWorldLangNodeId(epLang);
    lights.push({
      nodeId,
      label: nodeLabel(nodeId),
      reason: "explicit_language",
      source: `evidencePackage.language=${epLang}`,
    });
  }

  // always include WORLD so UI has a stable root highlight
  lights.push({
    nodeId: "world",
    label: nodeLabel("world"),
    reason: "explicit_language",
    source: "root",
  });

  const deduped = uniqBy(lights, (x) => `${x.nodeId}|${x.reason}`);
  return { version: "root_light_map.v0.1", lights: deduped };
}
