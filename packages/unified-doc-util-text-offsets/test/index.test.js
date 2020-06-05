import textOffsets from '~/unified-doc-util-text-offsets';

import { hast } from './fixtures';

describe('textOffsets', () => {
  it('should return a new unmodified tree', () => {
    const hast = { type: 'root', children: [] };
    expect(textOffsets(hast)).not.toBe(hast);
    expect(textOffsets(hast)).toEqual(hast);
  });

  it('should apply the correct text offsets only for text nodes', () => {
    const withOffsets = textOffsets(hast);
    expect(withOffsets).not.toEqual(hast);
    const blockquoteNodePath = ['children', 0];
    const strongNodePath = [...blockquoteNodePath, 'children', 0];
    const textNode1Path = [...strongNodePath, 'children', 0];
    const textNode2Path = [...blockquoteNodePath, 'children', 1];

    expect(withOffsets).not.toHaveProperty(
      [...blockquoteNodePath, 'type'],
      'blockquote',
    );
    expect(withOffsets).not.toHaveProperty(['children', 0, 'data']);
    expect(withOffsets).not.toHaveProperty(
      [...strongNodePath, 'type'],
      'strong',
    );
    expect(withOffsets).not.toHaveProperty([...strongNodePath, 'data']);
    expect(withOffsets).toHaveProperty([...textNode1Path, 'type'], 'text');
    expect(withOffsets).toHaveProperty([...textNode1Path, 'data'], {
      textOffset: [0, 4],
    });
    expect(withOffsets).toHaveProperty([...textNode1Path, 'value'], 'some');
    expect(withOffsets).toHaveProperty([...textNode2Path, 'type'], 'text');
    expect(withOffsets).toHaveProperty([...textNode2Path, 'data'], {
      textOffset: [4, 12],
    });
    expect(withOffsets).toHaveProperty(
      [...textNode2Path, 'value'],
      '\ncontent',
    );
  });
});
