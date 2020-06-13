import {
  Annotation,
  AnnotationCallback,
  AnnotationCallbacks,
  Hast,
} from 'unified-doc-types';

export { Annotation, AnnotationCallback, AnnotationCallbacks };

export interface Options {
  annotations: Annotation[];
  annotationCallbacks?: AnnotationCallbacks;
}

export default function annotate(hast: Hast, options: Options): Hast;
