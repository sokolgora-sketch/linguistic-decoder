"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import type { Alphabet } from "@/lib/runAnalysis";
import { analyzeClient } from "@/lib/analyzeClient";
import type {
  EnginePayload,
  AnalysisResult_DEPRECATED,
} from "@/shared/engineShape";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import { VOICE_COLOR_MAP, VOICE_LABEL_MAP } from "@/shared/voiceColors";

type Mode = "strict" | "open";

type SideState = {
  word: string;
  loading: boolean;
  error: string | null;
  payload: EnginePayload | null;
  result: AnalysisResult_DEPRECATED | null;
};

const initialSide: SideState = {
  word: "",
  loading: false,
  error: null,
  payload: null,
  result: null,
};

interface ComparePanelProps {
  defaultMode: Mode;
  defaultAlphabet: Alphabet;
}

type OriginCandidate = {
  language?: string | null;
  family?: string | null;
  form?: string | null;
};

type OriginRelation =
  | { code: "same"; label: "SAME FAMILY"; detail?: string }
  | { code: "different"; label: "DIFFERENT FAMILIES"; detail?: string }
  | { code: "unknown"; label: "UNKNOWN"; detail?: string };

function classifyOriginRelation(
  left?: OriginCandidate | null,
  right?: OriginCandidate | null
): OriginRelation {
  if (!left || !right) {
    return {
      code: "unknown",
      label: "UNKNOWN",
      detail: "One side has no origin candidate yet.",
    };
  }

  const leftLang = left.language?.toLowerCase() ?? "";
  const rightLang = right.language?.toLowerCase() ?? "";
  const leftFam = left.family?.toLowerCase() ?? "";
  const rightFam = right.family?.toLowerCase() ?? "";

  const sameFamily =
    leftFam !== "" && rightFam !== "" && leftFam === rightFam;
  const sameLanguage =
    leftLang !== "" && rightLang !== "" && leftLang === rightLang;

  if (sameLanguage || sameFamily) {
    const familyLabel =
      leftFam ||
      rightFam ||
      (leftLang === rightLang ? leftLang : `${leftLang} / ${rightLang}`);

    return {
      code: "same",
      label: "SAME FAMILY",
      detail: familyLabel
        ? `Both sides lean on ${familyLabel} roots.`
        : undefined,
    };
  }

  if (!leftFam && !rightFam && !leftLang && !rightLang) {
    return {
      code: "unknown",
      label: "UNKNOWN",
      detail: "The engine has not proposed any origins yet.",
    };
  }

  return {
    code: "different",
    label: "DIFFERENT FAMILIES",
    detail:
      leftLang || rightLang
        ? `Left: ${leftLang || "—"} vs right: ${rightLang || "—"}.`
        : undefined,
  };
}

// --- Origin comparison helper ---
function analyzeOriginRelation(
  left: any,
  right: any
): { family: string; mirror: string } {
  const leftFamily = left?.result?.origin?.family || left?.result?.originCandidate || "";
  const rightFamily = right?.result?.origin?.family || right?.result?.originCandidate || "";

  let family = "Unknown";
  if (leftFamily && rightFamily) {
    if (leftFamily === rightFamily) family = `Shared (${leftFamily})`;
    else family = `Different (${leftFamily} vs ${rightFamily})`;
  }

  const leftPrinciples = left?.result?.primary?.principlesPath || [];
  const rightPrinciples = right?.result?.primary?.principlesPath || [];
  let mirror = "No";
  if (leftPrinciples.length && rightPrinciples.length) {
    const lOpen = leftPrinciples[0];
    const lClose = leftPrinciples[leftPrinciples.length - 1];
    const rOpen = rightPrinciples[0];
    const rClose = rightPrinciples[rightPrinciples.length - 1];

    if (lOpen === rClose && lClose === rOpen) mirror = "YES — reversed path";
    else if (lClose === rClose) mirror = "Similar — same closure";
  }

  return { family, mirror };
}

