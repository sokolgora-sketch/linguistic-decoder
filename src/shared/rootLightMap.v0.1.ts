import { resolveWorldLangNodeId, WORLD_LANGUAGE_TREE_V01 } from "@/shared/worldLanguageTree.v0.1";

export type RootLightReason =
  | "origin_claim_candidate"
  | "rootmap_carrier"
  | "language_families"
  | "top_candidates"
  | "primary_path"
  | "deeproot_hint"
  | "explicit_language"
  | "ancestor_path"
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

function asLangString(x: any): string {
  // Accept: "Albanian", "sq", { language: "Latin" }, { lang: "en" }, { label: "Germanic" }
  if (typeof x === "string") return x;
  if (x && typeof x === "object") {
    return (
      safeStr(x.language) ||
      safeStr(x.lang) ||
      safeStr(x.locale) ||
      safeStr(x.label) ||
      safeStr(x.family) ||
      safeStr(x.name) ||
      safeStr(x.code)
    );
  }
  return "";
}

function getChildIds(node: any): string[] {
  return (
    (Array.isArray(node?.childIds) ? node.childIds : null) ??
    (Array.isArray(node?.childrenIds) ? node.childrenIds : null) ??
    (Array.isArray(node?.children) ? node.children : null) ??
    []
  );
}

function buildParentIndex(): Record<string, string | null> {
  // parentById[child] = parent
  const parentById: Record<string, string | null> = {};
  const nodes = WORLD_LANGUAGE_TREE_V01.nodes as Record<string, any>;

  // ensure root has a stable parent marker
  if (!parentById["world"]) parentById["world"] = null;

  for (const [id, node] of Object.entries(nodes)) {
    const kids = getChildIds(node);
    for (const childId of kids) {
      // do not overwrite if already set (first win = deterministic given stable tree)
      if (parentById[childId] == null) parentById[childId] = id;
    }
    if (parentById[id] === undefined) parentById[id] = parentById[id] ?? null;
  }

  return parentById;
}

function ancestorsOf(nodeId: string, parentById: Record<string, string | null>): string[] {
  // returns [nodeId, parent, grandparent, ...] up to world
  const out: string[] = [];
  let cur: string | null | undefined = nodeId;

  const guard = new Set<string>();
  while (cur) {
    if (guard.has(cur)) break; // cycle guard
    guard.add(cur);
    out.push(cur);
    if (cur === "world") break;
    cur = parentById[cur] ?? null;
  }

  // If we never reached world, still add world as stable root highlight
  if (!out.includes("world")) out.push("world");
  return out;
}

