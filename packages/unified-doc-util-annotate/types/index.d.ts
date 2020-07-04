import { Annotation, Hast } from 'unified-doc-types';

export { Annotation };

export default function annotate(hast: Hast, annotations: Annotation[]): Hast;
