
'use client';
import type { LanguageFamilyCandidate, MorphologyMatrix, OriginAxisStatus } from '../shared/engineShape';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';

const axisLabel = (status: OriginAxisStatus | undefined) => {
  switch (status) {
    case 'pass':
      return '✅';
    case 'weak':
      return '⚠️';
    case 'unknown':
    default:
      return '❓';
  }
};

function MorphologyMatrixBlock({ matrix }: { matrix: MorphologyMatrix }) {
  return (
    <div className="mt-4 rounded-xl border border-slate-600/80 bg-slate-900/60 px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-wide mb-1">
        Morphology Matrix
      </div>
      <div className="text-sm mb-2">
        <span className="font-mono font-semibold">{matrix.pivot}</span>{' '}
        <span className="text-muted-foreground">— {matrix.meaning}</span>
      </div>

      <div className="text-xs mb-2">
        <div className="font-semibold mb-1">Morphemes</div>
        <ul className="list-disc list-inside space-y-0.5">
          {matrix.morphemes.map((m, idx) => (
            <li key={idx}>
              <span className="font-mono">{m.form}</span>{' '}
              <span className="text-muted-foreground">
                ({m.role}){m.gloss ? ` — ${m.gloss}` : ''}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-xs">
        <div className="font-semibold mb-1">Word sums</div>
        <ul className="list-disc list-inside space-y-0.5">
          {matrix.wordSums.map((w, idx) => (
            <li key={idx}>
              {w.parts.map((p, i) => (
                <span key={i} className="font-mono">
                  {i > 0 && ' + '}
                  {p}
                </span>
              ))}{' '}
              <span>{' → '}</span>
              <span className="font-mono font-semibold">{w.result}</span>
              {w.gloss && (
                <span className="text-muted-foreground">{` — ${w.gloss}`}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


export function Candidates({ items }: { items?: LanguageFamilyCandidate[] }) {
  if (!items || items.length === 0) return null;

  // Check if the first candidate is the primary one
  const primaryCandidateForm = items[0]?.form;

  return (
    <div className="mt-3">
      <h3 className="font-bold text-sm tracking-wide mb-2">Language Family Candidates</h3>
      <div className="space-y-3">
        {items.map((c, i) => {
          const isPrimary = c.form === primaryCandidateForm;

          return (
            <Card key={`${c.language}-${c.form}-${i}`} className={cn(
              "rounded-2xl border px-4 py-3 text-sm",
              isPrimary ? "bg-slate-900/60 border-slate-600" : "bg-slate-900/20 border-slate-700/60"
            )}>
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold">
                  {c.language?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  {(c as any).dialect && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent-foreground font-medium">
                      {(c as any).dialect === "geg" ? "Gegë" : "Tosk"}
                    </span>
                  )}
                </div>
                {c.form && <div className="font-code text-primary/80">{c.form}</div>}
              </div>

              {c.gloss && (
                 <p className="text-xs opacity-80 mt-1.5 pt-1.5 border-t">{c.gloss}</p>
              )}

              {c.morphologyMatrix && (
                <MorphologyMatrixBlock matrix={c.morphologyMatrix} />
              )}

              <div className="mt-2 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                      ${c.passes ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                      {c.passes ? 'Pass' : 'Weak'}
                  </span>
                  {c.speculative && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200`}>
                          Speculative
                      </span>
                  )}
                  {c.experimental && (
                    <Badge variant="outline" className="ml-2">
                      Experimental
                    </Badge>
                  )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
