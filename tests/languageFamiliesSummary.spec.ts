
import { buildLanguageFamiliesView } from '@/shared/resultsUI';
import type { AnalyzeWordResultUI, EngineLanguageFamily } from '@/shared/resultsUI';

describe('buildLanguageFamiliesView', () => {
  it('should return an empty array if analysis is null or undefined', () => {
    expect(buildLanguageFamiliesView(null)).toEqual([]);
    expect(buildLanguageFamiliesView(undefined)).toEqual([]);
  });

  it('should return an empty array if languageFamilies is empty or not provided', () => {
    const analysis: Partial<AnalyzeWordResultUI> = { languageFamilies: [] };
    expect(buildLanguageFamiliesView(analysis as AnalyzeWordResultUI)).toEqual([]);

    const analysis2: Partial<AnalyzeWordResultUI> = {};
    expect(buildLanguageFamiliesView(analysis2 as AnalyzeWordResultUI)).toEqual([]);
  });

  it('should correctly map language families to the view model', () => {
    const languageFamilies: EngineLanguageFamily[] = [
      {
        language: 'Latin',
        form: 'amor',
        passes: true,
        morphologyMatrix: { pivot: 'am' },
        symbolic: [{ tag: 'love' }],
      },
      {
        language: 'Albanian',
        form: 'dashuri',
        passes: true,
        experimental: true,
        speculative: false,
      },
      {
        language: 'Greek',
        form: 'agape',
        passes: true,
        speculative: true,
      },
      {
        language: 'German',
        form: 'liebe',
        passes: false,
      },
    ];

    const analysis: Partial<AnalyzeWordResultUI> = { languageFamilies };
    const result = buildLanguageFamiliesView(analysis as AnalyzeWordResultUI);

    expect(result).toHaveLength(4);

    expect(result[0]).toEqual({
      language: 'Latin',
      form: 'amor',
      pivot: 'am',
      status: 'core',
      tags: ['love'],
    });

    expect(result[1]).toEqual({
      language: 'Albanian',
      form: 'dashuri',
      pivot: '',
      status: 'experimental',
      tags: [],
    });

    expect(result[2]).toEqual({
      language: 'Greek',
      form: 'agape',
      pivot: '',
      status: 'speculative',
      tags: [],
    });

    expect(result[3]).toEqual({
      language: 'German',
      form: 'liebe',
      pivot: '',
      status: 'rejected',
      tags: [],
    });
  });
});
