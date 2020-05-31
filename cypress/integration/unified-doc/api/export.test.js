import unifiedDoc from '../../../../packages/unified-doc';

import { markdownContent as content } from '../../../fixtures/content';
import { getNamespace } from '../../../utils';

describe(getNamespace(__filename), () => {
  it('exports file as is', async () => {
    const doc = await unifiedDoc({
      content,
      filename: 'doc.md',
    });
    const file = doc.export();
    expect(file).to.be.an.instanceof(File);
    expect(file.name).to.equal('doc.md');
    expect(file.type).to.equal('text/markdown');
    expect(await file.text()).to.equal(content);
  });

  it('exports file as .txt', async () => {
    const doc = await unifiedDoc({
      content,
      filename: 'doc.md',
    });
    const file = doc.export('.txt');
    expect(file).to.be.an.instanceof(File);
    expect(file.name).to.equal('doc.txt');
    expect(file.type).to.equal('text/plain');
    expect(await file.text()).to.equal(content);
  });

  it('exports file as .html', async () => {
    const doc = await unifiedDoc({
      content,
      filename: 'doc.md',
    });
    const file = doc.export('.html');
    expect(file).to.be.an.instanceof(File);
    expect(file.name).to.equal('doc.html');
    expect(file.type).to.equal('text/html');
    expect(await file.text()).to.equal(
      '<blockquote>\n<p><strong>some</strong> markdown content</p>\n</blockquote>',
    );
  });

  it('exports file as .uni', async () => {
    const doc = await unifiedDoc({
      content,
      filename: 'doc.md',
    });
    const file = doc.export('.uni');
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
