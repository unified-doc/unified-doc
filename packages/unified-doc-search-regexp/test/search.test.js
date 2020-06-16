import search from '../lib/search';

const content = 'a TO the b TO the c';

describe('search', () => {
  it('returns empty array for empty content', () => {
    expect(search(null, '')).toEqual([]);
    expect(search('', '')).toEqual([]);
  });

  it('returns empty array for non-matching patterns', () => {
    expect(search(content, 'd')).toEqual([]);
    expect(search(content, 'tothe')).toEqual([]);
  });

  it('returns offsets for simple query', () => {
    expect(search(content, 't')).toEqual([
      { start: 2, end: 3, value: 'T' },
      { start: 5, end: 6, value: 't' },
      { start: 11, end: 12, value: 'T' },
      { start: 14, end: 15, value: 't' },
    ]);
    expect(search(content, 'to')).toEqual([
      { start: 2, end: 4, value: 'TO' },
      { start: 11, end: 13, value: 'TO' },
    ]);
    expect(search(content, 'the')).toEqual([
      { start: 5, end: 8, value: 'the' },
      { start: 14, end: 17, value: 'the' },
    ]);
  });

  it('escapes regexp when regexp is not explicitly enabled', () => {
    expect(search(content, '*')).toEqual([]);
    expect(() => search(content, '*', { enableRegexp: true })).toThrow(
      'Invalid regular expression: /*/: Nothing to repeat',
    );
  });

  it('returns offsets for regexp patterns', () => {
    expect(search(content, 'a|b|c', { enableRegexp: true })).toEqual([
      { start: 0, end: 1, value: 'a' },
      { start: 9, end: 10, value: 'b' },
      { start: 18, end: 19, value: 'c' },
    ]);
    expect(search(content, '(?<=TO).*(?=TO)', { enableRegexp: true })).toEqual([
      { start: 4, end: 11, value: ' the b ' },
    ]);
  });

  it('handles case sensitivity', () => {
    expect(search(content, 'to', { isCaseSensitive: false })).toEqual([
      { start: 2, end: 4, value: 'TO' },
      { start: 11, end: 13, value: 'TO' },
    ]);
    expect(search(content, 'TO', { isCaseSensitive: false })).toEqual([
      { start: 2, end: 4, value: 'TO' },
      { start: 11, end: 13, value: 'TO' },
    ]);
    expect(search(content, 'to', { isCaseSensitive: true })).toEqual([]);
    expect(search(content, 'TO', { isCaseSensitive: true })).toEqual([
      { start: 2, end: 4, value: 'TO' },
      { start: 11, end: 13, value: 'TO' },
    ]);
  });

  it('handles min match character length', () => {
    expect(search(content, 't', { minMatchCharLength: 0 })).toEqual([
      { start: 2, end: 3, value: 'T' },
      { start: 5, end: 6, value: 't' },
      { start: 11, end: 12, value: 'T' },
      { start: 14, end: 15, value: 't' },
    ]);
    expect(search(content, 't', { minMatchCharLength: 1 })).toEqual([
      { start: 2, end: 3, value: 'T' },
      { start: 5, end: 6, value: 't' },
      { start: 11, end: 12, value: 'T' },
      { start: 14, end: 15, value: 't' },
    ]);
    expect(search(content, 't', { minMatchCharLength: 2 })).toEqual([]);
    expect(search(content, 'to', { minMatchCharLength: 2 })).toEqual([
      { start: 2, end: 4, value: 'TO' },
      { start: 11, end: 13, value: 'TO' },
    ]);
    expect(search(content, 'to', { minMatchCharLength: 3 })).toEqual([]);
  });
});
