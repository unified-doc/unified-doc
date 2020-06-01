import { createElement } from 'react';
import rehype2react from 'rehype-react';
import stringify from 'rehype-stringify';
import toc from 'rehype-toc';

import { createProcessor } from '../../../../packages/unified-doc/lib/processor';
import { createVfile } from '../../../../packages/unified-doc/lib/vfile';

import { markdownContent as content } from '../../../fixtures/content';
import { getNamespace } from '../../../utils';

describe(getNamespace(__filename), () => {
  describe(createProcessor.name, () => {
    it('throws if vfile is not provided', () => {
      expect(() => createProcessor()).to.throw();
    });

    it('compiles to string using the default compiler', async () => {
      const vfile = await createVfile({
        content,
        filename: 'doc.md',
      });
      const { contents } = createProcessor({ vfile }).processSync(vfile);
      expect(contents).to.contain('<blockquote>');
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
      expect(contents).to.contain('<blockquote>');
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
      expect(
        createProcessor({
          vfile: textVfile,
        }).processSync(textVfile).contents,
      ).to.equal(content);
      expect(
        createProcessor({
          vfile: markdownVfile,
        }).processSync(markdownVfile).contents,
      ).to.contain('<blockquote>');
      expect(
        createProcessor({
          vfile: htmlVfile,
        }).processSync(htmlVfile).contents,
      ).to.contain(content);
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
      // @ts-ignore TODO: remove once official typing is fixed
      expect(compiled.result.type).to.equal('div');
      // @ts-ignore TODO: remove once official typing is fixed
      expect(compiled.result.props).to.have.property('children');
      expect(compiled.contents).to.equal(content);
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
      expect(
        createProcessor({
          vfile: vfileSanitized,
        }).processSync(vfileSanitized).contents,
      ).to.equal('<div>text</div>');
      expect(
        createProcessor({
          sanitizeSchema: { attributes: { '*': ['style'] } },
          vfile: vfileCustomSanitized,
        }).processSync(vfileCustomSanitized).contents,
      ).to.equal('<div style="background: red;">text</div>');
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
      expect(
        createProcessor({
          plugins: [toc],
          vfile: vfile1,
        }).processSync(vfile1).contents,
      ).to.contain('class="toc"');
      expect(
        createProcessor({
          plugins: [[toc, { cssClasses: { toc: 'custom-toc' } }]],
          vfile: vfile2,
        }).processSync(vfile2).contents,
      ).to.contain('class="custom-toc"');
    });
  });
});
