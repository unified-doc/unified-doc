/**
 * Validate annotations and return sorted annotations with sort order:
 * { start: 'asc', end: 'desc' }]
 **/
export default function validateAnnotations(annotations) {
  const uniqueIds = new Set();
  let invalidOffsets = false;

  annotations.forEach((annotation) => {
    const { id, start, end } = annotation;
    if (id) {
      uniqueIds.add(id);
    }
    if (start > end) {
      invalidOffsets = true;
    }
  });

  if (uniqueIds.size !== annotations.length) {
    console.warn('Annotations must contain unique "id" fields');
  }
  if (invalidOffsets) {
    console.warn('Annotations should have "start" < "end"');
  }

  const sortedAnnotations = annotations.slice().sort((a, b) => {
    if (a.start < b.start) {
      return -1;
    }
    if (a.start > b.start) {
      return 1;
    }
    if (a.end < b.end) {
      return 1;
    }
    if (a.end > b.end) {
      return -1;
    }
    return 0;
  });

  return sortedAnnotations;
}
