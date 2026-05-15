'use client';

import React from 'react';
import ChatShell from '@/components/ChatShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InstrumentPanel } from '@/ui/instrument/InstrumentPanel';
import { MT } from '@/ui/typography/marketingType.v0.1';

class UiErrorBoundary extends React.Component<
  { children: React.ReactNode; label?: string },
  { error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error(`[${this.props.label ?? "UI"}] crashed:`, error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mt-4 p-3 border border-red-500 text-red-400 text-xs whitespace-pre-wrap">
          {this.props.label ?? "UI"} crashed:
          {"\n\n"}
          {this.state.error.message}
          {"\n\n"}
          {this.state.error.stack}
        </div>
      );
    }
    return this.props.children;
  }
}

type Msg =
  | { id: string; role: 'user'; text: string }
  | {
      id: string;
      role: 'assistant';
      text: string;
      result?: unknown;
      error?: string;
      instrumentPayload?: unknown | null;
    };

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

export default function ZroChatPage() {
  const [input, setInput] = React.useState('');
  const [ipa, setIpa] = React.useState('');
  const [lastRun, setLastRun] = React.useState<{ word: string; ipa?: string } | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [validation, setValidation] = React.useState<string | null>(null);
  const [statusBanner, setStatusBanner] = React.useState<string | null>(null);
  const [debug, setDebug] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<Msg[]>([
      { id: 'init', role: 'assistant', text: 'Type a word and press Enter.' },
    ]);

  const [debugEnabled, setDebugEnabled] = React.useState(false);
  React.useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      setDebugEnabled(p.get("debug") === "1");
    } catch {
      // ignore
    }
  }, []);
  const bottomRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = bottomRef.current;
    const fn = (el as any)?.scrollIntoView;
    if (typeof fn === 'function') fn.call(el, { behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  async function runAnalysis(word: string, ipaRaw?: string) {
    const w = word.trim();
    const ipaTrim = (ipaRaw ?? "").trim();
    const runMeta = { word: w, ipa: ipaTrim || undefined };
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
      const url = `/api/analyze-v1?word=${encodeURIComponent(w)}&mode=strict${ipaTrim ? `&ipa=${encodeURIComponent(ipaTrim)}` : ""}`;
      res = await fetch(url, { method: 'GET' });

      if (res && typeof res.json === 'function') {
        json = await res.json();
      } else {
        json = null;
      }

      if (!res?.ok) {
        const status = typeof res?.status === 'number' ? res.status : 0;
        const statusText = typeof res?.statusText === 'string' ? res.statusText : '';
    setLastRun(runMeta);


        setMessages(prev =>
          prev.map(x =>
            x.id === assistantMsg.id
              ? {
                  ...x,
                  text: 'Request failed.',
                  error: statusText || `HTTP ${status}`,
                  result: json ?? undefined,
                  instrumentPayload: json,
                }
              : x
          )
        );

        setStatusBanner('Engine error.');
        setDebug(statusText || (json ? JSON.stringify(json, null, 2) : '') || `HTTP ${status}` || '');
        return;
      }
    setLastRun(runMeta);

      setMessages(prev =>
        prev.map(x =>
          x.id === assistantMsg.id
            ? {
                ...x,
                text: '',
                result: json ?? undefined,
                instrumentPayload: json,
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
    void runAnalysis(input, ipa);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  }

  const inputClassName =
    "h-11 rounded-[8px] border-[#303030] bg-[#101010] font-mono text-[14px] text-[#f5f7fb] placeholder:text-[#777777] focus-visible:ring-[#355a7a] focus-visible:ring-offset-0 disabled:opacity-50";

  const composer = (
    <div className="rounded-[14px] border border-[#2f3742] bg-[#13171d] p-3 shadow-[0_16px_40px_rgba(0,0,0,0.24)]">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(260px,0.42fr)_132px] xl:items-end">
        <label className="block min-w-0">
          <span className={`${MT.fieldLabel} mb-2 text-[11px] text-[#8ea4ba]`}>
            Word
          </span>
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="gjuha"
            aria-label="Word"
            disabled={busy}
            className={inputClassName}
          />
        </label>

        <label className="block min-w-0">
          <span className={`${MT.fieldLabel} mb-2 text-[11px] text-[#8ea4ba]`}>
            IPA
          </span>
          <Input
            value={ipa}
            onChange={e => setIpa(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="optional e.g. /ˈfɑːðər/"
            aria-label="IPA"
            disabled={busy}
            className={inputClassName}
          />
        </label>

        <Button
          type="button"
          onClick={onSubmit}
          disabled={busy}
          aria-busy={busy ? 'true' : 'false'}
          className={`${MT.actionSm} h-11 rounded-[8px] border border-[#355a7a] bg-[#111a24] px-4 text-[#cfe6ff] transition hover:border-[#4d7fa8] hover:bg-[#132031] hover:text-white disabled:opacity-50`}
        >
          {busy ? 'Analyzing…' : 'Analyze'}
        </Button>
      </div>
    </div>
  );

  const latestInstrumentPayload =
    messages
      .slice()
      .reverse()
      .find((m): m is Msg & { instrumentPayload: unknown } => (m as any)?.instrumentPayload != null)
      ?.instrumentPayload ?? null;

  return (
    <ChatShell title="ZË-RO" subtitle="Deterministic word inspection" composer={composer} maxWidthClass="max-w-screen-2xl">
      <div className="space-y-4">
        {latestInstrumentPayload ? (
          <UiErrorBoundary label="InstrumentPanel">
            <InstrumentPanel
              payload={latestInstrumentPayload}
              debug={debugEnabled}
              wordForMask={lastRun?.word}
              carrierIpa={lastRun?.ipa}
            />
          </UiErrorBoundary>
        ) : null}

        {(validation || statusBanner) && (
          <div role="alert" className="text-sm text-red-400">
            {validation ?? statusBanner}
          </div>
        )}

          {debugEnabled ? (
            <div className="mt-2 text-xs opacity-80 whitespace-pre-wrap">
              debug: messages={messages.length} latestInstrumentPayload={latestInstrumentPayload ? "YES" : "NO"}
            </div>
          ) : null}

          {debugEnabled && debug ? <pre className="mt-2 text-xs opacity-80 whitespace-pre-wrap">{debug}</pre> : null}
        <div ref={bottomRef} />
      </div>
    </ChatShell>
  );
}
