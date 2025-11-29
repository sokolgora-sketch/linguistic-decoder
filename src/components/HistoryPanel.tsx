
"use client";

import React from "react";
import { useHistory } from "@/hooks/useHistory";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import type { Alphabet } from "@/lib/runAnalysis";

type Props = {
  onLoadAnalysis: (cacheId: string) => void;
  onRecompute: (
    word: string,
    mode: "strict" | "open",
    alphabet: Alphabet
  ) => void;
};

export function HistoryPanel({ onLoadAnalysis, onRecompute }: Props) {
  const history = useHistory(10); // Fetches its own data now

  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          No analyses yet in this session. Run an analysis to see it here.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {history.map((h) => {
          // The useHistory hook returns a cacheId, which is what onLoadAnalysis needs
          const cacheId = (h as any).cacheId;
          if (!cacheId) return null; // Don't render items without a cacheId

          return (
            <div
              key={h.id}
              className="flex items-center justify-between gap-2 rounded-lg border p-2"
            >
              <div>
                <div className="font-semibold">{h.word}</div>
                <div className="text-xs text-muted-foreground">
                  {h.mode} / {h.alphabet}
                </div>
              </div>
              <div className="flex flex-shrink-0 gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onLoadAnalysis(cacheId)}
                >
                  Load
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    onRecompute(
                      h.word,
                      h.mode as "strict" | "open",
                      h.alphabet as Alphabet
                    )
                  }
                >
                  Recompute
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
