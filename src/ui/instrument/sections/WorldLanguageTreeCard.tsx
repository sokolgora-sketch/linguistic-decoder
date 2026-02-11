'use client';

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WORLD_LANGUAGE_TREE_V01 } from "@/shared/worldLanguageTree.v0.1";
import type { RootLightMapV01, RootLight, RootLightReason } from "@/shared/rootLightMap.v0.1";

type Props = {
  lightMap: RootLightMapV01 | null;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function safeChildIds(node: unknown): string[] {
  const n = isRecord(node) ? node : null;
  const raw =
    n && Array.isArray(n["children"]) ? (n["children"] as unknown[]) :
    n && Array.isArray(n["childIds"]) ? (n["childIds"] as unknown[]) :
    n && Array.isArray(n["childrenIds"]) ? (n["childrenIds"] as unknown[]) :
    [];
  return raw.filter((x): x is string => typeof x === "string");
}

function buildParentMap(): Map<string, string> {
  // child -> parent (single parent, tree assumption for v0.1)
  const parentById = new Map<string, string>();
  const nodes = WORLD_LANGUAGE_TREE_V01.nodes as Record<string, unknown>;

  for (const parentId of Object.keys(nodes)) {
    const parent = nodes[parentId];
    const kids = safeChildIds(parent);
    for (const childId of kids) {
      if (!parentById.has(childId)) parentById.set(childId, parentId);
    }
  }
  return parentById;
}

function reasonLabel(r: RootLightReason) {
  switch (r) {
    case "origin_claim_candidate":
      return "origin";
    case "rootmap_carrier":
      return "carrier";
    case "explicit_language":
      return "explicit";
    case "ancestor_path":
      return "ancestor";
    case "unknown":
    default:
      return "unknown";
  }
}

function ReasonChip(props: { reason: RootLightReason }) {
  const txt = reasonLabel(props.reason);
  return (
    <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] font-mono text-neutral-300">
      {txt}
    </span>
  );
}

function isLit(lights: RootLight[], nodeId: string) {
  return lights.filter((l) => l.nodeId === nodeId);
}

function computeFocusedVisibleSet(lights: RootLight[]) {
  const parentById = buildParentMap();
  const visible = new Set<string>();

  for (const l of lights) {
    let cur: string | undefined = l.nodeId;
    // walk to root (world)
    for (let i = 0; i < 32 && cur; i++) {
      visible.add(cur);
      if (cur === "world") break;
      cur = parentById.get(cur);
    }
  }

  // ensure root is always visible
  visible.add("world");
  return visible;
}

function renderNode(params: {
  nodeId: string;
  depth: number;
  lights: RootLight[];
  visibleSet: Set<string> | null; // null means show all
}) {
  const { nodeId, depth, lights, visibleSet } = params;

  const node = (WORLD_LANGUAGE_TREE_V01.nodes as Record<string, unknown>)[nodeId];
  if (!node) return null;

    const label =
      isRecord(node) && typeof node["label"] === "string"
        ? (node["label"] as string)
        : String(nodeId);

  if (visibleSet && !visibleSet.has(nodeId)) return null;

  const hits = isLit(lights, nodeId);
  const lit = hits.length > 0;

  const pad = depth * 14;
  const childIds = safeChildIds(node);

  return (
    <div key={nodeId} style={{ paddingLeft: pad }} className="py-1">
      <div className="flex items-start gap-2">
        <span className={lit ? "font-semibold" : ""}>
          {lit ? "●" : "○"} {label}
        </span>
        <span className="text-xs text-neutral-500">{nodeId}</span>

        {lit ? (
          <span className="ml-2 flex flex-wrap gap-1">
            {hits.map((h, i) => (
              <ReasonChip key={i} reason={h.reason} />
            ))}
          </span>
        ) : null}
      </div>

      {lit ? (
        <div className="mt-1 space-y-0.5 text-xs text-neutral-500">
          {hits.map((h, i) => (
            <div key={i} className="pl-4">
              <span className="font-mono text-neutral-400">{h.source}</span>
            </div>
          ))}
        </div>
      ) : null}

      {childIds.length ? (
        <div className="mt-1">
          {childIds.map((childId) =>
            renderNode({ nodeId: childId, depth: depth + 1, lights, visibleSet })
          )}
        </div>
      ) : null}
    </div>
  );
}

export function WorldLanguageTreeCard(props: Props) {
  const lights = React.useMemo(() => props.lightMap?.lights ?? [], [props.lightMap]);
  const [showAll, setShowAll] = React.useState(false);

  const visibleSet = React.useMemo(() => {
    if (showAll) return null; // show all nodes
    return computeFocusedVisibleSet(lights);
  }, [showAll, lights]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>World Language Tree</CardTitle>
          <div className="mt-1 text-xs text-neutral-500">
            Taxonomy scaffold — lit by evidence, not proof of origin.
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll((v) => !v)}
          className="font-mono"
        >
          {showAll ? "Focused view" : "Show full tree"}
        </Button>
      </CardHeader>

      <CardContent>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
          <span className="font-mono">● lit</span>
          <span className="font-mono">○ unlit</span>
          <span className="mx-1 opacity-50">|</span>
          <span className="inline-flex items-center gap-1">
            <ReasonChip reason="origin_claim_candidate" /> from OriginClaim
          </span>
          <span className="inline-flex items-center gap-1">
            <ReasonChip reason="rootmap_carrier" /> from RootMap carriers
          </span>
          <span className="inline-flex items-center gap-1">
            <ReasonChip reason="ancestor_path" /> ancestor path
          </span>
        </div>

        <div className="text-sm">
          {renderNode({ nodeId: "world", depth: 0, lights, visibleSet })}
        </div>

        {!props.lightMap ? (
          <div className="mt-2 text-xs text-neutral-500">No light map provided.</div>
        ) : null}
      </CardContent>
    </Card>
  );
}
