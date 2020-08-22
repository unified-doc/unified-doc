/**
 * An object used by a mark algorithm to mark text nodes based on text offset positions
 */
export interface Mark {
  /** unique ID for mark (required for mark algorithm to work) */
  id: string;
  /** start offset of the mark relative to the `textContent` of the `doc` */
  start: number;
  /** end offset of the mark relative to the `textContent` of the `doc` */
  end: number;
  /** apply optional CSS classnames to marked nodes */
  classNames?: string[];
  /** apply optional dataset attributes (i.e. `data-*`) to marked nodes */
  dataset?: Record<string, any>;
  /** additional data can be stored here */
  data?: Record<string, any>;
  /** apply optional styles to marked nodes */
  style?: Record<string, any>;
}
