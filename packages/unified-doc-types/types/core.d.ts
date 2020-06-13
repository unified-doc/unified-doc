import { Node } from 'hast';

import { Annotation } from './annotation';

export type Compiler = any; // TODO: need help on typing this formally

export interface FileData {
  content: string;
  extension: string;
  name: string;
  stem: string;
  type: string;
}

// TODO: need help on typing this formally
export interface Hast extends Node {
  children?: Node[];
}

export type Plugin = any; // TODO: need help on typing this formally

export type SanitizeSchema = Record<string, any>;

export interface UniFile {
  annotations: Annotation[];
  basename: string;
  hast: Hast;
}
