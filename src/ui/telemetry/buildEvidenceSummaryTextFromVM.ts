import type { UICandidateRow } from "@/ui/candidates/candidateModel";
import type { EvidenceLedgerModel } from "@/ui/ledger/ledgerModel";

function unwrapPOM(x: any): any {
  if (x && typeof x === "object" && (x.kind === "present" || x.kind === "missing")) {
    return x.kind === "present" ? x.value : undefined;
  }
  return x;
}

function safeText(x: any, fallback = "not_emitted"): string {
  const unwrapped = unwrapPOM(x);
  if (unwrapped == null || unwrapped === "") return fallback;
  if (Array.isArray(unwrapped)) {
    const parts = unwrapped.map((v) => safeText(v, "")).filter(Boolean);
    return parts.length ? parts.join("-") : fallback;
  }
  if (typeof unwrapped === "number") return Number.isFinite(unwrapped) ? String(unwrapped) : fallback;
  if (typeof unwrapped === "boolean") return String(unwrapped);
  if (typeof unwrapped === "string") return unwrapped.trim() || fallback;
  return fallback;
}

function sourceKindSummary(rows: UICandidateRow[] | null | undefined): string {
  if (!Array.isArray(rows) || rows.length === 0) return "not_emitted";

  const counts = new Map<string, number>();
  for (const row of rows) {
    const kind = row.sourceKind?.trim();
    if (!kind) continue;
    counts.set(kind, (counts.get(kind) ?? 0) + 1);
  }

  if (!counts.size) return "not_emitted";

  return Array.from(counts.entries())
    .map(([kind, count]) => `${kind} x${count}`)
    .join(", ");
}

function candidatePathSummary(rows: UICandidateRow[] | null | undefined): string {
  if (!Array.isArray(rows) || rows.length === 0) return "not_emitted";
  const emitted = rows.filter((row) => row.vowelPath).length;
  return `${emitted}/${rows.length}`;
}

function ledgerSummary(ledgerModel: EvidenceLedgerModel | null | undefined): string[] {
  const sections = Array.isArray(ledgerModel?.sections) ? ledgerModel.sections : [];
  if (!sections.length) return ["ledger=not_emitted"];

  return sections.map((section) => {
    const count = Array.isArray(section.items) ? section.items.length : 0;
    return `ledger.${section.key}=${section.state}; items=${count}`;
  });
}

export function buildEvidenceSummaryTextFromVM(
  vm: any,
  opts?: {
    ledgerModel?: EvidenceLedgerModel | null;
    candidateRows?: UICandidateRow[] | null;
  }
): string {
  const r = vm?.readout ?? {};
  const candidateRows = opts?.candidateRows ?? null;

  return [
    "ZË-RO Instrument Summary",
    `word=${safeText(r.word)}`,
    `normalized=${safeText(r.normalizedWord)}`,
    `mode=${safeText(r.mode)}`,
    `strictInput=${safeText(r.strictInput)}`,
    `engine=${safeText(r.engineVersion)}`,
    `voicePath=${safeText(r.voicePath)}`,
    `surfacePath=${safeText(r.voicePathSurface)}`,
    `functionalPath=${safeText(r.voicePathFunctional)}`,
    `pathDelta=${safeText(r.voicePathDelta)}`,
    `candidates=${safeText(r.counts?.candidates, "0")}`,
    `candidateSources=${sourceKindSummary(candidateRows)}`,
    `candidatePaths=${candidatePathSummary(candidateRows)}`,
    `ops=${safeText(r.counts?.ops)}`,
    `notes=${safeText(r.counts?.notes)}`,
    `signals=${safeText(r.counts?.signals)}`,
    ...ledgerSummary(opts?.ledgerModel),
    "boundary=deterministic inspection; not origin proof; no single winner",
  ].join("\n");
}
