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

function normalizeNotes(notes?: string | string[]) {
  if (!notes) return undefined;
  if (Array.isArray(notes)) return notes.join(" ");
  return notes;
}

export function WordMatrixCard({ matrix }: WordMatrixCardProps) {
  // No matrix at all – show a soft placeholder
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

  const primaryNotes = normalizeNotes(primary?.notes);
  const deepNotes = normalizeNotes(deepRoot?.notes);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Word matrix (proto-root view)</CardTitle>
        <CardDescription>
          Proto-root mapping for{" "}
          <span className="font-mono">{word ?? "this word"}</span>.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 text-sm">
        {/* HEART LAYER */}
        <section>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
            Heart layer
          </div>

          {primary ? (
            <div className="rounded-lg border border-muted/40 px-4 py-3 grid gap-2 md:grid-cols-3">
              <div>
                <div className="text-[11px] uppercase text-muted-foreground">
                  Primary path
                </div>
                <div className="font-medium">
                  {primary.label ?? "—"}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-muted-foreground">
                  Voice path
                </div>
                <div className="font-mono">
                  {primary.voicePath ?? "—"}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase text-muted-foreground">
                  Notes
                </div>
                <div className="text-muted-foreground/90">
                  {primaryNotes ?? "—"}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No primary path attached yet.
            </p>
          )}
        </section>

        {/* CANON LAYER */}
        <section>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
            Canon layer
          </div>

          {canon && canon.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-muted/40">
              <table className="min-w-full text-xs">
                <thead className="border-b border-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 text-left">Language</th>
                    <th className="px-4 py-2 text-left">Form</th>
                    <th className="px-4 py-2 text-left">Voice path</th>
                    <th className="px-4 py-2 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {canon.map((row, idx) => (
                    <tr
                      key={row.language ?? row.label ?? idx}
                      className="border-b border-muted/20 last:border-0"
                    >
                      <td className="px-4 py-2">
                        {row.label ?? row.language ?? "—"}
                      </td>
                      <td className="px-4 py-2 font-mono text-[11px]">
                        {row.form ?? "—"}
                      </td>
                      <td className="px-4 py-2 font-mono text-[11px]">
                        {row.voicePath ?? "—"}
                      </td>
                      <td className="px-4 py-2 text-[11px] text-muted-foreground">
                        {normalizeNotes(row.notes) ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No canon candidates attached yet.
            </p>
          )}
        </section>

        {/* DEEPROOT LAYER */}
        <section>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
            DeepRoot (experimental)
          </div>

          {deepRoot ? (
            <div className="rounded-lg border border-dashed border-amber-500/40 bg-amber-500/5 px-4 py-3">
              <div className="text-[11px] uppercase text-amber-300 mb-1">
                Proto-root
              </div>
              <div className="text-sm text-amber-100/90">
                {deepNotes ??
                  "Experimental proto-root suggestions (DeepRoot v1, UI-only)."}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No DeepRoot suggestions attached yet.
            </p>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
