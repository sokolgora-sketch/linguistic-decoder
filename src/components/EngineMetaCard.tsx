import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import type { EngineMetaSummaryUI } from "@/lib/engineMetaSummary";

interface EngineMetaCardProps {
  meta: EngineMetaSummaryUI;
}

export function EngineMetaCard({ meta }: EngineMetaCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engine meta</CardTitle>
        <CardDescription>
            Debug info for this analysis run.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 text-sm text-muted-foreground">
        <div>
          <div className="font-medium text-primary-foreground/80">Engine</div>
          <div className="mt-1">{meta.engineName}</div>
        </div>
        <div>
          <div className="font-medium text-primary-foreground/80">Build</div>
          <div className="mt-1 font-mono">{meta.versionLine}</div>
        </div>
        <div>
          <div className="font-medium text-primary-foreground/80">Mode</div>
          <div className="mt-1 font-mono">{meta.modeLabel}</div>
        </div>
        <div>
          <div className="font-medium text-primary-foreground/80">Alphabet</div>
          <div className="mt-1 font-mono">{meta.alphabetLabel}</div>
        </div>
        {meta.notes && (
          <div className="md:col-span-2 mt-2 pt-2 border-t border-border/40">
            <div className="font-medium text-primary-foreground/80">Notes</div>
            <div className="mt-1 text-xs font-mono">{meta.notes}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
