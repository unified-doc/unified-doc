// alias for hast node
export { Node as Hast } from 'hast';

export interface FileData {
  /** file content in string form */
  content: string;
  /** file extension (includes preceding '.') */
  extension: string;
  /** file name (includes extension) */
  name: string;
  /** file name (without extension) */
  stem: string;
  /** mime type of file */
  type: string;
}

// see https://github.com/syntax-tree/hast-util-sanitize
export type SanitizeSchema = Record<string, any>;
