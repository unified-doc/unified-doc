import visit from 'unist-util-visit-parents';
import deepmerge from 'deepmerge';

import {
  getAnnotatedNodes,
  getOverLappingAnnotations,
  getNodeSegments,
} from './lib/annotate-node';
import validateAnnotations from './lib/validate-annotations';

function test(node) {
  return node.type === 'text' && node.data && node.data.textOffset;
}

export default function annotate(sourceHast, options) {
  const { annotations, annotationCallbacks } = options;

  if (annotations.length === 0) {
    return sourceHast;
  }

  const hast = deepmerge(sourceHast, {}); // avoid mutating the source hast

  const validatedAnnotations = validateAnnotations(annotations);
  const appliedAnnotationIds = new Set();

  // @ts-ignore TODO fix typing
  visit(hast, test, (node, parents) => {
    const parent = parents[parents.length - 1]; // Get immediate parent
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
      appliedAnnotationIds,
    );

    // Reconstruct nodes under parent
    const siblings = parent.children;
    const currentNodeIndex = siblings.indexOf(node);
    parent.children = siblings
      .slice(0, currentNodeIndex)
      .concat(annotatedNodes)
      .concat(siblings.slice(currentNodeIndex + 1));
  });

  return hast;
}
