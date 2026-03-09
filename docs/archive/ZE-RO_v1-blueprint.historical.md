# ZË-RO v1 – Minimal One-Page Engine Blueprint

Version: v1.0 (draft)  
Owner: Sokol / DF  
Date: 2025-12-18

---

## 0. Purpose

ZË-RO v1 is a **single-word analysis engine**:

User types a word → engine returns 1–3 structured candidates with short explanations, all on one page.

No modes, no dashboards, no Zheji section, no stress telemetry, no emotions/trust.

---

## 1. Scope of v1

### In scope
- One main page: `/`
  - Single input for `word`
  - “Analyze” button
  - Results rendered in one continuous scroll

- One API endpoint: `/api/analyze`
  - Request: `{ word: string }`
  - Response: `AnalysisResult`

- Engine
  - Normalize input
  - Generate 1–N candidates (text only)
  - Deterministic output (same input → same output)

- Advanced
  - Toggle: “Show raw JSON”

### Out of scope (v1)
- Strict vs Explore modes
- Zheji / Petro Zheji section
- Stress UI / telemetry
- Emotion overlays / Trust Geometry
- Consonant Atlas visualization
- Multi-word / sentence analysis
- Visual charts / orbit diagrams

All delayed to v1.1+ / v2.

---

## 2. UX Blueprint – One Page (ChatGPT-style)

### Layout
**Header**
- ZË-RO
- Subtitle: “Seven-Voices word decoder.”

**Input**
- Text field: “Enter a word…”
- Button: “Analyze”

**Results (single scroll)**
- Word: `<word>`
- Normalized: `<normalizedWord>` (optional)

For each `candidates[]` item:

Candidate N — `<language>`

- Form: `<form>`
- Decomposition: `part1 – part2 – …`
- Vowel path: `<vowelPath>`
- Meaning: `<functionalStatement>`
- Notes (optional):
  - `note 1`
  - `note 2`

**Advanced**
- Link: “Show raw JSON” (default hidden)
- Shows the full `AnalysisResult` JSON pretty-printed

### States
- Initial: input only
- Loading: disable button, show “Analyzing…”
- Error: simple message, no complex UI

---

## 3. Engine Contract – v1 Types

```ts
export interface AnalysisResult {
  word: string;
  normalizedWord: string;
  candidates: Candidate[];
  engineVersion: string; // "v1.0.0"
}

export interface Candidate {
  language: string;            // "sq", "la", "en", "unknown", etc.
  form: string;
  decomposition: string[];
  vowelPath: string;           // "A-I-Ë"
  functionalStatement: string; // 1–2 sentences
  notes?: string[];
}


Rules:

Same input → same output

No numeric scores exposed

candidates[0] is “primary” for UI ordering only
```