function formatFunctionLine(
  word: string | null | undefined,
  fn: string | null | undefined
): string {
  const label = (word ?? "").trim();
  if (!fn) {
    return label || "—";
  }

  const trimmed = fn.trim();
  if (!trimmed) {
    return label || "—";
  }

  // lower-case first letter so it reads as a continuation
  const first = trimmed.charAt(0).toLowerCase();
  const rest = trimmed.slice(1);
  const lowered = first + rest;

  // drop trailing dots and add a single one
  const noTrailingDot = lowered.replace(/\.*$/, "");

  return label
    ? `${label} — ${noTrailingDot}.`
    : `${noTrailingDot}.`;
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function describeVoice(v: string | null): string {
  if (!v) return "—";
  const label = VOICE_LABEL_MAP[v as keyof typeof VOICE_LABEL_MAP] ?? "";
  return label ? `${v} (${label})` : v;
}

function VoicePathChips({ path }: { path: string[] }) {
  if (!path.length) {
    return (
      <p className="text-[11px] text-muted-foreground">
        No primary path computed for this word.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {path.map((v, idx) => {
        const color = VOICE_COLOR_MAP[v as keyof typeof VOICE_COLOR_MAP] ?? "#888";
        return (
          <span
            key={`${v}-${idx}`}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[11px] font-mono"
            style={{
              borderColor: color,
              backgroundColor: `${color}22`,
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span>{v}</span>
          </span>
        );
      })}
    </div>
  );
}

/**
 * Turn a principlesPath like ["Unity","Insight"] or ["Truth","Expansion"]
 * into a short functional sentence using Seven-Voices logic.
 */
function describePrinciplesNarrative(path: string[] | null | undefined): string {
  if (!path || !path.length) {
    return "No clear principle path detected.";
  }

  const [p0, p1] = path;
  const key = p1 ? `${p0}->${p1}` : p0;

  const MAP: Record<string, string> = {
    "Truth->Expansion":
      "An act or cut that exposes something and spreads its effect outward.",
    "Truth->Insight":
      "A sharp realisation or judgement that reveals what is really there.",
    "Truth->Unity":
      "A clear decision that pulls things into one aligned direction.",
    "Expansion->Insight":
      "Opening or stretching something in order to see and understand its pattern.",
    "Unity->Insight":
      "Gathering many elements into one field so the pattern becomes clear.",
    "Evolution->Insight":
      "A change or wound that becomes recognised, understood, and integrated.",
    "Evolution->Expansion":
      "A shift or break that then propagates, spreading its consequences.",
    "Unity->Evolution":
      "Holding things together until they transform into a new state.",
    "Balance->Insight":
      "Centered, mediated experience that leads to clear perception.",
    "Network Integrity->Insight":
      "Signals across the network revealing an underlying pattern.",
    "Evolution->Unity":
      "Multiple changes consolidating into a single stable form.",
    "Insight->Evolution":
      "Understanding that triggers or accelerates transformation.",
  };

  if (MAP[key]) return MAP[key];

  if (!p1) {
    return `Rooted in ${p0.toLowerCase()}, with no clear second movement.`;
  }

  return `Movement from ${p0.toLowerCase()} to ${p1.toLowerCase()}, combining their qualities.`;
}

// ---- Axes helpers ----------------------------------------------------------

type AxisStatus = "pass" | "fail" | "unknown";

function normalizeAxisStatus(raw: any): AxisStatus {
  if (raw === "pass" || raw === true || raw === "ok") return "pass";
  if (raw === "fail" || raw === false || raw === "no") return "fail";
  return "unknown";
}

function AxisPill({ label, status }: { label: string; status: AxisStatus }) {
  const base =
    "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[10px] font-mono";

  let extra = "";
  let dot = "";

  switch (status) {
    case "pass":
      extra = "border-emerald-500/70 bg-emerald-500/10 text-emerald-300";
      dot = "bg-emerald-400";
      break;
    case "fail":
      extra = "border-red-500/70 bg-red-500/10 text-red-300";
      dot = "bg-red-400";
      break;
    default:
      extra = "border-border/60 bg-muted/40 text-muted-foreground";
      dot = "bg-muted-foreground/60";
  }

  return (
    <span className={`${base} ${extra}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span>{label}</span>
    </span>
  );
}

function AxesRow({ axes }: { axes: any }) {
  const hasRealAxes =
    axes &&
    Object.values(axes).some((v) => v !== undefined && v !== null && v !== "");

  const statusPrinciples = normalizeAxisStatus(axes?.principles);
  const statusConsonants = normalizeAxisStatus(axes?.consonants);
  const statusMorphology = normalizeAxisStatus(axes?.morphology);
  const statusFamily = normalizeAxisStatus(axes?.family);

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      <AxisPill
        label="principles"
        status={hasRealAxes ? statusPrinciples : "unknown"}
      />
      <AxisPill
        label="consonants"
        status={hasRealAxes ? statusConsonants : "unknown"}
      />
      <AxisPill
        label="morphology"
        status={hasRealAxes ? statusMorphology : "unknown"}
      />
      <AxisPill
        label="family"
        status={hasRealAxes ? statusFamily : "unknown"}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const ComparePanel: React.FC<ComparePanelProps> = ({
  defaultMode,
  defaultAlphabet,
}) => {
  const [left, setLeft] = useState<SideState>({ ...initialSide });
  const [right, setRight] = useState<SideState>({ ...initialSide });

  async function runAnalysis(side: "left" | "right") {
    const sideState = side === "left" ? left : right;
    const setSide = side === "left" ? setLeft : setRight;

    const word = sideState.word.trim();
    if (!word) {
      setSide((prev) => ({
        ...prev,
        error: "Enter a word first.",
      }));
      return;
    }

    setSide((prev) => ({
      ...prev,
      loading: true,
      error: null,
      payload: null,
      result: null,
    }));

    try {
      // Same pipeline as the main page
      const payload: EnginePayload = await analyzeClient(
        word,
        defaultMode,
        defaultAlphabet,
        {
          edgeWeight: 0.25,
          useAi: false,
        }
      );

      const result = enginePayloadToAnalysisResult(payload);

      setSide((prev) => ({
        ...prev,
        loading: false,
        error: null,
        payload,
        result,
      }));
    } catch (err: any) {
      console.error("ComparePanel analysis error:", err);
      setSide((prev) => ({
        ...prev,
        loading: false,
        error: err?.message ?? "Failed to analyze word.",
        payload: null,
        result: null,
      }));
    }
  }

  // -----------------------------------------------------------------------
  // Derived comparison data
  // -----------------------------------------------------------------------

  const leftVoicePath: string[] = Array.isArray(
    (left.payload as any)?.primaryPath?.voicePath
  )
    ? ((left.payload as any).primaryPath.voicePath as string[])
    : [];

  const rightVoicePath: string[] = Array.isArray(
    (right.payload as any)?.primaryPath?.voicePath
  )
    ? ((right.payload as any).primaryPath.voicePath as string[])
    : [];

  const primaryPathEqual =
    leftVoicePath.length > 0 &&
    rightVoicePath.length > 0 &&
    leftVoicePath.join("") === rightVoicePath.join("");

  const leftHeart: any = (left.result as any)?.math7?.primary ?? null;
  const rightHeart: any = (right.result as any)?.math7?.primary ?? null;

  const leftHeartState =
    leftHeart?.state ?? leftHeart?.cycleState ?? leftHeart?.heartState ?? null;
  const rightHeartState =
    rightHeart?.state ?? rightHeart?.cycleState ?? rightHeart?.heartState ?? null;

  const leftPrinciplesPath: string[] | null = Array.isArray(
    leftHeart?.principlesPath
  )
    ? (leftHeart.principlesPath as string[])
    : null;

  const rightPrinciplesPath: string[] | null = Array.isArray(
    rightHeart?.principlesPath
  )
    ? (rightHeart.principlesPath as string[])
    : null;

  const leftHeartLabel = leftHeart
    ? `${leftHeartState ?? "—"} · ${
        leftPrinciplesPath ? leftPrinciplesPath.join(" → ") : "—"
      }`
    : "—";

  const rightHeartLabel = rightHeart
    ? `${rightHeartState ?? "—"} · ${
        rightPrinciplesPath ? rightPrinciplesPath.join(" → ") : "—"
      }`
    : "—";

  const leftOpener = leftVoicePath[0] ?? null;
  const leftCloser =
    leftVoicePath.length > 1
      ? leftVoicePath[leftVoicePath.length - 1]
      : leftOpener;

  const rightOpener = rightVoicePath[0] ?? null;
  const rightCloser =
    rightVoicePath.length > 1
      ? rightVoicePath[rightVoicePath.length - 1]
      : rightOpener;

  const sharedVoices: string[] =
    leftVoicePath.length && rightVoicePath.length
      ? Array.from(
          new Set(leftVoicePath.filter((v) => rightVoicePath.includes(v)))
        )
      : [];

  const leftCandidates: any[] =
    ((left.result as any)?.candidates ??
      (left.payload as any)?.candidates ??
      []) as any[];

  const rightCandidates: any[] =
    ((right.result as any)?.candidates ??
      (right.payload as any)?.candidates ??
      []) as any[];

  const leftMainCand = leftCandidates[0] ?? null;
  const rightMainCand = rightCandidates[0] ?? null;

  const leftFunctionText = describePrinciplesNarrative(leftPrinciplesPath || []);
  const rightFunctionText = describePrinciplesNarrative(
    rightPrinciplesPath || []
  );

  const originRelation = classifyOriginRelation(leftMainCand, rightMainCand);

  // --- Origin relationship ---
  const originRelationLegacy = analyzeOriginRelation(left, right);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <Card className="mt-2">
      <CardHeader>
        <CardTitle className="text-sm sm:text-base">
          Compare Two Words (Seven-Voices core)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs row */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* LEFT SIDE ---------------------------------------------------- */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wide">
              Left word
            </label>
            <div className="flex gap-2">
              <Input
                value={left.word}
                placeholder="e.g. study"
                onChange={(e) =>
                  setLeft((prev) => ({
                    ...prev,
                    word: e.target.value,
                    error: null,
                  }))
                }
              />
              <Button
                type="button"
                size="sm"
                disabled={left.loading}
                onClick={() => runAnalysis("left")}
              >
                {left.loading ? "…" : "Run"}
              </Button>
            </div>
            {left.error && (
              <p className="text-[11px] text-red-500">{left.error}</p>
            )}

            {left.result && (
              <div className="mt-2 rounded-lg border border-border/60 p-3 text-xs space-y-2">
                <div className="font-semibold">
                  Word:{" "}
                  <span className="font-mono">
                    {left.word.trim() || "—"}
                  </span>
                </div>

                {leftVoicePath.length > 0 && (
                  <div className="mt-1">
                    <div className="text-[11px] text-muted-foreground">
                      Voice path:
                    </div>
                    <VoicePathChips path={leftVoicePath} />
                  </div>
                )}

                <div className="mt-2 text-[11px] text-muted-foreground space-y-0.5">
                  <div>Opener: {describeVoice(leftOpener)}</div>
                  <div>Closer: {describeVoice(leftCloser)}</div>
                </div>

                {leftHeart && (
                  <div className="mt-2 space-y-0.5">
                    <div>
                      Heart state:{" "}
                      <span className="font-semibold">
                        {leftHeartState ?? "—"}
                      </span>
                    </div>
                    <div>
                      Total mod 7:{" "}
                      <span className="font-mono">
                        {leftHeart.totalMod7 ?? "—"}
                      </span>
                    </div>
                    <div>
                      Principles path:{" "}
                      <span className="font-mono">
                        {leftPrinciplesPath
                          ? leftPrinciplesPath.join(" → ")
                          : "—"}
                      </span>
                    </div>
                  </div>
                )}

                {leftPrinciplesPath && (
                  <div className="mt-2 text-[11px] text-muted-foreground">
                    Functional (principles):{" "}
                    <span className="text-[11px]">
                      {leftFunctionText}
                    </span>
                  </div>
                )}

                {leftMainCand && (
                  <div className="mt-2 text-[11px] text-muted-foreground space-y-0.5">
                    <div>
                      Origin candidate:{" "}
                      <span className="font-mono">
                        {leftMainCand.language} · {leftMainCand.form}
                      </span>
                    </div>
                    {leftMainCand.decomposition?.functionalStatement && (
                      <div>
                        Origin function:{" "}
                        <span className="text-[11px]">
                          {leftMainCand.decomposition.functionalStatement}
                        </span>
                      </div>
                    )}
                    <AxesRow axes={leftMainCand.axes} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT SIDE --------------------------------------------------- */}
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wide">
              Right word
            </label>
            <div className="flex gap-2">
              <Input
                value={right.word}
                placeholder="e.g. damage"
                onChange={(e) =>
                  setRight((prev) => ({
                    ...prev,
                    word: e.target.value,
                    error: null,
                  }))
                }
              />
              <Button
                type="button"
                size="sm"
                disabled={right.loading}
                onClick={() => runAnalysis("right")}
              >
                {right.loading ? "…" : "Run"}
              </Button>
            </div>
            {right.error && (
              <p className="text-[11px] text-red-500">{right.error}</p>
            )}

            {right.result && (
              <div className="mt-2 rounded-lg border border-border/60 p-3 text-xs space-y-2">
                <div className="font-semibold">
                  Word:{" "}
                  <span className="font-mono">
                    {right.word.trim() || "—"}
                  </span>
                </div>

                {rightVoicePath.length > 0 && (
                  <div className="mt-1">
                    <div className="text-[11px] text-muted-foreground">
                      Voice path:
                    </div>
                    <VoicePathChips path={rightVoicePath} />
                  </div>
                )}

                <div className="mt-2 text-[11px] text-muted-foreground space-y-0.5">
                  <div>Opener: {describeVoice(rightOpener)}</div>
                  <div>Closer: {describeVoice(rightCloser)}</div>
                </div>

                {rightHeart && (
                  <div className="mt-2 space-y-0.5">
                    <div>
                      Heart state:{" "}
                      <span className="font-semibold">
                        {rightHeartState ?? "—"}
                      </span>
                    </div>
                    <div>
                      Total mod 7:{" "}
                      <span className="font-mono">
                        {rightHeart.totalMod7 ?? "—"}
                      </span>
                    </div>
                    <div>
                      Principles path:{" "}
                      <span className="font-mono">
                        {rightPrinciplesPath
                          ? rightPrinciplesPath.join(" → ")
                          : "—"}
                      </span>
                    </div>
                  </div>
                )}

                {rightPrinciplesPath && (
                  <div className="mt-2 text-[11px] text-muted-foreground">
                    Functional (principles):{" "}
                    <span className="text-[11px]">
                      {rightFunctionText}
                    </span>
                  </div>
                )}

                {rightMainCand && (
                  <div className="mt-2 text-[11px] text-muted-foreground space-y-0.5">
                    <div>
                      Origin candidate:{" "}
                      <span className="font-mono">
                        {rightMainCand.language} · {rightMainCand.form}
                      </span>
                    </div>
                    {rightMainCand.decomposition?.functionalStatement && (
                      <div>
                        Origin function:{" "}
                        <span className="text-[11px]">
                          {rightMainCand.decomposition.functionalStatement}
                        </span>
                      </div>
                    )}
                    <AxesRow axes={rightMainCand.axes} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Comparison summary --------------------------------------------- */}
        {left.result && right.result && (
          <div className="mt-4 rounded-lg border border-border/70 bg-muted/40 p-3 text-xs space-y-2">
            <div className="font-semibold text-sm mb-1">
              Comparison summary
            </div>

            <div>
              Primary path:{" "}
              <span className="font-mono">
                {primaryPathEqual ? "SAME" : "DIFFERENT"}
              </span>
            </div>
            <div>
              Opener:{" "}
              <span className="font-mono">
                {describeVoice(leftOpener)}{" "}
                {" vs "}
                {describeVoice(rightOpener)}
              </span>
            </div>
            <div>
              Closer:{" "}
              <span className="font-mono">
                {describeVoice(leftCloser)}{" "}
                {" vs "}
                {describeVoice(rightCloser)}
              </span>
            </div>
            <div>
              Total mod 7:{" "}
              <span className="font-mono">
                {leftHeart?.totalMod7 ?? "—"}
              </span>{" "}
              vs{" "}
              <span className="font-mono">
                {rightHeart?.totalMod7 ?? "—"}
              </span>
            </div>
            <div>
              Left heart:{" "}
              <span className="font-mono">{leftHeartLabel}</span>
            </div>
            <div>
              Right heart:{" "}
              <span className="font-mono">{rightHeartLabel}</span>
            </div>
            <div>
              Shared voices:{" "}
              <span className="font-mono">
                {sharedVoices.length ? sharedVoices.join(", ") : "none"}
              </span>
            </div>

            <div>
              Left function (principles):{" "}
              {left.word && (
                <span className="font-semibold mr-1">
                  {left.word.trim()}
                </span>
              )}
              <span className="font-mono">{leftFunctionText}</span>
            </div>
            <div>
              Right function (principles):{" "}
              {right.word && (
                <span className="font-semibold mr-1">
                  {right.word.trim()}
                </span>
              )}
              <span className="font-mono">{rightFunctionText}</span>
            </div>

            <div>
              Origin:{" "}
              <span className="font-mono">
                {leftMainCand
                  ? `${leftMainCand.language} · ${leftMainCand.form}`
                  : "—"}
              </span>{" "}
              vs{" "}
              <span className="font-mono">
                {rightMainCand
                  ? `${rightMainCand.language} · ${rightMainCand.form}`
                  : "—"}
              </span>
            </div>

            <div>
              <span className="font-semibold">Origin relation:</span>{" "}
              {originRelation.label}
              {originRelation.detail ? ` — ${originRelation.detail}` : ""}
            </div>

            <div>
              Origin function (left):{" "}
              <span className="font-mono">
                {leftMainCand?.decomposition?.functionalStatement ?? "—"}
              </span>
            </div>
            <div>
              Origin function (right):{" "}
              <span className="font-mono">
                {rightMainCand?.decomposition?.functionalStatement ?? "—"}
              </span>
            </div>

            <div className="text-[11px] text-muted-foreground mt-1">
              Both sides use the same engine pipeline
              (EnginePayload → analysisAdapter → math7). This panel shows how
              their paths open, close, overlap, and what kind of functional
              movement each word encodes at the Seven-Voices level, including
              the best origin candidate and its axes when available.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComparePanel;
