import { createElement } from 'react';
import rehype2react from 'rehype-react';

import { markdownContent } from '../fixtures/content';
import unifiedDoc from '../..';

describe('compile', () => {
  it('compiles serialized HTML if no compiler is provided', () => {
    const doc = unifiedDoc({
      content: markdownContent,
      filename: 'doc.md',
    });
    const compiled = doc.compile();
    expect(compiled.contents).toContain('blockquote');
    expect(compiled.contents).toContain('strong');
    expect(compiled.contents).not.toContain('some markdown');
    expect(compiled.contents).toContain('markdown content');
  });

  it('transforms to React given a react compiler', () => {
    const doc = unifiedDoc({
      compiler: [rehype2react, { createElement }],
      content: markdownContent,
      filename: 'doc.md',
    });
    const compiled = doc.compile();
    expect(compiled.contents).toEqual(markdownContent);
    // @ts-ignore TODO: remove once official typing is fixed
    expect(compiled.result.type).toEqual('div');
    // @ts-ignore TODO: remove once official typing is fixed
    expect(compiled.result).toHaveProperty('props');
  });
});
