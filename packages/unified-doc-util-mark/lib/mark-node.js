import h from 'hastscript';

export function getMarkedNodes(nodeSegments, appliedMarkIds = new Set()) {
  return nodeSegments.map((nodeSegment) => {
    const { marks, value } = nodeSegment;
    let markedNode = { type: 'text', value };

    marks
      .slice()
      .reverse() // Create inner nodes first
      .forEach((mark) => {
        const { id, classNames, dataset = {}, style } = mark;

        const properties = {};
        Object.keys(dataset).forEach((key) => {
          const datasetKey = `data${key[0].toUpperCase()}${key.slice(1)}`;
          properties[datasetKey] = dataset[key];
        });
        properties.className = classNames;
        properties.dataMarkId = id;
        properties.style = style;
        if (!appliedMarkIds.has(id)) {
          properties.id = id; // add id to first marked node
          appliedMarkIds.add(id);
        }
        markedNode = h('mark', properties, markedNode);
      });

    return markedNode;
  });
}

export function getOverLappingMarks(node, marks) {
  const { start: textOffsetStart, end: textOffsetEnd } = node.data.textOffset;
  const overLappingMarks = [];
  for (const mark of marks) {
    const { start, end } = mark;
    if (start >= textOffsetEnd) {
      break;
    } else if (end <= textOffsetStart) {
      continue;
    } else {
      overLappingMarks.push({
        ...mark,
        start: Math.max(start, textOffsetStart),
        end: Math.min(end, textOffsetEnd),
      });
    }
  }

  return overLappingMarks;
}

export function getNodeSegments(node, marks) {
  const { start: textOffsetStart, end: textOffsetEnd } = node.data.textOffset;

  // Generate all possible segments given offsets
  const offsetsSet = new Set();
  offsetsSet.add(textOffsetStart);
  offsetsSet.add(textOffsetEnd);
  marks.forEach((mark) => {
    offsetsSet.add(mark.start);
    offsetsSet.add(mark.end);
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
        marks: marks.filter((mark) => {
          return (
            (mark.end > segmentOffsetStart && mark.start < segmentOffsetEnd) ||
            (mark.start < segmentOffsetEnd && mark.end > segmentOffsetStart)
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
