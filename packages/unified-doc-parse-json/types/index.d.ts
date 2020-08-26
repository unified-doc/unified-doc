export interface Options {
  /** classnames attached to the pre node containing the JSON */
  classNames?: string[];
  /** reformat the JSON with the provided whitespace */
  space?: number;
}

export default function parse(options?: Options): void;
