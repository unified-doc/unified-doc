import textOffsets from 'unified-doc-util-text-offsets';
import visit from 'unist-util-visit';

import {
  getAnnotatedNodes,
  getOverLappingAnnotations,
  getNodeSegments,
} from './annotate-node';
import validateAnnotations from './validate-annotations';

export default function annotate(hast, annotations = []) {
  if (annotations.length === 0) {
    return hast;
  }

  const hastWithOffsets = textOffsets(hast);
  const validatedAnnotations = validateAnnotations(annotations);

  visit(hastWithOffsets, 'text', (node, _index, parent) => {
    if (!node.data || !node.data.textOffset) {
      return visit.CONTINUE;
    }

    const overlappingAnnotations = getOverLappingAnnotations(
      node,
      validatedAnnotations,
    );

    if (overlappingAnnotations.length === 0) {
      return visit.CONTINUE;
    }

    const appliedAnnotationIds = new Set();
    const nodeSegments = getNodeSegments(node, overlappingAnnotations);
    const annotatedNodes = getAnnotatedNodes(
      nodeSegments,
      appliedAnnotationIds,
    );

    // Reconstruct nodes under parent
    const siblings = parent.children;
    const currentNodeIndex = siblings.indexOf(node);
    parent.children = siblings
      .slice(0, currentNodeIndex)
      .concat(annotatedNodes)
      .concat(siblings.slice(currentNodeIndex + 1));

    return visit.CONTINUE;
  });

  return hastWithOffsets;
}
