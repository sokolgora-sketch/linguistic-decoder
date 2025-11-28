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
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

import {
  evaluateVoiceEquation,
  Operation,
  CycleState,
} from "../shared/heartMath";
import { SevenCalcResult } from "@/shared/sevenPrinciplesCalc";

// Local UI-only ops: what the user sees
type OperationSymbol = "+" | "-" | "*" | "/";
type InputMode = "voices" | "numbers";

// Voices type – just for typing the result
type Voice = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";

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

// Map UI symbols to heartMath Operation
const OP_SYMBOL_TO_OPERATION: Record<OperationSymbol, Operation> = {
  "+": "add",
  "-": "subtract",
  "*": "multiply",
  "/": "divide",
};

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

function parseInputToExpr(input: string, mode: InputMode): string {
  if (!input.trim()) return "";

  const voices =
    mode === "voices"
      ? parseVoicesFromString(input)
      : parseVoicesFromNumbers(input);

  return voices.join("");
}

// ---------- component ----------

const HeartCalculator: React.FC = () => {
  // Start empty – no auto AO+A
  const [leftInput, setLeftInput] = useState("");
  const [rightInput, setRightInput] = useState("");
  const [op, setOp] = useState<OperationSymbol>("+");
  const [mode, setMode] = useState<InputMode>("voices");
  const [result, setResult] = useState<SevenCalcResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);

    const leftExpr = parseInputToExpr(leftInput, mode);
    const rightExpr = parseInputToExpr(rightInput, mode);

    if (!leftExpr || !rightExpr) {
      setResult(null);
      setError("Please enter at least one valid voice/number on each side.");
      return;
    }

    try {
      const raw = evaluateVoiceEquation(
        leftExpr,
        rightExpr,
        OP_SYMBOL_TO_OPERATION[op]
      ) as SevenCalcResult;
      setResult(raw);
    } catch (e) {
      console.error(e);
      setResult(null);
      setError("Calculator failed – check inputs or heart math wiring.");
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>💗 Seven-Principles Calculator</CardTitle>
          <CardDescription>
            Combine two Voice expressions (A, E, I, O, U, Y, Ë or 1–7).
          </CardDescription>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Mode</span>
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(v) => v && setMode(v as InputMode)}
          >
            <ToggleGroupItem value="voices">Voices</ToggleGroupItem>
            <ToggleGroupItem value="numbers">1–7</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <Input
              value={leftInput}
              onChange={(e) => setLeftInput(e.target.value)}
              placeholder={mode === "voices" ? "Left (e.g. AE)" : "Left (e.g. 147)"}
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
              placeholder={mode === "voices" ? "Right (e.g. A)" : "Right (e.g. 36)"}
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          In <strong>Voices</strong> mode, type vowels (<code>AEIOUYË</code>).
          In <strong>1–7</strong> mode, type digits 1–7 in any format:
          <code>147</code>, <code>1-4-7</code>, <code>3 6</code>. Digits map to A–Ë.
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
              <span className="font-semibold">Expression:</span>{" "}
              {result.expression}
            </div>
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HeartCalculator;
