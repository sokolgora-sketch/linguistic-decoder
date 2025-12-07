// tests/symbolicSummary.spec.ts
import { buildSymbolicSummary } from '../src/shared/resultsUI';
import type { AnalyzeWordResultUI } from '../src/shared/resultsUI';

describe('buildSymbolicSummary', () => {
  it('returns null if analysis is null or undefined', () => {
    expect(buildSymbolicSummary(null)).toBeNull();
    expect(buildSymbolicSummary(undefined)).toBeNull();
  });

  it('returns null if symbolic property is missing', () => {
    const analysis = { word: 'test' } as any;
    expect(buildSymbolicSummary(analysis)).toBeNull();
  });

  it('returns null if symbolic.notes is missing or empty', () => {
    const analysis1 = { symbolic: {} } as any;
    expect(buildSymbolicSummary(analysis1)).toBeNull();

    const analysis2 = { symbolic: { notes: [] } } as any;
    expect(buildSymbolicSummary(analysis2)).toBeNull();
  });

  it('deduplicates, trims, and filters notes', () => {
    const analysis = {
      symbolic: {
        label: "Test Label",
        notes: [
          " A force that draws things together. ",
          "Another note.",
          "A force that draws things together.",
          "",
          "  ",
          null,
        ],
      },
    } as any;

    const summary = buildSymbolicSummary(analysis);
    expect(summary?.notes).toEqual([
      "A force that draws things together.",
      "Another note.",
    ]);
  });

  it('uses the provided label or a default', () => {
    const analysisWithLabel = {
      symbolic: {
        label: "Custom Label",
        notes: ["note 1"],
      },
    } as any;
    const summary1 = buildSymbolicSummary(analysisWithLabel);
    expect(summary1?.label).toBe("Custom Label");

    const analysisWithoutLabel = {
      symbolic: {
        notes: ["note 1"],
      },
    } as any;
    const summary2 = buildSymbolicSummary(analysisWithoutLabel);
    expect(summary2?.label).toBe("Symbolic reading (experimental)");
  });

  it('limits notes to the first 5 unique entries', () => {
    const analysis = {
      symbolic: {
        notes: ["1", "2", "3", "4", "5", "6", "1", "2"],
      },
    } as any;
    const summary = buildSymbolicSummary(analysis);
    expect(summary?.notes).toHaveLength(5);
    expect(summary?.notes).toEqual(["1", "2", "3", "4", "5"]);
  });
});
