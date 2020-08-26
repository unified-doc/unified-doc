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
    const position1 = getPosition(json1);
    expect(parser(json1)).toEqual({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'element',
              tagName: 'code',
              children: [
                {
                  type: 'text',
                  value: json1,
                  position: position1,
                },
              ],
              position: position1,
            },
          ],
          position: position1,
        },
      ],
      position: position1,
    });

    const json2 = JSON.stringify({});
    const position2 = getPosition(json2);
    expect(parser(json2)).toEqual({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'element',
              tagName: 'code',
              children: [
                {
                  type: 'text',
                  value: json2,
                  position: position2,
                },
              ],
              position: position2,
            },
          ],
          position: position2,
        },
      ],
      position: position2,
    });

    const json3 = JSON.stringify(array);
    const position3 = getPosition(json3);
    expect(parser(json3)).toEqual({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'element',
              tagName: 'code',
              children: [
                {
                  type: 'text',
                  value: json3,
                  position: position3,
                },
              ],
              position: position3,
            },
          ],
          position: position3,
        },
      ],
      position: position3,
    });

    const json4 = JSON.stringify(object);
    const position4 = getPosition(json4);
    expect(parser(json4)).toEqual({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'element',
              tagName: 'code',
              children: [
                {
                  type: 'text',
                  value: json4,
                  position: position4,
                },
              ],
              position: position4,
            },
          ],
          position: position4,
        },
      ],
      position: position4,
    });

    const json5 = JSON.stringify(array, null, 2);
    const position5 = getPosition(json5);
    expect(parser(json5)).toEqual({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'element',
              tagName: 'code',
              children: [
                {
                  type: 'text',
                  value: json5,
                  position: position5,
                },
              ],
              position: position5,
            },
          ],
          position: position5,
        },
      ],
      position: position5,
    });

    const json6 = JSON.stringify(object, null, 2);
    const position6 = getPosition(json6);
    expect(parser(json6)).toEqual({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'element',
              tagName: 'code',
              children: [
                {
                  type: 'text',
                  value: json6,
                  position: position6,
                },
              ],
              position: position6,
            },
          ],
          position: position6,
        },
      ],
      position: position6,
    });
  });

  it('should indent with spaces if specified', () => {
    const indent0 = JSON.stringify(object);
    const indent2 = JSON.stringify(object, null, 2);
    const indent4 = JSON.stringify(object, null, 4);
    const position0 = getPosition(indent0);
    const position2 = getPosition(indent2);
    const position4 = getPosition(indent4);
    expect(parser(indent0, { space: 4 })).toEqual({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'element',
              tagName: 'code',
              children: [
                {
                  type: 'text',
                  value: indent4,
                  position: position4,
                },
              ],
              position: position4,
            },
          ],
          position: position4,
        },
      ],
      position: position4,
    });
    expect(parser(indent4, { space: 2 })).toEqual({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'element',
              tagName: 'code',
              children: [
                {
                  type: 'text',
                  value: indent2,
                  position: position2,
                },
              ],
              position: position2,
            },
          ],
          position: position2,
        },
      ],
      position: position2,
    });
    expect(parser(indent4, { space: 0 })).toEqual({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'element',
              tagName: 'code',
              children: [
                {
                  type: 'text',
                  value: indent0,
                  position: position0,
                },
              ],
              position: position0,
            },
          ],
          position: position0,
        },
      ],
      position: position0,
    });
  });

  it('should apply classnames to pre node', () => {
    const json = JSON.stringify(object);
    const position = getPosition(json);
    expect(parser(json, { classNames: ['class-a', 'class-b'] })).toEqual({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'pre',
          children: [
            {
              type: 'element',
              tagName: 'code',
              children: [
                {
                  type: 'text',
                  value: json,
                  position,
                },
              ],
              position,
              properties: {
                className: ['class-a', 'class-b'],
              },
            },
          ],
          position,
        },
      ],
      position,
    });
  });
});
