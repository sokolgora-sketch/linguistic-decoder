// src/ui/ledger/EvidenceLedgerCard.tsx
import * as React from "react";
import type { EvidenceLedgerModel, LedgerSection } from "./ledgerModel";

function stateLabel(section: LedgerSection, engineVersion?: string | null) {
  if (section.state === "present") return "present";
  if (section.state === "none") return "none emitted";
  // missing
  if (engineVersion) return `not available (${engineVersion})`;
  return "not available";
}

function renderSection(section: LedgerSection, engineVersion?: string | null) {
  return (
    <div key={section.key} className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{section.title}</div>
        <div className="text-xs text-muted-foreground">{stateLabel(section, engineVersion)}</div>
      </div>

      {section.state === "present" ? (
        <ul className="list-disc pl-5 text-sm">
          {section.items.map((x, i) => (
            <li key={`${section.key}-${i}`}>{x}</li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-muted-foreground">
          {section.state === "none" ? "None emitted." : "Not available in this engine version."}
        </div>
      )}

      {section.source ? (
        <div className="text-xs text-muted-foreground">source: {section.source}</div>
      ) : null}
    </div>
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Evidence / Ops Ledger</h2>
      </div>

      <div className="space-y-4">
        {model.sections.map((s) => renderSection(s, engineVersion))}
      </div>
    </div>
  );
}
