
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export interface LanguageFamilyView {
  language: string;
  form: string;
  pivot: string;
  status: 'core' | 'experimental' | 'speculative' | 'rejected';
  tags: string[];
}

interface Props {
  families: LanguageFamilyView[];
}

export function LanguageFamiliesCard({ families }: Props) {
  if (!families || families.length === 0) {
    return null;
  }

  const visibleFamilies = families.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Language families (experimental)</CardTitle>
        <CardDescription>
          Where the engine found plausible roots for this word.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="border-b border-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="py-2 pr-4 text-left">Language</th>
                <th className="py-2 px-4 text-left">Form</th>
                <th className="py-2 px-4 text-left">Pivot</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 pl-4 text-left">Tags</th>
              </tr>
            </thead>
            <tbody>
              {visibleFamilies.map((fam, idx) => (
                <tr
                  key={idx}
                  className="border-b border-muted/20 last:border-b-0"
                >
                  <td className="py-1 pr-4 font-medium">{fam.language}</td>
                  <td className="py-1 px-4 font-mono">{fam.form}</td>
                  <td className="py-1 px-4 font-mono text-muted-foreground">
                    {fam.pivot || '—'}
                  </td>
                  <td className="py-1 px-4">{fam.status}</td>
                  <td className="py-1 pl-4 text-xs text-muted-foreground">
                    {fam.tags.length > 0 ? fam.tags.join(', ') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
