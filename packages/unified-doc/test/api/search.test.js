import { htmlContent } from '../fixtures';
import api from '../../lib/api';

describe('search', () => {
  it('searches with the default search algorithm (regexp)', () => {
    const doc = api({
      content: htmlContent,
      filename: 'doc.html',
    });
    const string = doc.string();
    const text = doc.text();
    expect(string).toEqual(htmlContent);
    expect(text).not.toEqual(htmlContent);
    expect(text).toEqual('some\ncontent');

    expect(string).not.toContain('bad pattern');
    expect(doc.search('bad pattern')).toEqual([]);

    expect(string).toContain('blockquote');
    expect(text).not.toContain('blockquote');
    expect(doc.search('blockquote')).toEqual([]);

    expect(string).toContain('some');
    expect(text).toContain('some');
    expect(doc.search('some')).toEqual([
      { start: 0, end: 4, value: 'some', snippet: ['', 'some', ''] },
    ]);
    expect(text.slice(0, 4)).toEqual('some');

    expect(string).not.toContain('SO');
    expect(text).not.toContain('SO');
    expect(doc.search('SO')).toEqual([
      { start: 0, end: 2, value: 'so', snippet: ['', 'so', ''] },
    ]);
    expect(text.slice(0, 2)).toEqual('so');

    expect(
      doc.search('SO', {
        isCaseSensitive: true,
      }),
    ).toEqual([]);
    expect(
      doc.search('SO', {
        minMatchCharLength: 3,
      }),
    ).toEqual([]);
  });

  it('applies snippet offset padding', () => {
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

  it('searches with a custom search algorithm', () => {
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
    });
    const string = doc.string();
    const text = doc.text();
    expect(string).toEqual(htmlContent);
    expect(text).not.toEqual(htmlContent);
    expect(text).toEqual('some\ncontent');

    expect(doc.search('static query', { disabled: true })).toEqual([]);
    expect(doc.search('static query', { disabled: false })).toEqual([
      { start: 0, end: 5, value: 'static', snippet: ['', 'some\n', ''] },
    ]);
  });
});
