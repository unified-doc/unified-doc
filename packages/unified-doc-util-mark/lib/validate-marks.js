/**
 * Validate and return sorted marks with sort order:
 * { start: 'asc', end: 'desc' }]
 **/
export default function validateMarks(marks) {
  const uniqueIds = new Set();
  let invalidOffsets = false;

  marks.forEach((mark) => {
    const { id, start, end } = mark;
    if (id) {
      uniqueIds.add(id);
    }
    if (start > end) {
      invalidOffsets = true;
    }
  });

  if (uniqueIds.size !== marks.length) {
    console.warn('Marks must contain unique "id" fields');
  }
  if (invalidOffsets) {
    console.warn('Marks should have "start" < "end"');
  }

  const sortedMarks = marks.slice().sort((a, b) => {
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

  return sortedMarks;
}
