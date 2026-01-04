"use client";

import React from "react";
import ChatShell from "@/components/ChatShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";

type Msg =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; text: string; result?: any; error?: string };

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function splitVowelPath(vowelPath: unknown): string[] {
  if (typeof vowelPath !== "string") return [];
  return vowelPath
    .split(/[-–—\s]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function VowelChips({ path }: { path: string[] }) {
  if (!path.length) return <span className="text-muted-foreground">—</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {path.map((v, i) => (
        <Badge key={`${v}-${i}`} variant="secondary" className="text-xs">
          {v}
        </Badge>
      ))}
    </div>
  );
}

function VoiceRow() {
  const order = ["O", "I", "U", "E", "Y", "A", "Ë"];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {order.map((v) => (
        <Badge key={v} variant="outline" className="text-xs">
          {v}
        </Badge>
      ))}
      <span className="text-xs text-muted-foreground ml-1">Seven-vowel</span>
    </div>
  );
}

export default function ZroChatPage() {
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [showRaw, setShowRaw] = React.useState(false);

  const [validation, setValidation] = React.useState<string | null>(null);
  const [statusBanner, setStatusBanner] = React.useState<string | null>(null);

  const [messages, setMessages] = React.useState<Msg[]>([
    { id: uid(), role: "assistant", text: "Type a word and press Analyze." },
  ]);

  async function run(wordRaw: string) {
    if (busy) return;

    const word = wordRaw.trim();

    if (!word) {
      setValidation("Type a word before analyzing.");
      setStatusBanner(null);
      return;
    }

    setValidation(null);
    setStatusBanner(null);

    const userMsg: Msg = { id: uid(), role: "user", text: word };
    const assistantMsg: Msg = { id: uid(), role: "assistant", text: "Analyzing…" };

    setMessages((m) => [...m, userMsg, assistantMsg]);
    setBusy(true);

    try {
      const res = await fetch(`/api/analyze-v1?word=${encodeURIComponent(word)}`, {
        method: "GET",
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }

      if (!res.ok) {
        setStatusBanner("Engine error");

        const err =
          (json && (json.error || json.message)) ||
          `HTTP ${res.status}`;

        setMessages((m) =>
          m.map((x) =>
            x.id === assistantMsg.id
              ? { ...x, text: "Request failed.", error: String(err), result: json ?? undefined }
              : x
          )
        );
        return;
      }

      setMessages((m) =>
        m.map((x) =>
          x.id === assistantMsg.id ? { ...x, text: "Result:", result: json ?? undefined } : x
        )
      );
    } catch (e: any) {
      setStatusBanner("Network error");

      setMessages((m) =>
        m.map((x) =>
          x.id === assistantMsg.id
            ? { ...x, text: "Request failed.", error: e?.message || "Request failed." }
            : x
        )
      );
    } finally {
      setBusy(false);
    }
  }

  const composer = (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">Enter a word</div>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setValidation(null);
            setStatusBanner(null);
          }}
          placeholder="study"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              run(input);
            }
          }}
          className="h-11"
        />
        <Button
          className="h-11"
          onClick={() => run(input)}
          disabled={busy}
          aria-busy={busy ? "true" : "false"}
        >
          {busy ? "Working…" : "Analyze"}
        </Button>
      </div>
    </div>
  );

  return (
    <ChatShell title="ZË-RO" subtitle="Seven-vowel word decoder." composer={composer}>
      <div className="space-y-4">
        {validation && (
          <div role="alert" className="text-sm text-red-400">
            {validation}
          </div>
        )}

        {statusBanner && (
          <div role="alert" className="text-sm text-red-400">
            {statusBanner}
          </div>
        )}

        <div className="mb-6" />

        <Card>
          <CardContent className="py-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium">Voices</div>
              <div className="text-xs text-muted-foreground">Shown in ring order (not A/E/I/O/U/Y/Ë)</div>
            </div>
            <VoiceRow />
          </CardContent>
        </Card>

        <div className="space-y-3">
          {messages.map((m) => {
            const isUser = m.role === "user";
            const result = m.role === "assistant" ? m.result : undefined;

            const vowelPath =
              result?.candidates?.[0]?.vowelPath ??
              result?.candidates?.[0]?.vowel_path ??
              result?.vowelPath ??
              result?.vowel_path;

            const engineVersion =
              result?.engineVersion ?? result?.engine_version ?? result?.meta?.engineVersion;

            const candidateLang =
              result?.candidates?.[0]?.language ?? result?.candidates?.[0]?.lang ?? "unknown";

            const wordShown = result?.word ?? result?.normalizedWord ?? "";

            return (
              <div key={m.id} className={isUser ? "flex justify-end" : "flex justify-start"}>
                <div className="w-full max-w-3xl">
                  <Card className={isUser ? "border-muted" : ""}>
                    <CardContent className="py-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-xs text-muted-foreground">{isUser ? "You" : "ZË-RO"}</div>
                        {engineVersion ? (
                          <Badge variant="outline" className="text-[11px]">
                            {String(engineVersion)}
                          </Badge>
                        ) : null}
                      </div>

                      <div className={isUser ? "text-base font-medium" : "text-sm"}>{m.text}</div>

                      {m.role === "assistant" && (m as any).error ? (
                        <div className="text-sm text-red-400">{(m as any).error}</div>
                      ) : null}

                      {m.role === "assistant" && result ? (
                        <>
                          <Separator />
                          <InstrumentPanel payload={result} />
                          <div className="grid gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                Candidate: {String(candidateLang)}
                              </Badge>
                              {wordShown ? (
                                <Badge variant="secondary" className="text-xs">
                                  Word: {String(wordShown)}
                                </Badge>
                              ) : null}
                            </div>

                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground">Vowel path</div>
                              <VowelChips path={splitVowelPath(vowelPath)} />
                            </div>

                            <Collapsible open={showRaw} onOpenChange={setShowRaw}>
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="justify-start px-0">
                                  {showRaw ? "Hide raw JSON" : "Show raw JSON"}
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <pre className="mt-2 rounded-md border bg-muted/20 p-3 text-xs overflow-auto">
{JSON.stringify(result, null, 2)}
                                </pre>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        </>
                      ) : null}
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ChatShell>
  );
}
