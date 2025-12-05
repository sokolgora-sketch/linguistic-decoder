"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

type AnyMatrix = any;

interface WordMatrixCardProps {
  matrix: AnyMatrix | null | undefined;
}

export function WordMatrixCard({ matrix }: WordMatrixCardProps) {
  // No matrix at all – engine didn’t send one
  if (!matrix) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Word matrix (proto-root view)</CardTitle>
          <CardDescription>
            Shows proto-root mapping if present.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground italic">
          No matrix attached yet. (Result has no <code>wordMatrix</code> field.)
        </CardContent>
      </Card>
    );
  }

  const primary = matrix.primary ?? null;
  const canon = Array.isArray(matrix.canon) ? matrix.canon : [];
  const deepRoot = matrix.deepRoot ?? matrix.deeproot ?? null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Word matrix (proto-root view)</CardTitle>
        <CardDescription>
          Proto-root mapping for{" "}
          <span className="font-mono">{matrix.word ?? "—"}</span>.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        {/* Heart layer */}
        {primary && (
          <section>
            <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Heart layer
            </h3>
            <div className="rounded-md border border-border/60 px-3 py-2 bg-muted/5">
              <div className="font-medium">
                {primary.label ?? "Primary path"}
              </div>
              {primary.voicePath && (
                <div className="font-mono text-xs mt-1">
                  {primary.voicePath}
                </div>
              )}
              {primary.notes && (
                <p className="text-xs text-muted-foreground mt-1">
                  {primary.notes}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Canon layer */}
        {canon.length > 0 && (
          <section>
            <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Canon layer
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs border-collapse">
                <thead className="border-b border-muted/40 text-[0.7rem] uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-2 py-1 text-left">Language</th>
                    <th className="px-2 py-1 text-left">Form</th>
                    <th className="px-2 py-1 text-left">Voice path</th>
                    <th className="px-2 py-1 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {canon.map((row: any, idx: number) => (
                    <tr
                      key={`${row.language ?? row.label ?? "row"}-${idx}`}
                      className="border-b border-muted/20 last:border-0"
                    >
                      <td className="px-2 py-1">
                        {row.language ?? row.label ?? "—"}
                      </td>
                      <td className="px-2 py-1 font-mono">
                        {row.form ?? "—"}
                      </td>
                      <td className="px-2 py-1 font-mono">
                        {row.voicePath ?? "—"}
                      </td>
                      <td className="px-2 py-1 text-muted-foreground">
                        {row.notes ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* DeepRoot */}
        {deepRoot && (
          <section>
            <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              DeepRoot (experimental)
            </h3>
            <div className="rounded-md border border-border/60 px-3 py-2 bg-muted/5">
              <div className="font-medium">
                {deepRoot.label ?? "Proto-root candidate"}
              </div>
              {deepRoot.voicePath && (
                <div className="font-mono text-xs mt-1">
                  {deepRoot.voicePath}
                </div>
              )}
              {deepRoot.notes && (
                <p className="text-xs text-muted-foreground mt-1">
                  {deepRoot.notes}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Fallback if matrix is present but empty */}
        {!primary && canon.length === 0 && !deepRoot && (
          <p className="text-sm text-muted-foreground italic">
            Matrix present but empty – engine has not filled any layers yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}