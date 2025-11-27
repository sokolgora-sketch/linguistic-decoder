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

// We only use the function from heartMath – no types.
import { evaluateVoiceEquation } from "../shared/heartMath";

// Local types – we don't rely on heartMath.ts types here
type Voice = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";
type OperationSymbol = "+" | "-" | "*" | "/";
type CycleState = "open" | "balanced" | "overloaded";

interface CalculatorResult {
  decimal: number;
  base7: number[];
  voices: Voice[];
  principle: string;
  cycleState: CycleState;
  description: string;
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

// ---------- cycle state (local copy, same logic as engine) ----------

function computeCycleStateFromTotal(total: number): CycleState {
  const mod = ((total % 7) + 7) % 7; // 0..6

  // Mirror your engine thresholds; adjust if yours differ.
  if (mod === 0 || mod === 3) return "balanced";
  if (mod === 1 || mod === 6) return "open";
  return "overloaded";
}

// ---------- parsing helpers ----------

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

function parseSmart(input: string): Voice[] {
  const hasVowel = /[AEIOUYË]/i.test(input);
  const hasDigit = /[1-7]/.test(input);

  if (hasVowel) return parseVoicesFromString(input);
  if (hasDigit) return parseVoicesFromNumbers(input);
  return [];
}

// ---------- description text ----------

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

// ---------- component ----------

export const SevenPrinciplesCalculator: React.FC = () => {
  // Start EMPTY so it doesn't auto-show AO + A
  const [leftInput, setLeftInput] = useState("");
  const [rightInput, setRightInput] = useState("");
  const [op, setOp] = useState<OperationSymbol>("+");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);

    const leftVoices = parseSmart(leftInput);
    const rightVoices = parseSmart(rightInput);

    if (!leftVoices.length || !rightVoices.length) {
      setResult(null);
      setError("Please enter at least one valid voice/number on each side.");
      return;
    }

    try {
      // Turn voices into expressions like "AE" before sending to heartMath
      const leftExpr = leftVoices.join("");
      const rightExpr = rightVoices.join("");

      const raw = evaluateVoiceEquation(
        leftExpr,
        rightExpr,
        op as any // we don't care about the exact Operation type here
      ) as any;

      const decimal: number = raw.decimal ?? 0;

      const base7Array: number[] = Array.isArray(raw.base7)
        ? raw.base7
        : String(raw.base7 ?? "")
            .split("")
            .map((d: string) => Number(d))
            .filter((n: number) => !Number.isNaN(n));

      const voicesFromRaw: Voice[] = raw.voices ?? [];
      const principle: string = raw.principle ?? "Unknown";

      const cycleState = computeCycleStateFromTotal(decimal);
      const description = describePrinciple(principle, cycleState);

      setResult({
        decimal,
        base7: base7Array,
        voices: voicesFromRaw,
        principle,
        cycleState,
        description,
      });
    } catch (e) {
      console.error(e);
      setResult(null);
      setError("Calculator failed – check inputs or heart math wiring.");
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
          You can type vowels (<code>AEIOUYË</code>) or digits 1–7 in any format:
          <code>147</code>, <code>1-4-7</code>, <code>3 6</code>. If any vowel appears,
          it treats the input as Voices; otherwise it maps digits 1–7 to A–Ë.
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
              {result.voices.length ? result.voices.join(" → ") : "—"}
            </div>
            <div>
              <span className="font-semibold">Principle:</span>{" "}
              {result.principle}
            </div>
            <div>
              <span className="font-semibold">Cycle state:</span>{" "}
              {result.cycleState}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {result.description}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
