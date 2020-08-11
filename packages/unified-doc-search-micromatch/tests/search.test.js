import search from '../lib/search';

const content = 'a TO the b TO the c';

describe(search, () => {
  it('returns empty array for empty content', () => {
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

  it('handles case sensitivity', () => {
    expect(search(content, 'to', { nocase: true })).toEqual([
      { start: 2, end: 4, value: 'TO' },
      { start: 11, end: 13, value: 'TO' },
    ]);
    expect(search(content, 'TO', { nocase: true })).toEqual([
      { start: 2, end: 4, value: 'TO' },
      { start: 11, end: 13, value: 'TO' },
    ]);
    expect(search(content, 'to', { nocase: false })).toEqual([]);
    expect(search(content, 'TO', { nocase: false })).toEqual([
      { start: 2, end: 4, value: 'TO' },
      { start: 11, end: 13, value: 'TO' },
    ]);
  });

  it('performs glob/bash matching based on micromatch features', () => {
    expect(search(content, 'a*b')).toEqual([
      { start: 0, end: 10, value: 'a TO the b' },
    ]);
    expect(search(content, 'a????')).toEqual([
      { start: 0, end: 5, value: 'a TO ' },
    ]);
    expect(search(content, 'a TO the (b|c)')).toEqual([
      { start: 0, end: 10, value: 'a TO the b' },
    ]);
    expect(search(content, 'a TO the (c|d)')).toEqual([]);
    expect(search(content, 'a TO the !(c|d)')).toEqual([
      { start: 0, end: 9, value: 'a TO the ' },
    ]);
  });
});
