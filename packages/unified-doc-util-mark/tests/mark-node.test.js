import {
  getMarkedNodes,
  getNodeSegments,
  getOverLappingMarks,
} from '../lib/mark-node';

const node = {
  type: 'text',
  data: { textOffset: { start: 20, end: 30 } },
  value: '0123456789',
};

describe('mark-node', () => {
  describe(getMarkedNodes, () => {
    it('returns plain text nodes if no marks are attached', () => {
      expect(
        getMarkedNodes([
          { marks: [], value: '01234' },
          { marks: [], value: '56789' },
        ]),
      ).toEqual([
        { type: 'text', value: '01234' },
        { type: 'text', value: '56789' },
      ]);
    });

    it('returns flat marked node if a single mark is specified', () => {
      expect(
        getMarkedNodes([
          { marks: [{ id: 'a', start: 0, end: 5 }], value: '01234' },
        ]),
      ).toEqual([
        {
          type: 'element',
          tagName: 'mark',
          children: [
            {
              type: 'text',
              value: '01234',
            },
          ],
          properties: {
            id: 'a',
            dataMarkId: 'a',
          },
        },
      ]);
    });

    it('returns nested marked node if multiple marks are specified', () => {
      expect(
        getMarkedNodes([
          {
            marks: [
              { id: 'a', start: 0, end: 3 },
              { id: 'b', start: 3, end: 5 },
              { id: 'c', start: 5, end: 10 },
            ],
            value: '01234',
          },
        ]),
      ).toEqual([
        {
          type: 'element',
          tagName: 'mark',
          children: [
            {
              type: 'element',
              tagName: 'mark',
              properties: {
                id: 'b',
                dataMarkId: 'b',
              },
              children: [
                {
                  type: 'element',
                  tagName: 'mark',
                  properties: {
                    id: 'c',
                    dataMarkId: 'c',
                  },
                  children: [
                    {
                      type: 'text',
                      value: '01234',
                    },
                  ],
                },
              ],
            },
          ],
          properties: {
            id: 'a',
            dataMarkId: 'a',
          },
        },
      ]);
    });

    it('applies className and style to node properties', () => {
      expect(
        getMarkedNodes([
          {
            marks: [
              {
                id: 'a',
                start: 0,
                end: 3,
                classNames: ['class-a', 'class-b'],
                style: { background: 'red', color: 'blue' },
              },
            ],
            value: '01234',
          },
        ]),
      ).toEqual([
        {
          type: 'element',
          tagName: 'mark',
          properties: {
            className: ['class-a', 'class-b'],
            id: 'a',
            dataMarkId: 'a',
            style: 'background: red; color: blue',
          },
          children: [{ type: 'text', value: '01234' }],
        },
      ]);
    });

    it('applies dataset attributes', () => {
      expect(
        getMarkedNodes([
          {
            marks: [
              {
                id: 'a',
                start: 0,
                end: 3,
                dataset: {
                  category: 'A',
                  classification: 'class-a',
                },
              },
            ],
            value: '01234',
          },
        ]),
      ).toEqual([
        {
          type: 'element',
          tagName: 'mark',
          properties: {
            id: 'a',
            dataMarkId: 'a',
            dataCategory: 'A',
            dataClassification: 'class-a',
          },
          children: [{ type: 'text', value: '01234' }],
        },
      ]);
    });
  });

  describe(getOverLappingMarks, () => {
    it('returns empty array when marks do not overlap with node', () => {
      expect(getOverLappingMarks(node, [])).toEqual([]);
      expect(
        getOverLappingMarks(node, [{ id: 'a', start: 10, end: 15 }]),
      ).toEqual([]);
      expect(
        getOverLappingMarks(node, [{ id: 'a', start: 40, end: 45 }]),
      ).toEqual([]);
      expect(
        getOverLappingMarks(node, [
          { id: 'a', start: 10, end: 15 },
          { id: 'b', start: 40, end: 45 },
        ]),
      ).toEqual([]);
      expect(
        getOverLappingMarks(node, [
          { id: 'a', start: 10, end: 20 },
          { id: 'b', start: 30, end: 45 },
        ]),
      ).toEqual([]);
    });

    it('returns overlapping marks', () => {
      expect(
        getOverLappingMarks(node, [{ id: 'a', start: 20, end: 30 }]),
      ).toEqual([{ id: 'a', start: 20, end: 30 }]);
      expect(
        getOverLappingMarks(node, [{ id: 'a', start: 10, end: 40 }]),
      ).toEqual([{ id: 'a', start: 20, end: 30 }]);
      expect(
        getOverLappingMarks(node, [{ id: 'a', start: 23, end: 28 }]),
      ).toEqual([{ id: 'a', start: 23, end: 28 }]);
      expect(
        getOverLappingMarks(node, [{ id: 'a', start: 15, end: 25 }]),
      ).toEqual([{ id: 'a', start: 20, end: 25 }]);
      expect(
        getOverLappingMarks(node, [{ id: 'a', start: 25, end: 35 }]),
      ).toEqual([{ id: 'a', start: 25, end: 30 }]);
      expect(
        getOverLappingMarks(node, [
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

  describe(getNodeSegments, () => {
    it('creates node segments for a single mark', () => {
      expect(getNodeSegments(node, [{ id: 'a', start: 10, end: 15 }])).toEqual([
        {
          marks: [],
          textOffset: [20, 30],
          value: '0123456789',
        },
      ]);
      expect(getNodeSegments(node, [{ id: 'a', start: 10, end: 40 }])).toEqual([
        {
          marks: [{ id: 'a', start: 10, end: 40 }],
          textOffset: [20, 30],
          value: '0123456789',
        },
      ]);
      expect(getNodeSegments(node, [{ id: 'a', start: 15, end: 25 }])).toEqual([
        {
          marks: [{ id: 'a', start: 15, end: 25 }],
          textOffset: [20, 25],
          value: '01234',
        },
        {
          marks: [],
          textOffset: [25, 30],
          value: '56789',
        },
      ]);
      expect(getNodeSegments(node, [{ id: 'a', start: 20, end: 30 }])).toEqual([
        {
          marks: [{ id: 'a', start: 20, end: 30 }],
          textOffset: [20, 30],
          value: '0123456789',
        },
      ]);
      expect(getNodeSegments(node, [{ id: 'a', start: 23, end: 28 }])).toEqual([
        {
          marks: [],
          textOffset: [20, 23],
          value: '012',
        },
        {
          marks: [{ id: 'a', start: 23, end: 28 }],
          textOffset: [23, 28],
          value: '34567',
        },
        {
          marks: [],
          textOffset: [28, 30],
          value: '89',
        },
      ]);
      expect(getNodeSegments(node, [{ id: 'a', start: 25, end: 35 }])).toEqual([
        {
          marks: [],
          textOffset: [20, 25],
          value: '01234',
        },
        {
          marks: [{ id: 'a', start: 25, end: 35 }],
          textOffset: [25, 30],
          value: '56789',
        },
      ]);
      expect(getNodeSegments(node, [{ id: 'a', start: 35, end: 40 }])).toEqual([
        {
          marks: [],
          textOffset: [20, 30],
          value: '0123456789',
        },
      ]);
    });
  });

  it('creates node segments for multiple overlapping marks', () => {
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
        marks: [
          { id: 'b', start: 10, end: 40 },
          { id: 'c', start: 15, end: 25 },
          { id: 'd', start: 20, end: 30 },
        ],
        textOffset: [20, 23],
        value: '012',
      },
      {
        marks: [
          { id: 'b', start: 10, end: 40 },
          { id: 'c', start: 15, end: 25 },
          { id: 'd', start: 20, end: 30 },
          { id: 'e', start: 23, end: 28 },
        ],
        textOffset: [23, 25],
        value: '34',
      },
      {
        marks: [
          { id: 'b', start: 10, end: 40 },
          { id: 'd', start: 20, end: 30 },
          { id: 'e', start: 23, end: 28 },
          { id: 'f', start: 25, end: 35 },
        ],
        textOffset: [25, 28],
        value: '567',
      },
      {
        marks: [
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
