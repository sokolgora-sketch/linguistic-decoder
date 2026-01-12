'use client';

import React from 'react';
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { toPrettyJson } from "@/ui/instrument/prettyJson";
import { ReadoutCard } from './sections/ReadoutCard';
import { MeaningCard } from "./sections/MeaningCard";
import { buildEvidenceLedgerModelFromVM } from '../ledger/ledgerModel';
import { EvidenceLedgerCard } from '../ledger/EvidenceLedgerCard';
import { buildCandidateRowsFromVM } from '../candidates/candidateModel';
import { CandidatesAccordion } from '../candidates/CandidatesAccordion';
import { OriginClaimCard } from '@/components/OriginClaimCard';

type Props =
  | {
      /** Raw /api/analyze-v1 payload (unknown shape). We adapt it, never trust it. */
      payload: unknown;
      vm?: never;
    }
  | {
      /** Telemetry VM (already adapted). VM-only boundary for callers like ZroChatPage. */
      vm: any;
      payload?: never;
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

  if (!isValidVm) return null;

  return (
    <div className="space-y-3">
      {/* Readout (Telemetry Core) */}
      <ReadoutCard readout={vm.readout} onCopySummary={() => void copyText('Summary copied.', summaryLines.join('\n'))} onCopyFullJson={() => void copyText('Full JSON copied.', toPrettyJson(vm.raw))} />

      <MeaningCard available={false} />

      {ledgerModel ? <EvidenceLedgerCard model={ledgerModel} engineVersion={engineVersion} /> : null}

      {/* Origin Claim (computed, auditable) */}
      <OriginClaimCard originClaim={(vm.raw as any)?.originClaim ?? null} />

      {vm.originClaimGates ? (
        <div className="rounded-xl border p-3">
          <div className="text-sm font-semibold">OriginClaim Gates</div>
          <div className="mt-1 text-sm">
            Status:{" "}
            <span className="font-mono">
              {vm.originClaimGates.active ? "ON" : "OFF"}
            </span>{" "}
            <span className="text-xs opacity-70">
              (dev flag: ?{vm.originClaimGates.flag}=1)
            </span>
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

      {candidateRows ? <CandidatesAccordion rows={candidateRows} /> : null}

      {/* Minimal controls (copy evidence package) */}
      <Card>
        <CardHeader className="py-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-sm">Evidence Package</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => void copyText('Summary copied.', summaryLines.join('\n'))}
              >
                Copy Summary
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => void copyText('Full JSON copied.', toPrettyJson(vm.raw))}
              >
                Copy Full JSON
            </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-3">
          <pre className="whitespace-pre-wrap rounded-md border bg-muted/20 p-3 text-xs font-mono leading-relaxed">
{summaryLines.join('\n')}
          </pre>
          <div className="mt-2 text-xs text-muted-foreground">
            This is UI-only. No invented metrics. Missing fields are reported as “not emitted”.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
