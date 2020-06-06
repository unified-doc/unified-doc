import textOffsets from '~/unified-doc-util-text-offsets';

import { hast } from './fixtures';

describe('textOffsets', () => {
  it('should return a new unmodified tree', () => {
    const hast = { type: 'root', children: [] };
    expect(textOffsets(hast)).not.toBe(hast);
    expect(textOffsets(hast)).toEqual(hast);
  });

  it('should apply the correct text offsets only for text nodes', () => {
    const withTextOffsets = textOffsets(hast);
    expect(withTextOffsets).not.toEqual(hast);
    const blockquoteNodePath = ['children', 0];
    const strongNodePath = [...blockquoteNodePath, 'children', 0];
    const textNode1Path = [...strongNodePath, 'children', 0];
    const textNode2Path = [...blockquoteNodePath, 'children', 1];

    expect(withTextOffsets).not.toHaveProperty(
      [...blockquoteNodePath, 'type'],
      'blockquote',
    );
    expect(withTextOffsets).not.toHaveProperty(['children', 0, 'data']);
    expect(withTextOffsets).not.toHaveProperty(
      [...strongNodePath, 'type'],
      'strong',
    );
    expect(withTextOffsets).not.toHaveProperty([...strongNodePath, 'data']);
    expect(withTextOffsets).toHaveProperty([...textNode1Path, 'type'], 'text');
    expect(withTextOffsets).toHaveProperty([...textNode1Path, 'data'], {
      textOffset: [0, 4],
    });
    expect(withTextOffsets).toHaveProperty([...textNode1Path, 'value'], 'some');
    expect(withTextOffsets).toHaveProperty([...textNode2Path, 'type'], 'text');
    expect(withTextOffsets).toHaveProperty([...textNode2Path, 'data'], {
      textOffset: [4, 12],
    });
    expect(withTextOffsets).toHaveProperty(
      [...textNode2Path, 'value'],
      '\ncontent',
    );
  });
});
