"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

export default function WordMatrixLegend() {
  // Simple static legend for now – we can make it smarter later.
  const rows = [
    {
      label: "Row 1",
      value: "Heart axis – U → I (depth → inner focus/light)",
    },
    {
      label: "Row 2",
      value: "Middle ring – E / Y (expansion / reflection)",
    },
    {
      label: "Row 3",
      value: "Outer ring – A / Ë (act / formed unit)",
    },
  ];

  const columns = [
    {
      label: "Col 1",
      value: "Source / entry – where the path begins.",
    },
    {
      label: "Col 2",
      value: "Frontier / resolution – where the path lands.",
    },
  ];

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm">Matrix legend</CardTitle>
        <CardDescription className="text-xs">
          Quick map of how rows and columns in the word matrix relate to the
          Seven-Voices model.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4 text-xs md:grid-cols-2">
        <div>
          <p className="mb-1 font-medium uppercase tracking-wide">Rows</p>
          <ul className="space-y-1">
            {rows.map((row) => (
              <li key={row.label}>
                <span className="font-semibold">{row.label}: </span>
                <span>{row.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-1 font-medium uppercase tracking-wide">Columns</p>
          <ul className="space-y-1">
            {columns.map((col) => (
              <li key={col.label}>
                <span className="font-semibold">{col.label}: </span>
                <span>{col.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
