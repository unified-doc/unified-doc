export type SearchAlgorithm = (
  content: string,
  query: string,
  options?: Record<string, any>,
) => SearchResult[];

export interface SearchResult {
  start: number;
  end: number;
  value: string;
}
