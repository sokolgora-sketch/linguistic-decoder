
"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { evaluateVoiceEquation, VOICE_TO_DIGIT } from "@/shared/heartMath";
import type { SevenCalcResult, SevenOp } from "@/shared/sevenPrinciplesCalc";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type InputMode = 'voices' | 'numbers';

type Props = {
  onResult?: (result: SevenCalcResult) => void;
};

export default function HeartCalculator({ onResult }: Props) {
  const [exprA, setExprA] = useState("AO");
  const [exprB, setExprB] = useState("ËA");
  const [op, setOp] = useState<SevenOp>("add");
  const [result, setResult] = useState<SevenCalcResult | null>(null);
  const [mode, setMode] = useState<InputMode>('voices');

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

  const voicesDisplay = result ? result.voices.join(' → ') : '';
  const digitsDisplay = result ? result.voices.map(v => VOICE_TO_DIGIT[v]).join(' → ') : '';

  const primaryDisplay = mode === 'voices' ? voicesDisplay : digitsDisplay;
  const secondaryDisplay = mode === 'voices' ? digitsDisplay : voicesDisplay;

  const principleDigit = result ? VOICE_TO_DIGIT[result.principle] : undefined;

  return (
    <Card className="mt-6 border border-emerald-600/40 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
            <CardTitle className="flex items-center gap-2">
                <span role="img" aria-hidden="true">💗</span>
                Seven-Principles Calculator
            </CardTitle>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Input</span>
              <ToggleGroup type="single" value={mode} onValueChange={(v: InputMode) => v && setMode(v)} size="sm">
                <ToggleGroupItem value="voices">Voices</ToggleGroupItem>
                <ToggleGroupItem value="numbers">1–7</ToggleGroupItem>
              </ToggleGroup>
            </div>
        </div>
        <CardDescription>Combine two Voice expressions as letters (A, E, I, O, U, Y, Ë) or numbers (1–7).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input
            value={exprA}
            onChange={(e) => setExprA(e.target.value.toUpperCase())}
            placeholder={mode === 'voices' ? "First (e.g., AO)" : "First (e.g., 14)"}
          />
          <Select value={op} onValueChange={(v) => setOp(v as any)}>
            <SelectTrigger><SelectValue placeholder="Operation" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="add">Add</SelectItem>
              <SelectItem value="subtract">Subtract</SelectItem>
              <SelectItem value="multiply">Multiply</SelectItem>
              <SelectItem value="divide">Divide</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={exprB}
            onChange={(e) => setExprB(e.target.value.toUpperCase())}
            placeholder={mode === 'voices' ? "Second (e.g., ËA)" : "Second (e.g., 71)"}
          />
        </div>

        <Button onClick={handleCalculate} className="w-full mt-2 bg-emerald-700 hover:bg-emerald-600">
          Calculate
        </Button>

        {result && (
          <div className="mt-4 p-3 rounded-lg border border-emerald-500/50 bg-emerald-950/20 text-sm space-y-1">
            <div><strong>Decimal:</strong> {result.decimal}</div>
            <div><strong>Base-7:</strong> {result.base7.join(" ")}</div>
            <div>
              <strong>Voices:</strong>{' '}
              {primaryDisplay || '—'}
              {secondaryDisplay && (
                <span className="ml-2 text-muted-foreground">
                  ({secondaryDisplay})
                </span>
              )}
            </div>
            {result.principle && (
              <div>
                <strong>Principle:</strong>{' '}
                {mode === 'voices' ? result.principle : principleDigit}
                <span className="ml-2 text-muted-foreground">
                  ({mode === 'voices' ? principleDigit : result.principle})
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
