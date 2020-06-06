import { Annotation } from 'unified-doc-util-annotate';
import { Plugin } from 'unified';
import { Node as UnistNode } from 'unist';
import { VFile } from 'vfile';

export type SearchAlgorithm = (content: string, options: object) => Snippet[];

export interface File {
  content: string;
  extension: string;
  name: string;
  stem: string;
  type: string;
}

export interface Options {
  annotations?: Annotation[];
  compiler?: Plugin | Plugin[];
  content?: string | Buffer | File;
  filename: string;
  plugins?: Plugin[] | Plugin[][];
  sanitizeSchema?: object;
  searchAlgorithm?: SearchAlgorithm;
}

// TODO: check how to reference unknown properties on unist node
export interface Node extends UnistNode {
  children: Node[];
}

export interface Snippet {
  start: number;
  end: number;
  value: string;
}

export interface Doc {
  compile: () => VFile;
  file: (extension?: string) => File;
  parse: () => Node;
  search: (options?: object) => Snippet[];
  string: () => string;
  text: () => string;
}

export default function unifiedDoc(options: Options): Doc;
