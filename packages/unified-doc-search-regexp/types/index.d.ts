import { SearchAlgorithm } from 'unified-doc-types';

declare const search: SearchAlgorithm;

export interface Options {
  enableRegexp?: boolean;
  isCaseSensitive?: boolean;
}

export default search;
