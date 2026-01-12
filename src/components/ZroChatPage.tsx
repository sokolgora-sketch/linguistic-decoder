'use client';

import React from 'react';
import { buildInstrumentVmV1, type InstrumentVmV1 } from '@/ui/instrument/instrumentVm.v1';
import ChatShell from '@/components/ChatShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InstrumentPanel } from '@/ui/instrument/InstrumentPanel';

type Msg =
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'assistant'; text: string; result?: unknown; error?: string; instrumentVm?: InstrumentVmV1 | null };

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function safeString(e: unknown): string {
  if (e instanceof Error) return e.message;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

function safeBuildInstrumentVm(result: unknown): InstrumentVmV1 | null {
  try {
    return result ? buildInstrumentVmV1(result) : null;
  } catch (e) {
    console.error(`Error building instrument VM:`, e);
    return null;
  }
}

export default function ZroChatPage() {
  const [input, setInput] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [validation, setValidation] = React.useState<string | null>(null);
  const [statusBanner, setStatusBanner] = React.useState<string | null>(null);
  const [debug, setDebug] = React.useState<string | null>(null);

  const [messages, setMessages] = React.useState<Msg[]>([
    { id: uid(), role: 'assistant', text: 'Type a word and press Enter.' },
  ]);

  async function runAnalysis(word: string) {
    const w = word.trim();
    if (!w) {
      setValidation('Type a word before analyzing.');
      return;
    }

    setValidation(null);
    setStatusBanner(null);
    setDebug(null);

    const userMsg: Msg = { id: uid(), role: 'user', text: w };
    const assistantMsg: Msg = { id: uid(), role: 'assistant', text: 'Analyzing…' };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setBusy(true);

    let res: any = null;
    let json: any = null;

    try {
      const url = `/api/analyze-v1?word=${encodeURIComponent(w)}&mode=strict`;
      res = await fetch(url, { method: 'GET' });

      if (res && typeof res.json === 'function') {
        json = await res.json();
      } else {
        json = null;
      }

      if (!res?.ok) {
        const status = typeof res?.status === 'number' ? res.status : 0;
        const statusText = typeof res?.statusText === 'string' ? res.statusText : '';

        setMessages(prev =>
          prev.map(x =>
            x.id === assistantMsg.id
              ? {
                  ...x,
                  text: 'Request failed.',
                  error: statusText || `HTTP ${status}`,
                  result: json ?? undefined,
                  instrumentVm: json ? safeBuildInstrumentVm(json) : null,
                }
              : x
          )
        );

        setStatusBanner('Engine error.');
        setDebug(statusText || (json ? JSON.stringify(json, null, 2) : '') || `HTTP ${status}` || '');
        return;
      }

      setMessages(prev =>
        prev.map(x =>
          x.id === assistantMsg.id
            ? {
                ...x,
                text: '',
                result: json ?? undefined,
                instrumentVm: json ? safeBuildInstrumentVm(json) : null,
              }
            : x
        )
      );
    } catch (err) {
      setMessages(prev =>
        prev.map(x =>
          x.id === assistantMsg.id
            ? { ...x, text: 'Request failed.', error: safeString(err) }
            : x
        )
      );
      setStatusBanner('Network error.');
      setDebug(safeString(err));
      return;
    } finally {
      setBusy(false);
    }
  }

  function onSubmit() {
    if (busy) return;
    void runAnalysis(input);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  }

  const composer = (
    <div className="flex gap-2">
      <Input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="study"
        aria-label="Word"
        disabled={busy}
      />
      <Button type="button" onClick={onSubmit} disabled={busy} aria-busy={busy ? 'true' : 'false'}>
        {busy ? 'Analyzing…' : 'Analyze'}
      </Button>
    </div>
  );

  const latestInstrumentVm =
    messages
      .slice()
      .reverse()
      .find((m): m is Msg & { instrumentVm: InstrumentVmV1 } => (m as any)?.instrumentVm != null)
      ?.instrumentVm ?? null;

  return (
    <ChatShell title="ZË-RO" subtitle="Seven-vowel word decoder." composer={composer}>
      <div className="space-y-4">
        {latestInstrumentVm ? <InstrumentPanel vm={latestInstrumentVm} /> : null}

        {(validation || statusBanner) && (
          <div role="alert" className="text-sm text-red-400">
            {validation ?? statusBanner}
          </div>
        )}

        {debug ? <pre className="mt-2 text-xs opacity-80 whitespace-pre-wrap">{debug}</pre> : null}
      </div>
    </ChatShell>
  );
}
