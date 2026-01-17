"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PresentOrMissing, RootMapVM } from "@/ui/telemetry/types";

type Span = { start: number; end: number; label?: string; token?: string };

function isRecord(x: unknown): x is Record<string, unknown> {
  return !!x && typeof x === "object" && !Array.isArray(x);
}

function isSpan(x: unknown): x is Span {
  if (!isRecord(x)) return false;
  return typeof x.start === "number" && typeof x.end === "number";
}

function collectSpans(rootMap: unknown): Span[] {
  if (!isRecord(rootMap)) return [];

  // v0.1.1 expects spans interpreted against normalizedWord.
  // Contract may evolve; we support multiple plausible placements defensively.
  const direct = (rootMap as any).spans;
  if (Array.isArray(direct)) return direct.filter(isSpan);

  const tokens = (rootMap as any).tokens;
  const out: Span[] = [];

  if (Array.isArray(tokens)) {
    for (const t of tokens) {
      if (!isRecord(t)) continue;
      const s = (t as any).span;
      if (isSpan(s)) out.push({ ...s, token: typeof (t as any).token === "string" ? (t as any).token : undefined });
    }
  }

  return out;
}

function validateSpans(normalized: string, spans: Span[]): { ok: true; spans: Span[] } | { ok: false; reason: string } {
  const n = normalized.length;
  for (const s of spans) {
    // Bounds guard: 0 <= start < end <= normalizedWord.length
    if (!(Number.isFinite(s.start) && Number.isFinite(s.end))) {
      return { ok: false, reason: "span start/end not finite numbers" };
    }
    if (!(s.start >= 0 && s.start < s.end && s.end <= n)) {
      return { ok: false, reason: `span out of bounds: start=${s.start} end=${s.end} len=${n}` };
    }
  }
  // Deterministic ordering: stable left-to-right
  const sorted = [...spans].sort((a, b) => (a.start - b.start) || (a.end - b.end) || String(a.token ?? "").localeCompare(String(b.token ?? "")));
  return { ok: true, spans: sorted };
}

function renderHighlights(normalized: string, spans: Span[]) {
  // Precondition: spans are validated + sorted
  let cursor = 0;
  const nodes: React.ReactNode[] = [];

  spans.forEach((s, i) => {
    if (cursor < s.start) {
      nodes.push(<span key={`t-${i}-pre`}>{normalized.slice(cursor, s.start)}</span>);
    }

    const chunk = normalized.slice(s.start, s.end);
    const label = s.token ?? s.label;

    nodes.push(
      <span
        key={`t-${i}-hl`}
        className="px-1 rounded border border-zinc-600 bg-zinc-900"
        title={label ? `${label} [${s.start},${s.end})` : `[${s.start},${s.end})`}
      >
        {chunk}
      </span>
    );

    cursor = s.end;
  });

  if (cursor < normalized.length) {
    nodes.push(<span key="tail">{normalized.slice(cursor)}</span>);
  }

  return (
    <div className="font-mono text-sm leading-relaxed break-words whitespace-pre-wrap">
      {nodes}
    </div>
  );
}

type Props = {
  rootMap: PresentOrMissing<RootMapVM>;
  // milestone requires showing WORD + NORMALIZED side-by-side; we feed these defensively from InstrumentPanel
  word?: string;
  normalizedWord?: string;
};

