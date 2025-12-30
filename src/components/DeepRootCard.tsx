"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Carrier = {
  protoRootId?: string;
  segment?: string;
  carrierForm?: string;
  lang?: string;
  ops?: string[];
};

type HypothesisLike = {
  id?: string;
  protoRoots?: string[];
  segments?: string[];
  carriers?: Carrier[];
  decomposition?: { action?: string; function?: string; unit?: string };
  checks?: { opsWithinLimits?: boolean; skeletonExplained?: boolean };
  opsCount?: number;
};

type DeepRootLike = {
  hypotheses?: HypothesisLike[];
  candidates?: HypothesisLike[];
};

function pickRows(deepRoot?: DeepRootLike | null): HypothesisLike[] {
  if (!deepRoot) return [];
  const h = Array.isArray(deepRoot.hypotheses) ? deepRoot.hypotheses : [];
  if (h.length > 0) return h;
  const c = Array.isArray(deepRoot.candidates) ? deepRoot.candidates : [];
  return c;
}

function boolTag(label: string, value: unknown) {
  return (
    <span className="rounded-md border border-white/10 bg-black/20 px-2 py-1">
      {label}: <span className="font-mono">{String(!!value)}</span>
    </span>
  );
}

export default function DeepRootCard({ deepRoot }: { deepRoot?: DeepRootLike | null }) {
  const rows = pickRows(deepRoot);
  if (rows.length === 0) return null;

  return (
    <Card className="border-white/10 bg-zinc-950/30">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          DeepRoot (proto-root hypotheses)
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        {rows.map((h, idx) => {
          const proto = (h.protoRoots ?? []).filter(Boolean);
          const segs = (h.segments ?? []).filter(Boolean);
          const carriers = (h.carriers ?? []).filter(Boolean);

          const header = proto.length ? proto.join(" + ") : "—";
          const segLine = segs.length ? `segments: ${segs.join(" · ")}` : "";

          return (
            <div
              key={h.id ?? `row-${idx}`}
              className="rounded-lg border border-white/10 bg-black/20 p-3"
              data-testid={`deeproot-row-${idx + 1}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs opacity-80">#{idx + 1}</span>
                <span className="font-semibold" data-testid={`deeproot-header-${idx + 1}`}>
                  {header}
                </span>
                {segLine ? (
                  <span className="font-mono text-xs opacity-70">{segLine}</span>
                ) : null}
              </div>

              {h.decomposition?.action || h.decomposition?.function || h.decomposition?.unit ? (
                <div className="mt-2">
                  <div className="text-muted-foreground">
                    {h.decomposition?.action ? (
                      <span>
                        <span className="opacity-70">action:</span>{" "}
                        <span className="font-mono">{h.decomposition.action}</span>
                      </span>
                    ) : null}
                    {h.decomposition?.function ? (
                      <span className="ml-3">
                        <span className="opacity-70">function:</span>{" "}
                        <span className="font-mono">{h.decomposition.function}</span>
                      </span>
                    ) : null}
                    {h.decomposition?.unit ? (
                      <span className="ml-3">
                        <span className="opacity-70">unit:</span>{" "}
                        <span className="font-mono">{h.decomposition.unit}</span>
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {carriers.length > 0 ? (
                <div className="mt-3 space-y-1">
                  <div className="text-xs font-semibold opacity-80">Carriers</div>
                  <div className="space-y-1">
                    {carriers.map((c, j) => {
                      const protoRootId = c.protoRootId ?? "";
                      const segment = c.segment ?? "";
                      const carrierForm = c.carrierForm ?? "";
                      const lang = c.lang ?? "";
                      const ops = (c.ops ?? []).filter(Boolean).join(",");

                      // Stable, unique test hook per carrier line
                      const tid = `deeproot-carrier-${idx + 1}-${protoRootId || "x"}-${segment || "y"}`;

                      return (
                        <div
                          key={`${protoRootId}-${segment}-${j}`}
                          className="font-mono text-xs opacity-80"
                          data-testid={tid}
                        >
                          <span className="opacity-70">{protoRootId}</span>
                          <span className="opacity-50"> @ </span>
                          <span>{segment}</span>
                          <span className="opacity-50"> → </span>
                          <span>{carrierForm}</span>
                          {lang ? <span className="opacity-50"> ({lang})</span> : null}
                          {ops ? <span className="opacity-50"> ops:{ops}</span> : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {(h.checks?.opsWithinLimits !== undefined ||
                h.checks?.skeletonExplained !== undefined ||
                h.opsCount !== undefined) && (
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {h.checks?.opsWithinLimits !== undefined
                    ? boolTag("opsWithinLimits", h.checks.opsWithinLimits)
                    : null}
                  {h.checks?.skeletonExplained !== undefined
                    ? boolTag("skeletonExplained", h.checks.skeletonExplained)
                    : null}
                  {h.opsCount !== undefined ? (
                    <span className="rounded-md border border-white/10 bg-black/20 px-2 py-1">
                      opsCount: <span className="font-mono">{String(h.opsCount)}</span>
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
