// src/components/SymbolicReadingCard.tsx
"use client";

import type { SymbolicSummary } from "@/shared/resultsUI";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Sparkles } from "lucide-react";

type SymbolicReadingCardProps = {
  summary: SymbolicSummary;
};

export function SymbolicReadingCard({ summary }: SymbolicReadingCardProps) {
  if (!summary || !summary.notes || summary.notes.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent-foreground" />
          <span>Symbolic reading (experimental)</span>
        </CardTitle>
        <CardDescription>{summary.label}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <ul className="list-disc pl-5 space-y-1">
          {summary.notes.map((note, idx) => (
            <li key={idx} className="text-muted-foreground leading-relaxed">
              {note}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
