'use client';

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function RawJsonCard(props: {
  pretty: string | null;
  onCopyFullJson?: () => void;
  engineVersion: string | null;
}) {
  const hasPretty = typeof props.pretty === "string" && props.pretty.length > 0;

  return (
    <Card>
      <CardHeader className="py-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm">Raw Engine JSON</CardTitle>
          {props.onCopyFullJson ? (
            <Button size="sm" variant="outline" onClick={props.onCopyFullJson}>
              Copy Full JSON
            </Button>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="py-3 text-sm">
        <details>
          <summary className="cursor-pointer select-none text-sm opacity-80">
            Show / hide (collapsed by default)
          </summary>

          <div className="mt-2 text-xs opacity-70">
            engine: <span className="font-mono">{props.engineVersion ?? "not_emitted"}</span>
          </div>

          {hasPretty ? (
            <pre className="mt-2 max-h-[420px] overflow-auto rounded-md border bg-muted/20 p-3 text-xs font-mono leading-relaxed">
              {props.pretty}
            </pre>
          ) : (
            <div className="mt-2 rounded-md border bg-muted/10 p-3 text-xs">
              Not available in this render mode. (VM-only boundary or missing payload.)
            </div>
          )}
        </details>
      </CardContent>
    </Card>
  );
}
