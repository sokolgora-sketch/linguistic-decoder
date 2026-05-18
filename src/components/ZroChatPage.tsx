'use client';

import React from 'react';
import ChatShell from '@/components/ChatShell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InstrumentPanel } from '@/ui/instrument/InstrumentPanel';
import { HonestContractCard } from '@/ui/instrument/sections/HonestContractCard';
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

const readinessChips = ['VM-backed readout', 'Evidence-first', 'No origin proof'] as const;

const emptyStateSteps = [
  { index: '01', label: 'Word', tone: 'text-[#cfe6ff]' },
  { index: '02', label: 'Evidence', tone: 'text-[#b7d8c1]' },
  { index: '03', label: 'Candidates', tone: 'text-[#f0ddb0]' },
  { index: '04', label: 'Roots', tone: 'text-[#d7dce3]' },
] as const;

function OpenInstrumentEmptyState() {
  return (
    <div className="space-y-4">
      <section
        aria-label="Open Instrument status"
        className="overflow-hidden rounded-[18px] border border-[#2f3742] bg-[#13171d] shadow-[0_18px_48px_rgba(0,0,0,0.24)]"
      >
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.72fr)]">
          <div className="p-5 sm:p-6 lg:p-7">
            <div className="mb-5 flex flex-wrap gap-2">
              {readinessChips.map(chip => (
                <span
                  key={chip}
                  className={`${MT.chipText} rounded-full border border-[#303a45] bg-[#10161e] px-3 py-1 font-mono text-[#b8c3cf]`}
                >
                  {chip}
                </span>
              ))}
            </div>

            <p className={`${MT.sectionLabel} text-[#8ea4ba]`}>instrument ready</p>
            <h2 className="mt-3 text-[26px] font-semibold leading-tight text-[#f5f7fb]">
              Open Instrument ready
            </h2>
            <p className="mt-4 max-w-2xl text-[14px] leading-7 text-[#b8c3cf]">
              One word enters the deterministic readout. Evidence, candidates, roots, and advanced
              diagnostics appear after analysis.
            </p>
          </div>

          <div className="border-t border-[#2f3742] bg-[#10161e] p-4 sm:p-5 lg:border-l lg:border-t-0">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {emptyStateSteps.map(step => (
                <div key={step.index} className="rounded-[10px] border border-[#29333f] bg-[#0d1117] p-4">
                  <div className={`${MT.microLabel} font-mono text-[#6f8294]`}>{step.index}</div>
                  <div className={`mt-3 font-mono text-[15px] font-semibold ${step.tone}`}>
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HonestContractCard />
    </div>
  );
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
    "h-11 w-full min-w-0 rounded-[8px] border-[#303030] bg-[#101010] font-mono text-[14px] text-[#f5f7fb] placeholder:text-[#777777] focus-visible:ring-[#355a7a] focus-visible:ring-offset-0 disabled:opacity-50";

  const composer = (
    <div className="overflow-hidden rounded-[14px] border border-[#2f3742] bg-[#13171d] p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.24)] sm:p-3">
      <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.45fr)] xl:grid-cols-[minmax(0,1fr)_minmax(260px,0.42fr)_132px] xl:items-end">
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
          className={`${MT.actionSm} h-11 w-full rounded-[8px] border border-[#355a7a] bg-[#111a24] px-4 text-[#cfe6ff] transition hover:border-[#4d7fa8] hover:bg-[#132031] hover:text-white disabled:opacity-50 md:col-span-2 xl:col-span-1`}
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
        ) : (
          <OpenInstrumentEmptyState />
        )}

        {(validation || statusBanner) && (
          <div role="alert" className="text-sm text-red-400">
            {validation ?? statusBanner}
          </div>
        )}

        {debugEnabled ? (
          <section
            aria-label="Open Instrument debug telemetry"
            className="rounded-[10px] border border-slate-700/80 bg-[#10151c] p-3 text-xs text-slate-300 shadow-[0_10px_30px_rgba(0,0,0,0.22)]"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-blue-400/40 bg-blue-500/10 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide text-blue-100">
                debug telemetry
              </span>
              <span className="font-mono text-slate-400">messages={messages.length}</span>
              <span className="font-mono text-slate-400">
                latestInstrumentPayload={latestInstrumentPayload ? "YES" : "NO"}
              </span>
            </div>
            {debug ? (
              <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-md border border-slate-800 bg-black/35 p-3 font-mono text-xs text-slate-200">
                {debug}
              </pre>
            ) : null}
          </section>
        ) : null}
        <div ref={bottomRef} />
      </div>
    </ChatShell>
  );
}
