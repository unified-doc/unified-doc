import { hast } from './fixtures';
import textOffsets from '../../unified-doc-util-text-offsets';

describe('textOffsets', () => {
  it('should return a new unmodified tree', () => {
    const hast = { type: 'root', children: [] };
    expect(textOffsets(hast)).not.toBe(hast);
    expect(textOffsets(hast)).toEqual(hast);
  });

  it('should apply the correct text offsets only for text nodes', () => {
    const withTextOffsets = textOffsets(hast);
    expect(withTextOffsets).not.toEqual(hast);
    expect(withTextOffsets).not.toHaveProperty('children.0.type', 'blockquote');
    expect(withTextOffsets).not.toHaveProperty('children.0.data');
    expect(withTextOffsets).not.toHaveProperty(
      'children.0.children.0.type',
      'strong',
    );
    expect(withTextOffsets).not.toHaveProperty('children.0.children.0.data');
    expect(withTextOffsets).toHaveProperty(
      'children.0.children.0.children.0.type',
      'text',
    );
    expect(withTextOffsets).toHaveProperty(
      'children.0.children.0.children.0.data',
      {
        textOffset: { start: 0, end: 4 },
      },
    );
    expect(withTextOffsets).toHaveProperty(
      'children.0.children.0.children.0.value',
      'some',
    );
    expect(withTextOffsets).toHaveProperty(
      'children.0.children.1.type',
      'text',
    );
    expect(withTextOffsets).toHaveProperty('children.0.children.1.data', {
      textOffset: { start: 4, end: 12 },
    });
    expect(withTextOffsets).toHaveProperty(
      'children.0.children.1.value',
      '\ncontent',
    );
  });
});
