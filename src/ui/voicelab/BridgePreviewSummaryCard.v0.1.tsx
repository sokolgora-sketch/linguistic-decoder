import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ZeroVoiceLabBridgePreviewModelV0_1 } from "@/shared/voicelab/bridgePreviewModel.v0.1";

type Props = {
  model: ZeroVoiceLabBridgePreviewModelV0_1;
};

type RowProps = {
  label: string;
  value: string;
};

function Row({ label, value }: RowProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-neutral-800 py-2 last:border-b-0">
      <div className="text-xs uppercase tracking-wide text-neutral-400">{label}</div>
      <div className="text-sm text-neutral-100 text-right break-all">{value}</div>
    </div>
  );
}

function fmtNumber(value: number | null): string {
  return value == null ? "—" : String(value);
}

function fmtBool(value: boolean | null): string {
  return value == null ? "—" : value ? "true" : "false";
}

function fmtText(value: string | null): string {
  return value == null || value === "" ? "—" : value;
}

export function BridgePreviewSummaryCardV0_1({ model }: Props) {
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm">VoiceLab Bridge Preview</CardTitle>
      </CardHeader>

      <CardContent className="space-y-1 py-3">
        <Row label="Import kind" value={model.importKind} />
        <Row label="Source version" value={fmtText(model.sourceVersion)} />
        <Row label="Captured at" value={fmtText(model.capturedAt)} />
        <Row label="Vowels recorded" value={fmtNumber(model.vowelsRecorded)} />
        <Row label="A-anchor Hz" value={fmtNumber(model.aAnchorHz)} />
        <Row label="Singer mode" value={fmtText(model.singerMode)} />
        <Row label="Selected vowel" value={fmtText(model.selectedVowel)} />
        <Row label="Target pitch Hz" value={fmtNumber(model.targetPitchHz)} />
        <Row label="Seed stage" value={fmtText(model.seedStage)} />
        <Row label="Seed locked" value={fmtBool(model.seedLocked)} />
      </CardContent>
    </Card>
  );
}
