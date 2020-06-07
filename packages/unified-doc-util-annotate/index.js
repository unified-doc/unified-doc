import map from 'unist-util-map';

import {
  getAnnotatedNodes,
  getOverLappingAnnotations,
  getNodeSegments,
} from './lib/annotated-node';
import validateAnnotations from './lib/validate-annotations';

export default function annotate(hast, options) {
  const { annotations, annotationCallbacks } = options;
  const validatedAnnotations = validateAnnotations(annotations);

  return map(hast, (node) => {
    if (node.type === 'text' && node.data && node.data.textOffset) {
      const overlappingAnnotations = getOverLappingAnnotations(
        node,
        validatedAnnotations,
      );
      const nodeSegments = getNodeSegments(node, overlappingAnnotations);
      const annotatedNodes = getAnnotatedNodes(
        nodeSegments,
        annotationCallbacks,
      );
      console.log(annotatedNodes);
      return node;
    }
    return node;
  });
}
