import { hast } from './fixtures';
import mark from '../lib/mark';

describe(mark, () => {
  it('returns the original tree if there is nothing to mark', () => {
    expect(mark(hast)).toBe(hast);
  });

  it('returns a new tree if there are no matching marks', () => {
    const marked = mark(hast, [{ id: 'a', start: 1000, end: 4000 }]);
    expect(marked).toEqual(hast);
    expect(marked).not.toBe(hast);
  });

  it('marks non-overlapping text nodes', () => {
    const marked = mark(hast, [{ id: 'a', start: 7, end: 15 }]);
    expect(marked).not.toEqual(hast);
    expect(marked).toMatchSnapshot();
  });

  it('marks overlapping text nodes', () => {
    const marked = mark(hast, [
      { id: 'a', start: 7, end: 15 },
      { id: 'b', start: 10, end: 20 },
    ]);
    expect(marked).not.toEqual(hast);
    expect(marked).toMatchSnapshot();
  });
});
