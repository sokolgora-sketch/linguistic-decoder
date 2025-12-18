'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import type { AnalyzeWordResultUI } from '../../shared/resultsUI';

export default function Page() {
  const [word, setWord] = useState('');
  const [result, setResult] = useState<AnalyzeWordResultUI | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  async function handleAnalyze() {
    if (!word.trim()) {
      setError('Type a word before analyzing.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        word,
        mode: 'strict',
        alphabet: 'auto',
      });
      const res = await fetch(`/api/analyze?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setResult(json);
    } catch (err: any) {
      console.error('Analyze failed:', err);
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const heart = result?.primaryPath;
  const frontier = result?.frontier ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <main className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl font-semibold">Linguistic Decoder</h1>
          <p className="text-sm text-muted-foreground">
            Seven-vowel prototype — analyze a word and see the raw result.
          </p>
        </header>

        {/* Input Form */}
        <section className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
          <h2 className="text-lg font-medium">Analyze a word</h2>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="Type a word…"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <Button disabled={loading} onClick={handleAnalyze}>
              {loading ? 'Analyzing…' : 'Analyze'}
            </Button>
          </div>
        </section>

        {/* Heart Summary */}
        {heart && (
          <section className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
            <h2 className="text-lg font-medium">Heart Summary</h2>
            <div className="grid gap-3 sm:grid-cols-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground uppercase">
                  Voice Path
                </p>
                <p className="font-mono">{heart.voicePath.join(' → ')}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">
                  Level
                </p>
                <p className="font-mono">{heart.levelPath}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">
                  Ring
                </p>
                <p className="font-mono">{heart.ringPath.join(' → ')}</p>
              </div>
            </div>
          </section>
        )}

        {/* Frontier */}
        {frontier.length > 0 && (
          <section className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
            <h2 className="text-lg font-medium">Frontier Paths</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {frontier.map((f: any, i: number) => (
                <div
                  key={f.id ?? i}
                  className="rounded-lg border border-border/50 bg-background/40 p-3 text-xs"
                >
                  <p className="font-semibold mb-1">
                    {f.id ?? `alt-${i + 1}`}
                  </p>
                  <p>
                    <strong>Voice:</strong>{' '}
                    <span className="font-mono">{f.voicePath}</span>
                  </p>
                  <p>
                    <strong>Level:</strong>{' '}
                    <span className="font-mono">{f.levelPath}</span>
                  </p>
                  <p>
                    <strong>Ring:</strong>{' '}
                    <span className="font-mono">{f.ringPath}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Debug View */}
        {result && (
          <section className="rounded-xl border border-border/60 bg-card p-4">
            <h2 className="text-lg font-medium">Result (debug view)</h2>
            <pre className="mt-3 max-h-[480px] overflow-auto bg-background/80 p-4 text-xs font-mono text-muted-foreground">
              {JSON.stringify(result, null, 2)}
            </pre>
          </section>
        )}
      </main>
    </div>
  );
}
