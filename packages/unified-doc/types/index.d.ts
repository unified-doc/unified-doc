import { Annotation } from 'unified-doc-util-annotate';
import { Plugin } from 'unified';
import { Node as UnistNode } from 'unist';
import { VFile } from 'vfile';

// TODO: check how to reference unknown properties on unist node
interface Node extends UnistNode {
  children: Node[];
}

export interface File {
  content: string;
  extension: string;
  name: string;
  stem: string;
  type: string;
}

export interface Options {
  compiler?: Plugin | Plugin[];
  content?: string | Buffer | File;
  filename: string;
  plugins?: Plugin[] | Plugin[][];
  sanitizeSchema?: object;
}

export interface Doc {
  // TODO: define typing
  annotate: (annotations: Annotation[]) => any[];
  compile: () => VFile;
  file: (extension?: string) => File;
  parse: () => Node;
  // TODO: define typing
  search: (query: string) => any[];
  text: () => string;
}

export default function unifiedDoc(options: Options): Doc;
