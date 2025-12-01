# Engine Export API v1

This document describes the HTTP API for exporting analysis results.

## Endpoints

### `GET /api/analyze`

Performs a full analysis of a single word and returns the complete `AnalysisResult` payload. This is the main endpoint used by the primary UI.

### `GET /api/analyze-core`

Core-only view of the Seven-Voices heart for a single word.

This endpoint runs the same engine as `/api/analyze` but only returns the `core` snapshot
(see **Engine core v2 – core snapshot**). It is designed for:

- Quick UI previews
- Lightweight exports
- Heart-only comparisons

#### Query parameters

- `word` (required) – word to analyze, e.g. `study`
- `mode` (optional) – `"strict"` or `"open"` (defaults to `"strict"`)
- `alphabet` (optional) – `"auto"` or a specific alphabet key (defaults to `"auto"`)
- `manifest` (optional) – engine manifest version to use (defaults to latest)

#### Example

```http
GET /api/analyze-core?word=study&mode=strict&alphabet=auto
```

Response:

```json
{
  "ok": true,
  "core": {
    "word": "study",
    "engineVersion": "2025-11-16-core-2",
    "input": { "...": "..." },
    "voices": { "...": "..." },
    "consonants": { "...": "..." },
    "heartPaths": { "...": "..." }
  }
}
```

The UI uses this in two ways:

Heart section: to render the “Seven-Voices Heart (Core)” card and summary.

Export JSON (Core only): when the “Core only (Heart)” checkbox is ticked, the export layer
calls /api/analyze-core and saves the core snapshot instead of the full analysis.
