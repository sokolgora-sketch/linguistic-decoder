"use client";

const DOES_ITEMS = [
  "Shows deterministic engine output for one word.",
  "Surfaces vowel path, candidates, provenance, and evidence signals.",
  "Frames RootMap readings as hypotheses for inspection.",
];

const DOES_NOT_ITEMS = [
  "Prove a historical origin.",
  "Treat candidate readings as facts.",
  "Collapse the readout into one answer.",
];

function BoundaryList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5 text-sm text-neutral-300">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-500" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ToolBoundaryCard() {
  return (
    <section className="rounded-xl border p-4">
      <div className="text-sm font-semibold">Tool boundaries</div>
      <div className="mt-1 text-xs text-muted-foreground">
        This panel keeps the Open Instrument readout conservative.
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
            What this tool does
          </div>
          <BoundaryList items={DOES_ITEMS} />
        </div>

        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
            What this tool does not do
          </div>
          <BoundaryList items={DOES_NOT_ITEMS} />
        </div>
      </div>
    </section>
  );
}
