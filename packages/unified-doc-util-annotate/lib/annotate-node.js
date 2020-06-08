import h from 'hastscript';

export function getAnnotatedNodes(nodeSegments, annotationCallbacks = {}) {
  const { onClick, onMouseEnter, onMouseOut } = annotationCallbacks;
  return nodeSegments.map((nodeSegment) => {
    const { annotations, value } = nodeSegment;
    let annotatedNode = { type: 'text', value };
    if (annotations.length > 0) {
      annotations
        .slice()
        .reverse() // create inner nodes first
        .forEach((annotation) => {
          const { id, className, data = {} } = annotation;
          const properties = {
            className,
            dataAnnotationId: id,
            ...data,
          };
          if (onClick) {
            properties.onClick = (event) => {
              onClick(annotation, event);
            };
          }
          if (onMouseEnter) {
            properties.onMouseEnter = (event) => {
              onMouseEnter(annotation, event);
            };
          }
          if (onMouseOut) {
            properties.onMouseOut = (event) => {
              onMouseOut(annotation, event);
            };
          }
          annotatedNode = h('mark', properties, annotatedNode);
        });
    }
    return annotatedNode;
  });
}

export function getOverLappingAnnotations(node, annotations) {
  const textOffsetStart = node.data.textOffset.start;
  const textOffsetEnd = node.data.textOffset.end;

  const overLappingAnnotations = [];
  for (const annotation of annotations) {
    const { start, end } = annotation;
    if (start >= textOffsetEnd) {
      break;
    } else if (end <= textOffsetStart) {
      continue;
    } else {
      overLappingAnnotations.push({
        ...annotation,
        start: Math.max(start, textOffsetStart),
        end: Math.min(end, textOffsetEnd),
      });
    }
  }
  return overLappingAnnotations;
}

export function getNodeSegments(node, annotations) {
  const textOffsetStart = node.data.textOffset.start;
  const textOffsetEnd = node.data.textOffset.end;

  // generate all possible segments given offsets
  const offsetsSet = new Set();
  offsetsSet.add(textOffsetStart);
  offsetsSet.add(textOffsetEnd);
  annotations.forEach((annotation) => {
    offsetsSet.add(annotation.start);
    offsetsSet.add(annotation.end);
  });
  const offsets = Array.from(offsetsSet).sort((a, b) => a - b);
  const segments = [];
  for (let i = 0; i < offsets.length - 1; i++) {
    segments.push([offsets[i], offsets[i + 1]]);
  }

  const nodeSegments = [];
  segments.forEach(([segmentOffsetStart, segmentOffsetEnd]) => {
    const startIndex = segmentOffsetStart - textOffsetStart;
    const endIndex = segmentOffsetEnd - textOffsetStart;
    const value = node.value.slice(startIndex, endIndex);
    if (value && startIndex >= 0 && endIndex > startIndex) {
      const nodeSegment = {
        annotations: annotations.filter((annotation) => {
          return (
            (annotation.end > segmentOffsetStart &&
              annotation.start < segmentOffsetEnd) ||
            (annotation.start < segmentOffsetEnd &&
              annotation.end > segmentOffsetStart)
          );
        }),
        textOffset: [segmentOffsetStart, segmentOffsetEnd],
        value,
      };
      nodeSegments.push(nodeSegment);
    }
  });

  return nodeSegments;
}