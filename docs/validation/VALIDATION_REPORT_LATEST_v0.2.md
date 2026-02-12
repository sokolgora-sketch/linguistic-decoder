# ZË-RO External Validation Report v0.2

**Dataset:** validation.dataset.v0.2
**Counts:** full=50, train=39, holdout=11
**Baseline:** match

## Dataset summary

| Lang | Count |
| --- | --- |
| en | 18 |
| el | 16 |
| it | 8 |
| sq | 8 |

| Tag | Count |
| --- | --- |
| nature | 14 |
| kinship | 11 |
| body | 10 |
| food | 5 |
| tool | 3 |
| emotion | 2 |
| systems | 2 |
| culture | 1 |
| law | 1 |
| music | 1 |

## Mismatch (mask vs carrier)

with IPA: 50
mismatches: 26
rate: 0.52

## Clustering (lower within-tag distance is better)

| Space | withinAvg | acrossAvg | delta(across-within) |
| --- | --- | --- | --- |
| voiceSpace | 1.757282 | 1.8263 | 0.069019 |
| baseline:vowelCount | 0.674757 | 0.57998 | -0.094777 |
| baseline:orthography | 1.927184 | 1.952895 | 0.025711 |
| control:shuffledTags | 1.868932 | 1.803729 | -0.065203 |

## Top mismatches

| id | lang | word | ipa | ortho | ipaVoices | dist |
| --- | --- | --- | --- | --- | --- | --- |
| en_daughter_v0_2 | en | daughter | /ˈdɔːtər/ | AUE | OË | 3 |
| el_aima_v0_2 | el | αίμα | /ˈema/ | AIA | EA | 2 |
| el_ouranos_poly_v0_2 | el | οὐρανός | /u.raˈnos/ | OYAO | UAO | 2 |
| el_psyche_v0_2 | el | ψυχή | /psiˈçi/ | YE | II | 2 |
| en_blood_v0_2 | en | blood | /blʌd/ | OO | Ë | 2 |
| en_brother_v0_2 | en | brother | /ˈbrʌðər/ | OE | ËË | 2 |
| en_island_v0_2 | en | island | /ˈaɪlənd/ | IA | AIË | 2 |
| en_knife_v0_2 | en | knife | /naɪf/ | IE | AI | 2 |
| en_moon_v0_2 | en | moon | /muːn/ | OO | U | 2 |
| en_mother_v0_2 | en | mother | /ˈmʌðər/ | OE | ËË | 2 |

## Diagnostics

notesCount: 0

| orthography unmapped | count |
| --- | --- |

| ipa unmapped | count |
| --- | --- |
