import { getSnippets } from '../lib/search';

const content = 'some markdown content';
const searchResults = [
  { start: 3, end: 6, value: 'e m' },
  { start: 11, end: 16, value: 'wn co' },
];

describe('search', () => {
  describe(getSnippets, () => {
    it('returns empty snippets for empty search results', () => {
      expect(
        getSnippets({ content, searchResults: [], snippetOffsetPadding: 0 }),
      ).toEqual([]);
    });

    it('returns snippets based on offset padding', () => {
      expect(
        getSnippets({ content, searchResults, snippetOffsetPadding: 0 }),
      ).toEqual([
        { start: 3, end: 6, value: 'e m', snippet: ['', 'e m', ''] },
        {
          start: 11,
          end: 16,
          value: 'wn co',
          snippet: ['', 'wn co', ''],
        },
      ]);
      expect(
        getSnippets({ content, searchResults, snippetOffsetPadding: 3 }),
      ).toEqual([
        { start: 3, end: 6, value: 'e m', snippet: ['som', 'e m', 'ark'] },
        {
          start: 11,
          end: 16,
          value: 'wn co',
          snippet: ['kdo', 'wn co', 'nte'],
        },
      ]);
      expect(
        getSnippets({ content, searchResults, snippetOffsetPadding: 7 }),
      ).toEqual([
        { start: 3, end: 6, value: 'e m', snippet: ['som', 'e m', 'arkdown'] },
        {
          start: 11,
          end: 16,
          value: 'wn co',
          snippet: [' markdo', 'wn co', 'ntent'],
        },
      ]);
    });
  });
});
