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

export interface Doc {
  compile: () => VFile;
  file: (extension?: string) => FileData;
  parse: () => Hast;
  search: (
    query: string,
    options?: Record<string, any>,
  ) => SearchResultSnippet[];
  text: () => string;
}

export interface Options {
  content: string;
  filename: string;
  annotations?: Annotation[];
  annotationCallbacks?: AnnotationCallbacks;
  compiler?: Compiler;
  plugins?: Plugin | Plugin[];
  sanitizeSchema?: SanitizeSchema;
  searchAlgorithm?: SearchAlgorithm;
  searchOptions?: SearchOptions;
}

export interface SearchOptions {
  minQueryLength?: number;
  snippetOffsetPadding?: number;
}

export interface SearchResultSnippet extends SearchResult {
  snippet: [string, string, string];
}

export default function unifiedDoc(options: Options): Doc;
