## Project: Seven-Voices Engine — Linguistic Decoder

### Engine (frozen)
- Version: `2025-11-16-core-3`
- Voices: A,E,I,O,U,Y,Ë
- Levels: High=A,E,I · Mid=O · Low=U,Y,Ë
- Rings: A=3, E=2, I=1, O=0, U=1, Y=2, Ë=3
- Strict params: edgeWeight=0.25, opCost ins=3, del=4

**Invariants**
- study → U→I (rings 1→1)
- damage → A→E (rings 3→2)
- hope → ends on E (rings 0→2) stable vs edge weights

### Mapper
- Local deterministic: returns [{label, confidence (0..1), rationale[], dialect?}]
- Dialect: ë/ç ⇒ tosk; else ⇒ geg
- Albanian cues: ^vet, vend, -je, sh/zh/xh/gj/ll/rr/nj/dh/th
- AI Mapper (optional): Genkit→Gemini; needs GOOGLE_GENAI_API_KEY (or GENKIT_API_KEY)

### App & Infra
- Next.js 15 + Tailwind + shadcn/ui; Firebase Hosting
- Anonymous auth; per-user history (Clear/Delete with confirm)
- Batch Eval baseline OK; sweep edge=0.25, ins=3, del=4
- Tests: all green

### Env & Secrets
- `.env.local`: GOOGLE_GENAI_API_KEY, GENKIT_API_KEY, NEXT_PUBLIC_ENGINE_VERSION=2025-11-16-core-3
- Prod Functions secret: `firebase functions:secrets:set GOOGLE_GENAI_API_KEY`

### CI (recommended)
- Run tests + sweep; fail if accuracy < 0.42
- Save `reports/sweep_latest.csv`

### Next Steps
- Add 30–60 gold rows (incl. Gegë/Tosk pairs); re-run eval; commit predictions/confusion
- Export JSON button
- CI action for tests+sweep
- Deploy Hosting
