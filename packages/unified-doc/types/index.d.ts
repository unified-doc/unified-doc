import {
  Annotation,
  AnnotationCallbacks,
  Compiler,
  FileData,
  Hast,
  Plugin,
  SanitizeSchema,
  SearchAlgorithm,
  SearchResult,
} from 'unified-doc-types';
import { VFile } from 'vfile';

export {
  Annotation,
  AnnotationCallbacks,
  Compiler,
  FileData,
  Hast,
  Plugin,
  SanitizeSchema,
  SearchAlgorithm,
  SearchResult,
  VFile,
};

export interface Options {
  filename: string;
  annotations?: Annotation[];
  annotationCallbacks?: AnnotationCallbacks;
  compiler?: Compiler;
  content?: string | Buffer;
  plugins?: Plugin | Plugin[];
  sanitizeSchema?: SanitizeSchema;
  searchAlgorithm?: SearchAlgorithm;
}

export interface Doc {
  compile: () => VFile;
  file: (extension?: string) => FileData;
  parse: () => Hast;
  search: (query: string, options?: Record<string, any>) => SearchResult[];
  string: () => string;
  text: () => string;
}

export default function unifiedDoc(options: Options): Doc;
