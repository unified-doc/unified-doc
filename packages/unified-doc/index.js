import { saveAs } from 'file-saver';

import { saveTypes } from './lib/enums';
import { getContent } from './lib/file';
import { createProcessor } from './lib/processor';

export { saveTypes };

export default class Doc {
  constructor(file, compiler, options = {}) {
    this.content = null;
    this.file = file;
    this.options = options;
    this.processor = createProcessor(this.file, compiler, this.options);
  }

  async initialize() {
    this.content = await getContent(this.file);
  }

  compile() {
    return this.processor.processSync(this.content);
  }

  parse() {
    return this.processor.parse(this.content);
  }

  save(type) {
    switch (type) {
      case saveTypes.HAST: {
        const hast = this.parse();
        saveAs(new File([JSON.stringify(hast, null, 2)], this.file.name));
      }
      case saveTypes.HTML:
      case saveTypes.FILE:
      default: {
        saveAs(this.file);
      }
    }
  }

  // Future APIs
  annotate(annotations) {
    return [];
  }

  search(query) {
    return [];
  }
}
