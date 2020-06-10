import { Annotation, AnnotationCallbacks } from 'unified-doc-util-annotate';
import { Plugin } from 'unified';
import { Node as UnistNode } from 'unist';
import { VFile } from 'vfile';

type Optional<T> = {
  [P in keyof T]?: T[P];
};

export { Annotation, AnnotationCallbacks, Plugin };

export type SearchAlgorithm = (
  content: string,
  options: Record<string, unknown>,
) => Snippet[];

export interface File {
  content: string;
  extension: string;
  name: string;
  stem: string;
  type: string;
}

export interface Options {
  filename: string;
  annotations?: Annotation[];
  annotationCallbacks?: Optional<AnnotationCallbacks>;
  compiler?: any; // TODO: need help on typing this correctly
  content?: string | Buffer;
  plugins?: Plugin[] | Plugin[][];
  sanitizeSchema?: Record<string, unknown>;
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
  search: (options?: Record<string, unknown>) => Snippet[];
  string: () => string;
  text: () => string;
}

export default function unifiedDoc(options: Options): Doc;
