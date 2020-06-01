import unifiedDoc from '../../../../packages/unified-doc';

import { markdownContent } from '../../../fixtures/content';
import { getNamespace } from '../../../utils';

describe(getNamespace(__filename), () => {
  it('returns source file if provided', async () => {
    const sourceFile = new File([markdownContent], 'doc.md', {
      type: 'text/markdown',
    });
    const doc = await unifiedDoc({
      content: sourceFile,
      filename: 'doc.md',
    });
    const file = doc.file();
    expect(file).to.equal(sourceFile);
    expect(file).to.be.an.instanceof(File);
    expect(file.name).to.equal('doc.md');
    expect(file.type).to.equal('text/markdown');
    expect(await file.text()).to.equal(markdownContent);
  });

  it('returns file as source extension', async () => {
    const doc = await unifiedDoc({
      content: new File([markdownContent], 'doc.md', {
        type: 'text/markdown',
      }),
      filename: 'doc.md',
    });
    const file = doc.file();
    expect(file).to.be.an.instanceof(File);
    expect(file.name).to.equal('doc.md');
    expect(file.type).to.equal('text/markdown');
    expect(await file.text()).to.equal(markdownContent);
  });

  it('returns file as .txt', async () => {
    const doc = await unifiedDoc({
      content: new File([markdownContent], 'doc.md'),
      filename: 'doc.md',
    });
    const file = doc.file('.txt');
    expect(file).to.be.an.instanceof(File);
    expect(file.name).to.equal('doc.txt');
    expect(file.type).to.equal('text/plain');
    expect(await file.text()).to.equal(markdownContent);
  });

  it('returns file as .html', async () => {
    const doc = await unifiedDoc({
      content: new File([markdownContent], 'doc.md'),
      filename: 'doc.md',
    });
    const file = doc.file('.html');
    expect(file).to.be.an.instanceof(File);
    expect(file.name).to.equal('doc.html');
    expect(file.type).to.equal('text/html');
    expect(await file.text()).to.equal(
      '<blockquote>\n<p><strong>some</strong> markdown content</p>\n</blockquote>',
    );
  });

  it('returns file as .uni', async () => {
    const doc = await unifiedDoc({
      content: new File([markdownContent], 'doc.md'),
      filename: 'doc.md',
    });
    const file = doc.file('.uni');
    const text = await file.text();
    const parsedText = JSON.parse(text);
    expect(file).to.be.an.instanceof(File);
    expect(file.name).to.equal('doc.uni');
    expect(file.type).to.equal('text/uni');
    expect(text).to.have.string('blockquote');
    expect(text).to.have.string('strong');
    expect(text).to.not.have.string('some markdown');
    expect(text).to.have.string('markdown content');
    expect(parsedText).to.have.property('hast');
    expect(parsedText).to.have.nested.property('hast.type');
    expect(parsedText).to.have.nested.property('hast.children');
    expect(parsedText).to.have.nested.property('hast.position.start');
    expect(parsedText).to.have.nested.property('hast.position.end');
    expect(parsedText.hast.type).to.equal('root');
  });
});
