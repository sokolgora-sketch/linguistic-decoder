"use client";

import React from "react";

type AnyObj = Record<string, unknown>;

type AnalysisLike = {
  // v1-ish
  heart?: AnyObj;
  primaryPath?: AnyObj;

  // legacy
  sevenVoices?: AnyObj;
};

function asStringArray(x: unknown): string[] {
  if (!Array.isArray(x)) return [];
  return x.filter((v): v is string => typeof v === "string");
}

function pickPrinciples(a: AnalysisLike | null): string[] {
  if (!a) return [];

  // v1: heart.principlePath: string[]
  const p1 = asStringArray((a.heart as any)?.principlePath);
  if (p1.length) return p1;

  // v1: heart.math7.primary.principlesPath: string[]
  const p2 = asStringArray((a.heart as any)?.math7?.primary?.principlesPath);
  if (p2.length) return p2;

  // Some shapes: primaryPath.voicePath (already string[]) – treat as principles path
  const p3 = asStringArray((a as any)?.primaryPath?.voicePath);
  if (p3.length) return p3;

  // legacy: sevenVoices.principlePath / principlesPath
  const p4 = asStringArray((a.sevenVoices as any)?.principlePath);
  if (p4.length) return p4;

  const p5 = asStringArray((a.sevenVoices as any)?.principlesPath);
  if (p5.length) return p5;

  return [];
}

export type PrinciplesBlockProps = {
  analysis?: unknown;
};

export function PrinciplesBlock({ analysis }: PrinciplesBlockProps) {
  const a =
    analysis && typeof analysis === "object"
      ? (analysis as AnalysisLike)
      : null;

  const principles = pickPrinciples(a);

  if (!principles.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No principles path available.
      </div>
    );
  }

  return (
    <div className="space-y-1 text-sm">
      <div className="text-muted-foreground">Principles path</div>
      <div className="font-mono">{principles.join(" → ")}</div>
    </div>
  );
}
