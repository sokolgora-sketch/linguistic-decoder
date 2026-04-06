import Link from "next/link";

const metricCards = [
  {
    title: "Pearson r",
    body:
      "How strongly the scores follow a straight downward or upward trend across the bucket order. In this workbench, more negative usually means better alignment with the expected aperture slope.",
  },
  {
    title: "Spearman ρ",
    body:
      "How strongly the bucket order stays monotonic. This is the main consistency signal on the page. Strongly negative means the ordering matches the expected V1→V7 direction well.",
  },
  {
    title: "p_perm",
    body:
      "Permutation significance check. Lower values mean the observed ordering is less likely to appear by chance. Use it as a caution signal, not as a magical truth stamp.",
  },
  {
    title: "Compliance",
    body:
      "How many expected tokens or rows were accepted as valid by the scorer. This tells you whether the run was structurally usable before you over-read the score.",
  },
] as const;

const workflowSteps = [
  {
    title: "1. Paste or upload",
    body:
      "Bring model outputs into the workbench. ZË-RO does not generate model outputs on this page.",
  },
  {
    title: "2. Score",
    body:
      "Run the deterministic scorer. The page computes the signal from the JSON you supplied.",
  },
  {
    title: "3. Inspect",
    body:
      "Read the summary metrics, diagnosis, bucket trend, and any series health warnings before exporting.",
  },
  {
    title: "4. Export",
    body:
      "Save the run, export JSON/CSV/PDF/bundle, or add the run to a series for battery work.",
  },
] as const;

const commonMistakes = [
  "Pasting prompts instead of model outputs.",
  "Using buckets-only JSON while assuming task provenance will be inferred automatically.",
  "Treating reference snapshots as live scoring results.",
  "Reading a single metric alone without checking compliance and the chart.",
  "Filling sourceEngine* for hand-pasted or external outputs when no upstream ZË-RO engine produced the JSON.",
] as const;

export default function EvalsHelpPage() {
  return (
    <main className="min-h-screen bg-[#0b0d10] text-[#f5f7fb]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-8 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[#2f3742] bg-[#13171d] px-5 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.24)]">
          <div className="space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d7dde7]">
              evals · help
            </div>
            <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#f5f7fb]">
              ZË-RO Evals Help
            </h1>
            <p className="max-w-[840px] text-[14px] leading-7 text-[#bac3d2]">
              This page explains what the Evals workbench is, what it accepts, how
              to use it, what the core metrics mean, and how reference material is
              separated from live scoring.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/evals"
              className="inline-flex items-center rounded-[8px] border border-[#355a7a] bg-[#101a24] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9fd3ff] transition hover:border-[#4d7fa8] hover:bg-[#132031] hover:text-[#d7eeff]"
            >
              ← Back to Evals
            </Link>
            <Link
              href="/evals/reference"
              className="inline-flex items-center rounded-[8px] border border-[#5a2424] bg-[#1f1010] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#fca5a5] transition hover:border-[#7a3434] hover:bg-[#281414] hover:text-[#ffd0d0]"
            >
              Reference page →
            </Link>
          </div>
        </div>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[14px] border border-[#2f3742] bg-[#13171d] px-5 py-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#e6edf7]">
              What Evals is
            </div>
            <div className="mt-3 space-y-3 text-[14px] leading-7 text-[#bac3d2]">
              <p>
                ZË-RO Evals is a deterministic scoring workbench. You bring model
                outputs from somewhere else; this page scores them.
              </p>
              <p>
                It is not a chat surface and it does not call models for you from
                the workbench. The point is to inspect scoring behavior, compare
                runs, and export evidence cleanly.
              </p>
            </div>
          </div>

          <div className="rounded-[14px] border border-[#4a3a1b] bg-[#17130d] px-5 py-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#f3d38b]">
              Reference is separate
            </div>
            <div className="mt-3 space-y-3 text-[14px] leading-7 text-[#d7cfbb]">
              <p>
                <span className="font-semibold text-[#fff1c2]">/evals</span> is the
                live workbench.
              </p>
              <p>
                <span className="font-semibold text-[#fff1c2]">
                  /evals/reference
                </span>{" "}
                is for paper snapshots and reference-only comparison.
              </p>
              <p>
                Do not confuse reference snapshots with the result you just scored
                in the live workbench.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[14px] border border-[#2f3742] bg-[#13171d] px-5 py-4">
          <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#e6edf7]">
            Accepted input
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-[12px] border border-[#303845] bg-[#171c23] px-4 py-3">
              <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#d7deea]">
                Full run bundle
              </div>
              <p className="mt-2 text-[14px] leading-7 text-[#bac3d2]">
                Use a full <span className="font-mono text-[#f5f7fb]">evalRun.v0.1</span>{" "}
                JSON bundle when you already have a complete run package.
              </p>
              <pre className="mt-3 overflow-x-auto rounded-[8px] border border-[#26303a] bg-[#101418] p-3 text-[12px] leading-6 text-[#d7e1ec]">
{`{
  "evalRunVersion": "evalRun.v0.1",
  "...": "..."
}`}
              </pre>
            </div>

            <div className="rounded-[12px] border border-[#303845] bg-[#171c23] px-4 py-3">
              <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#d7deea]">
                Buckets-only JSON
              </div>
              <p className="mt-2 text-[14px] leading-7 text-[#bac3d2]">
                Use raw bucket JSON when you only have V1..V7 outputs and want the
                workbench to wrap them into a run using the selected task.
              </p>
              <pre className="mt-3 overflow-x-auto rounded-[8px] border border-[#26303a] bg-[#101418] p-3 text-[12px] leading-6 text-[#d7e1ec]">
{`{
  "V1": ["token1"],
  "V2": ["token2"],
  "...": []
}`}
              </pre>
            </div>
          </div>
        </section>

        <section className="rounded-[14px] border border-[#2f3742] bg-[#13171d] px-5 py-4">
          <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#e6edf7]">
            Workflow
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {workflowSteps.map((step) => (
              <div
                key={step.title}
                className="rounded-[12px] border border-[#303845] bg-[#171c23] px-4 py-3"
              >
                <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#d7deea]">
                  {step.title}
                </div>
                <p className="mt-2 text-[14px] leading-7 text-[#bac3d2]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[14px] border border-[#2f3742] bg-[#13171d] px-5 py-4">
          <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#e6edf7]">
            Metric glossary
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {metricCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[12px] border border-[#303845] bg-[#171c23] px-4 py-3"
              >
                <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#d7deea]">
                  {card.title}
                </div>
                <p className="mt-2 text-[14px] leading-7 text-[#bac3d2]">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[14px] border border-[#2f3742] bg-[#13171d] px-5 py-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#e6edf7]">
              Exports
            </div>
            <div className="mt-3 space-y-3 text-[14px] leading-7 text-[#bac3d2]">
              <p>
                Use exports after the run looks valid. JSON and CSV are useful for
                battery organization; PDF and bundle exports are useful for report
                snapshots and review.
              </p>
              <p>
                For repeated battery work, keep naming stable and do not mix live
                scoring screenshots with reference-page screenshots.
              </p>
            </div>
          </div>

          <div className="rounded-[14px] border border-[#2f3742] bg-[#13171d] px-5 py-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#e6edf7]">
              Common mistakes
            </div>
            <ul className="mt-3 space-y-2 text-[14px] leading-7 text-[#bac3d2]">
              {commonMistakes.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-[10px] h-[6px] w-[6px] shrink-0 rounded-full bg-[#f3d38b]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
