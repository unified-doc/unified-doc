import Doc from '../../lib/doc';
import { htmlContent } from '../fixtures';

describe('doc.search', () => {
  it('searches with the default search algorithm and options (micromatch)', () => {
    const doc = Doc({
      content: htmlContent,
      filename: 'doc.html',
    });
    const text = doc.textContent();
    expect(text).not.toEqual(htmlContent);
    expect(text).toEqual('some\ncontent');
    expect(text).not.toContain('blockquote');
    expect(doc.search('bad pattern')).toEqual([]);
    expect(doc.search('blockquote')).toEqual([]);
    expect(doc.search('some')).toEqual([
      { start: 0, end: 4, value: 'some', snippet: ['', 'some', '\ncontent'] },
    ]);
    expect(doc.search('SO')).toEqual([
      { start: 0, end: 2, value: 'so', snippet: ['', 'so', 'me\ncontent'] },
    ]);
    expect(doc.search('SO', { nocase: false })).toEqual([]);
    expect(doc.search('s*c')).toEqual([
      {
        start: 0,
        end: 6,
        value: 'some\nc',
        snippet: ['', 'some\nc', 'ontent'],
      },
    ]);
  });

  it('applies minQueryLength option', () => {
    expect(
      Doc({
        content: htmlContent,
        filename: 'doc.html',
        searchOptions: { minQueryLength: 1 },
      }).search('nt'),
    ).toEqual([
      { start: 7, end: 9, value: 'nt', snippet: ['some\nco', 'nt', 'ent'] },
      { start: 10, end: 12, value: 'nt', snippet: ['some\nconte', 'nt', ''] },
    ]);
    expect(
      Doc({
        content: htmlContent,
        filename: 'doc.html',
        searchOptions: { minQueryLength: 3 },
      }).search('nt'),
    ).toEqual([]);
  });

  it('applies snippetOffsetPadding option', () => {
    expect(
      Doc({
        content: htmlContent,
        filename: 'doc.html',
        searchOptions: { snippetOffsetPadding: 0 },
      }).search('nt'),
    ).toEqual([
      { start: 7, end: 9, value: 'nt', snippet: ['', 'nt', ''] },
      { start: 10, end: 12, value: 'nt', snippet: ['', 'nt', ''] },
    ]);
    expect(
      Doc({
        content: htmlContent,
        filename: 'doc.html',
        searchOptions: { snippetOffsetPadding: 2 },
      }).search('nt'),
    ).toEqual([
      { start: 7, end: 9, value: 'nt', snippet: ['co', 'nt', 'en'] },
      { start: 10, end: 12, value: 'nt', snippet: ['te', 'nt', ''] },
    ]);
    expect(
      Doc({
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
    const doc = Doc({
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
