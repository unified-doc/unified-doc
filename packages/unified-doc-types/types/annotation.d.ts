export interface Annotation {
  id: string;
  start: number;
  end: number;
  classNames?: string[];
  data?: Record<string, any>;
  style?: Record<string, any>;
}

export type AnnotationCallback = (
  annotation: Annotation,
  event?: MouseEvent,
) => void;

export interface AnnotationCallbacks {
  onClick?: AnnotationCallback;
  onMouseEnter?: AnnotationCallback;
  onMouseOut?: AnnotationCallback;
}
