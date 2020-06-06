export function getOverLappingAnnotations(node, annotations) {
  const overLappingAnnotations = [];
  for (const annotation of annotations) {
    if (annotation.start > node.data.textOffset.end) {
      break;
    } else if (annotation.end < node.data.textOffset.start) {
      continue;
    } else {
      overLappingAnnotations.push(annotation);
    }
  }
  return overLappingAnnotations;
}

export function createAnnotatedNode(node, annotations) {
  console.log(node, annotations);
  return node;
}
