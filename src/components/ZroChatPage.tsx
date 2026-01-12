'use client';

import React from 'react';
import { buildInstrumentVmV1 } from '@/ui/instrument/instrumentVm.v1';
import type { TelemetryViewModel } from '@/ui/instrument/types';
import ChatShell from '@/components/ChatShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { InstrumentPanel } from '@/ui/instrument/InstrumentPanel';
import ReadoutCard from "@/components/instrument/ReadoutCard";
import MeaningCard from "@/components/instrument/MeaningCard";
import EvidenceCard from "@/components/instrument/EvidenceCard";
import CandidatesCard from "@/components/instrument/CandidatesCard";
import MathLensesCard from "@/components/instrument/MathLensesCard";
import RawJsonCard from "@/components/instrument/RawJsonCard";

function safeBuildTelemetryVm(result: unknown): unknown {
  try {
    return buildInstrumentVmV1(result as any);
  } catch {
    return null;
  }
}

function isTelemetryVmWithEvidence(vm: unknown): vm is TelemetryViewModel {
  const v = vm as any;
  return (
    !!v &&
    typeof v === 'object' &&
    !!v.evidence &&
    Array.isArray(v.evidence.normalizationSteps) &&
    Array.isArray(v.evidence.ops)
  );
}

type Msg =
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'assistant'; text: string; result?: unknown; error?: string; telemetryVm?: unknown };

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function pickString(obj: unknown, paths: string[]): string | null {
  if (!obj || typeof obj !== 'object') return null;
  const o = obj as Record<string, any>;
  for (const p of paths) {
    const v = o[p];
    if (typeof v === 'string') return v;
  }
  return null;
}

function pickFirstCandidate(r: unknown): Record<string, any> | null {
  if (!r || typeof r !== 'object') return null;
  const o = r as Record<string, any>;
  if (Array.isArray(o.candidates) && o.candidates.length > 0) {
    return o.candidates[0];
  }
  return null;
}

function pickVowelPath(r: unknown): string | null {
  const candidate = pickFirstCandidate(r);
  return pickString(candidate, ['vowelPath', 'vowel_path']) ?? pickString(r, ['vowelPath', 'vowel_path']);
}

function pickEngineVersion(r: unknown): string | null {
  if (!r || typeof r !== 'object') return null;
  const o = r as Record<string, any>;
  return pickString(o, ['engineVersion', 'engine_version']) ?? pickString(o.meta, ['engineVersion']);
}

function pickWordShown(r: unknown): string {
  return pickString(r, ['word', 'normalizedWord']) ?? '';
}

function splitVowelPath(vowelPath: string | null): string[] {
  if (typeof vowelPath !== 'string') return [];
  return vowelPath.split(/[-–—→\s]+/g).map(s => s.trim()).filter(Boolean);
}

