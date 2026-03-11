"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronRight, ExternalLink, Lock } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type VoiceId = "A" | "O" | "E" | "Ë" | "U" | "Y" | "I";

type VoiceSpec = {
  id: VoiceId;
  weight: number;
  ipa: string;
  examples: string[];
  color: string;
};

type ChartPoint = {
  bucket: string;
  idx: number;
  mean: number;
};

type BaselineCard = {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  tone: "red" | "dim";
  rows: Array<{ key: string; value: string }>;
  note: string;
};

type LlmProviderRow = {
  provider: string;
  model: string;
  bestDisplay: string;
  bestMagnitude: number;
  meanDisplay: string;
  regimeLabel?: string;
  regimeTone?: "good" | "mid" | "weak" | "inverted";
};

type LlmPaper = {
  id: string;
  tab: string;
  title: string;
  subtitle: string;
  note?: string;
  badges: string[];
  summary: string;
  providers: LlmProviderRow[];
  emphasisNote?: string;
};

type FaqItem = {
  q: string;
  a: string;
};

const COLORS = {
  bg: "#181818",
  card: "#232323",
  border: "#686868",
  red: "#d93333",
  green: "#16a34a",
  ink: "#f5f5f5",
  muted: "#a3a3a3",
  soft: "#737373",
};

const VOICES: VoiceSpec[] = [
  { id: "A", weight: 1.0, ipa: "/a/", examples: ["vast", "broad", "open"], color: "#d93333" },
  { id: "O", weight: 0.82, ipa: "/o/", examples: ["orb", "whole", "round"], color: "#e0622a" },
  { id: "E", weight: 0.68, ipa: "/e/", examples: ["spread", "field", "reach"], color: "#d49b17" },
  { id: "Ë", weight: 0.56, ipa: "/ə/", examples: ["state", "unit", "named"], color: "#7ab83b" },
  { id: "U", weight: 0.42, ipa: "/u/", examples: ["flow", "move", "channel"], color: "#1f9d8b" },
  { id: "Y", weight: 0.26, ipa: "/y/", examples: ["thin", "tense", "narrow"], color: "#2f6fd6" },
  { id: "I", weight: 0.12, ipa: "/i/", examples: ["tip", "focus", "precise"], color: "#7c3aed" },
];

const TICKER_ITEMS = [
  "TURKISH STEP20 · paper v0.1",
  "ALBANIAN STEP10 · paper v0.1",
  "PSEUDOWORD CONTROL · paper v0.1",
  "LLM FRESH-CHAT BATTERY · paper v0.1",
  "LLM SAME-THREAD BATTERY · paper v0.1",
];

const CHART_POINTS: ChartPoint[] = [
  { bucket: "V1", idx: 1, mean: 0.955 },
  { bucket: "V2", idx: 2, mean: 0.760 },
  { bucket: "V3", idx: 3, mean: 0.587 },
  { bucket: "V4", idx: 4, mean: 0.563 },
  { bucket: "V5", idx: 5, mean: 0.400 },
  { bucket: "V6", idx: 6, mean: 0.307 },
  { bucket: "V7", idx: 7, mean: 0.125 },
];

const BASELINES: BaselineCard[] = [
  {
    id: "turkish",
    emoji: "🇹🇷",
    title: "Turkish STEP20",
    subtitle: "Cross-linguistic validation (baseline-locked)",
    tone: "red",
    rows: [
      { key: "Pearson r", value: "−0.989" },
      { key: "Spearman ρ", value: "−1.000" },
      { key: "p_perm", value: "< 0.001" },
    ],
    note: "N=140 (nPerBucket=20, paper v0.1)",
  },
  {
    id: "albanian",
    emoji: "🇦🇱",
    title: "Albanian STEP10",
    subtitle: "Gegë vs Tosk replication (baseline-locked)",
    tone: "red",
    rows: [
      { key: "Bucket means", value: "committed" },
      { key: "Dialect pairing", value: "70 pairs" },
      { key: "Slope stats", value: "add next" },
    ],
    note: "N=140 (paired; baseline-locked)",
  },
  {
    id: "pseudo",
    emoji: "♾",
    title: "Pseudowords (Control)",
    subtitle: "Negative control (no semantic intent)",
    tone: "dim",
    rows: [
      { key: "Pearson r", value: "−0.590" },
      { key: "Spearman ρ", value: "−0.536" },
      { key: "p_perm", value: "0.158" },
    ],
    note: "N=140 (control; should be weak/flat)",
  },
];

