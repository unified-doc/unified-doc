import { hast } from './fixtures';
import annotate from '../lib/annotate';

describe('annotate', () => {
  it('returns the original tree if nothing to annotate', () => {
    expect(annotate(hast)).toBe(hast);
  });

  it('returns a mapped tree if no matching annotations', () => {
    const annotated = annotate(hast, [{ id: 'a', start: 1000, end: 4000 }]);
    expect(annotated).toEqual(hast);
    expect(annotated).not.toBe(hast);
  });

  it('annotates text nodes with simple non-overlapping annotations', () => {
    const annotated = annotate(hast, [{ id: 'a', start: 7, end: 15 }]);
    expect(annotated).not.toEqual(hast);
    expect(annotated).toMatchSnapshot();
  });

  it('annotates text nodes with overlapping annotations', () => {
    const annotated = annotate(hast, [
      { id: 'a', start: 7, end: 15 },
      { id: 'b', start: 10, end: 20 },
    ]);
    expect(annotated).not.toEqual(hast);
    expect(annotated).toMatchSnapshot();
  });
});
