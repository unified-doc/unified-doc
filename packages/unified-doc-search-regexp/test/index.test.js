import searchRegexp from '../../unified-doc-search-regexp';

const content = 'a TO the b TO the c';

describe('searchRegexp', () => {
  it('returns empty array for empty content', () => {
    expect(searchRegexp(null)).toEqual([]);
    expect(searchRegexp('')).toEqual([]);
  });

  it('returns empty array for non-matching patterns', () => {
    expect(searchRegexp(content, { pattern: 'd' })).toEqual([]);
    expect(searchRegexp(content, { pattern: 'tothe' })).toEqual([]);
  });

  it('returns offsets for simple patterns', () => {
    expect(searchRegexp(content, { pattern: 't' })).toEqual([
      { start: 2, end: 3, value: 'T' },
      { start: 5, end: 6, value: 't' },
      { start: 11, end: 12, value: 'T' },
      { start: 14, end: 15, value: 't' },
    ]);
    expect(searchRegexp(content, { pattern: 'to' })).toEqual([
      { start: 2, end: 4, value: 'TO' },
      { start: 11, end: 13, value: 'TO' },
    ]);
    expect(searchRegexp(content, { pattern: 'the' })).toEqual([
      { start: 5, end: 8, value: 'the' },
      { start: 14, end: 17, value: 'the' },
    ]);
  });

  it('returns offsets for complex patterns', () => {
    expect(searchRegexp(content, { pattern: 'a|b|c' })).toEqual([
      { start: 0, end: 1, value: 'a' },
      { start: 9, end: 10, value: 'b' },
      { start: 18, end: 19, value: 'c' },
    ]);
    expect(searchRegexp(content, { pattern: '(?<=TO).*(?=TO)' })).toEqual([
      { start: 4, end: 11, value: ' the b ' },
    ]);
  });

  it('handles case sensitivity', () => {
    expect(
      searchRegexp(content, { isCaseSensitive: false, pattern: 'to' }),
    ).toEqual([
      { start: 2, end: 4, value: 'TO' },
      { start: 11, end: 13, value: 'TO' },
    ]);
    expect(
      searchRegexp(content, { isCaseSensitive: false, pattern: 'TO' }),
    ).toEqual([
      { start: 2, end: 4, value: 'TO' },
      { start: 11, end: 13, value: 'TO' },
    ]);
    expect(
      searchRegexp(content, { isCaseSensitive: true, pattern: 'to' }),
    ).toEqual([]);
    expect(
      searchRegexp(content, { isCaseSensitive: true, pattern: 'TO' }),
    ).toEqual([
      { start: 2, end: 4, value: 'TO' },
      { start: 11, end: 13, value: 'TO' },
    ]);
  });

  it('handles min match character length', () => {
    expect(
      searchRegexp(content, { minMatchCharLength: 0, pattern: 't' }),
    ).toEqual([
      { start: 2, end: 3, value: 'T' },
      { start: 5, end: 6, value: 't' },
      { start: 11, end: 12, value: 'T' },
      { start: 14, end: 15, value: 't' },
    ]);
    expect(
      searchRegexp(content, { minMatchCharLength: 1, pattern: 't' }),
    ).toEqual([
      { start: 2, end: 3, value: 'T' },
      { start: 5, end: 6, value: 't' },
      { start: 11, end: 12, value: 'T' },
      { start: 14, end: 15, value: 't' },
    ]);
    expect(
      searchRegexp(content, { minMatchCharLength: 2, pattern: 't' }),
    ).toEqual([]);
    expect(
      searchRegexp(content, { minMatchCharLength: 2, pattern: 'to' }),
    ).toEqual([
      { start: 2, end: 4, value: 'TO' },
      { start: 11, end: 13, value: 'TO' },
    ]);
    expect(
      searchRegexp(content, { minMatchCharLength: 3, pattern: 'to' }),
    ).toEqual([]);
  });
});
