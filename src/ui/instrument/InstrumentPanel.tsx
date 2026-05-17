'use client';

import React from "react";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { ResonancePanelV01 } from "./ResonancePanel.v0.1";
import { VowelPathTimeline } from "./VowelPathTimeline";
import { SevenPrinciplesSpectrumCard } from "./sections/SevenPrinciplesSpectrumCard";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import { RootMapCard } from "@/ui/instrument/RootMapCard";
import { SoundRootsCard } from "@/ui/instrument/SoundRootsCard";
import { useToast } from '@/hooks/use-toast';
import { toPrettyJson } from "@/ui/instrument/prettyJson";
import { buildEvidencePackageFromVM } from "@/ui/telemetry/buildEvidencePackageFromVM";
import { ReadoutCard } from './sections/ReadoutCard';
import { MaskCarrierCard } from "@/ui/instrument/sections/MaskCarrierCard.v0.1";
import { CountsRatiosCard } from './sections/CountsRatiosCard';
import { RawJsonCard } from './sections/RawJsonCard';
import { EvidencePackageCard } from './sections/EvidencePackageCard';
import { OracleProposeWithEngineOracleCardV01 } from "./sections/OracleProposeWithEngineOracleCard.v0.1";
import { EvidenceTraceCard } from "./sections/EvidenceTraceCard";
import { ToolBoundaryCard } from "./sections/ToolBoundaryCard";
import { WorldLanguageTreeCard } from './sections/WorldLanguageTreeCard';
import { buildRootLightMapV01 } from '@/shared/rootLightMap.v0.1';
import MeaningPanel from './MeaningPanel';
import { buildEvidenceLedgerModelFromVM } from '../ledger/ledgerModel';
import { EvidenceLedgerCard } from '../ledger/EvidenceLedgerCard';
import { buildCandidateRowsFromVM } from '../candidates/candidateModel';
import { CandidatesAccordion } from '../candidates/CandidatesAccordion';
import { DeepRootHeartGateSummaryCard } from "./DeepRootHeartGateSummaryCard";
import { OriginClaimCard } from '@/components/OriginClaimCard';
import { cn } from "@/lib/utils";
import { safeText } from "./safeText";
import { MT } from "@/ui/typography/marketingType.v0.1";

type Props =
  | {
      /** Raw /api/analyze-v1 payload (unknown shape). We adapt it, never trust it. */
      payload: unknown;
      vm?: never;
        wordForMask?: string;
        carrierIpa?: string;
      debug?: boolean;
      onCopyFullJson?: () => void;
    }
  | {
      /** Telemetry VM (already adapted). VM-only boundary for callers like ZroChatPage. */
      vm: any;
      payload?: never;
        wordForMask?: string;
        carrierIpa?: string;
      debug?: boolean;
      onCopyFullJson?: () => void;
    };

function fmt<T>(x: { kind: 'present'; value: T } | { kind: 'missing'; missing: string; note?: string }) {
  return x.kind === 'present' ? String(x.value) : 'not_emitted';
}

type InstrumentSectionKey = "overview" | "evidence" | "candidates" | "roots" | "advanced";

const INSTRUMENT_SECTIONS: Array<{
  id: InstrumentSectionKey;
  label: string;
  description: string;
  accent: "blue" | "green" | "amber" | "neutral";
}> = [
  {
    id: "overview",
    label: "Overview",
    description: "Readout, evidence trace, and hypothesis summary in one inspection surface.",
    accent: "blue",
  },
  {
    id: "evidence",
    label: "Evidence",
    description: "Source states, evidence ledger, and evidence package for the current run.",
    accent: "green",
  },
  {
    id: "candidates",
    label: "Candidates",
    description: "Candidate rows remain inspection records, not a forced answer.",
    accent: "amber",
  },
  {
    id: "roots",
    label: "Roots / Meaning",
    description: "Vowel path, principle, resonance, SoundRoots, and RootMap surfaces.",
    accent: "neutral",
  },
  {
    id: "advanced",
    label: "Advanced",
    description: "Mask, carrier, oracle, gate, and raw-payload diagnostics for the current run.",
    accent: "neutral",
  },
];

function pomValue(x: any, fallback = "not emitted"): string {
  if (!x || typeof x !== "object") return fallback;
  if (x.kind === "present") return String(x.value);
  return fallback;
}

function voicePathValue(x: any): string {
  if (x?.kind === "present" && Array.isArray(x.value) && x.value.length) {
    return x.value.join("-");
  }
  return "not emitted";
}

function ShellBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "blue" | "amber";
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 max-w-full items-center rounded-full border px-2.5 py-1 text-left font-mono text-[11px] leading-5 break-all",
        tone === "green" && "border-[#2f5a3d] bg-[#101712] text-[#b7d8c1] dark:border-[#2f5a3d] dark:bg-[#101712] dark:text-[#b7d8c1]",
        tone === "blue" && "border-[#355a7a] bg-[#111a24] text-[#cfe6ff] dark:border-[#355a7a] dark:bg-[#111a24] dark:text-[#cfe6ff]",
        tone === "amber" && "border-[#5e4b22] bg-[#19140d] text-[#f0ddb0] dark:border-[#5e4b22] dark:bg-[#19140d] dark:text-[#f0ddb0]",
        tone === "neutral" && "border-[#303030] bg-[#101010] text-[#d7dde7] dark:border-[#303030] dark:bg-[#101010] dark:text-[#d7dde7]"
      )}
    >
      {children}
    </span>
  );
}

function ShellMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-h-[78px] min-w-0 overflow-hidden rounded-[8px] border border-[#303a45] bg-[#101010] p-3 dark:border-[#303a45] dark:bg-[#101010]">
      <div className={`${MT.fieldLabel} mb-1 text-[11px] text-[#8ea4ba] dark:text-[#8ea4ba]`}>{label}</div>
      <div className="break-all font-mono text-[13px] text-[#f5f7fb] dark:text-[#f5f7fb]">{value}</div>
    </div>
  );
}

