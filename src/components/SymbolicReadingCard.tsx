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

  const label = symbolic.label ?? 'Symbolic reading (experimental)';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-foreground" />
            <span>{label}</span>
        </CardTitle>
        <CardDescription>
          This is a symbolic / interpretive layer built on top of the Seven-Voices path and morphology.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <ul className="list-disc pl-5 space-y-1">
            {symbolic.notes.map((note, idx) => (
            <li key={idx} className="text-muted-foreground leading-relaxed">
                {note}
            </li>
            ))}
        </ul>
      </CardContent>
    </Card>
  );
}
