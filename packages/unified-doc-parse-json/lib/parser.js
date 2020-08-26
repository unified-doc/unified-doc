export default function parser(doc, options = {}) {
  if (!doc) {
    return {
      type: 'root',
      children: [],
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(doc);
  } catch {
    return {
      type: 'root',
      children: [],
    };
  }

  const { classNames, space } = options;
  const value = space === undefined ? doc : JSON.stringify(parsed, null, space);

  const lines = value.split(/\n/g);
  const lastLine = lines[lines.length - 1];

  const position = {
    start: {
      column: 1,
      line: 1,
      offset: 0,
    },
    end: {
      column: lastLine.length + 1,
      line: lines.length,
      offset: value.length,
    },
  };

  const hast = {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'pre',
        position,
        children: [
          {
            type: 'text',
            value,
            position,
          },
        ],
      },
    ],
    position,
  };

  if (classNames) {
    hast.children[0].properties = {
      className: classNames,
    };
  }

  return hast;
}
