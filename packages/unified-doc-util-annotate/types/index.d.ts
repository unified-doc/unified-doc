import { Node } from 'unist';

type Optional<T> = {
  [P in keyof T]?: T[P];
};

export interface Annotation {
  id: string;
  start: number;
  end: number;
  className?: string[];
  data?: Record<string, unknown>;
}

export type AnnotationCallback = (
  annotation: Annotation,
  event?: MouseEvent,
) => void;

interface AnnotationCallbacks {
  onClick: AnnotationCallback;
  onMouseEnter: AnnotationCallback;
  onMouseOut: AnnotationCallback;
}

export interface Options {
  annotations: Annotation[];
  annotationCallbacks?: Optional<AnnotationCallbacks>;
}

export default function annotate(hast: Node, options: Options): Node;
