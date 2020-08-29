export default function parser(doc, options = {}) {
  if (!doc) {
    return {
      type: 'root',
      children: [],
    };
  }

  const lines = doc.split(/\n/g);
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
      offset: doc.length,
    },
  };

  const code = {
    type: 'element',
    tagName: 'code',
    position,
    children: [
      {
        type: 'text',
        value: doc,
        position,
      },
    ],
  };

  const { language } = options;
  if (language) {
    code.properties = {
      className: `language-${language}`,
    };
  }

  return {
    type: 'root',
    children: [
      {
        type: 'element',
        tagName: 'pre',
        position,
        children: [code],
      },
    ],
    position,
  };
}
