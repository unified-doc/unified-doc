import fromCsv from 'tdast-util-from-csv';
import toHastTable from 'tdast-util-to-hast-table';

export default function parser(doc, options = {}) {
  if (!doc) {
    return {
      type: 'element',
      tagName: 'table',
      children: [],
      properties: {},
    };
  }

  return toHastTable(fromCsv(doc, options));
}
