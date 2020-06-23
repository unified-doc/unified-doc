import api from '../../lib/api';
import { markdownContent } from '../fixtures';

describe('initialize', () => {
  it('initializes the public attributes and API methods', () => {
    const doc = api({
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
