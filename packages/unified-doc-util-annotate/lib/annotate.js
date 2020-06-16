import textOffsets from 'unified-doc-util-text-offsets';
import visit from 'unist-util-visit-parents';

import {
  getAnnotatedNodes,
  getOverLappingAnnotations,
  getNodeSegments,
} from './annotate-node';
import validateAnnotations from './validate-annotations';

function test(node) {
  return node.type === 'text' && node.data && node.data.textOffset;
}

export default function annotate(sourceHast, options) {
  const { annotations, annotationCallbacks } = options;

  if (annotations.length === 0) {
    return sourceHast;
  }

  const hast = textOffsets(sourceHast);
  const validatedAnnotations = validateAnnotations(annotations);

  // @ts-ignore TODO fix typing
  visit(hast, test, (node, parents) => {
    const overlappingAnnotations = getOverLappingAnnotations(
      node,
      validatedAnnotations,
    );

    if (overlappingAnnotations.length === 0) {
      return node;
    }

    const appliedAnnotationIds = new Set();
    const nodeSegments = getNodeSegments(node, overlappingAnnotations);
    const annotatedNodes = getAnnotatedNodes(
      nodeSegments,
      annotationCallbacks,
      appliedAnnotationIds,
    );

    // Reconstruct nodes under parent
    const parent = parents[parents.length - 1];
    const siblings = parent.children;
    const currentNodeIndex = siblings.indexOf(node);
    parent.children = siblings
      .slice(0, currentNodeIndex)
      .concat(annotatedNodes)
      .concat(siblings.slice(currentNodeIndex + 1));
  });

  return hast;
}
