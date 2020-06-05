import searchRegexp from '~/unified-doc-search-regexp';

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
      [2, 3, 'T'],
      [5, 6, 't'],
      [11, 12, 'T'],
      [14, 15, 't'],
    ]);
    expect(searchRegexp(content, { pattern: 'to' })).toEqual([
      [2, 4, 'TO'],
      [11, 13, 'TO'],
    ]);
    expect(searchRegexp(content, { pattern: 'the' })).toEqual([
      [5, 8, 'the'],
      [14, 17, 'the'],
    ]);
  });

  it('returns offsets for complex patterns', () => {
    expect(searchRegexp(content, { pattern: 'a|b|c' })).toEqual([
      [0, 1, 'a'],
      [9, 10, 'b'],
      [18, 19, 'c'],
    ]);
    expect(searchRegexp(content, { pattern: '(?<=TO).*(?=TO)' })).toEqual([
      [4, 11, ' the b '],
    ]);
  });

  it('handles case sensitivity', () => {
    expect(
      searchRegexp(content, { isCaseSensitive: false, pattern: 'to' }),
    ).toEqual([
      [2, 4, 'TO'],
      [11, 13, 'TO'],
    ]);
    expect(
      searchRegexp(content, { isCaseSensitive: false, pattern: 'TO' }),
    ).toEqual([
      [2, 4, 'TO'],
      [11, 13, 'TO'],
    ]);
    expect(
      searchRegexp(content, { isCaseSensitive: true, pattern: 'to' }),
    ).toEqual([]);
    expect(
      searchRegexp(content, { isCaseSensitive: true, pattern: 'TO' }),
    ).toEqual([
      [2, 4, 'TO'],
      [11, 13, 'TO'],
    ]);
  });

  it('handles min match character length', () => {
    expect(
      searchRegexp(content, { minMatchCharLength: 0, pattern: 't' }),
    ).toEqual([
      [2, 3, 'T'],
      [5, 6, 't'],
      [11, 12, 'T'],
      [14, 15, 't'],
    ]);
    expect(
      searchRegexp(content, { minMatchCharLength: 1, pattern: 't' }),
    ).toEqual([
      [2, 3, 'T'],
      [5, 6, 't'],
      [11, 12, 'T'],
      [14, 15, 't'],
    ]);
    expect(
      searchRegexp(content, { minMatchCharLength: 2, pattern: 't' }),
    ).toEqual([]);
    expect(
      searchRegexp(content, { minMatchCharLength: 2, pattern: 'to' }),
    ).toEqual([
      [2, 4, 'TO'],
      [11, 13, 'TO'],
    ]);
    expect(
      searchRegexp(content, { minMatchCharLength: 3, pattern: 'to' }),
    ).toEqual([]);
  });
});
