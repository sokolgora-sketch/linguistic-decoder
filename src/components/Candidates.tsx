
'use client';
import { Card } from "@/components/ui/card";

type Fam = {
  family: string;
  score: number;
  notes?: string[];
  dialect?: "geg" | "tosk";
  familyId?: string; // Allow for older shape
  label?: string; // Allow for older shape
};

export function Candidates({ items }: { items?: Fam[] }) {
  if (!items || items.length === 0) return null;

  // Filter out families with a score of 0
  const visibleFamilies = items.filter(f => (f.score || 0) > 0);
  if (visibleFamilies.length === 0) return null;

  return (
    <div className="mt-3">
      <h3 className="font-bold text-sm tracking-wide mb-2">Language Family Candidates</h3>
      <div className="space-y-2">
        {visibleFamilies.map((f, i) => (
          <Card key={i} className="p-2.5 text-sm border-primary/50">
             <div className="flex items-center gap-2">
                <div className="min-w-[180px] font-semibold">
                  {f.family || f.label}
                  {f.family === "Albanian" && f.dialect && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground font-medium">
                      {f.dialect === "geg" ? "Gegë" : "Tosk"}
                    </span>
                  )}
                </div>
                <div className="font-bold text-lg text-primary">{(f.score * 100).toFixed(0)}%</div>
             </div>

            {f.notes && f.notes.length > 0 && (
              <div className="text-xs opacity-80 mt-1.5 pt-1.5 border-t">
                {f.notes.slice(0, 3).join(" · ")}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
