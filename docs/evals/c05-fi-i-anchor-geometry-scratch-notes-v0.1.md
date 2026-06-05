# Finnish /i/ anchor-geometry scratch notes v0.1

Status: scratch only. Not publication evidence. Not cohort evidence.

## Question

Does Finnish /i/ high-region pressure come mainly from final-shape distribution,
or from anchor/bracket geometry?

## Evidence sequence

### 1) Original Finnish /i/ open/closed scratch — V6→V7

Series:
- c05-fi-i-open-closed-scratch-v0.1

Buckets:
- anchor_low: talo, kala, maa, sana, valo, sota, tapa, kukka, metsä, pöytä
- open-final x_vowel: lintu, silmä, sika, kirja, laiva, koira, leipä, liike, viha, piha
- closed-final x_vowel: ihminen, avain, kaunis, valmis, kallis, taivas, kirves, ilves, joutsen, puhelin
- anchor_high: ilo, ilma, ilta, isä, itä, kissa, viima, viileä, viiva, hiiva

Results:
- open-final r01: COLLAPSED_HIGH, normalizedPosition 1.091, gap_low 0.380, gap_high -0.032, flags BOUNDARY_UNCERTAIN_HIGH
- closed-final r02: COLLAPSED_HIGH, normalizedPosition 1.201, gap_low 0.418, gap_high -0.070, flags none

Interpretation:
- Final-shape alone does not explain the collapse.
- Both open-final and closed-final targets collapsed high.

### 2) Relabel-only V5→V7 scratch

Series:
- c05-fi-i-v5-v7-open-closed-scratch-v0.1

Change:
- anchorLow label changed from V6 to V5.
- Actual anchor_low bucket stayed unchanged:
  talo, kala, maa, sana, valo, sota, tapa, kukka, metsä, pöytä

Results:
- open-final r01: COLLAPSED_HIGH, normalizedPosition 1.091, gap_low 0.380, gap_high -0.032, flags BOUNDARY_UNCERTAIN_HIGH
- closed-final r02: COLLAPSED_HIGH, normalizedPosition 1.201, gap_low 0.418, gap_high -0.070, flags none

Interpretation:
- Relabelling anchorLow does not change scoring geometry.
- This confirms the scorer responds to actual token means, not bracket label alone.

### 3) Real V5→V7 scratch

Series:
- c05-fi-i-v5-real-v7-open-closed-scratch-v0.1

Change:
- anchor_low replaced with U-heavy/V5-ish bucket:
  puu, kuu, suu, luu, puku, luku, suru, muru, juttu, tuttu

Results:
- open-final r01: EXCEEDS_LOW, normalizedPosition 0.776, mean_low 0.400, mean_x 0.510, mean_high 0.542, gap_low -0.110, gap_high -0.032, flags BOUNDARY_UNCERTAIN_HIGH
- closed-final r02: EXCEEDS_LOW, normalizedPosition 0.506, mean_low 0.400, mean_x 0.472, mean_high 0.542, gap_low -0.072, gap_high -0.070, flags none

Interpretation:
- Real V5 anchor changed the behavior.
- Collapse-high did not survive once anchor_low became U-heavy.
- But the result overcorrected to EXCEEDS_LOW.
- This is not clean support; it is anchor-geometry instability.

### 4) V4→V7 scratch

Series:
- c05-fi-i-v4-v7-open-closed-scratch-v0.1

Change:
- anchor_low replaced with O/mid-style V4 bucket:
  talo, palo, valo, kolo, polo, poro, sopu, koti, ovi, onni

Results:
- open-final r01: COLLAPSED_HIGH, normalizedPosition 1.194, mean_low 0.705, mean_x 0.510, mean_high 0.542, gap_low 0.195, gap_high -0.032, flags BOUNDARY_UNCERTAIN_HIGH
- closed-final r02: COLLAPSED_HIGH, normalizedPosition 1.429, mean_low 0.705, mean_x 0.472, mean_high 0.542, gap_low 0.233, gap_high -0.070, flags none

Interpretation:
- V4→V7 did not rescue Finnish /i/.
- The target remains below the high anchor under aperturePresenceMean, producing high collapse.
- Compared with real V5→V7, this confirms the outcome is highly sensitive to anchor geometry.

## Current conclusion

Finnish /i/ scratch results do not support a clean bracket claim.

Best current wording:

Finnish /i/ shows anchor-geometry instability. Final-shape distribution alone does not explain the pressure. The original A/O-heavy V6-style low anchor and the V4-style low anchor both yield COLLAPSED_HIGH, while a U-heavy real V5 anchor flips the result to EXCEEDS_LOW. This suggests the high-region /i/ behavior is not a stable support signal under the current T5_INTERMEDIATE_V0_1 aperturePresenceMean geometry. Treat as scratch falsification-pressure / bracket-instability evidence only.

## Decision

Stop additional random scoring.

Recommended next work:
1. Write a scratch mechanism note.
2. Do not publish.
3. Do not mix with Open Instrument or Cohort publication evidence.
4. If continuing scientifically, design a proper anchor-family audit:
   - separate anchor semantic class,
   - target vowel contamination,
   - token length,
   - final-shape distribution,
   - aperturePresenceMean placement.
