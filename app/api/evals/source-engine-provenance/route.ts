import { execSync } from "node:child_process";
import { NextResponse } from "next/server";
import { ENGINE_VERSION_V1 } from "@/v1/versions.v1";

function shortSha(value: unknown): string {
  const s = String(value ?? "").trim();
  return s ? s.slice(0, 7) : "";
}

function resolveRuntimeGitShaV0_1(): string {
  try {
    return (
      shortSha(
        execSync("git rev-parse --short HEAD", {
          stdio: ["ignore", "pipe", "ignore"],
        }).toString("utf8")
      ) || "unknown"
    );
  } catch {
    return (
      shortSha(process.env.VERCEL_GIT_COMMIT_SHA) ||
      shortSha(process.env.GIT_SHA) ||
      shortSha(process.env.NEXT_PUBLIC_GIT_SHA) ||
      shortSha(process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA) ||
      "unknown"
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      sourceEngineId: "analyze-v1",
      sourceEngineVersion: ENGINE_VERSION_V1,
      sourceEngineBuild: resolveRuntimeGitShaV0_1(),
    },
    {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
      },
    }
  );
}
