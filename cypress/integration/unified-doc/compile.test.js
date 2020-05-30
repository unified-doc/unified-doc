import { createElement } from 'react';
import rehype2react from 'rehype-react';

import unifiedDoc from '../../../packages/unified-doc';

describe('compile', () => {
  it('compiles serialized HTML if no compiler is provided', async () => {
    const doc = await unifiedDoc({
      file: new File(['> **some** markdown content'], 'doc.md'),
    });
    const compiled = doc.compile();
    expect(compiled.contents).to.have.string('blockquote');
    expect(compiled.contents).to.have.string('strong');
    expect(compiled.contents).to.not.have.string('some markdown');
    expect(compiled.contents).to.have.string('markdown content');
  });

  it('transforms to React given a source content', async () => {
    const doc = await unifiedDoc({
      compiler: rehype2react,
      compilerOptions: { createElement },
      content: '> **some** markdown content',
      filename: 'doc.md',
    });
    const compiled = doc.compile();
    expect(compiled.contents).to.be.equal('> **some** markdown content');
    expect(compiled.result.type).to.equal('div');
    expect(compiled.result).to.have.property('props');
  });

  it('transforms to React given a source file', async () => {
    const doc = await unifiedDoc({
      compiler: rehype2react,
      compilerOptions: { createElement },
      file: new File(['> **some** markdown content'], 'doc.md'),
    });
    const compiled = doc.compile();
    expect(compiled.contents).to.be.an.instanceOf(Buffer);
    expect(compiled.result.type).to.equal('div');
    expect(compiled.result).to.have.property('props');
  });
});
