export type SearchAlgorithm = (
  content: string,
  query: string,
  options?: Record<string, any>,
) => SearchResult[];

export interface SearchResult {
  [key: string]: any;
  start: number;
  end: number;
  value: string;
}
