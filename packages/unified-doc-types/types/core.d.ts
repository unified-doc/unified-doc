export { Node as Hast } from 'hast';

export interface FileData {
  content: string;
  extension: string;
  name: string;
  stem: string;
  type: string;
}

export type SanitizeSchema = Record<string, any>;
