import type {
  AnalysisStatusCodeV0_1,
  PresentOrMissing,
  TelemetryViewModel,
} from "@/ui/telemetry/types";

type OrientationState = {
  structure: string;
  doctrine: string;
  evidence: string;
};

function presentValue<T>(
  value: PresentOrMissing<T> | undefined,
): T | undefined {
  return value?.kind === "present" ? value.value : undefined;
}

function hasDetectedVoicePath(vm: TelemetryViewModel): boolean {
  const path = presentValue(vm.readout.voicePath);
  return Array.isArray(path) && path.length > 0;
}

function hasLexicalSourceEvidence(vm: TelemetryViewModel): boolean {
  const candidates = Array.isArray(vm.candidates) ? vm.candidates : [];
  return candidates.some(
    (candidate) =>
      presentValue(candidate.evidenceBasis) === "lexical_equivalence" &&
      (presentValue(candidate.evidenceRefs)?.length ?? 0) > 0,
  );
}

function formatVoicePath(vm: TelemetryViewModel): string | null {
  const path = presentValue(vm.readout.voicePath);
  return Array.isArray(path) && path.length > 0 ? path.join(" → ") : null;
}

function statusEvidenceSummary(
  status: AnalysisStatusCodeV0_1 | undefined,
  hasPath: boolean,
  hasLexicalEvidence: boolean,
): string {
  switch (status) {
    case "reviewed_functional_evidence":
      return "Reviewed functional evidence is available.";
    case "research_functional_hypothesis":
      return "A bounded research functional hypothesis is available.";
    case "candidate_only":
      return "An exploratory candidate is available; it is not established evidence.";
    case "structural_unreviewed":
      return hasLexicalEvidence
        ? "A structural hypothesis is available, with lexical source evidence kept separate."
        : "A structural hypothesis is available; it is not established candidate truth.";
    case "null_no_supported_candidate":
      if (!hasPath) {
        return "No structural Voice path was detected, so no structural reading is established.";
      }
      return hasLexicalEvidence
        ? "No supported functional candidate is established. Lexical source evidence remains available separately."
        : "No supported functional candidate is established; structural and evidence states remain separate.";
    default:
      return hasPath
        ? "The current analysis has no stronger emitted evidence state."
        : "No structural Voice path was detected for this input.";
  }
}

function doctrineSummary(vm: TelemetryViewModel): string {
  if (vm.doctrineReading?.kind === "missing") {
    if (vm.doctrineReading.missing === "malformed") {
      return "The doctrinal reading is malformed; see the detailed contract error below.";
    }
    return "No doctrinal reading was emitted.";
  }

  if (vm.doctrineReading?.kind !== "present" || vm.doctrineReading.value === null) {
    return "No doctrinal reading was emitted.";
  }

  const doctrine = vm.doctrineReading.value;
  const level3Reading = doctrine.level3WholePathReading?.reading;
  if (typeof level3Reading === "string" && level3Reading.length > 0) {
    return `Doctrinal inference: ${level3Reading}`;
  }

  const path = doctrine.analyzedVoicePath;
  if (path.length > 0) {
    return "Per-Voice doctrine is available, but the current whole-path Level-3 law applies only to exact two-distinct-Voice paths.";
  }

  return "No doctrinal reading was emitted.";
}

function buildOrientationState(vm: TelemetryViewModel): OrientationState {
  const hasPath = hasDetectedVoicePath(vm);
  const hasLexicalEvidence = hasLexicalSourceEvidence(vm);
  const formattedPath = formatVoicePath(vm);
  const status =
    vm.analysisStatusV0_1?.kind === "present"
      ? vm.analysisStatusV0_1.value.status
      : undefined;

  return {
    structure: formattedPath
      ? formattedPath
      : "No canonical Voice path was detected for this input.",
    doctrine: doctrineSummary(vm),
    evidence: statusEvidenceSummary(status, hasPath, hasLexicalEvidence),
  };
}

export function PrimaryReadingOrientationCardV0_1({
  vm,
}: {
  vm: TelemetryViewModel;
}) {
  const orientation = buildOrientationState(vm);

  return (
    <section
      aria-label="Primary reading orientation"
      data-testid="primary-reading-orientation-card"
      className="rounded-[12px] border border-[#3b434d] bg-[#171c22] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ea4ba]">
            Primary reading orientation
          </p>
          <h2 className="mt-1 text-[17px] font-semibold text-[#f5f7fb]">
            What this analysis currently establishes
          </h2>
        </div>
        <span className="rounded-full border border-[#3b4b5c] px-2.5 py-1 text-[11px] font-semibold text-[#b8c3cf]">
          Bounded reading
        </span>
      </div>

      <dl className="mt-4 grid gap-3 text-[13px] leading-6 text-[#c6d0dc] sm:grid-cols-3">
        <div data-testid="orientation-structure">
          <dt className="font-semibold text-[#8ea4ba]">Engine-selected Voice path:</dt>
          <dd>{orientation.structure}</dd>
        </div>
        <div data-testid="orientation-doctrine">
          <dt className="font-semibold text-[#8ea4ba]">Doctrine</dt>
          <dd>{orientation.doctrine}</dd>
        </div>
        <div data-testid="orientation-evidence">
          <dt className="font-semibold text-[#8ea4ba]">Functional / source state</dt>
          <dd>{orientation.evidence}</dd>
        </div>
      </dl>

      <div
        data-testid="orientation-boundary"
        className="mt-4 border-t border-[#2f3742] pt-3 text-[12px] leading-5 text-[#9fb1bf]"
      >
        <p>
          No historical origin, transmission, language superiority, ownership,
          or candidate truth is established. Null remains valid.
        </p>
        <p className="mt-1 font-semibold text-[#c6d0dc]">
          No single selection is made. You decide the final interpretation.
        </p>
      </div>
    </section>
  );
}
