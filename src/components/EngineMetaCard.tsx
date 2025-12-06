// src/components/EngineMetaCard.tsx
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import type { EngineMetaSummaryUI } from '@/lib/engineMetaSummary';

type EngineMetaCardProps = {
  meta: EngineMetaSummaryUI;
};

function InfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="text-muted-foreground">{label}</div>
      <div className="col-span-2 font-medium">{value}</div>
    </div>
  );
}

export function EngineMetaCard({ meta }: EngineMetaCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engine Meta</CardTitle>
        <CardDescription>
          Configuration used for this analysis run.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <InfoRow label="Engine" value={meta.engineName} />
        <InfoRow label="Build" value={meta.versionLine} />
        <InfoRow label="Mode" value={meta.modeLabel} />
        <InfoRow label="Alphabet" value={meta.alphabetLabel} />
        {meta.notes && (
          <div className="pt-2 border-t border-border/40 text-xs text-muted-foreground">
            {meta.notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
