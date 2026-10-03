"use client";

import type {
  SpokenPronunciationProvenanceV0_1VM,
  TelemetryReadout,
} from "@/ui/telemetry/types";
import {
  spokenPronunciationPathTextV0_1,
  spokenPronunciationSourceTextV0_1,
} from "@/ui/instrument/spokenPronunciationPresentation.v0_1";

function consonantSegmentsText(
  pronunciation: SpokenPronunciationProvenanceV0_1VM,
): string | null {
  if (pronunciation.status !== "defined") return null;

  return pronunciation.variants
    .map((variant) => {
      const segments = variant.segments.length
        ? variant.segments
            .map((segment) => segment.sourceUnits.join(" "))
            .join(" → ")
        : "none";

      return pronunciation.variants.length > 1
        ? `variant ${variant.variantOrder + 1}: ${segments}`
        : segments;
    })
    .join(" | ");
}

function presentPronunciation(
  pronunciation: TelemetryReadout["spokenPronunciation"],
) {
  return pronunciation?.kind === "present" ? pronunciation.value : null;
}

export function SpokenResultCompositionSummaryV0_1({
  readout,
}: {
  readout: TelemetryReadout;
}) {
  const pronunciation = presentPronunciation(readout.spokenPronunciation);
  const definedPronunciation =
    pronunciation?.status === "defined" ? pronunciation : null;
  const segments = definedPronunciation
    ? consonantSegmentsText(definedPronunciation)
    : null;
  const canonicalPath =
    pronunciation?.status === "defined" && readout.voicePath.kind === "present"
      ? readout.voicePath.value
      : null;

  return (
    <section
      aria-label="Spoken result summary"
      data-testid="spoken-result-composition-summary"
      className="rounded-[12px] border border-[#355a7a] bg-[#111a24] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.16)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ea4ba]">
            Spoken result
          </div>
          <h2 className="mt-1 text-base font-semibold text-[#f5f7fb]">
            Pronunciation to canonical Voice path
          </h2>
        </div>
        <div className="rounded-full border border-[#355a7a] px-2.5 py-1 text-[11px] font-semibold text-[#cfe6ff]">
          Spoken / canonical
        </div>
      </div>

      {definedPronunciation ? (
        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <div className="rounded-lg border border-[#27313d] bg-[#0d1117] p-3">
            <dl className="space-y-2">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8ea4ba]">
                  Pronunciation
                </dt>
                <dd className="mt-1 break-words font-mono text-sm text-[#f5f7fb]">
                  {spokenPronunciationSourceTextV0_1(definedPronunciation)}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8ea4ba]">
                  Pronunciation consonant segments
                </dt>
                <dd className="mt-1 break-words font-mono text-sm text-[#d7dde7]">
                  {segments ?? "none"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-[#27313d] bg-[#0d1117] p-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8ea4ba]">
              Canonical result
            </div>
            <div className="mt-2 font-mono text-sm text-emerald-200">
              canonical spoken Voice path: {spokenPronunciationPathTextV0_1(canonicalPath)}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <div className="rounded-lg border border-[#4b3f2c] bg-[#18140e] p-3 text-[#f0ddb0]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em]">
              Spoken pronunciation unavailable
            </div>
            <div className="mt-2 text-xs leading-5">
              No pronunciation-derived consonant sequence is emitted.
            </div>
          </div>
          <div className="rounded-lg border border-[#4b3f2c] bg-[#18140e] p-3 text-[#f0ddb0]">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em]">
              Canonical result
            </div>
            <div className="mt-2 font-mono text-sm">
              canonical spoken Voice path: Null
            </div>
          </div>
        </div>
      )}

      <p className="mt-3 text-xs leading-5 text-[#aeb7c5]">
        Consonant segments are source-faithful evidence contained in the pronunciation; the canonical Voice path is derived from qualified spoken vowel nuclei.
      </p>
    </section>
  );
}
