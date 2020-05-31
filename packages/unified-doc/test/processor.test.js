import { createElement } from 'react';
import rehype2react from 'rehype-react';
import stringify from 'rehype-stringify';
import toc from 'rehype-toc';

import { markdownContent as content } from './fixtures/content';
import { createProcessor } from '../lib/processor';
import { createVfile } from '../lib/vfile';

describe('createProcessor', () => {
  it('throws if vfile is not provided', () => {
    expect(() => createProcessor()).toThrow();
  });

  it('compiles to string using the default compiler', async () => {
    const vfile = await createVfile({
      content,
      filename: 'doc.md',
    });
    const { contents } = createProcessor({ vfile }).processSync(vfile);
    expect(contents).toContain('<blockquote>');
  });

  it('accepts compilers in array-form', async () => {
    const vfile = await createVfile({
      content,
      filename: 'doc.md',
    });
    const { contents } = createProcessor({
      compiler: [stringify],
      vfile,
    }).processSync(vfile);
    expect(contents).toContain('<blockquote>');
  });

  it('compiles based on file extension', async () => {
    const textVfile = await createVfile({
      content,
      filename: 'doc.txt',
    });
    const markdownVfile = await createVfile({
      content,
      filename: 'doc.md',
    });
    const htmlVfile = await createVfile({
      content,
      filename: 'doc.html',
    });

    const { contents: textContents } = createProcessor({
      vfile: textVfile,
    }).processSync(textVfile);
    const { contents: markdownContents } = createProcessor({
      vfile: markdownVfile,
    }).processSync(markdownVfile);
    const { contents: htmlContents } = createProcessor({
      vfile: htmlVfile,
    }).processSync(htmlVfile);

    expect(textContents).toEqual(content);
    expect(markdownContents).toContain('<blockquote>');
    expect(htmlContents).toContain(content);
  });

  it('compiles result using a custom compiler (react)', async () => {
    const vfile = await createVfile({
      content,
      filename: 'doc.md',
    });
    const compiled = createProcessor({
      compiler: [rehype2react, { createElement }],
      vfile,
    }).processSync(vfile);
    expect(compiled.result.type).toEqual('div');
    expect(compiled.result.props).toHaveProperty('children');
    expect(compiled.contents).toEqual(content);
  });

  it('applies sanitize schema', async () => {
    const htmlContent =
      '<div classname="red" style="background: red;">text</div>';
    const vfileSanitized = await createVfile({
      content: htmlContent,
      filename: 'doc.html',
    });
    const vfileCustomSanitized = await createVfile({
      content: htmlContent,
      filename: 'doc.html',
    });

    const { contents: sanitized } = createProcessor({
      vfile: vfileSanitized,
    }).processSync(vfileSanitized);
    const { contents: customSanitized } = createProcessor({
      sanitizeSchema: { attributes: { '*': ['style'] } },
      vfile: vfileCustomSanitized,
    }).processSync(vfileCustomSanitized);

    expect(sanitized).toEqual('<div>text</div>');
    expect(customSanitized).toEqual('<div style="background: red;">text</div>');
  });

  it('applies plugins (supports either plugin or [plugin, options])', async () => {
    const vfile1 = await createVfile({
      content,
      filename: 'doc.md',
    });
    const vfile2 = await createVfile({
      content,
      filename: 'doc.md',
    });

    const compiled1 = createProcessor({
      plugins: [toc],
      vfile: vfile1,
    }).processSync(vfile1);
    const compiled2 = createProcessor({
      plugins: [[toc, { cssClasses: { toc: 'custom-toc' } }]],
      vfile: vfile2,
    }).processSync(vfile2);

    expect(compiled1.contents).toContain('class="toc"');
    expect(compiled2.contents).not.toContain('class="toc"');
    expect(compiled2.contents).toContain('class="custom-toc"');
  });
});
