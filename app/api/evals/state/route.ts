import os from "node:os";
import path from "node:path";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { NextResponse } from "next/server";

const STORE_DIR = path.join(os.homedir(), ".zro-dev");
const STORE_PATH = path.join(STORE_DIR, "evals-state.v0.1.json");
const TMP_PATH = path.join(STORE_DIR, "evals-state.v0.1.tmp.json");

function emptyState() {
  return {
    savedRuns: [],
    runSeries: [],
  };
}

function normalizeState(raw: unknown) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return emptyState();
  }

  const obj = raw as Record<string, unknown>;

  return {
    savedRuns: Array.isArray(obj.savedRuns) ? obj.savedRuns : [],
    runSeries: Array.isArray(obj.runSeries) ? obj.runSeries : [],
  };
}

async function readStateFile() {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    return normalizeState(JSON.parse(raw));
  } catch (error) {
    const code =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof (error as { code?: unknown }).code === "string"
        ? (error as { code: string }).code
        : "";

    if (code === "ENOENT") {
      return emptyState();
    }

    throw error;
  }
}

async function writeStateFile(state: unknown) {
  const normalized = normalizeState(state);
  const body = JSON.stringify(normalized, null, 2) + "\n";

  await mkdir(STORE_DIR, { recursive: true });
  await writeFile(TMP_PATH, body, "utf8");
  await rename(TMP_PATH, STORE_PATH);

  return normalized;
}

export async function GET() {
  try {
    const state = await readStateFile();

    return NextResponse.json(
      {
        ok: true,
        ...state,
      },
      {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        code: "STATE_READ_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Could not read shared evals state.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, must-revalidate",
        },
      },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const state = await writeStateFile(body);

    return NextResponse.json(
      {
        ok: true,
        ...state,
      },
      {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        code: "STATE_WRITE_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Could not write shared evals state.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, must-revalidate",
        },
      },
    );
  }
}
