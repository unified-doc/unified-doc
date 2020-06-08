import h from 'hastscript';
import map from 'unist-util-map';

import {
  getAnnotatedNodes,
  getOverLappingAnnotations,
  getNodeSegments,
} from './lib/annotate-node';
import validateAnnotations from './lib/validate-annotations';

export default function annotate(hast, options) {
  const { annotations, annotationCallbacks } = options;

  if (annotations.length === 0) {
    return hast;
  }

  const validatedAnnotations = validateAnnotations(annotations);

  return map(hast, (node) => {
    if (node.type === 'text' && node.data && node.data.textOffset) {
      const overlappingAnnotations = getOverLappingAnnotations(
        node,
        validatedAnnotations,
      );

      if (overlappingAnnotations.length === 0) {
        return node;
      }

      const nodeSegments = getNodeSegments(node, overlappingAnnotations);
      const annotatedNodes = getAnnotatedNodes(
        nodeSegments,
        annotationCallbacks,
      );
      return h('div', annotatedNodes);
    }
    return node;
  });
}
