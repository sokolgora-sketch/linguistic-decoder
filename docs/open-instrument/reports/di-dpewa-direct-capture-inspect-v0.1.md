# Open Instrument — DI DPEWA Direct Capture Inspect v0.1

## Status
Inspect-only evidence capture. No DI row patch.

## Purpose
Check whether the direct DPEWA locator currently yields enough visible artifact data to support a later DI source-row patch.

## 1. target URLs

- DPEWA direct target: https://www.dpwa.gwi.uni-muenchen.de/dictionary/?lemmaid=14150
- Wiktionary bridge: https://en.wiktionary.org/wiki/di#Albanian
- FJALË comparison: https://fjale.al/di

## 2. DPEWA signal grid

| Signal | Present |
|---|---|
| has_html | YES |
| mentions_di | NO |
| mentions_ditur | NO |
| mentions_dita | NO |
| mentions_know | NO |
| mentions_demiraj | NO |
| mentions_dictionary | YES |

## 3. Wiktionary bridge signal grid

| Signal | Present |
|---|---|
| mentions_di | YES |
| mentions_dita | YES |
| mentions_ditur | YES |
| mentions_to_know | YES |
| mentions_dpewa | YES |
| mentions_fgjsh | YES |

## 4. FJALË comparison signal grid

| Signal | Present |
|---|---|
| mentions_di | YES |
| mentions_dita | NO |
| mentions_ditur | YES |
| mentions_di_as_entry | YES |

## 5. extracted snippets

### dpewa_di
```
NO_MATCH
```

### dpewa_know
```
NO_MATCH
```

### wikt_morph
```
ʰ(e)yHe/o- ( “ to consider, think ” ) or Proto-Indo-European *diHyé/ó- ( “ to consider, think ” ) . [ 1 ] Verb [ edit ] di ( aorist dita , participle ditur ) to know Nuk e di . I don't know. Do të doja të dija më shumë rreth teje. I'd like to know more about you. Conjugation [ edit ] Standard Albanian conjugation of di (active voice) Show compound tenses: participle ditur
```

### fjale_di
```
Di ‹ kuptimi ‹ FJALË FJALË Fjalor Shqip DI kal. 1. Kam njohuri pak a shumë të plota ose të veçanta për diçka e njoh mirë diçka pasi e kam parë, e kam dëgjuar, e kam studiuar etj.; e kam mësuar diçka, e zotëroj. Di dy gjuhë. E di drejtshkrimin. E di mirë shqipen
```

## 6. decision frame

- If DPEWA direct page visibly exposes DI lemma data, move to exact field-fill lane.
- If DPEWA direct page does not expose enough visible data, DI stays blocked and source closure remains unresolved.
- Do not patch DI row from bridge metadata alone.
- Do not reuse DA DOI for DI.

## 7. raw files

- /tmp/zero_di_dpewa_capture/dpewa.html
- /tmp/zero_di_dpewa_capture/dpewa.headers.txt
- /tmp/zero_di_dpewa_capture/wiktionary.html
- /tmp/zero_di_dpewa_capture/fjale.html
