
"use client";

import React, { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { WordMatrixCard } from "@/components/WordMatrix";
import type { AnalyzeWordResultUI, HistoryItem } from "@/shared/resultsUI";
import { buildShareSnippet } from "@/lib/shareSnippet";
import { useToast } from "@/hooks/use-toast";
import {
  buildZhejiSummary,
  invertRootPolarity,
  buildInvertedStatement,
  buildZhejiSnippet,
} from "@/lib/zhejiSummary";

function renderWordMatrix(result: AnalyzeWordResultUI | null): React.ReactNode {
  if (!result?.wordMatrix) {
    return null;
  }
  return <WordMatrixCard matrix={result.wordMatrix} />;
}

export default function Page() {
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeWordResultUI | null>(null);
  const [zhejiInverted, setZhejiInverted] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mode, setMode] = useState<"strict" | "explore">("strict");
  const [alphabet, setAlphabet] = useState<"auto" | "latin" | "albanian">(
    "auto"
  );

  const { toast } = useToast();

  const zheji = result ? buildZhejiSummary(result) : null;

  const effectivePolarity =
    zheji && zhejiInverted
      ? invertRootPolarity(zheji.rootPolarity)
      : zheji?.rootPolarity ?? "Static";

  const effectiveStatement =
    zheji && zhejiInverted
      ? buildInvertedStatement(zheji.functionalStatement)
      : zheji?.functionalStatement ?? "";

  const effectiveSubjectRole = zheji
    ? zhejiInverted
      ? zheji.objectRole
      : zheji.subjectRole
    : "—";
  const effectiveObjectRole = zheji
    ? zhejiInverted
      ? zheji.subjectRole
      : zheji.objectRole
    : "—";
  const effectiveModifierRole = zheji
    ? zheji.modifierRole.replace(zheji.rootPolarity, effectivePolarity)
    : "—";

  async function handleAnalyze(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = word.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: trimmed,
          mode,
          alphabet,
        }),
      });

      if (!response.ok) {
        let message = `Server error (HTTP ${response.status})`;
        try {
          const text = await response.text();
          if (text) {
            try {
              const parsed = JSON.parse(text);
              if (parsed?.error) {
                message = parsed.error as string;
              } else {
                message = text;
              }
            } catch {
              message = text;
            }
          }
        } catch {
          // ignore
        }
        console.error("Analyze request failed:", response.status, message);
        setError(message);
        return;
      }

      const data = (await response.json()) as AnalyzeWordResultUI;

      setResult(data);
      setZhejiInverted(false);
      setHistory((prev) =>
        [
          {
            word: data.word,
            voicePath: data.primaryPath?.voicePath ?? "—",
            levelPath: data.primaryPath?.levelPath ?? "—",
            ringPath: data.primaryPath?.ringPath ?? "—",
          },
          ...prev,
        ].slice(0, 10)
      );
    } catch (err: any) {
      console.error("Error while analyzing word:", err);
      const message =
        typeof err?.message === "string"
          ? err.message
          : "Something went wrong while analyzing the word.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const handleCopySnippet = () => {
    if (!result?.raw) return;
    try {
      const snippet = buildShareSnippet({
        word: result.word,
        analysis: result.raw,
      });
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard
          .writeText(snippet)
          .then(() => {
            toast({
              title: "Copied",
              description: "Summary snippet copied to clipboard.",
            });
          })
          .catch(() => {
            toast({
              title: "Copy failed",
              description: "Could not access the clipboard.",
              variant: "destructive",
            });
          });
      } else {
        console.log("Share snippet:", snippet);
        toast({
          title: "Snippet ready",
          description: "Clipboard not available – check console output.",
        });
      }
    } catch (err) {
      console.error("Error building share snippet:", err);
      toast({
        title: "Error",
        description: "Could not build share snippet.",
        variant: "destructive",
      });
    }
  };

  const handleCopyZhejiSnippet = () => {
    if (!zheji) return;
    try {
      const view = zhejiInverted ? "inverted" : "normal";
      const snippet = buildZhejiSnippet(view, zheji);
      
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard
          .writeText(snippet)
          .then(() => {
            toast({
              title: "Zheji snippet copied",
              description: "Summary is ready to paste.",
            });
          })
          .catch(() => {
            toast({
              title: "Copy failed",
              description: "Could not access the clipboard.",
              variant: "destructive",
            });
          });
      } else {
        console.log("Zheji snippet:", snippet);
        toast({
          title: "Snippet ready",
          description: "Clipboard not available – check console output.",
        });
      }
    } catch (err) {
      console.error("Error building Zheji snippet:", err);
      toast({
        title: "Error",
        description: "Could not build Zheji snippet.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 lg:p-8 flex flex-col items-stretch">
      <main className="max-w-5xl mx-auto w-full space-y-8 flex-1">
        {/* Header */}
        <header className="pb-4 border-b border-border/60">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Linguistic Decoder
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Seven-Voices prototype — analyze a word and see how the Heart and
            Frontier respond.
          </p>
        </header>

        {/* Analyze form */}
        <Card>
          <CardHeader>
            <CardTitle>Analyze a word</CardTitle>
            <CardDescription>
              Type a word and run the Seven-Voices engine.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleAnalyze}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Input
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="study"
                disabled={loading}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Analyzing..." : "Analyze"}
              </Button>
            </form>
            <div className="flex flex-wrap gap-4 mt-2">
              <div>
                <label className="text-sm opacity-80 mr-2">Mode:</label>
                <select
                  value={mode}
                  onChange={(e) =>
                    setMode(e.target.value as "strict" | "explore")
                  }
                  className="bg-background border border-border/50 rounded-md px-2 py-1"
                >
                  <option value="strict">strict</option>
                  <option value="explore">explore</option>
                </select>
              </div>
              <div>
                <label className="text-sm opacity-80 mr-2">Alphabet:</label>
                <select
                  value={alphabet}
                  onChange={(e) =>
                    setAlphabet(
                      e.target.value as "auto" | "latin" | "albanian"
                    )
                  }
                  className="bg-background border border-border/50 rounded-md px-2 py-1"
                >
                  <option value="auto">auto</option>
                  <option value="latin">latin</option>
                  <option value="albanian">albanian</option>
                </select>
              </div>
            </div>
            {error && (
              <p className="mt-2 text-sm text-destructive">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Heart summary */}
        {result?.primaryPath ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle>Heart summary</CardTitle>
                <CardDescription>
                  Primary Seven-Voices path for {result.word ?? "—"}.
                </CardDescription>
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={!result.raw}
                onClick={handleCopySnippet}
              >
                Copy snippet
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-xs uppercase text-muted-foreground tracking-wide mb-1">
                    Voice path
                  </div>
                  <div className="font-medium">
                    {result.primaryPath.voicePath}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground tracking-wide mb-1">
                    Level path
                  </div>
                  <div className="font-medium">
                    {result.primaryPath.levelPath}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-muted-foreground tracking-wide mb-1">
                    Ring path
                  </div>
                  <div className="font-medium">
                    {result.primaryPath.ringPath}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Zheji structural summary */}
        {zheji ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle>Zheji structural summary</CardTitle>
                <CardDescription>
                  Structural reading of {result?.word ?? "this word"} (path,
                  polarity, tension).
                </CardDescription>
              </div>
              {zheji && (
                 <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyZhejiSnippet}
                    >
                        Copy snippet
                    </Button>
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZhejiInverted((prev) => !prev)}
                    >
                    {zhejiInverted ? "Normal view" : "Invert"}
                    </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <div>
                <span className="text-xs uppercase text-muted-foreground">
                  Functional statement
                </span>
                <p className="mt-1">{effectiveStatement}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border/40">
                <div>
                  <span className="text-xs uppercase text-muted-foreground">
                    Subject
                  </span>
                  <p className="font-mono mt-1">{effectiveSubjectRole}</p>
                </div>
                <div>
                  <span className="text-xs uppercase text-muted-foreground">
                    Object
                  </span>
                  <p className="font-mono mt-1">{effectiveObjectRole}</p>
                </div>
                <div>
                  <span className="text-xs uppercase text-muted-foreground">
                    Modifier
                  </span>
                  <p className="font-mono mt-1">{effectiveModifierRole}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border/40">
                <div>
                  <span className="text-xs uppercase text-muted-foreground">
                    Raw vowel path
                  </span>
                  <div className="font-mono">{zheji.rawVowelPath}</div>
                </div>
                <div>
                  <span className="text-xs uppercase text-muted-foreground">
                    Root polarity
                  </span>
                  <div className="font-mono">
                    {effectivePolarity}
                    {zhejiInverted && " (inverted)"}
                  </div>
                </div>
                <div>
                  <span className="text-xs uppercase text-muted-foreground">
                    Tension
                  </span>
                  <div className="font-mono">
                    [{zheji.tensionPath.join(", ")}] → total{" "}
                    {zheji.totalTensionScore}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Frontier candidates */}
        {result && result.frontier && result.frontier.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Frontier candidates</CardTitle>
              <CardDescription>
                Alternate legal paths the Mind can explore inside the same
                rules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="border-b border-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="py-2 pr-4 text-left w-16">Alt</th>
                      <th className="py-2 px-4 text-left">Voice path</th>
                      <th className="py-2 px-4 text-left">Level path</th>
                      <th className="py-2 pl-4 text-left">Ring path</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.frontier.map((alt: any, idx: number) => (
                      <tr
                        key={alt.id ?? `alt-${idx}`}
                        className="border-b border-muted/20 last:border-b-0"
                      >
                        <td className="py-1 pr-4 text-xs text-muted-foreground">
                          {alt.id ?? `alt-${idx + 1}`}
                        </td>
                        <td className="py-1 px-4 font-mono">
                          {alt.voicePath ?? "—"}
                        </td>
                        <td className="py-1 px-4 font-mono">
                          {alt.levelPath ?? "—"}
                        </td>
                        <td className="py-1 pl-4 font-mono">
                          {alt.ringPath ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Word matrix (rendered by helper) */}
        {renderWordMatrix(result)}

        {/* Symbolic reading */}
        <Card>
          <CardHeader>
            <CardTitle>Symbolic reading (experimental)</CardTitle>
            <CardDescription>
              High-level reading of this word&apos;s path. Sketch, not doctrine.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!result && (
              <p className="text-sm text-muted-foreground">
                Run a word to see a symbolic reading.
              </p>
            )}
            {result && !result.symbolic && (
              <p className="text-sm text-muted-foreground">
                No symbolic reading available for this word yet.
              </p>
            )}
            {result?.symbolic && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  Sketch from the Seven-Voices core. Experimental, not doctrine.
                </div>
                <div>
                  <span className="font-semibold">Label: </span>
                  <span className="font-mono text-xs uppercase tracking-wide">
                    {result.symbolic.label}
                  </span>
                </div>
                {result.symbolic.notes && result.symbolic.notes.length > 0 && (
                  <ul className="list-disc list-inside text-sm">
                    {result.symbolic.notes.map((note: any, idx: number) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent history (session only) */}
        {history.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Recent words (this session)</CardTitle>
              <CardDescription>
                Quick view of the last heart paths you ran.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="border-b border-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="py-2 pr-4 text-left w-10">#</th>
                      <th className="py-2 px-4 text-left">Word</th>
                      <th className="py-2 px-4 text-left">Voice path</th>
                      <th className="py-2 px-4 text-left">Level path</th>
                      <th className="py-2 pl-4 text-left">Ring path</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, idx) => (
                      <tr
                        key={`${item.word}-${idx}`}
                        className="border-b border-muted/20 last:border-b-0"
                      >
                        <td className="py-1 pr-4 text-xs text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="py-1 px-4">{item.word}</td>
                        <td className="py-1 px-4 font-mono">
                          {item.voicePath ?? "—"}
                        </td>
                        <td className="py-1 px-4 font-mono">
                          {item.levelPath ?? "—"}
                        </td>
                        <td className="py-1 pl-4 font-mono">
                          {item.ringPath ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Engine meta */}
        {result?.meta ? (
          <Card>
            <CardHeader>
              <CardTitle>Engine meta</CardTitle>
              <CardDescription>
                Debug info for this analysis run.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3 text-sm text-muted-foreground">
              {/* Engine version / timestamp */}
              <div>
                <div className="font-medium text-primary-foreground/80">
                  Engine
                </div>
                <div className="mt-1 space-y-1">
                  <div>
                    version{" "}
                    <span className="font-mono">
                      {result.meta?.version ?? "—"}
                    </span>
                  </div>
                  <div>
                    created{" "}
                    <span className="font-mono">
                      {result.meta?.created
                        ? new Date(result.meta.created).toLocaleString()
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mode + alphabet */}
              <div>
                <div className="font-medium text-primary-foreground/80">
                  Mode
                </div>
                <div className="mt-1 space-y-1">
                  <div>
                    mode <span className="font-mono">{result.mode}</span>
                  </div>
                  <div>
                    alphabet{" "}
                    <span className="font-mono">{result.alphabet}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Raw JSON (debug) */}
        {result?.raw ? (
          <Card>
            <CardHeader>
              <CardTitle>Raw result (debug view)</CardTitle>
              <CardDescription>
                Full JSON from{" "}
                <code className="font-mono text-xs">/api/analyze</code>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border/60 bg-muted/5 max-h-80 overflow-auto">
                <pre className="text-xs font-mono p-4 whitespace-pre">
                  {JSON.stringify(result.raw, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </main>
    </div>
  );
}