export function RootMapCard({ rootMap, word, normalizedWord }: Props) {
  // MISSING state: not supported / not emitted
  if (rootMap.kind === "missing") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Root Map</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xs text-zinc-400">STATE: MISSING</div>
          <div>Root Map not available: {rootMap.missing}</div>
          {rootMap.note ? <div className="text-xs text-zinc-500">{rootMap.note}</div> : null}
        </CardContent>
      </Card>
    );
  }

  const value = rootMap.value as unknown;

  const w = typeof word === "string" ? word : "";
  const norm = typeof normalizedWord === "string" ? normalizedWord : "";

  const spans = collectSpans(value);

  // NONE state: RootMap exists but has no spans (explicit; do not guess highlights)
  if (spans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Root Map</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xs text-zinc-400">STATE: NONE</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-xs text-zinc-500">WORD</div>
              <div className="font-mono break-words">{w || "—"}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">NORMALIZED (BASIS)</div>
              <div className="font-mono break-words">{norm || "—"}</div>
            </div>
          </div>

          <div className="text-sm">
            RootMap emitted, but no spans were provided. Highlights are intentionally not shown.
          </div>

          <details>
            <summary className="cursor-pointer text-xs text-zinc-400">Raw RootMap (debug)</summary>
            <pre className="mt-2 text-xs leading-snug whitespace-pre-wrap break-words">
              {JSON.stringify(value, null, 2)}
            </pre>
          </details>
        </CardContent>
      </Card>
    );
  }

  // MALFORMED: spans exist but cannot be trusted
  const v = validateSpans(norm, spans);
  if (v.ok === false) {
    const reason = v.ok === false ? v.reason : "unknown";
    return (
      <Card>
        <CardHeader>
          <CardTitle>Root Map</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xs text-zinc-400">STATE: MALFORMED</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-xs text-zinc-500">WORD</div>
              <div className="font-mono break-words">{w || "—"}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">NORMALIZED (BASIS)</div>
              <div className="font-mono break-words">{norm || "—"}</div>
            </div>
          </div>

          <div className="text-sm">
            RootMap spans failed bounds validation. Highlights are disabled to prevent misalignment.
          </div>
          <div className="text-xs text-zinc-500">{reason}</div>

          <details>
            <summary className="cursor-pointer text-xs text-zinc-400">Raw RootMap (debug)</summary>
            <pre className="mt-2 text-xs leading-snug whitespace-pre-wrap break-words">
              {JSON.stringify(value, null, 2)}
            </pre>
          </details>
        </CardContent>
      </Card>
    );
  }

  // PRESENT: show basis + highlights + minimal token/key summary if available show basis + highlights + minimal token/key summary if available
  const safe = isRecord(value) ? value : {};
  const tokens = Array.isArray((safe as any).tokens) ? (safe as any).tokens : [];
  const keys = Array.isArray((safe as any).keys) ? (safe as any).keys : [];
  const composedMeaning = typeof (safe as any).composedMeaning === "string" ? (safe as any).composedMeaning : "";
  const notes = Array.isArray((safe as any).notes) ? (safe as any).notes.filter((x: any) => typeof x === "string") : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Root Map</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-zinc-400">STATE: PRESENT</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-xs text-zinc-500">WORD</div>
            <div className="font-mono break-words">{w || "—"}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500">NORMALIZED (BASIS)</div>
            <div className="font-mono break-words">{norm || "—"}</div>
          </div>
        </div>

        <div>
          <div className="text-xs text-zinc-500 mb-1">HIGHLIGHTS (NORMALIZED ONLY)</div>
          {renderHighlights(norm, v.spans)}
        </div>

        <div className="text-sm">
          <div className="text-xs text-zinc-500">TOKENS</div>
          <div className="font-mono break-words">
            {tokens.length ? tokens.map((t: any) => (typeof t?.token === "string" ? t.token : "<?>")).join(" | ") : "—"}
          </div>
        </div>

        <div className="text-sm">
          <div className="text-xs text-zinc-500">SUPPORTED KEYS (EXPLAINERS)</div>
          {keys.length ? (
            <ul className="list-disc pl-5 space-y-1">
              {keys.map((k: any, i: number) => {
                const token = typeof k?.token === "string" ? k.token : "<?>";

                const lang = typeof k?.language === "string" ? k.language : "<?>";

                const gloss = typeof k?.gloss === "string" ? k.gloss : "";

                const status = typeof k?.status === "string" ? k.status : "<?>";

                return (
                  <li key={i}>
                    <span className="font-mono">{token}</span>{" "}
                    <span className="text-zinc-400">({status})</span>{" "}
                    — {lang}{gloss ? `: ${gloss}` : ""}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-zinc-500">—</div>
          )}
        </div>

        <div className="text-sm">
          <div className="text-xs text-zinc-500">COMPOSED MEANING</div>
          <div className="break-words">{composedMeaning || "—"}</div>
        </div>

        {notes.length ? (
          <div className="text-sm">
            <div className="text-xs text-zinc-500">NOTES</div>
            <ul className="list-disc pl-5 space-y-1">
              {notes.map((n: string, i: number) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <details>
          <summary className="cursor-pointer text-xs text-zinc-400">Raw RootMap (debug)</summary>
          <pre className="mt-2 text-xs leading-snug whitespace-pre-wrap break-words">
            {JSON.stringify(value, null, 2)}
          </pre>
        </details>
      </CardContent>
    </Card>
  );
}
