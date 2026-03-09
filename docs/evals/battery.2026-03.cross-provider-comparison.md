# Evals Battery — Cross-Provider Comparison

Generated from baseline `SUMMARY.md` files in the repo.

## Side-by-side summary

| Provider | Fresh n | Fresh best | Fresh best p | Fresh neg/pos | Same n | Same best | Same best p | Same neg/pos | Quick read |
|---|---:|---|---:|---|---:|---|---:|---|---|
| Anthropic — Claude 4.6 Sonnet Extended | 12 | r07 | 0.267500 | 8/4 | 10 | r07 | 0.553583 | 5/5 | same-thread weaker best |
| DeepSeek — Deep Thinking | 12 | r01 | 0.047083 | 10/2 | 10 | r03 | 0.143083 | 6/4 | same-thread weaker best |
| Google — Gemini 3 Thinking | 12 | r07 | 0.138500 | 9/3 | 10 | r07 | 0.002333 | 2/8 | same-thread stronger best |
| OpenAI — ChatGPT 5.2 Thinking | 12 | r06 | 0.033000 | 12/0 | 10 | r09 | 0.086500 | 9/1 | same-thread weaker best |
| xAI — Grok Expert | 12 | r01 | 0.048917 | 10/2 | 10 | r04 | 0.006583 | 10/0 | same-thread stronger best |

## Provider details

### Anthropic — Claude 4.6 Sonnet Extended

| Condition | n | Best run | Best Pearson | Best Spearman | Best p_perm | Mean Pearson | Mean Spearman | Negative runs | Positive runs |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|
| Fresh-chat | 12 | r07 | -0.393367 | -0.500000 | 0.267500 | -0.095653 | -0.056548 | 8 | 4 |
| Same-thread | 10 | r07 | -0.310140 | -0.285714 | 0.553583 | -0.018611 | -0.014286 | 5 | 5 |

### DeepSeek — Deep Thinking

| Condition | n | Best run | Best Pearson | Best Spearman | Best p_perm | Mean Pearson | Mean Spearman | Negative runs | Positive runs |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|
| Fresh-chat | 12 | r01 | -0.807870 | -0.785714 | 0.047083 | -0.361766 | -0.336310 | 10 | 2 |
| Same-thread | 10 | r03 | -0.527302 | -0.642857 | 0.143083 | -0.059121 | -0.117857 | 6 | 4 |

### Google — Gemini 3 Thinking

| Condition | n | Best run | Best Pearson | Best Spearman | Best p_perm | Mean Pearson | Mean Spearman | Negative runs | Positive runs |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|
| Fresh-chat | 12 | r07 | -0.706142 | -0.642857 | 0.138500 | -0.238071 | -0.229167 | 9 | 3 |
| Same-thread | 10 | r07 | -0.479325 | -0.428571 | 0.002333 | 0.484839 | 0.478571 | 2 | 8 |

### OpenAI — ChatGPT 5.2 Thinking

| Condition | n | Best run | Best Pearson | Best Spearman | Best p_perm | Mean Pearson | Mean Spearman | Negative runs | Positive runs |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|
| Fresh-chat | 12 | r06 | -0.871341 | -0.821429 | 0.033000 | -0.774615 | -0.714286 | 12 | 0 |
| Same-thread | 10 | r09 | -0.758433 | -0.714286 | 0.086500 | -0.390692 | -0.332143 | 9 | 1 |

### xAI — Grok Expert

| Condition | n | Best run | Best Pearson | Best Spearman | Best p_perm | Mean Pearson | Mean Spearman | Negative runs | Positive runs |
|---|---:|---|---:|---:|---:|---:|---:|---:|---:|
| Fresh-chat | 12 | r01 | -0.758765 | -0.785714 | 0.048917 | -0.225028 | -0.255952 | 10 | 2 |
| Same-thread | 10 | r04 | -0.917299 | -0.928571 | 0.006583 | -0.559393 | -0.614286 | 10 | 0 |

## Source files

- Fresh Anthropic — Claude 4.6 Sonnet Extended: `tests/validation/baselines/evals.battery.2026-03/anthropic.claude46sonnetextended/SUMMARY.md`
- Same-thread Anthropic — Claude 4.6 Sonnet Extended: `tests/validation/baselines/evals.battery.2026-03-samethread/anthropic.claude46sonnetextended/SUMMARY.md`
- Fresh DeepSeek — Deep Thinking: `tests/validation/baselines/evals.battery.2026-03/deepseek.deepthinking/SUMMARY.md`
- Same-thread DeepSeek — Deep Thinking: `tests/validation/baselines/evals.battery.2026-03-samethread/deepseek.deepthinking/SUMMARY.md`
- Fresh Google — Gemini 3 Thinking: `tests/validation/baselines/evals.battery.2026-03/google.gemini3thinking/SUMMARY.md`
- Same-thread Google — Gemini 3 Thinking: `tests/validation/baselines/evals.battery.2026-03-samethread/google.gemini3thinking/SUMMARY.md`
- Fresh OpenAI — ChatGPT 5.2 Thinking: `tests/validation/baselines/evals.battery.2026-03/openai.chatgpt52thinking/SUMMARY.md`
- Same-thread OpenAI — ChatGPT 5.2 Thinking: `tests/validation/baselines/evals.battery.2026-03-samethread/openai.chatgpt52thinking/SUMMARY.md`
- Fresh xAI — Grok Expert: `tests/validation/baselines/evals.battery.2026-03/xai.grokexpert/SUMMARY.md`
- Same-thread xAI — Grok Expert: `tests/validation/baselines/evals.battery.2026-03-samethread/xai.grokexpert/SUMMARY.md`
