
'use client';
import type { LanguageFamily, Candidate, AnalysisResult, OriginAxisStatus, MorphologyMatrix } from '../shared/engineShape';
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


export function Candidates({ items, analysis }: { items?: LanguageFamily[]; analysis?: AnalysisResult }) {
  const fromAnalysis = analysis?.candidates ?? [];
  
  const fromFamilies =
    (items ?? []).map((lf, idx) => ({
      id: `family_${lf.familyId}_${idx}`,
      language: lf.familyId,
      family: lf.familyId,
      form: '',
      decomposition: {
        parts: [],
        functionalStatement: lf.rationale || '',
      },
      status: 'experimental',
      confidenceTag: lf.confidence >= 0.66 ? 'solid' : 'speculative',
      dialect: lf.dialect,
      _confidence: lf.confidence,
    })) as Partial<Candidate>[];

  const displayCandidates: Partial<Candidate>[] = fromAnalysis.length > 0 ? fromAnalysis : fromFamilies;

  if (displayCandidates.length === 0) return null;

  // Check if the first candidate is the primary one
  const primaryCandidateId = displayCandidates[0]?.id;

  return (
    <div className="mt-3">
      <h3 className="font-bold text-sm tracking-wide mb-2">Language Family Candidates</h3>
      <div className="space-y-3">
        {displayCandidates.map((c, i) => {
          const confidencePercent = (c as any)._confidence !== undefined 
            ? ((c as any)._confidence * 100).toFixed(0) 
            : null;
          
          const isPrimary = c.id === primaryCandidateId;

          return (
            <Card key={c.id || i} className={cn(
              "p-3 text-sm",
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

              {confidencePercent !== null && (
                <div className="font-bold text-lg text-primary mt-1">{confidencePercent}%</div>
              )}

              {c.decomposition?.functionalStatement && (
                 <p className="text-xs opacity-80 mt-1.5 pt-1.5 border-t">{c.decomposition.functionalStatement}</p>
              )}

              {c.morphology && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <div>
                    <span className="font-semibold">Morphology:</span>{' '}
                    root <span className="font-mono">{c.morphology.base}</span>
                    {c.morphology.affixes.length > 0 && (
                      <> + {c.morphology.affixes.join(', ')}</>
                    )}
                  </div>
                  {c.morphology.wordSums.length > 0 && (
                    <ul className="mt-1 list-disc list-inside">
                      {c.morphology.wordSums.slice(0, 2).map((sum, idx) => (
                        <li key={idx}>{sum}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {c.consonantProfile && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <span className="font-semibold">Consonants:</span>{' '}
                  {c.consonantProfile}
                  {c.consonantProfileOk === false && ' (in tension)'}
                </div>
              )}
              {c.consonantSignals && c.consonantSignals.length > 0 && (
                <ul className="mt-1 list-disc list-inside text-xs text-muted-foreground">
                  {c.consonantSignals.slice(0, 2).map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              )}

              {c.axes && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <span className="font-semibold">Axes:</span>{' '}
                  Voices {axisLabel(c.axes.principles)} ·{' '}
                  Morphology {axisLabel(c.axes.morphology)} ·{' '}
                  Consonants {axisLabel(c.axes.consonants)}
                </div>
              )}

              {c.morphologyMatrix && (
                <MorphologyMatrixBlock matrix={c.morphologyMatrix} />
              )}

              {c.status && (
                <div className="mt-2 flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                        ${c.status === 'pass' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}`}>
                        {c.status}
                    </span>
                    {c.confidenceTag && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                        ${c.confidenceTag === 'solid' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                            {c.confidenceTag}
                        </span>
                    )}
                    {c.fitTag && (
                      <Badge variant="outline" className="ml-2">
                        {c.fitTag}
                      </Badge>
                    )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
