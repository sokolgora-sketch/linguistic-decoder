# Zheji Semantic Transparency Layer v0.1 — Milestone

Status: PLANNED.

Date opened: 2026-06-19.

Project lane: Open Instrument / ZËRO.

## Purpose

This milestone defines the safe Open Instrument contract for a Zheji-inspired semantic transparency layer.

The goal is to let ZËRO describe how a word may be meaning-motivated through small functional carriers without claiming historical origin, linguistic ownership, or final truth.

This milestone is design-first. It does not authorize runtime implementation by itself.

## Why this milestone is next

The dependency-security cleanup lane is complete.

Before adding new engine behavior, replay behavior, consonant-frame extraction, UI output, or provider-assisted analysis, the project needs a locked semantic transparency contract.

This milestone protects ZËRO from three risks:

* overstating meaning-motivation as historical origin
* treating candidate carriers as proof of ownership
* allowing model/provider output to become evidence without a contract

## Core framing

ZËRO should speak in these terms:

* semantic motivation
* functional carrier
* embryo morpheme
* candidate transparency
* witness strength
* non-origin claim
* non-ownership claim

ZËRO must not speak in these terms unless a later reviewed contract explicitly permits it:

* proven origin
* true origin
* ownership proof
* final etymology
* candidate truth
* historical certainty
* publication-grade evidence

## Zheji alignment

This milestone may use Petro Zheji-inspired terminology as a framing reference, but only with strict boundaries.

Allowed conceptual anchors:

* Free Operator
* Code F
* Code E
* semantic transparency
* function-first word analysis

Required boundary:

* These terms are used as interpretive/terminological anchors, not as proof that ZËRO has established historical origin.

## Planned layer contract

The future design document should define:

* semanticTransparency object shape
* candidate functional carriers
* Free Operator eligibility
* Code F / Code E flags
* isolation audit
* witness levels
* null result behavior
* forbidden claim labels
* source-note language
* examples and non-examples

## Free Operator eligibility draft

A candidate may be treated as a Free Operator only if it is:

* standalone
* functional
* small or bare enough to carry independent meaning
* present in the target language evidence set
* not only a forced substring
* not only a poetic association

A candidate should be rejected or downgraded if it requires:

* major semantic stretching
* hidden morphology
* unproved historical ownership
* forced phonetic similarity
* provider-only support
* unanchored intuition

## Code F / Code E draft

Code F should mean formal or functional visibility.

Code E should mean symbolic or experiential visibility.

These must be independent booleans or labels. One must not imply the other.

Neither Code F nor Code E proves origin.

## Truth posture

The layer must preserve the existing ZËRO truth posture:

* no single winner
* null is allowed
* candidates are candidates
* evidence must be anchored
* output must separate fact, inference, and hypothesis
* no historical ownership claim
* no provider result as evidence unless separately authorized

## Explicit non-goals

This milestone does not authorize:

* provider execution
* Zheji replay
* OpenAI API use
* local Ollama use
* runtime/API wiring
* UI wiring
* source-engine provenance changes
* evidence-pack generation
* publication framing
* candidate-truth evidence
* origin evidence
* model-quality evidence
* consonant-frame extraction
* Harmony work
* VoiceLab work

## Protected boundaries

The following must remain unchanged unless a later exact authorization says otherwise:

* API routes
* runtime analysis endpoints
* UI rendering surfaces
* provider execution scripts
* source-engine provenance behavior
* evidence pack generation
* Open Instrument quarantine behavior

## Planned PR sequence

This milestone should be executed in small PRs:

1. Open milestone doc.
2. Design semantic transparency contract.
3. Review semantic transparency contract.
4. Add passive schema or fixture only if the design is accepted.
5. Add tests only after schema/fixture scope is accepted.
6. Close milestone as DONE only after validation and DF_BRAIN update.

## Completion criteria

This milestone can be closed as DONE only when:

* the semantic transparency design contract exists
* forbidden claims are listed
* null behavior is defined
* Free Operator eligibility is defined
* Code F / Code E semantics are defined
* evidence/witness levels are defined
* scope boundaries are preserved
* tests or docs prove no runtime/provider/UI wiring was added unless separately authorized
* DF_BRAIN records the closure

## Current next task

`docs(open-instrument): design zheji semantic transparency layer v0.1`
