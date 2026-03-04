import Link from "next/link";
import { LANDING_BASELINES_V0_1 } from "@/shared/landing/landingBaselines.v0.1";

export function HowItWorksV0_1() {
  const specId = "public-grounding-probe.v0.1";
  const exampleRun = LANDING_BASELINES_V0_1.turkish_step20.id;

  return (
    <section className="rounded-xl border border-neutral-800 bg-neutral-950/30 p-6">
      <div className="text-lg font-semibold text-neutral-100">How it works</div>
      <div className="mt-1 text-sm text-neutral-400">
        3 steps. No API keys. Deterministic scoring. PDF export.
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-4">
          <div className="text-sm font-semibold text-neutral-100">1) Get the prompt</div>
          <div className="mt-2 text-sm text-neutral-300">
            Open <Link className="underline text-neutral-200" href="/evals">/evals</Link> and copy the BYO task prompt.
          </div>
          <div className="mt-3 text-xs font-mono text-neutral-500">specId: {specId}</div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-4">
          <div className="text-sm font-semibold text-neutral-100">2) Run your model</div>
          <div className="mt-2 text-sm text-neutral-300">
            Paste the prompt into GPT / Claude / Gemini / Grok. The model returns bucketed tokens.
          </div>
          <div className="mt-3 text-xs font-mono text-neutral-500">inputShape: bucketed_single_tokens</div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-4">
          <div className="text-sm font-semibold text-neutral-100">3) Score + export</div>
          <div className="mt-2 text-sm text-neutral-300">
            Paste the JSON back into ZË-RO → Score → Download PDF report.
          </div>
          <div className="mt-3 text-xs font-mono text-neutral-500">baseline id: {exampleRun}</div>
        </div>
      </div>
    </section>
  );
}