const LLM_PAPERS: LlmPaper[] = [
  {
    id: "paper1",
    tab: "Paper 1",
    title: "Fresh-chat · n=12 runs each",
    subtitle: "Paper v0.1 snapshot · not live data",
    summary: "Source: LingBuzz/009799",
    badges: ["fresh-chat", "paper v0.1", "snapshot"],
    providers: [
      {
        provider: "OpenAI",
        model: "chatgpt-5-2-thinking",
        bestDisplay: "−0.871",
        bestMagnitude: 0.871,
        meanDisplay: "−0.775",
      },
      {
        provider: "DeepSeek",
        model: "deepseek-thinking",
        bestDisplay: "−0.808",
        bestMagnitude: 0.808,
        meanDisplay: "−0.362",
      },
      {
        provider: "xAI",
        model: "grok-expert",
        bestDisplay: "−0.759",
        bestMagnitude: 0.759,
        meanDisplay: "−0.225",
      },
      {
        provider: "Google",
        model: "gemini-3-thinking",
        bestDisplay: "−0.706",
        bestMagnitude: 0.706,
        meanDisplay: "−0.238",
      },
      {
        provider: "Anthropic",
        model: "claude-4.6-sonnet-extended",
        bestDisplay: "−0.393",
        bestMagnitude: 0.393,
        meanDisplay: "−0.096",
      },
    ],
  },
  {
    id: "paper2",
    tab: "Paper 2",
    title: "Same-thread · n=10 runs each",
    subtitle: "Paper v0.1 snapshot · not live data",
    summary: "Source: LingBuzz/009808",
    badges: ["same-thread", "paper v0.1", "snapshot"],
    providers: [
      {
        provider: "xAI",
        model: "grok-expert",
        bestDisplay: "−0.917",
        bestMagnitude: 0.917,
        meanDisplay: "−0.559",
        regimeLabel: "stabilization/re-lock",
        regimeTone: "good",
      },
      {
        provider: "OpenAI",
        model: "chatgpt-5-2-thinking",
        bestDisplay: "−0.758",
        bestMagnitude: 0.758,
        meanDisplay: "−0.391",
        regimeLabel: "oscillatory recovery",
        regimeTone: "mid",
      },
      {
        provider: "DeepSeek",
        model: "deepseek-thinking",
        bestDisplay: "−0.527",
        bestMagnitude: 0.527,
        meanDisplay: "−0.059",
        regimeLabel: "recovery w/o retention",
        regimeTone: "mid",
      },
      {
        provider: "Anthropic",
        model: "claude-4.6-sonnet-extended",
        bestDisplay: "−0.310",
        bestMagnitude: 0.310,
        meanDisplay: "−0.019",
        regimeLabel: "weak mixed",
        regimeTone: "weak",
      },
      {
        provider: "Google",
        model: "gemini-3-thinking",
        bestDisplay: "−0.479",
        bestMagnitude: 0.479,
        meanDisplay: "+0.485",
        regimeLabel: "⚠ inversion/lock",
        regimeTone: "inverted",
      },
    ],
    emphasisNote:
      "Google is the only provider where mean r went positive (+0.485) under same-thread feedback — the only direction inversion in the battery.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Copy the task",
    body: "Open /evals and copy the task prompt. ZË-RO does not call the model for you.",
  },
  {
    step: "02",
    title: "Run your model",
    body: "Paste the task into GPT, Claude, Gemini, Grok, or another model that returns bucketed tokens.",
  },
  {
    step: "03",
    title: "Score the output",
    body: "Paste the JSON back into ZË-RO, score deterministically, then export the report.",
  },
];

