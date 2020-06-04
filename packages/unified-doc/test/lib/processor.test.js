import { createElement } from 'react';
import rehype2react from 'rehype-react';
import stringify from 'rehype-stringify';
import toc from 'rehype-toc';
import _vfile from 'vfile';

import { createProcessor } from '~/unified-doc/lib/processor';

import { markdownContent } from '../fixtures/content';

describe('processor', () => {
  describe(createProcessor.name, () => {
    it('throws if file is not provided', () => {
      expect(() => createProcessor()).toThrow();
    });

    it('compiles to string using the default compiler', () => {
      const vfile = _vfile({
        basename: 'doc.md',
        contents: markdownContent,
      });
      expect(createProcessor({ vfile }).processSync(vfile).contents).toContain(
        '<blockquote>',
      );
    });

    it('accepts compilers in array-form', () => {
      const vfile = _vfile({
        basename: 'doc.md',
        contents: markdownContent,
      });
      expect(
        createProcessor({
          compiler: [stringify],
          vfile,
        }).processSync(vfile).contents,
      ).toContain('<blockquote>');
    });

    it('compiles based on file extension', () => {
      const textVfile = _vfile({
        basename: 'doc.txt',
        contents: markdownContent,
      });
      expect(
        createProcessor({
          vfile: textVfile,
        }).processSync(textVfile).contents,
      ).toEqual(markdownContent);

      const markdownVfile = _vfile({
        basename: 'doc.md',
        contents: markdownContent,
      });
      expect(
        createProcessor({
          vfile: markdownVfile,
        }).processSync(markdownVfile).contents,
      ).toContain('<blockquote>');

      const htmlVfile = _vfile({
        basename: 'doc.html',
        contents: markdownContent,
      });
      expect(
        createProcessor({
          vfile: htmlVfile,
        }).processSync(htmlVfile).contents,
      ).toContain(markdownContent);
    });

    it('compiles result using a custom compiler (react)', () => {
      const vfile = _vfile({
        basename: 'doc.md',
        contents: markdownContent,
      });
      const compiled = createProcessor({
        compiler: [rehype2react, { createElement }],
        vfile,
      }).processSync(vfile);
      // @ts-ignore TODO: remove once official typing is fixed
      expect(compiled.result.type).toEqual('div');
      // @ts-ignore TODO: remove once official typing is fixed
      expect(compiled.result.props).toHaveProperty('children');
      expect(compiled.contents).toEqual(markdownContent);
    });

    it('applies sanitize schema', () => {
      const htmlContent =
        '<div classname="red" style="background: red;">text</div>';

      const vfileSanitized = _vfile({
        basename: 'doc.html',
        contents: htmlContent,
      });
      expect(
        createProcessor({
          vfile: vfileSanitized,
        }).processSync(vfileSanitized).contents,
      ).toEqual('<div>text</div>');

      const vfileCustomSanitized = _vfile({
        basename: 'doc.html',
        contents: htmlContent,
      });
      expect(
        createProcessor({
          sanitizeSchema: { attributes: { '*': ['style'] } },
          vfile: vfileCustomSanitized,
        }).processSync(vfileCustomSanitized).contents,
      ).toEqual('<div style="background: red;">text</div>');
    });

    it('applies plugins (supports either plugin or [plugin, options])', () => {
      const vfile1 = _vfile({
        basename: 'doc.md',
        contents: markdownContent,
      });
      expect(
        createProcessor({
          plugins: [toc],
          vfile: vfile1,
        }).processSync(vfile1).contents,
      ).toContain('class="toc"');

      const vfile2 = _vfile({
        basename: 'doc.md',
        contents: markdownContent,
      });
      expect(
        createProcessor({
          plugins: [[toc, { cssClasses: { toc: 'custom-toc' } }]],
          vfile: vfile2,
        }).processSync(vfile2).contents,
      ).toContain('class="custom-toc"');
    });
  });
});
