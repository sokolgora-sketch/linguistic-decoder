"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AnyDeepRoot = any;

function safeArr(x: any): any[] {
  return Array.isArray(x) ? x : [];
}

function pickHypotheses(deepRoot: AnyDeepRoot): any[] {
  // hypotheses-first (new contract), fall back to candidates (legacy)
  const h = safeArr(deepRoot?.hypotheses);
  if (h.length > 0) return h;
  const c = safeArr(deepRoot?.candidates);
  return c;
}

export default function DeepRootCard({ deepRoot }: { deepRoot?: AnyDeepRoot | null }) {
  const list = pickHypotheses(deepRoot);
  if (!deepRoot || list.length === 0) return null;

  return (
    <Card className="border-white/10 bg-zinc-950/30">
      <CardHeader>
        <CardTitle className="text-base font-semibold">DeepRoot (proto-root hypotheses)</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        {list.slice(0, 4).map((h: any, idx: number) => {
          const protoRoots = safeArr(h?.protoRoots).filter((x) => typeof x === "string" && x.trim().length > 0);
          const segments = safeArr(h?.segments).filter((x) => typeof x === "string" && x.trim().length > 0);

          const carriers = safeArr(h?.carriers).map((c: any) => ({
            protoRootId: typeof c?.protoRootId === "string" ? c.protoRootId : "",
            segment: typeof c?.segment === "string" ? c.segment : "",
            carrierForm: typeof c?.carrierForm === "string" ? c.carrierForm : "",
            lang: typeof c?.lang === "string" ? c.lang : "",
            ops: safeArr(c?.ops).filter((x) => typeof x === "string"),
          }));

          const dec = h?.decomposition ?? {};
          const action = typeof dec?.action === "string" ? dec.action : "";
          const fn = typeof dec?.function === "string" ? dec.function : "";
          const unit = typeof dec?.unit === "string" ? dec.unit : "";

          const checks = h?.checks ?? {};
          const opsWithinLimits = !!checks?.opsWithinLimits;
          const skeletonExplained = !!checks?.skeletonExplained;

          return (
            <div key={h?.id ?? idx} className="rounded-lg border border-white/10 bg-black/20 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs opacity-80">#{idx + 1}</span>
                <span className="font-semibold">{(protoRoots.join(" + ") || "—")}</span>
                {segments.length > 0 ? (
                  <span className="font-mono text-xs opacity-70">segments: {segments.join(" · ")}</span>
                ) : null}
              </div>

              {(action || fn || unit) ? (
                <div className="mt-2">
                  <div className="text-muted-foreground">
                    {action ? <span><span className="opacity-70">action:</span> <span className="font-mono">{action}</span></span> : null}
                    {fn ? <span className="ml-3"><span className="opacity-70">function:</span> <span className="font-mono">{fn}</span></span> : null}
                    {unit ? <span className="ml-3"><span className="opacity-70">unit:</span> <span className="font-mono">{unit}</span></span> : null}
                  </div>
                </div>
              ) : null}

              {carriers.length > 0 ? (
                <div className="mt-3 space-y-1">
                  <div className="text-xs font-semibold opacity-80">Carriers</div>
                  <div className="space-y-1">
                    {carriers.map((c, i) => (
                      <div key={i} className="font-mono text-xs opacity-80">
                        <span className="opacity-70">{c.protoRootId || "?"}</span>
                        <span className="opacity-50"> @ </span>
                        <span>{c.segment || "—"}</span>
                        <span className="opacity-50"> → </span>
                        <span>{c.carrierForm || "—"}</span>
                        {c.lang ? <span className="opacity-50"> ({c.lang})</span> : null}
                        {c.ops.length ? <span className="opacity-50"> ops:{c.ops.join(",")}</span> : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-md border border-white/10 bg-black/20 px-2 py-1">
                  opsWithinLimits: <span className="font-mono">{String(opsWithinLimits)}</span>
                </span>
                <span className="rounded-md border border-white/10 bg-black/20 px-2 py-1">
                  skeletonExplained: <span className="font-mono">{String(skeletonExplained)}</span>
                </span>
                {typeof h?.opsCount === "number" ? (
                  <span className="rounded-md border border-white/10 bg-black/20 px-2 py-1">
                    opsCount: <span className="font-mono">{h.opsCount}</span>
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}

        {safeArr(deepRoot?.rootFamilies).length > 0 ? (
          <div className="text-xs text-muted-foreground">
            rootFamilies detected: <span className="font-mono">{safeArr(deepRoot?.rootFamilies).length}</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
