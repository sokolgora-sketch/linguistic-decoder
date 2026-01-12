'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  result: any;
};

export default function RawJsonCard({ result }: Props) {
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm">Raw JSON</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <pre className="text-xs whitespace-pre-wrap">
          {JSON.stringify(result, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}
