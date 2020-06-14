import { createElement } from 'react';
import rehype2react from 'rehype-react';
import stringify from 'rehype-stringify';
import toc from 'rehype-toc';
import vfile from 'vfile';

import { markdownContent } from '../fixtures';
import { createProcessor } from '../../lib/processor';

describe('processor', () => {
  describe('createProcessor', () => {
    it('throws if file is not provided', () => {
      expect(() => createProcessor()).toThrow();
    });

    it('compiles to string using the default compiler', () => {
      const processor = createProcessor({
        vfile: vfile({
          basename: 'doc.md',
          contents: markdownContent,
        }),
      });
      expect(processor.compile().contents).toContain('<blockquote>');
    });

    it('accepts compilers in array-form', () => {
      const processor = createProcessor({
        compiler: [stringify],
        vfile: vfile({
          basename: 'doc.md',
          contents: markdownContent,
        }),
      });
      expect(processor.compile().contents).toContain('<blockquote>');
    });

    it('compiles based on file extension', () => {
      const processor1 = createProcessor({
        vfile: vfile({
          basename: 'doc.txt',
          contents: markdownContent,
        }),
      });
      expect(processor1.compile().contents).toEqual(markdownContent);

      const processor2 = createProcessor({
        vfile: vfile({
          basename: 'doc.md',
          contents: markdownContent,
        }),
      });
      expect(processor2.compile().contents).toContain('<blockquote>');

      const processor3 = createProcessor({
        vfile: vfile({
          basename: 'doc.html',
          contents: markdownContent,
        }),
      });
      expect(processor3.compile().contents).toContain(markdownContent);
    });

    it('compiles result using a custom compiler (react)', () => {
      const processor = createProcessor({
        compiler: [rehype2react, { createElement }],
        vfile: vfile({
          basename: 'doc.md',
          contents: markdownContent,
        }),
      });
      const compiled = processor.compile();
      // @ts-ignore TODO: remove once official typing is fixed
      expect(compiled.result).toHaveProperty('type', 'div');
      // @ts-ignore TODO: remove once official typing is fixed
      expect(compiled.result.props).toHaveProperty('children');
      expect(compiled.contents).toEqual(markdownContent);
    });

    it('applies sanitize schema', () => {
      const htmlContent =
        '<div classname="red" style="background: red;">text</div>';

      const processor1 = createProcessor({
        vfile: vfile({
          basename: 'doc.html',
          contents: htmlContent,
        }),
      });
      expect(processor1.compile().contents).toEqual('<div>text</div>');

      const processor2 = createProcessor({
        sanitizeSchema: { attributes: { '*': ['style'] } },
        vfile: vfile({
          basename: 'doc.html',
          contents: htmlContent,
        }),
      });
      expect(processor2.compile().contents).toEqual(
        '<div style="background: red;">text</div>',
      );
    });

    it('applies plugins (supports either plugin or [plugin, options])', () => {
      const processor1 = createProcessor({
        plugins: [toc],
        vfile: vfile({
          basename: 'doc.md',
          contents: markdownContent,
        }),
      });
      expect(processor1.compile().contents).toContain('toc');

      const processor2 = createProcessor({
        plugins: [[toc, { cssClasses: { list: 'custom-list' } }]],
        vfile: vfile({
          basename: 'doc.md',
          contents: markdownContent,
        }),
      });
      expect(processor2.compile().contents).toContain('custom-list');
    });
  });

  it('parses to hast', () => {
    const processor = createProcessor({
      vfile: vfile({
        basename: 'doc.md',
        contents: markdownContent,
      }),
    });
    expect(processor.parse()).toHaveProperty('type', 'root');
  });

  it('returns string content of original file', () => {
    const processor = createProcessor({
      vfile: vfile({
        basename: 'doc.md',
        contents: markdownContent,
      }),
    });
    expect(processor.string()).toEqual(markdownContent);
  });

  it('returns string content of original file ignoring effects of plugins', () => {
    const processor = createProcessor({
      plugins: [toc],
      vfile: vfile({
        basename: 'doc.md',
        contents: markdownContent,
      }),
    });
    expect(
      JSON.stringify(processor.parse()).match(/toc/gi).length,
    ).toBeGreaterThan(1);
    expect(processor.string()).toEqual(markdownContent);
  });

  it('returns text content of parsed tree', () => {
    const processor = createProcessor({
      vfile: vfile({
        basename: 'doc.md',
        contents: markdownContent,
      }),
    });
    expect(processor.text()).not.toEqual(markdownContent);
    expect(processor.text()).toEqual('\nsome markdown content\n');
  });

  it('returns text content of parsed tree ignoring effects of plugins', () => {
    const processor = createProcessor({
      plugins: [toc],
      vfile: vfile({
        basename: 'doc.md',
        contents: markdownContent,
      }),
    });
    expect(
      JSON.stringify(processor.parse()).match(/toc/gi).length,
    ).toBeGreaterThan(1);
    expect(processor.text()).toEqual('\nsome markdown content\n');
  });
});
