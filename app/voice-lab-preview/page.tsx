import Link from "next/link";

export const metadata = {
  title: "Voice Lab Preview | ZË-RO",
  description:
    "Preview of the upcoming ZË-RO Voice Lab: acoustic readouts, aperture-oriented voice inspection, and future recording workflows.",
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
    title: "New Session",
    body: "Start a fresh voice session with a clean recording or upload state for structured inspection.",
  },
  {
    title: "Open Session",
    body: "Return to a previously saved session and review the same measurements again.",
  },
  {
    title: "Save Session",
    body: "Store the current session so it can be reopened, compared, or documented later.",
  },
  {
    title: "Export Session JSON",
    body: "Export the structured session payload directly once the public export path is opened.",
    planned: true,
  },
];

const previewCards: PreviewCard[] = [
  {
    title: "Waveform + spectrogram preview",
    caption:
      "Primary acoustic panels showing speech as visible structure rather than opaque audio playback alone.",
  },
  {
    title: "Measurement panel preview",
    caption:
      "Aperture-oriented measurements, timing, stability, and phonetic-shape readouts displayed as inspectable evidence.",
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
              Voice Lab Preview
            </h1>
          </div>
        </div>

        <section className="rounded-md border border-[#686868] bg-[#181818] p-5">
          <h2 className="mb-3 text-lg font-semibold">What Voice Lab is</h2>
          <p className="text-sm leading-7 text-neutral-300">
            Voice Lab is ZË-RO’s future acoustic measurement and evaluation surface.
            It is being designed to inspect recorded or live voice input through
            structured measurements tied to aperture, duration, stability, and
            phonetic shape.
          </p>
          <p className="mt-4 text-sm leading-7 text-neutral-300">
            This is not intended to be a vague “audio AI” feature. It is intended
            to be a measurement-first instrument layer, where voice can be
            inspected as evidence.
          </p>
        </section>

        <section className="rounded-md border border-[#686868] bg-[#232323] p-5">
          <h2 className="mb-3 text-lg font-semibold">Why this exists</h2>
          <p className="text-sm leading-7 text-neutral-200">
            ZË-RO should eventually treat the acoustic side of speech with the same
            seriousness used for structured text analysis. Voice Lab exists so
            speech can be reviewed through visible, measurable structure rather
            than treated like opaque media.
          </p>
          <p className="mt-4 text-sm leading-7 text-neutral-200">
            The goal is to make voice input inspectable, testable, and exportable.
          </p>
        </section>

        <section className="rounded-md border border-[#686868] bg-[#181818] p-5">
          <h2 className="mb-3 text-lg font-semibold">Current public status</h2>
          <p className="text-sm leading-7 text-neutral-300">
            This page is a preview only. Voice Lab is not live in the public beta
            yet.
          </p>
          <p className="mt-4 text-sm leading-7 text-neutral-300">
            During the current Evals beta, it remains closed so the public surface
            stays stable, easier to validate, and easier to evolve without mixing
            unfinished acoustic workflows into the main beta path.
          </p>
        </section>

        <section className="rounded-md border border-[#686868] bg-[#181818] p-5">
          <h2 className="mb-3 text-lg font-semibold">
            What it will eventually do
          </h2>
          <ul className="space-y-2 text-sm leading-7 text-neutral-300">
            <li>• Accept live microphone input or uploaded voice material</li>
            <li>• Display structured acoustic readouts rather than vague playback alone</li>
            <li>• Surface measurements tied to aperture, duration, stability, and phonetic shape</li>
            <li>• Support evidence-oriented export for later inspection, comparison, or reporting</li>
            <li>• Fit into the wider ZË-RO instrument family as the acoustic side of structured analysis</li>
          </ul>
        </section>

        <section className="rounded-md border border-[#686868] bg-[#181818] p-5">
          <div className="mb-4 space-y-1">
            <h2 className="text-lg font-semibold">Planned workflow</h2>
            <p className="text-sm leading-7 text-neutral-400">
              This is the intended working shape once the public Voice Lab flow is
              opened.
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
          <h2 className="mb-3 text-lg font-semibold">Future validation surface</h2>
          <p className="text-sm leading-7 text-neutral-300">
            Voice Lab is also intended to have its own evals-style validation
            surface.
          </p>
          <p className="mt-4 text-sm leading-7 text-neutral-300">
            That future surface is expected to support controlled testing of
            acoustic behavior, structured comparison of outputs, and evaluation
            workflows for voice-conditioned generation paths, including future
            voice-to-image experiments.
          </p>
          <p className="mt-4 text-sm leading-7 text-neutral-300">
            This validation layer is not live yet.
          </p>
        </section>

        <section className="rounded-md border border-[#686868] bg-[#181818] p-5">
          <h2 className="mb-3 text-lg font-semibold">What is not live yet</h2>
          <ul className="space-y-2 text-sm leading-7 text-neutral-300">
            <li>• Public recording workflow</li>
            <li>• Microphone permissions and browser input pipeline</li>
            <li>• Final acoustic scoring and comparison surface</li>
            <li>• Saved session/project workflow</li>
            <li>• Public export/report workflow</li>
            <li>• Dedicated Voice Lab evals / validation interface</li>
            <li>• Future voice-to-image testing surface</li>
          </ul>
        </section>

        <section className="rounded-md border border-[#686868] bg-[#181818] p-5">
          <div className="mb-4 space-y-1">
            <h2 className="text-lg font-semibold">Preview layouts</h2>
            <p className="text-sm leading-7 text-neutral-400">
              Real screenshots can be added here later. Until then, these panels
              indicate the kind of Voice Lab surface users should expect.
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
