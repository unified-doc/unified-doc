import parser from '../lib/parser';
import { array, object } from './fixtures';

function getPosition(json) {
  const lines = json.match(/\n/g);
  let endColumn = json.length + 1;
  let endLine = 1;
  if (lines) {
    endColumn = lines[lines.length - 1].length + 1;
    endLine = lines.length + 1;
  }
  return {
    start: {
      column: 1,
      line: 1,
      offset: 0,
    },
    end: {
      column: endColumn,
      line: endLine,
      offset: json.length,
    },
  };
}

describe(parser, () => {
  it('should parse empty content to empty trees', () => {
    expect(parser()).toEqual({
      type: 'root',
      children: [],
    });
  });

  it('should parse invalid JSON content to empty trees', () => {
    expect(parser('this is not valid json')).toEqual({
      type: 'root',
      children: [],
    });
    expect(parser('["not valid either", undefined, 2]')).toEqual({
      type: 'root',
      children: [],
    });
  });

  it('should parse JSON into a single pre node', () => {
    const json1 = JSON.stringify([]);
    expect(parser(json1)).toEqual({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'text',
              value: json1,
              position: getPosition(json1),
            },
          ],
          position: getPosition(json1),
        },
      ],
      position: getPosition(json1),
    });

    const json2 = JSON.stringify({});
    expect(parser(json2)).toEqual({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'text',
              value: json2,
              position: getPosition(json2),
            },
          ],
          position: getPosition(json2),
        },
      ],
      position: getPosition(json2),
    });

    const json3 = JSON.stringify(array);
    expect(parser(json3)).toEqual({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'text',
              value: json3,
              position: getPosition(json3),
            },
          ],
          position: getPosition(json3),
        },
      ],
      position: getPosition(json3),
    });

    const json4 = JSON.stringify(object);
    expect(parser(json4)).toEqual({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'text',
              value: json4,
              position: getPosition(json4),
            },
          ],
          position: getPosition(json4),
        },
      ],
      position: getPosition(json4),
    });

    const json5 = JSON.stringify(array, null, 2);
    expect(parser(json5)).toEqual({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'text',
              value: json5,
              position: getPosition(json5),
            },
          ],
          position: getPosition(json5),
        },
      ],
      position: getPosition(json5),
    });

    const json6 = JSON.stringify(object, null, 2);
    expect(parser(json6)).toEqual({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'text',
              value: json6,
              position: getPosition(json6),
            },
          ],
          position: getPosition(json6),
        },
      ],
      position: getPosition(json6),
    });
  });

  it('should indent with spaces if specified', () => {
    const indent0 = JSON.stringify(object);
    const indent2 = JSON.stringify(object, null, 2);
    const indent4 = JSON.stringify(object, null, 4);
    expect(parser(indent0, { space: 4 })).toEqual({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'text',
              value: indent4,
              position: getPosition(indent4),
            },
          ],
          position: getPosition(indent4),
        },
      ],
      position: getPosition(indent4),
    });
    expect(parser(indent4, { space: 2 })).toEqual({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'text',
              value: indent2,
              position: getPosition(indent2),
            },
          ],
          position: getPosition(indent2),
        },
      ],
      position: getPosition(indent2),
    });
    expect(parser(indent4, { space: 0 })).toEqual({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'text',
              value: indent0,
              position: getPosition(indent0),
            },
          ],
          position: getPosition(indent0),
        },
      ],
      position: getPosition(indent0),
    });
  });

  it('should apply classnames to pre node', () => {
    const json = JSON.stringify(object);
    expect(parser(json, { classNames: ['class-a', 'class-b'] })).toEqual({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'text',
              value: json,
              position: getPosition(json),
            },
          ],
          position: getPosition(json),
          properties: {
            className: ['class-a', 'class-b'],
          },
        },
      ],
      position: getPosition(json),
    });
  });
});
