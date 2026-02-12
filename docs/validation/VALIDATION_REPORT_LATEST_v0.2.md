# ZË-RO External Validation Report v0.2

**Dataset:** validation.dataset.v0.2
**Counts:** full=12, train=9, holdout=3
**Baseline:** match

## Dataset summary

| Lang | Count |
| --- | --- |
| en | 6 |
| el | 4 |
| it | 1 |
| sq | 1 |

| Tag | Count |
| --- | --- |
| nature | 3 |
| body | 2 |
| kinship | 2 |
| tool | 2 |
| food | 1 |
| music | 1 |
| systems | 1 |

## Mismatch (mask vs carrier)

with IPA: 12
mismatches: 6
rate: 0.5

## Clustering (lower within-tag distance is better)

| Space | withinAvg | acrossAvg | delta(across-within) |
| --- | --- | --- | --- |
| voiceSpace | 2.166667 | 1.783333 | -0.383333 |
| baseline:vowelCount | 0.5 | 0.466667 | -0.033333 |
| baseline:orthography | 1.833333 | 1.783333 | -0.05 |
| control:shuffledTags | 2 | 1.8 | -0.2 |

## Top mismatches

| id | lang | word | ipa | ortho | ipaVoices | dist |
| --- | --- | --- | --- | --- | --- | --- |
| en_island_v0_2 | en | island | /ˈaɪlənd/ | IA | AIË | 2 |
| en_knife_v0_2 | en | knife | /naɪf/ | IE | AI | 2 |
| en_rhythm_v0_2 | en | rhythm | /ˈɹɪðəm/ | Y | IË | 2 |
| en_water_v0_2 | en | water | /ˈwɔːtəɹ/ | AE | OË | 2 |
| en_bread_v0_2 | en | bread | /bɹɛd/ | EA | E | 1 |
| en_father_v0_2 | en | father | /ˈfɑːðəɹ/ | AE | AË | 1 |

## Diagnostics

notesCount: 0

| orthography unmapped | count |
| --- | --- |

| ipa unmapped | count |
| --- | --- |
