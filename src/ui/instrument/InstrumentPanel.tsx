'use client';

import React from "react";
import { ResonancePanelV01 } from "./ResonancePanel.v0.1";
import { VowelPathTimeline } from "./VowelPathTimeline";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import { RootMapCard } from "@/ui/instrument/RootMapCard";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { toPrettyJson } from "@/ui/instrument/prettyJson";
import { ReadoutCard } from './sections/ReadoutCard';
import MeaningPanel from './MeaningPanel';
import { buildEvidenceLedgerModelFromVM } from '../ledger/ledgerModel';
import { EvidenceLedgerCard } from '../ledger/EvidenceLedgerCard';
import { buildCandidateRowsFromVM } from '../candidates/candidateModel';
import { CandidatesAccordion } from '../candidates/CandidatesAccordion';
import { OriginClaimCard } from '@/components/OriginClaimCard';
import { safeText } from "./safeText";

type Props =
  | {
      /** Raw /api/analyze-v1 payload (unknown shape). We adapt it, never trust it. */
      payload: unknown;
      vm?: never;
      debug?: boolean;
      onCopyFullJson?: () => void;
    }
  | {
      /** Telemetry VM (already adapted). VM-only boundary for callers like ZroChatPage. */
      vm: any;
      payload?: never;
      debug?: boolean;
      onCopyFullJson?: () => void;
    };

function fmt<T>(x: { kind: 'present'; value: T } | { kind: 'missing'; missing: string; note?: string }) {
  return x.kind === 'present' ? String(x.value) : 'not_emitted';
}

export function InstrumentPanel(props: Props) {
  const { toast } = useToast();

  const inputVm = "vm" in props ? props.vm : undefined;
  const inputPayload = "payload" in props ? props.payload : undefined;

  const vm = React.useMemo(() => {
    if (inputVm) return inputVm;
    return adaptAnalysisToTelemetryVM(inputPayload);
  }, [inputVm, inputPayload]);

  const isValidVm =
    !!vm && typeof vm === 'object' && (vm as any).readout && typeof (vm as any).readout === 'object';

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

  return (
      <div className="space-y-3">
        {props.debug ? (
          <div className="mb-4 rounded border border-emerald-500 bg-black p-3 text-xs text-emerald-400">
            <div>InstrumentPanel ACTIVE</div>
            <div>word: {safeText(vm.wordShown)}</div>
            <div>engine: {safeText(vm.engineVersion)}</div>
            <div>mode: {safeText(vm.mode)}</div>
            <div>vowelPath: {safeText(vm.vowelPath?.join(" → "))}</div>
            <div>signals: {vm.signals?.length ?? 0}</div>
          </div>
        ) : null}

        <div className="grid gap-3 lg:grid-cols-12">
          {/* LEFT: operator controls + core readout */}
          <div className="space-y-3 lg:col-span-5">
            {/* Readout (Telemetry Core) */}
            <ReadoutCard
              readout={vm.readout}
              onCopySummary={() => void copyText("Summary copied.", summaryLines.join("\n"))}
              onCopyFullJson={() => (props.onCopyFullJson ? props.onCopyFullJson() : void 0)}
            />

            {/* Minimal controls (copy evidence package) */}
            <Card>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-sm">Evidence Package</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => void copyText("Summary copied.", summaryLines.join("\n"))}
                    >
                      Copy Summary
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!props.onCopyFullJson}
                      onClick={() => (props.onCopyFullJson ? props.onCopyFullJson() : void 0)}
                    >
                      Copy Full JSON
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-3">
                <pre className="whitespace-pre-wrap rounded-md border bg-muted/20 p-3 text-xs font-mono leading-relaxed">
                  {summaryLines.join("\n")}
                </pre>
                <div className="mt-2 text-xs text-muted-foreground">
                  This is UI-only. No invented metrics. Missing fields are reported as “not emitted”.
                </div>
              </CardContent>
            </Card>

            {/* OriginClaim Gates (status / switch posture) */}
            {vm.originClaimGates ? (
              <div className="rounded-xl border p-3">
                <div className="text-sm font-semibold">OriginClaim Gates</div>
                <div className="mt-1 text-sm">
                  Status:{" "}
                  <span className="font-mono">{vm.originClaimGates.active ? "ON" : "OFF"}</span>{" "}
                  <span className="text-xs opacity-70">(dev flag: ?{vm.originClaimGates.flag}=1)</span>
                </div>
                <div className="mt-1 text-sm">
                  Candidates: <span className="font-mono">{vm.originClaimGates.candidateCount}</span>
                </div>

                <div className="mt-2 text-xs opacity-70">Reason code counts</div>
                <pre className="mt-1 overflow-auto rounded-lg bg-black/5 p-2 text-xs">
                  {JSON.stringify(vm.originClaimGates.reasonCounts, null, 2)}
                </pre>
              </div>
            ) : null}
          </div>

          {/* RIGHT: telemetry stream */}
          <div className="space-y-3 lg:col-span-7">
            <VowelPathTimeline
              detected={vm.readout.voicePath}
              surface={vm.readout.voicePathSurface}
              functional={vm.readout.voicePathFunctional}
              delta={vm.readout.voicePathDelta}
            />

            <ResonancePanelV01 resonanceProfileV1={vm.resonanceProfileV1} />

            <RootMapCard
              rootMap={vm.rootMap ?? ({ kind: "missing", missing: "not_emitted", note: "rootMap" } as any)}
              word={String((vm.readout as any)?.word ?? (vm.readout as any)?.inputWord ?? "")}
              normalizedWord={(() => {
                const r: any = (vm.readout as any) ?? {};
                const n = r.normalizedWord ?? r.normalized ?? r.basisNormalized ?? "";
                if (n && typeof n === "object" && (n.kind === "present" || n.kind === "missing")) {
                  return n.kind === "present" ? String(n.value ?? "") : "";
                }
                return String(n ?? "");
              })()}
            />

            <MeaningPanel vm={vm} />

            {ledgerModel ? <EvidenceLedgerCard model={ledgerModel} engineVersion={engineVersion} /> : null}

            {/* Origin Claim (computed, auditable) */}
            <OriginClaimCard
              originClaim={vm.originClaim?.kind === "present" ? (vm.originClaim as any).value : null}
            />

            {candidateRows ? <CandidatesAccordion rows={candidateRows} /> : null}
          </div>
        </div>
      </div>
    );
  }
