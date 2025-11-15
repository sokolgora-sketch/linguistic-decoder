"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EnginePath } from "@/shared/engineShape";

export default function WhyThisPath({ primary }: { primary: EnginePath }) {
  const v = primary?.voicePath ?? [];
  const r = primary?.ringPath ?? [];
  const L = primary?.levelPath ?? [];
  const ops = primary?.ops ?? [];
  const costs = (primary as any)?.stepCosts ?? []; // Safely access optional property

  if (!v.length) return null;

  function delta(a?: number, b?: number) {
    if (a === undefined || b === undefined) return "—";
    const d = Math.abs((b as number) - (a as number));
    return d.toString();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Why This Path?</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="grid grid-cols-6 gap-2 font-medium text-xs opacity-70 mb-1 px-3">
          <div>Step</div><div>Vowel</div><div>ΔRing</div><div>ΔLevel</div><div className="col-span-2">Op</div>
        </div>
        <div className="divide-y">
          {v.map((vv, i) => {
            const dRing = i===0 ? "0" : delta(r[i-1], r[i]);
            const dLvl  = i===0 ? "0" : delta(L[i-1], L[i]);
            const op    = ops[i] ?? (i===0 ? "start" : "hop");
            return (
              <div key={i} className="grid grid-cols-6 gap-2 py-2 px-3">
                <div className="opacity-80">{i+1}</div>
                <div className="font-semibold">{vv}</div>
                <div>{dRing}</div>
                <div>{dLvl}</div>
                <div className="truncate col-span-2">{op}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