const FOUNDATION_POINTS = [
  "baseline-locked drift detection",
  "permutation tests (12k iters)",
  "cross-linguistic validation",
  "negative controls (pseudowords)",
  "deterministic scoring",
  "open reproducibility posture",
];

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "What is ZË-RO measuring?",
    a: "It measures whether bucketed token outputs preserve a vowel-aperture ordering signal across a fixed V1→V7 ladder.",
  },
  {
    q: "Why is the vowel set fixed as A, O, E, Ë, U, Y, I?",
    a: "Because the instrument must stay consistent. The landing page, evals page, and reporting language use the same locked seven-voice order.",
  },
  {
    q: "Why show pseudowords?",
    a: "They act as a negative control. If the control looks strong, the instrument or the dataset is suspect.",
  },
  {
    q: "Does ZË-RO use live model APIs?",
    a: "No. You bring the model output. ZË-RO scores what you paste and keeps the measurement path deterministic.",
  },
  {
    q: "Why do you label the paper blocks as snapshot data?",
    a: "Because the landing page should show fixed reference evidence, not pretend that the numbers are updating live.",
  },
];

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function useMountedAnimation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return mounted;
}

function useRevealOnScreen() {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return { setNode, visible };
}

function LandingButton(props: {
  href?: string;
  disabled?: boolean;
  label: string;
  tooltip?: string;
  external?: boolean;
}) {
  const buttonBody = props.disabled ? (
    <button
      type="button"
      disabled
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm uppercase tracking-[0.12em] transition sm:w-auto",
        "font-mono",
        "border-[#686868] bg-[#232323] text-neutral-500"
      )}
    >
      {props.label}
      <Lock className="h-3.5 w-3.5" />
    </button>
  ) : props.external ? (
    <Link
      href={props.href ?? "#"}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm uppercase tracking-[0.12em] transition sm:w-auto",
        "font-mono border-[#686868] bg-[#232323] text-[#f5f5f5] hover:border-[#d93333]"
      )}
    >
      {props.label}
      <ExternalLink className="h-3.5 w-3.5" />
    </Link>
  ) : (
    <Link
      href={props.href ?? "#"}
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm uppercase tracking-[0.12em] transition sm:w-auto",
        "font-mono",
        props.label === "Try Evals"
          ? "border-[#d93333] bg-[#d93333] text-white hover:opacity-90"
          : "border-[#686868] bg-[#232323] text-[#f5f5f5] hover:border-[#d93333]"
      )}
    >
      {props.label}
      {props.label === "Try Evals" ? <ArrowRight className="h-3.5 w-3.5" /> : null}
    </Link>
  );

  if (!props.tooltip) {
    return buttonBody;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>{buttonBody}</span>
      </TooltipTrigger>
      <TooltipContent
        className="border-[#686868] bg-[#232323] text-[11px] font-mono uppercase tracking-[0.12em] text-neutral-200"
      >
        {props.tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

function StatsTicker() {
  const loop = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="overflow-hidden rounded-md border border-[#686868] bg-[#232323]">
      <div
        className="flex min-w-max gap-6 px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] text-neutral-300 sm:gap-10 sm:px-5 sm:py-3 sm:text-[11px]"
        style={{
          fontFamily: 'Courier New, monospace',
          animation: "ticker-slide 28s linear infinite",
        }}
      >
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="whitespace-nowrap">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function ApertureBar({ mounted }: { mounted: boolean }) {
  return (
    <div className="rounded-md border border-[#686868] bg-[#232323] p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="text-[11px] uppercase tracking-[0.14em] text-neutral-400"
          style={{ fontFamily: "Courier New, monospace" }}
        >
          7-voice aperture scale — open → closed
        </div>
        <div
          className="text-[11px] uppercase tracking-[0.14em] text-neutral-500"
          style={{ fontFamily: "Courier New, monospace" }}
        >
          A, O, E, Ë, U, Y, I
        </div>
      </div>

      <TooltipProvider delayDuration={80}>
          <div className="overflow-x-auto">
            <div className="grid min-w-[560px] grid-cols-7 overflow-hidden rounded-md border border-[#686868] sm:min-w-0">
          {VOICES.map((voice, index) => (
            <Tooltip key={voice.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="group relative flex min-h-[104px] flex-col items-center justify-center gap-2 border-r border-[#686868] px-1.5 py-2.5 last:border-r-0 sm:min-h-[112px] sm:px-2 sm:py-3"
                  style={{
                    background:
                      voice.id === "A"
                        ? "#1f1212"
                        : voice.id === "O"
                        ? "#1c1414"
                        : voice.id === "E"
                        ? "#1a1616"
                        : voice.id === "Ë"
                        ? "#181818"
                        : voice.id === "U"
                        ? "#161818"
                        : voice.id === "Y"
                        ? "#141618"
                        : "#12141a",
                  }}
                >
                  <span
                    className="text-base font-black sm:text-lg"
                    style={{ color: voice.color, fontFamily: "Courier New, monospace" }}
                  >
                    {voice.id}
                  </span>

                  <div className="h-[3px] w-[70%] overflow-hidden rounded-sm bg-[#333]">
                    <div
                      className="h-full rounded-sm"
                      style={{
                        background: voice.color,
                        transformOrigin: "left",
                        transform: mounted ? `scaleX(${voice.weight})` : "scaleX(0)",
                        transition: `transform 0.6s cubic-bezier(0.4,0,0.2,1) ${index * 60}ms`,
                      }}
                    />
                  </div>

                  <span
                    className="text-[10px] text-neutral-500"
                    style={{ fontFamily: "Courier New, monospace" }}
                  >
                    {voice.weight.toFixed(1)}
                  </span>
                </button>
              </TooltipTrigger>

              <TooltipContent
                side="top"
                className="w-[160px] border-[#686868] bg-[#222] px-3 py-2 text-[11px] text-neutral-200 sm:w-[170px]"
                style={{ fontFamily: "Courier New, monospace" }}
              >
                <div className="mb-1 text-base font-bold text-neutral-100">
                  {voice.ipa}
                </div>
                <div className="mb-1 text-neutral-400">
                  Aperture: <span className="text-neutral-200">{voice.weight.toFixed(1)}</span>
                </div>
                <div className="border-t border-[#333] pt-1 text-neutral-500">
                  e.g. {voice.examples.join(", ")}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
          </div>
        </TooltipProvider>
    </div>
  );
}

function HeroChart({ mounted }: { mounted: boolean }) {
  const width = 520;
  const height = 250;
  const padding = 24;

  const points = useMemo(() => {
    return CHART_POINTS.map((point, index) => {
      const x =
        padding + (index / (CHART_POINTS.length - 1)) * (width - padding * 2);
      const y =
        padding + (1 - point.mean) * (height - padding * 2);
      return { ...point, x, y };
    });
  }, []);

  const lineD = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <div className="rounded-md border border-[#686868] bg-[#232323] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-400" style={{ fontFamily: 'Courier New, monospace' }}>
          Turkish STEP20 baseline
        </div>
        <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500" style={{ fontFamily: 'Courier New, monospace' }}>
          bucket means
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-[220px] w-full sm:h-[240px] md:h-[250px]">
        {[0, 0.25, 0.5, 0.75, 1].map((tick, index) => {
          const y = padding + (1 - tick) * (height - padding * 2);
          return (
            <g key={index}>
              <line
                x1={padding}
                x2={width - padding}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.10)"
                strokeDasharray="3 6"
              />
              <text
                x={8}
                y={y + 4}
                fill="rgba(255,255,255,0.45)"
                fontSize="11"
                style={{ fontFamily: 'Courier New, monospace' }}
              >
                {tick.toFixed(2)}
              </text>
            </g>
          );
        })}

        {points.map((point) => (
          <g key={point.bucket}>
            <line
              x1={point.x}
              x2={point.x}
              y1={padding}
              y2={height - padding}
              stroke="rgba(255,255,255,0.05)"
            />
            <text
              x={point.x}
              y={height - 6}
              textAnchor="middle"
              fill="rgba(255,255,255,0.55)"
              fontSize="11"
              style={{ fontFamily: 'Courier New, monospace' }}
            >
              {point.bucket}
            </text>
          </g>
        ))}

        <path
          d={lineD}
          fill="none"
          stroke={COLORS.red}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: "1000",
            strokeDashoffset: mounted ? "0" : "1000",
            transition: "stroke-dashoffset 1400ms ease",
          }}
        />

        {points.map((point, index) => (
          <g key={point.bucket}>
            <circle
              cx={point.x}
              cy={point.y}
              r={6}
              fill={COLORS.bg}
              stroke={COLORS.red}
              strokeWidth="2"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "scale(1)" : "scale(0.5)",
                transformOrigin: `${point.x}px ${point.y}px`,
                transition: `all 320ms ease ${300 + index * 80}ms`,
              }}
            />
            <text
              x={point.x}
              y={point.y - 12}
              textAnchor="middle"
              fill="rgba(255,255,255,0.7)"
              fontSize="11"
              style={{ fontFamily: 'Courier New, monospace' }}
            >
              {point.mean.toFixed(3)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function HeroStatsCard() {
  return (
    <div className="rounded-md border border-[#686868] bg-[#232323] p-4">
      <div className="mb-3 text-[11px] uppercase tracking-[0.14em] text-neutral-400" style={{ fontFamily: 'Courier New, monospace' }}>
        slope summary
      </div>
      <div className="space-y-3 text-sm text-neutral-200">
        <div className="flex items-center justify-between gap-4">
          <span className="uppercase tracking-[0.10em] text-neutral-400" style={{ fontFamily: 'Courier New, monospace' }}>Pearson r</span>
          <span style={{ fontFamily: 'Courier New, monospace' }}>−0.989</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="uppercase tracking-[0.10em] text-neutral-400" style={{ fontFamily: 'Courier New, monospace' }}>Spearman ρ</span>
          <span style={{ fontFamily: 'Courier New, monospace' }}>−1.000</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="uppercase tracking-[0.10em] text-neutral-400" style={{ fontFamily: 'Courier New, monospace' }}>p_perm</span>
          <span style={{ fontFamily: 'Courier New, monospace', color: COLORS.green }}>{"< 0.001"}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="uppercase tracking-[0.10em] text-neutral-400" style={{ fontFamily: 'Courier New, monospace' }}>iters</span>
          <span style={{ fontFamily: 'Courier New, monospace' }}>12,000</span>
        </div>
      </div>
    </div>
  );
}

function HeroExplainCard() {
  return (
    <div className="rounded-md border border-[#686868] bg-[#232323] p-4">
      <div className="mb-3 text-[11px] uppercase tracking-[0.14em] text-neutral-400" style={{ fontFamily: 'Courier New, monospace' }}>
        what this chart shows
      </div>
      <div className="space-y-3 text-sm leading-6 text-neutral-300">
        <p>
          Bucket means from the Turkish STEP20 baseline. As buckets move from V1→V7,
          mean aperture decreases — strong negative ordering signal
          (Spearman ρ=−1.000; Pearson r=−0.989; p_perm {"<"} 0.001; iters=12,000).
        </p>
        <p>
          When testing LLM outputs, we report <span className="font-mono text-neutral-100">compliance</span>{" "}
          and <span className="font-mono text-neutral-100">signal</span> (r/ρ on compliant runs).
          High variance across repeated runs indicates instability.
        </p>
      </div>
    </div>
  );
}

function HeroSection({ mounted }: { mounted: boolean }) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
      <div className="space-y-5">
        <div className="inline-flex flex-wrap items-center gap-2 rounded-md border border-[#686868] bg-[#232323] px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-neutral-300" style={{ fontFamily: 'Courier New, monospace' }}>
          <span>deterministic</span>
          <span className="text-neutral-500">•</span>
          <span>baseline-locked</span>
          <span className="text-neutral-500">•</span>
          <span>scientific instrument</span>
        </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              ZË-RO
            </h1>
            <p className="mt-2 max-w-xl text-base leading-7 text-neutral-300">
              Deterministic vowel-aperture grounding probe for baseline-locked evaluation,
              drift checks, and reproducible scoring.
            </p>
          </div>

        <div className="max-w-xl rounded-md border border-[#686868] bg-[#232323] p-4 text-sm leading-6 text-neutral-300">
          Use ZË-RO to test whether model outputs preserve a stable vowel-aperture ↔ semantic ordering.
          Bring your own model output, score it deterministically, and export the result.
        </div>

        <TooltipProvider delayDuration={80}>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <LandingButton href="/evals" label="Try Evals" />
            <LandingButton
              label="Open Instrument"
              disabled
              tooltip="coming later"
            />
            <LandingButton
              label="Voice Lab"
              disabled
              tooltip="coming later"
            />
          </div>
        </TooltipProvider>
      </div>

      <div className="grid gap-4">
        <HeroChart mounted={mounted} />
        <div className="grid gap-4 md:grid-cols-2">
          <HeroStatsCard />
          <HeroExplainCard />
        </div>
      </div>
    </section>
  );
}

function BaselineGrid() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {BASELINES.map((card) => (
        <div
          key={card.id}
          className="rounded-md border bg-[#232323] p-4"
          style={{
            borderColor: card.tone === "red" ? "rgba(217,51,51,0.75)" : "#686868",
          }}
        >
          <div className="mb-2 flex items-center gap-2 text-white">
            <span>{card.emoji}</span>
            <span className="text-sm font-semibold">{card.title}</span>
          </div>
          <div className="mb-4 text-sm text-neutral-400">{card.subtitle}</div>
          <div className="space-y-2">
            {card.rows.map((row) => (
              <div key={row.key} className="flex items-start justify-between gap-4 text-sm">
                <span
                  className="uppercase tracking-[0.12em] text-neutral-400"
                  style={{ fontFamily: 'Courier New, monospace' }}
                >
                  {row.key}
                </span>
                <span className="text-neutral-100" style={{ fontFamily: 'Courier New, monospace' }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-neutral-500">{card.note}</div>
        </div>
      ))}
    </section>
  );
}

function bestSignalColor(bestMagnitude: number) {
  if (bestMagnitude >= 0.8) return "#16a34a";
  if (bestMagnitude >= 0.6) return "#7a8a40";
  if (bestMagnitude >= 0.4) return "#aa8030";
  return "#d93333";
}

function LlmProviderRows(props: {
  providers: LlmPaper["providers"];
  animate: boolean;
}) {
  const regimeClass = (tone?: LlmProviderRow["regimeTone"]) => {
    if (tone === "good") return "border-[#16a34a44] bg-[#0d2010] text-[#16a34a]";
    if (tone === "mid") return "border-[#a08f2044] bg-[#1b1a0d] text-[#d3c35d]";
    if (tone === "weak") return "border-[#d9333344] bg-[#1a0a0a] text-[#e57a7a]";
    if (tone === "inverted") return "border-[#d93333aa] bg-[#2a0808] text-[#ff8e8e]";
    return "";
  };

  return (
    <div className="space-y-3">
      {props.providers.map((row, index) => (
        <div
          key={`${row.provider}-${row.model}`}
          className="grid items-center gap-4 rounded-md border border-[#686868] bg-[#232323] px-3 py-3 sm:px-4 md:grid-cols-[180px_1fr_110px] lg:grid-cols-[200px_1fr_120px]"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm font-semibold text-neutral-100">{row.provider}</div>
              {row.regimeLabel ? (
                <span
                  className={`inline-flex rounded-sm border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.06em] ${regimeClass(row.regimeTone)}`}
                  style={{ fontFamily: "Courier New, monospace" }}
                >
                  {row.regimeLabel}
                </span>
              ) : null}
            </div>
            <div className="mt-1 text-[10px] text-neutral-500">{row.model}</div>
          </div>

          <div className="space-y-2">
            <div className="h-2 overflow-hidden rounded-sm bg-[#141414]">
              <div
                className="h-full rounded-sm"
                style={{
                  width: props.animate ? `${row.bestMagnitude * 100}%` : "0%",
                  background: bestSignalColor(row.bestMagnitude),
                  transformOrigin: "left",
                  transition: `width 0.8s cubic-bezier(0.4,0,0.2,1) ${index * 120}ms`,
                }}
              />
            </div>
          </div>

          <div className="text-left md:text-right">
            <div
              className="text-lg font-bold text-neutral-100"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              {row.bestDisplay}
            </div>
            <div
              className="text-[10px] text-neutral-500"
              style={{ fontFamily: "Courier New, monospace" }}
            >
              mean {row.meanDisplay}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LlmResultsSection() {
  const { setNode, visible } = useRevealOnScreen();

  return (
    <section
      ref={setNode}
      className="rounded-md border border-[#686868] bg-[#232323] p-5"
    >
      <Accordion type="single" collapsible defaultValue="llm-results">
        <AccordionItem value="llm-results" className="border-b-0">
          <AccordionTrigger className="py-0 hover:no-underline">
            <div className="text-left">
              <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-400" style={{ fontFamily: 'Courier New, monospace' }}>
                llm results
              </div>
              <div className="mt-1 text-lg font-semibold text-white">
                Paper v0.1 snapshot · not live data
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-5">
            <Tabs defaultValue="paper1">
              <TabsList className="h-auto w-full overflow-x-auto rounded-md border border-[#686868] bg-[#181818] p-1">
                {LLM_PAPERS.map((paper) => (
                  <TabsTrigger
                    key={paper.id}
                    value={paper.id}
                    className="shrink-0 rounded-sm px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-neutral-300 data-[state=active]:bg-[#232323] data-[state=active]:text-white"
                    style={{ fontFamily: 'Courier New, monospace' }}
                  >
                    {paper.tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              {LLM_PAPERS.map((paper) => (
                <TabsContent key={paper.id} value={paper.id} className="mt-4">
                  <div className="rounded-md border border-[#686868] bg-[#181818] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">{paper.title}</div>
                        <div className="mt-1 text-sm text-neutral-400">{paper.subtitle}</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {paper.badges.map((badge) => (
                          <span
                            key={badge}
                            className="rounded-sm border border-[#686868] px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-neutral-300"
                            style={{ fontFamily: 'Courier New, monospace' }}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>

                      <div className="mt-5">
                        <LlmProviderRows providers={paper.providers} animate={visible} />
                      </div>

                      <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
                        <p className="text-sm leading-6 text-neutral-300">{paper.summary}</p>
                        {paper.note ? (
                          <div className="text-xs text-neutral-500">{paper.note}</div>
                        ) : null}
                      </div>
                      {paper.emphasisNote ? (
                        <div className="mt-3 text-xs italic text-neutral-500">
                          {paper.emphasisNote}
                        </div>
                      ) : null}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="rounded-md border border-[#686868] bg-[#232323] p-5">
      <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-400" style={{ fontFamily: 'Courier New, monospace' }}>
        how it works
      </div>
      <div className="mt-1 text-lg font-semibold text-white">Three-step scoring loop</div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HOW_IT_WORKS.map((item) => (
          <div key={item.step} className="rounded-md border border-[#686868] bg-[#181818] p-4">
            <div className="text-[11px] uppercase tracking-[0.14em] text-[#d93333]" style={{ fontFamily: 'Courier New, monospace' }}>
              {item.step}
            </div>
            <div className="mt-2 text-sm font-semibold text-white">{item.title}</div>
            <div className="mt-2 text-sm leading-6 text-neutral-300">{item.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ScientificFoundationSection() {
  return (
    <section className="rounded-md border border-[#686868] bg-[#232323] p-5">
      <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-400" style={{ fontFamily: 'Courier New, monospace' }}>
        scientific foundation
      </div>
      <div className="mt-1 text-lg font-semibold text-white">Published references and method posture</div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-[#686868] bg-[#181818] p-4">
          <div className="text-sm font-semibold text-white">Published research</div>
          <div className="mt-4 space-y-3 text-sm text-neutral-300">
            <Link
              href="https://ling.auf.net/lingbuzz/009799"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-neutral-100 underline-offset-4 hover:underline"
            >
              <ExternalLink className="h-4 w-4 text-[#d93333]" />
              LingBuzz 009799
            </Link>
            <Link
              href="https://ling.auf.net/lingbuzz/009808"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-neutral-100 underline-offset-4 hover:underline"
            >
              <ExternalLink className="h-4 w-4 text-[#d93333]" />
              LingBuzz 009808
            </Link>
          </div>
        </div>

        <div className="rounded-md border border-[#686868] bg-[#181818] p-4">
          <div className="text-sm font-semibold text-white">Methodology checklist</div>
          <div className="mt-4 space-y-2 text-sm text-neutral-300">
            {FOUNDATION_POINTS.map((point) => (
              <div key={point} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#16a34a]" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="rounded-md border border-[#686868] bg-[#232323] p-5">
      <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-400" style={{ fontFamily: 'Courier New, monospace' }}>
        faq
      </div>
      <div className="mt-1 text-lg font-semibold text-white">Common questions</div>

      <Accordion type="single" collapsible className="mt-5">
        {FAQ_ITEMS.map((item) => (
          <AccordionItem key={item.q} value={item.q} className="border-[#686868]">
            <AccordionTrigger className="py-4 text-left text-sm text-white hover:no-underline">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-6 text-neutral-300">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function Footer() {
  return (
    <footer className="rounded-md border border-[#686868] bg-[#232323] px-5 py-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-neutral-300">
          ZË-RO — deterministic vowel-aperture grounding probe.
        </div>
        <div
          className="flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.14em] text-neutral-500"
          style={{ fontFamily: 'Courier New, monospace' }}
        >
          <span>paper v0.1 snapshot</span>
          <span>not live data</span>
          <span>baseline-locked</span>
        </div>
      </div>
    </footer>
  );
}

export function LandingPageV0_2() {
  const mounted = useMountedAnimation();

  return (
    <TooltipProvider delayDuration={80}>
      <main
        className="min-h-screen w-full text-white"
        style={{
          background: COLORS.bg,
          fontFamily: 'Courier New, monospace',
        }}
      >
        <style jsx global>{`
          @keyframes ticker-slide {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-neutral-500" style={{ fontFamily: 'Courier New, monospace' }}>
            <span>home</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-neutral-300">landing</span>
          </nav>

          <StatsTicker />
          <ApertureBar mounted={mounted} />
          <HeroSection mounted={mounted} />
          <BaselineGrid />
          <LlmResultsSection />
          <HowItWorksSection />
          <ScientificFoundationSection />
          <FAQSection />
          <Footer />
        </div>
      </main>
    </TooltipProvider>
  );
}
