
import React from "react";
import { Card } from "./ui/card";
import type { PrinciplesSet, SevenCalcResult } from "@/shared/engineShape";
import { cn } from "@/lib/utils";

export function PrinciplesBlock({
  analysis,
}: {
  analysis: any;
}) {
  const pset: PrinciplesSet | undefined = analysis.principles;
  if (!pset || !pset.principles?.length) return null;

  return (
    <Card className="p-4 space-y-2">
      <h3 className="font-bold text-sm tracking-wide">
        Seven Principles (Core)
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {pset.principles.map((p) => {
          return (
            <div
              key={p.id}
              className={cn(
                "flex flex-col border border-border/50 rounded-lg p-2 bg-muted/30 transition-all"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-primary">{p.id}</span>
                <span className="text-xs opacity-70">
                  {(p.value * 100).toFixed(0)}%
                </span>
              </div>
              <div className="text-xs opacity-80">{p.name}</div>
              <div
                className={`text-[11px] mt-1 ${
                  p.active ? "text-accent-foreground" : "text-muted-foreground"
                }`}
              >
                {p.summary}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
