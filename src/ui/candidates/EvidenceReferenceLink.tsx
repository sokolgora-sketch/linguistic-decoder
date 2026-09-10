import React from "react";
import type { UICandidateRow } from "./candidateModel";
import {
  resolveReviewedEvidenceReferenceV0_1,
  resolveResearchEvidenceReferenceV0_1,
  type EvidenceReferenceResolutionV0_1,
} from "@/shared/openInstrument/evidenceReferenceResolution.v0_1";

function unresolvedReferenceV0_1(
  ref: string,
): EvidenceReferenceResolutionV0_1 {
  return {
    originalRef: ref,
    kind: "unresolved",
    destinationType: "none",
    navigable: false,
  };
}

function isResearchStatusV0_1(
  value: string | null | undefined,
): value is "research_candidate" | "reviewed_candidate" {
  return value === "research_candidate" || value === "reviewed_candidate";
}

export function resolveCandidateEvidenceReferenceV0_1(
  row: Pick<UICandidateRow, "sourceId" | "sourceStatus">,
  ref: string,
): EvidenceReferenceResolutionV0_1 {
  const sourceId = row.sourceId?.trim();
  const sourceStatus = row.sourceStatus?.trim();

  if (!sourceId || !sourceStatus) {
    return unresolvedReferenceV0_1(ref);
  }

  if (sourceStatus === "reviewed_accepted") {
    return resolveReviewedEvidenceReferenceV0_1({
      ref,
      sourceId,
      sourceStatus,
    });
  }

  if (isResearchStatusV0_1(sourceStatus)) {
    return resolveResearchEvidenceReferenceV0_1({
      ref,
      researchEvidenceId: sourceId,
      sourceStatus,
    });
  }

  return unresolvedReferenceV0_1(ref);
}

function resolutionLabelV0_1(
  resolution: EvidenceReferenceResolutionV0_1,
): string {
  if (resolution.kind === "reviewed_evidence") {
    return `Reviewed source${resolution.sourceStatus ? ` · ${resolution.sourceStatus}` : ""}`;
  }

  if (resolution.kind === "research_evidence") {
    return `Research source${resolution.sourceStatus ? ` · ${resolution.sourceStatus}` : ""}`;
  }

  if (resolution.kind === "internal_diagnostic") {
    return "Internal diagnostic";
  }

  return "Evidence reference";
}

export function EvidenceReferenceItem({
  resolution,
}: {
  resolution: EvidenceReferenceResolutionV0_1;
}) {
  const sourceLabel = resolutionLabelV0_1(resolution);
  const title = resolution.title ??
    (resolution.kind === "unresolved" ? "Unresolved reference" : "Source record");

  return (
    <li className="rounded-md border border-slate-800 bg-black/20 px-2.5 py-2 text-xs text-slate-300">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-slate-200">{sourceLabel}</span>
        {resolution.navigable && resolution.safeUrl ? (
          <a
            href={resolution.safeUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-blue-200 underline decoration-blue-400/70 underline-offset-2 hover:text-blue-100"
          >
            {title}
          </a>
        ) : (
          <span>{title}</span>
        )}
      </div>
      <div className="mt-1 break-all font-mono text-slate-400">
        {`Ref: ${resolution.originalRef}`}
      </div>
      {resolution.locator ? (
        <div className="mt-1 break-words text-slate-500">
          {`Locator: ${resolution.locator}`}
        </div>
      ) : null}
    </li>
  );
}

export function CandidateEvidenceReferences({
  row,
}: {
  row: UICandidateRow;
}) {
  const refs = Array.isArray(row.evidenceRefs)
    ? row.evidenceRefs.filter((ref) => typeof ref === "string" && ref.trim())
    : [];

  if (!refs.length) return null;

  return (
    <div className="mt-3 rounded-md border border-slate-700/80 bg-slate-950/35 p-2.5">
      <div className="text-xs font-semibold text-slate-200">Evidence sources</div>
      <ul className="mt-2 space-y-2">
        {refs.map((ref, index) => (
          <EvidenceReferenceItem
            key={`${ref}-${index}`}
            resolution={resolveCandidateEvidenceReferenceV0_1(row, ref)}
          />
        ))}
      </ul>
    </div>
  );
}
