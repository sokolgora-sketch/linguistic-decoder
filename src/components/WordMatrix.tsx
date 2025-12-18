"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

type MatrixPrimary = {
  layer?: string;
  label?: string;
  voicePath?: string;
  notes?: string | string[];
};

type MatrixCanonRow = {
  layer?: string;
  label?: string;
  language?: string;
  form?: string;
  voicePath?: string;
  notes?: string | string[];
};

type MatrixDeepRoot = {
  layer?: string;
  label?: string;
  notes?: string | string[];
};

export type WordMatrix = {
  word?: string;
  primary?: MatrixPrimary | null;
  canon?: MatrixCanonRow[] | null;
  deepRoot?: MatrixDeepRoot | null;
};

interface WordMatrixCardProps {
  matrix: WordMatrix | null | undefined;
}

function normalizeNotes(notes?: string | string[]): string {
  if (!notes) return "—";
  if (Array.isArray(notes)) return notes.join(" ");
  return notes;
}

export function WordMatrixCard({ matrix }: WordMatrixCardProps) {
  if (!matrix) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Word matrix (proto-root view)</CardTitle>
          <CardDescription>
            Shows proto-root mapping if present.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          No matrix attached yet. (Result has no proto-root mapping yet.)
        </CardContent>
      </Card>
    );
  }

  const { word, primary, canon, deepRoot } = matrix;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Word matrix (proto-root view)</CardTitle>
        <CardDescription>Proto-root mapping for {word}.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 text-sm">
          {primary && (
            <section>
              <div className="mb-1 font-semibold uppercase tracking-wide text-xs text-muted-foreground">
                HEART LAYER
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,2fr)] gap-4 rounded-md border border-border/60 px-4 py-3">
                <div className="font-medium">Primary path</div>
                <div className="font-mono">{primary.voicePath}</div>
                <div className="text-muted-foreground">
                  {normalizeNotes(primary.notes)}
                </div>
              </div>
            </section>
          )}

          {canon && canon.length > 0 && (
            <section>
              <div className="mb-1 font-semibold uppercase tracking-wide text-xs text-muted-foreground">
                CANON LAYER
              </div>
              <div className="overflow-x-auto rounded-md border border-border/60">
                <table className="min-w-full text-left text-xs">
                  <thead className="border-b border-border/60 bg-background/40">
                    <tr className="text-muted-foreground">
                      <th className="px-4 py-2 font-semibold">Language</th>
                      <th className="px-4 py-2 font-semibold">Form</th>
                      <th className="px-4 py-2 font-semibold">Vowel path</th>
                      <th className="px-4 py-2 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {canon.map((row, idx) => (
                      <tr key={idx} className="border-t border-border/40">
                        <td className="px-4 py-2">{row.language}</td>
                        <td className="px-4 py-2 font-mono">{row.form}</td>
                        <td className="px-4 py-2 font-mono">{row.voicePath}</td>
                        <td className="px-4 py-2 text-muted-foreground">
                          {normalizeNotes(row.notes)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {deepRoot && (
            <section>
              <div className="mb-1 font-semibold uppercase tracking-wide text-xs text-muted-foreground">
                DEEPROOT (EXPERIMENTAL)
              </div>
              <div className="rounded-md border border-dashed border-border/60 px-4 py-3 text-muted-foreground">
                {normalizeNotes(deepRoot.notes) ||
                  "Experimental proto-root suggestions (DeepRoot v1, UI-only)."}
              </div>
            </section>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
