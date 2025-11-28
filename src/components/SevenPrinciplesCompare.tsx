import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SevenCalcResult } from "@/shared/engineShape";

type SevenPrinciplesCompareProps = {
  results: {
    a: SevenCalcResult | null;
    b: SevenCalcResult | null;
  };
  wordA: string;
  wordB: string;
};

const SevenPrincipleCompare: React.FC<SevenPrinciplesCompareProps> = ({ results, wordA, wordB }) => {
  const { a, b } = results;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <Card>
        <CardHeader>
          <CardTitle>{wordA}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          {a ? (
            <ul className="space-y-1">
              <li><span className="font-semibold">Expression:</span> {a.expression}</li>
              <li><span className="font-semibold">Principle:</span> {a.principle}</li>
              <li><span className="font-semibold">Decimal:</span> {a.decimal}</li>
              <li><span className="font-semibold">Base-7:</span> {a.base7.join(" ")}</li>
              <li><span className="font-semibold">Voices:</span> {a.voices.join(" → ")}</li>
            </ul>
          ) : (
            <p>No 7-principle calculation available.</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{wordB}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          {b ? (
            <ul className="space-y-1">
              <li><span className="font-semibold">Expression:</span> {b.expression}</li>
              <li><span className="font-semibold">Principle:</span> {b.principle}</li>
              <li><span className="font-semibold">Decimal:</span> {b.decimal}</li>
              <li><span className="font-semibold">Base-7:</span> {b.base7.join(" ")}</li>
              <li><span className="font-semibold">Voices:</span> {b.voices.join(" → ")}</li>
            </ul>
          ) : (
            <p>No 7-principle calculation available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SevenPrincipleCompare;
