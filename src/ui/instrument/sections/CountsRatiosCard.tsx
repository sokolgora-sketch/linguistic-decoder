'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type KV = Record<string, unknown>;

function asKV(x: unknown): KV | null {
  if (!x || typeof x !== 'object') return null;
  return x as KV;
}

function pickCounts(readout: unknown): KV | null {
  const r = asKV(readout);
  if (!r) return null;

  // Try the likely shapes without assuming one is canonical.
  return (
    asKV((r as any).counts) ||
    asKV((r as any).countsRatios?.counts) ||
    asKV((r as any).summaryCounts) ||
    null
  );
}

function pickRatios(readout: unknown): KV | null {
  const r = asKV(readout);
  if (!r) return null;

  return (
    asKV((r as any).ratios) ||
    asKV((r as any).countsRatios?.ratios) ||
    asKV((r as any).summaryRatios) ||
    null
  );
}

function renderKV(obj: KV) {
  const entries = Object.entries(obj);

  if (!entries.length) {
    return <div className="text-sm text-muted-foreground">Not available.</div>;
  }

  return (
    <div className="grid gap-1">
      {entries.map(([k, v]) => (
        <div key={k} className="flex items-baseline justify-between gap-3">
          <div className="text-sm text-muted-foreground">{k}</div>
          <div className="text-sm font-mono">
            {typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean'
              ? String(v)
              : v == null
                ? '—'
                : JSON.stringify(v)}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CountsRatiosCard(props: { readout: unknown; engineVersion?: string }) {
  const counts = pickCounts(props.readout);
  const ratios = pickRatios(props.readout);

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-base">Counts / Ratios</CardTitle>
        {props.engineVersion ? (
          <div className="text-xs text-muted-foreground">engine: {props.engineVersion}</div>
        ) : null}
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <div className="mb-2 text-sm font-semibold">Counts</div>
          {counts ? renderKV(counts) : <div className="text-sm text-muted-foreground">Not available.</div>}
        </div>

        <div>
          <div className="mb-2 text-sm font-semibold">Ratios</div>
          {ratios ? renderKV(ratios) : <div className="text-sm text-muted-foreground">Not available.</div>}
        </div>
      </CardContent>
    </Card>
  );
}
