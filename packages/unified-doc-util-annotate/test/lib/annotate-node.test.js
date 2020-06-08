import {
  getAnnotatedNodes,
  getOverLappingAnnotations,
  getNodeSegments,
} from '../../lib/annotate-node';

const node = {
  type: 'text',
  data: { textOffset: { start: 20, end: 30 } },
  value: '0123456789',
};

describe('annotated-node', () => {
  describe('getAnnotatedNodes', () => {
    it('returns plain text nodes if no annotations are attached', () => {
      expect(
        getAnnotatedNodes([
          { annotations: [], value: '01234' },
          { annotations: [], value: '56789' },
        ]),
      ).toEqual([
        { type: 'text', value: '01234' },
        { type: 'text', value: '56789' },
      ]);
    });

    it('returns flat annotated node if a single annotation is specified', () => {
      expect(
        getAnnotatedNodes([
          { annotations: [{ id: 'a', start: 0, end: 5 }], value: '01234' },
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
            dataAnnotationId: 'a',
          },
        },
      ]);
    });

    it('returns nested annotated node if a many annotations are specified', () => {
      expect(
        getAnnotatedNodes([
          {
            annotations: [
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
                dataAnnotationId: 'b',
              },
              children: [
                {
                  type: 'element',
                  tagName: 'mark',
                  properties: {
                    dataAnnotationId: 'c',
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
            dataAnnotationId: 'a',
          },
        },
      ]);
    });

    it('applies className and data fields to node properties', () => {
      expect(
        getAnnotatedNodes([
          {
            annotations: [
              {
                id: 'a',
                start: 0,
                end: 3,
                className: ['class-a', 'class-b'],
                data: { fieldA: 'fieldA', fieldB: 'fieldB' },
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
            dataAnnotationId: 'a',
            fieldA: 'fieldA',
            fieldB: 'fieldB',
          },
          children: [{ type: 'text', value: '01234' }],
        },
      ]);
    });

    it('applies callbacks ', () => {
      console.log = jest.fn();
      const annotationCallbacks = {
        onClick: console.log,
        onMouseEnter: console.log,
      };
      const annotatedNode = getAnnotatedNodes(
        [
          {
            annotations: [{ id: 'a', start: 0, end: 3 }],
            value: '01234',
          },
        ],
        annotationCallbacks,
      )[0];
      expect(annotatedNode.properties.onClick).toBeInstanceOf(Function);
      expect(annotatedNode.properties.onMouseEnter).toBeInstanceOf(Function);
      expect(annotatedNode.properties.onMouseOut).toEqual(undefined);

      annotatedNode.properties.onClick();
      expect(console.log).toBeCalledWith(
        { id: 'a', start: 0, end: 3 },
        undefined,
      );
      annotatedNode.properties.onMouseEnter();
      expect(console.log).toBeCalledWith(
        { id: 'a', start: 0, end: 3 },
        undefined,
      );
    });
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
