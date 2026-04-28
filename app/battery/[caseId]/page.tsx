import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBatteryCaseById,
  getBracket,
} from "@/lib/battery/getBatteryCase.v0.1";
import { Badge } from "@/components/ui/badge";
import type { BatteryBracketStatsV0_1 } from "@/lib/battery/batteryStats.v0.1";

type PageProps = {
  params: Promise<{ caseId: string }>;
};

function statusBadgeClass(status: string): string {
  if (status === "support") {
    return "bg-emerald-900/30 text-emerald-200 border-emerald-900";
  }
  if (status === "mixed") {
    return "bg-amber-900/30 text-amber-200 border-amber-900";
  }
  return "bg-red-900/30 text-red-200 border-red-900";
}

function strengthBadgeClass(strength: string): string {
  if (strength === "strong") {
    return "bg-emerald-900/30 text-emerald-200 border-emerald-900";
  }
  if (strength === "moderate" || strength === "weak-moderate") {
    return "bg-amber-900/30 text-amber-200 border-amber-900";
  }
  if (strength === "strong-pressure") {
    return "bg-red-900/30 text-red-200 border-red-900";
  }
  return "bg-zinc-800 text-zinc-200 border-zinc-700";
}

function formatStatNumber(value: number | null | undefined): string {
  return typeof value === "number" && Number.isFinite(value) ? String(value) : "—";
}

function formatCi95(value: [number, number] | null | undefined): string {
  return value ? `[${value[0]}, ${value[1]}]` : "—";
}

function SeriesStatsRunCard({
  label,
  stats,
}: {
  label: string;
  stats: BatteryBracketStatsV0_1;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
      <div className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
        {label}
      </div>
      <div className="space-y-1 text-xs text-zinc-300">
        <div>
          <span className="text-zinc-500">pValue:</span>{" "}
          {formatStatNumber(stats.marginPermutation.pValue)}
        </div>
        <div>
          <span className="text-zinc-500">g low/x:</span>{" "}
          {formatStatNumber(stats.effectSizes.hedgesGLowX)}
        </div>
        <div>
          <span className="text-zinc-500">g x/high:</span>{" "}
          {formatStatNumber(stats.effectSizes.hedgesGXHigh)}
        </div>
        <div>
          <span className="text-zinc-500">CI norm:</span>{" "}
          {formatCi95(stats.bootstrap.ci95NormalizedPosition)}
        </div>
        <div className="break-all pt-1 text-zinc-500">
          {stats.notes ?? "—"}
        </div>
      </div>
    </div>
  );
}

