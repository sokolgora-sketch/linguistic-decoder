# Corpus70 A/B/C/D — Multi-tagger sensitivity (Gemini vs Claude vs ChatGPT vs Grok)

## What this is
A controlled A/B/C/D check where **only the semantic tagger changes**. The spectrogram harness and carrier extraction are identical.

- A: Gemini-blind tags (`corpus70.meta.v0.1.gemini-blind`)
- B: Claude-blind tags (`corpus70.meta.v0.1.claude-blind`)
- C: ChatGPT-blind tags (`corpus70.meta.v0.1.chatgpt-blind`)
- D: Grok-blind tags (`corpus70.meta.v0.1.grok-blind`)

## Why we do this
Corpus70 tables depend on tags. If different taggers assign different tags (and different **tag counts per item**), then **tag ↔ carrier fingerprints** are partly a function of the tagger.

## A — Gemini-blind
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


## B — Claude-blind
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


## C — ChatGPT-blind
- meta: `corpus70.meta.v0.1.chatgpt-blind`
- N: **70** (carrier=54, NO_PHONETIC=16, diverge=79.6% (43/54))

| Tag | N | Carrier top (purity) | p(max>=obs) | Carrier dist | Diverge rate (tag) |
|-----|---:|----------------------|------------:|--------------|-------------------|
| substance | 8 | **A (20.0%)** | 1.000 | A:1, E:1, I:1, O:1, U:1 | 100.0% (5/5) |
| motion | 19 | **A (29.4%)** | 0.772 | A:5, E:4, I:3, O:2, U:2, Ë:1 | 64.7% (11/17) |
| position | 14 | **Ë (30.8%)** | 0.762 | Ë:4, A:3, E:2, O:2, I:1, U:1 | 84.6% (11/13) |
| order | 18 | **I (29.4%)** | 0.700 | I:5, O:4, A:3, Ë:3, U:2 | 82.4% (14/17) |
| identity | 16 | **A (37.5%)** | 1.000 | A:3, U:2, Ë:1, I:1, O:1 | 75.0% (6/8) |
| cognition | 6 | **I (40.0%)** | 0.963 | I:2, A:1, E:1, U:1 | 80.0% (4/5) |
| expression | 7 | **I (50.0%)** | 0.467 | I:3, A:1, E:1, U:1 | 83.3% (5/6) |
| time | 6 | **A (50.0%)** | 0.960 | A:2, I:1, O:1 | 75.0% (3/4) |


## D — Grok-blind
- meta: `corpus70.meta.v0.1.grok-blind`
- N: **70** (carrier=54, NO_PHONETIC=16, diverge=79.6% (43/54))

| Tag | N | Carrier top (purity) | p(max>=obs) | Carrier dist | Diverge rate (tag) |
|-----|---:|----------------------|------------:|--------------|-------------------|
| substance | 17 | **A (33.3%)** | 1.000 | A:3, I:2, U:2, E:1, O:1 | 77.8% (7/9) |
| motion | 14 | **A (28.6%)** | 0.758 | A:4, E:3, I:2, O:2, U:2, Ë:1 | 64.3% (9/14) |
| position | 11 | **Ë (50.0%)** | 0.431 | Ë:4, O:2, E:1, I:1 | 75.0% (6/8) |
| order | 7 | **I (33.3%)** | 0.998 | I:2, O:2, A:1, U:1 | 100.0% (6/6) |
| identity | 7 | **Ë (40.0%)** | 0.994 | Ë:2, A:1, I:1, U:1 | 100.0% (5/5) |
| cognition | 5 | **I (50.0%)** | 0.858 | I:2, A:1, U:1 | 75.0% (3/4) |
| expression | 6 | **I (50.0%)** | 0.315 | I:3, A:1, E:1, Ë:1 | 83.3% (5/6) |
| time | 3 | **A (50.0%)** | 1.000 | A:1, O:1 | 100.0% (2/2) |


## Cross-tagger summary

| tagger | ids | total tag assignments | multi-tag ids | avg tags/id |
|---|---:|---:|---:|---:|
| gemini | 70 | 101 | 31 | 1.443 |
| claude | 70 | 87 | 17 | 1.243 |
| chatgpt | 70 | 94 | 24 | 1.343 |
| grok | 70 | 70 | 0 | 1.000 |

## Interpretation

- The tagger changes the **tag distribution** (N per tag) and often which items belong to each tag.
- Because the spectrogram tables are computed *by tag*, Corpus70 is best treated as a **tagger-sensitivity control** rather than a stable universal mapping proof.
- Grok assigns **single tags only** in this run (avg tags/id ≈ 1.0), which materially changes the tag-count totals and downstream tables.

