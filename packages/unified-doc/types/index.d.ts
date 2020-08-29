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

/**
 * Relevant named exports
 */
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

/**
 * An instance of `unified-doc` exposing unified document API methods
 */
export interface Doc {
  /** compiles the content into results that can be used for rendering */
  compile: () => VFile;
  /** returns file data corresponding to the specified extension (e.g. '.html', '.txt') */
  file: (extension?: string) => FileData;
  /** parses the content into a `hast` tree */
  parse: () => Hast;
  /** returns search results when searching the `doc` with a provided query string and options.  The search algorithm is specified when initializing the `doc` instance. */
  search: (
    /** search query string */
    query: string,
    /** algorithm-specific options based on attached search algorithm */
    options?: Record<string, any>,
  ) => SearchResultSnippet[];
  /** returns the `textContent` representation of the `doc` (i.e. concatenation of all text node values) */
  textContent: () => string;
}

/**
 * Configurations for `unified-doc`
 */
export interface Options {
  /** required content must be provided */
  content: string;
  /** required filename must be provided.  This infers the mimeType of the content and subsequently how content will be parsed */
  filename: string;
  /** attach a compiler (with optional options) in the `PluggableList` interface to determine how the content will be compiled */
  compiler?: PluggableList;
  /** an array of `Mark` data that is used by the mark algorithm to insert `mark` nodes with matching offsets */
  marks?: Mark[];
  /** specify new parsers or override existing parsers with this map */
  parsers?: Parsers;
  /** apply plugins to further customize the `doc`.  These plugins are applied after private plugins (hence the 'post' prefix).  Private methods such as `textContent()` and `parse()` will not incorporate `hast` modifications introduced by these plugins. */
  postPlugins?: PluggableList;
  /** apply plugins to further customize the `doc`.  These plugins are applied before private plugins (hence the 'pre' prefix).  Private methods such as `textContent()` and `parse()` may incorporate `hast` modifications introduced by these plugins. */
  prePlugins?: PluggableList;
  /** provide a sanitize schema for sanitizing the `doc`.  By default, the `doc` is safely sanitized.  If `null` is provided as a value, the `doc` will not be sanitized. */
  sanitizeSchema?: SanitizeSchema | null;
  /** attach a search algorithm that implements the `SearchAlgorithm` interface to support custom search behaviors on a `doc` */
  searchAlgorithm?: SearchAlgorithm;
  /** unified search options independent of the attached search algorithm */
  searchOptions?: SearchOptions;
}

/**
 * Mapping of mimeTypes to unified parsers.
 * New parsers can be introduced and existing parsers can be overwritten.
 * Parsers are provided in the `PluggableList` interface.
 * Parsers may consist of multiple steps.
 */
export interface Parsers {
  [mimeType: string]: PluggableList;
}

/**
 * Unified search options affecting any attached search algorithm.
 */
export interface SearchOptions {
  /** only execute `doc.search` if the query is at least of the specified length */
  minQueryLength?: number;
  /** return snippets padded with extra characters on the left/right of the matched value based on the specified padding length */
  snippetOffsetPadding?: number;
}

/**
 * Unified interface for representing a search result snippet
 */
export interface SearchResultSnippet extends SearchResult {
  /** 3-tuple string representing the [left, matched, right] of a matched search result.  left/right are characters to the left/right of the matched text value, and its length is configurable in `SearchOptions.snippetOffsetPadding` */
  snippet: [string, string, string];
}

/**
 * The core function that returns a `doc` instance with unified document APIs
 */
export default function Doc(options: Options): Doc;
