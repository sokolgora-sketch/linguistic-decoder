"use client";

import type {
  PresentOrMissing,
  TelemetryReadout,
  Vowel,
} from "@/ui/telemetry/types";
import {
  pronunciationVariantStatusV0_1,
  spokenPronunciationPathTextV0_1,
  spokenPronunciationSourceTextV0_1,
} from "@/ui/instrument/spokenPronunciationPresentation.v0_1";

function presentOr<T>(
  value: PresentOrMissing<T> | undefined,
  format: (value: T) => string,
  fallback = "not emitted",
): string {
  if (!value || value.kind !== "present") return fallback;
  return format(value.value);
}

function pathText(value: PresentOrMissing<Vowel[]> | undefined): string {
  return presentOr(value, (path) => (path.length ? path.join(" → ") : "none"), "not emitted");
}

function consonantSegmentsText(segments: readonly { sourceUnits: readonly string[] }[]): string {
  return segments.length
    ? segments.map((segment) => segment.sourceUnits.join(" ")).join(" → ")
    : "none";
}

export function SpokenPronunciationOverviewCardV0_1({
  readout,
}: {
  readout: TelemetryReadout;
}) {
  const pronunciation = readout.spokenPronunciation;

  return (
    <section
      aria-label="Spoken pronunciation overview"
      data-testid="spoken-pronunciation-overview"
      className="rounded-xl border border-[#355a7a] bg-[#111a24] p-4"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8ea4ba]">
            Spoken pronunciation
          </div>
          <h2 className="mt-1 text-base font-semibold text-[#f5f7fb]">
            Authority used for canonical spoken analysis
          </h2>
        </div>
        <div className="rounded-full border border-[#355a7a] px-2.5 py-1 text-[11px] font-semibold text-[#cfe6ff]">
          Spoken / canonical
        </div>
      </div>

      {pronunciation?.kind === "present" ? (
        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <div className="rounded-lg border border-[#27313d] bg-[#0d1117] p-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8ea4ba]">
              Pronunciation evidence
            </div>
            <dl className="mt-2 space-y-1.5 font-mono text-xs text-[#d7dde7]">
              <div>
                <dt className="inline text-[#8ea4ba]">pronunciation: </dt>
                <dd className="inline break-words">{spokenPronunciationSourceTextV0_1(pronunciation.value)}</dd>
              </div>
              <div>
                <dt className="inline text-[#8ea4ba]">authority: </dt>
                <dd className="inline break-words">{pronunciation.value.sourceProfileId}</dd>
              </div>
              <div>
                <dt className="inline text-[#8ea4ba]">notation: </dt>
                <dd className="inline">{pronunciation.value.sourceNotation}</dd>
              </div>
              <div>
                <dt className="inline text-[#8ea4ba]">variant status: </dt>
                <dd className="inline">{pronunciationVariantStatusV0_1(pronunciation.value)}</dd>
              </div>
              {pronunciation.value.status === "defined" ? (
                <div data-testid="spoken-pronunciation-consonant-segments">
                  <dt className="inline text-[#8ea4ba]">Pronunciation consonant segments: </dt>
                  <dd className="inline">
                    {pronunciation.value.variants.map((variant) => (
                      <span key={variant.variantId} className="mr-2 inline-block">
                        {pronunciation.value.variants.length > 1 ? `variant ${variant.variantOrder + 1}: ` : ""}
                        <span className="font-mono">{consonantSegmentsText(variant.segments)}</span>
                      </span>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
            <div
              data-testid="spoken-pronunciation-revision"
              className="mt-2 border-t border-[#27313d] pt-2 text-[10px] leading-4 text-[#7f8b99]"
            >
              <span className="mr-1 uppercase tracking-[0.08em]">Source revision:</span>
              <span className="break-all font-mono">{pronunciation.value.sourceRevision}</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#27313d] bg-[#0d1117] p-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8ea4ba]">
              Canonical result
            </div>
            <div className="mt-2 font-mono text-sm text-emerald-200">
              canonical spoken Voice path: {spokenPronunciationPathTextV0_1(
                pronunciation.value.status === "defined" && readout.voicePath.kind === "present"
                  ? readout.voicePath.value
                  : null,
              )}
            </div>
            {pronunciation.value.status === "null" ? (
              <div className="mt-2 text-xs text-amber-200">
                reason: {pronunciation.value.reasonCode ?? "reason not emitted"}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-[#4b3f2c] bg-[#18140e] p-3 text-sm text-[#f0ddb0]">
          Spoken pronunciation provenance not emitted.
        </div>
      )}

      <div className="mt-3 rounded-lg border border-[#27313d] bg-[#0d1117] p-3 text-xs leading-5 text-[#aeb7c5]">
        Orthographic vowel sequence: <span className="font-mono text-[#d7dde7]">{pathText(readout.voicePathSurface)}</span> — non-authoritative compatibility evidence only; it does not supply the canonical spoken path.
      </div>
    </section>
  );
}
