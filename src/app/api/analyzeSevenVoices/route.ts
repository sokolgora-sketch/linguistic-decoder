
import { NextResponse, type NextRequest } from 'next/server';
import { solveMatrix, type Analysis, type Path, type Checksum, type SolveMode, type SolveOptions } from '@/lib/solver';

// Helper to transform the checksums array into an object
const formatChecksums = (checksums: Checksum[]) => {
  return checksums.reduce((acc, curr) => {
    acc[curr.type] = curr.value;
    return acc;
  }, {} as Record<'V' | 'E' | 'C', number>);
};

// Helper to transform a Path object to the specified format
const formatPath = (path: Path) => {
  const E = path.checksums.find(c => c.type === 'E')?.value ?? 0;
  
  // Note: This check is disabled for now as the core engine's E value includes
  // more than just op costs (e.g. gravity, penalties). A more sophisticated
  // validation could be re-introduced if needed.
  // const opCost = { sub: 1, del: 3, ins: 2 };
  // const Ecalc = (path.ops || []).reduce((s, op) => {
  //   if (op.includes("→")) return s + opCost.sub;
  //   if (op.startsWith("delete")) return s + opCost.del;
  //   if (op.startsWith("closure")) return s + opCost.ins;
  //   if (op.startsWith("insert")) return s + opCost.ins;
  //   return s;
  // }, 0);
  // if (Ecalc !== E) { console.warn(`Energy mismatch for ${path.voicePath.join("")}: calc=${Ecalc} engine=${E}`); }

  return {
    voice_path: path.voicePath,
    ring_path: path.ringPath,
    level_path: path.levelPath,
    ops: path.ops,
    checksums: formatChecksums(path.checksums),
    kept: path.kept,
  };
};


// Main handler for the POST request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { word, mode = "strict" } = body;
    
    // Input validation
    const w = String(word || "").trim();
    if (!/^[a-zë-]{1,48}$/i.test(w)) {
        return NextResponse.json({ error: "letters/dashes only, ≤48" }, { status: 400 });
    }
    
    const strict = mode === "strict";
    const opts: SolveOptions = strict
      ? { beamWidth: 8, maxOps: 1, allowDelete: false, allowClosure: false, opCost: { sub:1, del:3, ins:2 } }
      : { beamWidth: 8, maxOps: 2, allowDelete: true,  allowClosure: true,  opCost: { sub:1, del:3, ins:2 } };


    // Run the solver
    const analysisResult = solveMatrix(w, opts);
    
    // Format the response to match the specification
    const formattedResponse = {
        engineVersion: analysisResult.engineVersion,
        word: analysisResult.word,
        mode: analysisResult.mode,
        primary: formatPath(analysisResult.primaryPath),
        frontier: analysisResult.frontierPaths.map(formatPath),
        signals: analysisResult.signals,
    };
    
    return NextResponse.json(formattedResponse);

  } catch (e) {
    console.error("Error in /analyzeSevenVoices route:", e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    
    if (e instanceof SyntaxError) {
        return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
