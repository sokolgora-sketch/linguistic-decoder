// src/components/SymbolicReadingCard.tsx
"use client";

import type { SymbolicLayer } from "@/shared/engineShape";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Sparkles } from "lucide-react";

type SymbolicReadingCardProps = {
  symbolic: SymbolicLayer;
};

export function SymbolicReadingCard({ symbolic }: SymbolicReadingCardProps) {
  if (!symbolic || !symbolic.notes || symbolic.notes.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-foreground" />
            <span>{symbolic.label || 'Symbolic Reading'}</span>
        </CardTitle>
        <CardDescription>
          An experimental, functional reading based on the Seven-Voices path and morphological signals.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <ul className="list-disc list-inside space-y-1">
          {symbolic.notes.map((note, index) => (
            <li key={index} className="leading-relaxed">{note}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
