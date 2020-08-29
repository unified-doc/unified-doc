import { createElement } from 'react';
import rehype2react from 'rehype-react';

import Doc from '../../lib/doc';
import { markdownContent } from '../fixtures';

describe('doc.compile', () => {
  it('compiles to stringified HTML if no compiler is provided', () => {
    const doc = Doc({
      content: markdownContent,
      filename: 'doc.md',
    });
    const compiled = doc.compile();
    expect(compiled.contents).toContain('blockquote');
    expect(compiled.contents).toContain('strong');
    expect(compiled.contents).not.toContain('some markdown');
    expect(compiled.contents).toContain('markdown content');
  });

  it('transforms to React if a React compiler is provided', () => {
    const doc = Doc({
      compiler: [[rehype2react, { createElement }]],
      content: markdownContent,
      filename: 'doc.md',
    });
    const compiled = doc.compile();
    expect(compiled).toHaveProperty('contents', markdownContent);
    expect(compiled).toHaveProperty('result.type', 'div');
  });
});
