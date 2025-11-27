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

import type { Voice, CycleState } from "../shared/heartMath";
import {
  evaluateVoiceEquation,
  computeCycleStateFromTotal,
} from "../shared/heartMath";

type OperationSymbol = "+" | "-" | "*" | "/";
type Operation = "add" | "subtract" | "multiply" | "divide";

interface CalculatorResult {
  decimal: number;
  base7: number[];
  voices: Voice[];
  principle: string;
  cycleState: CycleState;
}

const VOICES: Voice[] = ["A", "E", "I", "O", "U", "Y", "Ë"];

const NUMBER_TO_VOICE: Record<string, Voice> = {
  "1": "A",
  "2": "E",
  "3": "I",
  "4": "O",
  "5": "U",
  "6": "Y",
  "7": "Ë",
};

// -------- parsers --------

function parseVoicesFromString(input: string): Voice[] {
  const cleaned = input
    .toUpperCase()
    .replace(/[^AEIOUYË]/g, "")
    .split("")
    .filter(Boolean);

  const voices: Voice[] = [];
  for (const ch of cleaned) {
    if (VOICES.includes(ch as Voice)) {
      voices.push(ch as Voice);
    }
  }
  return voices;
}

function parseVoicesFromNumbers(input: string): Voice[] {
  const matches = input.match(/[1-7]/g) ?? [];
  return matches
    .map((d) => NUMBER_TO_VOICE[d])
    .filter((v): v is Voice => Boolean(v));
}

function hasVowel(input: string) {
  return /[AEIOUYË]/i.test(input);
}

function hasDigit(input: string) {
  return /[1-7]/.test(input);
}

function parseSmart(input: string): Voice[] {
  if (hasVowel(input)) return parseVoicesFromString(input);
  if (hasDigit(input)) return parseVoicesFromNumbers(input);
  return [];
}

// -------- description text (UI only) --------

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

// -------- component --------

export const SevenPrinciplesCalculator: React.FC = () => {
  const [leftInput, setLeftInput] = useState("AE");
  const [rightInput, setRightInput] = useState("A");
  const [op, setOp] = useState<OperationSymbol>("+");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);

    const leftVoices = parseSmart(leftInput);
    const rightVoices = parseSmart(rightInput);

    if (!leftVoices.length || !rightVoices.length) {
      setResult(null);
      setDescription(null);
      setError("Please enter at least one valid voice/number on each side.");
      return;
    }

    try {
      const opMap: Record<OperationSymbol, Operation> = {
        "+": "add",
        "-": "subtract",
        "*": "multiply",
        "/": "divide",
      };
      
      const raw = evaluateVoiceEquation(
        leftVoices.join(""),
        rightVoices.join(""),
        opMap[op]
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

      const cycleState = computeCycleStateFromTotal(decimal);
      const desc = describePrinciple(principle, cycleState);

      setResult({
        decimal,
        base7: base7Array,
        voices,
        principle,
        cycleState,
      });
      setDescription(desc);
    } catch (e) {
      console.error(e);
      setResult(null);
      setDescription(null);
      setError("Calculator failed – check inputs or heartMath wiring.");
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>💗 Seven-Principles Calculator</CardTitle>
        <CardDescription>
          Combine two Voice expressions (A, E, I, O, U, Y, Ë, or digits 1–7).
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <Input
              value={leftInput}
              onChange={(e) => setLeftInput(e.target.value)}
              placeholder="Left (e.g. AE or 147)"
            />
          </div>

          <div className="w-28">
            <select
              className="w-full rounded-md border bg-transparent px-2 py-1 text-sm"
              value={op}
              onChange={(e) => setOp(e.target.value as OperationSymbol)}
            >
              <option value="+">Add</option>
              <option value="-">Subtract</option>
              <option value="*">Multiply</option>
              <option value="/">Divide</option>
            </select>
          </div>

          <div className="flex-1">
            <Input
              value={rightInput}
              onChange={(e) => setRightInput(e.target.value)}
              placeholder="Right (e.g. A or 36)"
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          You can type vowels (<code>AEIOUYË</code>) or digits 1–7 in any format
          (<code>147</code>, <code>1-4-7</code>, <code>3 6</code>). If any vowel
          appears, it treats the input as Voices; otherwise it maps digits 1–7 to A–Ë.
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
            {description && (
              <div className="text-xs text-muted-foreground mt-1">
                {description}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
