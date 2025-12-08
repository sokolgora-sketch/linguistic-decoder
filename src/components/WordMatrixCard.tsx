import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export type WordMatrixEntry = {
  label: string;
  value: string;
};

export type WordMatrixSummary = {
  word: string;
  entries: WordMatrixEntry[];
};

type WordMatrixCardProps = {
  summary: WordMatrixSummary | null;
};

export default function WordMatrixCard({ summary }: WordMatrixCardProps) {
  if (!summary) return null;

  return (
    <Card data-testid="word-matrix-card">
      <CardHeader>
        <CardTitle>Word Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2 text-sm text-muted-foreground">
          {summary.word}
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Field</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summary.entries.map((row) => (
              <TableRow key={row.label}>
                <TableCell className="font-mono text-xs">
                  {row.label}
                </TableCell>
                <TableCell className="text-xs">
                  {row.value}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}