export default function ZroChatPage() {
  const [input, setInput] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [showRaw, setShowRaw] = React.useState(false);

  const [validation, setValidation] = React.useState<string | null>(null);
  const [statusBanner, setStatusBanner] = React.useState<string | null>(null);

  const [debug, setDebug] = React.useState<string>('');

  const [messages, setMessages] = React.useState<Msg[]>([]);

  const errMsg = (e: unknown, fallback = 'Request failed.') =>
    e instanceof Error ? e.message : fallback;

  const safeString = (v: unknown) => {
    try {
      return typeof v === 'string' ? v : JSON.stringify(v, null, 2);
    } catch {
      return String(v);
    }
  };

  const pickErr = (j: unknown): unknown => {
    if (!j || typeof j !== 'object') return null;
    const o = j as Record<string, unknown>;
    return o.error ?? o.message ?? null;
  };

  async function run(wordRaw: string) {
    if (busy) return;

    const word = wordRaw.trim();

    if (!word) {
      setValidation('Type a word before analyzing.');
      setStatusBanner(null);
      setDebug('validation: empty word');
      return;
    }

    setValidation(null);
    setStatusBanner(null);

    const userMsg: Msg = { id: uid(), role: 'user', text: word };
    const assistantMsg: Msg = { id: uid(), role: 'assistant', text: 'Analyzing…' };

    setMessages(m => [...m, userMsg, assistantMsg]);
    setBusy(true);

    const url = `/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`;
    setDebug(`clicked → url=${url}`);

    try {
      const res = await fetch(url, { method: 'GET' });
      setDebug(d => `${d}\nstatus=${res.status}`);

      let text = '';
      try {
        if (typeof res.text === 'function') {
          text = await res.text();
        } else if (typeof res.json === 'function') {
          const j = await res.json();
          text = JSON.stringify(j);
        } else {
          text = '';
        }
      } catch (e: unknown) {
        text = '';
        setDebug(d => `${d}\nREAD BODY ERROR: ${errMsg(e, String(e))}`);
      }

      setDebug(d => `${d}\nbody[0..200]=${safeString(text).slice(0, 200).replace(/\s+/g, ' ')}...`);

      let json: unknown = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch (e: unknown) {
        json = null;
        setDebug(d => `${d}\nJSON.parse ERROR: ${errMsg(e, String(e))}`);
      }

      if (!res.ok) {
        setStatusBanner('Engine error');
        const err = pickErr(json) ?? `HTTP ${res.status}`;
        setMessages(m =>
          m.map(x =>
            x.id === assistantMsg.id
              ? {
                  ...x,
                  text: 'Request failed.',
                  error: safeString(err),
                  result: json ?? undefined,
                  telemetryVm: json ? safeBuildTelemetryVm(json) : null,
                }
              : x
          )
        );
        return;
      }

      setMessages(m =>
        m.map(x =>
          x.id === assistantMsg.id
            ? {
                ...x,
                text: 'Result:',
                result: json ?? undefined,
                telemetryVm: json ? safeBuildTelemetryVm(json) : null,
              }
            : x
        )
      );

      setDebug(d => `${d}\nsetMessages(result)=ok`);
    } catch (e: unknown) {
      setStatusBanner('Network error');
      setDebug(`NET_ERR: ${errMsg(e, String(e))}`);

      setMessages(m =>
        m.map(x =>
          x.id === assistantMsg.id
            ? { ...x, text: 'Request failed.', error: errMsg(e) }
            : x
        )
      );
    } finally {
      setBusy(false);
    }
  }

  const composer = (
    <div className='space-y-2'>
      <div className='text-xs text-muted-foreground'>Enter a word</div>
      <div className='flex gap-2'>
        <Input
          value={input}
          onChange={e => {
            setInput(e.target.value);
            setValidation(null);
            setStatusBanner(null);
            setDebug('');
          }}
          placeholder='study'
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void run(input);
            }
          }}
          className='h-11'
        />
        <Button
          type='button'
          className='h-11'
          onClick={() => void run(input)}
          disabled={busy}
          aria-busy={busy ? 'true' : 'false'}
        >
          {busy ? 'Working…' : 'Analyze'}
        </Button>
      </div>
    </div>
  );

  const latestResult =
    messages
      .slice()
      .reverse()
      .find((m): m is Msg & { result: unknown } => typeof (m as any)?.result !== "undefined")
      ?.result;

  return (
    <ChatShell title='ZË-RO' subtitle='Seven-vowel word decoder.' composer={composer}>
      <div className='space-y-4'>
        <div className="mb-4">
          <ReadoutCard result={latestResult as any} />
        </div>

        <div className="mb-4">
          <MeaningCard result={latestResult as any} />
        </div>

        <div className="mb-4">
          <CandidatesCard result={latestResult as any} />
        </div>

        <div className="mb-4">
          <MathLensesCard result={latestResult as any} />
        </div>

        <div className="mb-4">
          <EvidenceCard result={latestResult as any} />
        </div>

        <div className="mb-4">
          <RawJsonCard result={latestResult as any} />
        </div>

        {(validation || statusBanner) && (
          <div role='alert' className='text-sm text-red-400'>
            {validation || statusBanner}
          </div>
        )}

        {debug ? <pre className='mt-2 text-xs opacity-80 whitespace-pre-wrap'>{debug}</pre> : null}
      </div>
    </ChatShell>
  );
}