// v0.1 inputs: keep it forgiving.
// We accept either the whole /api/analyze-v1 response OR a partial object.
export function buildRootLightMapV01(input: any): RootLightMapV01 {
  const rawLights: RootLight[] = [];

  // 1) OriginClaim candidates (most stable, already in instrument)
  const ocCandidates =
    safeArray(input?.originClaim?.candidates).length
      ? safeArray(input?.originClaim?.candidates)
      : safeArray(input?.originClaim?.rows).length
        ? safeArray(input?.originClaim?.rows)
        : safeArray(input?.ui?.originClaim?.candidates);

  for (const c of ocCandidates) {
    const lang =
      safeStr(c?.language) ||
      safeStr(c?.lang) ||
      safeStr(c?.family) ||
      safeStr(c?.meta?.language);

    if (!lang) continue;

    const nodeId = resolveWorldLangNodeId(lang);
    rawLights.push({
      nodeId,
      label: nodeLabel(nodeId),
      reason: "origin_claim_candidate",
      source: `originClaim.candidates.language=${lang}`,
    });
  }


  // 2) languageFamilies (stable summary)
  // Accept: string[], { families: [...] }, { items: [...] }, or array of objects.
  const lf =
    (safeArray(input?.languageFamilies).length ? safeArray(input?.languageFamilies) : []) ||
    (safeArray(input?.languageFamilies?.families).length ? safeArray(input?.languageFamilies?.families) : []) ||
    (safeArray(input?.languageFamilies?.items).length ? safeArray(input?.languageFamilies?.items) : []) ||
    (safeArray(input?.ui?.languageFamilies).length ? safeArray(input?.ui?.languageFamilies) : []);

  for (const item of lf) {
    const lang = asLangString(item);
    if (!lang) continue;
    const nodeId = resolveWorldLangNodeId(lang);
    rawLights.push({
      nodeId,
      label: nodeLabel(nodeId),
      reason: "language_families",
      source: `languageFamilies=${lang}`,
    });
  }

  // 3) top-level candidates (stable, even when OriginClaim is absent)
  const topCandidates =
    (safeArray(input?.candidates).length ? safeArray(input?.candidates) : []) ||
    (safeArray(input?.ui?.candidates).length ? safeArray(input?.ui?.candidates) : []);

  for (const c of topCandidates) {
    const lang = asLangString(c);
    if (!lang) continue;
    const nodeId = resolveWorldLangNodeId(lang);
    rawLights.push({
      nodeId,
      label: nodeLabel(nodeId),
      reason: "top_candidates",
      source: `candidates=${lang}`,
    });
  }

  // 4) primaryPath hints (optional)
  const pp = input?.primaryPath ?? input?.ui?.primaryPath ?? null;
  const ppLang =
    asLangString(pp?.language) ||
    asLangString(pp?.family) ||
    asLangString(pp?.meta?.language) ||
    asLangString(pp?.meta?.family);

  if (ppLang) {
    const nodeId = resolveWorldLangNodeId(ppLang);
    rawLights.push({
      nodeId,
      label: nodeLabel(nodeId),
      reason: "primary_path",
      source: `primaryPath=${ppLang}`,
    });
  }

  // 5) deepRoot hints (optional; engine evolving)
  const dr = input?.deepRoot ?? input?.ui?.deepRoot ?? null;
  const drBuckets = [dr, dr?.rootMap, dr?.functionalRoots, dr?.protoRoots, dr?.carriers, dr?.families]
    .flat()
    .filter(Boolean);

  for (const b of drBuckets) {
    const items = Array.isArray(b) ? b : [b];
    for (const it of items) {
      const lang = asLangString(it);
      if (!lang) continue;
      const nodeId = resolveWorldLangNodeId(lang);
      rawLights.push({
        nodeId,
        label: nodeLabel(nodeId),
        reason: "deeproot_hint",
        source: `deepRootHint=${lang}`,
      });
    }
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
    rawLights.push({
      nodeId,
      label: nodeLabel(nodeId),
      reason: "rootmap_carrier",
      source: `rootMap.carriers.language=${lang}`,
    });
  }

  // b) rootMap.supportedKeys entries already show "sq" in UI; try to harvest any "lang"/"locale"
  const supported = safeArray(rm?.supportedKeys).length
    ? safeArray(rm?.supportedKeys)
    : safeArray(rm?.supported_keys);

  for (const s of supported) {
    const lang =
      safeStr(s?.lang) ||
      safeStr(s?.locale) ||
      safeStr(s?.language) ||
      safeStr(s?.meta?.lang);

    if (!lang) continue;

    const nodeId = resolveWorldLangNodeId(lang);
    rawLights.push({
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
    rawLights.push({
      nodeId,
      label: nodeLabel(nodeId),
      reason: "explicit_language",
      source: `evidencePackage.language=${epLang}`,
    });
  }

  // Always include WORLD so UI has a stable root highlight
  rawLights.push({
    nodeId: "world",
    label: nodeLabel("world"),
    reason: "explicit_language",
    source: "root",
  });

  // Expand to include ancestor path lights (WORLD → … → leaf)
  const parentById = buildParentIndex();
  const expanded: RootLight[] = [];

  for (const l of rawLights) {
    expanded.push(l);

    // Add ancestors as "ancestor_path" (so UI can show the chain without claiming origin)
    const chain = ancestorsOf(l.nodeId, parentById);
    for (const ancestorId of chain) {
      if (ancestorId === l.nodeId) continue;
      expanded.push({
        nodeId: ancestorId,
        label: nodeLabel(ancestorId),
        reason: "ancestor_path",
        source: `path(from=${l.nodeId}, reason=${l.reason})`,
      });
    }
  }

  // Deduplicate + stable sort
  const deduped = uniqBy(expanded, (x) => `${x.nodeId}|${x.reason}`);
  deduped.sort((a, b) => {
    const an = a.nodeId.localeCompare(b.nodeId);
    if (an) return an;
    const ar = a.reason.localeCompare(b.reason);
    if (ar) return ar;
    return a.source.localeCompare(b.source);
  });

  return { version: "root_light_map.v0.1", lights: deduped };
}
