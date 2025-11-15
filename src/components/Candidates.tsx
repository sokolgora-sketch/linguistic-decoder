
'use client';
import type { LanguageFamily } from "@/shared/engineShape";
import { Card } from "@/components/ui/card";

export function Candidates({ items }: { items?: LanguageFamily[] }) {
  if (!items || items.length === 0) return null;

  // Filter out families with a confidence of 0
  const visibleFamilies = items.filter(f => (f.confidence || 0) > 0);
  if (visibleFamilies.length === 0) return null;

  // A simple way to get dialect from rationale if it exists.
  const getDialect = (rationale?: string) => {
    const match = rationale?.match(/dialect: (geg|tosk)/);
    return match?.[1];
  };

  return (
    <div className="mt-3">
      <h3 className="font-bold text-sm tracking-wide mb-2">Language Family Candidates</h3>
      <div className="space-y-2">
        {visibleFamilies.map((f, i) => {
          const dialect = getDialect(f.rationale);
          return (
            <Card key={f.familyId || i} className="p-2.5 text-sm border-primary/50">
               <div className="flex items-center gap-2">
                  <div className="min-w-[180px] font-semibold">
                    {f.label}
                    {f.label === "Albanian" && dialect && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground font-medium">
                        {dialect === "geg" ? "Gegë" : "Tosk"}
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-lg text-primary">{((f.confidence || 0) * 100).toFixed(0)}%</div>
               </div>

              {f.signals && f.signals.length > 0 && (
                <div className="text-xs opacity-80 mt-1.5 pt-1.5 border-t">
                  {f.signals.slice(0, 3).join(" · ")}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
