'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  result: any;
};

export default function MeaningCard({ result }: Props) {
  const meaning = result?.meaning;

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm">Meaning</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        {meaning ? (
          <div className="text-xs">{meaning}</div>
        ) : (
          <div className="text-xs text-muted-foreground">
            No meaning available in result.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
