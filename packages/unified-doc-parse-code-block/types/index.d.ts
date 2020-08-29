export interface Options {
  /** code language attached as a semantic className on the <code /> node */
  language?: string;
}

export default function parse(options?: Options): void;
