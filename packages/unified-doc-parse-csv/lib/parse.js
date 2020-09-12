import parser from './parser';

export default function parse(options) {
  this.Parser = function (doc) {
    return parser(doc, options);
  };
}
