"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { evaluateVoiceEquation, VOICE_TO_DIGIT } from "@/shared/heartMath";
import type { SevenCalcResult, SevenOp } from "@/shared/sevenPrinciplesCalc";

type Props = {
  onResult?: (result: SevenCalcResult) => void;
};

type CalculatorMode = "voices" | "numbers";

export default function HeartCalculator({ onResult }: Props) {
  const [exprA, setExprA] = useState("AO");
  const [exprB, setExprB] = useState("ËA");
  const [op, setOp] = useState<SevenOp>("add");
  const [result, setResult] = useState<SevenCalcResult | null>(null);
  const [mode, setMode] = useState<CalculatorMode>("voices");

  const handleCalculate = () => {
    try {
      const res = evaluateVoiceEquation(exprA, exprB, op);
      const calcResult: SevenCalcResult = {
        leftExpr: exprA,
        rightExpr: exprB,
        op,
        decimal: res.decimal,
        base7: res.base7,
        voices: res.voices,
        principle: res.principle,
      };
      setResult(calcResult);
      onResult?.(calcResult);
    } catch (e) {
      console.error("Error evaluating:", e);
      setResult(null);
    }
  };

  // Normalise input based on mode:
  const handleChangeA = (raw: string) => {
    const upper = raw.toUpperCase();
    if (mode === "voices") {
      // keep only valid vowels A,E,I,O,U,Y,Ë
      setExprA(upper.replace(/[^AEIOUYË]/g, ""));
    } else {
      // numeric mode: keep only digits 1–7
      setExprA(upper.replace(/[^1-7]/g, ""));
    }
  };

  const handleChangeB = (raw: string) => {
    const upper = raw.toUpperCase();
    if (mode === "voices") {
      setExprB(upper.replace(/[^AEIOUYË]/g, ""));
    } else {
      setExprB(upper.replace(/[^1-7]/g, ""));
    }
  };

  return (
    <Card className="mt-6 border border-emerald-600/40 shadow-md">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <span role="img" aria-hidden="true">
              💗
            </span>
            Seven-Principles Calculator
          </CardTitle>
          <CardDescription>
            Combine two Voice expressions (A, E, I, O, U, Y, Ë, or 1–7)
          </CardDescription>
        </div>

        {/* Tiny mode toggle */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Mode</span>
          <div className="inline-flex rounded-full border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setMode("voices")}
              className={
                "px-2 py-1 transition-colors " +
                (mode === "voices"
                  ? "bg-emerald-600 text-emerald-50"
                  : "bg-background text-muted-foreground hover:text-foreground")
              }
            >
              Voices
            </button>
            <button
              type="button"
              onClick={() => setMode("numbers")}
              className={
                "px-2 py-1 transition-colors " +
                (mode === "numbers"
                  ? "bg-emerald-600 text-emerald-50"
                  : "bg-background text-muted-foreground hover:text-foreground")
              }
            >
              1–7
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input
            value={exprA}
            onChange={(e) => handleChangeA(e.target.value)}
            placeholder={
              mode === "voices" ? "First (e.g., AO)" : "First (e.g., 16)"
            }
          />
          <Select value={op} onValueChange={(v) => setOp(v as SevenOp)}>
            <SelectTrigger>
              <SelectValue placeholder="Operation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="add">Add</SelectItem>
              <SelectItem value="subtract">Subtract</SelectItem>
              <SelectItem value="multiply">Multiply</SelectItem>
              <SelectItem value="divide">Divide</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={exprB}
            onChange={(e) => handleChangeB(e.target.value)}
            placeholder={
              mode === "voices" ? "Second (e.g., ËA)" : "Second (e.g., 71)"
            }
          />
        </div>

        <Button
          onClick={handleCalculate}
          className="w-full mt-2 bg-emerald-700 hover:bg-emerald-600"
        >
          Calculate
        </Button>

        {result && (
          <div className="mt-4 p-3 rounded-lg border border-emerald-500/50 bg-emerald-950/20 text-sm space-y-1">
            <p>
              <strong>Decimal:</strong> {result.decimal}
            </p>
            <p>
              <strong>Base-7:</strong> {result.base7.join(" ")}
            </p>
            <p>
              <strong>Voices:</strong> {result.voices.join(" → ")}
              <span className="text-muted-foreground ml-2">
                (
                {result.voices
                  .map((v) => VOICE_TO_DIGIT[v])
                  .join(" → ")}
                )
              </span>
            </p>
            <p>
              <strong>Principle:</strong>{" "}
              <span className="text-emerald-400 text-lg">
                {result.principle}
              </span>
              <span className="text-muted-foreground ml-2">
                ({VOICE_TO_DIGIT[result.principle]})
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
