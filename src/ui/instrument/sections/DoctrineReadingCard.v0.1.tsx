import type {
  DoctrineReadingVM,
  PresentOrMissing,
} from "@/ui/telemetry/types";

export function DoctrineReadingCard({
  doctrineReading,
}: {
  doctrineReading?: PresentOrMissing<DoctrineReadingVM | null>;
}) {
  if (!doctrineReading) return null;
  if (doctrineReading.kind === "present" && doctrineReading.value === null) {
    return null;
  }

  if (doctrineReading.kind === "missing") {
    if (doctrineReading.missing !== "malformed") return null;

    return (
      <section
        data-testid="doctrine-reading-malformed"
        className="rounded-xl border border-rose-300 bg-rose-50 p-5 dark:border-rose-400/30 dark:bg-rose-500/5"
      >
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700 dark:text-rose-200">
          Seven-Voices doctrinal reading unavailable
        </div>
        <div className="mt-2 text-sm text-rose-800 dark:text-rose-200">
          The API emitted a doctrine reading with an invalid public shape. No doctrine interpretation was rendered.
        </div>
      </section>
    );
  }

  if (doctrineReading.value === null) return null;

  const reading = doctrineReading.value;

  return (
    <section
      data-testid="doctrine-reading-card"
      className="rounded-xl border border-violet-300 bg-violet-50 p-5 dark:border-violet-400/30 dark:bg-violet-500/5"
    >
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-700 dark:text-violet-200">
        Seven-Voices doctrinal reading
      </div>

      <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Deterministic doctrine profiles for the Heart surface Voice path.
      </div>

      <div
        data-testid="doctrine-reading-path-label"
        className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-violet-700 dark:text-violet-200"
      >
        Heart surface Voice path used for doctrine:
      </div>
      <div
        data-testid="doctrine-reading-path"
        className="mt-2 rounded-lg border border-violet-200 bg-white/70 px-3 py-2 font-mono text-base font-semibold text-slate-950 dark:border-violet-400/20 dark:bg-black/20 dark:text-white"
      >
        {reading.analyzedVoicePath.join(" → ")}
      </div>

      {reading.level3WholePathReading ? (
        <div
          data-testid="doctrine-level3-reading"
          className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 dark:border-emerald-400/20 dark:bg-emerald-500/5"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-200">
            Whole-path doctrinal reading
          </div>
          <div
            data-testid="doctrine-level3-reading-text"
            className="mt-2 text-base font-semibold text-slate-950 dark:text-white"
          >
            {reading.level3WholePathReading.reading}
          </div>
          <div
            data-testid="doctrine-level3-reading-boundary"
            className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400"
          >
            Doctrine inference only; not a lexical definition, historical origin claim,
            candidate proof, or winner selection. User decides the final interpretation.
          </div>
        </div>
      ) : null}

      <ol className="mt-4 space-y-3">
        {reading.entries.map((entry) => (
          <li
            key={`${entry.pathIndex}-${entry.voice}`}
            data-testid="doctrine-reading-entry"
            data-path-index={entry.pathIndex}
            data-voice={entry.voice}
            className="rounded-lg border border-violet-200 bg-white/70 p-3 dark:border-violet-400/20 dark:bg-black/20"
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-base font-semibold text-slate-950 dark:text-white">
                {entry.voice}
              </span>
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {entry.doctrineRole}
              </span>
            </div>
            <div className="mt-2 text-sm leading-6 text-slate-800 dark:text-slate-200">
              {entry.functionalProperties.length > 0
                ? entry.functionalProperties.map((property) => property.id).join(", ")
                : "No listed functional properties."}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-4 text-xs leading-5 text-slate-600 dark:text-slate-400">
        This is not a lexical definition, historical origin claim, candidate proof, or winner selection.
        User decides the final interpretation.
      </div>
    </section>
  );
}
