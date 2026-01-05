'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

import { adaptAnalysisToTelemetryVM } from './contractAdapter';
import { ReadoutCard } from './sections/ReadoutCard';
import { buildEvidenceLedgerModel } from '../ledger/ledgerModel';
import { EvidenceLedgerCard } from '../ledger/EvidenceLedgerCard';
import { buildCandidateRows } from '../candidates/candidateModel';
import { CandidatesAccordion } from '../candidates/CandidatesAccordion';

type Props = {
  /** Raw /api/analyze-v1 payload (unknown shape). We adapt it, never trust it. */
  payload: unknown;
};

function toPrettyJson(x: unknown) {
  try {
    return JSON.stringify(x, null, 2);
  } catch {
    return String(x);
  }
}

function fmt<T>(x: { kind: 'present'; value: T } | { kind: 'missing'; missing: string; note?: string }) {
  return x.kind === 'present' ? String(x.value) : 'not_emitted';
}

export function InstrumentPanel({ payload }: Props) {
  const { toast } = useToast();
  const vm = React.useMemo(() => adaptAnalysisToTelemetryVM(payload), [payload]);
  const ledgerModel = React.useMemo(() => buildEvidenceLedgerModel(payload), [payload]);
  const candidateRows = React.useMemo(() => buildCandidateRows(payload), [payload]);

  async function copyText(label: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copied', description: label });
    } catch {
      toast({ title: 'Copy failed', description: 'Clipboard not available.', variant: 'destructive' });
    }
  }

  const summaryLines = [
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

  const engineVersion = vm.readout.engineVersion.kind === 'present' ? vm.readout.engineVersion.value : null;

  return (
    <div className="space-y-3">
      {/* Readout (Telemetry Core) */}
      <ReadoutCard readout={vm.readout} onCopySummary={() => void copyText('Summary copied.', summaryLines.join('\n'))} onCopyFullJson={() => void copyText('Full JSON copied.', toPrettyJson(payload))} />

      <EvidenceLedgerCard model={ledgerModel} engineVersion={engineVersion} />

      <CandidatesAccordion rows={candidateRows} />

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
                onClick={() => void copyText('Full JSON copied.', toPrettyJson(payload))}
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
