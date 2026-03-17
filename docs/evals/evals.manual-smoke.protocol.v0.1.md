# Evals Manual Smoke Protocol v0.1

Purpose: quick browser + export verification after UI or scorer-facing changes.

## Route coverage

- `/`
- `/evals`

## Landing page checks

1. Open `/`.
2. Confirm the top evidence strip rotates calmly item-by-item, not as a continuous stock-ticker marquee.
3. Confirm the landing hero and evals entry CTA render without overlap or clipping.

## Evals page checks

1. Open `/evals`.
2. Confirm **Input source** shows:
   - left card: **Upload JSON**
   - right card: **Paste JSON**
3. Confirm the Upload and Paste cards align cleanly at the top and bottom on desktop width.
4. Confirm the upload helper copy reads:
   - top: `Use a saved eval bundle or buckets-only JSON.`
   - bottom: `Accepts full evalRun.v0.1 bundles or buckets-only JSON.`
5. Click **Load example**.
6. Confirm scored state appears.
7. Confirm **Scored summary** renders:
   - Consistency bar
   - Pearson r
   - Spearman ρ
   - p_perm
   - Compliance
8. Confirm diagnosis logic:
   - strong negative rho => green aligned state
   - positive rho => inversion state
9. Confirm **Aperture trend by bucket** chart renders with:
   - solid bucket-means path
   - dashed linear trend
10. Confirm **Report** renders:
    - specId
    - evalSpecVersion
    - runId
11. Confirm **Device plate** renders:
    - engineVersion
    - evalSpecVersion
    - taskId
    - taskVersion
    - promptHash
    - exportedAtUtc
    - seedPrimary
    - seedPresenceMean
    - permItersPrimary
    - permItersPresenceMean
    - scorerBuild
    - baselineRef
12. Confirm **Markdown export preview** renders and copy works.
13. Switch to buckets-only mode and confirm task prompt copy becomes enabled.

## PDF export checks

1. From a scored run, click **Download PDF**.
2. Open the exported PDF.
3. Confirm footer/device-plate provenance is visibly present.
4. Confirm the PDF chart still shows:
   - solid bucket-means path
   - dashed linear trend
5. Confirm runId / task provenance / build provenance are readable.

## Pass criteria

- no layout collision
- no missing summary sections
- no missing device-plate provenance
- no diagnosis inversion bug
- no PDF footer regression
