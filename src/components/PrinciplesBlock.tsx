import React from "react";
import { Card } from "./ui/card";
import type { PrinciplesSet, SevenCalcResult } from "@/shared/engineShape";
import { cn } from "@/lib/utils";

export function PrinciplesBlock({
  analysis,
  calcOverlay,
}: {
  analysis: any;
  calcOverlay?: SevenCalcResult | null;
}) {
  const pset: PrinciplesSet | undefined = analysis.principles;
  if (!pset || !pset.principles?.length) return null;

  return (
    <Card className="p-4 space-y-2">
      <h3 className="font-bold text-sm tracking-wide">
        Seven Principles (Heart Calculator)
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {pset.principles.map((p) => {
          const isFromCalc = calcOverlay?.principle === p.id;
          return (
            <div
              key={p.id}
              className={cn(
                "flex flex-col border border-border/50 rounded-lg p-2 bg-muted/30 transition-all",
                isFromCalc && "border-pink-500/80 shadow-[0_0_8px_-1px_rgba(244,114,182,0.6)] bg-pink-900/20"
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
      {calcOverlay && (
        <div className="mt-2 text-xs text-muted-foreground pt-2 border-t">
          <span className="font-semibold">Seven-Principles calc:</span>{" "}
          {calcOverlay.leftExpr}{" "}
          {calcOverlay.op === "add" && "+"}
          {calcOverlay.op === "subtract" && "−"}
          {calcOverlay.op === "multiply" && "×"}
          {calcOverlay.op === "divide" && "÷"}{" "}
          {calcOverlay.rightExpr}
          {" → "}
          <span className="font-semibold text-primary">{calcOverlay.principle}</span>
          {" ("}
          base-7 {calcOverlay.base7.join(" ")}
          {" · dec "}
          {calcOverlay.decimal}
          {")"}
        </div>
      )}
    </Card>
  );
}
