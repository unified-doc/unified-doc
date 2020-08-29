import highlight from 'rehype-highlight';
import prism from '@mapbox/rehype-prism';
import toc from 'rehype-toc';

import Doc from '../../lib/doc';

describe('options.plugins', () => {
  it('ignores the effects of postPlugins even if they affect the parsed hast tree', () => {
    const doc1 = Doc({
      content: '# Heading 1 with **bold** text',
      filename: 'doc.md',
    });
    expect(doc1.textContent()).toEqual('Heading 1 with bold text');

    const doc2 = Doc({
      content: '# Heading 1 with **bold** text',
      filename: 'doc.md',
      postPlugins: [toc],
    });
    expect(doc2.textContent()).toEqual('Heading 1 with bold text');
  });

  it('includes the effects of prePlugins', () => {
    const doc1 = Doc({
      content: '# Heading 1 with **bold** text',
      filename: 'doc.md',
    });
    expect(doc1.textContent()).toEqual('Heading 1 with bold text');

    const doc2 = Doc({
      content: '# Heading 1 with **bold** text',
      filename: 'doc.md',
      prePlugins: [toc],
    });
    expect(doc2.textContent()).toEqual(
      'Heading 1 with bold textHeading 1 with bold text',
    );
  });

  it('works with rehype-highlight for parsed code blocks', () => {
    const doc = Doc({
      content: 'const hello = "world"',
      filename: 'doc.js',
      prePlugins: [[highlight]],
      sanitizeSchema: { attributes: { '*': ['className'] } },
    });
    const { contents } = doc.compile();
    expect(contents).toContain('language-js');
    expect(contents).toContain('hljs-keyword');
    expect(contents).toContain('hljs-string');
  });

  it('works with rehype-prism for parsed code blocks', () => {
    const doc = Doc({
      content: 'const hello = "world"',
      filename: 'doc.js',
      prePlugins: [[prism]],
      sanitizeSchema: { attributes: { '*': ['className'] } },
    });
    const { contents } = doc.compile();
    expect(contents).toContain('language-js');
    expect(contents).toContain('token');
    expect(contents).toContain('keyword');
    expect(contents).toContain('string');
  });
});
