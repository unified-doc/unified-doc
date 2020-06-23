import { htmlContent } from '../fixtures';
import api from '../../lib/api';

describe('search', () => {
  it('searches with the default search algorithm and algorithm options (regexp)', () => {
    const doc = api({
      content: htmlContent,
      filename: 'doc.html',
    });
    const text = doc.textContent();
    expect(text).not.toEqual(htmlContent);
    expect(text).toEqual('some\ncontent');
    expect(doc.search('bad pattern')).toEqual([]);
    expect(text).not.toContain('blockquote');
    expect(doc.search('blockquote')).toEqual([]);
    expect(text).toContain('some');
    expect(doc.search('some')).toEqual([
      { start: 0, end: 4, value: 'some', snippet: ['', 'some', '\ncontent'] },
    ]);
    expect(text.slice(0, 4)).toEqual('some');
    expect(text).not.toContain('SO');
    expect(doc.search('SO')).toEqual([
      { start: 0, end: 2, value: 'so', snippet: ['', 'so', 'me\ncontent'] },
    ]);
    expect(text.slice(0, 2)).toEqual('so');
    expect(
      doc.search('SO', {
        isCaseSensitive: true,
      }),
    ).toEqual([]);
  });

  it('applies minQueryLength option', () => {
    expect(
      api({
        content: htmlContent,
        filename: 'doc.html',
        searchOptions: { minQueryLength: 1 },
      }).search('nt'),
    ).toEqual([
      { start: 7, end: 9, value: 'nt', snippet: ['some\nco', 'nt', 'ent'] },
      { start: 10, end: 12, value: 'nt', snippet: ['some\nconte', 'nt', ''] },
    ]);
    expect(
      api({
        content: htmlContent,
        filename: 'doc.html',
        searchOptions: { minQueryLength: 3 },
      }).search('nt'),
    ).toEqual([]);
  });

  it('applies snippetOffsetPadding option', () => {
    expect(
      api({
        content: htmlContent,
        filename: 'doc.html',
        searchOptions: { snippetOffsetPadding: 0 },
      }).search('nt'),
    ).toEqual([
      { start: 7, end: 9, value: 'nt', snippet: ['', 'nt', ''] },
      { start: 10, end: 12, value: 'nt', snippet: ['', 'nt', ''] },
    ]);
    expect(
      api({
        content: htmlContent,
        filename: 'doc.html',
        searchOptions: { snippetOffsetPadding: 2 },
      }).search('nt'),
    ).toEqual([
      { start: 7, end: 9, value: 'nt', snippet: ['co', 'nt', 'en'] },
      { start: 10, end: 12, value: 'nt', snippet: ['te', 'nt', ''] },
    ]);
    expect(
      api({
        content: htmlContent,
        filename: 'doc.html',
        searchOptions: { snippetOffsetPadding: 5 },
      }).search('nt'),
    ).toEqual([
      { start: 7, end: 9, value: 'nt', snippet: ['me\nco', 'nt', 'ent'] },
      { start: 10, end: 12, value: 'nt', snippet: ['conte', 'nt', ''] },
    ]);
  });

  it('searches with a custom search algorithm and snippets use the value returned by the algorithm', () => {
    function searchCustom(_content, _query, options = {}) {
      if (options.disabled) {
        return [];
      }
      return [
        {
          start: 0,
          end: 5,
          value: 'static',
        },
      ];
    }
    const doc = api({
      content: htmlContent,
      filename: 'doc.html',
      searchAlgorithm: searchCustom,
      searchOptions: { snippetOffsetPadding: 10 },
    });
    const text = doc.textContent();
    expect(text).not.toEqual(htmlContent);
    expect(text).toEqual('some\ncontent');
    expect(doc.search('static query', { disabled: true })).toEqual([]);
    expect(doc.search('static query', { disabled: false })).toEqual([
      { start: 0, end: 5, value: 'static', snippet: ['', 'static', 'content'] },
    ]);
  });
});