export default async function BatteryCasePage({ params }: PageProps) {
  const { caseId } = await params;
  const batteryCase = getBatteryCaseById(caseId);

  if (!batteryCase) {
    notFound();
  }

  const intended = getBracket(batteryCase.intendedBracketId);
  const control = getBracket(batteryCase.controlBracketId);

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-zinc-100">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            href="/battery"
            className="text-sm text-zinc-400 underline underline-offset-4 hover:text-zinc-200"
          >
            ← Back to battery index
          </Link>
          <Link
            href="/evals"
            className="text-sm text-zinc-400 underline underline-offset-4 hover:text-zinc-200"
          >
            ← Back to Evals workbench
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6">
          <div className="mb-6">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              {batteryCase.section}
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              {batteryCase.displayName}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={statusBadgeClass(batteryCase.scientificStatus)}
              >
                {batteryCase.scientificStatus}
              </Badge>
              <Badge
                variant="outline"
                className={strengthBadgeClass(batteryCase.strength)}
              >
                {batteryCase.strength}
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                Identity
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div><span className="text-zinc-400">caseId:</span> {batteryCase.caseId}</div>
                <div><span className="text-zinc-400">language:</span> {batteryCase.languageHint}</div>
                <div><span className="text-zinc-400">family:</span> {batteryCase.family}</div>
                <div><span className="text-zinc-400">vowel:</span> {batteryCase.vowelUnderTest}</div>
                <div><span className="text-zinc-400">series:</span> {batteryCase.seriesLabel}</div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                Brackets
              </div>
              <div className="mt-3 space-y-3 text-sm">
                <div>
                  <div className="text-zinc-400">intended</div>
                  <div>
                    {batteryCase.intendedBracketId} · {intended.low} → {intended.high}
                  </div>
                  <div className="text-xs text-zinc-500">{intended.note ?? "—"}</div>
                </div>
                <div>
                  <div className="text-zinc-400">control</div>
                  <div>
                    {batteryCase.controlBracketId} · {control.low} → {control.high}
                  </div>
                  <div className="text-xs text-zinc-500">{control.note ?? "—"}</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                Outcomes
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div><span className="text-zinc-400">main pair:</span> {batteryCase.mainPairOutcome}</div>
                <div><span className="text-zinc-400">control pair:</span> {batteryCase.controlPairOutcome}</div>
                <div><span className="text-zinc-400">ordinals:</span> {batteryCase.ordinalsConfirmed.join(", ")}</div>
                <div><span className="text-zinc-400">structural:</span> {batteryCase.structuralStatus}</div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                Evidence
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="text-zinc-400">archive filename</div>
                <code className="block whitespace-pre-wrap break-all rounded bg-zinc-950 px-3 py-2 text-xs text-zinc-300">
                  {batteryCase.evidenceZipFilename}
                </code>
              </div>
            </div>
          </div>

          {batteryCase.mainPairStats || batteryCase.controlPairStats ? (
            <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                Optional stats
              </div>
              <div className="mt-3 grid gap-4 text-sm md:grid-cols-2">
                <div>
                  <div className="mb-2 text-zinc-400">main pair</div>
                  <div className="space-y-1 text-zinc-300">
                    <div><span className="text-zinc-500">positionMean:</span> {batteryCase.mainPairStats?.positionMean ?? "—"}</div>
                    <div><span className="text-zinc-500">effectSize:</span> {batteryCase.mainPairStats?.effectSize ?? "—"}</div>
                    <div><span className="text-zinc-500">ci95:</span> {batteryCase.mainPairStats?.ci95 ? batteryCase.mainPairStats.ci95.join(" to ") : "—"}</div>
                    <div><span className="text-zinc-500">pValue:</span> {batteryCase.mainPairStats?.pValue ?? "—"}</div>
                    <div><span className="text-zinc-500">notes:</span> {batteryCase.mainPairStats?.notes ?? "—"}</div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-zinc-400">control pair</div>
                  <div className="space-y-1 text-zinc-300">
                    <div><span className="text-zinc-500">positionMean:</span> {batteryCase.controlPairStats?.positionMean ?? "—"}</div>
                    <div><span className="text-zinc-500">effectSize:</span> {batteryCase.controlPairStats?.effectSize ?? "—"}</div>
                    <div><span className="text-zinc-500">ci95:</span> {batteryCase.controlPairStats?.ci95 ? batteryCase.controlPairStats.ci95.join(" to ") : "—"}</div>
                    <div><span className="text-zinc-500">pValue:</span> {batteryCase.controlPairStats?.pValue ?? "—"}</div>
                    <div><span className="text-zinc-500">notes:</span> {batteryCase.controlPairStats?.notes ?? "—"}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {batteryCase.seriesStats ? (
            <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                    Evidence stats
                  </div>
                  <div className="mt-2 text-sm text-zinc-300">
                    Four-run stats imported from inspected evidence-pack artifacts.
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-zinc-700 bg-zinc-950 text-zinc-300"
                >
                  {batteryCase.seriesStats.source}
                </Badge>
              </div>

              <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <div><span className="text-zinc-500">series:</span> {batteryCase.seriesStats.seriesLabel}</div>
                <div><span className="text-zinc-500">manifest:</span> {batteryCase.seriesStats.inspectedManifestPath ?? "—"}</div>
                <div className="md:col-span-2">
                  <span className="text-zinc-500">stats ZIP:</span>{" "}
                  <code className="break-all text-xs text-zinc-300">
                    {batteryCase.seriesStats.evidenceZipFilename}
                  </code>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <SeriesStatsRunCard
                  label={`intended main · ${batteryCase.seriesStats.intended.bracketId}`}
                  stats={batteryCase.seriesStats.intended.main}
                />
                <SeriesStatsRunCard
                  label={`intended alt · ${batteryCase.seriesStats.intended.bracketId}`}
                  stats={batteryCase.seriesStats.intended.alt}
                />
                <SeriesStatsRunCard
                  label={`control main · ${batteryCase.seriesStats.control.bracketId}`}
                  stats={batteryCase.seriesStats.control.main}
                />
                <SeriesStatsRunCard
                  label={`control alt · ${batteryCase.seriesStats.control.bracketId}`}
                  stats={batteryCase.seriesStats.control.alt}
                />
              </div>

              {batteryCase.seriesStats.notes ? (
                <p className="mt-4 text-xs leading-5 text-zinc-500">
                  {batteryCase.seriesStats.notes}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Interpretation
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              {batteryCase.shortInterpretation}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
