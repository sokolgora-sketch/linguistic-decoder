'use client';

import React from 'react';
import { normalizePrinciplesToLabels } from '@/v1/principles.vocab.v0.1';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  // We keep this loose on purpose: UI must not depend on engine types.
  // We only *read* fields if they exist.
  result: any;
};

function fmt(v: any): string {
  if (v === null || v === undefined) return 'N/A';
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'N/A';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function fmtPrinciplesPath(v: any): string {
  if (!Array.isArray(v)) return 'N/A';
  const xs = v.filter((x) => typeof x === 'string');
  const labels = normalizePrinciplesToLabels(xs);
  if (!labels.length) return 'N/A';
  return labels.join(' → ');
}

export default function MathLensesCard({ result }: Props) {
  const evidenceMath7 =
    result?.evidence?.math7?.primary ??
    result?.raw?.evidence?.math7?.primary ??
    result?.heart?.math7?.primary ??
    null;

  const heartInstrumentV1 = result?.heartInstrumentV1 ?? null;

  const hasAny =
    !!evidenceMath7 ||
    !!heartInstrumentV1;

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm">Math &amp; Lenses</CardTitle>
        <div className="text-xs text-muted-foreground">
          Only fields that exist in the current engine version are shown.
        </div>
      </CardHeader>

      <CardContent className="text-sm">
        {!hasAny ? (
          <div className="text-xs text-muted-foreground">
            Not available in this engine version.
          </div>
        ) : (
          <div className="space-y-4">
            {evidenceMath7 && (
              <div className="rounded-md border p-3">
                <div className="mb-2 text-xs font-medium">evidence.math7.primary</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div className="text-muted-foreground">cycleState</div>
                  <div className="font-mono">{fmt(evidenceMath7.cycleState)}</div>

                  <div className="text-muted-foreground">basis</div>
                  <div className="font-mono">{fmt(evidenceMath7.basis)}</div>

                  <div className="text-muted-foreground">vowels</div>
                  <div className="font-mono">{fmt(evidenceMath7.vowels)}</div>

                  <div className="text-muted-foreground">indices</div>
                  <div className="font-mono">{fmt(evidenceMath7.indices)}</div>

                  <div className="text-muted-foreground">sum</div>
                  <div className="font-mono">{fmt(evidenceMath7.sum)}</div>

                  <div className="text-muted-foreground">totalMod7</div>
                  <div className="font-mono">{fmt(evidenceMath7.totalMod7)}</div>

                  <div className="text-muted-foreground">principlesPath</div>
                  <div className="font-mono">{fmtPrinciplesPath(evidenceMath7.principlesPath)}</div>
                </div>
              </div>
            )}

            {heartInstrumentV1 && (
              <div className="rounded-md border p-3">
                <div className="mb-2 text-xs font-medium">heartInstrumentV1</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div className="text-muted-foreground">basisNfc</div>
                  <div className="font-mono">{fmt(heartInstrumentV1.basisNfc)}</div>

                  <div className="text-muted-foreground">surfaceVowels</div>
                  <div className="font-mono">{fmt(heartInstrumentV1.surfaceVowels)}</div>

                  <div className="text-muted-foreground">principlesPath</div>
                  <div className="font-mono">{fmtPrinciplesPath(heartInstrumentV1.principlesPath)}</div>

                  <div className="text-muted-foreground">values1to7</div>
                  <div className="font-mono">{fmt(heartInstrumentV1.values1to7)}</div>
                    <div className="text-muted-foreground">surfaceTotal1to7</div>
                    <div className="font-mono">
                      {fmt(heartInstrumentV1.surfaceTotal1to7 ?? heartInstrumentV1.math7?.total1to7)}
                    </div>
                    <div className="text-muted-foreground">surfaceTotalMod7</div>
                    <div className="font-mono">
                      {fmt(heartInstrumentV1.surfaceTotalMod7 ?? heartInstrumentV1.math7?.totalMod7)}
                    </div>


                  <div className="text-muted-foreground">wrapCount</div>
                  <div className="font-mono">{fmt(heartInstrumentV1.math7?.wrapCount)}</div>

                  <div className="text-muted-foreground">events</div>
                  <div className="font-mono">{fmt(heartInstrumentV1.math7?.events)}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
