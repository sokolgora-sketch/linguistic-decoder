"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { evaluateVoiceEquation, VOICE_TO_DIGIT } from "@/shared/heartMath";
import type { SevenCalcResult, SevenOp } from "@/shared/sevenPrinciplesCalc";

type Props = {
  onResult?: (result: SevenCalcResult) => void;
};

export default function HeartCalculator({ onResult }: Props) {
  const [exprA, setExprA] = useState("AO");
  const [exprB, setExprB] = useState("ËA");
  const [op, setOp] = useState<SevenOp>("add");
  const [result, setResult] = useState<SevenCalcResult | null>(null);

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

  return (
    <Card className="mt-6 border border-emerald-600/40 shadow-md">
      <CardHeader>
        <CardTitle>💗 Seven-Principles Calculator</CardTitle>
        <CardDescription>Combine two Voice expressions (A, E, I, O, U, Y, Ë, or 1-7)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input
            value={exprA}
            onChange={(e) => setExprA(e.target.value.toUpperCase())}
            placeholder="First (e.g., AO or 14)"
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
            placeholder="Second (e.g., ËA or 71)"
          />
        </div>

        <Button onClick={handleCalculate} className="w-full mt-2 bg-emerald-700 hover:bg-emerald-600">
          Calculate
        </Button>

        {result && (
          <div className="mt-4 p-3 rounded-lg border border-emerald-500/50 bg-emerald-950/20 text-sm space-y-1">
            <p><strong>Decimal:</strong> {result.decimal}</p>
            <p><strong>Base-7:</strong> {result.base7.join(" ")}</p>
            <p>
              <strong>Voices:</strong> {result.voices.join(" → ")}
              <span className="text-muted-foreground ml-2">
                ({result.voices.map(v => VOICE_TO_DIGIT[v]).join(" → ")})
              </span>
            </p>
            <p>
              <strong>Principle:</strong> <span className="text-emerald-400 text-lg">{result.principle}</span>
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
