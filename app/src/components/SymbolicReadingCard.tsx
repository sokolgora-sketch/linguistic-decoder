// src/components/SymbolicReadingCard.tsx
"use client";

import type { SymbolicCoreResult } from "@/lib/symbolicCore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Sparkles } from "lucide-react";

type SymbolicReadingCardProps = {
  symbolic: SymbolicCoreResult;
};

export function SymbolicReadingCard({ symbolic }: SymbolicReadingCardProps) {
  if (!symbolic) {
    return null;
  }

  const { genderFlow, functionalTriplet, protocolRules } = symbolic;
  const notes = protocolRules?.filter(r => r.startsWith("RULE:") || r.startsWith("MUTATION:")) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-foreground" />
            <span>Symbolic Layer (experimental)</span>
        </CardTitle>
        <CardDescription>
          This is an interpretive layer built on top of the Seven-Voices path and morphology.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {genderFlow && (
            <div>
                <h4 className="font-semibold">Gender Flow</h4>
                <p className="text-muted-foreground">{genderFlow.direction} ({genderFlow.note})</p>
                <p className="text-xs text-muted-foreground/80">Polarities: {genderFlow.polarities.join(', ')}</p>
            </div>
        )}

        {functionalTriplet && (
            <div>
                <h4 className="font-semibold">Functional Triplet</h4>
                <p className="text-muted-foreground">{functionalTriplet.statement}</p>
                <p className="text-xs text-muted-foreground/80">
                    Action: {functionalTriplet.action} | Instrument: {functionalTriplet.instrument} | Result: {functionalTriplet.result}
                </p>
            </div>
        )}

        {notes.length > 0 && (
          <div>
            <h4 className="font-semibold">Protocol Notes</h4>
            <ul className="list-disc pl-5 space-y-1 mt-1">
                {notes.map((note, idx) => (
                <li key={idx} className="text-muted-foreground leading-relaxed">
                    {note.replace(/RULE: |MUTATION:/g, '')}
                </li>
                ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
