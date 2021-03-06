import map from 'unist-util-map';

export default function textOffsets(hast) {
  let start = 0;

  return map(hast, (node) => {
    if (node.type === 'text' && typeof node.value === 'string') {
      const textOffset = {
        start,
        end: (start += node.value.length),
      };
      const { data = {} } = node;

      return {
        ...node,
        data: {
          ...data,
          textOffset,
        },
      };
    }

    return node;
  });
}
