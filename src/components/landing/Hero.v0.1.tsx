import Link from "next/link";
import { TurkishBaselineChartV0_1 } from "@/components/landing/TurkishBaselineChart.v0.1";
import { LANDING_BASELINES_V0_1 } from "@/shared/landing/landingBaselines.v0.1";

function fmt3(x: number) {
  if (!Number.isFinite(x)) return "NaN";
  return x.toFixed(3);
}

export function HeroV0_1() {
  const tr = LANDING_BASELINES_V0_1.turkish_step20;
  const s = tr.slope?.aperturePresenceMean;

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950/40 px-3 py-1 text-xs text-neutral-300">
          <span className="font-mono">instrument</span>
          <span className="text-neutral-500">·</span>
          <span className="font-mono">deterministic</span>
          <span className="text-neutral-500">·</span>
          <span className="font-mono">baseline-locked</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-neutral-100">
          ZË-RO: Deterministic Vowel-Aperture Grounding Probe
        </h1>

        <p className="text-neutral-300">
          Test whether an LLM encodes a stable vowel-aperture ↔ semantic ordering signal.
          Paste outputs, score deterministically, export a PDF.
        </p>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/evals"
            className="rounded-lg bg-white text-black px-4 py-2 text-sm font-semibold hover:opacity-90"
          >
            Try Evals →
          </Link>
          <Link
            href="/chat"
            className="rounded-lg border border-neutral-700 bg-neutral-950/30 px-4 py-2 text-sm font-semibold text-neutral-200 hover:border-neutral-500"
          >
            Open Instrument
          </Link>
          <Link
            href="https://github.com/sokolgora-sketch/linguistic-decoder"
            className="rounded-lg border border-neutral-700 bg-neutral-950/30 px-4 py-2 text-sm font-semibold text-neutral-200 hover:border-neutral-500"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </Link>
        </div>

        {s ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-4">
            <div className="text-sm font-semibold text-neutral-100">Turkish baseline (presence mean slope)</div>
            <div className="mt-2 grid gap-1 text-sm text-neutral-300">
              <div>
                Pearson r: <span className="font-mono text-neutral-100">{fmt3(s.pearson_r)}</span>{" "}
                <span className="text-neutral-500">(p_perm={fmt3(s.p_perm)}, iters={s.iters})</span>
              </div>
              <div>
                Spearman ρ: <span className="font-mono text-neutral-100">{fmt3(s.spearman_rho)}</span>{" "}
                <span className="text-neutral-500">(p_perm={fmt3(s.p_perm_spearman)}, iters={s.iters})</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-neutral-500">
              Baseline source: tests/validation/baselines/turkish.spectrum.step20.v0.1.md
            </div>
          </div>
        ) : null}
      </div>

      <TurkishBaselineChartV0_1 points={tr.points} />
    </section>
  );
}
