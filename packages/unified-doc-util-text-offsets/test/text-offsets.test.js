import { hast } from './fixtures';
import textOffsets from '../lib/text-offsets';

describe('textOffsets', () => {
  it('should return a new unmodified tree', () => {
    const hast = { type: 'root', children: [] };
    expect(textOffsets(hast)).not.toBe(hast);
    expect(textOffsets(hast)).toEqual(hast);
  });

  it('should apply the correct text offsets only for text nodes', () => {
    const withTextOffsets = textOffsets(hast);
    expect(withTextOffsets).not.toEqual(hast);
    expect(withTextOffsets).toMatchSnapshot();
  });
});
