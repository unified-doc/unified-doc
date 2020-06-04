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
  content?: string | File;
  plugins?: Plugin[] | Plugin[][];
  filename: string;
  sanitizeSchema?: object;
}

export interface Document {
  // attributes
  extname: string;
  filename: string;
  stem: string;
  // methods
  annotate: (annotations: Annotation[]) => any[];
  compile: () => VFile;
  file: (extension?: string) => File;
  parse: () => Node;
  search: (query: string) => any[];
  text: () => string;
}

export default function unifiedDoc(options: Options): Document;
