import { Node } from 'hast';

import { Annotation } from './annotation';

export interface FileData {
  content: string;
  extension: string;
  name: string;
  stem: string;
  type: string;
}

export type Hast = Node;

export type SanitizeSchema = Record<string, any>;

export interface UniFile {
  annotations: Annotation[];
  basename: string;
  hast: Hast;
}
