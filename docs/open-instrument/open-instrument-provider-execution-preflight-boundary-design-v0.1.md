# Open Instrument Provider Execution Preflight Boundary Design v0.1

## Status

Design only.

No provider execution.
No model call.
No OpenAI API use.
No runtime/API/UI wiring.
No provider default change.
No artifact/report creation.
No publication framing.

## Purpose

This design defines the preflight requirements for a future provider execution lane.

It does not execute a provider.

It does not select a provider.

It does not modify provider defaults.

It does not create evidence.

It defines the boundary that must exist before any future provider/model execution can be authorized.

## Relationship to completed prior lane

This design follows the closed run packet fixture validation lane:

- PR #1305
- `docs(open-instrument): close run packet fixture validation lane`
- merge SHA `5c6e3ac55d0b539bc55132c69e0414863201fc13`
- short SHA `5c6e3ac5`

The prior lane closed static schema/traceability validation infrastructure only.

This new lane begins the design boundary for future provider execution preflight.

## Preflight inputs

Future preflight must require these inputs before provider execution can be considered:

- accepted run packet contract
- accepted static validation result
- provider identity
- provider endpoint class
- explicit provider execution authorization
- explicit model call authorization
- explicit artifact creation authorization, if artifacts are expected
- explicit report creation authorization, if reports are expected
- explicit rerun authorization, if rerun is expected
- explicit OpenAI API authorization, if OpenAI API is expected
- provider default snapshot
- expected output capture path
- failure-mode policy
- no-fallback policy
- no-silent-rerun policy

These inputs are preflight requirements only.

They do not authorize execution by themselves.

## Required preflight checks

Future preflight must check:

- run packet exists
- run packet schema version is accepted
- run packet identity is stable
- provider is explicit
- model is explicit
- endpoint type is explicit
- authorization flags are explicit
- provider execution is false unless explicitly approved
- model call authorization is false unless explicitly approved
- artifact creation is false unless explicitly approved
- rerun authorization is false unless explicitly approved
- OpenAI API authorization is false unless explicitly approved
- provider default state is captured before execution
- no fallback provider is allowed
- no implicit provider switch is allowed
- no implicit model switch is allowed
- no implicit retry is allowed
- no runtime/API/UI path may initiate provider execution
- all execution must be traceable to a reviewed run packet

These checks are future design targets.

They do not execute a provider.

## Stop conditions

Future preflight must stop on:

- missing run packet
- invalid schema
- unknown provider
- unknown model
- ambiguous endpoint type
- missing authorization field
- authorization field drift
- OpenAI API ambiguity
- provider default ambiguity
- missing provider default snapshot
- missing output capture path
- missing failure policy
- unexpected runtime/API/UI route
- unreviewed prompt source
- unreviewed fixture/source mutation
- unreviewed artifact/report creation path
- dirty repo state
- open unrelated non-dependency PRs
- failing static validation
- failing CI checks

These are stop conditions for future authorization design, not execution fallback rules.

## Allowed future execution path

A future provider execution lane may proceed only after:

1. preflight design is reviewed;
2. preflight implementation is designed and reviewed;
3. run packet is reviewed;
4. provider execution is explicitly authorized;
5. capture path is explicitly approved;
6. failure-mode policy is explicit;
7. no-fallback/no-silent-rerun policy is explicit;
8. local/static validation passes;
9. CI checks pass.

Do not skip directly to provider execution.

## Provider/network/API boundary

This design does not call providers.

This design does not call OpenAI API.

This design does not inspect live provider defaults.

This design does not mutate provider defaults.

This design does not add fallback providers.

This design does not add retries.

This design does not add API routes.

## Runtime/API/UI boundary

This design does not add runtime/API/UI wiring.

Future runtime/API/UI exposure requires separate design and review.

Provider execution must not be reachable from public UI until explicitly designed and reviewed.

Provider execution must not be implicitly triggered by analyze/propose/evals routes.

## Artifact/report boundary

This design does not create artifacts.

This design does not create reports.

Future artifact/report creation requires separate design and review.

Preflight output is not publication evidence.

## Evidence boundary

Design output is not candidate-truth evidence.

Design output is not origin evidence.

Design output is not model-quality evidence.

Design output is not publication evidence.

Design output is preflight boundary design only.

## Future review target

The next accepted action after this design lands is:

`docs/open-instrument: review provider execution preflight boundary design`

The review should:

- verify design-only posture;
- verify no provider/model execution;
- verify no OpenAI API use;
- verify no runtime/API/UI wiring;
- verify no artifact/report creation;
- verify no provider default changes;
- verify preflight stop conditions are explicit;
- verify failure handling does not authorize fallback execution.
