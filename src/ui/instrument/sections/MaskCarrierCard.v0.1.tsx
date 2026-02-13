import { buildMaskCarrierSummaryV0_1 } from "@/shared/maskCarrierSummary.v0.1";

function joinFlags(s: { noCarrier?: boolean; usedImplicit?: boolean; usedSyllabic?: boolean }): string {
  const xs = [
    s.noCarrier ? "NO_CARRIER" : null,
    s.usedImplicit ? "implicit" : null,
    s.usedSyllabic ? "syllabic" : null,
  ].filter(Boolean) as string[];
  return xs.join(" ");
}

function traceString(trace?: Array<{ kind: string; raw: string; voice: string }>): string {
  if (!trace || !trace.length) return "";
  return trace
    .map((t) => `${t.kind}:${String(t.raw ?? "")}→${String(t.voice ?? "")}`)
    .join(" | ");
}

export function MaskCarrierCard(props: { word: string; ipa?: string }) {
  const s = buildMaskCarrierSummaryV0_1({ word: props.word, ipa: props.ipa });

  const mask = s.mask.voices.length ? s.mask.voices.join(" ") : "—";
  const carrier = s.carrier?.voices?.length ? s.carrier.voices.join(" ") : "—";

  const status = !s.carrier
    ? { text: "no IPA", cls: "text-neutral-500" }
    : s.carrier.noCarrier
      ? { text: "NO_CARRIER", cls: "text-neutral-600" }
      : s.mismatch
        ? { text: "MISMATCH", cls: "text-red-600" }
        : { text: "MATCH", cls: "text-green-700" };

  const flags = s.carrier ? joinFlags(s.carrier) : "";
  const trace = s.carrier ? traceString(s.carrier.traceTokens as any) : "";
  const showTrace =
    !!s.carrier && !!trace && (!!s.mismatch || !!s.carrier.usedImplicit || !!s.carrier.usedSyllabic || !!s.carrier.noCarrier);

  return (
    <div className="rounded-xl border p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="font-semibold">Mask vs Carrier</div>
        <div className={`text-xs font-semibold ${status.cls}`}>{status.text}</div>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="rounded-lg bg-neutral-50 p-2">
          <div className="text-xs text-neutral-600">Mask (orthography)</div>
          <div className="mt-1 font-mono text-sm">{mask}</div>
          <div className="mt-1 text-xs text-neutral-600">
            mod7 total: <span className="font-mono">{s.mask.totalMod7}</span>
          </div>
          {s.mask.unmapped.length ? (
            <div className="mt-1 text-xs text-neutral-600">
              unmapped: <span className="font-mono">{s.mask.unmapped.join(" ")}</span>
            </div>
          ) : null}
        </div>

        <div className="rounded-lg bg-neutral-50 p-2">
          <div className="text-xs text-neutral-600">Carrier (IPA)</div>
          <div className="mt-1 font-mono text-sm">{carrier}</div>
          <div className="mt-1 text-xs text-neutral-600">
            mod7 total: <span className="font-mono">{s.carrier ? s.carrier.totalMod7 : "—"}</span>
          </div>

          {s.carrier && flags ? (
            <div className="mt-1 text-xs text-neutral-600">
              flags: <span className="font-mono">{flags}</span>
            </div>
          ) : null}

          {s.carrier?.unmapped?.length ? (
            <div className="mt-1 text-xs text-neutral-600">
              unmapped: <span className="font-mono">{s.carrier.unmapped.join(" ")}</span>
            </div>
          ) : null}

          {showTrace ? (
            <div className="mt-1 text-xs text-neutral-600">
              trace: <span className="font-mono">{trace}</span>
            </div>
          ) : null}
        </div>
      </div>

      {s.carrier ? (
        <div className="mt-2 text-xs text-neutral-600">
          distance: <span className="font-mono">{String(s.distance ?? 0)}</span>
        </div>
      ) : null}
    </div>
  );
}
