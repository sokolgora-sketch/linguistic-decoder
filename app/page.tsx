'use client';

import React, { useState, type ReactNode, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { WordMatrixCard } from '@/components/WordMatrix';
import {
  type AnalyzeWordResultUI,
  type HistoryItem,
  buildLanguageFamiliesView,
  buildSymbolicSummary,
} from '@/shared/resultsUI';
import { buildShareSnippet } from '@/lib/shareSnippet';
import { useToast } from '@/components/ui/use-toast';
import {
  buildZhejiSummary,
  invertRootPolarity,
  buildInvertedStatement,
  buildZhejiSnippet,
} from '@/lib/zhejiSummary';
import {
  buildEngineMetaSummary,
  type EngineMetaSummary,
} from '@/lib/engineMetaSummary';
import { EngineMetaCard } from '@/components/EngineMetaCard';
import { LanguageFamiliesCard } from '@/components/LanguageFamiliesCard';
import { SymbolicReadingCard } from '@/components/SymbolicReadingCard';
import { PublicSummaryPreview } from '@/components/PublicSummaryPreview';

function renderWordMatrix(result: AnalyzeWordResultUI | null): ReactNode {
  if (!result?.wordMatrix) {
    return null;
  }
  return <WordMatrixCard matrix={result.wordMatrix} />;
}

export default function Page() {
  const [word, setWord] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeWordResultUI | null>(null);
  const [zhejiInverted, setZhejiInverted] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mode, setMode] = useState<'strict' | 'explore'>('strict');
  const [alphabet, setAlphabet] = useState<'auto' | 'latin' | 'albanian'>(
    'auto'
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { toast } = useToast();

  const engineMetaSummary: EngineMetaSummary | null = result?.engineMeta
    ? buildEngineMetaSummary(result.engineMeta)
    : null;

  const zheji = result ? buildZhejiSummary(result) : null;
  const languageFamiliesView = buildLanguageFamiliesView(result);
  const symbolicSummary = buildSymbolicSummary(result);

  const effectivePolarity =
    zheji && zhejiInverted
      ? invertRootPolarity(zheji.rootPolarity)
      : zheji?.rootPolarity ?? 'Static';

  const effectiveStatement =
    zheji && zhejiInverted
      ? buildInvertedStatement(zheji.functionalStatement)
      : zheji?.functionalStatement ?? '';

  const effectiveSubjectRole = zheji
    ? zhejiInverted
      ? zheji.objectRole
      : zheji.subjectRole
    : '—';
  const effectiveObjectRole = zheji
    ? zhejiInverted
      ? zheji.subjectRole
      : zheji.objectRole
    : '—';
  const effectiveModifierRole = zheji
    ? zheji.modifierRole.replace(zheji.rootPolarity, effectivePolarity)
    : '—';

  const handleAnalyze = useCallback(async () => {
    if (isAnalyzing) return;

    setValidationError(null);
    setError(null);
    setResult(null);

    const trimmed = word.trim();
    if (!trimmed) {
      setValidationError('Type a word before analyzing.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: trimmed,
          mode,
          alphabet,
        }),
      });

      if (!response.ok) {
        const message = `Engine error (${response.status}). Please try again.`;
        console.error('Analyze request failed:', response.status);
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
            voicePath: Array.isArray(data.primaryPath?.voicePath)
              ? data.primaryPath.voicePath.join(' → ')
              : data.primaryPath?.voicePath ?? '—',
            levelPath: data.primaryPath?.levelPath ?? '—',
            ringPath: Array.isArray(data.primaryPath?.ringPath)
              ? data.primaryPath.ringPath.join(' → ')
              : data.primaryPath?.ringPath ?? '—',
            createdAt: data.meta?.createdAt ?? new Date().toISOString(),
          },
          ...prev,
        ].slice(0, 10)
      );
    } catch (err: any) {
      console.error('Error while analyzing word:', err);
      const message = 'Network error while calling /api/analyze. Try again.';
      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing, word, mode, alphabet, toast]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const handleCopySnippet = () => {
    if (!result?.raw) return;
    try {
      const snippet = buildShareSnippet({
        word: result.word,
        analysis: result as any, // Cast because we know `raw` is there
      });
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard
          .writeText(snippet)
          .then(() => {
            toast({
              title: 'Copied',
              description: 'Summary snippet copied to clipboard.',
            });
          })
          .catch(() => {
            toast({
              title: 'Copy failed',
              description: 'Could not access the clipboard.',
              variant: 'destructive',
            });
          });
      } else {
        console.log('Share snippet:', snippet);
        toast({
          title: 'Snippet ready',
          description: 'Clipboard not available – check console output.',
        });
      }
    } catch (err) {
      console.error('Error building share snippet:', err);
      toast({
        title: 'Error',
        description: 'Could not build share snippet.',
        variant: 'destructive',
      });
    }
  };

  const handleCopyZhejiSnippet = () => {
    if (!zheji) return;

    const view = zhejiInverted ? 'inverted' : 'normal';
    const snippet = buildZhejiSnippet(view, zheji);

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard
          .writeText(snippet)
          .then(() => {
            toast({
              title: 'Zheji snippet copied',
              description: 'Summary is ready to paste.',
            });
          })
          .catch((err) => {
            console.error('Error copying Zheji snippet:', err);
            toast({
              title: 'Copy failed',
              description: 'Could not access the clipboard.',
              variant: 'destructive',
            });
          });
      } else {
        console.log('Zheji snippet:', snippet);
        toast({
          title: 'Snippet ready',
          description: 'Clipboard not available – check console output.',
        });
      }
    } catch (err) {
      console.error('Error building Zheji share snippet:', err);
      toast({
        title: 'Error',
        description: 'Could not build Zheji share snippet.',
        variant: 'destructive',
      });
    }
  };

  const handleCopyJson = () => {
    if (!result?.raw) return;

    try {
      const json = JSON.stringify(result.raw, null, 2);
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard
          .writeText(json)
          .then(() => {
            toast({
              title: 'Copied',
              description: 'JSON result copied to clipboard.',
            });
          })
          .catch(() => {
            toast({
              title: 'Copy failed',
              description: 'Could not access the clipboard.',
              variant: 'destructive',
            });
          });
      } else {
        console.log('JSON result:', json);
        toast({
          title: 'JSON ready',
          description: 'Clipboard not available – check console output.',
        });
      }
    } catch (err) {
      console.error('Error copying JSON:', err);
      toast({
        title: 'Error',
        description: 'Could not copy JSON.',
        variant: 'destructive',
      });
    }
  };

  // This is the word we’ll use for the dev link – prefer engine result, fall back to trimmed input
  const currentWord = result?.word ?? word.trim();

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
              onSubmit={(e) => {
                e.preventDefault();
                handleAnalyze();
              }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Input
                value={word}
                onChange={(e) => setWord(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="study"
                disabled={isAnalyzing}
              />
              <Button
                type="submit"
                disabled={isAnalyzing}
                aria-busy={isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </Button>
            </form>
            {validationError && (
              <p className="mt-2 text-sm text-amber-600">{validationError}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-2">
              <div>
                <label className="text-sm opacity-80 mr-2">Mode:</label>
                <select
                  value={mode}
                  onChange={(e) =>
                    setMode(e.target.value as 'strict' | 'explore')
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
                      e.target.value as 'auto' | 'latin' | 'albanian'
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
          </CardContent>
        </Card>

        {error && !validationError && (
          <Card className="border-destructive/50">
            <CardContent className="p-4">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Results header + dev link */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Results</div>
          <div className="flex flex-col items-end gap-1">
            <button
              type="button"
              className="text-xs underline text-muted-foreground hover:text-foreground"
              onClick={() => setShowAdvanced((v) => !v)}
            >
              {showAdvanced ? 'Hide advanced details' : 'Show advanced details'}
            </button>

            {currentWord && (
              <Link
                href={`/word/${encodeURIComponent(currentWord)}`}
                className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                View full v1 summary (dev)
              </Link>
            )}
          </div>
        </div>

        {/* Heart summary */}
        {result?.primaryPath ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle>Heart summary</CardTitle>
                <CardDescription>
                  Primary Seven-Voices path for {result.word ?? '—'}.
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
                    {Array.isArray(result.primaryPath.voicePath)
                      ? result.primaryPath.voicePath.join(' → ')
                      : result.primaryPath.voicePath}
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
                    {Array.isArray(result.primaryPath.ringPath)
                      ? result.primaryPath.ringPath.join(' → ')
                      : result.primaryPath.ringPath}
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
                  Structural reading of {result?.word ?? 'this word'} (path,
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
                    {zhejiInverted ? 'Normal view' : 'Invert'}
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
                    {zhejiInverted && ' (inverted)'}
                  </div>
                </div>
                <div>
                  <span className="text-xs uppercase text-muted-foreground">
                    Tension
                  </span>
                  <div className="font-mono">
                    [{zheji.tensionPath.join(', ')}] → total{' '}
                    {zheji.totalTensionScore}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {showAdvanced && (
          <div className="mt-4 space-y-4">
            {engineMetaSummary && (
              <div className="mt-6">
                <EngineMetaCard summary={engineMetaSummary} />
              </div>
            )}

            {result && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleCopyJson}
                  className="text-xs text-muted-foreground border rounded px-2 py-1 cursor-pointer hover:bg-muted/20"
                >
                  Copy JSON (dev)
                </button>
              </div>
            )}

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
                              {alt.voicePath ?? '—'}
                            </td>
                            <td className="py-1 px-4 font-mono">
                              {alt.levelPath ?? '—'}
                            </td>
                            <td className="py-1 pl-4 font-mono">
                              {alt.ringPath ?? '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <LanguageFamiliesCard families={languageFamiliesView} />

            {/* Word matrix (rendered by helper) */}
            {renderWordMatrix(result)}

            {symbolicSummary && (
              <SymbolicReadingCard summary={symbolicSummary} />
            )}

            <PublicSummaryPreview result={result} />
          </div>
        )}

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
                      <th className="py-2 pl-4 text-left">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, idx) => (
                      <tr
                        key={`${item.word}-${idx}`}
                        onClick={() => setWord(item.word)}
                        className="border-b border-muted/20 last:border-b-0 hover:bg-muted/20 cursor-pointer"
                      >
                        <td className="py-1 pr-4 text-xs text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="py-1 px-4">{item.word}</td>
                        <td className="py-1 px-4 font-mono">
                          {item.voicePath ?? '—'}
                        </td>
                        <td className="py-1 px-4 font-mono">
                          {item.levelPath ?? '—'}
                        </td>
                        <td className="py-1 pl-4 font-mono">
                          {item.ringPath ?? '—'}
                        </td>
                        <td className="py-1 pl-4 text-xs text-muted-foreground">
                          {item.createdAt ? item.createdAt : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </main>
    </div>
  );
}
