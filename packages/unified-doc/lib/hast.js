import toString from 'hast-util-to-string';
import filter from 'unist-util-filter';

function skipHeadNode(node) {
  return node.tagName !== 'head';
}

export function toText(hast) {
  return toString(filter(hast, skipHeadNode));
}
