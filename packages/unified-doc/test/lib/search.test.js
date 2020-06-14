import { getSnippets } from '../../lib/search';

const textContent = 'some markdown content';
const searchResults = [
  { start: 3, end: 6, value: 'e m' },
  { start: 11, end: 16, value: 'wn co' },
];

describe('search', () => {
  describe('getSnippets', () => {
    it('returns empty snippets for empty search results', () => {
      expect(getSnippets(textContent, [])).toEqual([]);
    });

    it('does not return "snippet" field when snippetOffsetPadding is falsy', () => {
      expect(getSnippets(textContent, searchResults)).toEqual(searchResults);
      expect(
        getSnippets(textContent, searchResults, { snippetOffsetPadding: 0 }),
      ).toEqual(searchResults);
    });

    it('returns snippets based on offset padding', () => {
      expect(
        getSnippets(textContent, searchResults, { snippetOffsetPadding: 3 }),
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
        getSnippets(textContent, searchResults, { snippetOffsetPadding: 7 }),
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
