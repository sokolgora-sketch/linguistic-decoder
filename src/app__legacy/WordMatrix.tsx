'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { WordMatrixV1 } from "@/shared/wordMatrix.v1";

interface WordMatrixProps {
  matrix?: WordMatrixV1 | null;
}

export function WordMatrix({ matrix }: WordMatrixProps) {
  if (!matrix) {
    return null;
  }

  const allRows = [
    matrix.primary,
    ...matrix.canon,
    ...(matrix.deepRoot ? [matrix.deepRoot] : []),
  ];

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Word Matrix
          <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border border-border/60 text-muted-foreground">
            New
          </span>
        </CardTitle>
        <CardDescription>
          Unified view of the word across Heart, Canon, and Deep Root layers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border/60 text-left text-muted-foreground">
              <tr>
                <th className="py-1.5 px-2 font-medium">Layer</th>
                <th className="py-1.5 px-2 font-medium">Label</th>
                <th className="py-1.5 px-2 font-medium">Form</th>
                <th className="py-1.5 px-2 font-medium">Voice Path</th>
                <th className="py-1.5 px-2 font-medium w-1/2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {allRows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-border/40 last:border-0 align-top"
                >
                  <td className="py-1.5 px-2 whitespace-nowrap capitalize">
                    {row.layer}
                  </td>
                  <td className="py-1.5 px-2 whitespace-nowrap font-medium">
                    {row.label}
                  </td>
                  <td className="py-1.5 px-2 whitespace-nowrap">{row.form || "—"}</td>
                  <td className="py-1.5 px-2 whitespace-nowrap">
                    {row.voicePath || "—"}
                  </td>
                  <td className="py-1.5 px-2 text-xs text-muted-foreground">
                    {row.notes || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
