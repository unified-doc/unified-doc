import api from '../../lib/api';
import { markdownContent } from '../fixtures';

describe('initialize', () => {
  it('initializes the public attributes and API methods', () => {
    const doc = api({
      content: markdownContent,
      filename: 'doc.md',
    });
    expect(Object.getOwnPropertyNames(doc)).toEqual([
      // attributes
      'content',
      'filename',
      // methods
      'compile',
      'file',
      'parse',
      'search',
      'string',
      'text',
    ]);
    expect(doc.content).toEqual(markdownContent);
    expect(doc.filename).toEqual('doc.md');
  });
});
