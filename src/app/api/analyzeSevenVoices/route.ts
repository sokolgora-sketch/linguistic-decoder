
import { NextResponse, type NextRequest } from 'next/server';
import { solveMatrix, type SolveOptions } from '@/lib/solver';
import { ENGINE_VERSION, CFG, Alphabet } from '@/lib/solver/engineConfig';

// Helper to transform the checksums array into an object
const formatChecksums = (checksums: {type: 'V'|'E'|'C', value:number}[]) => {
  return checksums.reduce((acc, curr) => {
    acc[curr.type] = curr.value;
    return acc;
  }, {} as Record<'V' | 'E' | 'C', number>);
};

// Helper to transform a Path object to the specified format
const formatPath = (path: any) => {
  return {
    voice_path: path.vowelPath,
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
      ? { beamWidth: CFG.beamWidth, maxOps: CFG.maxOpsStrict, allowDelete: false, allowClosure: false, opCost: { sub: CFG.cost.sub, del: CFG.cost.del, ins: CFG.cost.insClosure } }
      : { beamWidth: CFG.beamWidth, maxOps: CFG.maxOpsOpen,   allowDelete: true,  allowClosure: true,  opCost: { sub: CFG.cost.sub, del: CFG.cost.del, ins: CFG.cost.insClosure } };


    // Run the solver
    const analysisResult = solveMatrix(w, opts);
    
    // Format the response to match the specification
    const formattedResponse = {
        engineVersion: ENGINE_VERSION,
        word: analysisResult.word,
        mode: analysisResult.mode,
        primary: formatPath(analysisResult.primaryPath),
        frontier: analysisResult.frontierPaths.map(formatPath),
        windows: analysisResult.windows,
        windowClasses: analysisResult.windowClasses,
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
