'use client';
import type { Candidate, MorphologyMatrix, OriginAxisStatus } from '../shared/engineShape';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

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

function MorphologyMatrixBlock({
  matrix,
}: {
  matrix?: any | null; // keep it loose for now, engine already enforces shape
}) {
  // Safely get morphemes – handle missing matrix or morphemes
  const morphemes = matrix?.morphemes ?? [];

  // If there is no real data, don't render the block at all
  if (morphemes.length === 0) {
    return null;
  }

  const source = matrix?.source;
  const pivot = matrix?.pivot;

  return (
    <div className="mt-4 space-y-1">
      <div className="font-semibold mb-1">Morphemes</div>
      <ul className="list-disc list-inside space-y-0.5">
        {morphemes.map((m: any, idx: number) => (
          <li key={idx}>
            <span className="font-mono">{m.form}</span>{' '}
            {m.gloss && (
              <span className="text-muted-foreground">{m.gloss}</span>
            )}
          </li>
        ))}
      </ul>

      {(source || pivot) && (
        <p className="text-xs text-muted-foreground mt-1">
          {source && <span>Source: {source}</span>}
          {source && pivot && <span> · </span>}
          {pivot && <span>Pivot: {pivot}</span>}
        </p>
      )}
    </div>
  );
}


export function Candidates({ candidates }: { candidates?: Candidate[] }) {
  if (!candidates || candidates.length === 0) {
    return (
      <div className="mt-3">
        <h3 className="font-bold text-sm tracking-wide mb-2">Language Family Candidates</h3>
        <p className="text-xs text-muted-foreground">No canonical candidates found for this word.</p>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <h3 className="font-bold text-sm tracking-wide mb-2">Language Family Candidates</h3>
      <div className="space-y-3">
        {candidates.map((c, i) => {
          const functionalStatement = c.decomposition?.functionalStatement;
          return (
            <Card key={`${c.language}-${c.form}-${i}`} className="rounded-2xl bg-slate-900/60 border-slate-600 px-4 py-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="font-semibold flex-1 min-w-0">
                  {c.language?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  {c.family && c.family !== c.language && (
                    <span className="ml-2 text-xs font-medium text-muted-foreground">({c.family})</span>
                  )}
                  {c.confidenceTag === 'speculative' && (
                    <Badge variant="outline" className="ml-2">Speculative</Badge>
                  )}
                  {c.status === 'experimental' && (
                    <Badge variant="outline" className="ml-2">Experimental</Badge>
                  )}
                </div>
                <div className="font-code text-primary/80 shrink-0">{c.form}</div>
              </div>

              {functionalStatement && (
                <p className="text-xs text-muted-foreground mt-1.5 pt-1.5 border-t border-slate-700/60">
                  {functionalStatement}
                </p>
              )}

              {c.morphologyMatrix && (
                <MorphologyMatrixBlock matrix={c.morphologyMatrix} />
              )}
              
              {c.consonantSignals && c.consonantSignals.length > 0 && (
                <div className="mt-2 text-xs text-slate-400">
                    {c.consonantSignals[0]}
                </div>
              )}
              
              {c.axes && (
                <div className="flex gap-4 items-center mt-2 text-xs">
                    <span>{axisLabel(c.axes.principles)} Principles</span>
                    <span>{axisLabel(c.axes.morphology)} Morphology</span>
                    <span>{axisLabel(c.axes.consonants)} Consonants</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}