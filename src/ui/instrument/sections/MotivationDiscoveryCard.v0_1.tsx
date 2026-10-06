"use client";

import type {
  MotivationDiscoveryCandidateV0_1VM,
  MotivationDiscoveryV0_1VM,
  PresentOrMissing,
} from "@/ui/telemetry/types";

function pathText(values: readonly string[]): string {
  return values.length ? values.join(" → ") : "Null";
}

function zcText(value: unknown): string {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "Null";
  const record = value as Record<string, unknown>;
  const p = typeof record.p === "number" ? record.p : null;
  const s = typeof record.s === "number" ? record.s : null;
  const a = typeof record.a === "number" ? record.a : null;
  const i = Array.isArray(record.i) ? record.i.join(" · ") : null;
  const d = Array.isArray(record.d) ? record.d.join(" · ") : null;
  if (p === null || s === null || a === null || i === null || d === null) return "present";
  return `P ${p} · I ${i || "none"} · S ${s} · D ${d || "none"} · A ${a}`;
}

function Candidate({ candidate }: { candidate: MotivationDiscoveryCandidateV0_1VM }) {
  return (
    <article
      data-testid="motivation-discovery-candidate"
      className="rounded-lg border border-[#3e4b59] bg-[#0d1117] p-3"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-semibold text-[#f5f7fb]">
              {candidate.candidateForm}
            </span>
            <span className="rounded-full border border-[#5e4b22] bg-[#19140d] px-2 py-0.5 font-mono text-[10px] uppercase text-[#f0ddb0]">
              {candidate.candidateStatus}
            </span>
            <span className="text-xs text-[#9fb1bf]">{candidate.candidateLanguage}</span>
          </div>
          <div className="mt-1 text-xs text-[#c5ced8]">
            {candidate.candidateGloss} · match key / embryo {candidate.candidateEmbryo}
          </div>
          <div className="mt-1 text-[10px] text-[#8ea4ba]">
            DISCOVERY_ORTHOGRAPHIC_PROFILE · Voice structure {pathText(candidate.candidateVoicePath)} · not spoken pronunciation
          </div>
        </div>
        <span className="text-[10px] uppercase tracking-[0.14em] text-[#8ea4ba]">
          user decides
        </span>
      </div>

      <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
        <div>
          <dt className="text-[#8ea4ba]">Source fact</dt>
          <dd className="mt-1 break-words font-mono text-[#d7dde7]">
            {candidate.sourceFact.sourceId} · {candidate.sourceFact.attestationTruth} · {candidate.sourceFact.sourceStatus}
          </dd>
          <dd className="mt-1 break-words text-[10px] text-[#9fb1bf]">
            lexical source: {candidate.sourceFact.sourceUrlOrArchiveRef ?? "unavailable"}
            {candidate.sourceFact.entryLocator ? ` · ${candidate.sourceFact.entryLocator}` : ""}
          </dd>
        </div>
        <div>
          <dt className="text-[#8ea4ba]">Generic structural match</dt>
          <dd className="mt-1 break-words font-mono text-[#d7dde7]">
            {candidate.derivedStructure.protoRoots.join(" + ")} · {candidate.derivedStructure.operationIds.join(", ") || "none"}
          </dd>
          <dd className="mt-1 text-[10px] text-[#9fb1bf]">
            deterministic embryo/source-row lookup; no target-word mapping
          </dd>
        </div>
      </dl>

      <div className="mt-3 rounded-md border border-[#4b3f2c] bg-[#18140e] p-2.5 text-xs leading-5 text-[#f0ddb0]">
        <span className="font-semibold">Functional interpretation / hypothesis:</span>{" "}
        {candidate.functionalInterpretation.statement ?? "not supplied"}
      </div>

      <div className="mt-2 break-words text-[10px] leading-4 text-[#7f8b99]">
        Evidence: {candidate.sourceFact.evidenceRefs.join(", ") || "none"}. Historical relation: not claimed. No single winner.
      </div>
    </article>
  );
}

export function MotivationDiscoveryCardV0_1({
  discovery,
}: {
  discovery: PresentOrMissing<MotivationDiscoveryV0_1VM> | undefined;
}) {
  if (!discovery || discovery.kind !== "present") return null;
  const value = discovery.value;
  const math = value.derivedStructure.math7;
  const zc = value.derivedStructure.zeroConsonantalStructuralComposition;

  return (
    <section
      aria-label="Motivation Engine Discovery Lab"
      data-testid="motivation-discovery-card"
      className="rounded-[12px] border border-[#6b5b2f] bg-[#17140e] p-4 shadow-[0_12px_32px_rgba(0,0,0,0.16)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d8bb7a]">
            Motivation Engine / Discovery Lab
          </div>
          <h2 className="mt-1 text-base font-semibold text-[#f5f7fb]">
            Source-bound exploratory candidates
          </h2>
        </div>
        <span className="rounded-full border border-[#6b5b2f] px-2.5 py-1 text-[11px] font-semibold text-[#f0ddb0]">
          {value.status === "MATCHES_FOUND" ? `${value.candidates.length} candidate${value.candidates.length === 1 ? "" : "s"}` : "Null"}
        </span>
      </div>

      <div className="mt-3 rounded-lg border border-[#3f3a2b] bg-[#101217] p-3 text-xs leading-5 text-[#c5ced8]">
        <div className="font-semibold text-[#f0ddb0]">SOURCE FACT</div>
        <div className="mt-1">
          input {value.inputWord} · language {value.inputLanguage} · profile {value.inputProfile}
        </div>
        <div className="mt-1 text-[#9fb1bf]">{value.sourceFact.sourceStatus}</div>
        <div className="mt-1 text-[#9fb1bf]">{value.sourceFact.authorityBoundary}</div>
      </div>

      <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
        <div className="rounded-lg border border-[#303843] bg-[#10161c] p-3">
          <div className="text-[#8ea4ba]">DERIVED STRUCTURE · Voice path</div>
          <div className="mt-1 font-mono text-[#d7dde7]">{pathText(value.derivedStructure.voicePath)}</div>
          <div className="mt-1 text-[10px] text-[#7f8b99]">source: {value.derivedStructure.voicePathSource}</div>
        </div>
        <div className="rounded-lg border border-[#303843] bg-[#10161c] p-3">
          <div className="text-[#8ea4ba]">Math7</div>
          <div className="mt-1 font-mono text-[#d7dde7]">
            {math.basis ?? "basis unavailable"} · total mod 7 {math.totalMod7 ?? "Null"}
          </div>
          <div className="mt-1 text-[10px] text-[#7f8b99]">{math.principlesPath.join(" → ") || "principles unavailable"}</div>
        </div>
        <div className="rounded-lg border border-[#303843] bg-[#10161c] p-3">
          <div className="text-[#8ea4ba]">Γ / consonantal structure</div>
          <div className="mt-1 font-mono text-[#d7dde7]">
            {value.derivedStructure.gamma.status === "NULL"
              ? "Null"
              : value.derivedStructure.gamma.orderedUnits.join(" → ") || "none"}
          </div>
          <div className="mt-1 text-[10px] text-[#7f8b99]">{value.derivedStructure.gamma.reason ?? value.derivedStructure.gamma.status}</div>
        </div>
        <div className="rounded-lg border border-[#303843] bg-[#10161c] p-3">
          <div className="text-[#8ea4ba]">ZË-RO structural composition</div>
          <div className="mt-1 font-mono text-[#d7dde7]">
            {zc.status === "NULL" ? "Null" : zc.variants.map(zcText).join(" | ") || "present"}
          </div>
          <div className="mt-1 text-[10px] text-[#7f8b99]">{zc.reason ?? zc.status}</div>
        </div>
      </div>

      {value.candidates.length ? (
        <div className="mt-4 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d8bb7a]">
            ZË-RO INTERPRETATION / HYPOTHESIS
          </div>
          {value.candidates.map((candidate) => (
            <Candidate key={candidate.candidateId} candidate={candidate} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-[#4b3f2c] bg-[#18140e] p-3 text-xs leading-5 text-[#f0ddb0]">
          <div className="font-semibold">UNKNOWN / NULL</div>
          <div className="mt-1">{value.unknownOrNull.reason ?? "No qualifying source witness."}</div>
        </div>
      )}

      <p className="mt-3 text-[11px] leading-4 text-[#aeb7c5]">
        Exploratory Discovery output only. Source facts, derived structure, and functional hypotheses remain separate; historical origin is not claimed and the user decides.
      </p>
    </section>
  );
}
