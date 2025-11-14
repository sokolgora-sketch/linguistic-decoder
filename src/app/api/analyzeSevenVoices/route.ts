
import { NextResponse, type NextRequest } from 'next/server';
import { solveMatrix, type SolveOptions, extractBase, normalizeTerminalY, type Vowel } from '@/lib/solver';
import { CFG, Alphabet } from '@/lib/solver/engineConfig';
import { chooseProfile, readWindowsDebug } from '@/lib/solver/valueTables';
import { ENGINE_VERSION } from '@/lib/solver/engineVersion';


const baseSeqFor = (w: string): Vowel[] => {
  const raw = extractBase(w);
  const norm = normalizeTerminalY(raw, w);
  return (norm.length ? norm : (["O"] as Vowel[])) as Vowel[];
};

// Main handler for the POST request
export async function POST(request: NextRequest) {
  try {
    const { word, mode, alphabet: alphaFromReq } = await request.json().catch(() => ({}));
    const w = String(word || "").trim();
    const strict = String(mode || "strict") === "strict";
    const alphabet = (alphaFromReq || CFG.alphabet) as Alphabet;
    
    // Input validation
    if (!w) {
        return NextResponse.json({ error: "Missing 'word'." }, { status: 400 });
    }
    if (!/^[a-zë*-₁₂₃ḱǵ-]{1,48}$/i.test(w)) {
        return NextResponse.json({ error: "letters/dashes/special only, ≤48" }, { status: 400 });
    }
    
    const t0 = Date.now();
    const opts: SolveOptions = strict
      ? { beamWidth: CFG.beamWidth, maxOps: CFG.maxOpsStrict, allowDelete: false, allowClosure: false, opCost: { sub: CFG.cost.sub, del: CFG.cost.del, ins: CFG.cost.insClosure }, alphabet }
      : { beamWidth: CFG.beamWidth, maxOps: CFG.maxOpsOpen,   allowDelete: true,  allowClosure: true,  opCost: { sub: CFG.cost.sub, del: CFG.cost.del, ins: CFG.cost.insClosure }, alphabet };

    
    // Run the solver
    const analysisResult = solveMatrix(w, opts);
    
    // Format the response to match the specification
    const payload = {
        analysis: {
            ...analysisResult,
            solveMs: Date.now() - t0,
            ts: Date.now(),
        }
    };
    
    return NextResponse.json(payload);

  } catch (e) {
    console.error("Error in /analyzeSevenVoices route:", e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    
    if (e instanceof SyntaxError) {
        return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
