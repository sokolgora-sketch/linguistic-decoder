// src/ui/ledger/EvidenceLedgerCard.tsx
import React from "react";
import type { EvidenceLedgerModel, LedgerSection } from "./ledgerModel";

function renderStateLine(section: LedgerSection, engineVersion?: string | null) {
  if (section.state === "present") return null;
  if (section.state === "none") return <div className="text-sm opacity-70">None emitted.</div>;

  // missing
  return (
    <div className="text-sm opacity-70">
      Not emitted by engine (yet).
      {engineVersion ? ` (engine ${engineVersion})` : ""}
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1 font-mono text-sm">
      {items.map((x, idx) => (
        <li key={`${idx}-${x}`} className="break-words">
          • {x}
        </li>
      ))}
    </ul>
  );
}

export function EvidenceLedgerCard({
  model,
  engineVersion,
}: {
  model: EvidenceLedgerModel;
  engineVersion?: string | null;
}) {
  return (
    <section className="rounded-xl border p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-semibold">Evidence / Ops Ledger</h2>
        <div className="text-xs opacity-60">Reproducibility panel</div>
      </div>

      <div className="space-y-4">
        {model.sections.map((s) => (
          <div key={s.key}>            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold">{s.title}</h3>
              {/* keep source hidden for now; only show it later behind a Debug toggle */}
            </div>

            {renderStateLine(s, engineVersion)}

            {s.state === "present" ? <List items={s.items} /> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
