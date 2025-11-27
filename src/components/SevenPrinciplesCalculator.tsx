'use client';

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import type { Voice, Operation, CycleState } from "../shared/heartMath";
import {
  evaluateVoiceEquation,
  numberToVoice,
  computeCycleState,
} from "../shared/heartMath";

type Mode = "voices" | "numbers";

interface CalculatorResult {
  decimal: number;
  base7: number[];
  voices: Voice[];
  principle: string;
  cycleState: CycleState;
  description: string;
}

// Allowed voices
const VOICES: Voice[] = ["A", "E", "I", "O", "U", "Y", "Ë"];

// ---------- Parsing helpers ----------

function parseVoicesFromString(input: string): string {
  // Keeps only A, E, I, O, U, Y, Ë
  return input
    .toUpperCase()
    .replace(/[^AEIOUYË]/g, "");
}

function parseNumbersFromString(input: string): string {
  // Accept anything, pull out digits 1–7
  return (input.match(/[1-7]/g) ?? []).join('');
}

// ---------- UI-only explanation text ----------

function describePrinciple(principle: string, cycleState: CycleState): string {
  const core = principle.toLowerCase();

  if (core.includes("truth")) {
    if (cycleState === "balanced") return "Clear truth expressed in a stable way.";
    if (cycleState === "open") return "Truth is opening new cycles and revelations.";
    return "Truth is pushing hard and may slip into dogma.";
  }

  if (core.includes("expansion")) {
    if (cycleState === "balanced") return "Healthy expansion and growth in all directions.";
    if (cycleState === "open") return "Expansion is just starting to open new space.";
    return "Expansion is intense and may be stretching limits.";
  }

  if (core.includes("insight")) {
    if (cycleState === "balanced") return "Insight is sharp and grounded.";
    if (cycleState === "open") return "New insights are emerging and inviting exploration.";
    return "Insight is overactive and may cause overload.";
  }

  if (core.includes("balance")) {
    if (cycleState === "balanced") return "Forces are in equilibrium; cycles are harmonized.";
    if (cycleState === "open") return "Balance is forming but still in motion.";
    return "Balance is under pressure; something is overweight.";
  }

  if (core.includes("unity")) {
    if (cycleState === "balanced") return "Unity is stable and inclusive.";
    if (cycleState === "open") return "New unities are forming and inviting connection.";
    return "Unity is intense and may collapse or fuse too hard.";
  }

  if (core.includes("network")) {
    if (cycleState === "balanced") return "Networks are coherent and trustworthy.";
    if (cycleState === "open") return "New links and relations are being woven.";
    return "Network is overloaded with signals.";
  }

  if (core.includes("evolution")) {
    if (cycleState === "balanced") return "Evolution is steady and sustainable.";
    if (cycleState === "open") return "Evolution is opening a new phase or generation.";
    return "Evolution is rapid and may become chaotic.";
  }

  return `This path leans toward ${principle} in a ${cycleState} cycle.`;
}

// ---------- Component ----------

export const SevenPrinciplesCalculator: React.FC = () => {
  const [mode, setMode] = useState<Mode>("voices");
  const [leftInput, setLeftInput] = useState("AE");
  const [rightInput, setRightInput] = useState("A");
  const [op, setOp] = useState<Operation>("add");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);

    const leftExpr =
      mode === "voices"
        ? parseVoicesFromString(leftInput)
        : parseNumbersFromString(leftInput);

    const rightExpr =
      mode === "voices"
        ? parseVoicesFromString(rightInput)
        : parseNumbersFromString(rightInput);

    if (leftExpr.length === 0 || rightExpr.length === 0) {
      setResult(null);
      setError("Please provide at least one valid voice/number on each side.");
      return;
    }

    try {
      const raw = evaluateVoiceEquation(
        leftExpr,
        rightExpr,
        op
      ) as any;

      const decimal: number = raw.decimal ?? 0;

      const base7Array: number[] = Array.isArray(raw.base7)
        ? raw.base7
        : String(raw.base7 ?? "")
            .split("")
            .map((d: string) => Number(d))
            .filter((n: number) => !Number.isNaN(n));

      const voices: Voice[] = raw.voices ?? [];
      const principle: string = raw.principle ?? "Unknown";

      const cycleState = computeCycleState(decimal);
      const description = describePrinciple(principle, cycleState);

      setResult({
        decimal,
        base7: base7Array,
        voices,
        principle,
        cycleState,
        description,
      });

    } catch (e) {
      console.error(e);
      setResult(null);
      setError("Calculator failed – check inputs or heartMath wiring.");
    }
  };

  const expressionHint =
    mode === "voices"
      ? "Type A, E, I, O, U, Y, Ë (with or without separators)."
      : "Type digits 1–7 in any format (e.g. 1-4-7, 2 5, 361).";

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>💗 Seven-Principles Calculator</CardTitle>
          <CardDescription>
            Combine two Voice expressions (A, E, I, O, U, Y, Ë, or 1–7)
          </CardDescription>
        </div>

        {/* Mode toggle – this is the bit that *must* drive the `mode` state */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Mode</span>
          <button
            type="button"
            onClick={() => setMode("voices")}
            className={
              "px-3 py-1 rounded-full border text-xs " +
              (mode === "voices"
                ? "bg-slate-800 border-slate-500 text-white"
                : "bg-transparent border-slate-700 text-slate-400")
            }
          >
            Voices
          </button>
          <button
            type="button"
            onClick={() => setMode("numbers")}
            className={
              "px-3 py-1 rounded-full border text-xs " +
              (mode === "numbers"
                ? "bg-slate-800 border-slate-500 text-white"
                : "bg-transparent border-slate-700 text-slate-400")
            }
          >
            1–7
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Inputs row */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <Input
              value={leftInput}
              onChange={(e) => setLeftInput(e.target.value)}
              placeholder={mode === "voices" ? "e.g. AE" : "e.g. 1-4-7"}
            />
          </div>

          <div className="w-28">
            <select
              className="w-full rounded-md border bg-transparent px-2 py-1 text-sm h-10 border-input"
              value={op}
              onChange={(e) => setOp(e.target.value as Operation)}
            >
              <option value="add">Add</option>
              <option value="subtract">Subtract</option>
              <option value="multiply">Multiply</option>
              <option value="divide">Divide</option>
            </select>
          </div>

          <div className="flex-1">
            <Input
              value={rightInput}
              onChange={(e) => setRightInput(e.target.value)}
              placeholder={mode === "voices" ? "e.g. A" : "e.g. 3-6"}
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {expressionHint}
        </p>

        <Button className="w-full" onClick={handleCalculate}>
          Calculate
        </Button>

        {error && (
          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>
        )}

        {result && (
          <div className="mt-3 space-y-2 border-t border-slate-700 pt-3 text-sm">
            <div>
              <span className="font-semibold">Decimal:</span>{" "}
              {result.decimal}
            </div>
            <div>
              <span className="font-semibold">Base-7:</span>{" "}
              {result.base7.length ? result.base7.join(" ") : "—"}
            </div>
            <div>
              <span className="font-semibold">Voices:</span>{" "}
              {result.voices.length
                ? result.voices.join(" → ")
                : "—"}
            </div>
            <div>
              <span className="font-semibold">Principle:</span>{" "}
              {result.principle}
            </div>
            <div>
              <span className="font-semibold">Cycle state:</span>{" "}
              {result.cycleState}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
