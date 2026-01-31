'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WORLD_LANGUAGE_TREE_V01 } from "@/shared/worldLanguageTree.v0.1";
import type { RootLightMapV01, RootLight } from "@/shared/rootLightMap.v0.1";

type Props = {
  lightMap: RootLightMapV01 | null;
};

function isLit(lights: RootLight[], nodeId: string) {
  return lights.filter(l => l.nodeId === nodeId);
}

function renderNode(nodeId: string, depth: number, lights: RootLight[]) {
  const node = WORLD_LANGUAGE_TREE_V01.nodes[nodeId];
  if (!node) return null;

  const hits = isLit(lights, nodeId);
  const lit = hits.length > 0;

  const pad = depth * 14;

  return (
    <div key={nodeId} style={{ paddingLeft: pad }} className="py-1">
      <div className="flex items-start gap-2">
        <span className={lit ? "font-semibold" : ""}>
          {lit ? "●" : "○"} {node.label}
        </span>
        <span className="text-xs text-neutral-500">{nodeId}</span>
      </div>

      {lit ? (
        <div className="mt-1 text-xs text-neutral-600">
          {hits.map((h, i) => (
            <div key={i}>
              <span className="font-medium">{h.reason}</span>
              <span className="text-neutral-500"> — {h.source}</span>
            </div>
          ))}
        </div>
      ) : null}

      {(() => {
        const childIds: string[] =
          (Array.isArray((node as any)?.children) ? (node as any).children : null) ??
          (Array.isArray((node as any)?.childIds) ? (node as any).childIds : null) ??
          (Array.isArray((node as any)?.childrenIds) ? (node as any).childrenIds : null) ??
          [];
        return childIds.length ? (
          <div className="mt-1">
            {childIds.map((childId) => renderNode(childId, depth + 1, lights))}
          </div>
        ) : null;
      })()}
    </div>
  );
}

export function WorldLanguageTreeCard(props: Props) {
  const lights = props.lightMap?.lights ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>World Language Tree</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          {renderNode("world", 0, lights)}
        </div>
        {!props.lightMap ? (
          <div className="mt-2 text-xs text-neutral-500">No light map provided.</div>
        ) : null}
      </CardContent>
    </Card>
  );
}
