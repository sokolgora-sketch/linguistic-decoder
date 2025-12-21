"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export type FrontierCandidatesProps = {
  frontier?: unknown;
};

/**
 * Legacy-compatible: accepts unknown and renders only if frontier is a non-empty array.
 * This avoids TS failures while we stabilize the v1 adapter and UI contract.
 */
export function FrontierCandidates({ frontier }: FrontierCandidatesProps) {
  const items = Array.isArray(frontier) ? frontier : [];
  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Frontier</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-xs whitespace-pre-wrap break-words">
          {JSON.stringify(items, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}
