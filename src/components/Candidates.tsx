
'use client';
import { Card } from "@/components/ui/card";

export function Candidates({ items }: { items?: any[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-3">
      <h3 className="font-bold text-sm tracking-wide mb-2">Language Families</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {items.map((f:any, i:number)=>(
          <Card key={i} className="p-2.5 text-sm border-primary/50">
            <div className="font-semibold">{f.label} <span className="opacity-60">({(f.confidence*100|0)}%)</span></div>
            {f.rationale && <div className="opacity-80 mt-1">{f.rationale}</div>}
            {Array.isArray(f.forms) && f.forms.length>0 && (
              <div className="text-xs mt-1"><b>Forms:</b> {f.forms.join(", ")}</div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
