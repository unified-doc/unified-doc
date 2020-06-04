import { Node } from 'unist';

export interface Annotation {
  id: string;
  start: number;
  end: number;
}

export interface Options {
  annotations: Annotation[];
}

export default function annotate(hast: Node, options: Options): Node;
