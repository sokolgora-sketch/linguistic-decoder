import {
  getAllBatteryCases,
  getBracket,
} from "@/lib/battery/getBatteryCase.v0.1";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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

export function BatteryIndexTableV0_1() {
  const cases = getAllBatteryCases();

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-zinc-100">Battery index</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Canonical registry view for paper-aligned battery cases, brackets, and evidence labels.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-zinc-400">
              <th className="px-3 py-2 font-medium">Case</th>
              <th className="px-3 py-2 font-medium">Section</th>
              <th className="px-3 py-2 font-medium">Intended</th>
              <th className="px-3 py-2 font-medium">Control</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Strength</th>
              <th className="px-3 py-2 font-medium">Interpretation</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((batteryCase) => {
              const intended = getBracket(batteryCase.intendedBracketId);
              const control = getBracket(batteryCase.controlBracketId);

              return (
                <tr
                  key={batteryCase.caseId}
                  className="border-b border-zinc-900 align-top text-zinc-200"
                >
                  <td className="px-3 py-3">
                    <Link href={`/battery/${batteryCase.caseId}`} className="font-medium underline underline-offset-4 hover:text-white">{batteryCase.displayName}</Link>
                    <div className="mt-1 text-xs text-zinc-500">
                      {batteryCase.seriesLabel}
                    </div>
                  </td>
                  <td className="px-3 py-3 capitalize">{batteryCase.section}</td>
                  <td className="px-3 py-3">
                    <div>{batteryCase.intendedBracketId}</div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {intended.low} → {intended.high}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div>{batteryCase.controlBracketId}</div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {control.low} → {control.high}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Badge
                      variant="outline"
                      className={statusBadgeClass(batteryCase.scientificStatus)}
                    >
                      {batteryCase.scientificStatus}
                    </Badge>
                  </td>
                  <td className="px-3 py-3">
                    <Badge
                      variant="outline"
                      className={strengthBadgeClass(batteryCase.strength)}
                    >
                      {batteryCase.strength}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-zinc-300">
                    {batteryCase.shortInterpretation}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BatteryIndexTableV0_1;
