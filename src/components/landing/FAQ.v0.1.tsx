export function FAQV0_1() {
  const items: Array<{ q: string; a: string }> = [
    {
      q: "What is vowel-aperture grounding?",
      a: "A testable hypothesis that vowel articulation (open↔closed) correlates with semantic ordering in controlled bucket tasks. ZË-RO measures the signal deterministically.",
    },
    {
      q: "What do strong results look like?",
      a: "For a bucketed ordering task, strong monotonic ordering tends to show |ρ| near 1 with low p_perm (permutation). ZË-RO reports both Pearson r and Spearman ρ.",
    },
    {
      q: "Why do you include pseudowords?",
      a: "They are a negative control: bucket assignment has no semantic intent. The instrument should not produce strong correlations there.",
    },
    {
      q: "Do you call an LLM API?",
      a: "No. You run the model yourself. ZË-RO only scores pasted outputs and exports a PDF.",
    },
  ];

  return (
    <section className="rounded-xl border border-neutral-800 bg-neutral-950/30 p-6">
      <div className="text-lg font-semibold text-neutral-100">FAQ</div>
      <div className="mt-4 space-y-2">
        {items.map((it) => (
          <details key={it.q} className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-neutral-100">{it.q}</summary>
            <div className="mt-2 text-sm text-neutral-300">{it.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
