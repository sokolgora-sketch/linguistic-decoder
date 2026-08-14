'use client';

import React from "react";
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
import { buildEvidenceSummaryTextFromVM } from "@/ui/telemetry/buildEvidenceSummaryTextFromVM";
import type { MissingState, PresentOrMissing, ResonanceProfileV1VM, RootMapVM, SoundRootsVM, TelemetryViewModel, Vowel } from "@/ui/telemetry/types";
import { ReadoutCard } from './sections/ReadoutCard';
import { AnalysisStatusCardV0_1 } from "./sections/AnalysisStatusCard.v0.1";
import { MaskCarrierCard } from "@/ui/instrument/sections/MaskCarrierCard.v0.1";
import { CountsRatiosCard } from './sections/CountsRatiosCard';
import { RawJsonCard } from './sections/RawJsonCard';
import { EvidencePackageCard } from './sections/EvidencePackageCard';
import { HonestContractCard } from "./sections/HonestContractCard";
import { OracleProposeWithEngineOracleCardV01 } from "./sections/OracleProposeWithEngineOracleCard.v0.1";
import { EvidenceTraceCard } from "./sections/EvidenceTraceCard";
import { ToolBoundaryCard } from "./sections/ToolBoundaryCard";
import { WorldLanguageTreeCard } from './sections/WorldLanguageTreeCard';
import { OriginClaimGatesCard } from "./sections/OriginClaimGatesCard";
import { buildRootLightMapV01 } from '@/shared/rootLightMap.v0.1';
import MeaningPanel from './MeaningPanel';
import { buildEvidenceLedgerModelFromVM } from '../ledger/ledgerModel';
import { EvidenceLedgerCard } from '../ledger/EvidenceLedgerCard';
import { buildCandidateRowsFromVM } from '../candidates/candidateModel';
import { CandidatesAccordion } from '../candidates/CandidatesAccordion';
import { DeepRootHeartGateSummaryCard } from "./DeepRootHeartGateSummaryCard";
import { EmbryoExpansionContextCardV0_1 } from "./sections/EmbryoExpansionContextCard.v0_1";
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
      vm: TelemetryViewModel;
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
}> = [
  { id: "overview", label: "Overview" },
  { id: "evidence", label: "Evidence" },
  { id: "candidates", label: "Candidates" },
  { id: "roots", label: "Roots / Meaning" },
  { id: "advanced", label: "Advanced" },
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

function isTelemetryVm(vm: unknown): vm is TelemetryViewModel {
  return !!vm && typeof vm === "object" && "readout" in vm && !!(vm as { readout?: unknown }).readout;
}

function missingRootMap(): PresentOrMissing<RootMapVM> {
  return { kind: "missing", missing: "not_emitted", note: "rootMap" };
}

function missingSoundRoots(): PresentOrMissing<SoundRootsVM> {
  return { kind: "missing", missing: "not_emitted", note: "soundRoots" };
}

function normalizePanelMissingState(
  missing: MissingState
): "not_emitted" | "malformed" | "unknown" {
  return missing === "none" ? "not_emitted" : missing;
}

function resonancePanelProfile(
  value: PresentOrMissing<ResonanceProfileV1VM> | undefined
):
  | { kind: "present"; value: ResonanceProfileV1VM }
  | { kind: "missing"; missing: "not_emitted" | "malformed" | "unknown"; note?: string } {
  if (!value) {
    return { kind: "missing", missing: "not_emitted", note: "resonanceProfileV1" };
  }
  if (value.kind === "present") return value;
  return {
    kind: "missing",
    missing: normalizePanelMissingState(value.missing),
    note: value.note,
  };
}

function soundRootsPanelValue(
  value: PresentOrMissing<SoundRootsVM> | undefined
):
  | { kind: "present"; value: SoundRootsVM }
  | { kind: "missing"; missing: "not_emitted" | "malformed" | "unknown"; note?: string } {
  if (!value) {
    return { kind: "missing", missing: "not_emitted", note: "soundRoots" };
  }
  if (value.kind === "present") return value;
  return {
    kind: "missing",
    missing: normalizePanelMissingState(value.missing),
    note: value.note,
  };
}

function rootMapPanelValue(
  value: PresentOrMissing<RootMapVM> | undefined
):
  | { kind: "present"; value: RootMapVM }
  | { kind: "missing"; missing: "not_emitted" | "malformed" | "unknown"; note?: string } {
  if (!value) {
    return { kind: "missing", missing: "not_emitted", note: "rootMap" };
  }
  if (value.kind === "present") return value;
  return {
    kind: "missing",
    missing: normalizePanelMissingState(value.missing),
    note: value.note,
  };
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

  const isValidVm = isTelemetryVm(vm);

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

  const evidenceSummaryText = React.useMemo(() => {
    if (!isValidVm) return "";
    return buildEvidenceSummaryTextFromVM(vm, { ledgerModel, candidateRows });
  }, [candidateRows, isValidVm, ledgerModel, vm]);

  const resonanceProfileForPanel = React.useMemo(
    () => resonancePanelProfile(isValidVm ? vm.resonanceProfileV1 : undefined),
    [isValidVm, vm]
  );

  const soundRootsForPanel = React.useMemo(
    () => soundRootsPanelValue(isValidVm ? vm.soundRoots : undefined),
    [isValidVm, vm]
  );

  const rootMapForPanel = React.useMemo(
    () => rootMapPanelValue(isValidVm ? vm.rootMap : undefined),
    [isValidVm, vm]
  );

  const engineVersion =
    isValidVm && vm.readout.engineVersion.kind === "present"
      ? vm.readout.engineVersion.value
      : undefined;

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

  const modeText = pomValue(vm.readout?.mode);
  const readout = isValidVm ? vm.readout : null;
  const pathText = voicePathValue(readout?.voicePath);
  const surfaceVoicePath: PresentOrMissing<Vowel[]> =
    readout?.voicePathSurface ?? { kind: "missing", missing: "not_emitted", note: "voicePathSurface" };
  const functionalVoicePath: PresentOrMissing<Vowel[]> =
    readout?.voicePathFunctional ?? { kind: "missing", missing: "not_emitted", note: "voicePathFunctional" };

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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className={`${MT.fieldLabel} text-[11px] text-[#8ea4ba]`}>
                Word
              </div>

              <div
                data-testid="instrument-word"
                className="mt-2 break-words text-[30px] font-semibold leading-tight text-[#f5f7fb] sm:text-[36px]"
              >
                {String(vm.readout.word ?? "not emitted")}
              </div>

              {normalizedWord &&
              normalizedWord !==
                String(vm.readout.word ?? "")
                  .trim()
                  .toLowerCase() ? (
                <div className="mt-2 font-mono text-[12px] text-[#8ea4ba]">
                  {`normalized: ${normalizedWord}`}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              aria-pressed={isDarkMode}
              className={`${MT.actionSm} inline-flex min-h-9 shrink-0 items-center gap-2 rounded-[8px] border border-[#303a45] bg-[#151515] px-3 text-[#c6d0dc] transition hover:border-[#4d5f72] hover:text-white`}
              onClick={() => setIsDarkMode((next) => !next)}
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
              {isDarkMode ? "Light mode" : "Dark mode"}
            </button>
          </div>
        </div>

        <SectionTabs
          active={activeSection}
          onChange={setActiveSection}
        />

        <div className="space-y-4">
          <TabPanel id="overview" active={activeSection}>
            <div className="space-y-4">
              <EmbryoExpansionContextCardV0_1
                vm={vm}
              />

              <details
                data-testid="deterministic-details"
                className="rounded-xl border border-[#303a45] bg-[#10151c]"
              >
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-[#c6d0dc] [&::-webkit-details-marker]:hidden">
                  Deterministic details
                </summary>

                <div className="border-t border-[#303a45] p-4">
                  <ReadoutCard
                    readout={vm.readout}
                    onCopySummary={() =>
                      void copyText(
                        "Summary copied.",
                        evidenceSummaryText,
                      )
                    }
                    onCopyFullJson={
                      handleCopyFullJson
                    }
                  />
                </div>
              </details>
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
                  engineVersion={engineVersion ?? null}
                  onCopyEvidenceSummary={() => {
                    void copyText("Evidence summary copied.", evidenceSummaryText);
                  }}
                  onCopyEvidencePackage={() => {
                    const pkg = buildEvidencePackageFromVM(vm, { ledgerModel });
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
              <EmbryoExpansionContextCardV0_1
                vm={vm}
              />

              {candidateRows ? (
                <details className="rounded-xl border border-[#303a45] bg-[#10151c]">
                  <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-[#c6d0dc] [&::-webkit-details-marker]:hidden">
                    Other candidate records
                  </summary>

                  <div className="border-t border-[#303a45] p-4">
                    <CandidatesAccordion
                      rows={candidateRows}
                    />
                  </div>
                </details>
              ) : null}
            </div>
          </TabPanel>

          <TabPanel id="roots" active={activeSection}>
            <div className="grid gap-4 xl:grid-cols-12">
              <div className="space-y-4 xl:col-span-5">
                <VowelPathTimeline
                  detected={vm.readout.voicePath}
                  surface={surfaceVoicePath}
                  functional={functionalVoicePath}
                  delta={vm.readout.voicePathDelta}
                />
                {(() => {
                  const spectrum = vm.readout.sevenPrinciplesSpectrum ?? null;
                  return spectrum ? <SevenPrinciplesSpectrumCard spectrum={spectrum} /> : null;
                })()}
                <ResonancePanelV01 resonanceProfileV1={resonanceProfileForPanel} />
              </div>
              <div className="space-y-4 xl:col-span-7">
                <div data-testid="roots-meaning-reading">
                  <ShellSection
                    title="Meaning"
                    subtitle="Plain deterministic interpretation for the current word."
                  >
                    <MeaningPanel vm={vm} />
                  </ShellSection>
                </div>

                <WorldLanguageTreeCard lightMap={lightMap} />
                <SoundRootsCard
                  soundRoots={soundRootsForPanel}
                  word={String(vm.readout.word ?? "")}
                  normalizedWord={normalizedWord}
                />
                <RootMapCard
                  rootMap={rootMapForPanel}
                  word={String(vm.readout.word ?? "")}
                  normalizedWord={normalizedWord}
                />
              </div>
            </div>
          </TabPanel>

          <TabPanel id="advanced" active={activeSection}>
            <div className="grid gap-4 xl:grid-cols-12">
              <div className="space-y-4 xl:col-span-5">
                <div data-testid="advanced-boundary">
                  <HonestContractCard />
                </div>

                <AnalysisStatusCardV0_1
                  status={
                    vm.analysisStatusV0_1 ?? {
                      kind: "missing",
                      missing: "not_emitted",
                      note: "analysisStatusV0_1",
                    }
                  }
                />

                <MaskCarrierCard
                  word={String(
                    props.wordForMask ??
                      vm.readout?.word ??
                      "",
                  ).trim()}
                  ipa={props.carrierIpa}
                />

                <OracleProposeWithEngineOracleCardV01
                  word={String(
                    vm.readout.word ?? "",
                  ).trim()}
                  mode={
                    vm.readout.mode &&
                    vm.readout.mode.kind ===
                      "present" &&
                    vm.readout.mode.value ===
                      "open"
                      ? "open"
                      : "strict"
                  }
                  onCopy={copyText}
                />

                <ToolBoundaryCard />
              </div>

              <div className="space-y-4 xl:col-span-7">
                {candidateRows ? (
                  <DeepRootHeartGateSummaryCard
                    rows={candidateRows as any}
                  />
                ) : null}

                <OriginClaimGatesCard
                  gates={vm.originClaimGates}
                />

                <OriginClaimCard
                  originClaim={
                    vm.originClaim?.kind ===
                    "present"
                      ? vm.originClaim.value
                      : null
                  }
                />

                <RawJsonCard
                  pretty={rawPretty}
                  onCopyFullJson={
                    handleCopyFullJson
                  }
                  engineVersion={
                    engineVersion ?? null
                  }
                />
              </div>
            </div>
          </TabPanel>
        </div>
      </div>
    );
  }
