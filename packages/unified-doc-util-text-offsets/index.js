import map from 'unist-util-map';

export default function textOffsets(hast) {
  let start = 0;
  return map(hast, (node) => {
    if (node.type === 'text' && typeof node.value === 'string') {
      const textOffset = [start, (start += node.value.length)];
      const data = node.data || {};
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
