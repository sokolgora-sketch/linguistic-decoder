# Open Instrument Local Provider Smoke Archive Design v0.1

Status: design only.

This document defines how local-provider smoke request/response artifacts should be archived for Open Instrument development work.

No smoke artifacts are added by this document.

This is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, and not a change to the default provider contract.

---

## 1. Purpose

Open Instrument now supports local provider smoke testing through the `openai_compat` provider path.

Recent local smoke docs recorded:

- weak Ollama `qwen2.5:0.5b` provider-pipe proof;
- cleaner Ollama `llama3.1:8b` single-word smoke;
- five-word Ollama `llama3.1:8b` smoke.

Those notes summarize results in prose.

Future local-provider comparison needs exact archived request/response artifacts so that model behavior can be inspected later without relying only on summary text.

This design defines the archive shape before larger smoke sets are run.

---

## 2. Claim Boundary

Archived local-provider smoke artifacts are development evidence only.

They may support statements such as:

- the local provider path ran;
- the parser handled the returned text;
- the verifier returned a structured result;
- a local model produced a specific response on a specific smoke word.

They may not support statements such as:

- the model is scientifically validated;
- the model is research-grade;
- the bracket model is supported;
- the result is publication evidence;
- the result belongs to Cohort evidence;
- the default provider should change from `mock`.

Default provider remains:

    mock

Local-provider smoke remains optional and manual.

---

## 3. Proposed Artifact Folder

Future local-provider smoke artifacts should be stored under:

    docs/open-instrument/artifacts/local-provider-smoke/

This folder is for small, curated JSON artifacts only.

Large raw dumps should not be committed without a separate design decision.

---

## 4. Proposed Naming Convention

Use this file name pattern:

    YYYY-MM-DD-open-instrument-local-smoke-<provider>-<model-slug>-<word-set-slug>-v0.1.json

Examples:

    2026-06-03-open-instrument-local-smoke-ollama-llama3-1-8b-study-v0.1.json
    2026-06-03-open-instrument-local-smoke-ollama-llama3-1-8b-five-word-v0.1.json
    2026-06-03-open-instrument-local-smoke-ollama-qwen2-5-0-5b-study-v0.1.json

Model slug rules:

- replace dots with hyphens;
- replace colons with hyphens;
- keep lowercase;
- avoid spaces.

Word-set slug rules:

- use `study` for single-word smoke;
- use `five-word` for the current five-word smoke set;
- use `ten-word` or `twenty-word` only after those sets are explicitly defined.

---

## 5. Required JSON Shape

Each archived local-provider smoke artifact should use this shape:

    {
      "archiveVersion": "v0.1",
      "artifactType": "open-instrument-local-provider-smoke",
      "createdAt": "YYYY-MM-DDTHH:mm:ssZ-or-local-with-offset",
      "repo": {
        "project": "ZË-RO",
        "repository": "sokolgora-sketch/linguistic-decoder",
        "commit": "<git sha>",
        "branch": "<branch name>",
        "workingTree": "clean"
      },
      "provider": {
        "provider": "openai_compat",
        "baseUrl": "http://localhost:11434/v1 or other local endpoint",
        "apiKey": "<set-hidden>",
        "model": "llama3.1:8b or qwen2.5:0.5b or other local model",
        "providerMode": "local-smoke"
      },
      "environmentSummary": {
        "os": "macOS version or similar short summary",
        "host": "local machine summary",
        "ollamaInstalled": true,
        "ollamaRunning": true
      },
      "modelSummary": {
        "modelSlug": "llama3-1-8b",
        "modelName": "llama3.1:8b",
        "notes": "short optional note"
      },
      "words": [
        "study"
      ],
      "runs": [
        {
          "word": "study",
          "mode": "strict",
          "requestSummary": {
            "provider": "openai_compat",
            "baseUrl": "http://localhost:11434/v1",
            "model": "llama3.1:8b",
            "maxAttempts": 3
          },
          "responseSummary": {
            "status": "PASS",
            "attemptsUsed": 1,
            "acceptedCandidateForms": ["study"]
          },
          "rawResponseText": "full raw model or API response text, preserved as text",
          "verifierResultSummary": {
            "results": [
              {
                "candidateForm": "study",
                "checks": [
                  {
                    "id": "OPS_ALLOWED",
                    "pass": true
                  }
                ]
              }
            ]
          },
          "vowelPathPresence": "present or absent",
          "claimBoundary": [
            "development evidence only",
            "not scientific evidence",
            "not publication evidence",
            "not eval evidence",
            "not Cohort evidence"
          ],
          "redactionStatus": {
            "apiKey": "<set-hidden>",
            "bearerToken": "<not stored>",
            "envDump": "<not stored>"
          }
        }
      ]
    }

Required metadata fields should be preserved in future revisions, even if some optional fields are blank.

---

## 6. Secret Redaction Rule

Never store:

- API keys;
- bearer tokens;
- full environment dumps.

If a key existed, record only a redacted presence marker such as:

    <set-hidden>

If a key did not exist, record that as:

    <unset>

Do not write secrets into notes, screenshots, logs, or git history.

---

## 7. Local Model Examples

Local model examples currently in scope:

- `qwen2.5:0.5b`
- `llama3.1:8b`

The current preferred local model is:

    llama3.1:8b

This preference is based on the local smoke docs that show cleaner output on the same development smoke path.

---

## 8. Vowel-Path Recording Rule

Archived local smoke artifacts must record whether `vowelPath` was present or absent.

This matters because `PATH_MATCH` can pass when `vowelPath` is absent in v0.1.

Therefore the archived record must preserve:

- whether `vowelPath` was included in the request or response;
- whether it was `present` or `absent`;
- whether the verifier passed despite omission.

Do not infer presence from a summary alone.

---

## 9. Future Workflow

The intended workflow for later local smoke work is:

1. run a local smoke;
2. save a JSON artifact in the proposed folder;
3. summarize the run in docs;
4. compare models only after multiple archived runs;
5. keep the claim boundary strict.

This archive design does not itself create the artifact collection workflow implementation.

---

## 10. Archive Status

This PR is design only.

No artifacts are added in this PR.

No existing smoke docs are rewritten to become the archive.

The current local smoke prose docs remain the source for human-readable summaries.

---

## 11. Completion Definition

This design is complete when:

- the archive folder and naming convention are defined;
- the JSON shape is defined;
- the secret redaction rule is defined;
- the preferred local model is named;
- the `PATH_MATCH` / absent `vowelPath` rule is documented;
- the claim boundary is explicit;
- no smoke artifacts are added in this PR.

Future local-provider smoke archives should follow this design unless a later design revision replaces it.

