# Corpus70 A/B — Tagger Sensitivity Check (Gemini-blind vs Claude-blind)

## What this is
This is a controlled A/B check where **only the semantic tagger changes**:
- **A:** Corpus70 tags from Gemini-blind metadata
- **B:** Corpus70 tags from Claude-blind metadata
- The analysis engine (carrier extraction + spectrogram harness) is identical.

## Why we do this
Corpus70 results depend on tags. If different “blind taggers” assign different tags to the same items, then **tag ↔ carrier fingerprints** in Corpus70 are partly a function of the tagger, not just language signal.

## Results A (Gemini-blind tags)
- meta: `corpus70.meta.v0.1.gemini-blind`
- N: **70** (carrier=54, NO_PHONETIC=16, diverge=79.6% (43/54))

| Tag | N | Carrier top (purity) | p(max>=obs) | Carrier dist | Diverge rate (tag) |
|-----|---:|----------------------|------------:|--------------|-------------------|
| substance | 15 | **A (37.5%)** | 1.000 | A:3, U:2, E:1, I:1, O:1 | 87.5% (7/8) |
| motion | 19 | **A (25.0%)** | 0.994 | A:4, E:4, I:4, O:2, U:2 | 62.5% (10/16) |
| position | 13 | **Ë (33.3%)** | 0.675 | Ë:4, E:2, I:2, O:2, A:1, U:1 | 83.3% (10/12) |
| order | 18 | **I (27.8%)** | 0.688 | I:5, A:4, Ë:4, O:4, U:1 | 77.8% (14/18) |
| identity | 7 | **Ë (66.7%)** | 0.994 | Ë:2, A:1 | 100.0% (3/3) |
| cognition | 11 | **A (33.3%)** | 0.943 | A:3, I:3, U:2, Ë:1 | 77.8% (7/9) |
| expression | 11 | **I (62.5%)** | 0.115 | I:5, A:1, E:1, U:1 | 87.5% (7/8) |
| time | 7 | **A (50.0%)** | 0.995 | A:2, I:1, O:1 | 75.0% (3/4) |

## Results B (Claude-blind tags)
- meta: `corpus70.meta.v0.1.claude-blind`
- N: **70** (carrier=54, NO_PHONETIC=16, diverge=79.6% (43/54))

| Tag | N | Carrier top (purity) | p(max>=obs) | Carrier dist | Diverge rate (tag) |
|-----|---:|----------------------|------------:|--------------|-------------------|
| substance | 14 | **A (33.3%)** | 1.000 | A:3, I:2, U:2, E:1, O:1 | 88.9% (8/9) |
| motion | 19 | **A (27.8%)** | 0.784 | A:5, E:5, I:4, O:2, U:2 | 66.7% (12/18) |
| position | 14 | **Ë (30.8%)** | 0.766 | Ë:4, O:3, A:2, E:2, I:1, U:1 | 76.9% (10/13) |
| order | 9 | **I (37.5%)** | 0.769 | I:3, A:2, Ë:1, O:1, U:1 | 87.5% (7/8) |
| identity | 12 | **A (28.6%)** | 1.000 | A:2, Ë:2, I:1, O:1, U:1 | 71.4% (5/7) |
| cognition | 7 | **I (33.3%)** | 0.997 | I:2, U:2, A:1, Ë:1 | 83.3% (5/6) |
| expression | 6 | **I (50.0%)** | 0.308 | I:3, A:1, E:1, U:1 | 83.3% (5/6) |
| time | 6 | **A (33.3%)** | 1.000 | A:1, I:1, O:1 | 100.0% (3/3) |

## Interpretation
Changing the tagger changes the tag distribution (N per tag and which items belong to each tag), so **Corpus70 tag ↔ carrier fingerprints are not robust to tagger choice**.

Therefore, Corpus70 should be treated as a **tagger-sensitivity control**, not as “proof” of a stable universal mapping.
