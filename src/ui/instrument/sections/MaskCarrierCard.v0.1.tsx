import { buildMaskCarrierSummaryV0_1 } from "@/shared/maskCarrierSummary.v0.1";

export function MaskCarrierCard(props: { word: string; ipa?: string }) {
  const s = buildMaskCarrierSummaryV0_1({ word: props.word, ipa: props.ipa });

  const mask = s.mask.voices.length ? s.mask.voices.join(" ") : "—";
  const carrier = s.carrier?.voices?.length ? s.carrier.voices.join(" ") : "—";

  return (
    <div className="rounded-xl border p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="font-semibold">Mask vs Carrier</div>
        {s.carrier ? (
          <div className={`text-xs font-semibold ${s.mismatch ? "text-red-600" : "text-green-700"}`}>
            {s.mismatch ? "MISMATCH" : "MATCH"}
          </div>
        ) : (
          <div className="text-xs text-neutral-500">no IPA</div>
        )}
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
          {s.carrier?.unmapped?.length ? (
            <div className="mt-1 text-xs text-neutral-600">
              unmapped: <span className="font-mono">{s.carrier.unmapped.join(" ")}</span>
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
