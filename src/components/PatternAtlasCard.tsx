'use client';

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { classifyVoicePath } from "@/shared/patternAtlas.v1";

export default function PatternAtlasCard({ voicePath }: { voicePath: string }) {
  const c = classifyVoicePath(voicePath);

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">Pattern Atlas (v1)</CardTitle>
          <Badge variant="secondary">{c.polarity}</Badge>
        </div>
        <div className="text-sm opacity-80">{c.normalized}</div>
      </CardHeader>

      <CardContent className="text-sm space-y-2">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="opacity-70">From</div>
            <div className="font-mono">{c.from} (ring {c.ringFrom})</div>
          </div>
          <div>
            <div className="opacity-70">To</div>
            <div className="font-mono">{c.to} (ring {c.ringTo})</div>
          </div>
          <div>
            <div className="opacity-70">Steps</div>
            <div className="font-mono">{c.steps}</div>
          </div>
        </div>

        <div className="pt-2 border-t border-border/60">
          <div className="opacity-70">Summary</div>
          <div>{c.summary}</div>
        </div>
      </CardContent>
    </Card>
  );
}
