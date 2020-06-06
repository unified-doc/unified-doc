import { htmlContent } from '../fixtures';
import unifiedDoc from '../../../unified-doc';

describe('search', () => {
  it('searches with the default search algorithm (regexp)', () => {
    const doc = unifiedDoc({
      content: htmlContent,
      filename: 'doc.html',
    });
    const string = doc.string();
    const text = doc.text();
    expect(string).toEqual(htmlContent);
    expect(text).not.toEqual(htmlContent);
    expect(text).toEqual('some\ncontent');

    expect(string).not.toContain('bad pattern');
    expect(doc.search({ pattern: 'bad pattern' })).toEqual([]);

    expect(string).toContain('blockquote');
    expect(text).not.toContain('blockquote');
    expect(doc.search({ pattern: 'blockquote' })).toEqual([]);

    expect(string).toContain('some');
    expect(text).toContain('some');
    expect(doc.search({ pattern: 'some' })).toEqual([
      { start: 0, end: 4, value: 'some' },
    ]);
    expect(text.slice(0, 4)).toEqual('some');

    expect(string).not.toContain('SO');
    expect(text).not.toContain('SO');
    expect(
      doc.search({
        pattern: 'SO',
      }),
    ).toEqual([{ start: 0, end: 2, value: 'so' }]);
    expect(text.slice(0, 2)).toEqual('so');

    expect(
      doc.search({
        isCaseSensitive: true,
        pattern: 'SO',
      }),
    ).toEqual([]);
    expect(
      doc.search({
        minMatchCharLength: 3,
        pattern: 'SO',
      }),
    ).toEqual([]);
  });

  it('searches with a custom search algorithm', () => {
    function searchCustom(content, options = {}) {
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

    const doc = unifiedDoc({
      content: htmlContent,
      filename: 'doc.html',
      searchAlgorithm: searchCustom,
    });
    const string = doc.string();
    const text = doc.text();
    expect(string).toEqual(htmlContent);
    expect(text).not.toEqual(htmlContent);
    expect(text).toEqual('some\ncontent');

    expect(doc.search({ disabled: true })).toEqual([]);
    expect(doc.search({ disabled: false })).toEqual([
      { start: 0, end: 5, value: 'static' },
    ]);
  });
});
