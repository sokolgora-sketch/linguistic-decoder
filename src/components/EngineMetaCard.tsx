import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import type { EngineMetaSummary } from "@/lib/engineMetaSummary";

interface EngineMetaCardProps {
  summary?: EngineMetaSummary;
}

export function EngineMetaCard({ summary }: EngineMetaCardProps) {
  const {
    engineLabel = "SevenVoices Core",
    build = "unknown",
    modeLabel = "unknown",
    alphabetLabel = "unknown",
    rawVersion = "unknown",
  } = summary ?? {};

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
          <div className="mt-1">{engineLabel}</div>
        </div>
        <div>
          <div className="font-medium text-primary-foreground/80">Build</div>
          <div className="mt-1 font-mono">{build}</div>
        </div>
        <div>
          <div className="font-medium text-primary-foreground/80">Mode</div>
          <div className="mt-1 font-mono">{modeLabel}</div>
        </div>
        <div>
          <div className="font-medium text-primary-foreground/80">Alphabet</div>
          <div className="mt-1 font-mono">{alphabetLabel}</div>
        </div>
        {rawVersion && rawVersion !== "unknown" && (
          <div className="md:col-span-2 mt-2 pt-2 border-t border-border/40">
            <div className="font-medium text-primary-foreground/80">Notes</div>
            <div className="mt-1 text-xs font-mono">Raw version: {rawVersion}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
