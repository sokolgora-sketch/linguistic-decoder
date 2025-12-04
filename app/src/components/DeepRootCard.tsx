// app/src/components/DeepRootCard.tsx

import type { DeepRootSummaryV1 } from "@/shared/deepRoot.v1";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DeepRootCard({ deepRoot }: { deepRoot: DeepRootSummaryV1 }) {
  if (!deepRoot) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deep Root Analysis (Experimental)</CardTitle>
        <CardDescription>
          A speculative reconstruction of a proto-form.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="font-mono text-lg">{deepRoot.form}</p>
        <p className="text-sm text-muted-foreground">{deepRoot.notes}</p>
        <div className="flex gap-4 pt-2 text-xs">
          <div>
            <p className="font-semibold">Language Family:</p>
            <p>{deepRoot.language}</p>
          </div>
          <div>
            <p className="font-semibold">Vowel Path:</p>
            <p>{deepRoot.vowelPath}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
