import map from 'unist-util-map';

import {
  createAnnotatedNode,
  getOverLappingAnnotations,
} from './lib/annotated-node';
import validateAnnotations from './lib/validate-annotations';

/**
 * - Sort annotations
 * - Loop through nodes
 * - [HARD] check if node is a textNode and has textOffset (implement findNodes(textOffset)).  If found, return a marked node (split algorithm), else return the node itself.
 * - Apply annotation callbacks and any other relevant data. **OR**
 * - Expose annotateNode(annotation, node) method that allows users to custom create nodes (e.g. assign callbacks, add tooltips etc, replace content).  This may allow removing `annotationCallbacks` public API.  Specify this public interface.
 */

export default function annotate(
  hast,
  { annotations: _annotations, annotationCallbacks: _annotationCallbacks },
) {
  const annotations = validateAnnotations(_annotations);

  return map(hast, (node) => {
    if (node.type === 'text' && node.data && node.data.textOffset) {
      const overlappingAnnotations = getOverLappingAnnotations(
        node,
        annotations,
      );
      const annotatedNode = createAnnotatedNode(node, overlappingAnnotations);
      return annotatedNode;
    }
    return node;
  });
}
