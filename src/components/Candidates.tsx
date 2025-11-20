
'use client';
import type { LanguageFamily, Candidate, AnalysisResult } from '../shared/engineShape';
import { Card } from './ui/card';

export function Candidates({ items, analysis }: { items?: LanguageFamily[]; analysis?: AnalysisResult }) {
  const fromAnalysis = analysis?.candidates ?? [];
  
  // Fallback for older data shape or when candidates are not generated
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
      // map confidence back for display
      _confidence: lf.confidence,
    })) as Partial<Candidate>[];

  const displayCandidates: Partial<Candidate>[] = fromAnalysis.length > 0 ? fromAnalysis : fromFamilies;

  if (displayCandidates.length === 0) return null;

  return (
    <div className="mt-3">
      <h3 className="font-bold text-sm tracking-wide mb-2">Language Family Candidates</h3>
      <div className="space-y-3">
        {displayCandidates.map((c, i) => {
          const confidencePercent = (c as any)._confidence !== undefined 
            ? ((c as any)._confidence * 100).toFixed(0) 
            : null;

          return (
            <Card key={c.id || i} className="p-3 text-sm border-primary/50">
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

              {c.principleSignals?.notes && c.principleSignals.notes.length > 0 && (
                <div className="text-xs opacity-60 mt-1.5">
                  {c.principleSignals.notes.join(" · ")}
                </div>
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
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
