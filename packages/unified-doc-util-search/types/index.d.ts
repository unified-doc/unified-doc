import { Node } from 'unist';

export interface Options {
  query: string;
}

export default function search(hast: Node, options: Options): Node;
