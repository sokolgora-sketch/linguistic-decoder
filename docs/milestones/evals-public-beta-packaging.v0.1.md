# Evals Public Beta Packaging v0.1

Status: active
Owner: Sokol + DF
Scope: landing page + /evals public beta packaging + battery operator readiness
Target: prepare ZË-RO Evals for public beta while Open Instrument and Voice Lab remain intentionally unavailable

---

## Goal

Ship a professional public beta centered on `/evals`, with:
- clear landing-page positioning
- trustworthy beta framing
- feedback/share entry points
- disabled-but-intentional future modules
- operator-ready runbook for fresh-chat vs same-thread testing across 5 AI systems

---

## Why this milestone exists

ZË-RO Evals is already strong as an internal instrument, but public beta requires:
- clearer product framing
- cleaner user guidance
- visible beta boundaries
- feedback collection
- shareability
- release discipline

This milestone packages the existing instrument into a credible public-facing beta.

---

## Non-goals

- Do not open Open Instrument yet
- Do not open Voice Lab yet
- Do not redesign the full research architecture
- Do not expand eval logic unless needed for beta usability
- Do not turn the site into a generic consumer product

---

## Release framing

Public-facing status:
- Live now: Evals beta
- Coming later: Open Instrument
- Coming later: Voice Lab

Product framing:
- Deterministic scorer
- No model calls inside `/evals`
- Users bring model outputs; ZË-RO scores them

---

## Milestone tracks

### Track A — Battery operator readiness
Goal: make repeated testing across 5 AI systems easy, consistent, and publishable.

Deliverables:
- [ ] Evals battery runbook doc
- [ ] exact per-model run procedure for fresh-chat
- [ ] exact per-model run procedure for same-thread
- [ ] naming convention for run IDs / provider / model / label
- [ ] folder convention for saved bundles / PDFs / summaries
- [ ] publish-ready evidence checklist for LingBuzz appendix/update

Done when:
- [ ] a full 5-model fresh-chat run can be executed without ambiguity
- [ ] a full 5-model same-thread run can be executed without ambiguity
- [ ] exported artifacts are consistent and reusable

---

### Track B — Landing page public-beta packaging
Goal: make the homepage professionally clear for first-time visitors.

Deliverables:
- [ ] hero copy says what ZË-RO is in one sentence
- [ ] primary CTA points to `/evals`
- [ ] secondary CTA points to paper / LingBuzz / docs
- [ ] explicit beta framing strip
- [ ] Open Instrument card marked “coming soon”
- [ ] Voice Lab card marked “coming soon”
- [ ] disabled modules feel intentional, not broken

Done when:
- [ ] a new visitor can understand the current product in under 20 seconds
- [ ] the page clearly distinguishes live vs coming-soon modules

---

### Track C — `/evals` public-beta packaging
Goal: keep the instrument feel, but make the page understandable and trustworthy for outside users.

Deliverables:
- [ ] short “how this works” block
- [ ] public beta wording near page title
- [ ] feedback entry point
- [ ] share entry point
- [ ] privacy / caution note for pasted content
- [ ] example run remains easy to test
- [ ] error/help copy feels public-facing, not internal-only

Done when:
- [ ] an outside user can run the page without needing repo context
- [ ] the page still feels like a scientific instrument, not a toy

---

### Track D — Release trust layer
Goal: make the beta feel deliberate and safe enough to share publicly.

Deliverables:
- [ ] release note / changelog entry
- [ ] basic feedback channel
- [ ] social share metadata
- [ ] beta terminology standardized across landing + `/evals`
- [ ] minimal privacy language for pasted data

Done when:
- [ ] the beta can be linked publicly without obvious trust gaps

---

## Acceptance criteria

This milestone is complete only when all of the following are true:
- [ ] battery runbook exists and is usable
- [ ] landing page clearly positions Evals beta as the live entry point
- [ ] `/evals` has feedback + share + beta framing
- [ ] Open Instrument and Voice Lab are visibly intentional placeholders
- [ ] public wording is consistent across landing and `/evals`
- [ ] release note exists
- [ ] all relevant UI/tests/build gates pass

---

## Proposed PR sequence

1. docs(evals): add battery operator runbook
2. feat(site): add public beta framing on landing
3. feat(site): add feedback/share entry points
4. fix(site): position disabled modules as coming soon
5. fix(evals): add public-facing onboarding/help/privacy copy
6. chore(site): add release note + beta metadata polish

---

## Risks

- Copy drift across landing and `/evals`
- Over-explaining the unfinished parts
- Public users misunderstanding upstream provenance fields
- Launching beta without a strong feedback loop
- Polishing too long instead of shipping

---

## Decision log

- `/evals` is the public beta entry point
- Open Instrument remains closed
- Voice Lab remains closed
- beta should feel intentional, not incomplete
- release quality means clarity + trust + repeatability, not just UI polish

---

## Definition of done

ZË-RO can be publicly shared as:

> ZË-RO Public Beta — deterministic evals now live; Open Instrument and Voice Lab coming later.

And the site supports that claim cleanly.
