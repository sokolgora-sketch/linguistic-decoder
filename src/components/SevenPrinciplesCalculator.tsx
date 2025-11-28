"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type Vowel = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";

const VOICE_ORDER: Vowel[] = ["A", "E", "I", "O", "U", "Y", "Ë"];

const PRINCIPLE_LABEL: Record<Vowel, string> = {
  A: "A – Source / Fire / Action",
  E: "E – Expansion / Bridge / Relation",
  I: "I – Intent / Idea / Inner line",
  O: "O – Mediator / Balance / Heart",
  U: "U – Flow / Breath / Movement",
  Y: "Y – Height / Vision / Sky",
  Ë: "Ë – Completion / Ground / Mother",
};

type SevenCalcSummary = {
  normalized: string;
  voices: Vowel[];
  decimal: number;
  base7: number[];
  totalMod7: number;
  coreVoice: Vowel;
  principle: string;
};

function computeFromExpression(raw: string): SevenCalcSummary | null {
  const cleaned = raw.replace(/[^0-9A-Za-zËë]/g, "").trim();
  if (!cleaned) return null;

  const voices: Vowel[] = [];

  for (const chRaw of cleaned) {
    const ch = chRaw.toUpperCase();
    let v: Vowel | null = null;

    switch (ch) {
      case "1":
      case "A":
        v = "A";
        break;
      case "2":
      case "E":
        v = "E";
        break;
      case "3":
      case "I":
        v = "I";
        break;
      case "4":
      case "O":
        v = "O";
        break;
      case "5":
      case "U":
        v = "U";
        break;
      case "6":
      case "Y":
        v = "Y";
        break;
      case "7":
      case "Ë":
        v = "Ë";
        break;
      default:
        // ignore anything else
        break;
    }

    if (v) voices.push(v);
  }

  if (!voices.length) return null;

  // Simple deterministic math-7 from the voices:
  const decimal = voices.reduce(
    (sum, v) => sum + (VOICE_ORDER.indexOf(v) + 1),
    0
  );

  // Base-7 digits (for display only)
  const base7: number[] = [];
  let n = decimal;
  if (n === 0) {
    base7.push(0);
  } else {
    while (n > 0) {
      base7.unshift(n % 7);
      n = Math.floor(n / 7);
    }
  }

  // Total mod 7, with 0 mapped back to 7
  const rawMod = decimal % 7;
  const totalMod7 = rawMod === 0 ? 7 : rawMod;

  const coreVoice = VOICE_ORDER[totalMod7 - 1];
  const principle = PRINCIPLE_LABEL[coreVoice];

  return {
    normalized: voices.join(""),
    voices,
    decimal,
    base7,
    totalMod7,
    coreVoice,
    principle,
  };
}

type Props = {
  initialExpression?: string;
};

export function SevenPrinciplesCalculator({ initialExpression = "" }: Props) {
  const [expression, setExpression] = useState(initialExpression);

  const summary = computeFromExpression(expression);

  return (
    <Card className="mt-2 border-zinc-700/60 bg-zinc-900/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">
          Quick Seven-Principles Calculator
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Type a short path using{" "}
          <span className="font-mono">A E I O U Y Ë</span> or digits{" "}
          <span className="font-mono">1-7</span> and see the math-7 / core
          principle.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="Example: AEIOU, 123, A4Y7, etc."
            className="text-sm"
          />
          <Button
            type="button"
            onClick={() => setExpression(expression.trim())}
            className="shrink-0"
          >
            Recalculate
          </Button>
        </div>

        {!summary ? (
          <p className="text-xs text-muted-foreground">
            Waiting for a valid 7-Voices expression…
          </p>
        ) : (
          <div className="grid gap-2 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Normalized path</span>
              <span className="font-mono">{summary.normalized}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Voices</span>
              <span className="font-mono">
                {summary.voices.join(" → ")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Decimal sum</span>
              <span className="font-mono">{summary.decimal}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Base-7</span>
              <span className="font-mono">
                {summary.base7.join(" ")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Total mod 7</span>
              <span className="font-mono">
                {summary.totalMod7}{" "}
                <span className="text-muted-foreground">
                  ({summary.coreVoice})
                </span>
              </span>
            </div>

            <div className="mt-2 rounded-lg bg-zinc-900/60 p-2">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-pink-300">
                Core Principle
              </div>
              <div className="mt-1 text-xs text-zinc-100">
                {summary.principle}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Support both default and named import styles.
export default SevenPrinciplesCalculator;
