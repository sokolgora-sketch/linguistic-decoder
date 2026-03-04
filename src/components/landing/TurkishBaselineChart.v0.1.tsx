"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
  Line,
} from "recharts";

import type { LandingBucketPointV0_1 } from "@/shared/landing/landingBaselines.v0.1";

type Props = {
  points: LandingBucketPointV0_1[];
};

function linearRegression(xs: number[], ys: number[]) {
  // Deterministic least squares (no deps)
  const n = xs.length;
  if (n === 0) return { slope: 0, intercept: 0 };

  let sumX = 0, sumY = 0, sumXX = 0, sumXY = 0;
  for (let i = 0; i < n; i++) {
    const x = xs[i];
    const y = ys[i];
    sumX += x;
    sumY += y;
    sumXX += x * x;
    sumXY += x * y;
  }
  const denom = n * sumXX - sumX * sumX;
  const slope = denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

export function TurkishBaselineChartV0_1({ points }: Props) {
  const canUseResponsive = typeof (globalThis as any).ResizeObserver !== "undefined";
  const data = useMemo(
    () =>
      points
        .slice()
        .sort((a, b) => a.idx - b.idx)
        .map((p) => ({
          idx: p.idx,
          bucket: p.bucket,
          y: p.aperturePresenceMean,
        })),
    [points]
  );

  const line = useMemo(() => {
    const xs = data.map((d) => d.idx);
    const ys = data.map((d) => d.y);
    const { slope, intercept } = linearRegression(xs, ys);
    const linePts = xs.map((x) => ({ idx: x, yhat: slope * x + intercept }));
    return { slope, intercept, linePts };
  }, [data]);

  return (
    <div className="h-[260px] w-full rounded-xl border border-neutral-800 bg-neutral-950/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-semibold text-neutral-100">Turkish baseline — bucket means</div>
        <div className="text-xs font-mono text-neutral-400">
          y = {line.slope.toFixed(3)}x + {line.intercept.toFixed(3)}
        </div>
      </div>

      {canUseResponsive ? (
        <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="4 4" opacity={0.2} />
          <XAxis
            dataKey="idx"
            type="number"
            domain={[1, 7]}
            ticks={[1, 2, 3, 4, 5, 6, 7]}
            tickFormatter={(v) => `V${v}`}
            stroke="rgba(255,255,255,0.35)"
          />
          <YAxis
            dataKey="y"
            type="number"
            domain={[0, 1]}
            ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
            tickFormatter={(v) => v.toFixed(1)}
            stroke="rgba(255,255,255,0.35)"
          />
          <Tooltip
            formatter={(value: any, name: any) => [String(value), name]}
            labelFormatter={(label: any) => `Bucket V${label}`}
            contentStyle={{ background: "rgba(10,10,10,0.9)", border: "1px solid rgba(255,255,255,0.15)" }}
            labelStyle={{ color: "rgba(255,255,255,0.8)" }}
          />
          <Scatter dataKey="y" name="mean (presence mean)" />
          <Line
            data={line.linePts}
            dataKey="yhat"
            name="fit"
            dot={false}
            strokeWidth={2}
            stroke="rgba(255,255,255,0.55)"
          />
        </ComposedChart>
      </ResponsiveContainer>
      ) : (
        <div className="overflow-x-auto">
          <ComposedChart width={520} height={210} data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="4 4" opacity={0.2} />
          <XAxis
            dataKey="idx"
            type="number"
            domain={[1, 7]}
            ticks={[1, 2, 3, 4, 5, 6, 7]}
            tickFormatter={(v) => `V${v}`}
            stroke="rgba(255,255,255,0.35)"
          />
          <YAxis
            dataKey="y"
            type="number"
            domain={[0, 1]}
            ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
            tickFormatter={(v) => v.toFixed(1)}
            stroke="rgba(255,255,255,0.35)"
          />
          <Tooltip
            formatter={(value: any, name: any) => [String(value), name]}
            labelFormatter={(label: any) => `Bucket V${label}`}
            contentStyle={{ background: "rgba(10,10,10,0.9)", border: "1px solid rgba(255,255,255,0.15)" }}
            labelStyle={{ color: "rgba(255,255,255,0.8)" }}
          />
          <Scatter dataKey="y" name="mean (presence mean)" />
          <Line data={line.linePts} dataKey="yhat" name="fit" dot={false} strokeWidth={2} stroke="rgba(255,255,255,0.55)" />
        </ComposedChart>
        </div>
      )}

      <div className="mt-2 text-[11px] text-neutral-500">
        x-axis = bucket index (1..7), y-axis = mean aperture (presence mean)
      </div>
    </div>
  );
}
