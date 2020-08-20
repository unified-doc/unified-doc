import textOffsets from 'unified-doc-util-text-offsets';
import visit from 'unist-util-visit';

import {
  getMarkedNodes,
  getOverLappingMarks,
  getNodeSegments,
} from './mark-node';
import validateMarks from './validate-marks';

export default function mark(hast, marks = []) {
  if (marks.length === 0) {
    return hast;
  }

  const hastWithOffsets = textOffsets(hast);
  const validatedMarks = validateMarks(marks);

  visit(hastWithOffsets, 'text', (node, _index, parent) => {
    if (!node.data || !node.data.textOffset) {
      return visit.CONTINUE;
    }
    const overlappingMarks = getOverLappingMarks(node, validatedMarks);
    if (overlappingMarks.length === 0) {
      return visit.CONTINUE;
    }
    const appliedMarkIds = new Set();
    const nodeSegments = getNodeSegments(node, overlappingMarks);
    const markedNodes = getMarkedNodes(nodeSegments, appliedMarkIds);

    // Reconstruct nodes under parent
    const siblings = parent.children;
    const currentNodeIndex = siblings.indexOf(node);
    parent.children = siblings
      .slice(0, currentNodeIndex)
      .concat(markedNodes)
      .concat(siblings.slice(currentNodeIndex + 1));
    return visit.CONTINUE;
  });

  return hastWithOffsets;
}
