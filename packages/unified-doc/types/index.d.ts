import {
  Annotation,
  FileData,
  Hast,
  SanitizeSchema,
  SearchAlgorithm,
  SearchResult,
} from 'unified-doc-types';
import { PluggableList } from 'unified';
import { VFile } from 'vfile';

export {
  Annotation,
  FileData,
  Hast,
  PluggableList,
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
  textContent: () => string;
}

export interface Options {
  content: string;
  filename: string;
  annotations?: Annotation[];
  compiler?: PluggableList;
  parsers?: Parsers;
  plugins?: PluggableList;
  sanitizeSchema?: SanitizeSchema | null;
  searchOptions?: SearchOptions;
  searchAlgorithm?: SearchAlgorithm;
}

export interface Parsers {
  [mimeType: string]: PluggableList;
}

export interface SearchOptions {
  minQueryLength?: number;
  snippetOffsetPadding?: number;
}

export interface SearchResultSnippet extends SearchResult {
  snippet: [string, string, string];
}

export default function unifiedDoc(options: Options): Doc;
