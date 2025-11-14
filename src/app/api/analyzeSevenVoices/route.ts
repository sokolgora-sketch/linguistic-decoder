
import { NextResponse, type NextRequest } from 'next/server';
import { solveMatrix, type SolveOptions, extractBase, normalizeTerminalY, type Vowel } from '@/lib/solver';
import { ENGINE_VERSION, CFG, Alphabet } from '@/lib/solver/engineConfig';
import { chooseProfile, readWindowsDebug, checksumV } from '@/lib/solver/valueTables';


// Helper to transform a Path object to the specified format
const formatPath = (path: any) => {
  const checksums = (path.checksums || []).reduce((acc: any, curr: any) => {
    acc[curr.type] = curr.value;
    return acc;
  }, {} as Record<'V' | 'E' | 'C', number>);

  return {
    voice_path: path.vowelPath,
    ring_path: path.ringPath,
    level_path: path.levelPath,
    ops: path.ops,
    checksums: checksums,
    kept: path.kept,
  };
};

function baseSeqFor(word: string): Vowel[] {
  const raw = extractBase(word);
  const norm = normalizeTerminalY(raw, word);
  return (norm.length ? norm : (["O"] as Vowel[])) as Vowel[];
}

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
    
    const opts: SolveOptions = strict
      ? { beamWidth: CFG.beamWidth, maxOps: CFG.maxOpsStrict, allowDelete: false, allowClosure: false, opCost: { sub: CFG.cost.sub, del: CFG.cost.del, ins: CFG.cost.insClosure }, alphabet }
      : { beamWidth: CFG.beamWidth, maxOps: CFG.maxOpsOpen,   allowDelete: true,  allowClosure: true,  opCost: { sub: CFG.cost.sub, del: CFG.cost.del, ins: CFG.cost.insClosure }, alphabet };


    // Get windows debug info
    const base = baseSeqFor(w);
    const profile = chooseProfile(w, alphabet === "auto" ? undefined : alphabet);
    const { windows, classes } = readWindowsDebug(w, base, profile);
    console.log('Consonant windows: ', windows); // before path calculation
    
    // Run the solver
    const analysisResult = solveMatrix(w, opts);

    const primaryPath = analysisResult.primaryPath;
    console.log('Primary path: ', primaryPath.vowelPath);
    console.log('Checksums: ', checksumV(primaryPath.vowelPath));
    
    // Format the response to match the specification
    const formattedResponse = {
        engineVersion: ENGINE_VERSION,
        word: analysisResult.word,
        mode: analysisResult.mode,
        alphabet,
        primary: formatPath(analysisResult.primaryPath),
        frontier: analysisResult.frontierPaths.map(formatPath),
        windows,
        windowClasses: classes,
        signals: [...analysisResult.signals],
        ts: Date.now(),
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

