import {
  FileData,
  Hast,
  Mark,
  SanitizeSchema,
  SearchAlgorithm,
  SearchResult,
} from 'unified-doc-types';
import { PluggableList } from 'unified';
import { VFile } from 'vfile';

export {
  FileData,
  Hast,
  Mark,
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
  compiler?: PluggableList;
  marks?: Mark[];
  parsers?: Parsers;
  postPlugins?: PluggableList;
  sanitizeSchema?: SanitizeSchema | null;
  searchAlgorithm?: SearchAlgorithm;
  searchOptions?: SearchOptions;
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
