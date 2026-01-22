# UI Safety Contract v1 — Text-slot Rendering

This contract prevents React runtime crashes caused by rendering non-renderable values (objects, arrays, malformed VM fields) in JSX text slots.

Scope:
- Instrument UI and related UI-only panels
- Applies to any `{...}` interpolation that ends up inside a text slot (e.g. `<div>{x}</div>`, `<span>{x}</span>`)

## Rules

### 1) If the value is not provably a string, use `safeText(x)`
Use `safeText(x)` when:
- The value comes from `vm` or any `PresentOrMissing<T>` wrapper where T is not strictly `string`
- The value may be `unknown`, `any`, `object`, or union types
- The value is derived from data that could be malformed or partially missing

Examples:
- Debug panels rendering VM fields
- Optional strings that could become objects due to contract drift

### 2) If the value is provably a primitive or already formatted, `String(x)` is acceptable
Use `String(x)` when:
- `x` is `string | number | boolean | null | undefined`
- You are inside a `renderPOM(...)` callback and want a stable primitive render

Examples:
- `renderPOM(readout.engineVersion, (v) => <span>{String(v)}</span>)`

### 3) Domain helpers are preferred for structured display
Use domain helpers when the semantic format matters and the input is well-typed:
- Paths: `formatPath(vowels)` or `arr.join(" → ")` for `string[]`
- Lists: explicit `.join(", ")` on `string[]`
- Numbers: `Number(x ?? 0)` for numeric display

### 4) Never render objects directly in JSX text slots
Forbidden:
- `<div>{someObject}</div>`
- `<span>{maybe.value}</span>` when `maybe.value` is not strictly `string | number`

If you must display a structure:
- Use `safeText(...)` for a defensive string
- Or use `JSON.stringify(x, null, 2)` inside `<pre>` (debug only)

## Enforcement

- Guard tests must fail if UI renders raw objects into text slots.
- UI should prefer “fail-visible” output (safe fallback strings) over runtime crashes.

