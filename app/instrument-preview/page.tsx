import Link from "next/link";

export const metadata = {
  title: "Instrument Preview | ZË-RO",
  description:
    "Preview of the upcoming ZË-RO Instrument: deterministic word analysis, evidence-first readouts, and structured candidate inspection.",
};

type WorkflowStep = {
  title: string;
  body: string;
  planned?: boolean;
};

type PreviewCard = {
  title: string;
  caption: string;
};

const workflowSteps: WorkflowStep[] = [
  {
    title: "New Analysis",
    body: "Start a fresh word inspection with a clean input state and a deterministic analysis path.",
  },
  {
    title: "Open Analysis",
    body: "Return to a previously saved analysis bundle to review the same structured output again.",
  },
  {
    title: "Save Analysis",
    body: "Store the current inspected result so it can be reopened, compared, or exported later.",
  },
  {
    title: "Export JSON",
    body: "Export the structured analysis payload directly when public export is ready.",
    planned: true,
  },
];

const previewCards: PreviewCard[] = [
  {
    title: "Readout panel preview",
    caption:
      "Word, normalized form, mode, and voice path shown as a deterministic top-line readout.",
  },
  {
    title: "Evidence + candidates preview",
    caption:
      "Evidence ledger, candidate families, and rejection visibility presented as inspectable telemetry.",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[#111111] text-white">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-14 sm:px-8 lg:px-10">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center rounded-full border border-[#686868] bg-[#232323] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-neutral-300">
              ZË-RO Preview
            </div>
            <div className="inline-flex items-center rounded-full border border-[#454545] bg-[#171717] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[#bcbcbc]">
              Preview only · not live yet
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Instrument Preview
            </h1>

            <p className="max-w-3xl text-base leading-7 text-neutral-300 sm:text-[17px]">
              The ZË-RO Instrument is the next public surface after Evals. It is a
              read-first analysis interface for inspecting a word through the
              Seven-Voices system with deterministic, evidence-first structure.
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <section className="rounded-md border border-[#686868] bg-[#232323] p-5">
            <h2 className="mb-3 text-lg font-semibold">Why this exists</h2>
            <p className="text-sm leading-7 text-neutral-200">
              ZË-RO needs a serious analysis surface where a user can inspect one
              word at a time without hidden ranking, fuzzy summaries, or fake
              certainty. The Instrument exists to make structure, evidence, and
              uncertainty visible in a form that can be reviewed and discussed.
            </p>
          </section>

          <section className="rounded-md border border-[#686868] bg-[#181818] p-5">
            <h2 className="mb-3 text-lg font-semibold">Current public status</h2>
            <p className="text-sm leading-7 text-neutral-300">
              This page is a preview only. The Instrument is not live in the public
              beta yet. During the Evals beta, it stays closed so the current
              public surface remains stable and testable.
            </p>
          </section>
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md border border-[#686868] bg-[#181818] p-5">
            <h2 className="mb-3 text-lg font-semibold">What it is</h2>
            <ul className="space-y-2 text-sm leading-7 text-neutral-300">
              <li>• A deterministic word-analysis instrument</li>
              <li>• Evidence-first, not a black-box oracle</li>
              <li>• Built to inspect structure, candidates, and voice paths</li>
              <li>• Designed as a scientific instrument, not a toy demo</li>
            </ul>
          </div>

          <div className="rounded-md border border-[#686868] bg-[#181818] p-5">
            <h2 className="mb-3 text-lg font-semibold">What it will show</h2>
            <ul className="space-y-2 text-sm leading-7 text-neutral-300">
              <li>• Word input and normalized surface form</li>
              <li>• Seven-Voices path and structural readout</li>
              <li>• Candidate families and functional decomposition</li>
              <li>• Evidence, notes, and deterministic exportable output</li>
            </ul>
          </div>
        </section>

        <section className="rounded-md border border-[#686868] bg-[#181818] p-5">
          <div className="mb-4 space-y-1">
            <h2 className="text-lg font-semibold">Planned workflow</h2>
            <p className="text-sm leading-7 text-neutral-400">
              This is the intended working shape of the Instrument once the public
              analysis flow is opened.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {workflowSteps.map((step) => (
              <div
                key={step.title}
                className="rounded-md border border-[#4a4a4a] bg-[#151515] p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-neutral-200">
                    {step.title}
                  </div>
                  {step.planned ? (
                    <span className="rounded-full border border-[#5a5a5a] bg-[#1d1d1d] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                      later
                    </span>
                  ) : null}
                </div>

                <p className="text-sm leading-6 text-neutral-400">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-[#686868] bg-[#181818] p-5">
          <h2 className="mb-3 text-lg font-semibold">What is not live yet</h2>
          <ul className="space-y-2 text-sm leading-7 text-neutral-300">
            <li>• Public interactive analysis flow</li>
            <li>• Full user-facing Pattern Map surface</li>
            <li>• Broader word-library browsing</li>
            <li>• Full public engine workflow</li>
          </ul>
        </section>

        <section className="rounded-md border border-[#686868] bg-[#181818] p-5">
          <div className="mb-4 space-y-1">
            <h2 className="text-lg font-semibold">Preview layouts</h2>
            <p className="text-sm leading-7 text-neutral-400">
              Add real screenshots here later. Until then, these panels explain the
              kind of instrument surface users should expect.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {previewCards.map((card) => (
              <div
                key={card.title}
                className="rounded-md border border-dashed border-[#5a5a5a] bg-[#151515] p-4"
              >
                <div className="mb-3 rounded-md border border-[#2f2f2f] bg-[#101010] px-4 py-10 text-center text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                  Screenshot area
                </div>
                <h3 className="mb-2 text-base font-semibold text-neutral-100">
                  {card.title}
                </h3>
                <p className="text-sm leading-6 text-neutral-400">
                  {card.caption}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-[#d93333] bg-[#d93333] px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-white transition hover:border-[#ef4444] hover:bg-[#ef4444]"
          >
            Back to Landing
          </Link>

          <Link
            href="/evals"
            className="inline-flex items-center rounded-full border border-[#5c5c5c] bg-transparent px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-[#f5f5f5] transition hover:border-[#d93333] hover:bg-[#1d1d1d]"
          >
            Open Evals Beta
          </Link>
        </div>
      </section>
    </main>
  );
}
