# Linguistic Decoder

*A deterministic phonetic analysis engine testing vowel-meaning relationships*

[![Tests](https://img.shields.io/badge/tests-661%20passing-brightgreen)](https://github.com/sokolgora-sketch/linguistic-decoder)
[![TypeScript](https://img.shields.io/badge/TypeScript-96.6%25-blue)](https://github.com/sokolgora-sketch/linguistic-decoder)
[![License](https://img.shields.io/badge/license-AGPL--3.0-blue)](LICENSE)

---

## What Is This?

A vocal analysis system built on **carrier law**: the principle that vowels carry sustained sound while consonants interrupt it. By analyzing vowel patterns across languages, we're testing whether phonetic structure predicts semantic relationships.

### The "Rhythm" Discovery

Traditional phonetics teaches that the word "rhythm" has no vowels. Our analysis found something different:
```typescript
analyzeWord("rhythm", { 
  mode: "strict", 
  ipa: "/ˈrɪð(ə)m/" 
})
```

**Result:**
```
Orthography (spelling):  Y
Phonetics (sound):       I → Ë  
Status:                  DIVERGE

Interpretation: The engine detected "oscillation" 
from the vowel pattern alone — matching rhythm's 
actual definition.
```

This **DIVERGE** detection (when spelling ≠ sound) revealed that writing can hide phonetic truth. It's our first computational proof that vowel paths carry meaningful information.

---

## Core Concepts

### The 7-Voice Framework

Based on universal human vocal anatomy (F1/F2 formant positions), we identify 7 fundamental vowel positions:

| Voice | IPA Example | Position | Acoustic Property |
|-------|-------------|----------|-------------------|
| **I** | /ɪ/ (bit)   | Front/High | Highest formants |
| **E** | /ɛ/ (bed)   | Front/Mid  | Forward resonance |
| **A** | /ɑ/ (father)| Central/Open | Maximum aperture |
| **O** | /ɔ/ (thought)| Back/Mid  | Rounded |
| **U** | /ʊ/ (put)   | Back/High  | Deepest formants |
| **Y** | /y/ (tu)    | Front-Rounded | Transitional |
| **Ë** | /ə/ (about) | Central/Mid | Neutral (schwa) |

These aren't arbitrary categories — they map to the physical constraints of human speech production.

### Carrier Law

**Hypothesis:** Vowels are "carriers" of sustained acoustic energy. Since they're the only sounds humans can sustain indefinitely (try singing consonants), they form the measurable core of speech.

**Testable claim:** If vowels carry meaning, then vowel patterns should cluster semantically across languages more than random chance.

---

## Architecture
```
┌────────────────────────────────────┐
│  Heart (Oracle)                    │
│  Deterministic vowel extraction    │
└──────────────┬─────────────────────┘
               ↓
┌────────────────────────────────────┐
│  VectorDelta (Geometry Engine)     │
│  Measures vowel motion as physics  │
└──────────────┬─────────────────────┘
               ↓
┌────────────────────────────────────┐
│  Verifier (Truth-Check)            │
│  Validates claims against gates    │
└────────────────────────────────────┘
```

**Design principles:**
- **SSOT (Single Source of Truth):** All vowel extraction routes through one deterministic function
- **Evidence-First:** Every output includes audit trail with references
- **Anti-Hallucination:** Returns `∅` for noise instead of inventing patterns
- **Calibrated Instrument:** Format-invariant, noise-rejecting tests prove reliability

---

## Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation
```bash
git clone https://github.com/sokolgora-sketch/linguistic-decoder.git
cd linguistic-decoder
npm install
```

### Run the Application
```bash
npm run dev
# → http://localhost:3000
```

### Run Tests
```bash
npm test              # Full suite (661 tests)
npm run gate:quick    # Lint + test + build
```

---

## Using the Interface

### Main Analysis Card
- Enter a word
- Select mode (`strict` recommended)
- Select alphabet (`auto` recommended)
- Click **Analyze** or press Enter

### What You'll See

**Heart Summary:**
- Voice path (vowel sequence, e.g., `I → Ë`)
- Level path (vertical tongue position)
- Ring path (radial distance from center)

**DIVERGE Detection:**
- When present, shows orthography vs phonetic carrier mismatch
- Example: "rhythm" shows `Y` (spelling) vs `I → Ë` (sound)

**Vector Geometry (when available):**
- Polarity: `INWARD`, `OUTWARD`, `CIRCULAR`, or `MIXED`
- Magnitude: Physical distance traveled in vowel space
- Based on 2D coordinate grid mapping F1/F2 formant positions

### Compare Two Words
- Enter two words in side-by-side inputs
- Press Enter or click Compare
- See vowel patterns analyzed in parallel

---

## Research Status

**Foundation: Complete** ✅

- [x] Deterministic vowel extraction (orthography + IPA)
- [x] DIVERGE detection (spelling vs sound)
- [x] VectorDelta geometry engine (vowel motion as physics)
- [x] Calibration tests (noise rejection, format invariance)
- [x] 661 tests passing, 98% CI success rate

**Current Phase: Validation** 🔄

- [ ] 70-word cross-language corpus
- [ ] Statistical clustering analysis
- [ ] Semantic coherence testing
- [ ] Operator pattern detection (vowel+consonant pairs)

**Research Questions:**

1. **Do vowel paths predict semantic clusters across unrelated languages?**
   - Methodology: 70+ words across 5+ language families
   - Measurement: Statistical clustering vs random baseline
   - Status: Corpus construction in progress

2. **Does DIVERGE detection reveal systematic patterns?**
   - Testing words where orthography ≠ phonetics
   - Hypothesis: DIVERGE words are semantically richer
   - Example validated: "rhythm" (oscillation meaning matches carrier pattern)

3. **Can vowel geometry measure semantic relationships?**
   - Using VectorDelta to quantify vowel motion
   - Testing if polarity (INWARD/OUTWARD/CIRCULAR) correlates with meaning
   - Foundation complete, corpus testing next

---

## Technical Stack

- **Language:** TypeScript (96.6%)
- **Framework:** Next.js 14
- **Backend:** Firebase (Firestore, Hosting, Functions)
- **Testing:** Jest (661 tests, 240 suites)
- **CI/CD:** GitHub Actions (4 workflows, 98% success rate)

---

## Development

### Code Organization
```
src/
├── v1/              # Core analysis engine
├── shared/
│   ├── vowels/      # SSOT vowel extraction
│   ├── geometry/    # VectorDelta coordinate system
│   └── verifier/    # Truth-checking logic
└── app/             # Next.js UI

tests/
├── geometry/        # Calibration & deception rails
├── corpus/          # Gold standard test cases
└── validation/      # Cross-language datasets
```

### Running Specific Tests
```bash
# Geometry calibration tests
npm test -- tests/geometry

# Corpus validation
npm test -- tests/corpus

# Single file with snapshot update
npm test -- path/to/test.spec.ts -u
```

---

## Project Origin

Built by a solo developer over 5 months using AI-assisted development (Claude, ChatGPT, Gemini) as thinking partners. Started as an exploration of cross-language phonetic patterns and evolved into a testable framework for vowel-meaning relationships.

**Philosophy:** Before writing systems emerged, spoken language was primary. This project tests whether voice contains measurable information that writing obscures.

---

## Contributing

Currently in active research phase. Interested in collaboration from:

- **Linguists:** Cross-language validation, phonosemantics expertise
- **Phoneticians:** Formant analysis, acoustic measurements
- **Voice Coaches:** Real-world testing, pronunciation feedback
- **Developers:** TypeScript contributions, test coverage

Open an issue to discuss or submit a PR following existing patterns.

---

## Performance Metrics

- **Commits:** 766 total
- **Test Coverage:** 661 tests, 240 suites
- **CI Success:** 98% pass rate
- **Build Time:** ~1m 16s average
- **Code Quality:** ESLint + TypeScript strict mode

---

## License

GNU Affero General Public License v3.0 (AGPL-3.0)

**What this means:**
- ✅ Free to use, modify, and distribute
- ✅ Derivatives must be open-sourced
- ✅ Network use counts as distribution
- ⚠️ Commercial use requires compliance or separate licensing

---

## Roadmap

**2026 Q1:** Foundation complete, validation corpus in progress  
**2026 Q2:** Statistical testing, initial results  
**2026 Q3:** Publication (arXiv), community feedback  
**2026 Q4:** Iteration based on validation outcomes

---

## Scientific Approach

**We're testing, not claiming:**

- ✅ Build calibrated instrument (vowel extraction)
- ✅ Prove it works (DIVERGE detection on "rhythm")
- �� Test at scale (70-word corpus across languages)
- ⏳ Publish results honestly (whether positive, null, or mixed)
- ⏳ Invite replication (all code and data open)

**Hypothesis:** Vowel patterns contain cross-linguistic semantic information

**Status:** Foundation proven, hypothesis under testing

**Commitment:** Publish results regardless of outcome

---

## Links

- **Repository:** [github.com/sokolgora-sketch/linguistic-decoder](https://github.com/sokolgora-sketch/linguistic-decoder)
- **Issues:** [Report bugs or request features](https://github.com/sokolgora-sketch/linguistic-decoder/issues)
- **Discussions:** [Join the conversation](https://github.com/sokolgora-sketch/linguistic-decoder/discussions)

---

*Built with curiosity. Tested with rigor. Shared openly.*

**Last updated:** February 2026 | **Status:** Active research
