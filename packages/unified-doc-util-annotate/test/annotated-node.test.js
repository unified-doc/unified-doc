import {
  getOverLappingAnnotations,
  getNodeSegments,
} from '../lib/annotated-node';

const node = {
  type: 'text',
  data: { textOffset: { start: 20, end: 30 } },
  value: '0123456789',
};

describe('annotated-node', () => {
  describe('getAnnotatedNodes', () => {
    it('TODO will be implemented', () => {});
  });

  describe('getOverLappingAnnotations', () => {
    it('returns empty array when annotations do not overlap with node', () => {
      expect(getOverLappingAnnotations(node, [])).toEqual([]);
      expect(
        getOverLappingAnnotations(node, [{ id: 'a', start: 10, end: 15 }]),
      ).toEqual([]);
      expect(
        getOverLappingAnnotations(node, [{ id: 'a', start: 40, end: 45 }]),
      ).toEqual([]);
      expect(
        getOverLappingAnnotations(node, [
          { id: 'a', start: 10, end: 15 },
          { id: 'b', start: 40, end: 45 },
        ]),
      ).toEqual([]);
      expect(
        getOverLappingAnnotations(node, [
          { id: 'a', start: 10, end: 20 },
          { id: 'b', start: 30, end: 45 },
        ]),
      ).toEqual([]);
    });

    it('returns overlapping annotations', () => {
      expect(
        getOverLappingAnnotations(node, [{ id: 'a', start: 20, end: 30 }]),
      ).toEqual([{ id: 'a', start: 20, end: 30 }]);
      expect(
        getOverLappingAnnotations(node, [{ id: 'a', start: 10, end: 40 }]),
      ).toEqual([{ id: 'a', start: 20, end: 30 }]);
      expect(
        getOverLappingAnnotations(node, [{ id: 'a', start: 23, end: 28 }]),
      ).toEqual([{ id: 'a', start: 23, end: 28 }]);
      expect(
        getOverLappingAnnotations(node, [{ id: 'a', start: 15, end: 25 }]),
      ).toEqual([{ id: 'a', start: 20, end: 25 }]);
      expect(
        getOverLappingAnnotations(node, [{ id: 'a', start: 25, end: 35 }]),
      ).toEqual([{ id: 'a', start: 25, end: 30 }]);
      expect(
        getOverLappingAnnotations(node, [
          { id: 'a', start: 10, end: 15 },
          { id: 'b', start: 10, end: 40 },
          { id: 'c', start: 15, end: 25 },
          { id: 'd', start: 20, end: 30 },
          { id: 'e', start: 23, end: 28 },
          { id: 'f', start: 25, end: 35 },
          { id: 'g', start: 35, end: 40 },
        ]),
      ).toEqual([
        { id: 'b', start: 20, end: 30 },
        { id: 'c', start: 20, end: 25 },
        { id: 'd', start: 20, end: 30 },
        { id: 'e', start: 23, end: 28 },
        { id: 'f', start: 25, end: 30 },
      ]);
    });
  });

  describe('getNodeSegments', () => {
    it('creates node segments for a single annotation', () => {
      expect(getNodeSegments(node, [{ id: 'a', start: 10, end: 15 }])).toEqual([
        {
          annotations: [],
          textOffset: [20, 30],
          value: '0123456789',
        },
      ]);
      expect(getNodeSegments(node, [{ id: 'a', start: 10, end: 40 }])).toEqual([
        {
          annotations: [{ id: 'a', start: 10, end: 40 }],
          textOffset: [20, 30],
          value: '0123456789',
        },
      ]);
      expect(getNodeSegments(node, [{ id: 'a', start: 15, end: 25 }])).toEqual([
        {
          annotations: [{ id: 'a', start: 15, end: 25 }],
          textOffset: [20, 25],
          value: '01234',
        },
        {
          annotations: [],
          textOffset: [25, 30],
          value: '56789',
        },
      ]);
      expect(getNodeSegments(node, [{ id: 'a', start: 20, end: 30 }])).toEqual([
        {
          annotations: [{ id: 'a', start: 20, end: 30 }],
          textOffset: [20, 30],
          value: '0123456789',
        },
      ]);
      expect(getNodeSegments(node, [{ id: 'a', start: 23, end: 28 }])).toEqual([
        {
          annotations: [],
          textOffset: [20, 23],
          value: '012',
        },
        {
          annotations: [{ id: 'a', start: 23, end: 28 }],
          textOffset: [23, 28],
          value: '34567',
        },
        {
          annotations: [],
          textOffset: [28, 30],
          value: '89',
        },
      ]);
      expect(getNodeSegments(node, [{ id: 'a', start: 25, end: 35 }])).toEqual([
        {
          annotations: [],
          textOffset: [20, 25],
          value: '01234',
        },
        {
          annotations: [{ id: 'a', start: 25, end: 35 }],
          textOffset: [25, 30],
          value: '56789',
        },
      ]);
      expect(getNodeSegments(node, [{ id: 'a', start: 35, end: 40 }])).toEqual([
        {
          annotations: [],
          textOffset: [20, 30],
          value: '0123456789',
        },
      ]);
    });
  });

  it('creates node segments for multiple overlapping annotations', () => {
    expect(
      getNodeSegments(node, [
        { id: 'a', start: 10, end: 15 },
        { id: 'b', start: 10, end: 40 },
        { id: 'c', start: 15, end: 25 },
        { id: 'd', start: 20, end: 30 },
        { id: 'e', start: 23, end: 28 },
        { id: 'f', start: 25, end: 35 },
        { id: 'g', start: 35, end: 40 },
      ]),
    ).toEqual([
      {
        annotations: [
          { id: 'b', start: 10, end: 40 },
          { id: 'c', start: 15, end: 25 },
          { id: 'd', start: 20, end: 30 },
        ],
        textOffset: [20, 23],
        value: '012',
      },
      {
        annotations: [
          { id: 'b', start: 10, end: 40 },
          { id: 'c', start: 15, end: 25 },
          { id: 'd', start: 20, end: 30 },
          { id: 'e', start: 23, end: 28 },
        ],
        textOffset: [23, 25],
        value: '34',
      },
      {
        annotations: [
          { id: 'b', start: 10, end: 40 },
          { id: 'd', start: 20, end: 30 },
          { id: 'e', start: 23, end: 28 },
          { id: 'f', start: 25, end: 35 },
        ],
        textOffset: [25, 28],
        value: '567',
      },
      {
        annotations: [
          { id: 'b', start: 10, end: 40 },
          { id: 'd', start: 20, end: 30 },
          { id: 'f', start: 25, end: 35 },
        ],
        textOffset: [28, 30],
        value: '89',
      },
    ]);
  });
});
