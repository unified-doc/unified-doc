import { createElement } from 'react';
import rehype2react from 'rehype-react';
import stringify from 'rehype-stringify';
import toc from 'rehype-toc';
import vfile from 'vfile';

import { createProcessor } from '../lib/processor';
import { csvContent, htmlContent, markdownContent } from './fixtures';

describe('processor', () => {
  describe(createProcessor, () => {
    it('throws if file is not provided', () => {
      expect(() => createProcessor()).toThrow();
    });

    describe('processor.compile', () => {
      it('compiles to stringified HTML using the default compiler', () => {
        const processor = createProcessor({
          vfile: vfile({
            basename: 'doc.md',
            contents: markdownContent,
          }),
        });
        expect(processor.compile().contents).toContain('<blockquote>');
      });

      it('accepts compilers in array interface', () => {
        const processor = createProcessor({
          compiler: [stringify],
          vfile: vfile({
            basename: 'doc.md',
            contents: markdownContent,
          }),
        });
        expect(processor.compile().contents).toContain('<blockquote>');
      });

      it('compiles html content', () => {
        const processor = createProcessor({
          vfile: vfile({
            basename: 'doc.html',
            contents: htmlContent,
          }),
        });
        expect(processor.compile().contents).toContain('<blockquote>');
      });

      it('compiles markdown content', () => {
        const processor = createProcessor({
          vfile: vfile({
            basename: 'doc.md',
            contents: markdownContent,
          }),
        });
        expect(processor.compile().contents).toContain('<blockquote>');
      });

      it('compiles markdown content (GFM)', () => {
        const processor = createProcessor({
          vfile: vfile({
            basename: 'doc.md',
            contents: '|a|b|c|\n|---|---|---|\n|1|2|3|',
          }),
        });
        expect(processor.compile().contents).toContain('<table>');
      });

      it('compiles csv content', () => {
        const processor = createProcessor({
          vfile: vfile({
            basename: 'doc.csv',
            contents: csvContent,
          }),
        });
        const { contents } = processor.compile();
        expect(contents).toContain('<thead>');
        expect(contents).toContain('<tbody>');
        expect(contents).toContain('<tr>');
        expect(contents).toContain('<th>');
        expect(contents).toContain('<td>');
      });

      it('compiles unsupported content to a codeblock with language attached', () => {
        const processor = createProcessor({
          vfile: vfile({
            basename: 'doc.unsupported-extension',
            contents: markdownContent,
          }),
        });
        const { contents } = processor.compile();
        expect(contents).toContain(markdownContent);
        expect(contents).toContain('</pre>');
        expect(contents).toContain('</code>');
        expect(contents).toContain('language-unsupported-extension');
      });

      it('compiles content without extension to a codeblock with default text language attached', () => {
        const processor = createProcessor({
          vfile: vfile({
            basename: 'doc',
            contents: markdownContent,
          }),
        });
        const { contents } = processor.compile();
        expect(contents).toContain(markdownContent);
        expect(contents).toContain('</pre>');
        expect(contents).toContain('</code>');
        expect(contents).toContain('language-txt');
      });

      it('compiles result using a custom compiler (react)', () => {
        const processor = createProcessor({
          compiler: [[rehype2react, { createElement }]],
          vfile: vfile({
            basename: 'doc.md',
            contents: markdownContent,
          }),
        });
        const compiled = processor.compile();
        expect(compiled).toHaveProperty('result.type', 'div');
        expect(compiled).toHaveProperty('contents', markdownContent);
      });
    });

    describe('processor.parse', () => {
      it('parses to hast', () => {
        const processor = createProcessor({
          vfile: vfile({
            basename: 'doc.md',
            contents: markdownContent,
          }),
        });
        expect(processor.parse()).toHaveProperty('type', 'root');
      });
    });

    describe('processor.textContent', () => {
      it('returns textContent of parsed tree', () => {
        const processor = createProcessor({
          vfile: vfile({
            basename: 'doc.md',
            contents: markdownContent,
          }),
        });
        expect(processor.textContent()).not.toEqual(markdownContent);
        expect(processor.textContent()).toEqual('\nsome markdown content\n');
      });

      it('returns textContent without content in the head node', () => {
        const processor = createProcessor({
          vfile: vfile({
            basename: 'doc.html',
            contents:
              '<html><head><style>head content should be included excluded.</style></head><body>body content should be included.</body></html>',
          }),
        });
        expect(processor.textContent()).toEqual(
          'body content should be included.',
        );
      });

      it('returns textContent of parsed tree ignoring effects of post plugins', () => {
        const processor = createProcessor({
          vfile: vfile({
            basename: 'doc.md',
            contents: markdownContent,
          }),
          postPlugins: [toc],
        });
        expect(
          JSON.stringify(processor.parse()).match(/toc/gi).length,
        ).toBeGreaterThan(1);
        expect(processor.textContent()).toEqual('\nsome markdown content\n');
      });
    });

    describe('options', () => {
      it('applies null/default/custom sanitize schema', () => {
        const htmlContent =
          '<div class="red" style="background: red;">text</div>';

        const processor1 = createProcessor({
          vfile: vfile({
            basename: 'doc.html',
            contents: htmlContent,
          }),
        });
        expect(processor1.compile().contents).toEqual(
          `<html><head></head><body>${htmlContent}</body></html>`,
        );

        const processor2 = createProcessor({
          vfile: vfile({
            basename: 'doc.html',
            contents: htmlContent,
          }),
          sanitizeSchema: {},
        });
        expect(processor2.compile().contents).toEqual('<div>text</div>');

        const processor3 = createProcessor({
          vfile: vfile({
            basename: 'doc.html',
            contents: htmlContent,
          }),
          sanitizeSchema: { attributes: { '*': ['style'] } },
        });
        expect(processor3.compile().contents).toEqual(
          '<div style="background: red;">text</div>',
        );
      });

      it('applies post plugins, supporting either plugin or [plugin, options] interface', () => {
        const processor1 = createProcessor({
          vfile: vfile({
            basename: 'doc.md',
            contents: markdownContent,
          }),
          postPlugins: [toc],
        });
        expect(processor1.compile().contents).toContain('toc');

        const processor2 = createProcessor({
          vfile: vfile({
            basename: 'doc.md',
            contents: markdownContent,
          }),
          postPlugins: [[toc, { cssClasses: { list: 'custom-list' } }]],
        });
        expect(processor2.compile().contents).toContain('custom-list');
      });
    });

    it('applies custom parser (overriding default parser)', () => {
      const customParser = function () {
        this.Parser = (_doc) => {
          return {
            type: 'root',
            children: [],
          };
        };
      };
      const processor = createProcessor({
        parsers: {
          'text/markdown': [customParser],
        },
        vfile: vfile({
          basename: 'doc.md',
          contents: markdownContent,
        }),
      });
      expect(processor.parse()).toEqual({ type: 'root', children: [] });
      expect(processor.textContent()).toEqual('');
    });
  });
});
