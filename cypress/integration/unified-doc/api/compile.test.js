import { createElement } from 'react';
import rehype2react from 'rehype-react';

import unifiedDoc from '../../../../packages/unified-doc';

import { markdownContent as content } from '../../../fixtures/content';
import { getNamespace } from '../../../utils';

describe(getNamespace(__filename), () => {
  it('compiles serialized HTML if no compiler is provided', async () => {
    const doc = await unifiedDoc({
      file: new File([content], 'doc.md'),
    });
    const compiled = doc.compile();
    expect(compiled.contents).to.have.string('blockquote');
    expect(compiled.contents).to.have.string('strong');
    expect(compiled.contents).to.not.have.string('some markdown');
    expect(compiled.contents).to.have.string('markdown content');
  });

  it('transforms to React given a source content', async () => {
    const doc = await unifiedDoc({
      compiler: [rehype2react, { createElement }],
      content,
      filename: 'doc.md',
    });
    const compiled = doc.compile();
    expect(compiled.contents).to.be.equal(content);
    // @ts-ignore TODO: remove once official typing is fixed
    expect(compiled.result.type).to.equal('div');
    // @ts-ignore TODO: remove once official typing is fixed
    expect(compiled.result).to.have.property('props');
  });

  it('transforms to React given a source file', async () => {
    const doc = await unifiedDoc({
      compiler: [rehype2react, { createElement }],
      file: new File([content], 'doc.md'),
    });
    const compiled = doc.compile();
    expect(compiled.contents).to.be.an.instanceOf(Buffer);
    // @ts-ignore TODO: remove once official typing is fixed
    expect(compiled.result.type).to.equal('div');
    // @ts-ignore TODO: remove once official typing is fixed
    expect(compiled.result).to.have.property('props');
  });
});
