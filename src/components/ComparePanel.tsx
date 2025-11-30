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
import { Button } from "./ui/button";
import type { Alphabet } from "@/lib/runAnalysis";

type Mode = "strict" | "open";

type ComparePanelProps = {
  defaultMode?: Mode;
  defaultAlphabet?: Alphabet;
};

type WordResult = {
  word: string;
  error?: string;
  payload?: any;
};

export default function ComparePanel({
  defaultMode = "strict",
  defaultAlphabet = "auto",
}: ComparePanelProps) {
  const [leftWord, setLeftWord] = useState("damage");
  const [rightWord, setRightWord] = useState("study");
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [alphabet] = useState<Alphabet>(defaultAlphabet); // keep UI simple for now

  const [leftResult, setLeftResult] = useState<WordResult | null>(null);
  const [rightResult, setRightResult] = useState<WordResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function fetchWord(word: string): Promise<WordResult | null> {
    const trimmed = word.trim();
    if (!trimmed) {
      return { word: "", error: "Empty word" };
    }

    const params = new URLSearchParams({
      word: trimmed,
      mode,
      alphabet,
    });

    try {
      const res = await fetch(`/api/analyze?${params.toString()}`, {
        method: "GET",
      });

      if (!res.ok) {
        console.error(
          "Compare /api/analyze failed",
          res.status,
          await res.text()
        );
        return { word: trimmed, error: `HTTP ${res.status}` };
      }

      const json = await res.json();
      return { word: trimmed, payload: json };
    } catch (err) {
      console.error("Compare /api/analyze exception", err);
      return { word: trimmed, error: "Network error" };
    }
  }

  async function handleCompare() {
    setLoading(true);
    setErrorMessage(null);

    try {
      const [left, right] = await Promise.all([
        fetchWord(leftWord),
        fetchWord(rightWord),
      ]);

      setLeftResult(left);
      setRightResult(right);

      if (!left?.payload && !right?.payload) {
        setErrorMessage("No results – check the /api/analyze endpoint.");
      }
    } finally {
      setLoading(false);
    }
  }

  function renderResult(result: WordResult | null) {
    if (!result || !result.payload) {
      return <div className="text-xs text-muted-foreground">(no result)</div>;
    }

    const p = result.payload;

    const pathSummary =
      Array.isArray(p?.primaryPath?.voicePath) &&
      p.primaryPath.voicePath.length > 0
        ? p.primaryPath.voicePath.join(" → ")
        : "(no path)";

    return (
      <div className="text-xs leading-relaxed space-y-1">
        <div className="font-mono break-all">{result.word}</div>
        <div>Engine: {p.engineVersion ?? "?"}</div>
        <div>Mode: {p.mode}</div>
        <div className="font-mono text-[11px]">Path: {pathSummary}</div>
      </div>
    );
  }

  return (
    <Card id="compare-two-words">
      <CardHeader>
        <CardTitle>Compare Two Words</CardTitle>
        <CardDescription>
          Analyze two words side by side and compare their Seven-Voices paths.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            value={leftWord}
            onChange={(e) => setLeftWord(e.target.value)}
            placeholder="First word"
          />
          <Input
            value={rightWord}
            onChange={(e) => setRightWord(e.target.value)}
            placeholder="Second word"
          />
        </div>

        {/* Mode + button */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              id="compare-strict"
              type="checkbox"
              checked={mode === "strict"}
              onChange={(e) => setMode(e.target.checked ? "strict" : "open")}
              className="h-3 w-3"
            />
            <label htmlFor="compare-strict">Strict</label>
            <span className="text-[11px] opacity-70">(mode: {mode})</span>
          </div>

          <Button size="sm" onClick={handleCompare} disabled={loading}>
            {loading ? "Comparing…" : "Compare"}
          </Button>
        </div>

        {errorMessage && (
          <p className="text-xs text-destructive whitespace-pre-line">
            {errorMessage}
          </p>
        )}

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-border/60">
          <div className="rounded-md bg-muted/40 px-3 py-2">
            <div className="text-xs font-semibold mb-1">
              {leftWord || "—"}
            </div>
            {renderResult(leftResult)}
          </div>
          <div className="rounded-md bg-muted/40 px-3 py-2">
            <div className="text-xs font-semibold mb-1">
              {rightWord || "—"}
            </div>
            {renderResult(rightResult)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
