import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AnalyzeWordResultUI, CandidateUI } from "@/shared/resultsUI";

function splitVowelPath(vowelPath: string | undefined): string[] {
  if (!vowelPath) return [];
  return vowelPath
    .split(/[-–—\s]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function VowelChips({ path }: { path: string[] }) {
  if (!path.length) return <span className="text-muted-foreground">—</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {path.map((v, i) => (
        <Badge key={`${v}-${i}`} variant="secondary" className="text-xs">
          {v}
        </Badge>
      ))}
    </div>
  );
}

function pickBestCandidate(result: AnalyzeWordResultUI): CandidateUI | null {
  if (!Array.isArray(result.candidates) || result.candidates.length === 0) return null;
  return result.candidates[0] ?? null;
}

export function AnalysisSummaryCard({
  result,
}: {
  result: AnalyzeWordResultUI | null;
}) {
  if (!result) return null;

  const best = pickBestCandidate(result);

  const candidateLang = best?.language ?? "unknown";
  const candidateForm = best?.form ?? "";
  const wordShown = result.word;

  // IMPORTANT: AnalyzeWordResultUI does NOT have result.vowelPath.
  // Only CandidateUI.vowelPath or PrimaryPathSummary.voicePath exist in your contract.
  const vowelPathStr =
    best?.vowelPath ??
    (result.primaryPath?.voicePath?.length
      ? result.primaryPath.voicePath.join("-")
      : undefined);

  const vowelPath = splitVowelPath(vowelPathStr);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Analysis Summary</CardTitle>
        <CardDescription className="text-xs">
          Primary findings for this analysis.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{candidateLang}</Badge>
          <Badge variant="outline">{wordShown}</Badge>
          {candidateForm ? <Badge variant="outline">{candidateForm}</Badge> : null}
        </div>

        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Vowel Path</div>
          <VowelChips path={vowelPath} />
        </div>

        {best?.functionalStatement ? (
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Functional Statement</div>
            <div className="text-sm">{best.functionalStatement}</div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
