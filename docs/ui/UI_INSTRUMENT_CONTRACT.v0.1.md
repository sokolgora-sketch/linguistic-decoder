# UI Instrument Contract v0.1

## 1. Authority Chain (NON-NEGOTIABLE)

UI AUTHORITY ORDER (highest → lowest):

1.  `evidence`
2.  `heart` (source only, never numeric authority)
3.  `deepRoot` / `candidates` (hypotheses only)
4.  `raw` (inspection only)

UI MUST NOT:
-   Compute numeric values from `heart`
-   Infer meaning from absence of `evidence`
-   Promote candidates to authority

If a UI component violates this, it is incorrect, even if it “looks helpful”.

---

## 2. Read Rules (Field-Level)

### FIELD READ RULES

| Field | Rules |
| :--- | :--- |
| `evidence.math7` | - MAY: drive numeric displays, badges, counts<br>- MUST: be the only numeric source<br>- MUST: show backfill signal if present |
| `heart.math7` | - MAY: be shown as source mirror<br>- MUST NOT: drive UI decisions |
| `candidates[]` | - MAY: be displayed<br>- MUST NOT: be ranked, scored, or implied as correct |
| `missing field` | - MUST render: "Not emitted by engine (yet)"<br>- MUST NOT render empty UI |

---

## 3. Evidence-First Law (single paragraph, frozen)

### EVIDENCE-FIRST LAW

If a value exists in `evidence`, the UI must use it.
If it does not exist in `evidence`, the UI must not reconstruct it.
If it does not exist at all, the UI must say so explicitly.

This sentence protects the project long-term.

---

## 4. Signal Taxonomy (Minimal, Explicit)

### SIGNAL LEVELS

| Level | Meaning |
| :--- | :--- |
| GREEN | Native emission (engine-derived) |
| AMBER | Backfilled / derived with explicit signal |
| GRAY | Not emitted by engine (yet) |
| RED | Contract violation or error |

No more colors. No gradients. No creativity.

---

## 5. Section Responsibilities (Hard Boundaries)

**READOUT PANEL**
-   Shows: what ran + what was detected
-   Zero interpretation

**EVIDENCE / OPS LEDGER**
-   Shows: why output occurred
-   No summaries, no opinions

**CANDIDATES**
-   Shows: hypothesis space
-   Must be visually non-authoritative

**MATH & LENSES**
-   Shows only emitted telemetry
-   Never computed client-side

**RAW JSON**
-   Inspection only
-   Never required for understanding

If a section crosses its boundary, it is wrong.

---

## 6. Empty-State Doctrine

### EMPTY STATE POLICY

Empty ≠ Error.
Empty = Measured absence.

The UI must prefer:
`"None emitted by engine vX.Y"`
over silence or placeholder graphics.

This is what makes it a scientific instrument.
