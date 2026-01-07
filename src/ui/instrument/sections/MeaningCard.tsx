"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  /** Future: meaning/functional root telemetry. For now: VM carries none. */
  available?: boolean;
};

export function MeaningCard({ available }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meaning</CardTitle>
      </CardHeader>
      <CardContent>
        {available ? (
          <div>Meaning telemetry available.</div>
        ) : (
          <div className="text-sm text-muted-foreground">Not available in this engine version.</div>
        )}
      </CardContent>
    </Card>
  );
}
