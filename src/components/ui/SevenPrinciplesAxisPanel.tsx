"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./card";
import { PRINCIPLES, type AxisId } from "@/core/principles";

type SymbolicTag = { axis: string; note: string };
type Family = { language?: string; symbolic?: SymbolicTag[] | null };

type Props = {
  result: { languageFamilies?: Family[] } | null;
};

export function SevenPrinciplesAxisPanel({ result }: Props) {
  const families = result?.languageFamilies ?? [];

  if (!families.length) return null;

  // Count axes across all language families
  const axisCounts: Record<AxisId, number> = {
    A: 0,
    E: 0,
    I: 0,
    O: 0,
    U: 0,
    Y: 0,
    Ë: 0,
  };

  for (const family of families) {
    if (!family.symbolic) continue;
    for (const tag of family.symbolic) {
      const axis = tag.axis as AxisId;
      if (axisCounts[axis] !== undefined) {
        axisCounts[axis] += 1;
      }
    }
  }

  const total = Object.values(axisCounts).reduce((a, b) => a + b, 0) || 1;

  const principleScores = PRINCIPLES.map((p) => {
    const count = axisCounts[p.axis] ?? 0;
    const weight = count / total;
    return { ...p, count, weight };
  });

  const hasAnySignal = principleScores.some((p) => p.count > 0);
  if (!hasAnySignal) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Seven Principles (symbolic axes)</CardTitle>
        <CardDescription>
          Built from symbolic tags on each language family candidate (A–Ë axes).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {principleScores.map((p) => (
          <div key={p.id} className="flex items-center gap-3">
            <div className="w-32 text-sm font-medium">
              <span className="capitalize">{p.label}</span>
              <span className="ml-1 text-xs text-muted-foreground">({p.axis})</span>
            </div>

            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.max(p.weight * 100, p.count > 0 ? 8 : 0)}%`,
                }}
              />
            </div>

            <div className="w-8 text-xs text-right tabular-nums">
              {p.count}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
