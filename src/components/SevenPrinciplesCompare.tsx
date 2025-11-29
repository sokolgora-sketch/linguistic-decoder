"use client";

import React from "react";
import type { SevenCalcResult } from "@/shared/engineShape";

type Props = {
  wordA: string;
  wordB: string;
  results: {
    a: SevenCalcResult | null;
    b: SevenCalcResult | null;
  };
};

type SummaryCardProps = {
  label: string;
  result: SevenCalcResult | null;
};

const SummaryCard: React.FC<SummaryCardProps> = ({ label, result }) => {
  if (!result) {
    return (
      <div className="border rounded-lg p-4 text-sm text-muted-foreground">
        <h3 className="text-lg font-semibold mb-2">{label}</h3>
        <p>No result.</p>
      </div>
    );
  }

  // Heart object often has more fields than the SevenCalcResult type declares,
  // so grab them via `any` to avoid TS whining.
  const heart = result as any;

  const expression = heart.expression ?? "–";
  const principle = heart.principle ?? "–";
  const decimal = heart.decimal ?? "–";
  const base7 = Array.isArray(heart.base7) ? heart.base7.join(" ") : heart.base7 ?? "–";
  const voices = Array.isArray(heart.voices)
    ? heart.voices.join(" ")
    : heart.voices ?? "–";

  return (
    <div className="border rounded-lg p-4 text-sm">
      <h3 className="text-lg font-semibold mb-3">{label}</h3>
      <p>
        <strong>Expression:</strong> {expression}
      </p>
      <p>
        <strong>Principle:</strong> {principle}
      </p>
      <p>
        <strong>Decimal:</strong> {decimal}
      </p>
      <p>
        <strong>Base-7:</strong> {base7}
      </p>
      <p>
        <strong>Voices:</strong> {voices}
      </p>
    </div>
  );
};

const SevenPrinciplesCompare: React.FC<Props> = ({ wordA, wordB, results }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SummaryCard label={wordA || "Word A"} result={results.a} />
      <SummaryCard label={wordB || "Word B"} result={results.b} />
    </div>
  );
};

export default SevenPrinciplesCompare;
