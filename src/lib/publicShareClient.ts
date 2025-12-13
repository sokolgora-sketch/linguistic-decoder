// src/lib/publicShareClient.ts
import type { AnalyzeWordResultUI } from "@/shared/resultsUI";

export type CreatePublicShareResponse = {
  id: string;
};

export async function createPublicShare(result: AnalyzeWordResultUI): Promise<string> {
  const res = await fetch("/api/public-share", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ result }),
  });

  if (!res.ok) {
    throw new Error(`Public share failed with status ${res.status}`);
  }

  const data = (await res.json()) as Partial<CreatePublicShareResponse>;

  if (!data.id) {
    throw new Error("Public share response missing id");
  }

  return data.id;
}
