import Doc from '../../lib/doc';
import { markdownContent } from '../fixtures';

describe('doc.initialize', () => {
  it('initializes the public attributes and API methods', () => {
    const doc = Doc({
      content: markdownContent,
      filename: 'doc.md',
    });
    expect(Object.getOwnPropertyNames(doc)).toEqual([
      'compile',
      'file',
      'parse',
      'search',
      'textContent',
    ]);
  });
});
