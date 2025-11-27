
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import type { Voice, Operation } from "../shared/heartMath";
import {
  evaluateVoiceEquation,
  numberToVoice,
  computeCycleState,
} from "../shared/heartMath";
import type { CycleState } from "@/shared/engineShape";


interface CalculatorResult {
  decimal: number;
  base7: number[];
  voices: Voice[];
  principle: string;
  cycleState: CycleState;
  description: string;
}

const VOICES: Voice[] = ["A", "E", "I", "O", "U", "Y", "Ë"];

function parseVoicesFromString(input: string): Voice[] {
  const cleaned = input
    .toUpperCase()
    .replace(/[^AEIOUYË]/g, "") // keep only allowed
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
  const digits = matches.map((d) => Number(d));

  const voices: Voice[] = [];
  for (const n of digits) {
    try {
      // cast to any to avoid TS complaining if heartMath
      // uses a narrower numeric type
      const v = numberToVoice(n as any) as Voice;
      if (VOICES.includes(v)) {
        voices.push(v);
      }
    } catch {
      // ignore invalid numbers
    }
  }
  return voices;
}


function describePrinciple(principle: string, cycleState: CycleState): string {
  const core = principle.toLowerCase();

  if (core.includes("truth")) {
    if (cycleState === "balanced") return "Clear truth expressed in a stable way.";
    if (cycleState === "open") return "Truth is opening new cycles and revelations.";
    return "Truth is pushing hard, risking overload or dogma.";
  }

  if (core.includes("expansion")) {
    if (cycleState === "balanced") return "Healthy expansion and growth in all directions.";
    if (cycleState === "open") return "Expansion is just starting to open new space.";
    return "Expansion is intense and may be stretching limits.";
  }

  if (core.includes("insight")) {
    if (cycleState === "balanced") return "Insight is sharp and grounded in reality.";
    if (cycleState === "open") return "New insights are emerging and inviting exploration.";
    return "Insight is overactive and may cause mental overload.";
  }

  if (core.includes("balance")) {
    if (cycleState === "balanced") return "Forces are in equilibrium; cycles are harmonized.";
    if (cycleState === "open") return "Balance is forming but still in motion.";
    return "Balance is under pressure; something is overweight.";
  }

  if (core.includes("unity")) {
    if (cycleState === "balanced") return "Unity is stable and inclusive.";
    if (cycleState === "open") return "New unities are forming and inviting connection.";
    return "Unity is intense and may become fusion or collapse.";
  }

  if (core.includes("network")) {
    if (cycleState === "balanced") return "Networks are coherent and trustworthy.";
    if (cycleState === "open") return "New links and relations are being woven.";
    return "Network is overloaded with signals and connections.";
  }

  if (core.includes("evolution")) {
    if (cycleState === "balanced") return "Evolution is steady and sustainable.";
    if (cycleState === "open") return "Evolution is opening a new phase or generation.";
    return "Evolution is rapid and may become chaotic or disruptive.";
  }

  // Fallback
  return `This path leans toward ${principle} in a ${cycleState} cycle.`;
}

export const SevenPrinciplesCalculator: React.FC = () => {
  const [mode, setMode] = useState<"voices" | "numbers">("voices");
  const [leftInput, setLeftInput] = useState<string>("A");
  const [rightInput, setRightInput] = useState<string>("O");
  const [op, setOp] = useState<string>("+");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);

    const leftVoices =
      mode === "voices"
        ? parseVoicesFromString(leftInput)
        : parseVoicesFromNumbers(leftInput);

    const rightVoices =
      mode === "voices"
        ? parseVoicesFromString(rightInput)
        : parseVoicesFromNumbers(rightInput);

    if (leftVoices.length === 0 || rightVoices.length === 0) {
      setResult(null);
      setError("Please provide at least one valid voice/number on each side.");
      return;
    }

    try {
      const raw = evaluateVoiceEquation(
        leftVoices.join(''),
        rightVoices.join(''),
        op as Operation
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

  const expressionLabel =
    mode === "voices"
      ? "Voices (A/E/I/O/U/Y/Ë)"
      : "Numbers (1–7, any separators)";

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Seven-Principles Calculator</CardTitle>
        <CardDescription>
          Uses the same Heart Math engine as the core, but as a sandbox
          (does not affect the word result).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="w-full md:w-40">
            <label className="block text-sm mb-1">Input mode</label>
            <Select
              value={mode}
              onValueChange={(v) => setMode(v as "voices" | "numbers")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="voices">Voices (A–Ë)</SelectItem>
                <SelectItem value="numbers">Numbers (1–7)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="block text-sm mb-1">Left expression</label>
            <Input
              value={leftInput}
              onChange={(e) => setLeftInput(e.target.value)}
              placeholder={
                mode === "voices" ? "e.g. AOU" : "e.g. 1-4-7"
              }
            />
          </div>

          <div className="w-20">
            <label className="block text-sm mb-1">Op</label>
            <Select value={op} onValueChange={(v) => setOp(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+">+</SelectItem>
                <SelectItem value="-">−</SelectItem>
                <SelectItem value="*">×</SelectItem>
                <SelectItem value="/">÷</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="block text-sm mb-1">Right expression</label>
            <Input
              value={rightInput}
              onChange={(e) => setRightInput(e.target.value)}
              placeholder={
                mode === "voices" ? "e.g. IY" : "e.g. 3,6"
              }
            />
          </div>

          <div className="w-full md:w-auto md:self-end">
            <Button className="w-full" onClick={handleCalculate}>
              Calculate
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {expressionLabel}. You can type with or without separators, e.g.
          &nbsp;
          <code>AOU</code>, <code>A-O-U</code>, <code>1 4 7</code>.
        </p>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        {result && (
          <div className="mt-3 space-y-2 border-t pt-3">
            <div className="text-sm">
              <span className="font-semibold">Decimal:</span>{" "}
              {result.decimal}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Base-7 digits:</span>{" "}
              {result.base7.join(" ")}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Voices path:</span>{" "}
              {result.voices.join(" → ")}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Principle:</span>{" "}
              {result.principle}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Cycle state:</span>{" "}
              {result.cycleState}
            </div>
            <div className="text-sm text-muted-foreground">
              {result.description}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
