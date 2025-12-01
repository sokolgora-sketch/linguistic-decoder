"use client";

import React, { useState } from "react";
import type { AnalysisResult } from "../shared/analysisAdapter";
import { fetchWordClient } from "../shared/fetchWordClient";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "../hooks/use-toast";

type ComparePanelProps = {
  mode?: "strict" | "relaxed";
  defaultCoreOnly?: boolean;
};

export default function ComparePanel({
  mode = "strict",
  defaultCoreOnly = true,
}: ComparePanelProps) {
  const [leftWord, setLeftWord] = useState("");
  const [rightWord, setRightWord] = useState("");
  const [coreOnly, setCoreOnly] = useState(defaultCoreOnly);
  const [strict] = useState(mode === "strict");

  const [leftResult, setLeftResult] = useState<AnalysisResult | null>(null);
  const [rightResult, setRightResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const handleCompare = async () => {
    const w1 = leftWord.trim();
    const w2 = rightWord.trim();
    if (!w1 || !w2) {
      toast({
        variant: "destructive",
        title: "Type two words first",
      });
      return;
    }

    setIsLoading(true);
    try {
      const [a, b] = await Promise.all([
        fetchWordClient(w1, { mode: strict ? "strict" : "relaxed", coreOnly }),
        fetchWordClient(w2, { mode: strict ? "strict" : "relaxed", coreOnly }),
      ]);
      setLeftResult(a);
      setRightResult(b);
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Compare failed",
        description: "Check the dev console for details.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row">
        <Input
          placeholder="First word"
          value={leftWord}
          onChange={(e) => setLeftWord(e.target.value)}
        />
        <Input
          placeholder="Second word"
          value={rightWord}
          onChange={(e) => setRightWord(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={coreOnly}
            onChange={(e) => setCoreOnly(e.target.checked)}
          />
          Core only (Heart)
        </label>

        <Button
          onClick={handleCompare}
          disabled={isLoading}
        >
          {isLoading ? "Comparing…" : "Compare"}
        </Button>
      </div>

      {leftResult && rightResult && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{leftResult.word}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div>Primary path: {leftResult.math7.primaryPath}</div>
              <div>Rings: {leftResult.math7.rings}</div>
              <div>Levels: {leftResult.math7.levels}</div>
              <div>Tension: {leftResult.math7.tension}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{rightResult.word}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div>Primary path: {rightResult.math7.primaryPath}</div>
              <div>Rings: {rightResult.math7.rings}</div>
              <div>Levels: {rightResult.math7.levels}</div>
              <div>Tension: {rightResult.math7.tension}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}
