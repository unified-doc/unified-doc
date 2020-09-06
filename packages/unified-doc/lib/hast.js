import toString from 'hast-util-to-string';
import filter from 'unist-util-filter';

export function toText(hast) {
  // @ts-ignore
  return toString(filter(hast, (node) => node.tagName !== 'head'));
}