function ShellSection({
  title,
  children,
  subtitle,
}: {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <section className="rounded-[12px] border border-[#303030] bg-[#151515] shadow-[0_16px_40px_rgba(0,0,0,0.18)] dark:border-[#303030] dark:bg-[#151515]">
      <div className="border-b border-[#262626] px-4 py-3 dark:border-[#262626]">
        <h2 className={`${MT.sectionLabel} text-[#f5f7fb] dark:text-[#f5f7fb]`}>{title}</h2>
        {subtitle ? <div className="mt-1 text-[12px] leading-5 text-[#9fb1bf] dark:text-[#9fb1bf]">{subtitle}</div> : null}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function SectionTabs({
  active,
  onChange,
}: {
  active: InstrumentSectionKey;
  onChange: (next: InstrumentSectionKey) => void;
}) {
  return (
    <div className="max-w-full overflow-hidden rounded-[12px] border border-[#2f3742] bg-[#10161e] p-1.5 dark:border-[#2f3742] dark:bg-[#10161e]">
      <div className="flex max-w-full gap-1.5 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]" role="tablist" aria-label="Instrument sections">
        {INSTRUMENT_SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            role="tab"
            aria-selected={active === section.id}
            className={cn(
              `${MT.actionSm} min-h-10 shrink-0 whitespace-nowrap rounded-[8px] border px-3 transition-colors`,
              active === section.id
                ? "border-[#355a7a] bg-[#111a24] text-[#cfe6ff] shadow-[inset_0_0_0_1px_rgba(142,164,186,0.16)] dark:border-[#355a7a] dark:bg-[#111a24] dark:text-[#cfe6ff]"
                : "border-transparent bg-transparent text-[#aeb7c5] hover:border-[#303a45] hover:bg-[#151515] hover:text-white dark:text-[#aeb7c5] dark:hover:border-[#303a45] dark:hover:bg-[#151515] dark:hover:text-white"
            )}
            onClick={() => onChange(section.id)}
          >
            {section.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SectionIntro({ section }: { section: (typeof INSTRUMENT_SECTIONS)[number] }) {
  return (
    <div className="rounded-[12px] border border-[#2f3742] bg-[#10161e] p-4 dark:border-[#2f3742] dark:bg-[#10161e]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className={`${MT.microLabel} text-[#8ea4ba] dark:text-[#8ea4ba]`}>active surface</div>
          <div className="mt-1 text-[18px] font-semibold leading-tight text-[#f5f7fb] dark:text-[#f5f7fb]">
            {section.label}
          </div>
          <p className="mt-2 max-w-3xl text-[13px] leading-6 text-[#aeb7c5] dark:text-[#aeb7c5]">
            {section.description}
          </p>
        </div>
        <ShellBadge tone={section.accent}>section={section.id}</ShellBadge>
      </div>
    </div>
  );
}

function TabPanel({
  id,
  active,
  children,
}: {
  id: InstrumentSectionKey;
  active: InstrumentSectionKey;
  children: React.ReactNode;
}) {
  return (
    <div role="tabpanel" hidden={active !== id}>
      {children}
    </div>
  );
}

export function InstrumentPanel(props: Props) {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = React.useState<InstrumentSectionKey>("overview");
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  const inputVm = "vm" in props ? props.vm : undefined;
  const inputPayload = "payload" in props ? props.payload : undefined;

  const vm = React.useMemo(() => {
    if (inputVm) return inputVm;
    return adaptAnalysisToTelemetryVM(inputPayload);
  }, [inputVm, inputPayload]);

  const isValidVm =
    !!vm && typeof vm === "object" && (vm as any).readout && typeof (vm as any).readout === "object";

  const lightMap = React.useMemo(() => {
    try {
      // VM-only for v0.1 (taxonomy scaffold)
      return buildRootLightMapV01(vm);
    } catch {
      return null;
    }
  }, [vm]);

  const ledgerModel = React.useMemo(() => {
    if (!isValidVm) return null;
    return buildEvidenceLedgerModelFromVM(vm);
  }, [isValidVm, vm]);

  const candidateRows = React.useMemo(() => {
    if (!isValidVm) return null;
    return buildCandidateRowsFromVM(vm);
  }, [isValidVm, vm]);

  async function copyText(label: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copied', description: label });
    } catch {
      toast({ title: 'Copy failed', description: 'Clipboard not available.', variant: 'destructive' });
    }
  }

  const summaryLines = React.useMemo(() => {
    if (!isValidVm) return [];
    return [
      'ZË-RO Instrument Summary',
      `word=${String(vm.readout.word)}`,
      `mode=${fmt(vm.readout.mode)}`,
      `strictInput=${fmt(vm.readout.strictInput)}`,
      `engine=${fmt(vm.readout.engineVersion)}`,
      `voicePath=${vm.readout.voicePath.kind === 'present' ? vm.readout.voicePath.value.join('-') : 'not_emitted'}`,
      `candidates=${String(vm.readout.counts.candidates)}`,
      `ops=${fmt(vm.readout.counts.ops)}`,
      `notes=${fmt(vm.readout.counts.notes)}`,
      `signals=${fmt(vm.readout.counts.signals)}`,
    ];
  }, [isValidVm, vm]);

  const engineVersion = isValidVm && vm.readout.engineVersion.kind === 'present' ? vm.readout.engineVersion.value : null;

    const normalizedWord =
  isValidVm && vm.readout.normalizedWord && vm.readout.normalizedWord.kind === "present"
    ? vm.readout.normalizedWord.value
    : "";

  const rawPretty = React.useMemo(() => {
    // Only pretty-print the raw payload when it is actually provided.
    // If the caller passes VM-only, Raw JSON is explicitly "not available".
    if (!inputPayload) return null;
    try {
      return toPrettyJson(inputPayload);
    } catch {
      return null;
    }
  }, [inputPayload]);

  const handleCopyFullJson =
    props.onCopyFullJson
      ? () => void props.onCopyFullJson!()
      : inputPayload
        ? () => void copyText("Full JSON copied.", toPrettyJson(inputPayload))
        : undefined;

  if (!isValidVm) {
    return (
      <div className="rounded-lg border border-red-500/40 bg-red-950/20 p-4 text-sm">
        <div className="font-semibold text-red-200">
          InstrumentPanel blocked: invalid Telemetry VM
        </div>
        <div className="mt-2 text-red-100/90">
          Fail-visible guard. The panel refused to render because the Telemetry VM shape is invalid.
          Fix the VM adapter or payload wiring (do not silence this).
        </div>
      </div>
    );
  }

  const statusText = String(vm.readout?.status ?? "detected");
  const modeText = pomValue(vm.readout?.mode);
  const pathText = voicePathValue(vm.readout?.voicePath);
  const candidateCountText = String(vm.readout?.counts?.candidates ?? 0);
  const normalizedText = normalizedWord || pomValue(vm.readout?.normalizedWord);
  const activeSectionMeta =
    INSTRUMENT_SECTIONS.find((section) => section.id === activeSection) ?? INSTRUMENT_SECTIONS[0];

  return (
      <div
        className={cn(
          "space-y-4 rounded-[14px] border p-4 shadow-[0_16px_40px_rgba(0,0,0,0.24)] transition-colors sm:p-5",
          "max-w-full overflow-hidden",
          isDarkMode
            ? "dark border-[#2f3742] bg-[#13171d] text-[#f5f7fb]"
            : "border-[#d5d5d5] bg-[#f5f5f5] text-[#111111]"
        )}
        data-testid="open-instrument-shell"
      >
        {props.debug ? (
          <section
            aria-label="InstrumentPanel debug"
            className="mb-4 rounded-[10px] border border-emerald-400/40 bg-black/35 p-3 text-xs text-emerald-100 shadow-[0_10px_30px_rgba(0,0,0,0.22)]"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide">
                InstrumentPanel ACTIVE
              </span>
              <span className="font-mono text-emerald-300/80">debug telemetry</span>
            </div>
            <div className="grid gap-1 break-all font-mono text-emerald-200/90 sm:grid-cols-2 lg:grid-cols-3">
              <div>word: {safeText(vm.readout?.word)}</div>
              <div>engine: {safeText(engineVersion ?? "not_emitted")}</div>
              <div>mode: {safeText(modeText)}</div>
              <div>vowelPath: {safeText(pathText)}</div>
              <div>signals: {fmt(vm.readout.counts.signals)}</div>
            </div>
          </section>
        ) : null}

        <div className="rounded-[12px] border border-[#2c3540] bg-[#10161e] p-4 dark:border-[#2c3540] dark:bg-[#10161e] sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 xl:max-w-[72%]">
              <div className="flex flex-wrap items-center gap-3">
                <Image
                  src="/zero_logo_hero_white.svg"
                  alt="ZË-RO"
                  width={140}
                  height={35}
                  className="h-7 w-auto shrink-0 sm:h-8"
                  priority={false}
                />
                <div className="min-w-0">
                  <div className={`${MT.eyebrow} text-[10px] text-[#d7dde7] dark:text-[#d7dde7]`}>
                    instrument · open
                  </div>
                  <h1 className={`${MT.heroTitle} !text-[17px] leading-none text-[#f5f7fb] dark:text-[#f5f7fb]`}>
                    ZË-RO Open Instrument
                  </h1>
                  <div className="mt-1 text-[12px] leading-5 text-[#aeb7c5] dark:text-[#aeb7c5]">Deterministic readout for one word</div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <ShellMetric label="word" value={`word=${String(vm.readout.word ?? "not emitted")}`} />
                <ShellMetric label="normalized" value={`norm=${normalizedText}`} />
                <ShellMetric label="voice path" value={`path=${pathText}`} />
                <ShellMetric label="candidates" value={`rows=${candidateCountText}`} />
              </div>
            </div>

            <div className="flex w-full min-w-0 flex-wrap items-center gap-2 xl:w-auto xl:shrink-0 xl:justify-end">
              <ShellBadge tone="green">status={statusText}</ShellBadge>
              <ShellBadge tone="blue">mode={modeText}</ShellBadge>
              {engineVersion ? <ShellBadge tone="neutral">engine={engineVersion}</ShellBadge> : null}
              <button
                type="button"
                aria-pressed={isDarkMode}
                className={`${MT.actionSm} inline-flex min-h-9 max-w-full items-center gap-2 rounded-[8px] border border-[#5e4b22] bg-[#19140d] px-3 text-[#f0ddb0] transition hover:border-[#8a6a2a] hover:text-white dark:border-[#5e4b22] dark:bg-[#19140d] dark:text-[#f0ddb0] dark:hover:border-[#8a6a2a] dark:hover:text-white`}
                onClick={() => setIsDarkMode((next) => !next)}
              >
                {isDarkMode ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
                {isDarkMode ? "Light mode" : "Dark mode"}
              </button>
            </div>
          </div>
        </div>

        <SectionTabs active={activeSection} onChange={setActiveSection} />
        <SectionIntro section={activeSectionMeta} />

        <div className="space-y-4">
          <TabPanel id="overview" active={activeSection}>
            <div className="grid gap-4 xl:grid-cols-12">
              <div className="space-y-4 xl:col-span-7">
                <ReadoutCard
                  readout={vm.readout}
                  onCopySummary={() => void copyText("Summary copied.", summaryLines.join("\n"))}
                  onCopyFullJson={handleCopyFullJson}
                />
                <ShellSection title="Constructed reading (hypothesis)" subtitle="Inspection summary; not an origin claim.">
                  <MeaningPanel vm={vm} />
                </ShellSection>
              </div>
              <div className="space-y-4 xl:col-span-5">
                <EvidenceTraceCard
                  readout={vm.readout}
                  ledgerModel={ledgerModel}
                  candidateRows={candidateRows}
                  rootMap={vm.rootMap}
                />
                <ToolBoundaryCard />
              </div>
            </div>
          </TabPanel>

          <TabPanel id="evidence" active={activeSection}>
            <div className="grid gap-4 xl:grid-cols-12">
              <div className="space-y-4 xl:col-span-5">
                <EvidenceTraceCard
                  readout={vm.readout}
                  ledgerModel={ledgerModel}
                  candidateRows={candidateRows}
                  rootMap={vm.rootMap}
                />
                <EvidencePackageCard
                  onCopyEvidencePackage={() => {
                    const pkg = buildEvidencePackageFromVM(vm as any, { ledgerModel });
                    void copyText("Evidence package copied.", toPrettyJson(pkg));
                  }}
                />
              </div>
              <div className="space-y-4 xl:col-span-7">
                {ledgerModel ? <EvidenceLedgerCard model={ledgerModel} engineVersion={engineVersion} /> : null}
                <CountsRatiosCard readout={vm.readout} engineVersion={engineVersion} />
              </div>
            </div>
          </TabPanel>

          <TabPanel id="candidates" active={activeSection}>
            <div className="space-y-4">
              {candidateRows ? <DeepRootHeartGateSummaryCard rows={candidateRows as any} /> : null}
              {candidateRows ? <CandidatesAccordion rows={candidateRows} /> : null}
            </div>
          </TabPanel>

          <TabPanel id="roots" active={activeSection}>
            <div className="grid gap-4 xl:grid-cols-12">
              <div className="space-y-4 xl:col-span-5">
                <VowelPathTimeline
                  detected={vm.readout.voicePath}
                  surface={vm.readout.voicePathSurface}
                  functional={vm.readout.voicePathFunctional}
                  delta={vm.readout.voicePathDelta}
                />
                {(() => {
                  const spectrum =
                    (vm as any)?.sevenPrinciplesSpectrum ??
                    (vm as any)?.readout?.sevenPrinciplesSpectrum ??
                    null;
                  return spectrum ? <SevenPrinciplesSpectrumCard spectrum={spectrum} /> : null;
                })()}
                <ResonancePanelV01 resonanceProfileV1={vm.resonanceProfileV1} />
              </div>
              <div className="space-y-4 xl:col-span-7">
                <WorldLanguageTreeCard lightMap={lightMap} />
                <SoundRootsCard
                  soundRoots={vm.soundRoots ?? ({ kind: "missing", missing: "not_emitted", note: "soundRoots" } as any)}
                  word={String((vm.readout as any)?.word ?? (vm.readout as any)?.inputWord ?? "")}
                  normalizedWord={normalizedWord}
                />
                <RootMapCard
                  rootMap={vm.rootMap ?? ({ kind: "missing", missing: "not_emitted", note: "rootMap" } as any)}
                  word={String((vm.readout as any)?.word ?? (vm.readout as any)?.inputWord ?? "")}
                  normalizedWord={normalizedWord}
                />
              </div>
            </div>
          </TabPanel>

          <TabPanel id="advanced" active={activeSection}>
            <div className="grid gap-4 xl:grid-cols-12">
              <div className="space-y-4 xl:col-span-5">
                <MaskCarrierCard word={String(props.wordForMask ?? vm.readout?.word ?? "").trim()} ipa={props.carrierIpa} />
                <OracleProposeWithEngineOracleCardV01
                  word={String((vm as any)?.readout?.word ?? "").trim()}
                  mode={vm.readout.mode && vm.readout.mode.kind === "present" && vm.readout.mode.value === "open" ? "open" : "strict"}
                  onCopy={copyText}
                />
              </div>
              <div className="space-y-4 xl:col-span-7">
                {vm.originClaimGates ? (
                  <div className="rounded-xl border border-slate-700/80 bg-[#10151c] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
                    <div className="text-sm font-semibold text-slate-100">OriginClaim Gates</div>
                    <div className="mt-1 text-sm text-slate-300">
                      Status:{" "}
                      <span className="font-mono">{vm.originClaimGates.active ? "ON" : "OFF"}</span>{" "}
                      <span className="text-xs text-slate-500">(dev flag: ?{vm.originClaimGates.flag}=1)</span>
                    </div>
                    <div className="mt-1 text-sm text-slate-300">
                      Candidates: <span className="font-mono">{vm.originClaimGates.candidateCount}</span>
                    </div>

                    <div className="mt-2 text-xs text-slate-500">Reason code counts</div>
                    <pre className="mt-1 max-w-full overflow-auto whitespace-pre-wrap break-words rounded-lg border border-slate-800 bg-black/35 p-3 text-xs font-mono text-slate-200">
                      {JSON.stringify(vm.originClaimGates.reasonCounts, null, 2)}
                    </pre>
                  </div>
                ) : null}
                <OriginClaimCard
                  originClaim={vm.originClaim?.kind === "present" ? (vm.originClaim as any).value : null}
                />
                <RawJsonCard
                  pretty={rawPretty}
                  onCopyFullJson={handleCopyFullJson}
                  engineVersion={engineVersion}
                />
              </div>
            </div>
          </TabPanel>
        </div>
      </div>
    );
  }
