"use client";

import React from "react";

type AnyObj = Record<string, unknown>;

type OriginAnalysis = {
  // v1 shape
  heart?: AnyObj;
  // legacy shape
  core?: AnyObj;
  // other possible modern shapes
  primaryPath?: AnyObj;
  // candidates in either world
  candidates?: unknown[];
};

function joinStrings(x: unknown, sep = " → "): string {
  if (!Array.isArray(x)) return "";
  return x.filter((v): v is string => typeof v === "string").join(sep);
}

function getHeartLike(a: OriginAnalysis | null): AnyObj | null {
  if (!a) return null;
  // prefer v1
  if (a.heart && typeof a.heart === "object") return a.heart as AnyObj;
  // fallback legacy
  if (a.core && typeof a.core === "object") return a.core as AnyObj;
  return null;
}

function getVoicePathText(a: OriginAnalysis | null): string {
  if (!a) return "";

  const heartLike = getHeartLike(a);

  // v1: heart.principlePath: string[]
  const p1 = joinStrings((heartLike as any)?.principlePath);
  if (p1) return p1;

  // other modern: primaryPath.voicePath: string[]
  const p2 = joinStrings((a as any)?.primaryPath?.voicePath);
  if (p2) return p2;

  // legacy: core.voices.vowelVoices: string[]
  const p3 = joinStrings((heartLike as any)?.voices?.vowelVoices);
  if (p3) return p3;

  return "";
}

export type OriginSummaryProps = {
  analysis?: unknown;
};

export function OriginSummary({ analysis }: OriginSummaryProps) {
  const a = (analysis && typeof analysis === "object" ? (analysis as OriginAnalysis) : null);

  const voicePathText = getVoicePathText(a);
  const candidates = Array.isArray(a?.candidates) ? a!.candidates : [];

  if (!a) return null;

  // Keep this component lightweight: it’s a “summary”, not the full results view.
  const top = candidates[0] as any;

  const topLine =
    top && typeof top === "object"
      ? [top.language, top.form].filter((x: any) => typeof x === "string" && x.length).join(" · ")
      : "";

  return (
    <div className="space-y-1 text-sm">
      {voicePathText ? (
        <div>
          <span className="text-muted-foreground">Path:</span>{" "}
          <span className="font-mono">{voicePathText}</span>
        </div>
      ) : null}

      {topLine ? (
        <div>
          <span className="text-muted-foreground">Top:</span>{" "}
          <span className="font-semibold">{topLine}</span>
        </div>
      ) : null}
    </div>
  );
}
