
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import type { HistoryEntry } from "@/shared/history";

type Props = {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
};

export function HistoryPanel({ history, onSelect }: Props) {
  if (!history.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-slate-500">
          No analyses yet in this session.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        {history.map((h) => (
          <div
            key={h.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-slate-800/80 bg-slate-950/40 px-3 py-2"
          >
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-100">
                {h.word}
              </span>
              <span className="text-[10px] text-slate-500">
                {new Date(h.createdAt).toLocaleString()}
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-[11px]"
              onClick={() => onSelect(h)}
            >
              Load
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
