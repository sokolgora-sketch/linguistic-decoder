import Link from "next/link";

export function ScientificFoundationV0_1() {
  return (
    <section className="rounded-xl border border-neutral-800 bg-neutral-950/30 p-6">
      <div className="text-lg font-semibold text-neutral-100">Scientific foundation</div>
      <div className="mt-1 text-sm text-neutral-400">Published baselines + reproducibility posture.</div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-4">
          <div className="text-sm font-semibold text-neutral-100">Published research</div>
          <ul className="mt-3 space-y-2 text-sm text-neutral-300">
            <li>
              <Link className="underline text-neutral-200" href="https://ling.auf.net/lingbuzz/009799" target="_blank" rel="noreferrer">
                LingBuzz/009799
              </Link>{" "}
              — ZË-RO v0.1 baseline report (deterministic aperture meter + baseline-locked drift)
            </li>
            <li>
              <Link className="underline text-neutral-200" href="https://ling.auf.net/lingbuzz/009808" target="_blank" rel="noreferrer">
                LingBuzz/009808
              </Link>{" "}
              — Albanian200 morphological masking ablation
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-4">
          <div className="text-sm font-semibold text-neutral-100">Methodology</div>
          <ul className="mt-3 space-y-2 text-sm text-neutral-300">
            <li>✓ baseline-locked drift detection (MD + JSON outputs)</li>
            <li>✓ permutation tests (12k iters) for p_perm</li>
            <li>✓ cross-linguistic validation (Turkish + Albanian)</li>
            <li>✓ negative controls (pseudowords)</li>
            <li>✓ deterministic scoring (reproducible)</li>
            <li>✓ open source (AGPL-3.0)</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 text-xs text-neutral-500">
        Citation: Gora, S. (2026). ZË-RO v0.1: A Deterministic Orthography Aperture Meter with Baseline-Locked Drift Detection. LingBuzz/009799.
      </div>
    </section>
  );
}
