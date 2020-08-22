/**
 * A search algorithm is attachable to a `unified-doc` instance
 * and provides a consistent interface to search on a `doc`'s
 * `textContent`
 */
export type SearchAlgorithm = (
  /** string content to search on */
  content: string,
  /** query string */
  query: string,
  /** search algorithm options */
  options?: Record<string, any>,
) => SearchResult[];

/**
 * A search result provides a consistent interface to
 * represent results matched on a search query.
 */
export interface SearchResult {
  /** start offset of the search result relative to the `textContent` of the `doc` */
  start: number;
  /** end offset of the search result relative to the `textContent` of the `doc` */
  end: number;
  /** matched text value in the `doc` */
  value: string;
  /** additional data can be stored here */
  data?: Record<string, any>;
}
